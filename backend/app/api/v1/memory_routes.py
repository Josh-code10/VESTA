from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.engines.memory_engine import MemoryEngine
from app.models.domain_memory import ExecutiveMemory, MemoryStatus

router = APIRouter(tags=["Executive Decision Memory"])

class CreateMemoryRequest(BaseModel):
    investigation_id: str
    title: str
    business_driver: str
    investigation_question: str
    finding_facts: List[str]
    finding_observations: List[str]
    management_decision: str
    followup_question: str
    trigger_issue_id: Optional[str] = None
    restorable_state: Optional[Dict[str, Any]] = None

class UpdateStatusRequest(BaseModel):
    status: MemoryStatus

@router.get("/list", response_model=List[ExecutiveMemory])
async def list_memories():
    return MemoryEngine.get_all_memories()

@router.post("/create", response_model=ExecutiveMemory)
async def create_memory(req: CreateMemoryRequest):
    return MemoryEngine.create_memory(
        investigation_id=req.investigation_id,
        title=req.title,
        business_driver=req.business_driver,
        investigation_question=req.investigation_question,
        finding_facts=req.finding_facts,
        finding_observations=req.finding_observations,
        management_decision=req.management_decision,
        followup_question=req.followup_question,
        trigger_issue_id=req.trigger_issue_id,
        restorable_state=req.restorable_state
    )

@router.patch("/{memory_id}/status", response_model=ExecutiveMemory)
async def update_memory_status(memory_id: str, req: UpdateStatusRequest):
    updated = MemoryEngine.update_status(memory_id, req.status)
    if not updated:
        raise HTTPException(status_code=404, detail="Executive Memory record not found")
    return updated
