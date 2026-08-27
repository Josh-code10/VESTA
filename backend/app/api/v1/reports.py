from fastapi import APIRouter
from app.api.deps import SessionDataManager
from app.engines.report_engine import ReportEngine
from app.models.schemas import GenerateReportRequest, GenerateReportResponse

router = APIRouter()

@router.post("/generate", response_model=GenerateReportResponse)
async def generate_executive_report(req: GenerateReportRequest):
    workspace_id = req.workspace_id or "ws_default"
    nodes = SessionDataManager.get_evidence_nodes(workspace_id, req.investigation_id)

    # Filter by selected node IDs if provided
    if req.selected_node_ids:
        nodes = [n for n in nodes if n.node_id in req.selected_node_ids]

    data_dict = SessionDataManager.get_dictionary(workspace_id)
    workspace_title = data_dict.title if data_dict else "NexaSphere Retail Ltd."

    report = ReportEngine.generate_report(
        nodes=nodes,
        report_title=req.report_title or "Executive Briefing: Root-Cause Investigation",
        workspace_name=workspace_title
    )

    return report
