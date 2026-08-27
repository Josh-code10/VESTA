# VESTA — Data Model Specification

> **Data Architecture, Entity Schemas & Analytical Contracts**  
> *Target Persistence: Google Cloud Firestore & In-Memory Analytical Session Cache*

---

## 1. Data Model Philosophy & Tiered Separation

To guarantee mathematical truth and eliminate AI hallucination, VESTA enforces a strict architectural boundary across four data tiers:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TIER 1: RAW SOURCE DATA                            │
│  Location: Google Sheets (Spreadsheet ID, Sheet Tabs, Range Data)           │
│  Role: Immutable external business source of truth. Read-only.              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                 TIER 2: NORMALISED ANALYTICAL DATA (CACHE)                  │
│  Location: In-Memory Pandas DataFrames / Session Parquet Cache              │
│  Role: Type-coerced, sanitized numeric & date arrays for execution.         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                  TIER 3: DETERMINISTIC ANALYTICAL RESULTS                   │
│  Location: Structured JSON Contracts (Result ID, Figures, Tables, Charts)   │
│  Role: The ONLY source of mathematical truth for figures and calculations.  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│               TIER 4: APPLICATION METADATA & AI INTERPRETATION              │
│  Location: Firebase Firestore Documents (KPIs, Chats, Epistemic Tags)       │
│  Role: State persistence, conversational flow, user preferences, reports.   │
│  CRITICAL RULE: AI text never mutates or overrides Tier 3 numbers.          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Persisted Firestore Collections (MVP Scope)

In VISON MVP, **Business Health metrics and Top 3 Issues are computed on demand / on refresh directly from the connected Google Sheet data and session cache**. They are not stored as immutable historical snapshots in Firestore.

Persisted Firestore collections are strictly limited to the following 5 functional domains:
1. **Workspace Settings & Data Source** (`workspaces`, `data_sources`)
2. **Data Dictionary** (`data_dictionaries`)
3. **KPI Configuration** (`kpi_configurations`)
4. **Investigations & Conversation Logs** (`investigations`, `investigation_messages`, `analytical_results`)
5. **Executive Reports** (`reports`)

---

### 2.1 `workspaces` Collection
Represents the organizational container for a business (e.g., NexaSphere Retail Ltd.).

```json
{
  "workspace_id": "ws_nexasphere_001",
  "name": "NexaSphere Retail Ltd.",
  "owner_user_id": "usr_google_10928392",
  "created_at": "2026-08-24T00:00:00Z",
  "updated_at": "2026-08-24T00:00:00Z",
  "active_data_source_id": "src_gsheet_789123",
  "settings": {
    "currency_symbol": "₦",
    "fiscal_year_start_month": 1,
    "default_comparison_period": "MoM"
  }
}
```

---

### 2.2 `data_sources` Collection
Metadata describing the connected Google Sheet.

```json
{
  "source_id": "src_gsheet_789123",
  "workspace_id": "ws_nexasphere_001",
  "type": "google_sheets",
  "spreadsheet_id": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
  "sheet_title": "NexaSphere_Omnichannel_Q3_2025",
  "sheet_url": "https://docs.google.com/spreadsheets/d/1BxiMVs0...",
  "selected_tab": "Transactions_Main",
  "total_rows": 24500,
  "total_columns": 18,
  "last_synced_at": "2026-08-24T00:05:00Z",
  "sync_status": "READY", // "SYNCING" | "READY" | "ERROR"
  "error_message": null
}
```

---

### 2.3 `data_dictionaries` Collection
The machine-readable semantic dictionary created during the profiling step.

```json
{
  "dictionary_id": "dict_789123",
  "source_id": "src_gsheet_789123",
  "workspace_id": "ws_nexasphere_001",
  "generated_at": "2026-08-24T00:05:05Z",
  "date_range": {
    "start_date": "2025-01-01T00:00:00Z",
    "end_date": "2025-09-30T23:59:59Z",
    "primary_date_column": "order_date"
  },
  "columns": [
    {
      "column_name": "order_date",
      "original_header": "Order Date",
      "data_type": "datetime",
      "role": "date", // "date" | "measure" | "dimension" | "identifier"
      "semantic_type": "order_timestamp",
      "null_count": 0,
      "null_pct": 0.0,
      "sample_values": ["2025-07-01", "2025-07-02", "2025-07-03"],
      "is_ambiguous": false
    },
    {
      "column_name": "revenue",
      "original_header": "Sales Amount (₦)",
      "data_type": "float64",
      "role": "measure",
      "semantic_type": "monetary_revenue",
      "null_count": 12,
      "null_pct": 0.05,
      "sample_values": [150000.0, 45000.0, 890000.0],
      "is_ambiguous": false
    },
    {
      "column_name": "cost_of_goods",
      "original_header": "COGS",
      "data_type": "float64",
      "role": "measure",
      "semantic_type": "monetary_cost",
      "null_count": 0,
      "null_pct": 0.0,
      "sample_values": [95000.0, 32000.0, 620000.0],
      "is_ambiguous": false
    },
    {
      "column_name": "region",
      "original_header": "Store Region",
      "data_type": "string",
      "role": "dimension",
      "semantic_type": "geographic_region",
      "distinct_count": 4,
      "unique_values": ["Lagos", "Abuja", "Port Harcourt", "Online Digital"],
      "null_count": 0,
      "null_pct": 0.0,
      "is_ambiguous": false
    },
    {
      "column_name": "return_flag",
      "original_header": "Is_Returned",
      "data_type": "boolean",
      "role": "measure",
      "semantic_type": "return_indicator",
      "null_count": 0,
      "null_pct": 0.0,
      "is_ambiguous": false
    },
    {
      "column_name": "discount_rate",
      "original_header": "Discount_Pct",
      "data_type": "float64",
      "role": "measure",
      "semantic_type": "discount_percentage",
      "null_count": 45,
      "null_pct": 0.18,
      "is_ambiguous": false
    }
  ],
  "missing_business_domains": [
    {
      "domain": "customer_satisfaction",
      "missing_fields": ["csat_score", "nps", "review_rating"],
      "impact": "Cannot evaluate subjective satisfaction directly; proxy return rates available."
    }
  ]
}
```

---

### 2.4 `kpi_configurations` Collection
Configurable KPI cards displayed on the Business Health dashboard.

```json
{
  "kpi_id": "kpi_gross_profit_margin",
  "workspace_id": "ws_nexasphere_001",
  "name": "Gross Profit Margin",
  "category": "FINANCIAL", // "FINANCIAL" | "SALES" | "CUSTOMER" | "OPERATIONS" | "MARKETING"
  "formula_type": "DERIVED_MARGIN",
  "calculation_spec": {
    "numerator": "gross_profit",
    "denominator": "revenue",
    "multiplier": 100.0
  },
  "target_value": 25.0,
  "unit": "%",
  "direction_favorable": "HIGHER_IS_BETTER", // "HIGHER_IS_BETTER" | "LOWER_IS_BETTER"
  "warning_threshold_pct": -5.0,
  "critical_threshold_pct": -15.0,
  "comparison_period": "MoM",
  "is_active": true,
  "display_order": 1,
  "created_at": "2026-08-24T00:05:10Z"
}
```

---

### 2.4.1 `business_storyline` (Dynamic Health Response Contract)
The structured 4-part executive narrative generated dynamically when Business Health is evaluated:

```json
{
  "overall_status": "Business performance is MODERATE with top-line growth (+12.4% MoM) offset by severe gross margin contraction.",
  "status_badge": "WARNING",
  "biggest_positive_movement": "Mobile Phones revenue in Abuja surged +34.2% MoM (₦6.8M incremental revenue, 22.0% healthy margin).",
  "biggest_risk": "Gross margin in Lagos collapsed to 14.2% (Target: 25.0%) driving an estimated ₦4.5M in profit leakage.",
  "recommended_investigations": [
    { "title": "Investigate Lagos Margin Collapse", "prompt": "Why did gross profit margin collapse in Lagos in July?" },
    { "title": "Review AC Unit Returns", "prompt": "What is driving the return surge on Inverter AC units?" }
  ],
  "bullet_count": 4,
  "estimated_reading_time_seconds": 22
}
```

---

### 2.4.2 `explainable_health_score` (Decomposable Health Score Contract)
The numerical composite score (0–100) and breakdown of contributions:

```json
{
  "composite_score": 72.0,
  "traffic_light_badge": "WARNING", // "HEALTHY" | "WARNING" | "CRITICAL"
  "badge_color": "#F59E0B",
  "summary_text": "Enterprise health is penalized primarily by Gross Profit Margin drag (-20.3 pts).",
  "contributions": [
    {
      "kpi_id": "kpi_total_revenue",
      "kpi_name": "Total Revenue",
      "weight_pct": 30.0,
      "metric_score": 95.0,
      "points_contributed": 28.5,
      "drag_points": 1.5,
      "status": "HEALTHY",
      "investigation_prompt": "Analyze Total Revenue growth drivers."
    },
    {
      "kpi_id": "kpi_gross_profit_margin",
      "kpi_name": "Gross Profit Margin",
      "weight_pct": 35.0,
      "metric_score": 42.0,
      "points_contributed": 14.7,
      "drag_points": 20.3,
      "status": "CRITICAL",
      "investigation_prompt": "Why did gross profit margin collapse in Lagos in July?"
    },
    {
      "kpi_id": "kpi_units_sold",
      "kpi_name": "Total Units Sold",
      "weight_pct": 20.0,
      "metric_score": 90.0,
      "points_contributed": 18.0,
      "drag_points": 2.0,
      "status": "HEALTHY",
      "investigation_prompt": "Analyze volume distribution across product categories."
    },
    {
      "kpi_id": "kpi_return_rate",
      "kpi_name": "Return Rate",
      "weight_pct": 15.0,
      "metric_score": 72.0,
      "points_contributed": 10.8,
      "drag_points": 4.2,
      "status": "WARNING",
      "investigation_prompt": "What is driving the return surge on Inverter AC units?"
    }
  ]
}
```

---

### 2.5 `health_issues` Schema (In-Memory / Health Engine Contract)
Issues automatically identified by the Business Health engine using the official priority formula:
$$\text{Priority Score} = 0.45 \times \text{Financial Impact} + 0.25 \times \text{Target Deviation} + 0.20 \times \text{Rate of Change} + 0.10 \times \text{Business Criticality}$$

```json
{
  "issue_id": "issue_margin_collapse_jul",
  "workspace_id": "ws_nexasphere_001",
  "title": "Gross Profit Margin Collapsed in Lagos Retail",
  "kpi_id": "kpi_gross_margin",
  "severity": "CRITICAL", // "CRITICAL" | "WARNING"
  "component_scores": {
    "financial_impact": 0.900,
    "target_deviation": 0.855,
    "rate_of_change": 0.800,
    "business_criticality": 1.000
  },
  "component_availability": {
    "financial_impact": true,
    "target_deviation": true,
    "rate_of_change": true,
    "business_criticality": true
  },
  "normalized_priority_score": 0.859,
  "ranking_reason": "High monetary exposure (-₦4.5M) combined with severe target deviation (-42.7%) and rapid MoM decay.",
  "financial_impact_label": "Estimated impact: -₦4,500,000",
  "current_value": 0.142,
  "baseline_target": 0.248,
  "variance_pct": -0.4274,
  "primary_driver": "Category: Home Appliances, Region: Lagos",
  "status": "OPEN",
  "detected_at": "2026-08-24T00:05:00Z"
}
```

---

### 2.5 `investigations` Collection
Represents an investigative session modeled as a structured **Evidence Trail Tree**.

```json
{
  "investigation_id": "inv_margin_deepdive_001",
  "workspace_id": "ws_nexasphere_001",
  "user_id": "usr_google_10928392",
  "title": "Investigation: July Margin Collapse in Lagos",
  "triggered_from_issue_id": "issue_margin_collapse_jul",
  "root_node_id": "node_root_001",
  "active_node_id": "node_branch_003",
  "total_nodes": 4,
  "status": "ACTIVE", // "ACTIVE" | "ARCHIVED" | "REPORTED"
  "created_at": "2026-08-24T00:10:00Z",
  "updated_at": "2026-08-24T00:14:30Z"
}
```

---

### 2.6 `evidence_nodes` Collection (Evidence Trail Data Model)
Represents a node in the branching **Evidence Trail investigation tree**. Each node links to its parent finding and retains analytical lineage.

```json
{
  "node_id": "node_branch_002",
  "investigation_id": "inv_margin_deepdive_001",
  "parent_node_id": "node_root_001", // null for root node
  "title": "Regional & Category Margin Breakdown",
  "user_question": "Break this down by region and category.",
  "analytical_result_id": "res_agg_9012",
  "epistemic_status": "OBSERVATION", // "FACT" | "OBSERVATION" | "INFERENCE" | "HYPOTHESIS" | "UNKNOWN"
  "evidence_refs": [
    "art_chart_bar_01",
    "art_table_slice_01"
  ],
  "children_node_ids": ["node_leaf_003a", "node_leaf_003b"],
  "depth": 1,
  "response_summary": "Gross margin in Lagos declined by 10.6 percentage points (from 24.8% to 14.2%) in July. Home Appliances accounted for ₦3.8M (84.4%) of the total profit margin shortfall.",
  "answerability": "ANSWERABLE", // "ANSWERABLE" | "PARTIALLY_ANSWERABLE" | "INSUFFICIENT_DATA" | "AMBIGUOUS"
  "active_filters": {
    "region": ["Lagos"],
    "date_range": { "start": "2025-07-01", "end": "2025-07-31" }
  },
  "lineage": {
    "tool_executed": "group_and_aggregate",
    "parameters": {
      "dimensions": ["category"],
      "metrics": ["revenue", "gross_profit", "margin_pct"],
      "filters": { "region": "Lagos", "month": "2025-07" }
    },
    "formula_breadcrumb": "Margin % = (Gross Profit / Revenue) * 100 aggregated by Category WHERE Region = 'Lagos'",
    "analytical_result_id": "res_agg_9012",
    "evidence_artifact_ids": ["art_chart_bar_01", "art_table_slice_01"],
    "confidence_level": "HIGH" // "HIGH" | "MEDIUM" | "LOW"
  },
  "is_bookmarked_for_report": true,
  "created_at": "2026-08-24T00:11:00Z"
}
```

---

### 2.7 `analytical_results` Collection (Tier 3 Schema Contract)
The structured payload returned by the deterministic Python analytics engine.

```json
{
  "result_id": "res_agg_9012",
  "investigation_id": "inv_margin_deepdive_001",
  "tool_name": "group_and_aggregate",
  "execution_timestamp": "2026-08-24T00:10:59Z",
  "execution_duration_ms": 8.4,
  "parameters": {
    "dimensions": ["category"],
    "metrics": ["revenue", "gross_profit", "margin_pct"],
    "filters": { "region": "Lagos", "date_range": ["2025-07-01", "2025-07-31"] }
  },
  "summary_metrics": {
    "total_revenue": 24500000.0,
    "total_gross_profit": 3479000.0,
    "overall_margin_pct": 14.2
  },
  "table_data": [
    { "category": "Home Appliances", "revenue": 14200000.0, "gross_profit": 1136000.0, "margin_pct": 8.0 },
    { "category": "Mobile Phones", "revenue": 6800000.0, "gross_profit": 1496000.0, "margin_pct": 22.0 },
    { "category": "Computing & Audio", "revenue": 3500000.0, "gross_profit": 847000.0, "margin_pct": 24.2 }
  ],
  "chart_spec": {
    "chart_type": "bar",
    "x_axis": "category",
    "y_axis": "margin_pct",
    "series": [
      { "name": "Margin %", "data_key": "margin_pct", "color": "#EF4444" }
    ],
    "reference_line": { "value": 25.0, "label": "Target (25%)" }
  },
  "formula_breadcrumb": "Margin % = (Gross Profit / Revenue) * 100 aggregated by Category WHERE Region = 'Lagos'"
}
```

---

### 2.8 `reports` Collection
Executive briefings synthesized directly from selected nodes on the **Evidence Trail**.

```json
{
  "report_id": "rep_exec_001",
  "investigation_id": "inv_margin_deepdive_001",
  "workspace_id": "ws_nexasphere_001",
  "author_id": "usr_google_10928392",
  "title": "Executive Briefing: July Margin Erosion in Lagos Retail",
  "executive_summary": "An investigation into NexaSphere's July performance revealed that overall corporate revenue grew by 12.4%, but gross margin in Lagos physical stores collapsed from 24.8% to 14.2%. This was driven by a deep 30% discount promotion on Home Appliances coupled with a 18% return surge on bulky air conditioner units.",
  "business_question": "What caused the 42.7% drop in gross profit margin during July 2025 despite rising top-line sales?",
  "evidence_trail_node_ids": ["node_root_001", "node_branch_002", "node_leaf_003a"],
  "key_findings": [
    {
      "epistemic_tag": "FACT",
      "statement": "Lagos retail revenue grew +14.8% MoM while gross profit dropped -34.2% MoM.",
      "source_node_id": "node_root_001"
    },
    {
      "epistemic_tag": "FACT",
      "statement": "Home Appliances margin collapsed to 8.0% against an operational target of 25.0%.",
      "source_node_id": "node_branch_002"
    },
    {
      "epistemic_tag": "OBSERVATION",
      "statement": "Average discount applied to Home Appliances in Lagos rose from 6.5% to 28.4% during July.",
      "source_node_id": "node_leaf_003a"
    },
    {
      "epistemic_tag": "INFERENCE",
      "statement": "Discount volume expansion cannibalized gross profit without delivering sustainable unit margin.",
      "source_node_id": "node_leaf_003a"
    }
  ],
  "evidence_result_ids": ["res_agg_9012", "res_pop_9015"],
  "data_limitations": [
    "Competitor retail pricing was not available in the dataset; cannot verify if discounting was reactive.",
    "Customer feedback surveys are not connected; return reasons are derived strictly from warehouse return codes."
  ],
  "recommendations": [
    "Re-evaluate promotional discount ceilings with Lagos store managers for large appliances.",
    "Review third-party logistics transit handling for AC units to reduce shipping-related return claims."
  ],
  "created_at": "2026-08-24T00:15:00Z"
}
```

---

## 3. Future Roadmap: Historical Business Health Snapshots

In post-MVP versions of VISON, a dedicated `health_snapshots` Firestore collection will be introduced to persist immutable historical records of Business Health pulses and prioritized issues over time:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FUTURE ROADMAP: HISTORICAL SNAPSHOTS                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Collection: `health_snapshots`                                            │
│ • Purpose: Persist periodic (daily / weekly / monthly) business health runs │
│ • Capabilities:                                                             │
│   - Multi-quarter health drift visualization                                │
│   - Executive retrospective reports comparing historical Top 3 Issues       │
│   - Historical accuracy audit trails for target variance forecasting        │
└─────────────────────────────────────────────────────────────────────────────┘
```
