from typing import Optional
from fastapi import APIRouter
from app.api.deps import SessionDataManager
from app.ai.gemini_client import GeminiOrchestrator
from app.models.schemas import InvestigateQueryRequest, InvestigateQueryResponse

router = APIRouter()
orchestrator = GeminiOrchestrator()

@router.post("/query", response_model=InvestigateQueryResponse)
async def submit_investigation_query(req: InvestigateQueryRequest):
    workspace_id = req.workspace_id or "ws_default"
    df = SessionDataManager.get_dataframe(workspace_id)

    # Retrieve active filters from previous node in this investigation trail
    active_filters = {}
    inv_id = req.investigation_id or "inv_default"
    existing_nodes = SessionDataManager.get_evidence_nodes(workspace_id, inv_id)
    if existing_nodes:
        target_node = next((n for n in existing_nodes if n.node_id == req.parent_node_id), existing_nodes[-1])
        if target_node.lineage and target_node.lineage.parameters:
            active_filters = dict(target_node.lineage.parameters.get("filters", {}))

    # Process conversational turn
    node, answerability, updated_filters = orchestrator.process_investigation_turn(
        df=df,
        user_question=req.question,
        active_filters=active_filters,
        investigation_id=req.investigation_id,
        parent_node_id=req.parent_node_id
    )

    # Store node in session data manager
    SessionDataManager.add_evidence_node(workspace_id, node)

    # Fetch full node trail for this investigation
    all_nodes = SessionDataManager.get_evidence_nodes(workspace_id, node.investigation_id)
    history = [
        {"node_id": n.node_id, "question": n.user_question, "epistemic_tag": n.epistemic_status.value}
        for n in all_nodes
    ]

    return InvestigateQueryResponse(
        investigation_id=node.investigation_id,
        answerability=answerability,
        node=node,
        active_filters=updated_filters,
        conversation_history=history
    )

@router.get("/tree")
async def get_investigation_tree(investigation_id: Optional[str] = None):
    workspace_id = "ws_default"
    nodes = SessionDataManager.get_evidence_nodes(workspace_id, investigation_id)
    return {"workspace_id": workspace_id, "nodes": nodes}
