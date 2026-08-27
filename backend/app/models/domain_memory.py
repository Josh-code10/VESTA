from enum import Enum
from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class MemoryStatus(str, Enum):
    OPEN = "Open"
    MONITORING = "Monitoring"
    IMPROVED = "Improved"
    RESOLVED = "Resolved"
    ESCALATED = "Escalated"

class MemoryFinding(BaseModel):
    facts: List[str] = Field(default_factory=list)
    observations: List[str] = Field(default_factory=list)
    evidence_references: List[str] = Field(default_factory=list)
    confidence_level: str = "HIGH"

class ExecutiveMemory(BaseModel):
    memory_id: str
    investigation_id: str
    title: str
    created_at: str
    updated_at: str
    business_driver: str  # 'Finance' | 'Sales' | 'Customer' | 'Operations' | 'Marketing'
    trigger_issue_id: Optional[str] = None
    status: MemoryStatus = MemoryStatus.OPEN
    
    # 4-Part Structure
    investigation: str
    finding: MemoryFinding
    management_decision: str
    followup_question: str
    
    # Restorable Workspace State
    restorable_state: Optional[Dict[str, Any]] = None
