export type EpistemicTag = 'FACT' | 'OBSERVATION' | 'INFERENCE' | 'HYPOTHESIS' | 'UNKNOWN';

export type AnswerabilityStatus = 'ANSWERABLE' | 'PARTIALLY_ANSWERABLE' | 'INSUFFICIENT_DATA' | 'AMBIGUOUS';

export type KPIStatus = 'HEALTHY' | 'WARNING' | 'CRITICAL';

export type ExecutiveHealthStatus = 'EXCELLENT' | 'HEALTHY' | 'NEEDS_ATTENTION' | 'AT_RISK' | 'CRITICAL_ATTENTION_REQUIRED' | 'UNAVAILABLE';

export type HealthCalculationState = 'CALCULATED' | 'PARTIALLY_CALCULATED' | 'UNAVAILABLE';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LIMITED';

export type SyncStatus = 'READY' | 'SYNCING' | 'UPDATED' | 'ERROR';

export interface ColumnProfile {
  name: string;
  inferred_type: string;
  role: 'MEASURE' | 'DIMENSION' | 'DATE' | 'IDENTIFIER' | 'TEXT';
  null_count: number;
  null_pct: number;
  distinct_count: number;
  is_ambiguous: boolean;
  ambiguity_reason?: string;
  sample_values: any[];
}

export interface DataDictionary {
  title: string;
  row_count: number;
  column_count: number;
  columns: Record<string, ColumnProfile>;
  capabilities_detected: string[];
  created_at: string;
}

export interface LineageObject {
  tool_executed: string;
  parameters: Record<string, any>;
  formula_breadcrumb: string;
  analytical_result_id: string;
  evidence_artifact_ids: string[];
  confidence_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ActiveKPI {
  kpi_id: string;
  name: string;
  category: string;
  current_value: number;
  previous_value?: number;
  target_value?: number;
  variance_pct?: number;
  metric_score: number;
  weight_pct: number;
  points_contributed: number;
  drag_points: number;
  status: KPIStatus;
  executive_status?: ExecutiveHealthStatus;
  directionality: string;
  formula_breadcrumb: string;
  is_available: boolean;
  missing_fields: string[];
}

export interface HealthScoreBreakdown {
  overall_score: number | null;
  status: KPIStatus;
  executive_status: ExecutiveHealthStatus;
  calculation_state: HealthCalculationState;
  confidence_level: ConfidenceLevel;
  confidence_reason: string;
  largest_positive_contributor?: {
    name: string;
    kpi_id: string;
    points: number;
    current_value: number;
  } | null;
  largest_negative_contributor?: {
    name: string;
    kpi_id: string;
    drag: number;
    current_value: number;
  } | null;
  previous_score?: number | null;
  active_kpi_count: number;
  contributions: ActiveKPI[];
  readiness_notes?: {
    status: string;
    reason: string;
    action: string;
  } | null;
  calculated_at: string;
}

export interface HealthIssue {
  issue_id: string;
  title: string;
  kpi_id: string;
  severity: 'CRITICAL' | 'WARNING';
  component_scores: Record<string, number>;
  component_availability: Record<string, boolean>;
  normalized_priority_score: number;
  ranking_reason: string;
  financial_impact_label: string;
  current_value: number;
  baseline_target?: number;
  variance_pct: number;
  primary_driver: string;
  detected_at: string;
}

export interface BusinessStoryline {
  overall_status: string;
  biggest_win: string;
  biggest_risk: string;
  next_actions: string[];
  reading_time_seconds: number;
  executive_narrative?: string;
  channel_highlights?: Array<{ label: string; value: string; detail?: string }>;
  generated_at: string;
}

export interface MetricHighlight {
  label: string;
  value: string;
  sublabel?: string;
  benchmark?: string;
  status?: 'positive' | 'negative' | 'warning' | 'neutral';
}

export interface SmartAnnotation {
  annotation_type: string;
  label: string;
  target_value?: number;
  target_key?: string;
}

export interface VisualizationSpec {
  analysis_type: string;
  primary_chart: string;
  secondary_chart?: string;
  annotations: SmartAnnotation[];
  pivot_required: boolean;
  pivot_dimensions: string[];
  rationale?: string;
}

export interface StructuredImplication {
  why_care: string;
  business_impact: string;
  attention_areas: string;
}

export interface AnalysisPlanStep {
  step: string;
  status: 'COMPLETED' | 'UNAVAILABLE' | 'RUNNING';
}

export interface FiveArtifactResponse {
  executive_answer: string;
  visualization_spec: VisualizationSpec;
  pivot_table?: Record<string, any>;
  business_insight: string;
  business_implication: string;
  structured_implication?: StructuredImplication;
  draft_decision?: string;
  management_attention?: string;
  analysis_plan?: AnalysisPlanStep[];
  limitations?: string[];
  confidence_level?: string;
}

export interface StructuredExecutiveInsight {
  headline: string;
  executive_summary: string;
  metric_highlight?: MetricHighlight;
  why_it_matters?: string;
  what_is_known: string[];
  what_data_does_not_tell_us?: string;
  suggested_investigations: string[];
  practical_recommendations?: string[];
  humanized_fields?: Record<string, string>;
  is_conceptual?: boolean;
  intent_type?: string;
  knowledge_concept?: Record<string, any>;
  five_artifact_response?: FiveArtifactResponse;
}

export interface EvidenceNode {
  node_id: string;
  investigation_id: string;
  parent_node_id?: string;
  user_question: string;
  executive_finding: string;
  insight?: StructuredExecutiveInsight;
  epistemic_status: EpistemicTag;
  lineage: LineageObject;
  evidence_chart_type: string;
  evidence_data: Record<string, any>;
  limitations?: {
    available?: string[];
    missing?: string[];
    investigable_alternatives?: string[];
  };
  created_at: string;
}

export interface ExecutiveIntelligence {
  health_score: HealthScoreBreakdown;
  business_storyline: BusinessStoryline;
  top_3_issues: HealthIssue[];
  view_more_issues: HealthIssue[];
  business_drivers: ActiveKPI[];
  available_categories: string[];
  available_kpi_catalog: Array<{
    kpi_id: string;
    name: string;
    category: string;
    is_available: boolean;
    description: string;
    missing_fields: string[];
  }>;
}

export type MemoryStatus = 'Open' | 'Monitoring' | 'Improved' | 'Resolved' | 'Escalated';

export interface MemoryFinding {
  facts: string[];
  observations: string[];
  evidence_references: string[];
  confidence_level: string;
}

export interface ExecutiveMemory {
  memory_id: string;
  investigation_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  business_driver: string;
  trigger_issue_id?: string;
  status: MemoryStatus;
  investigation: string;
  finding: MemoryFinding;
  management_decision: string;
  followup_question: string;
  restorable_state?: Record<string, any>;
}

export interface HealthDashboardResponse {
  workspace_id: string;
  dataset_title: string;
  row_count: number;
  column_count: number;
  last_synced_at: string;
  sync_status: SyncStatus;
  business_storyline: BusinessStoryline;
  health_score: HealthScoreBreakdown;
  top_3_issues: HealthIssue[];
  view_more_issues: HealthIssue[];
  kpis: ActiveKPI[];
  available_categories: string[];
  available_kpi_catalog: Array<{
    kpi_id: string;
    name: string;
    category: string;
    is_available: boolean;
    description: string;
    missing_fields: string[];
  }>;
  executive_intelligence?: ExecutiveIntelligence;
}

export interface InvestigateQueryResponse {
  investigation_id: string;
  answerability: AnswerabilityStatus;
  node: EvidenceNode;
  active_filters: Record<string, any>;
  conversation_history: Array<{
    node_id: string;
    question: string;
    epistemic_tag: string;
  }>;
}

export interface ReportFindingItem {
  title: string;
  epistemic_tag: string;
  finding_text: string;
  formula_breadcrumb?: string;
  chart_type?: string;
  chart_data?: Record<string, any>;
}

export interface GenerateReportResponse {
  report_id: string;
  title: string;
  generated_at: string;
  executive_summary: string;
  primary_investigation_question: string;
  key_findings: ReportFindingItem[];
  data_limitations: string[];
  recommended_next_steps: string[];
  markdown_content: string;
}
