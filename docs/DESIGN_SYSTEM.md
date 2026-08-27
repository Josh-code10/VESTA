# VESTA — Executive Design System & Visual Constitution

> **The Design Architecture, Visual Language & Component Specification for VESTA**  
> *Executive-First · Evidence-Grounded · Minimal Cognitive Load · High-Density Precision*

---

## 1. Design Philosophy

VESTA is purpose-built for executive decision-makers (CEOs, CFOs, COOs, VPs). It is designed to stand alongside modern, world-class enterprise software like **Linear**, **Tableau Pulse**, **ThoughtSpot**, and **Notion**. It deliberately avoids the visual chaos of traditional 50-chart legacy BI dashboards and the deceptive vagueness of chat-only AI wrappers.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE CORE DESIGN TENETS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. DESIGNED FOR CEOs, NOT ANALYSTS                                          │
│    Executives need answers and directional clarity in 5 seconds.            │
│    Complexity is tucked into progressive disclosure drawers, not dumped on  │
│    the homepage.                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. STORY BEFORE CHARTS                                                      │
│    Narrative synthesis guides the executive eye first; structured data and  │
│    charts provide immediate mathematical proof underneath.                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. EVIDENCE OVER DECORATION                                                 │
│    Zero gratuitous illustrations, zero AI sparkle gimmicks. Every pixel,    │
│    border, badge, and sparkline exists to communicate verifiable truth.     │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. ONE EXECUTIVE QUESTION PER SCREEN                                        │
│    • Business Health  → "How is my business doing right now?"               │
│    • Investigation    → "Why is this happening and what is driving it?"     │
│    • Executive Report → "What is the boardroom synthesis and next action?"  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Do / Don't Design Rules

| Design Area | ✅ DO (The Vison Standard) | ❌ DON'T (Legacy / Gimmick Patterns) |
| :--- | :--- | :--- |
| **Color Usage** | Use muted slates with purposeful semantic accents (emerald, amber, crimson, purple). | Paint the interface in a rainbow of bright colors with no functional hierarchy. |
| **Red Alerts** | Reserve Crimson Red strictly for critical negative variances ($> 15\%$ loss) or critical system errors. | Use red for minor drops, general buttons, or decorative styling. |
| **AI Indication** | Use subtle, deep Indigo/Purple (`#5B4CF0`) for tool execution chips and active AI reasoning lineage. | Use pulsating rainbow gradients, floating chat bubbles, or glowing magical sparkles. |
| **Information Density** | Provide high-density, crisp tabular numbers with subtle gridlines and clear units. | Waste executive screen real estate on giant empty cards and oversized decorative graphics. |
| **Data Hierarchy** | State the executive finding first, then the epistemic badge, then the underlying chart and formula breadcrumb. | Show a standalone chart with no title, no baseline target, and no analytical context. |
| **Interactivity** | Every number, variance, and anomaly must have a 1-click `[Investigate]` or `[Show Me]` bridge. | Present static numbers that trap the executive without drill-down capabilities. |

---

## 2. Brand Personality & Executive Tone

VISON communicates like a **Tier-1 McKinsey partner or Principal BI Architect**: calm, razor-sharp, objective, transparent, and respectful of executive time.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            BRAND PERSONALITY                                │
├──────────────┬──────────────────────────────────────────────────────────────┤
│ CALM         │ Never alarms or sensationalizes. Presents volatility with    │
│              │ mathematical composure and clear context.                    │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ PRECISE      │ Replaces vague words like "a lot" or "significant drop" with │
│              │ exact numbers: "₦4.5M (-42.7% MoM)".                         │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ CONFIDENT    │ Direct and decisive when data is complete; never hides       │
│              │ behind ambiguous analyst jargon.                             │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ TRANSPARENT  │ Explicitly states what is proven, what is inferred, and what │
│              │ is unrecorded in the dataset.                                │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ MODERN       │ Sharp typography, subtle glassmorphic borders, refined dark  │
│              │ mode contrast, and responsive spacing.                       │
├──────────────┼──────────────────────────────────────────────────────────────┤
│ HUMAN        │ Synthesizes natural business English tailored for executive  │
│              │ meetings, not raw SQL queries or JSON dumps.                 │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

### 2.1 Interface Voice Examples
* ❌ *Bad (Alarmist / Vague)*: *"Warning! Sales in Lagos are crashing terribly! You should fix this right now!"*
* ❌ *Bad (Jargon / Lazy)*: *"Executed SELECT sum(gp) GROUP BY region. Lagos yielded variance of -0.4274. Check CSV."*
* ✅ **Vison Standard**: **`[FACT]`** *"Gross profit margin in Lagos physical retail fell from 24.8% to 14.2% in July (-42.7% vs Target). Home Appliances accounted for ₦3.8M (84.4%) of this shortfall."*

---

## 3. Color System

VISON utilizes a tailored, accessible executive color palette built upon dark slate neutrals with precision-engineered semantic accents.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            EXECUTIVE COLOR PALETTE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  PRIMARY BRAND & AI (Purple / Indigo Family)                                │
│  • Primary 500  : #5B4CF0  (Primary Brand, Active Focus, CTA Accent)        │
│  • Primary 600  : #4A3BC9  (Hover State, Pressed Controls)                 │
│  • Primary 100  : #EEF0FD  (Light Purple Tint, Active AI Container BG)     │
│  • Primary Glow : rgba(91, 76, 240, 0.15)                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  EXECUTIVE NEUTRALS (Slate / Zinc Scale)                                    │
│  • Slate 950 (Dark Canvas BG)   : #0B0F17                                   │
│  • Slate 900 (Surface Card BG)  : #111827                                   │
│  • Slate 850 (Elevated / Drawer): #162032                                   │
│  • Slate 800 (Card Border)      : #1F293D                                   │
│  • Slate 700 (Subtle Divider)   : #334155                                   │
│  • Slate 400 (Secondary Label)  : #94A3B8                                   │
│  • Slate 200 (Primary Body Text): #E2E8F0                                   │
│  • Slate 50  (Headings / Values): #F8FAFC                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  SEMANTIC STATUS & EPISTEMIC ACCENTS                                        │
│  • Healthy 🟢 (Emerald Green)  : #10B981 | BG: rgba(16, 185, 129, 0.12)     │
│  • Watch 🟡 (Amber Yellow)     : #F59E0B | BG: rgba(245, 158, 11, 0.12)     │
│  • Critical 🔴 (Crimson Red)   : #EF4444 | BG: rgba(239, 68, 68, 0.12)      │
│  • Info 🔵 (Sky Blue)          : #0EA5E9 | BG: rgba(14, 165, 233, 0.12)     │
│  • Discovery 🟣 (Violet / AI)  : #8B5CF6 | BG: rgba(139, 92, 246, 0.12)     │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Strict Color Rules
1. **Never use Crimson Red (`#EF4444`) for styling or neutral buttons.** Red indicates a confirmed operational breach or critical deficit.
2. **Use Purple (`#5B4CF0` / `#8B5CF6`) exclusively for AI actions, active lineage nodes, and primary navigation focus.**
3. **Muted Gray/Slate (`#94A3B8`) handles 80% of secondary metadata** (timestamps, column counts, breadcrumbs) to prevent visual overload.

---

## 4. Typography System

* **Primary Font Family**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
* **Monospace / Calculation Font**: `"JetBrains Mono", "Fira Code", monospace` (for formula breadcrumbs, IDs, and financial delta tables)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TYPOGRAPHY SCALE                                 │
├──────────────┬──────────┬────────┬─────────┬──────────┬─────────────────────┤
│ Token        │ Size     │ Weight │ Line Ht │ Tracking │ Usage               │
├──────────────┼──────────┼────────┼─────────┼──────────┼─────────────────────┤
│ Display      │ 32px/2rem│ 700    │ 40px    │ -0.025em │ Health Score Gauge  │
│ Heading 1    │ 24px     │ 700    │ 32px    │ -0.020em │ Main Page Titles    │
│ Heading 2    │ 18px     │ 600    │ 26px    │ -0.015em │ Card & Drawer Heads │
│ Heading 3    │ 15px     │ 600    │ 22px    │ -0.010em │ Sub-sections        │
│ KPI Value    │ 28px     │ 700    │ 34px    │ -0.030em │ Metric Numbers      │
│ Body Large   │ 15px     │ 400/500│ 24px    │ 0.000em  │ Storyline & Brief   │
│ Body Regular │ 13px     │ 400    │ 20px    │ 0.000em  │ Data Tables, Chat   │
│ Caption / Tag│ 11px     │ 600    │ 16px    │ +0.050em │ Epistemic Badges    │
│ Mono Code    │ 12px     │ 500    │ 18px    │ 0.000em  │ Formulas, Lineage   │
└──────────────┴──────────┴────────┴─────────┴──────────┴─────────────────────┘
```

---

## 5. Layout Grid & Spacing System

* **Grid System**: 12-Column fluid responsive grid with fixed 24px gutters.
* **Max Content Width**: `1440px` (optimized for 13"–16" MacBook Pro and 27" 4K external monitors).
* **Spacing Scale (8pt System)**:

```
  2xs: 4px   │  xs: 8px   │  sm: 12px  │  md: 16px
  lg: 24px   │  xl: 32px  │  2xl: 48px │  3xl: 64px
```

* **Surface Elevation & Glassmorphism**:
  - `Surface 1 (Base Cards)`: Background `#111827`, Border `1px solid #1F293D`, Radius `12px`, Shadow `0 4px 20px -2px rgba(0, 0, 0, 0.45)`.
  - `Surface 2 (Elevated Drawers & Modals)`: Background `rgba(17, 24, 39, 0.95)`, Backdrop Filter `blur(12px)`, Border `1px solid #334155`, Radius `16px`, Shadow `0 20px 40px -4px rgba(0, 0, 0, 0.70)`.

---

## 6. Navigation Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            TOP HEADER TELEMETRY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ [VISON Logo] │ [Workspace: NexaSphere Retail ▼] │ [Live Google Sheet 🟢 READY]│
│              │ [Last Synced: 2 mins ago]        │ [🔄 Refresh Data Button]    │
└─────────────────────────────────────────────────────────────────────────────┘
┌──────────────┬──────────────────────────────────────────────────────────────┐
│ SIDEBAR (240)│ MAIN CONTENT AREA (1200px Max)                               │
├──────────────┤                                                              │
│ • Home       │                                                              │
│ • Health     │                                                              │
│ • Investigate│                                                              │
│ • Reports    │                                                              │
│ • Settings   │                                                              │
└──────────────┴──────────────────────────────────────────────────────────────┘
```

---

## 7. Component Library Visual Specifications

### 7.1 Business Storyline Card
* **Purpose**: High-density 4-bullet executive briefing ($< 25$s read time) synthesized from deterministic health outputs.
* **Hierarchy**: Top border accent (Purple `#5B4CF0`), bold status verdict, 3 structured bullet points with inline bold metrics, followed by 1-click prompt pills.
* **Interaction**: Hovering over a prompt pill triggers an active highlight; clicking immediately opens that investigation.

### 7.2 Explainable Health Score Card
* **Purpose**: Displays the 0–100 composite score, traffic-light badge (🟢, 🟡, 🔴), and decomposable contribution breakdown table.
* **Hierarchy**: Circular radial gauge on the left; weighted contribution rows on the right.
* **Interaction**: Each row features a 1-click **`[Investigate]`** action that pre-seeds the conversation with the exact point drag.

### 7.3 KPI Indicator Card
* **Purpose**: Displays individual metric performance, comparison delta, baseline target, and status badge.
* **Hierarchy**: Metric name & category chip top; large value center; trend chip and sparkline bottom; top-right `[Why is this Red/Green?]` trigger.

### 7.4 Top 3 Issues Hero Banner
* **Purpose**: Highlights the top 3 critical anomalies ranked by the official priority formula:
  $$\text{Priority Score} = 0.45 \times \text{FI} + 0.25 \times \text{TD} + 0.20 \times \text{RC} + 0.10 \times \text{BC}$$
* **Hierarchy**: High-visibility Crimson/Amber alert borders, monetary leakage badge, primary driver breakdown, and dual action buttons: **`[Investigate]`** and **`[Show Evidence]`**.

### 7.5 Epistemic Status Badges
* **`[FACT]`**: Emerald Green (`#10B981`) pill with lock icon. Directly calculated arithmetic truth.
* **`[OBSERVATION]`**: Blue (`#0EA5E9`) pill with chart icon. Statistically verified pattern/ranking.
* **`[INFERENCE]`**: Purple (`#8B5CF6`) pill with lightbulb icon. Multi-dimensional deduction.
* **`[HYPOTHESIS]`**: Amber (`#F59E0B`) pill with question icon. Plausible external assumption.
* **`[UNKNOWN]`**: Gray/Crimson (`#EF4444`) pill with alert icon. Missing or unrecorded data.

### 7.6 Confidence Badge
* **`HIGH (95-100%)`**: Filled green dot. Complete sample, zero null ambiguity.
* **`MEDIUM (75-94%)`**: Amber hollow circle. Partial dimensions or inferred timestamps.
* **`LOW (<75%)`**: Crimson warning triangle. Sparse records or unverified proxy metric.

---

## 8. Business Health Screen Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. STORYLINE HERO BRIEFING (4 Bullets | Status, Win, Risk, Action Links)    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. HEALTH SCORE (0-100 Gauge)  │  3. TOP 3 CRITICAL ISSUES (Alert Banner)   │
│    • Decomposable Breakdown    │     • Issue #1 (Top Critical Anomaly 🔴)   │
│    • Weighted Drag Points      │     • Issue #2 (Secondary Anomaly 🟡)      │
│    • Direct Investigate Links  │     • Issue #3 (Third Anomaly 🟡)          │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. ADAPTIVE KPI STRIP (4-6 Column Dynamic Cards)                            │
│    [ Revenue 🟢 ]  [ Margin 🔴 ]  [ Units Sold 🟢 ]  [ Return Rate 🟡 ]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. RECENT INVESTIGATIONS & AUDIT TRAIL                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Investigation Workspace (The 3-Column WOW Layout)

The **Investigation Workspace** is VISON's crown jewel: a synchronized 3-column command center designed for deep root-cause discovery.

```
┌─────────────────┬───────────────────────────────────┬───────────────────────┐
│ LEFT COLUMN     │ CENTER COLUMN                     │ RIGHT COLUMN          │
│ (280px Fixed)   │ (Flexible ~600-750px)             │ (380-450px Collapsible│
├─────────────────┼───────────────────────────────────┼───────────────────────┤
│ EVIDENCE TRAIL  │ CONVERSATION & PROOF HUB          │ EVIDENCE DRAWER       │
│ TREE            │                                   │ (Interactive Proof)   │
│                 │ • User Question                   │                       │
│ 🌳 Root Node    │ • Epistemic Tag [FACT]            │ • Full Data Table     │
│   ├── Branch 1A │ • Deterministic Text Synthesis    │ • Dynamic Chart Spec  │
│   │   └── Leaf  │ • Tool Execution Chip             │ • Formula Breadcrumb  │
│   └── Branch 1B │ • Embedded Summary Table / Chart  │ • Missing Data Notice │
│                 │ • Action Pills [Show Me] [Branch] │ • Confidence Rating   │
│                 │                                   │                       │
│ [Add Branch +]  │ [Message Input: "Ask Vison..."]   │ [Export to Report]    │
└─────────────────┴───────────────────────────────────┴───────────────────────┘
```

### 9.1 Synchronized State Rules
1. **Node Click in Left Column**: Instantly updates Center Column to that stage's transcript and restores Right Column's active chart and data filters.
2. **"Show Me" Click in Center Column**: Slides out or refreshes the Right Column Evidence Drawer with the exact formula breadcrumb and table slice.
3. **Follow-Up Query in Center Column**: Automatically attaches a new child node to the currently selected parent node in the Left Column.

---

## 10. Evidence Trail Visual Specification

The **Evidence Trail** transforms ephemeral chatbot chat logs into an auditable, visual reasoning tree.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EVIDENCE TRAIL TREE COMPONENT                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  ● [ROOT] "July Margin Collapse" ─────────────────────── 🟢 FACT (Score 72) │
│    │                                                                        │
│    ├─── ● [BRANCH 1] "Lagos Category Breakdown" ──────── 🔵 OBSERVATION     │
│    │      │                                                                 │
│    │      ├─── ● [LEAF 1A] "Ikeja AC-902 Discounting" ── 🟣 INFERENCE       │
│    │      │                                                                 │
│    │      └─── ● [LEAF 1B] "Logistics Return Codes" ──── 🔵 OBSERVATION     │
│    │                                                                        │
│    └─── ○ [BRANCH 2] "Abuja Performance (Baseline)" ─── 🟢 FACT            │
└─────────────────────────────────────────────────────────────────────────────┘
```

* **Node States**:
  - `Default`: Slate background `#111827`, border `#1F293D`, subtle connector lines `#334155`.
  - `Active / Selected`: Purple border `#5B4CF0`, subtle glow `rgba(91, 76, 240, 0.25)`, highlighted text.
  - `Severity Marker`: Small dot indicator (🟢 Green, 🟡 Amber, 🔴 Red) reflecting metric health at that node.
* **Lineage Tooltips**: Hovering over any node displays: Tool name (`group_and_aggregate`), execution latency (`48ms`), and result ID (`res_agg_9012`).

---

## 11. Evidence Drawer Specification

The **Evidence Drawer** provides the visual, auditable proof backing every statement made by the AI.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EVIDENCE DRAWER SECTIONS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. HEADER: Finding Title + Epistemic Tag (`[FACT]`) + Result ID             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. DYNAMIC VISUALIZATION (Recharts SVG: Waterfall, Bar, or Sparkline)       │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. UNDERLYING DATA SLICE (High-density sortable table of top SKUs / stores) │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. FORMULA BREADCRUMB (Auditable Math):                                     │
│    `Margin % = ((Revenue - COGS - Return_Losses) / Revenue) * 100`         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. DATA BOUNDARY AUDIT:                                                     │
│    • Connected Fields : Sales, Orders, Returns, Reason Codes, Stores        │
│    • Missing Fields   : Customer Satisfaction (CSAT), Competitor Pricing    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 6. ACTIONS: [Bookmark for Executive Report] · [Download CSV Slice]          │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Chart & Visualization Guidelines

1. **Allowed Visualizations**:
   - **Bar / Column Charts**: Ideal for category rankings, regional comparisons, and discrete period delta comparisons.
   - **Line / Area Charts**: Ideal for multi-month revenue and margin trends over time.
   - **Waterfall Charts**: Mandatory for margin bridge decomposition (Revenue $\rightarrow$ Discounts $\rightarrow$ Returns $\rightarrow$ Net Margin).
   - **Sparklines**: Embedded inside KPI cards for rapid 6-month trend scanning.
   - **High-Density Tables**: Striped, monospace numbers, right-aligned currency values.
2. **Forbidden Visualizations**:
   - ❌ **Pie / Donut Charts with $> 4$ slices** (causes cognitive delay; use stacked bar instead).
   - ❌ **3D Charts, Radar Charts, or Bubble Charts** (distorts executive perception).
   - ❌ **Gauges with uncalibrated dials** (only the Explainable Health Score uses a structured 0-100 radial scale).

---

## 13. Motion & Microinteractions

VISON enforces a strict **sub-250ms motion budget**. Animations must provide spatial orientation, never decorative delay.

* **Allowed Microinteractions**:
  - `Drawer Slide`: 200ms `cubic-bezier(0.16, 1, 0.3, 1)` smooth ease-out.
  - `Node Expand/Collapse`: 150ms tree branch accordion transition.
  - `Score Count-Up`: 400ms numeric odometer roll when Business Health loads.
  - `Status Badge Pulse`: Subtle 2s opacity cycle for `[SYNCING]` state only.
* **Forbidden Motions**:
  - ❌ Bouncing buttons or parallax scrolling effects.
  - ❌ Spinning AI icons or glowing rainbow aura animations.

---

## 14. Accessibility & Contrast Standards

* **Contrast Ratio**: All text and badges adhere strictly to **WCAG AA ($4.5:1$) and AAA ($7:1$)** against dark slate canvas backgrounds.
* **Color-Blind Safety**: Every status indicator combines **Color + Shape + Text Icon**:
  - 🟢 Healthy: Green + Circle + Checkmark
  - 🟡 Warning: Amber + Square + Triangle Exclamation
  - 🔴 Critical: Red + Octagon + Solid Slash
* **Keyboard Navigation**:
  - `Tab` / `Shift+Tab`: Full focus traversal across KPI cards, issue banners, and chat inputs.
  - `Cmd/Ctrl + K`: Universal search & investigation launcher.
  - `Esc`: Dismisses active Evidence Drawer or Executive Report modal.

---

## 15. Implementation Tokens for Antigravity

These standardized design tokens and React component names must govern frontend implementation:

### 15.1 Reusable React Component Inventory
```typescript
// Core Layout & Header
<ExecutiveHeader />
<SidebarNavigation />
<WorkspaceSelector />
<DataSourceStatusBadge />
<ManualRefreshButton />

// Business Health & Score
<BusinessStorylineCard />
<ExplainableHealthScoreGauge />
<HealthScoreDecompositionTable />
<Top3IssuesHeroBanner />
<AdaptiveKpiGrid />
<KpiIndicatorCard />
<ViewMoreIssuesDrawer />
<KpiCustomizerModal />

// Investigation & Evidence Trail
<InvestigationWorkspaceLayout />
<EvidenceTrailTree />
<EvidenceTrailNode />
<ConversationFeed />
<EpistemicStatusBadge />
<ToolExecutionChip />
<AmbiguityClarificationPrompt />
<InsufficientDataNotice />

// Evidence & Reporting
<EvidenceDrawer />
<DynamicEvidenceChart />
<FormulaBreadcrumbView />
<DataBoundaryAuditBox />
<ExecutiveReportModal />
<PrintableReportView />
```

### 15.2 CSS Custom Properties / Design Tokens (`src/styles/tokens.css`)
```css
:root {
  /* Canvas & Surfaces */
  --vison-bg-canvas: #0b0f17;
  --vison-bg-surface-1: #111827;
  --vison-bg-surface-2: #162032;
  --vison-border-card: #1f293d;
  --vison-border-divider: #334155;

  /* Typography Colors */
  --vison-text-primary: #f8fafc;
  --vison-text-secondary: #e2e8f0;
  --vison-text-muted: #94a3b8;

  /* Primary Brand & AI */
  --vison-primary: #5b4cf0;
  --vison-primary-hover: #4a3bc9;
  --vison-primary-tint: rgba(91, 76, 240, 0.12);

  /* Semantic Statuses */
  --vison-healthy: #10b981;
  --vison-healthy-bg: rgba(16, 185, 129, 0.12);
  --vison-warning: #f59e0b;
  --vison-warning-bg: rgba(245, 158, 11, 0.12);
  --vison-critical: #ef4444;
  --vison-critical-bg: rgba(239, 68, 68, 0.12);
  --vison-info: #0ea5e9;
  --vison-info-bg: rgba(14, 165, 233, 0.12);

  /* Radii & Shadows */
  --vison-radius-sm: 6px;
  --vison-radius-md: 12px;
  --vison-radius-lg: 16px;
  --vison-shadow-card: 0 4px 20px -2px rgba(0, 0, 0, 0.45);
  --vison-shadow-modal: 0 20px 40px -4px rgba(0, 0, 0, 0.70);
}
```

---

> [!NOTE]
> `DESIGN_SYSTEM.md` is the authoritative visual constitution for VISON. All frontend components built during Phase 2 will adhere strictly to these color, typography, spacing, and interaction specifications.
