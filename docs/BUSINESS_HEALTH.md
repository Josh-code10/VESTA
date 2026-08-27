# VESTA — Business Health Specification

> **Executive Monitoring Engine, Dynamic KPI Configuration & Issue Prioritization**  
> *Governing the "How is my business doing?" Executive Experience*

---

## 1. Purpose & Guiding Principles

The **Business Health** module is VESTA's bounded executive monitoring layer. It answers the fundamental leadership question:

> *"How is my business performing right now against our goals and historical trends?"*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BUSINESS HEALTH OPERATING PRINCIPLES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. BOUNDED MONITORING    │ Monitors only what the user has configured to    │
│                          │ care about. Never pushes unsolicited AI spam.    │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 2. ADAPTIVE DEFAULTS     │ Preloads sensible KPIs based on detected data;   │
│                          │ never presents an empty configuration screen.    │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 3. ZERO FABRICATION      │ If data for a KPI is missing, states "Not        │
│                          │ Connected" rather than inventing placeholder math│
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 4. TOP 3 PRIORITIZATION  │ Focuses executive bandwidth on the 3 most urgent │
│                          │ issues while keeping lower-priority items handy. │
├──────────────────────────┼──────────────────────────────────────────────────┤
│ 5. DIRECT INVESTIGATION  │ Every KPI card and issue includes a 1-click      │
│                          │ bridge to launch a root-cause investigation.     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Business Understanding Engine (CEO of the Dataset)

VISON does **not** rely on static, hard-coded industry templates. Instead, VISON operates with a **Capability-Driven Business Understanding Engine** that determines:

> *"Given the business data currently available, what would a competent CEO need to know about the health of this business?"*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CEO OF THE DATASET CAPABILITY PIPELINE                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                1. Data Profiling & Column Role Detection
                   (Measures, Dimensions, Dates, Identifiers, Ambiguity Flags)
                                       │
                                       ▼
                2. Operational Capability Inference
                   (Financial, Sales, Customer, Returns, Inventory, Delivery, etc.)
                                       │
                                       ▼
                3. Supported KPI Registry Matching & Verification
                   (Verifies 100% of required fields exist per KPI definition)
                                       │
                                       ▼
                4. Dynamic Business Health Composition
                   (Instantiates calculable CEO-level indicators)
                                       │
                                       ▼
                5. KPI Catalog Availability State
                   (Active KPIs rendered; missing KPIs marked with missing fields)
```

---

### 2.1 Capability Detection & Ambiguity Flagging

Upon connecting a Google Sheet, VISON inspects the actual dataset:
1. **Identifies**: Columns, data types, date fields, dimensions, measures, identifiers, missingness, ambiguous fields.
2. **Infers Operational Capabilities**:
   - **Financial**: Revenue, gross profit, margin, costs.
   - **Sales / Commercial**: Unit volume, transactions, AOV, discounts.
   - **Customer**: Customer identifiers, repeat transactions, ratings/CSAT (if present).
   - **Returns / Friction**: Return flags, return quantities, refund amounts.
   - **Inventory**: Stock on hand, reorder points, warehouse identifiers.
   - **Delivery / Operations**: Dispatch dates, delivery dates, transit lead times, fulfillment hubs.
   - **Marketing**: Campaign identifiers, spend, attributed conversions.
   - **Employee**: Sales rep IDs, quota targets.
3. **Ambiguity Rule**: If an important field is ambiguous (e.g. `amount` without currency or gross/net clarity), the system flags it in the Data Dictionary rather than silently making arbitrary assumptions.

---

### 2.2 Supported KPI Registry & Activation Rules

1. **Strict Deterministic Verification**: A KPI is activated **only if 100% of its required mathematical columns exist**.
   - *Profit Margin* requires: Profit and Revenue.
   - *Return Rate* requires: Returned Units/Orders and Total Units/Orders.
   - *Average Order Value (AOV)* requires: Revenue and Order Count.
   - *Campaign ROI* requires: Campaign Cost and Attributed Revenue.
2. **No Generic Placeholders**: If data for a KPI is missing, it is **never fabricated**. In the configuration catalog, it appears as:  
   `⚪ Not Available — Required fields ['col_a', 'col_b'] not connected in Google Sheet.`
3. **Optional KPIs (e.g., Customer Satisfaction / CSAT)**:
   - Rendered on the dashboard **only if** explicit satisfaction fields (`csat_score`, `nps_score`, `rating`) exist.
   - Otherwise, the card is hidden and labeled in the catalog as *"Not Available"*.
4. **No Raw Arbitrary Columns as KPIs**: Only formally supported KPI definitions with validated formulas can be activated.

---

## 3. Explainable & Decomposable Business Health Score (0–100)

VISON implements a **Deterministic, Explainable Numerical Health Score (0–100)**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 EXPLAINABLE BUSINESS HEALTH SCORE ENGINE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  OVERALL HEALTH SCORE:  72 / 100  [ 🟡 WARNING ]                            │
│  "Enterprise health is penalized primarily by Gross Profit Margin drag"    │
├─────────────────────────────────────────────────────────────────────────────┤
│  DECOMPOSABLE CONTRIBUTION BREAKDOWN:                                       │
│  • Total Revenue        | Weight: 30% | Metric Score: 95/100 | +28.5 pts    │
│  • Gross Profit Margin  | Weight: 35% | Metric Score: 42/100 | +14.7 pts ⚠️ │
│  • Total Units Sold     | Weight: 20% | Metric Score: 90/100 | +18.0 pts    │
│  • Return Rate          | Weight: 15% | Metric Score: 72/100 | +10.8 pts    │
│  ─────────────────────────────────────────────────────────────────────────  │
│  TOTAL SCORE COMPOSITE  | 100%        |                      | 72.0 / 100   │
│  [Click any component row above to immediately launch an investigation!]    │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### 3.1 Mathematical Scoring Methodology

1. **Individual KPI Scoring ($S_i \in [0, 100]$)**:
   Each active KPI receives a normalized score from 0 to 100 using the strongest available evidence:
   - **Target Achievement** (when target exists): Ratio of actual to target adjusted for directionality.
   - **Historical Comparison** (when target does not exist): Variance against baseline comparison period (e.g. MoM, QoQ).
   - **Directionality**:
     - *Higher is Better* (Revenue, Profit Margin, Volume, CSAT): $S_i = \max(0, \min(100, 100 + \text{Variance \%} \times 2.0))$
     - *Lower is Better* (Return Rate, COGS, Delivery Delay): $S_i = \max(0, \min(100, 100 - \text{Variance \%} \times 2.0))$
     - *Target Range* (Inventory Weeks of Cover): $S_i = \max(0, \min(100, 100 - |\text{Actual} - \text{Target Midpoint}| \times 5.0))$

2. **Weighted Composite Overall Health Score**:
   $$\text{Overall Health Score} = \frac{\sum_{i \in \text{Active}} (S_i \times w_i)}{\sum_{i \in \text{Active}} w_i}$$
   *Rule: Missing KPIs do not silently become zero; the score normalizes over valid, active KPIs.*

3. **Contribution Points & Drag Points**:
   $$\text{Contribution Points}_i = S_i \times \frac{w_i}{\sum_{k} w_k}$$
   $$\text{Drag Points}_i = (100 - S_i) \times \frac{w_i}{\sum_{k} w_k}$$
   *Explains exactly how many points of the 100-point total were lost due to metric $i$.*

---

### 3.2 Traffic-Light Thresholds

| Score Range | Traffic-Light Badge | Executive Meaning |
| :--- | :--- | :--- |
| **85 – 100** | 🟢 **GREEN (HEALTHY)** | Operating at or above target baselines. Normal monitoring. |
| **70 – 84** | 🟡 **YELLOW (WARNING)** | Localized operational or margin drag identified. Attention recommended. |
| **0 – 69** | 🔴 **RED (CRITICAL)** | Severe target breach or operational contraction. Immediate executive investigation required. |

---

### 3.3 Interactive Contribution Row Investigation Triggers
Every row in the contribution breakdown table includes a direct **`[Investigate]`** action that pre-seeds the conversation with the exact point drag.

---

## 4. Issue Detection & Prioritization (The Official BuildFest Formula)

VISON evaluates every operational anomaly using the **Official Deterministic Issue Priority Formula**:

$$\text{Priority Score} = 0.45 \times \text{Financial Impact} + 0.25 \times \text{Target Deviation} + 0.20 \times \text{Rate of Change} + 0.10 \times \text{Business Criticality}$$

---

### 4.1 Normalization When Components Are Unavailable

> [!IMPORTANT]
> If a component cannot be computed (e.g., Financial Impact is unavailable because cost fields are missing, or Target Deviation cannot be computed because no target is configured), **the system does not treat it as zero**. Instead, the score normalizes across supported components:
> $$\text{Normalized Priority Score} = \frac{\sum_{c \in \text{Available}} (\text{Weight}_c \times \text{Score}_c)}{\sum_{c \in \text{Available}} \text{Weight}_c}$$

| Component | Weight | Range | Definition | Availability Handling |
| :--- | :--- | :--- | :--- | :--- |
| **Financial Impact** | `0.45` | $[0.0, 1.0]$ | Monetary exposure relative to enterprise scale. | If missing monetary columns: mark unavailable and normalize over remaining 3 factors. Display: *"Financial impact: Not reliably calculable from available data."* |
| **Target Deviation** | `0.25` | $[0.0, 1.0]$ | Degree of variance from configured target. | If no target set: evaluate period-over-period baseline or normalize over remaining factors. |
| **Rate of Change** | `0.20` | $[0.0, 1.0]$ | Velocity of decay ($|\text{Metric}_t - \text{Metric}_{t-1}|$). | Requires date dimension; if missing, normalize. |
| **Business Criticality** | `0.10` | $[0.0, 1.0]$ | Domain weight (Core Financial = 1.0, Returns = 0.85, Volume = 0.75). | Always available from KPI category. |

---

### 4.2 Required Stored Issue Data Contract

Every detected issue retains:
- `component_scores`: Object storing individual normalized scores.
- `component_availability`: Booleans declaring which components were calculable.
- `normalized_priority_score`: Final composite score ($[0.0, 1.0]$).
- `ranking_reason`: Human-readable explanation of why this issue ranked in Top 3.
- `financial_impact_label`: Labeled explicitly as *"Estimated impact: [amount]"* or *"Not reliably calculable from available data"*. Never fabricated.

---

### 4.3 Top 3 Issues Hero Display vs. "View More" Drawer
- **Top 3 Issues Hero Banner**: Top 3 ranked anomalies populate high-visibility executive alert cards.
- **"View More Issues" Drawer**: Anomalies ranked 4+ route to an expandable slide-out drawer.

---

## 5. Business Storyline (Executive Homepage Narrative)

├──────────────┼──────────────────────────────────────────────────────────────┤
│ 🔵 WATCH     │ "Are delivery fulfillment delays in Port Harcourt causing    │
│              │  digital web order cancellations?"                           │
│              │  Estimated Impact: -₦820,000 lost checkout value             │
│              │  [ 🔍 Investigate Question ]                                │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

### 6.1 Question Engine Operating Rules
* **Deterministic Rule Generation**: Questions are synthesized directly from Health Score contribution losses, Top 3 Issues, and target deviations.
* **Tiered Priority**: Grouped into **`CRITICAL`**, **`IMPORTANT`**, and **`WATCH`** tiers.
* **Estimated Financial Impact**: Every question displays its calculated monetary exposure.
* **1-Click Investigation Bridge**: Clicking **`[Investigate Question]`** immediately transitions into the 3-column Investigation Workspace with the root analytical query pre-loaded and executed.

---

## 7. User Customization & Controls

The executive retains complete control over Business Health configuration:

| Action | User Mechanism | Effect |
| :--- | :--- | :--- |
| **Add KPI** | Click `[+ Add Indicator]` → select from profiled measures | Creates a new KPI card populated with calculated baseline. |
| **Remove KPI** | Click `[... Settings]` on card → `[Hide / Remove]` | Removes card from dashboard; metric remains in dictionary. |
| **Reorder KPIs** | Drag-and-drop handles or `[Move Left / Right]` | Updates `display_order` in Firestore workspace config. |
| **Set Target** | Click KPI value → Enter target (e.g., `₦35,000,000` or `25%`) | Recalculates variance and badge status immediately. |
| **Change Comparison** | Toggle dropdown on card: `MoM` \| `QoQ` \| `YoY` \| `Target` | Updates baseline period used for delta calculations. |

---

## 8. "Why is this Red / Green?" Investigation Bridge

Every KPI card features a contextual trigger: **"Why is this [Color]?"**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE "WHY IS THIS RED?" INTERACTION                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ User clicks: [Why is this Red?] on "Gross Margin (14.2%)"                   │
│                                                                             │
│ System Action:                                                              │
│ 1. Initializes a new Investigation thread: `inv_health_margin_01`           │
│ 2. Pre-seeds active context: `KPI: Gross Profit Margin, Period: July 2025`  │
│ 3. Executes deterministic multi-dimensional breakdown (Region, Category)   │
│ 4. Opens Investigation view with first analysis already rendered!           │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Dynamic Data Refresh Architecture (Manual Refresh for P0)

VISON implements a deterministic **Manual Refresh Architecture** for the MVP to guarantee predictable Google Sheets API usage, eliminate race conditions, and give the executive absolute control over when analysis is updated.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MANUAL REFRESH PIPELINE                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
            1. User Clicks [🔄 Refresh Data] in Navigation Header
                                       │
                                       ▼
            2. UI Sets Sync Status -> SYNCING (Spinner active)
                                       │
                                       ▼
            3. Backend Ingests Latest Rows via Google Sheets API v4
                                       │
                                       ▼
            4. Profiling Engine Recalculates Data Dictionary & Capabilities
                                       │
                                       ▼
            5. Health Engine Recalculates Active KPIs & Baseline Variances
                                       │
                                       ▼
            6. Priority Engine Re-evaluates & Re-ranks Top 3 Issues
                                       │
                                       ▼
            7. UI Sets Sync Status -> READY & Updates Last Synced Timestamp
```

---

### 8.1 Telemetry & Status UI Indicators
* **`[🔄 Refresh Data]` Action Button**: Located in the top executive navigation bar; triggers the refresh pipeline on demand.
* **`Last Synced: [Timestamp]`**: High-visibility time indicator (e.g., *"Last Synced: 2 mins ago"* or *"14:05 UTC"*).
* **`Sync Status` Indicator**:
  - 🟢 **`READY`**: Cache is warm and synchronized with Google Sheets.
  - 🟡 **`SYNCING`**: Ingestion and analytical recalculation in progress.
  - 🔴 **`ERROR`**: Network or permissions failure with actionable error tooltip.

---

### 8.2 Post-MVP Deferrals
* **Background Polling**: Background cron timers checking Google Sheets are **deferred to Post-MVP**.
* **Real-Time Webhook Listeners**: Google Drive push notifications / event-driven webhooks are **deferred to Post-MVP**.
* **Automatic Periodic Refresh**: Timed automatic background refreshes are **deferred to Post-MVP**.
