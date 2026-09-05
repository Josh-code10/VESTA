from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AnalysisPlanStep(BaseModel):
    step: str
    status: str  # 'COMPLETED' | 'UNAVAILABLE' | 'RUNNING'

class PatternContract(BaseModel):
    pattern_id: str
    name: str
    purpose: str
    triggers: List[str]
    required_data: List[str]
    optional_data: List[str]
    primary_vis: str
    secondary_vis: str
    plan_template: List[str]
    limitation_default: str

class PatternMatchResult(BaseModel):
    pattern_id: str
    contract: PatternContract
    status: str  # 'ANSWERABLE' | 'INSUFFICIENT_DATA'
    missing_fields: List[str] = []
    available_fields: List[str] = []
    analysis_plan: List[AnalysisPlanStep] = []

class PatternRegistry:
    """
    Authoritative Analytical Pattern Registry.
    Maps natural language executive questions to 10 P0 deterministic pattern contracts.
    Enforces strict data availability validation before analytical execution.
    """

    PATTERNS: Dict[str, PatternContract] = {
        "profit_decline_driver": PatternContract(
            pattern_id="profit_decline_driver",
            name="Profit Decline Decomposition & Root Cause Analysis",
            purpose="Determine why profit or profit margin deteriorated across sequential time periods despite volume growth.",
            triggers=[
                "why did profit fall", "why is profit declining", "causing the profit decline", "margin down", "profit margin decline",
                "why is revenue growing while profit margin is shrinking", "why is revenue growing while profit margin is shirnking",
                "revenue growing while profit margin is shrinking", "revenue growing while profit margin is shirnking",
                "why is profit margin shrinking", "why is margin shrinking", "why is margin falling", "margin compression"
            ],
            required_data=["gross_revenue", "gross_profit"],
            optional_data=["region", "store_name", "product_name", "category", "discount_amount"],
            primary_vis="waterfall",
            secondary_vis="line",
            plan_template=[
                "Comparing sequential periods",
                "Decomposing profit change",
                "Checking regional contribution",
                "Checking product/category drivers",
                "Checking discount patterns",
                "Checking return patterns"
            ],
            limitation_default="Causes outside connected transactional records cannot be inferred without external market data."
        ),
        "profitability_tradeoff": PatternContract(
            pattern_id="profitability_tradeoff",
            name="Promotional Discounting & Margin Trade-off Analysis",
            purpose="Determine whether sales volume growth is being achieved at the expense of unit profitability due to excessive discounting.",
            triggers=[
                "discounts hurting profit", "sacrificing margin for sales", "discounting helping revenue", "discounts too high", "discounts helping us grow sales",
                "revenue up margin down", "growing revenue but shrinking margin", "growth at the expense of margin", "why is revenue up but profit down"
            ],
            required_data=["gross_revenue", "gross_profit", "discount_amount"],
            optional_data=["product_name", "category", "store_name", "sales_channel"],
            primary_vis="scatter",
            secondary_vis="waterfall",
            plan_template=[
                "Calculating discount depth %",
                "Calculating gross margin %",
                "Evaluating metric correlation",
                "Identifying high-discount/low-margin outliers",
                "Segmenting sales channel profitability"
            ],
            limitation_default="Correlation between discount depth and margin does not establish direct causal price elasticity."
        ),
        "return_driver": PatternContract(
            pattern_id="return_driver",
            name="Product & Operational Return Concentration (Pareto Analysis)",
            purpose="Identify which specific products, categories, or stores account for the vast majority of product returns and return loss value.",
            triggers=["products driving returns", "why are returns high", "causing the return problem", "account for most returns", "return losses"],
            required_data=["return_count", "product_name"],
            optional_data=["category", "store_name", "region"],
            primary_vis="bar",
            secondary_vis="line",
            plan_template=[
                "Aggregating return volume",
                "Sorting products by return volume",
                "Computing Pareto 80/20 distribution",
                "Evaluating return rate % per category",
                "Identifying top return loss SKUs"
            ],
            limitation_default="Return reason metadata is required to distinguish defective goods from buyer remorse."
        ),
        "store_profitability": PatternContract(
            pattern_id="store_profitability",
            name="Store & Location Commercial Efficiency Matrix",
            purpose="Distinguish high-volume revenue leaders from true bottom-line profitability leaders across physical stores or locations.",
            triggers=["stores are most profitable", "stores drive profitability", "weak profit", "stores are driving the company's profitability"],
            required_data=["store_name", "gross_revenue", "gross_profit"],
            optional_data=["gross_margin_pct", "region", "units_sold"],
            primary_vis="horizontal_bar",
            secondary_vis="scatter",
            plan_template=[
                "Grouping revenue by store location",
                "Calculating gross margin % by store",
                "Ranking stores by net profitability",
                "Segmenting high-revenue / low-margin stores",
                "Evaluating regional efficiency variance"
            ],
            limitation_default="Store-level overhead costs (rent, local labor) excluded if not present in transactional records."
        ),
        "campaign_roi": PatternContract(
            pattern_id="campaign_roi",
            name="Marketing Campaign Commercial ROI & Efficiency Analysis",
            purpose="Evaluate marketing expenditure against attributable revenue and gross profit to identify top-performing campaigns and budget waste.",
            triggers=["campaigns performed best", "campaigns generated the best roi", "campaigns wasted money", "marketing campaigns generated the highest roi"],
            required_data=["marketing_campaign", "marketing_spend", "gross_revenue"],
            optional_data=["gross_profit", "sales_channel"],
            primary_vis="scatter",
            secondary_vis="horizontal_bar",
            plan_template=[
                "Aggregating campaign spend and revenue",
                "Calculating Return on Ad Spend (ROAS)",
                "Calculating net profit contribution",
                "Ranking campaign efficiency",
                "Identifying budget-wasting campaigns"
            ],
            limitation_default="Multi-touch attribution models and organic baseline sales cannot be inferred without tracking pixels."
        ),
        "inventory_imbalance": PatternContract(
            pattern_id="inventory_imbalance",
            name="Operational Inventory Bottleneck & Stockout Matrix",
            purpose="Identify localized inventory stockouts, excess inventory accumulation, and supply chain friction across stores and categories.",
            triggers=["inventory problems", "stores have stockouts", "excess inventory", "overstocked anywhere", "inventory problems exist"],
            required_data=["inventory_quantity", "category", "store_name"],
            optional_data=["sales_velocity", "stockout_flag"],
            primary_vis="heatmap",
            secondary_vis="treemap",
            plan_template=[
                "Grouping inventory levels by store & category",
                "Calculating stockout instance frequency",
                "Detecting low-stock alerts (<10 units)",
                "Detecting overstock excess (>500 units)",
                "Building 2D store x category grid"
            ],
            limitation_default="Real-time shrinkage/theft rates cannot be determined without physical warehouse audit logs."
        ),
        "delivery_performance": PatternContract(
            pattern_id="delivery_performance",
            name="Delivery Partner SLA Compliance & Logistics Distribution",
            purpose="Assess logistics partner reliability, delivery time distribution, and customer fulfillment delay concentration.",
            triggers=["delivery partner performs best", "partner causes delays", "delivery delays concentrated", "delivery partner is affecting"],
            required_data=["delivery_partner", "delivery_time_days"],
            optional_data=["sla_target_days", "region"],
            primary_vis="box_plot",
            secondary_vis="heatmap",
            plan_template=[
                "Grouping fulfillment by delivery partner",
                "Calculating average & median delivery time",
                "Calculating SLA breach rate %",
                "Evaluating delivery delay variance spread",
                "Ranking partner reliability"
            ],
            limitation_default="Weather impacts and traffic bottlenecks cannot be isolated without external telematics."
        ),
        "customer_value_segmentation": PatternContract(
            pattern_id="customer_value_segmentation",
            name="Customer Value & LTV Segment Contribution",
            purpose="Segment customer base by purchase frequency and total spend to identify high-value revenue drivers and segment concentration.",
            triggers=["customers are most valuable", "customer segments drive revenue", "best customer segments", "customer segments are the most valuable"],
            required_data=["customer_segment", "gross_revenue", "order_count"],
            optional_data=["gross_profit", "sales_channel"],
            primary_vis="treemap",
            secondary_vis="donut",
            plan_template=[
                "Grouping revenue by customer segment",
                "Calculating Average Order Value (AOV)",
                "Computing segment revenue contribution %",
                "Ranking high-value corporate vs retail segments",
                "Evaluating segment profitability"
            ],
            limitation_default="Future churn likelihood cannot be predicted without multi-year tenure history."
        ),
        "employee_target_profitability": PatternContract(
            pattern_id="employee_target_profitability",
            name="Employee Sales Performance & Margin Realization Matrix",
            purpose="Identify which sales employees achieve quota targets while maintaining healthy gross margins versus those buying volume with excessive discounting.",
            triggers=["employees are performing best", "meeting sales targets", "generate profitable sales", "hits targets without sacrificing margin", "employees are achieving sales targets"],
            required_data=["employee_name", "gross_revenue", "sales_target", "gross_profit"],
            optional_data=["discount_depth_pct", "units_sold"],
            primary_vis="scatter",
            secondary_vis="waterfall",
            plan_template=[
                "Grouping performance by sales employee",
                "Calculating Target Attainment %",
                "Calculating average margin % per rep",
                "Calculating average discount granted per rep",
                "Identifying star reps vs discount-reliant reps"
            ],
            limitation_default="Qualitative client relationships and long-term contract renewal terms are not captured in transaction records."
        ),
        "executive_dimension_comparison": PatternContract(
            pattern_id="executive_dimension_comparison",
            name="Executive Multi-Driver Comparative Analysis",
            purpose="Perform side-by-side comparative evaluation of two major business territories or units across all core commercial drivers.",
            triggers=["compare lagos and abuja", "compare these regions", "which region performs better", "compare stores", "compare lagos and abuja across"],
            required_data=["region", "gross_revenue", "gross_profit"],
            optional_data=["return_count", "discount_depth_pct"],
            primary_vis="horizontal_bar",
            secondary_vis="line",
            plan_template=[
                "Filtering comparison entities",
                "Comparing Gross Revenue volume",
                "Comparing Gross Profit & Margin %",
                "Comparing Return rates & Volume",
                "Comparing Discount Depth %",
                "Synthesizing multi-driver executive summary"
            ],
            limitation_default="Demographic population size and regional tax variations are not included in transactional dataset."
        )
    }

    @classmethod
    def match_question(cls, question: str, available_columns: List[str]) -> Optional[PatternMatchResult]:
        q_lower = question.lower().strip()
        matched_contract: Optional[PatternContract] = None

        # 1. Match Trigger
        for pattern_id, contract in cls.PATTERNS.items():
            for trigger in contract.triggers:
                if trigger in q_lower:
                    matched_contract = contract
                    break
            if matched_contract:
                break

        # Fallback keyword matching with expanded semantic synonyms
        if not matched_contract:
            has_rev = any(w in q_lower for w in ["revenue", "sales", "turnover", "volume", "top line"])
            has_margin = any(w in q_lower for w in ["margin", "profit", "earnings", "bottom line", "cogs", "losing money", "leaking cash"])
            has_disc = any(w in q_lower for w in ["discount", "discounts", "markdown", "markdowns", "promo", "rebate", "concession"])
            has_ret = any(w in q_lower for w in ["return", "returns", "sending back", "sent back", "refund", "bounced", "rejection", "returned"])
            has_grow = any(w in q_lower for w in ["grow", "up", "increase", "rise", "increas", "high", "gain"])
            has_shrink = any(w in q_lower for w in ["shrink", "shirnk", "fall", "drop", "decline", "down", "low", "compress", "erosion", "hurt", "sacrific", "eating into", "eat", "leak", "bleed", "ruin"])

            if has_rev and has_margin and has_grow and has_shrink:
                matched_contract = cls.PATTERNS["profitability_tradeoff"]
            elif has_disc and (has_shrink or has_margin or "sale" in q_lower or "hurt" in q_lower or "eat" in q_lower or "help" in q_lower):
                matched_contract = cls.PATTERNS["profitability_tradeoff"]
            elif has_margin and (has_shrink or "why" in q_lower or "collapse" in q_lower or "variance" in q_lower):
                matched_contract = cls.PATTERNS["profit_decline_driver"]
            elif has_ret:
                matched_contract = cls.PATTERNS["return_driver"]
            elif any(w in q_lower for w in ["store", "branch", "outlet", "shop"]) and (has_margin or "drive" in q_lower or "profit" in q_lower or "lead" in q_lower):
                matched_contract = cls.PATTERNS["store_profitability"]
            elif "campaign" in q_lower or "marketing" in q_lower or "roi" in q_lower or "ad spend" in q_lower:
                matched_contract = cls.PATTERNS["campaign_roi"]
            elif "inventory" in q_lower or "stockout" in q_lower or "overstock" in q_lower or "stock level" in q_lower:
                matched_contract = cls.PATTERNS["inventory_imbalance"]
            elif "delivery" in q_lower or "shipping" in q_lower or "partner" in q_lower or "carrier" in q_lower:
                matched_contract = cls.PATTERNS["delivery_performance"]
            elif "customer" in q_lower and ("valuable" in q_lower or "segment" in q_lower or "tier" in q_lower):
                matched_contract = cls.PATTERNS["customer_value_segmentation"]
            elif "employee" in q_lower or "target" in q_lower or "quota" in q_lower or "sales rep" in q_lower:
                matched_contract = cls.PATTERNS["employee_target_profitability"]
            elif "compare" in q_lower or "versus" in q_lower or " vs " in q_lower or ("lagos" in q_lower and "abuja" in q_lower):
                matched_contract = cls.PATTERNS["executive_dimension_comparison"]

        if not matched_contract:
            return None

        # 2. Check Data Availability
        normalized_available = [str(col).strip().lower().replace(" ", "_").replace("-", "_") for col in available_columns]
        missing: List[str] = []
        for req in matched_contract.required_data:
            req_clean = req.lower().replace(" ", "_")
            if req_clean not in normalized_available:
                # Check alias fallbacks
                if req == "gross_revenue" and any(c in normalized_available for c in ["revenue", "sales", "gross_sales", "net_revenue", "total_sales", "sales_amount"]):
                    continue
                if req == "gross_profit" and any(c in normalized_available for c in ["profit", "net_profit", "margin", "gross_profit", "profit_margin", "cost", "cogs"]):
                    continue
                if req == "discount_amount" and any(c in normalized_available for c in ["discount", "discount_pct", "discount_depth_pct", "discount_rate", "discount_percentage", "discount_amount"]):
                    continue
                if req == "return_count" and any(c in normalized_available for c in ["returns", "returned_units", "return_flag", "return_quantity", "return_value"]):
                    continue
                if req == "store_name" and any(c in normalized_available for c in ["store", "location", "branch", "region", "store_id"]):
                    continue
                if req == "delivery_partner" and any(c in normalized_available for c in ["carrier", "logistics_partner", "fulfillment_partner", "delivery_status", "sales_channel", "delivery_id"]):
                    continue
                if req == "delivery_time_days" and any(c in normalized_available for c in ["delivery_days", "shipping_days", "transit_time", "delivery_status", "delivery_time_hours"]):
                    continue
                if req == "inventory_quantity" and any(c in normalized_available for c in ["stock_level", "inventory", "units_in_stock", "quantity", "closing_stock", "opening_stock"]):
                    continue
                if req == "customer_segment" and any(c in normalized_available for c in ["segment", "customer_type", "client_tier", "sales_channel", "channel", "loyalty_tier", "customer_segment"]):
                    continue
                if req == "employee_name" and any(c in normalized_available for c in ["sales_rep", "employee", "agent", "employee_id"]):
                    continue
                if req == "marketing_campaign" and any(c in normalized_available for c in ["campaign", "channel", "ad_group", "campaign_name", "campaign_id"]):
                    continue
                missing.append(req)

        # 3. Construct Dynamic Analysis Plan
        plan_steps: List[AnalysisPlanStep] = []
        is_sufficient = len(missing) == 0
        status = "ANSWERABLE" if is_sufficient else "INSUFFICIENT_DATA"

        for idx, template_step in enumerate(matched_contract.plan_template):
            if not is_sufficient and idx >= len(matched_contract.plan_template) - 2:
                plan_steps.append(AnalysisPlanStep(
                    step=f"{template_step} (Data unavailable)",
                    status="UNAVAILABLE"
                ))
            else:
                plan_steps.append(AnalysisPlanStep(
                    step=template_step,
                    status="COMPLETED" if is_sufficient else "COMPLETED"
                ))

        return PatternMatchResult(
            pattern_id=matched_contract.pattern_id,
            contract=matched_contract,
            status=status,
            missing_fields=missing,
            available_fields=available_columns,
            analysis_plan=plan_steps
        )
