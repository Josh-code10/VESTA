# VESTA ANALYTICAL INTELLIGENCE SPECIFICATION

This document is the authoritative specification for VESTA's Analytical Intelligence Engine.

VESTA does NOT ask an LLM to generate charts or compute numbers.
VESTA routes natural-language executive questions to deterministic analytical pattern contracts, executes numerical computations in Python/Pandas, maps exact chart visualizations via the Visualization Router, and synthesizes non-prescriptive strategic business implications.

---

## NON-NEGOTIABLE ARCHITECTURAL CONTRACT

1. **Deterministic Computation**: All metrics, period comparisons, ranking, contribution percentages, waterfall decompositions, correlations, and cross-tabulations MUST be computed in Python/Pandas.
2. **LLM Role**: Gemini is restricted to:
   - Intent classification & question parsing
   - Translating natural language to pattern parameters
   - Interpreting deterministic Python results
   - Formulating non-prescriptive executive business implications
3. **5-Part Response Chain**: Every analytical response MUST progress through:
   `FINDING` → `EVIDENCE` → `INTERPRETATION` → `BUSINESS IMPLICATION` → `MANAGEMENT ATTENTION` → `LIMITATION`

---

## THE 10 HACKATHON P0 ANALYTICAL PATTERN CONTRACTS

### PATTERN 1: `profit_decline_driver`
- **ID**: `profit_decline_driver`
- **NAME**: Profit Decline Decomposition & Root Cause Analysis
- **PURPOSE**: Determine why profit or profit margin deteriorated across sequential time periods despite volume or revenue growth.
- **TRIGGERS**:
  - "Why did profit fall?"
  - "Why is profit declining?"
  - "What's causing the profit decline?"
  - "Why is margin down?"
  - "Why did profit margin decrease?"
  - "Why did profit margin decline in the second half of the year despite revenue growth?"
- **REQUIRED DATA**: `gross_revenue`, `gross_profit` OR `total_cost`, `date`
- **OPTIONAL DATA**: `region`, `store_name`, `product_name`, `category`, `discount_amount`, `return_count`
- **PRECONDITIONS**: Dataset contains at least two sequential time periods or date slices.
- **DETERMINISTIC ANALYSIS**:
  1. Filter dataset into current vs previous period.
  2. Compute total Revenue, Profit, and Margin % change.
  3. Group data by primary candidate dimension (`region`, `category`, `store_name`).
  4. Decompose absolute profit delta for each dimension slice.
  5. Rank slices by negative contribution to total profit variance.
  6. Calculate cumulative percentage contribution of top variance driver.
- **PRIMARY VISUALIZATION**: `waterfall`
- **SECONDARY VISUALIZATION**: `line` (Period Trend)
- **SUPPORTING PIVOT**: `Row: Dimension, Col: Metric Delta`
- **EPISTEMIC RULE**: Use contribution language ("Lagos accounted for 61% of total profit decline"). Do not claim external factors caused the decline unless recorded in data.
- **LIMITATIONS**: "Causes outside connected transaction records (e.g. inflation, competitor pricing) cannot be inferred."

---

### PATTERN 2: `profitability_tradeoff`
- **ID**: `profitability_tradeoff`
- **NAME**: Promotional Discounting & Margin Trade-off Analysis
- **PURPOSE**: Determine whether sales volume or revenue growth is being achieved at the expense of unit profitability due to excessive discounting.
- **TRIGGERS**:
  - "Are discounts hurting profit?"
  - "Are we sacrificing margin for sales?"
  - "Is discounting helping revenue?"
  - "Are discounts too high?"
  - "Are higher discounts actually worth it?"
  - "Are discounts helping us grow sales, or hurting profitability?"
- **REQUIRED DATA**: `gross_revenue`, `gross_profit` OR `total_cost`, `discount_amount` OR `discount_depth_pct`
- **OPTIONAL DATA**: `product_name`, `category`, `store_name`, `region`, `sales_channel`
- **PRECONDITIONS**: Discount depth % and profit margin % are numeric fields.
- **DETERMINISTIC ANALYSIS**:
  1. Compute `discount_depth_pct` = (`discount_amount` / `gross_revenue`) * 100 where needed.
  2. Compute `gross_margin_pct` = (`gross_profit` / `gross_revenue`) * 100.
  3. Group dataset by dimension (`sales_channel` or `product_name`).
  4. Calculate Pearson correlation between discount depth % and gross margin %.
  5. Identify high-discount (>10%) / low-margin (<12%) outlier clusters.
- **PRIMARY VISUALIZATION**: `scatter` (X: Discount Depth %, Y: Profit Margin %, Size: Gross Revenue)
- **SECONDARY VISUALIZATION**: `waterfall` (Margin Erosion Breakdown)
- **SUPPORTING PIVOT**: `Row: Channel/Category, Col: Avg Discount %, Margin %`
- **EPISTEMIC RULE**: Use association language ("High discount depth correlates with reduced unit margin"). Never claim discounting caused margin loss without controlled experiment data.
- **LIMITATIONS**: "Correlation between discount depth and margin does not establish direct causal price elasticity."

---

### PATTERN 3: `return_driver`
- **ID**: `return_driver`
- **NAME**: Product & Operational Return Concentration (Pareto Analysis)
- **PURPOSE**: Identify which specific products, categories, or stores account for the vast majority of product returns and return loss value.
- **TRIGGERS**:
  - "Which products are driving returns?"
  - "Why are returns high?"
  - "What is causing the return problem?"
  - "Which products account for most returns?"
  - "Where are return losses coming from?"
  - "Which products account for most of our return losses?"
- **REQUIRED DATA**: `return_count` OR `returned_units` OR `return_flag`, `product_name` OR `category`
- **OPTIONAL DATA**: `store_name`, `region`, `return_reason`, `date`
- **PRECONDITIONS**: At least 5 distinct product/category records exist.
- **DETERMINISTIC ANALYSIS**:
  1. Aggregate total `return_count` and return rate % by dimension (`product_name`).
  2. Sort dimensions in descending order of total return volume.
  3. Compute cumulative share % of total return volume across ranked items.
  4. Identify 80/20 Pareto threshold (top N items accounting for ~80% of return losses).
- **PRIMARY VISUALIZATION**: `bar` (Primary Column) + `line` (Cumulative Pareto % Overlay)
- **SECONDARY VISUALIZATION**: `horizontal_bar` (Return Rate Ranking)
- **SUPPORTING PIVOT**: `Row: Product/Category, Col: Sales Units, Return Units, Return Rate %`
- **EPISTEMIC RULE**: State exact measured return counts and percentage contributions.
- **LIMITATIONS**: "Return reason metadata is required to distinguish defective goods from buyer remorse."

---

### PATTERN 4: `store_profitability`
- **ID**: `store_profitability`
- **NAME**: Store & Location Commercial Efficiency Matrix
- **PURPOSE**: Distinguish high-volume revenue leaders from true bottom-line profitability leaders across physical stores or sales channels.
- **TRIGGERS**:
  - "Which stores are most profitable?"
  - "Which stores drive profitability?"
  - "Which stores generate revenue but weak profit?"
  - "Which stores are performing well?"
  - "Which stores are driving the company's profitability, not just revenue?"
- **REQUIRED DATA**: `store_name` OR `region`, `gross_revenue`, `gross_profit`
- **OPTIONAL DATA**: `gross_margin_pct`, `operating_cost`, `units_sold`
- **PRECONDITIONS**: Multiple store or regional locations present in dataset.
- **DETERMINISTIC ANALYSIS**:
  1. Group dataset by `store_name` or `region`.
  2. Calculate total Revenue, Gross Profit, and Gross Margin %.
  3. Rank entities independently by Revenue vs Margin %.
  4. Segment stores into 4 efficiency quadrants:
     - High Revenue / High Margin (Stars)
     - High Revenue / Low Margin (Volume Drag)
     - Low Revenue / High Margin (Niche Performers)
     - Low Revenue / Low Margin (Critical Risk)
- **PRIMARY VISUALIZATION**: `horizontal_bar` (Ranked Profit Margin)
- **SECONDARY VISUALIZATION**: `scatter` (Revenue vs Margin Matrix)
- **SUPPORTING PIVOT**: `Row: Store, Col: Revenue, Profit, Margin %, Rank`
- **EPISTEMIC RULE**: Base store performance evaluations strictly on recorded revenue and margin fields.
- **LIMITATIONS**: "Store-level overheads (rent, local labor) excluded if not present in transactional records."

---

### PATTERN 5: `campaign_roi`
- **ID**: `campaign_roi`
- **NAME**: Marketing Campaign Commercial ROI & Efficiency Analysis
- **PURPOSE**: Evaluate marketing expenditure against attributable revenue and gross profit to identify top-performing campaigns and budget waste.
- **TRIGGERS**:
  - "Which campaigns performed best?"
  - "Which campaigns generated the best ROI?"
  - "Which campaigns wasted money?"
  - "Where should marketing spend be increased?"
  - "Which marketing campaigns generated the highest ROI, and which wasted budget?"
- **REQUIRED DATA**: `marketing_campaign` OR `campaign_name`, `marketing_spend`, `gross_revenue`
- **OPTIONAL DATA**: `gross_profit`, `sales_channel`, `customer_segment`
- **PRECONDITIONS**: Campaign spend and revenue fields exist.
- **DETERMINISTIC ANALYSIS**:
  1. Group dataset by `marketing_campaign`.
  2. Compute Return on Ad Spend (ROAS) = `gross_revenue` / `marketing_spend`.
  3. Compute Campaign Net Profit = `gross_profit` - `marketing_spend`.
  4. Calculate ROI % = (`Campaign Net Profit` / `marketing_spend`) * 100.
  5. Rank campaigns by ROI % and classify into High ROI (>300%) vs Budget Wasted (<100% ROAS).
- **PRIMARY VISUALIZATION**: `scatter` (X: Spend, Y: Attributable Revenue, Size: ROI %)
- **SECONDARY VISUALIZATION**: `horizontal_bar` (ROI Ranking)
- **SUPPORTING PIVOT**: `Row: Campaign, Col: Spend, Revenue, Net Profit, ROAS`
- **EPISTEMIC RULE**: Use attribution language ("Revenue attributed to campaign tag").
- **LIMITATIONS**: "Multi-touch attribution models and organic baseline sales cannot be inferred without tracking pixels."

---

### PATTERN 6: `inventory_imbalance`
- **ID**: `inventory_imbalance`
- **NAME**: Operational Inventory Bottleneck & Stockout Matrix
- **PURPOSE**: Identify localized inventory stockouts, excess inventory accumulation, and supply chain friction across stores and categories.
- **TRIGGERS**:
  - "Where are inventory problems?"
  - "Which stores have stockouts?"
  - "Where is excess inventory?"
  - "Are we overstocked anywhere?"
  - "Show me where inventory problems exist across stores and categories."
- **REQUIRED DATA**: `inventory_quantity` OR `stock_level`, `product_name` OR `category`, `store_name` OR `region`
- **OPTIONAL DATA**: `sales_velocity`, `reorder_threshold`, `stockout_flag`
- **PRECONDITIONS**: Inventory levels recorded across 2+ dimensional axes.
- **DETERMINISTIC ANALYSIS**:
  1. Group dataset by `category` (Rows) × `store_name` (Columns).
  2. Calculate total inventory stock and stockout instance frequency.
  3. Compute Stockout Rate % = (`stockout_instances` / `total_days`) * 100.
  4. Construct 2D cross-tabulation matrix highlighting stockout alerts (<10 units) and overstock excess (>500 units).
- **PRIMARY VISUALIZATION**: `heatmap` (2D Category × Store Inventory Grid)
- **SECONDARY VISUALIZATION**: `treemap` (Stock Volume Distribution)
- **SUPPORTING PIVOT**: `Row: Category, Col: Store Stock Levels & Stockout Counts`
- **EPISTEMIC RULE**: Report inventory counts directly from system records.
- **LIMITATIONS**: "Real-time shrinkage/theft rates cannot be determined without physical audit logs."

---

### PATTERN 7: `delivery_performance`
- **ID**: `delivery_performance`
- **NAME**: Delivery Partner SLA Compliance & Logistics Distribution
- **PURPOSE**: Assess logistics partner reliability, delivery time distribution, and customer fulfillment delay concentration.
- **TRIGGERS**:
  - "Which delivery partner performs best?"
  - "Which partner causes delays?"
  - "Where are delivery delays concentrated?"
  - "Which delivery partner is affecting service performance?"
  - "Which delivery partner is affecting customer experience the most?"
- **REQUIRED DATA**: `delivery_partner`, `delivery_time_days` OR `delay_minutes`
- **OPTIONAL DATA**: `sla_target_days`, `region`, `customer_rating`
- **PRECONDITIONS**: Logistics partner ID and delivery duration field present.
- **DETERMINISTIC ANALYSIS**:
  1. Group dataset by `delivery_partner`.
  2. Compute Average, Median, Min, Max, and Standard Deviation of delivery times.
  3. Compute SLA Breach Rate % = (`orders_exceeding_target` / `total_orders`) * 100.
  4. Rank partners by SLA breach frequency and delivery time variance.
- **PRIMARY VISUALIZATION**: `box_plot` (Delivery Duration Variance Spread)
- **SECONDARY VISUALIZATION**: `heatmap` (Partner × Region SLA Breach %)
- **SUPPORTING PIVOT**: `Row: Partner, Col: Avg Time, Median Time, SLA Breach %`
- **EPISTEMIC RULE**: Base logistics performance strictly on recorded fulfillment timestamps.
- **LIMITATIONS**: "Weather impacts and traffic bottlenecks cannot be isolated without external telematics."

---

### PATTERN 8: `customer_value_segmentation`
- **ID**: `customer_value_segmentation`
- **NAME**: Customer Value & LTV Segment Contribution (Treemap Analysis)
- **PURPOSE**: Segment customer base by purchase frequency and total spend to identify high-value revenue drivers and segment concentration.
- **TRIGGERS**:
  - "Which customers are most valuable?"
  - "Which customer segments drive revenue?"
  - "What are our best customer segments?"
  - "Which customer segments are the most valuable to NexaSphere?"
- **REQUIRED DATA**: `customer_segment` OR `customer_id`, `gross_revenue`, `order_count`
- **OPTIONAL DATA**: `gross_profit`, `sales_channel`, `region`
- **PRECONDITIONS**: Customer identifier or segment classification available.
- **DETERMINISTIC ANALYSIS**:
  1. Group dataset by `customer_segment`.
  2. Calculate total Segment Revenue, Order Count, and Average Order Value (AOV).
  3. Compute Segment Contribution % = (`Segment Revenue` / `Total Revenue`) * 100.
  4. Rank segments into Enterprise, High-Value Corporate, Mid-Market, and Retail.
- **PRIMARY VISUALIZATION**: `treemap` (Hierarchical Segment Revenue Share)
- **SECONDARY VISUALIZATION**: `donut` (Volume Contribution Split)
- **SUPPORTING PIVOT**: `Row: Segment, Col: Customers, Revenue, Order Count, AOV`
- **EPISTEMIC RULE**: State segment contributions as percentage of total historical spend.
- **LIMITATIONS**: "Future churn likelihood cannot be predicted without multi-year tenure history."

---

### PATTERN 9: `employee_target_profitability`
- **ID**: `employee_target_profitability`
- **NAME**: Employee Sales Performance & Margin Realization Matrix
- **PURPOSE**: Identify which sales employees achieve quota targets while maintaining healthy gross margins versus those buying volume with excessive discounting.
- **TRIGGERS**:
  - "Which employees are performing best?"
  - "Who is meeting sales targets?"
  - "Which employees generate profitable sales?"
  - "Who hits targets without sacrificing margin?"
  - "Which employees are achieving sales targets without sacrificing profit margin?"
- **REQUIRED DATA**: `employee_name` OR `sales_rep`, `gross_revenue`, `sales_target`, `gross_profit`
- **OPTIONAL DATA**: `discount_depth_pct`, `units_sold`, `region`
- **PRECONDITIONS**: Employee sales quota/target and actual performance present.
- **DETERMINISTIC ANALYSIS**:
  1. Group dataset by `employee_name`.
  2. Compute Target Attainment % = (`gross_revenue` / `sales_target`) * 100.
  3. Compute Average Margin % = (`gross_profit` / `gross_revenue`) * 100.
  4. Calculate Average Discount Depth % granted per rep.
  5. Quadrant classify reps: High Target / High Margin (Top Stars) vs High Target / Low Margin (Discount Reliant).
- **PRIMARY VISUALIZATION**: `scatter` (X: Target Attainment %, Y: Profit Margin %, Size: Revenue)
- **SECONDARY VISUALIZATION**: `waterfall` (Target Variance & Margin Realization)
- **SUPPORTING PIVOT**: `Row: Rep, Col: Target, Actual Revenue, Attainment %, Margin %, Avg Discount %`
- **EPISTEMIC RULE**: Base rep performance evaluations strictly on recorded revenue and margin realization.
- **LIMITATIONS**: "Qualitative client relationships and long-term contract renewal terms are not captured in transaction records."

---

### PATTERN 10: `executive_dimension_comparison`
- **ID**: `executive_dimension_comparison`
- **NAME**: Executive Multi-Driver Comparative Analysis
- **PURPOSE**: Perform side-by-side comparative evaluation of two major business territories or units across all core commercial drivers (Revenue, Margin, Returns, Discounting).
- **TRIGGERS**:
  - "Compare Lagos and Abuja."
  - "Compare these regions."
  - "Which region performs better?"
  - "Compare stores."
  - "Compare Lagos and Abuja across every major business driver."
- **REQUIRED DATA**: `region` OR `store_name` (2+ comparison entities), `gross_revenue`, `gross_profit`
- **OPTIONAL DATA**: `return_count`, `discount_depth_pct`
- **PRECONDITIONS**: Multiple comparison entities specified or extracted in query.
- **DETERMINISTIC ANALYSIS**:
  1. Filter dataset for comparison entities (e.g. `['Lagos', 'Abuja']`).
  2. Calculate side-by-side metrics:
     - Gross Revenue (₦)
     - Gross Profit (₦)
     - Gross Margin %
     - Return Volume & Return Rate %
     - Average Discount Depth %
  3. Compute relative variance ratios between entities for each driver.
- **PRIMARY VISUALIZATION**: `horizontal_bar` (Side-by-side Driver Comparison)
- **SECONDARY VISUALIZATION**: `line` (Comparative Trajectory)
- **SUPPORTING PIVOT**: `Row: Entity, Col: Revenue, Profit, Margin %, Return Rate %, Discount %`
- **EPISTEMIC RULE**: Compare entities across all 4 drivers without suppressing weaker areas.
- **LIMITATIONS**: "Demographic population size and regional tax variations are not included in transactional dataset."

---

## SCHEMA & OUTPUT CONTRACT

Every analytical pattern response MUST return structured JSON conforming to:

```json
{
  "analysis_id": "string",
  "pattern_id": "string",
  "question": "string",
  "status": "ANSWERABLE | PARTIALLY_ANSWERABLE | INSUFFICIENT_DATA | AMBIGUOUS",
  "analysis_plan": [
    { "step": "Comparing periods", "status": "COMPLETED" },
    { "step": "Decomposing profit change", "status": "COMPLETED" },
    { "step": "Return analysis unavailable", "status": "UNAVAILABLE" }
  ],
  "metrics": [
    { "label": "Gross Revenue", "value": "₦1.82B", "benchmark": "+12% YoY" }
  ],
  "findings": [
    { "type": "FACT", "text": "Profit margin declined 3.2 percentage points." },
    { "type": "FACT", "text": "Lagos Appliances accounted for 61% of total profit decline." }
  ],
  "visualization": {
    "type": "waterfall",
    "title": "Profit Margin Decomposition by Region & Category",
    "data": [],
    "configuration": {}
  },
  "secondary_visualizations": [],
  "supporting_table": {
    "headers": ["Region", "Category", "Revenue", "Profit Delta"],
    "rows": []
  },
  "evidence": {
    "metric_used": "gross_profit",
    "dimensions": ["region", "category"],
    "formula_breadcrumb": "SUM(gross_profit_period_2) - SUM(gross_profit_period_1)",
    "confidence_level": "HIGH"
  },
  "interpretation": "Profit deterioration is concentrated in Lagos Appliances rather than distributed across all regions.",
  "business_implication": "Revenue growth is currently coming with deteriorating profitability. If uncorrected, additional sales volume will yield lower net cash flow.",
  "management_attention": "Management may want to review discounting rules and return packaging in Lagos Appliances before pursuing further volume expansion in the segment.",
  "limitations": [
    "Causes outside connected transactional records cannot be established."
  ]
}
```
