# VESTA — Product Specification

> **AI Business Intelligence Assistant for Modern Enterprise Leadership**  
> *10Alytics BuildFest 2026 Hackathon Core Specification*

---

## 1. Product Definition

**VESTA** is an evidence-first AI Business Intelligence assistant that continuously monitors core business health from live Google Sheets data, empowers leaders to conduct conversational root-cause investigations, and deterministically proves every conclusion while strictly refusing to fabricate what the data does not support.

---

## 2. The Problem

### 2.1 The NexaSphere Retail Ltd. Dilemma
NexaSphere Retail Ltd. is an omnichannel electronics and home-appliance retailer operating across physical retail stores, fulfillment hubs, digital web channels, and B2B corporate sales. The business collects substantial operational data: daily sales, returns, inventory stock levels, marketing campaigns, employee sales performance, and delivery metrics.

Despite having traditional BI dashboards and scheduled PDF reports, executives and operational managers face a chronic **"Intelligence Gap"**:

1. **Surface Metrics Conceal Underlying Decay**: Headline revenue may rise by 15%, while gross profit margins collapse by 40%, fulfillment times double, return rates surge in specific categories, and customer retention quietly erodes.
2. **Dashboard Rigidity & Cognitive Overload**: Standard BI tools display dozens of pre-baked charts that show *what* happened but cannot answer *why* it happened without manual slicing, custom SQL queries, or waiting days for a data team.
3. **The LLM Hallucination Trap**: Generic AI chatbots connected to business data frequently hallucinate numbers, confuse correlation with causation, invent non-existent metrics, and provide speculative advice that destroys executive trust.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        THE TRADITIONAL BI DILEMMA                           │
├──────────────────────────────────────┬──────────────────────────────────────┤
│        Traditional Dashboards        │        Generic AI Chatbots           │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • 50+ cluttered, static charts       │ • Fabricates numbers & math          │
│ • Shows WHAT, never explains WHY     │ • Confuses correlation & causation   │
│ • Requires data team for custom cuts │ • Speculates blindly on missing data │
│ • Rigid, non-conversational          │ • Zero mathematical audit trail      │
└──────────────────────────────────────┴──────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          THE VISON PARADIGM                                 │
│    Bounded Health Pulse + Conversational Drilldown + Mathematical Proof     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Target Users & Personas

### 3.1 Primary Personas
* **The Chief Executive Officer (CEO)**: Needs an instant, honest health assessment of the business upon login; wants to know the top 3 existential issues without getting lost in operational minutiae.
* **The Chief Operating Officer (COO) / Head of Retail**: Needs to cross-examine operational friction (e.g., why delivery delays in Lagos are inflating return rates on large appliances).
* **The Chief Financial Officer (CFO) / Commercial Director**: Needs to drill into margin leakage, discount abuses, and regional profitability variances.
* **Category & Regional Business Managers**: Need to investigate specific product performance, store discrepancies, and campaign ROI against targets.

---

## 4. User Jobs-to-be-Done (JTBD)

| When I... | I want to... | So that I can... |
| :--- | :--- | :--- |
| **Log into the system** | View an immediate, bounded health pulse and the Top 3 operational issues | Prioritize my leadership focus on what is broken without scanning 50 charts. |
| **Notice a KPI anomaly** | Ask natural-language questions and drill down into sub-dimensions (region, store, SKU, channel) | Identify the exact root drivers behind the metric change within seconds. |
| **Receive an AI finding** | Click **"Show Me"** to inspect the underlying calculations, data tables, and charts | Trust the conclusion with 100% mathematical certainty before making decisions. |
| **Ask about unrecorded data** | Be told clearly that the data does not exist rather than receive a plausible lie | Avoid catastrophic business decisions based on fabricated AI assumptions. |
| **Conclude an investigation** | Generate a structured, boardroom-ready executive report | Align stakeholders and delegate corrective action with documented evidence. |

---

## 5. Product Philosophy & Core Tenets

### Tenet 1: "Don't Just Tell Me. Show Me."
An AI claim without data lineage is a liability. Every observation or inference produced by Vison must carry a direct link to the underlying deterministic calculation, filtered data slice, and visual proof.

### Tenet 2: "Vison Must Never Pretend to Know What the Data Does Not Support."
Epistemic humility is hardcoded into the platform. If a user asks about customer satisfaction, but the connected dataset only contains sales and returns, Vison must refuse to guess. It explicitly states what is missing and outlines what can be answered with existing data.

### Tenet 3: Deterministic Math, Probabilistic Language
The Large Language Model (Gemini) is strictly an analytical translator, intent parser, and narrative synthesizer. It is **never** the calculator. All sums, averages, variances, aggregations, and statistical tests are executed deterministically in Python/Pandas.

### Tenet 4: Bounded Monitoring, User-Led Investigation
Vison does not bombard executives with endless autonomous alerts. It provides bounded monitoring on user-selected KPIs and lets the human lead the investigation conversationally.

---

## 6. The Core Product Loop

```
┌─────────────────┐     ┌───────────────────────┐     ┌──────────────────────┐
│ 1. CONNECT      │ ──> │ 2. MONITOR HEALTH     │ ──> │ 3. INVESTIGATE       │
│ Google Sheets   │     │ Adaptive Defaults &   │     │ Conversational Drill-│
│ Live Data Sync  │     │ Top 3 Urgent Issues   │     │ down with Context    │
└─────────────────┘     └───────────────────────┘     └──────────────────────┘
                                                                 │
                                                                 ▼
┌─────────────────┐     ┌───────────────────────┐     ┌──────────────────────┐
│ 6. ACTION       │ <── │ 5. REPORT             │ <── │ 4. SHOW ME           │
│ Evidence-backed │     │ Structured Boardroom  │     │ Deterministic Visual │
│ Next Steps      │     │ Management Briefing   │     │ & Mathematical Proof │
└─────────────────┘     └───────────────────────┘     └──────────────────────┘
```

1. **Connect**: User connects a live Google Sheet (e.g., NexaSphere retail data). Vison profiles columns, types, dates, measures, and dimensions.
2. **Monitor Health**: Vison immediately renders an executive Business Health view with sensible default KPIs and the Top 3 detected issues.
3. **Investigate**: User clicks an issue or types a question (e.g., *"Why did profit drop in July?"*). Vison executes multi-turn deterministic analysis.
4. **Show Me**: User inspects charts, data slices, and calculation steps backing every finding.
5. **Report**: User converts the active investigation into a structured management report.
6. **Action**: Executive takes informed action grounded strictly in verified facts.

---

## 7. The Two Primary Modes

### Mode A: Business Health (Executive Pulse)
* **Goal**: Answer *"How is my business doing right now against our goals and trends?"* in under 5 seconds.
* **CEO of the Dataset Principle**: VISON does not rely on static, hard-coded industry templates (e.g., forcing a rigid retail dashboard). Instead, it implements a dynamic capability pipeline:
  $$\text{Dataset} \longrightarrow \text{Data Profiling} \longrightarrow \text{Available Capabilities} \longrightarrow \text{Supported KPI Definitions} \longrightarrow \text{KPI Availability} \longrightarrow \text{Business Health}$$
  The engine activates only supported KPI definitions that are legitimately calculable from connected columns. Missing KPIs appear in the catalog as *"Not available — required fields missing."*
* **Explainable Health Score (0–100)**: Features a transparent, decomposable composite score:
  $$\text{Overall Health Score} = \frac{\sum_{i \in \text{Available}} (\text{KPI Score}_i \times \text{KPI Weight}_i)}{\sum_{i \in \text{Available}} \text{KPI Weight}_i}$$
  Paired with an executive traffic-light badge (🟢 85–100, 🟡 70–84, 🔴 0–69) and a contribution breakdown table showing exact point gains/drags per KPI with direct investigation links.
* **Business Storyline (Executive Homepage Briefing)**: Automatically synthesizes a maximum 4-bullet, 25-second reading time situational brief (Overall Status, Strongest Positive, Most Important Risk, Next Area Requiring Attention) derived deterministically from health outputs.
* **User Customization**: Users can add supported KPIs, remove KPIs, reorder cards, and configure comparison baselines/targets. Arbitrary raw columns cannot become KPIs.
* **Top 3 Issues (Deterministic Priority Formula)**: Evaluates all operational anomalies and ranks them using:
  $$\text{Priority Score} = 0.45 \times \text{Financial Impact} + 0.25 \times \text{Target Deviation} + 0.20 \times \text{Rate of Change} + 0.10 \times \text{Business Criticality}$$
  If a factor is not calculable from available data, scoring normalizes across supported components. Financial impact is explicitly labeled as *"Estimated impact"* or *"Not reliably calculable from available data"*—never fabricated.
* **"View More" Drawer**: Allows managers to expand and view lower-priority anomalies without cluttering the primary executive view.
* **"Why is this Red/Green?" Trigger**: Every KPI tile includes a direct one-click bridge into an active Investigation session.

### Mode B: Investigate (Conversational Root-Cause Analysis)
* **Goal**: Answer *"Why is this happening and what is driving it?"* through natural dialogue.
* **User-Driven Exploration**: The user leads the inquiry. Vison answers the exact question, executes deterministic tool calling, and waits for the user's next command.
* **Multi-Turn Context Retention**: Remembers active filters (e.g., active dimensions, time periods) across sequential questions.
* **Epistemic Classification**: Every response clearly separates **FACTS**, **OBSERVATIONS**, **INFERENCES**, **HYPOTHESES**, and **UNKNOWN**.
* **Data Boundary Warnings**: When asked an unsupported question, Vison states *"I cannot establish that from the connected data"*, then lists **AVAILABLE**, **MISSING**, and **WHAT CAN STILL BE INVESTIGATED**.

---

## 8. Epistemic Classification System

To guarantee absolute trust, Vison categorizes every insight into one of five rigorous epistemic buckets:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EPISTEMIC CLASSIFICATION SYSTEM                        │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ [FACT]       │ Directly calculated metric from the data (e.g. Total Revenue)│
├──────────────┼──────────────────────────────────────────────────────────────┤
│ [OBSERVATION]│ Statistically verified pattern/breakdown (e.g. Lagos down 34%)│
├──────────────┼──────────────────────────────────────────────────────────────┤
│ [INFERENCE]  │ Analytical interpretation (e.g. Returns driving margin loss) │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ [HYPOTHESIS] │ Plausible explanation needing external proof (e.g. Transit)  │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ [UNKNOWN]    │ Information absent from dataset (e.g. Competitor pricing)    │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 9. Evidence Trail & The "Show Me" Paradigm

VISON transforms investigations from ephemeral, linear chat transcripts into an interactive, structured **Evidence Trail**.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE EVIDENCE TRAIL TREE STRUCTURE                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                         [ROOT NODE: Initial Question]
                         "Why did gross margin drop in July?"
                         (Tool: Period Comparison | Epistemic: [FACT])
                                       │
                                       ▼
                       [BRANCH NODE 1: Regional Breakdown]
                       "Break down by region and category"
                       (Tool: GroupBy Region, Cat | Epistemic: [OBSERVATION])
                                       │
                   ┌───────────────────┴───────────────────┐
                   ▼                                       ▼
    [LEAF NODE 1A: SKU Deep-Dive]            [LEAF NODE 1B: Return Drivers]
    "Which products in Lagos?"               "Are returns driving this?"
    (Tool: Rank SKUs | [INFERENCE])          (Tool: Reason Codes | [OBSERVATION])
```

### 9.1 Core Evidence Trail Principles
* **Tree-Structured Lineage**: Every follow-up question creates an explicit child branch linked to its parent analytical finding rather than getting lost in a flat chat feed.
* **AI Rule #16 (Analytical Lineage Guarantee)**: Every material conclusion generated during an investigation must retain an explicit lineage reference:
  - **Tool Executed**: The deterministic Python/Pandas function called.
  - **Parameters**: Applied dimensions, metrics, time ranges, and filters.
  - **Formula Breadcrumb**: Exact human-readable calculation string.
  - **Analytical Result ID**: Structured data reference (`res_xxx`).
  - **Evidence Artifact IDs**: Supporting charts and table slices.
  - **Confidence Level**: Statistical confidence rating (`HIGH` | `MEDIUM` | `LOW`).
  *The AI is strictly prohibited from producing any conclusion without this lineage reference.*
* **P0 Traceability Focus**: The core P0 requirement is **rigorous analytical traceability** ($\text{Question} \rightarrow \text{Tool} \rightarrow \text{Parameters} \rightarrow \text{Formula/Result} \rightarrow \text{Evidence Artifact} \rightarrow \text{Conclusion}$). Executives can inspect the exact evidence and calculation behind any node. Complex historical application state restoration is treated as P1.
* **Single Source of Truth for Reports**: Executive Management Reports are compiled directly from selected nodes along the Evidence Trail.
* **Read-Only Audit Trail**: The Evidence Trail serves as permanent, read-only documentation of analytical lineage and executive reasoning—not transient AI memory.

---

## 10. Conservative, Evidence-Based Recommendations

While Vison suggests practical operational next steps, it adheres to strict executive boundaries:
* **Never Acts as an Autonomous Decision-Maker**: Vison does not assume it knows internal supplier contracts, employee sentiment, or boardroom politics.
* **Formulation**: Frames suggestions as *"Areas for management investigation"* or *"Potential considerations supported by the observed data pattern"* rather than dogmatic executive orders.

---

## 11. Role of Google Sheets

* **Single Source of Truth**: Business data lives in Google Sheets.
* **Dynamic Refreshability**: When numbers update in Google Sheets, a single click refreshes profiling, health metrics, and investigation baselines.
* **Frictionless Integration**: Uses Google OAuth and standard Google Sheets API endpoints.

---

## 12. What Vison Is NOT

* **NOT a Generic LLM Chatbot**: It does not guess answers or write code in chat. It runs controlled deterministic analytics tools.
* **NOT an Autopilot AI**: It does not spam notifications or execute business actions autonomously.
* **NOT an Unbounded 50-Chart Dashboard**: It emphasizes bounded high-signal KPIs and deep conversational slicing.
* **NOT an Enterprise Data Warehouse Replacement**: In this MVP, it focuses on fast, high-impact business analysis over Google Sheets.

---

## 13. MVP Scope vs. Future Roadmap

| Feature Dimension | Hackathon MVP (Current Build) | Post-Hackathon Roadmap |
| :--- | :--- | :--- |
| **Data Sources** | Live Google Sheets (OAuth / Public URL) | Excel (.xlsx), BigQuery, PostgreSQL, Snowflake |
| **Analytics Engine** | In-memory Pandas deterministic functions | Distributed DuckDB / SQL pushdown engine |
| **Health Monitoring** | Dynamic on-refresh compute, Top 3 Issues, Custom Targets | Historical Health Snapshots collection (`health_snapshots`), Automated Slack/Email alerts |
| **AI Layer** | Gemini Function Calling + Deterministic Tool Exec | Multi-LLM support, Fine-tuned domain models |
| **Reporting** | Markdown / Printable PDF Executive Briefings | Scheduled automated email digest, PowerPoint export |
| **Actions** | Evidence-backed recommendations | Direct write-back to Sheets, ERP trigger integrations |
