from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from app.models.domain import (
    ActiveKPI,
    AnswerabilityStatus,
    BusinessStoryline,
    DataDictionary,
    EvidenceNode,
    ExecutiveIntelligence,
    HealthIssue,
    HealthScoreBreakdown,
    SyncStatus
)

class ConnectSheetRequest(BaseModel):
    sheet_url: Optional[str] = None
    preset_id: Optional[str] = None
    access_token: Optional[str] = None

class ConnectSheetResponse(BaseModel):
    status: str = "ready"
    workspace_id: str
    dataset_title: str
    row_count: int
    column_count: int
    data_dictionary: DataDictionary
    message: str = "Dataset successfully connected and profiled."

class RefreshDataResponse(BaseModel):
    status: str = "success"
    sync_status: SyncStatus
    last_synced_at: datetime
    row_count: Optional[int] = None
    column_count: Optional[int] = None
    dataset_title: Optional[str] = None
    message: str = "Dataset successfully re-synchronized and health metrics updated."

class HealthDashboardResponse(BaseModel):
    workspace_id: str
    dataset_title: str
    row_count: int = 0
    column_count: int = 0
    last_synced_at: datetime
    sync_status: SyncStatus
    business_storyline: BusinessStoryline
    health_score: HealthScoreBreakdown
    top_3_issues: List[HealthIssue]
    view_more_issues: List[HealthIssue]
    kpis: List[ActiveKPI]
    available_categories: List[str] = Field(default_factory=list)
    available_kpi_catalog: List[Dict[str, Any]]
    executive_intelligence: Optional[ExecutiveIntelligence] = None

class UpdateKPIConfigRequest(BaseModel):
    kpi_id: str
    target_value: Optional[float] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None
    comparison_period: Optional[str] = "MoM" # MoM | QoQ | YoY | Target

class InvestigateQueryRequest(BaseModel):
    workspace_id: str = "ws_default"
    investigation_id: Optional[str] = None
    parent_node_id: Optional[str] = None
    question: str

class InvestigateQueryResponse(BaseModel):
    investigation_id: str
    answerability: AnswerabilityStatus
    node: EvidenceNode
    active_filters: Dict[str, Any] = Field(default_factory=dict)
    conversation_history: List[Dict[str, Any]] = Field(default_factory=list)

class GenerateReportRequest(BaseModel):
    workspace_id: str = "ws_default"
    investigation_id: str
    selected_node_ids: Optional[List[str]] = None
    report_title: Optional[str] = None

class ReportFindingItem(BaseModel):
    title: str
    epistemic_tag: str
    finding_text: str
    formula_breadcrumb: Optional[str] = None
    chart_type: Optional[str] = None
    chart_data: Optional[Dict[str, Any]] = None

class GenerateReportResponse(BaseModel):
    report_id: str
    title: str
    generated_at: datetime
    executive_summary: str
    primary_investigation_question: str
    key_findings: List[ReportFindingItem]
    data_limitations: List[str]
    recommended_next_steps: List[str]
    markdown_content: str
