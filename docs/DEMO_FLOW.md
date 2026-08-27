# VESTA — Hackathon Demo Script & Judge Presentation Flow

> **10Alytics BuildFest 2026 Hackathon Demonstration Guide**  
> *Target Duration: 3:30 – 4:30 Minutes | Dataset: NexaSphere Retail Ltd. Omnichannel*

---

## 1. Demo Narrative Arc & Objectives

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          THE DEMO NARRATIVE ARC                             │
│                                                                             │
│      SEE            INVESTIGATE          SHOW           BOUNDARY      REPORT │
│  (Health Pulse)   (Root Cause Q&A)   (Proof / Math)   (Refuse Lie)   (Brief) │
│       │                  │                 │               │            │
│       ▼                  ▼                 ▼               ▼            ▼
│  "What is on       "Why did margin   "Show me the     "Know what     "Export │
│   fire today?"      collapse in       exact numbers    the data       action │
│                     July?"            & formula."      can't tell."   brief."│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Demonstration Objectives:
1. **Show Executive Immediacy**: Connect a Google Sheet and see an instant, adaptive Business Health pulse and Top 3 Issues in < 10 seconds.
2. **Prove Mathematical Rigor**: Show that Gemini is backed by deterministic Python/Pandas calculations, not hallucinated arithmetic.
3. **Deliver the "Show Me" Evidence Moment**: Drill from natural language into raw data tables and formula breadcrumbs.
4. **Deliver the Critical WOW Moment ("Epistemic Integrity")**: Show VESTA refusing to fabricate answers when asked about missing data (Customer Satisfaction), explaining what is missing, and offering a legitimate data-backed alternative.
5. **Close with Tangible Business Value**: Generate a structured, printable Executive Briefing in one click.

---

## 2. Step-by-Step 5-Phase Demonstration Script

### Phase 1: Onboarding, Connection & Data Profiling (0:00 – 0:45)
* **Presenter Action**: Open VESTA web application. Click the **"Connect Google Sheet"** button (or select the bundled Fallback Demo Fixture).
* **System Action**: 
  - Backend ingests tabular transactions via Google Sheets API v4.
  - Profiling engine detects columns, inferring measures, dimensions, dates, and identifiers without hardcoded templates.
  - Detects missingness and flags any ambiguous fields in the Data Dictionary.
  - Activates calculable supported KPI definitions based on verified column presence.
* **Spoken Script**:
  > *"Judges, meet Vesta. Traditional BI tools show you 50 confusing charts, while standard AI chatbots make up numbers. Vesta connects directly to live business data in Google Sheets, monitors what matters, and deterministically proves every single conclusion.*  
  > *With one click, we connect our business dataset. In under 3 seconds, Vesta profiles the columns, data types, and operational capabilities—acting as the CEO of this specific dataset."*

---

### Phase 2: Adaptive Business Health, Storyline & Top 3 Issues (0:45 – 1:30)
* **Visual on Screen**: 
  - Executive Business Health dashboard renders:
    - **Business Storyline Hero Component**: 4-bullet executive narrative ($\le 25$s read time) summarizing Overall Status, Strongest Positive, Most Important Risk, and Next Areas Requiring Attention.
    - **Explainable Health Score Gauge**:
      * Displays the 0–100 composite score (e.g. `72 / 100 [ 🟡 YELLOW / WARNING ]`).
      * Decomposable Breakdown: Revenue (+28.5 pts), Margin (+14.7 pts / -20.3 pt drag ⚠️), Units (+18.0 pts), Returns (+10.8 pts).
    - **Top 3 Issues Hero Banner**:
      * Ranked using the official formula: $0.45 \times \text{FI} + 0.25 \times \text{TD} + 0.20 \times \text{RC} + 0.10 \times \text{BC}$.
      * Shows monetary exposure (or *"Not reliably calculable"* if cost columns are missing), severity badge, and 1-click `[Investigate]` triggers.
* **Spoken Script**:
  > *"Notice what Vison gives the CEO immediately upon login: an instant, explainable **Health Score of 72 out of 100**. Rather than a black-box number, every single point is decomposable: our score is being dragged down by 20.3 points because of margin contraction.*  
  > *Right above, our 25-second **Business Storyline** synthesizes our biggest win and our most critical operational risk. Let's click 'Investigate' on our top issue to see what's happening."*

---

### Phase 3: Conversational Root-Cause Investigation (1:30 – 2:30)
* **Presenter Action**: Click **`[Investigate]`** on Top Issue #1 (or type in the conversational bar).
* **Visual on Screen**: Transitions into the 3-column Investigation Workspace with the root analytical query pre-loaded.
* **Step 3.1: Initial Drilldown**
  * **Vison Execution**: Calls `group_and_aggregate(dimensions=['region', 'category'], metrics=['revenue', 'gross_profit', 'margin_pct'])`.
  * **Vison Output**: 
    - **`[FACT]`** *National revenue rose +12.4% to ₦214.8M, but gross profit fell -28.4% to ₦30.5M.*
    - **`[OBSERVATION]`** *Lagos physical retail accounted for 84.4% (₦3.8M) of the total margin shortfall.*
    - **`[INFERENCE]`** *Home Appliances was the primary category driving margin contraction.*
* **Step 3.2: Multi-Turn Context Retention**
  * **User Prompt**: *"Which specific stores and products in Lagos caused that?"*
  * **Vison Execution**: Preserves `region='Lagos'`, `month='2025-07'`, `category='Home Appliances'`, calls `group_and_aggregate` on `store_name` and `product_name`.
  * **Vison Output**:
    - **`[FACT]`** *The Ikeja Mega-Store and Victoria Island Flagship accounted for 91% of the discounted appliance sales.*
    - **`[OBSERVATION]`** *Inverter Split AC units were discounted by an average of 32.5%, generating revenue with severely compressed margins.*
* **Spoken Script**:
  > *"Notice what happened here: Vison maintained conversation context seamlessly. When I asked 'Which specific stores and products caused that?', it remembered we were investigating Lagos Home Appliances. And crucially, every single number on this screen was computed deterministically by Python—never guessed by the AI."*

---

### Phase 4: Evidence Trail & Epistemic Boundary WOW Moments (2:30 – 3:30)

#### Step 4.1: The Evidence Trail (Analytical Traceability)
* **Presenter Action**: View the **`[Evidence Trail]`** panel.
* **Visual on Screen**: 
  - Displays the complete audit trail:
    - `Question` $\rightarrow$ `Tool: group_and_aggregate` $\rightarrow$ `Parameters: [region, category]` $\rightarrow$ `Formula Breadcrumb` $\rightarrow$ `Analytical Result ID` $\rightarrow$ `[FACT] Conclusion`.
* **Spoken Script**:
  > *"Notice that Vison gives the CEO complete analytical lineage. Every material conclusion preserves its formula, the Python tool executed, the exact parameters, and the underlying data slice."*

#### Step 4.2: The "Show Me" Visual Proof
* **Presenter Action**: Click the **`[Show Me]`** button on the finding.
* **Visual on Screen**: Side-drawer displays:
  1. Dynamic chart (Bar / Contribution / Waterfall).
  2. Tabular breakdown of the top SKUs with volume, discount %, and margins.
  3. Formula Breadcrumb: `Net Margin % = ((Revenue - COGS) / Revenue) * 100`.
* **Spoken Script**:
  > *"Our core philosophy is: 'Don't just tell me. Show me.' With one click, the executive can audit the exact mathematical formula, the underlying data slice, and the visual breakdown backing the AI's conclusion."*

#### Step 4.3: The Epistemic Boundary WOW Moment ("Knowing What It Doesn't Know")
* **Presenter Action**: Type an unrecorded question:
  * **User Prompt**: *"Are customers returning these units because of poor customer satisfaction ratings?"*
* **Vison Output**:
  - ⚠️ **`[UNKNOWN]` — INSUFFICIENT DATA**
  - *"I cannot establish that from the connected data because customer satisfaction surveys (CSAT/NPS) are not recorded in this Google Sheet."*
  - **Available in dataset**: *Sales revenue, order dates, return flags, return reason codes, store locations.*
  - **Missing from dataset**: *Customer satisfaction scores, NPS ratings, customer review text.*
  - **Alternative Analysis**: *Based on available return reason codes, 74.2% of returns are tagged as 'Damaged in Transit', pointing to logistics rather than product satisfaction.*
* **Spoken Script**:
  > *"Judges, this is the most critical feature in Vison: Vison knows what it does not know. Any other AI chatbot would have invented a story about angry customer reviews. Vison explicitly refused to fabricate data, told us what was missing, and used our actual return reason codes to show the real issue: transit damage."*

---

### Phase 5: Structured Executive Management Report (3:30 – 4:15)
* **Presenter Action**: Click the **`[Generate Executive Report]`** button at the top of the Evidence Trail.
* **Visual on Screen**: 
  - Clean, boardroom-ready Executive Briefing modal renders, compiled directly from the selected nodes on the Evidence Trail.
  - Sections:
    1. **Executive Summary**: Clear 3-sentence synthesis.
    2. **Key Findings**: Labeled with `[FACT]`, `[OBSERVATION]`, and `[INFERENCE]` linked to their source nodes.
    3. **Evidence Artifacts**: Embedded dynamic charts and summary tables from the trail.
    4. **Data Limitations**: Explicitly noting the absence of CSAT and competitor pricing.
    5. **Evidence-Backed Next Steps**: Conservative, practical recommendations (e.g., *Review 30% discount ceiling on AC-902 with Ikeja store manager; audit courier packaging protocols for heavy appliances*).
* **Presenter Action**: Click `[Export / Print PDF]`.
* **Spoken Script**:
  > *"Within seconds, Vison converts our conversational investigation into a boardroom-ready executive report—complete with epistemic tags, data lineage, documented limitations, and practical recommendations. That is how Vison turns raw Google Sheets data into trusted executive decisions."*

---

## 3. Demo Question & Expected Output Matrix

| # | Demo Phase | Exact Input Prompt | Tool Called by Gemini | Deterministic Output Returned | Epistemic Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Health Pulse | *(Initial Load)* | `profile_dataset()` & `evaluate_health()` | Top 3 Issues + 4 Domain KPIs | `[FACT]` |
| **2** | Issue Drilldown | *"Why did gross profit drop in July despite higher sales?"* | `group_and_aggregate(dims=['region', 'category'])` | Lagos Home Appliances margin = 8.0% (vs 25.4% benchmark) | `[FACT]` + `[OBSERVATION]` |
| **3** | Contextual Slicing | *"Which specific stores and products in Lagos caused that?"* | `group_and_aggregate(dims=['store', 'product'], filters={...})` | Ikeja Store + Inverter AC-902 (32.5% discount, ₦14.2M sales) | `[FACT]` + `[INFERENCE]` |
| **4** | Epistemic Boundary | *"Are customers returning these AC units because of poor product quality ratings?"* | `check_data_sufficiency(fields=['csat_score', 'rating'])` | **Refusal**: CSAT missing; Return code indicates 'Damaged in Transit' (74.2%) | `[UNKNOWN]` + `[OBSERVATION]` |
| **5** | Report Synthesis | *[Click "Generate Report"]* | `synthesize_investigation_report()` | Formatted Executive Briefing | Complete Report Model |

---

## 4. Contingency & Fallback Architecture (Judge Resilience)

To guarantee 100% demo uptime under live judging conditions:

1. **Pre-Seeded Offline Session Cache**: If Google Sheets API experiences network delay, VISON automatically serves the pre-cached NexaSphere normalized session dataset.
2. **Deterministic Fallback Pipeline**: If the Gemini API experiences rate limits, the backend gracefully falls back to deterministic rule-based template summaries directly from the Python analytics engine output.
3. **Visual Mock Fallbacks**: Chart components include lightweight fallback renderers so missing rendering contexts never trigger browser errors.
