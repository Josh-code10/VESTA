# VESTA — MVP Specification

> **10Alytics BuildFest 2026 Hackathon Scope Document**  
> *Target Completion: 7-Day Sprint*

---

## 1. Hackathon Goal & Challenge Alignment

The objective of the 7-day hackathon is to deliver a rock-solid, production-grade MVP of **VESTA** that addresses the 10Alytics BuildFest 2026 challenge: **"AI Business Intelligence Assistant"** using the **NexaSphere Retail Ltd.** omnichannel dataset.

### Challenge Requirement Traceability

| Official Challenge Requirement | Vesta MVP Implementation | Feature Status |
| :--- | :--- | :--- |
| **Loading / Connecting to dataset** | Live Google Sheets API Connector (OAuth & Shareable URL) + Ingestion & Profiling Engine | **MUST HAVE (P0)** |
| **Important performance indicators** | Adaptive Business Health view with preloaded Financial, Sales, Customer, Operations, Marketing KPIs | **MUST HAVE (P0)** |
| **Natural-language questions & answers** | Multi-turn conversational Investigation engine powered by Gemini + Python Deterministic Analytics | **MUST HAVE (P0)** |
| **Visual insights & charts** | Interactive "Show Me" evidence module rendering dynamic bar, line, waterfall, and tabular breakdowns | **MUST HAVE (P0)** |
| **At least 3 important business findings** | Automated "Top 3 Issues" detection ranking margin collapse, return surges, and fulfillment bottlenecks | **MUST HAVE (P0)** |
| **Practical recommendations** | Conservative, evidence-backed operational next steps with explicit fact/inference separation | **MUST HAVE (P0)** |
| **Report Generation** | Structured Executive Management Report generator summarizing investigations into printable briefings | **MUST HAVE (P0)** |

---

## 2. Feature Prioritization Framework

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MVP PRIORITY PYRAMID                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  MUST HAVE (P0): Core Value & Trust                                         │
│  • Google Sheets Ingest • Profiling • Health Pulse • Top 3 Issues           │
│  • Tool-calling Conversational Engine • Deterministic Math • Epistemic Tags │
│  • Show Me Evidence • Insufficient Data Guardrail • Executive Report        │
├─────────────────────────────────────────────────────────────────────────────┤
│  SHOULD HAVE (P1): Polish & Speed                                           │
│  • Pre-seeded NexaSphere Demo Preset • KPI Target Customizer                │
│  • Visual Formula Breadcrumbs • Markdown/PDF Export                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  NICE TO HAVE (P2): Ergonomics                                              │
│  • Dark/Light Mode • Offline CSV Fallback Mode • Chat Transcript Download   │
├─────────────────────────────────────────────────────────────────────────────┤
│  OUT OF SCOPE: Explicitly Prohibited for 7-Day Sprint                       │
│  • Excel (.xlsx) • BigQuery • Multi-Agent Frameworks • ML Forecasting       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Detailed Scope Breakdown

### 3.1 MUST HAVE (P0 — Non-Negotiable Core)
1. **Google Sheets Connector & Manual Refresh**:
   - Simple, realistic Google OAuth 2.0 / Firebase Google Sign-In with Sheets authorization.
   - Live data ingestion into structured in-memory Pandas DataFrame.
   - **Manual Refresh Button**: Single-click `[🔄 Refresh Data]` in executive header.
   - **Sync Telemetry**: Displays `Last Synced: [timestamp]` and real-time status (`READY`, `SYNCING`, `UPDATED`, `ERROR`).
   - **Recalculation Pipeline**: Refresh triggers complete re-profiling, updating Data Dictionary, re-evaluating Business Health KPIs, and re-ranking Top 3 Issues.
2. **Automated Data Profiling Engine (CEO of the Dataset)**:
   - Ingests tabular data, detects data types (Currency, Date, Numeric, Category, Text).
   - Identifies column roles: Measures, Dimensions, Dates, Identifiers.
   - Detects missingness and flags ambiguous fields in the Data Dictionary.
   - Infers operational capabilities (Financial, Sales, Customer, Returns, Inventory, Delivery/Operations, Marketing, Employee) from verified column presence.
   - Verifies calculable supported KPI definitions against the KPI Registry.
3. **Adaptive Business Health Dashboard, Storyline & Health Score (0–100)**:
   - **Explainable Health Score (0–100)**: Decomposable composite score:
     $$\text{Overall Health Score} = \frac{\sum_{i \in \text{Available}} (\text{KPI Score}_i \times \text{KPI Weight}_i)}{\sum_{i \in \text{Available}} \text{KPI Weight}_i}$$
     Normalized across available KPIs with traffic-light badges (🟢 85–100, 🟡 70–84, 🔴 0–69) and an interactive contribution breakdown table.
   - **Business Storyline**: Maximum 4-bullet executive narrative ($\le 25$s read time) generated deterministically from health outputs (Overall Status, Strongest Positive, Most Important Risk, Next Area Requiring Attention).
   - **Calculable Default KPIs**: Activates only supported KPIs that can legitimately be calculated. Missing KPIs appear in the catalog as *"Not available — required fields missing."* Optional KPIs (e.g., CSAT) are rendered strictly when required fields exist.
   - **Top 3 Urgent Issues**: Ranked using the official formula ($0.45 \times \text{FI} + 0.25 \times \text{TD} + 0.20 \times \text{RC} + 0.10 \times \text{BC}$) with normalization across supported components. Financial impact is labeled *"Estimated impact"* or *"Not reliably calculable from available data"*—never fabricated.
   - **"View More" Drawer**: Expandable drawer for lower-priority anomalies.
   - **"Why is this Red/Green?" Trigger**: 1-click bridge to launch an active investigation.
4. **Customizable KPI Controls**:
   - Add/Remove supported KPIs from profiled measures.
   - Configure targets and comparison baselines (MoM, QoQ, YoY).
   - Reorder indicator cards on the dashboard.
5. **Deterministic Conversational Investigation Engine**:
   - Multi-turn conversational interface with active filter retention.
   - Gemini API integration utilizing Function Calling / Tool Use.
   - Deterministic Python/Pandas analytics engine executing arithmetic, aggregations, filtering, period variance, contribution share, and anomaly detection.
   - Zero hallucination guarantee: Gemini never calculates numbers directly.
6. **First-Class Epistemic Labeling & Data Boundary Warnings**:
   - Explicit tagging of all AI outputs: `[FACT]`, `[OBSERVATION]`, `[INFERENCE]`, `[HYPOTHESIS]`, `[UNKNOWN]`.
   - Explicit query answerability states: `ANSWERABLE`, `PARTIALLY_ANSWERABLE`, `INSUFFICIENT_DATA`, `AMBIGUOUS`.
   - Unsupported query handling: *"I cannot establish that from the connected data"*, followed by **AVAILABLE**, **MISSING**, and **WHAT CAN STILL BE INVESTIGATED**.
7. **Evidence Trail & "Show Me" Module (P0 Analytical Traceability)**:
   - **P0 Traceability Focus**: Complete lineage documentation ($\text{Question} \rightarrow \text{Tool} \rightarrow \text{Parameters} \rightarrow \text{Formula/Result} \rightarrow \text{Evidence Artifact} \rightarrow \text{Conclusion}$).
   - **Rich Node State**: Persists tool executed, parameters, formula breadcrumb, analytical result ID (`res_xxx`), evidence artifact IDs, and confidence level.
   - **"Show Me" Evidence Panel**: Displays appropriate visual proof (Bar, Line, Contribution, Table, Formula Breadcrumbs; Waterfall only where genuinely appropriate).
8. **Conservative Recommendations Module**:
   - Proposes practical areas for management investigation without overreaching into strategic dictation.
9. **Executive Management Report Generator**:
   - Compiles active investigation findings into a structured, printable Executive Briefing (Executive Summary, Key Findings with Epistemic Tags, Evidence Visuals, Data Limitations, Next Steps).
   - Print-optimized view for browser-native PDF generation.
10. **Lightweight Auth & Persistence**:
    - Firebase Authentication (Google Sign-In).
    - Firestore storage scoped strictly to: (1) User identity, (2) Workspace metadata, (3) Connected data source metadata, and (4) KPI configuration.
    - Historical investigations/health snapshots persistence is explicitly gated as an MVP decision; P0 uses session state.

### 3.2 SHOULD HAVE (P1 — Target for Polish & Post-MVP)
1. **Business X-Ray**: Multi-dimensional diagnostic heatmap matrix.
2. **Advanced Investigation State Restoration**: Full dynamic app state / filter rollback on clicking any historical Evidence Trail node.
3. **Historical Business Health Snapshots**: Persisting daily/weekly health score logs in Firestore.
4. **1-Click Demo Preset Connector**: Pre-configured demo fixture for instant judging demonstration.
5. **Report Clipboard Markdown Copy**: One-click formatted Markdown clipboard copy.

### 3.3 NICE TO HAVE (P2 — Only If Time Permits)
1. **CSV Fallback Uploader**: Local file upload fallback.
2. **Dark / Light Theme Toggle**: Visual mode switch.

### 3.4 OUT OF SCOPE (Explicitly Deferred)
* ❌ **Questions Your Business Is Asking / Business Intelligence Layer**: Deferred for separate specification.
* ❌ **Autonomous CEO / Predictive Decision-Making**: No autonomous business actions.
* ❌ **Background Polling & Real-Time Webhook Listeners**: MVP relies strictly on deterministic manual refresh.
* ❌ **Direct Database / ERP Connectors (BigQuery, Snowflake, Salesforce)**: Google Sheets satisfies hackathon requirements.
* ❌ **Direct Write-Back**: VISON will not modify connected Google Sheets.
* ❌ **Multi-Agent Orchestration Frameworks (AutoGPT / CrewAI / LangGraph heavy graphs)**: Introduces unneeded latency and non-deterministic failure modes. Single-agent with clean tool-calling is strictly superior.
* ❌ **Predictive Machine Learning / Forecasting Models (ARIMA, Prophet, Neural Networks)**: Out of scope for historical diagnostic business intelligence.
* ❌ **Direct Write-Back / Action Execution**: Vison will not write data back to Google Sheets or execute ERP transactions.

---

## 4. End-to-End MVP User Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 1: CONNECT & PROFILE                           │
│  User logs in with Google → Pastes Google Sheet URL (or clicks Demo Preset) │
│  Vison profiles columns, types, dates, measures, and data quality.          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 2: BUSINESS HEALTH                             │
│  Instant executive view renders with preloaded KPIs: Revenue, Margin,       │
│  Units, Return Rate, Stockouts. Top 3 Issues prominently displayed.         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 3: LAUNCH INVESTIGATION                        │
│  User clicks "Investigate" on Issue #1 ("Gross Margin collapsed to 14%")   │
│  Or types natural language query into the investigation bar.                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 4: CONVERSATIONAL DRILLDOWN                    │
│  User: "Break this down by region and category."                            │
│  Vison calls deterministic tools → Lagos + Appliances identified.           │
│  User: "Which specific store and product line is driving this?"             │
│  Vison preserves context and drills into Lagos Flagship Store + AC units.   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 5: EVIDENCE & "SHOW ME"                        │
│  User clicks "Show Me" → Visualizes waterfall & tabular breakdown.         │
│  User tests epistemic limits: "Did customer ratings cause this?"            │
│  Vison: "INSUFFICIENT DATA — CSAT scores are not in the connected sheet."   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STEP 6: EXECUTIVE REPORT                            │
│  User clicks "Generate Report" → Structured briefing generated.             │
│  Includes Executive Summary, Fact/Inference breakdown, and Next Steps.      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Success Metrics for the Hackathon MVP

1. **Deterministic Accuracy**: 100% of numerical calculations match exact Pandas outputs; 0% hallucinated calculations.
2. **Time to First Insight**: < 10 seconds from connecting Google Sheet to rendering full Business Health pulse and Top 3 issues.
3. **Epistemic Integrity**: 100% adherence to data boundaries when answering unrecorded or ambiguous questions.
4. **Demo Reliability**: Zero latency timeouts or unhandled exceptions during the 5-minute judge walkthrough.
