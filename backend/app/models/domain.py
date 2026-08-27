from enum import Enum
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field
from datetime import datetime

class EpistemicTag(str, Enum):
    FACT = "FACT"
    OBSERVATION = "OBSERVATION"
    INFERENCE = "INFERENCE"
    HYPOTHESIS = "HYPOTHESIS"
    UNKNOWN = "UNKNOWN"

class AnswerabilityStatus(str, Enum):
    ANSWERABLE = "ANSWERABLE"
    PARTIALLY_ANSWERABLE = "PARTIALLY_ANSWERABLE"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"
    AMBIGUOUS = "AMBIGUOUS"

class KPIStatus(str, Enum):
    HEALTHY = "HEALTHY"       # Green (80-100)
    WARNING = "WARNING"       # Yellow (55-79)
    CRITICAL = "CRITICAL"     # Red (0-54)

class ExecutiveHealthStatus(str, Enum):
    EXCELLENT = "EXCELLENT"                                     # 90-100
    HEALTHY = "HEALTHY"                                         # 80-89
    NEEDS_ATTENTION = "NEEDS_ATTENTION"                         # 70-79
    AT_RISK = "AT_RISK"                                         # 55-69
    CRITICAL_ATTENTION_REQUIRED = "CRITICAL_ATTENTION_REQUIRED" # 0-54
    UNAVAILABLE = "UNAVAILABLE"                                 # Data missing

class HealthCalculationState(str, Enum):
    CALCULATED = "CALCULATED"                     # Full dataset capability coverage
    PARTIALLY_CALCULATED = "PARTIALLY_CALCULATED" # Some capabilities missing
    UNAVAILABLE = "UNAVAILABLE"                   # Key measures missing / unable to calculate

class ConfidenceLevel(str, Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LIMITED = "LIMITED"

class KPIDirectionality(str, Enum):
    HIGHER_IS_BETTER = "HIGHER_IS_BETTER"
    LOWER_IS_BETTER = "LOWER_IS_BETTER"
    TARGET_RANGE = "TARGET_RANGE"

class SyncStatus(str, Enum):
    READY = "READY"
    SYNCING = "SYNCING"
    UPDATED = "UPDATED"
    ERROR = "ERROR"

class ColumnRole(str, Enum):
    MEASURE = "MEASURE"
    DIMENSION = "DIMENSION"
    DATE = "DATE"
    IDENTIFIER = "IDENTIFIER"
    TEXT = "TEXT"

class ColumnProfile(BaseModel):
    name: str
    inferred_type: str        # 'numeric', 'currency', 'datetime', 'category', 'text', 'id'
    role: ColumnRole
    null_count: int = 0
    null_pct: float = 0.0
    distinct_count: int = 0
    is_ambiguous: bool = False
    ambiguity_reason: Optional[str] = None
    sample_values: List[Any] = Field(default_factory=list)

class DataDictionary(BaseModel):
    title: str = "Connected Business Dataset"
    row_count: int = 0
    column_count: int = 0
    columns: Dict[str, ColumnProfile] = Field(default_factory=dict)
    capabilities_detected: List[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class LineageObject(BaseModel):
    tool_executed: str
    parameters: Dict[str, Any] = Field(default_factory=dict)
    formula_breadcrumb: str
    analytical_result_id: str
    evidence_artifact_ids: List[str] = Field(default_factory=list)
    confidence_level: str = "HIGH"  # HIGH | MEDIUM | LOW

class ActiveKPI(BaseModel):
    kpi_id: str
    name: str
    category: str             # 'Financial', 'Commercial', 'Operations', 'Customer', 'Marketing'
    current_value: float
    previous_value: Optional[float] = None
    target_value: Optional[float] = None
    variance_pct: Optional[float] = None
    metric_score: float       # 0.0 to 100.0
    weight_pct: float         # e.g. 25.0
    points_contributed: float # weight_pct * (metric_score / 100)
    drag_points: float        # weight_pct * ((100 - metric_score) / 100)
    status: KPIStatus
    executive_status: ExecutiveHealthStatus = ExecutiveHealthStatus.HEALTHY
    directionality: KPIDirectionality = KPIDirectionality.HIGHER_IS_BETTER
    formula_breadcrumb: str
    is_available: bool = True
    missing_fields: List[str] = Field(default_factory=list)

class HealthScoreBreakdown(BaseModel):
    overall_score: Optional[float] = None  # 0.0 to 100.0 or None if UNAVAILABLE
    status: KPIStatus = KPIStatus.HEALTHY
    executive_status: ExecutiveHealthStatus = ExecutiveHealthStatus.HEALTHY
    calculation_state: HealthCalculationState = HealthCalculationState.CALCULATED
    confidence_level: ConfidenceLevel = ConfidenceLevel.HIGH
    confidence_reason: str = "High confidence: Computed deterministically across verified transactions with zero interpolation."
    largest_positive_contributor: Optional[Dict[str, Any]] = None
    largest_negative_contributor: Optional[Dict[str, Any]] = None
    previous_score: Optional[float] = None
    active_kpi_count: int = 0
    contributions: List[ActiveKPI] = Field(default_factory=list)
    readiness_notes: Optional[Dict[str, Any]] = None
    calculated_at: datetime = Field(default_factory=datetime.utcnow)

class HealthIssue(BaseModel):
    issue_id: str
    title: str
    kpi_id: str
    severity: str             # 'CRITICAL' | 'WARNING'
    component_scores: Dict[str, float] = Field(default_factory=dict)
    component_availability: Dict[str, bool] = Field(default_factory=dict)
    normalized_priority_score: float
    ranking_reason: str
    financial_impact_label: str
    current_value: float
    baseline_target: Optional[float] = None
    variance_pct: float
    primary_driver: str
    detected_at: datetime = Field(default_factory=datetime.utcnow)

class BusinessStoryline(BaseModel):
    overall_status: str
    biggest_win: str
    biggest_risk: str
    next_actions: List[str] = Field(default_factory=list)
    reading_time_seconds: int = 35
    executive_narrative: Optional[str] = None
    channel_highlights: List[Dict[str, Any]] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class MetricHighlight(BaseModel):
    label: str
    value: str
    sublabel: Optional[str] = None
    benchmark: Optional[str] = None
    status: Optional[str] = None # 'positive' | 'negative' | 'warning' | 'neutral'

class StructuredExecutiveInsight(BaseModel):
    headline: str
    executive_summary: str
    metric_highlight: Optional[MetricHighlight] = None
    why_it_matters: Optional[str] = None
    what_is_known: List[str] = Field(default_factory=list)
    what_data_does_not_tell_us: Optional[str] = None
    suggested_investigations: List[str] = Field(default_factory=list)
    practical_recommendations: List[str] = Field(default_factory=list)
    humanized_fields: Dict[str, str] = Field(default_factory=dict)
    is_conceptual: bool = False
    intent_type: Optional[str] = None
    knowledge_concept: Optional[Dict[str, Any]] = None
    five_artifact_response: Optional[Dict[str, Any]] = None

class EvidenceNode(BaseModel):
    node_id: str
    investigation_id: str
    parent_node_id: Optional[str] = None
    user_question: str
    executive_finding: str
    insight: Optional[StructuredExecutiveInsight] = None
    epistemic_status: EpistemicTag
    lineage: LineageObject
    evidence_chart_type: str = "bar" # bar, horizontal_bar, line, contribution, waterfall, table
    evidence_data: Dict[str, Any] = Field(default_factory=dict)
    limitations: Optional[Dict[str, List[str]]] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ExecutiveIntelligence(BaseModel):
    """
    Unified Single Source of Truth for all Homepage Modules.
    Guarantee: Storyline, Health Score, Top Issues, and Business Drivers
    are all deterministically derived from this shared object.
    """
    health_score: HealthScoreBreakdown
    business_storyline: BusinessStoryline
    top_3_issues: List[HealthIssue]
    view_more_issues: List[HealthIssue]
    business_drivers: List[ActiveKPI]
    available_categories: List[str]
    available_kpi_catalog: List[Dict[str, Any]]
    created_at: datetime = Field(default_factory=datetime.utcnow)
