from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

class KnowledgeConcept(BaseModel):
    concept_id: str
    title: str
    category: str  # 'Finance' | 'Sales' | 'Inventory' | 'Marketing' | 'Customer' | 'Operations' | 'Business Intelligence'
    definition: str
    business_importance: str
    formula: Optional[str] = None
    retail_example: str
    investigation_bridge_prompt: str

class BusinessKnowledgeLibrary:
    """
    Built-in Business Knowledge Library providing structured, offline definitions,
    formulas, executive importance, and retail examples across 35+ core business concepts.
    """

    CONCEPTS: Dict[str, KnowledgeConcept] = {
        # FINANCE
        "revenue": KnowledgeConcept(
            concept_id="revenue",
            title="Revenue (Gross Sales)",
            category="Finance",
            definition="Total monetary value generated from customer transactions before deducting any costs, returns, or expenses.",
            business_importance="Top-line metric measuring market demand and scale of commercial operations.",
            formula="Revenue = Total Units Sold * Unit Selling Price",
            retail_example="Selling 500 laptops at ₦200,000 each yields ₦100,000,000 in Revenue.",
            investigation_bridge_prompt="Show revenue breakdown by region and sales channel"
        ),
        "gross_profit": KnowledgeConcept(
            concept_id="gross_profit",
            title="Gross Profit",
            category="Finance",
            definition="The profit a business retains after deducting the direct costs of producing or acquiring the goods sold (COGS).",
            business_importance="Measures basic product profitability before operating overhead, rent, or marketing.",
            formula="Gross Profit = Revenue - Cost of Goods Sold (COGS)",
            retail_example="Generating ₦10M revenue with ₦6M in procurement COGS results in ₦4M Gross Profit.",
            investigation_bridge_prompt="Which categories contribute the highest gross profit?"
        ),
        "net_profit": KnowledgeConcept(
            concept_id="net_profit",
            title="Net Profit",
            category="Finance",
            definition="The final monetary gain remaining after subtracting all operating expenses, taxes, interest, and COGS from revenue.",
            business_importance="The ultimate bottom-line measure of financial health and business viability.",
            formula="Net Profit = Gross Profit - Operating Expenses - Taxes - Interest",
            retail_example="After ₦4M gross profit, paying ₦2M in store rent and salaries leaves ₦2M Net Profit.",
            investigation_bridge_prompt="Compare overall net profit margin across store locations"
        ),
        "profit_margin": KnowledgeConcept(
            concept_id="profit_margin",
            title="Gross Profit Margin (%)",
            category="Finance",
            definition="The percentage of total sales revenue retained as gross profit after paying direct inventory acquisition costs.",
            business_importance="Reveals unit pricing power and production efficiency regardless of business scale.",
            formula="Gross Profit Margin % = (Gross Profit / Revenue) * 100",
            retail_example="If gross profit is ₦40,000 on ₦100,000 sales, your gross margin is 40%.",
            investigation_bridge_prompt="Show gross profit margin breakdown by category"
        ),
        "contribution_margin": KnowledgeConcept(
            concept_id="contribution_margin",
            title="Contribution Margin",
            category="Finance",
            definition="Revenue remaining after subtracting variable costs, showing how much sales contribute to fixed costs.",
            business_importance="Essential for breakeven analysis and determining product line profitability.",
            formula="Contribution Margin = Sales Revenue - Variable Costs",
            retail_example="Selling a phone for ₦50,000 with ₦30,000 COGS and ₦5,000 courier shipping leaves ₦15,000 Contribution Margin.",
            investigation_bridge_prompt="Which sales channels have the highest contribution margin?"
        ),
        "ebitda": KnowledgeConcept(
            concept_id="ebitda",
            title="EBITDA",
            category="Finance",
            definition="Earnings Before Interest, Taxes, Depreciation, and Amortization. Measures pure operating cashflow strength.",
            business_importance="Standard institutional metric for comparing operational profitability across companies.",
            formula="EBITDA = Operating Income + Depreciation + Amortization",
            retail_example="A retail chain with ₦50M operating profit and ₦10M equipment depreciation has ₦60M EBITDA.",
            investigation_bridge_prompt="Analyze operating profit contribution by commercial division"
        ),
        "cogs": KnowledgeConcept(
            concept_id="cogs",
            title="Cost of Goods Sold (COGS)",
            category="Finance",
            definition="Direct costs incurred to procure, manufacture, or acquire inventory items sold to customers.",
            business_importance="Primary cost driver affecting gross profit margins; controlling COGS is vital for margin defense.",
            formula="COGS = Beginning Inventory + Procurement Purchases - Ending Inventory",
            retail_example="Buying 100 refrigerators from a manufacturer at ₦120,000 each equals ₦12M COGS.",
            investigation_bridge_prompt="Show COGS and supplier acquisition cost by product line"
        ),

        # SALES
        "aov": KnowledgeConcept(
            concept_id="aov",
            title="Average Order Value (AOV)",
            category="Sales",
            definition="The average monetary amount spent by a customer per single checkout transaction.",
            business_importance="Increasing AOV drives revenue growth without increasing customer acquisition costs.",
            formula="AOV = Total Sales Revenue / Total Number of Orders",
            retail_example="Generating ₦50,000,000 from 1,000 orders yields an AOV of ₦50,000 per order.",
            investigation_bridge_prompt="What is the average order value across sales channels?"
        ),
        "sales_growth": KnowledgeConcept(
            concept_id="sales_growth",
            title="Sales Growth Rate (%)",
            category="Sales",
            definition="Percentage change in total sales revenue over a specific comparison period (e.g. Month-over-Month, Year-over-Year).",
            business_importance="Tracks commercial momentum and business expansion trajectory.",
            formula="Sales Growth % = ((Current Sales - Prior Sales) / Prior Sales) * 100",
            retail_example="Growing sales from ₦10M in June to ₦12M in July represents a 20% Sales Growth Rate.",
            investigation_bridge_prompt="Which region achieved the fastest sales growth rate?"
        ),
        "sales_velocity": KnowledgeConcept(
            concept_id="sales_velocity",
            title="Sales Velocity",
            category="Sales",
            definition="The speed at which pipeline opportunities or store inventory convert into realized revenue per day or month.",
            business_importance="Measures how fast capital turns over to generate cash flow.",
            formula="Sales Velocity = (Number of Leads * Average Deal Size * Conversion Rate) / Sales Cycle Length",
            retail_example="Selling 20 smartphones per day per store indicates high sales velocity.",
            investigation_bridge_prompt="Which store locations have the fastest sales velocity?"
        ),
        "sell_through_rate": KnowledgeConcept(
            concept_id="sell_through_rate",
            title="Sell-Through Rate (%)",
            category="Sales",
            definition="Percentage of received inventory sold to customers relative to the amount supplied by vendors.",
            business_importance="Evaluates inventory turnover efficiency and demand forecasting accuracy.",
            formula="Sell-Through Rate % = (Units Sold / Units Received) * 100",
            retail_example="Receiving 1,000 shoes and selling 800 in a month yields an 80% Sell-Through Rate.",
            investigation_bridge_prompt="Show sell-through rate by category across regions"
        ),

        # INVENTORY
        "inventory_turnover": KnowledgeConcept(
            concept_id="inventory_turnover",
            title="Inventory Turnover Ratio",
            category="Inventory",
            definition="The number of times store inventory is sold out and replenished over a given period.",
            business_importance="High turnover indicates strong sales demand and efficient inventory management.",
            formula="Inventory Turnover = COGS / Average Inventory Value",
            retail_example="An annual COGS of ₦120M with ₦20M average inventory value gives a Turnover Ratio of 6.0x.",
            investigation_bridge_prompt="Compare inventory turnover across product categories"
        ),
        "stockout_rate": KnowledgeConcept(
            concept_id="stockout_rate",
            title="Stockout Rate (%)",
            category="Inventory",
            definition="Percentage of time or requested orders where inventory was unavailable to fulfill customer demand.",
            business_importance="Directly impacts lost revenue and customer dissatisfaction.",
            formula="Stockout Rate % = (Unfulfilled Out-of-Stock Orders / Total Orders) * 100",
            retail_example="Running out of stock on 5 out of 100 customer requests equals a 5% Stockout Rate.",
            investigation_bridge_prompt="Which stores have the highest stockout rates?"
        ),
        "safety_stock": KnowledgeConcept(
            concept_id="safety_stock",
            title="Safety Stock",
            category="Inventory",
            definition="Surplus inventory held to buffer against unexpected demand surges or supplier delivery delays.",
            business_importance="Protects against stockouts while minimizing tied-up working capital.",
            formula="Safety Stock = (Max Daily Sales * Max Lead Time) - (Avg Daily Sales * Avg Lead Time)",
            retail_example="Holding 50 extra generators in warehouse storage during flood season as emergency stock.",
            investigation_bridge_prompt="Review inventory levels against safety stock thresholds"
        ),
        "dead_stock": KnowledgeConcept(
            concept_id="dead_stock",
            title="Dead Stock",
            category="Inventory",
            definition="Unsold inventory sitting in storage for extended periods without customer demand or sales movement.",
            business_importance="Ties up cash flow and incurs warehouse holding costs.",
            formula="Dead Stock Value = SUM(Quantity Unsold > 180 Days * Unit Cost)",
            retail_example="Holding 200 outdated phone cases unsold for 9 months is classified as Dead Stock.",
            investigation_bridge_prompt="Identify categories with high dead stock volume"
        ),
        "reorder_level": KnowledgeConcept(
            concept_id="reorder_level",
            title="Reorder Level (ROP)",
            category="Inventory",
            definition="The threshold inventory level that automatically triggers a new procurement purchase order.",
            business_importance="Ensures seamless inventory replenishment before stockouts occur.",
            formula="Reorder Level = (Average Daily Usage * Lead Time in Days) + Safety Stock",
            retail_example="When milk crates drop to 30 units, the system automatically sends a reorder to the dairy supplier.",
            investigation_bridge_prompt="Which SKUs are currently below their reorder level?"
        ),

        # MARKETING
        "roi": KnowledgeConcept(
            concept_id="roi",
            title="Return on Investment (ROI)",
            category="Marketing",
            definition="Percentage measure of net profit generated relative to the total cost invested in a campaign or project.",
            business_importance="Evaluates capital efficiency and guides future budget allocation.",
            formula="ROI % = ((Net Gain from Investment - Investment Cost) / Investment Cost) * 100",
            retail_example="Investing ₦1M in a billboard campaign that generates ₦2.5M net profit yields a 150% ROI.",
            investigation_bridge_prompt="Compare marketing ROI across sales channels"
        ),
        "roas": KnowledgeConcept(
            concept_id="roas",
            title="Return on Ad Spend (ROAS)",
            category="Marketing",
            definition="Gross revenue generated for every single Naira spent on direct advertising campaigns.",
            business_importance="Primary efficiency metric for digital ad campaigns and marketing channels.",
            formula="ROAS = Gross Campaign Revenue / Total Ad Spend",
            retail_example="Spending ₦500,000 on Instagram ads that drive ₦2,500,000 in sales yields a 5.0x ROAS.",
            investigation_bridge_prompt="Which ad campaigns delivered the highest ROAS?"
        ),
        "ctr": KnowledgeConcept(
            concept_id="ctr",
            title="Click-Through Rate (CTR)",
            category="Marketing",
            definition="Percentage of ad viewers who clicked on an online advertisement or email link.",
            business_importance="Measures creative relevance and initial audience interest.",
            formula="CTR % = (Total Clicks / Total Impressions) * 100",
            retail_example="If 10,000 people see a digital banner and 300 click it, the CTR is 3.0%.",
            investigation_bridge_prompt="Analyze sales channel conversion from digital campaigns"
        ),
        "cpa": KnowledgeConcept(
            concept_id="cpa",
            title="Cost Per Acquisition (CPA)",
            category="Marketing",
            definition="Total marketing expenditure required to achieve one specific conversion action (e.g. sale, signup).",
            business_importance="Determines campaign cost-effectiveness in driving conversion events.",
            formula="CPA = Total Campaign Cost / Total Conversions",
            retail_example="Spending ₦100,000 on Google ads to get 20 customer sales yields a ₦5,000 CPA.",
            investigation_bridge_prompt="What is our average customer acquisition cost by channel?"
        ),
        "cac": KnowledgeConcept(
            concept_id="cac",
            title="Customer Acquisition Cost (CAC)",
            category="Marketing",
            definition="Total sales and marketing expenditure required to acquire a brand-new paying customer.",
            business_importance="Must be lower than Customer Lifetime Value (LTV) for sustainable unit economics.",
            formula="CAC = (Total Marketing + Sales Costs) / Number of New Customers Acquired",
            retail_example="Spending ₦2M across ad spend and sales salaries to gain 400 new customers equals a ₦5,000 CAC.",
            investigation_bridge_prompt="Compare CAC against customer lifetime value across segments"
        ),
        "customer_acquisition": KnowledgeConcept(
            concept_id="customer_acquisition",
            title="Customer Acquisition",
            category="Marketing",
            definition="The process and metrics associated with bringing new paying customers into the business ecosystem.",
            business_importance="Drives top-of-funnel growth and expands customer base footprint.",
            formula="New Customers = Total First-Time Order Buyers",
            retail_example="Acquiring 1,200 first-time buyers during a Black Friday promotional campaign.",
            investigation_bridge_prompt="Show sales growth by new vs repeat customer channels"
        ),

        # CUSTOMER
        "ltv": KnowledgeConcept(
            concept_id="ltv",
            title="Customer Lifetime Value (LTV)",
            category="Customer",
            definition="Total net profit a business expects to earn from a customer throughout their entire relationship.",
            business_importance="Establishes how much a business can sustainably spend to acquire new customers.",
            formula="LTV = Average Order Value * Purchase Frequency * Customer Lifespan",
            retail_example="A customer spending ₦20,000 quarterly for 3 years delivers an estimated LTV of ₦240,000.",
            investigation_bridge_prompt="Show customer repeat purchase frequency across regions"
        ),
        "repeat_purchase_rate": KnowledgeConcept(
            concept_id="repeat_purchase_rate",
            title="Repeat Purchase Rate (%)",
            category="Customer",
            definition="Percentage of customers who place more than one order within a given period.",
            business_importance="Key indicator of customer loyalty and product-market satisfaction.",
            formula="Repeat Purchase Rate % = (Customers with >1 Order / Total Customers) * 100",
            retail_example="If 300 out of 1,000 customers order again within 90 days, the Repeat Rate is 30%.",
            investigation_bridge_prompt="Which categories drive the highest repeat purchase rate?"
        ),
        "return_rate": KnowledgeConcept(
            concept_id="return_rate",
            title="Return Rate (%)",
            category="Customer",
            definition="Percentage of sold units returned by customers due to defects, sizing, or dissatisfaction.",
            business_importance="Elevated return rates erode profit margins and create reverse-logistics friction.",
            formula="Return Rate % = (Units Returned / Total Units Sold) * 100",
            retail_example="Out of 1,000 kitchen appliances sold, 49 returned equals a 4.9% Return Rate.",
            investigation_bridge_prompt="Which store or product category has the highest return rate?"
        ),
        "churn": KnowledgeConcept(
            concept_id="churn",
            title="Customer Churn Rate (%)",
            category="Customer",
            definition="Percentage of existing active customers who stop purchasing from the business over a time window.",
            business_importance="High churn signals customer attrition and erodes lifetime customer revenue.",
            formula="Churn Rate % = ((Customers at Start - Customers at End) / Customers at Start) * 100",
            retail_example="Losing 50 active corporate accounts out of 500 in a quarter equals a 10% Churn Rate.",
            investigation_bridge_prompt="Analyze customer churn across retail sales channels"
        ),

        # OPERATIONS
        "delivery_sla": KnowledgeConcept(
            concept_id="delivery_sla",
            title="Delivery SLA Compliance (%)",
            category="Operations",
            definition="Percentage of orders delivered to customers within the promised Service Level Agreement timeframe.",
            business_importance="Measures fulfillment reliability and operational logistics execution.",
            formula="SLA Compliance % = (Orders Delivered On-Time / Total Orders Delivered) * 100",
            retail_example="Delivering 950 out of 1,000 orders within the 48-hour promised SLA window equals 95% SLA compliance.",
            investigation_bridge_prompt="Show delivery SLA compliance across logistics channels"
        ),
        "lead_time": KnowledgeConcept(
            concept_id="lead_time",
            title="Order Fulfillment Lead Time",
            category="Operations",
            definition="Total time elapsed from when a customer places an order until physical item delivery.",
            business_importance="Shorter lead times improve customer satisfaction and reduce inventory holding friction.",
            formula="Lead Time = Delivery Date & Time - Order Placement Date & Time",
            retail_example="An order placed on Monday 9 AM and delivered Tuesday 3 PM has a 30-hour Lead Time.",
            investigation_bridge_prompt="Which region experiences the longest order fulfillment lead time?"
        ),
        "fulfilment_rate": KnowledgeConcept(
            concept_id="fulfilment_rate",
            title="Fulfillment Rate (%)",
            category="Operations",
            definition="Percentage of customer orders successfully packed and shipped without cancellations or backorders.",
            business_importance="Reflects warehouse operational capacity and order accuracy.",
            formula="Fulfillment Rate % = (Orders Successfully Fulfilled / Total Orders Placed) * 100",
            retail_example="Fulfilling 980 out of 1,000 placed orders yields a 98% Fulfillment Rate.",
            investigation_bridge_prompt="Show order fulfillment rates by store hub"
        ),
        "otif": KnowledgeConcept(
            concept_id="otif",
            title="On-Time In-Full (OTIF)",
            category="Operations",
            definition="Percentage of shipments delivered to the customer both on schedule AND with complete order quantity.",
            business_importance="The gold-standard operational supply chain performance metric.",
            formula="OTIF % = (Orders Delivered On-Time & In-Full / Total Orders) * 100",
            retail_example="Delivering 900 out of 1,000 orders on time with zero missing SKUs equals 90% OTIF.",
            investigation_bridge_prompt="Compare OTIF performance across regional delivery hubs"
        ),

        # BUSINESS INTELLIGENCE
        "kpi": KnowledgeConcept(
            concept_id="kpi",
            title="Key Performance Indicator (KPI)",
            category="Business Intelligence",
            definition="A quantifiable value used to evaluate how effectively a business achieves key strategic operational objectives.",
            business_importance="Focuses management attention on critical performance drivers.",
            formula="KPI = Measured Operational Value vs Defined Benchmark Target",
            retail_example="Tracking Gross Profit Margin % weekly to evaluate commercial retail performance.",
            investigation_bridge_prompt="Show active KPI status breakdown across operational domains"
        ),
        "business_driver": KnowledgeConcept(
            concept_id="business_driver",
            title="Business Driver",
            category="Business Intelligence",
            definition="Key internal or external factors (e.g. price depth, return volume, store location) that directly influence financial outputs.",
            business_importance="Identifying key drivers enables targeted operational intervention.",
            formula="Output Variance = SUM(Factor Driver Contributions)",
            retail_example="Identifying promotional discount depth as the primary driver behind gross margin variance.",
            investigation_bridge_prompt="Which business drivers are creating the largest variance alerts?"
        ),
        "business_health": KnowledgeConcept(
            concept_id="business_health",
            title="Business Health Score",
            category="Business Intelligence",
            definition="VESTA's composite 0-100 score evaluating overall operational strength across commercial, financial, and logistics metrics.",
            business_importance="Provides leadership with a single unified pulse indicator of enterprise health.",
            formula="Health Score = 100 - SUM(Issue Severity Weight * Priority Impact)",
            retail_example="A Health Score of 69.7 indicates an 'At Risk' status driven by gross profit margin compression.",
            investigation_bridge_prompt="Why is Business Health at its current score?"
        ),
        "target_variance": KnowledgeConcept(
            concept_id="target_variance",
            title="Target Variance Alert",
            category="Business Intelligence",
            definition="The divergence between actual measured performance metrics and established operational targets.",
            business_importance="Highlights operational bottlenecks requiring immediate executive intervention.",
            formula="Variance % = ((Actual Value - Target Value) / Target Value) * 100",
            retail_example="A target gross margin of 25% vs actual realized 18.2% creates a -6.8% Target Variance Alert.",
            investigation_bridge_prompt="Show top 3 target variance alerts in my business"
        ),
        "anomaly": KnowledgeConcept(
            concept_id="anomaly",
            title="Operational Anomaly",
            category="Business Intelligence",
            definition="An unexpected statistical deviation or spike in transaction volume, return rate, or discount depth.",
            business_importance="Early detection of anomalies prevents revenue leakage and operational fraud.",
            formula="Anomaly = Value > Mean + (2.5 * Standard Deviation)",
            retail_example="Detecting a sudden 45% return rate spike in a single store hub within 48 hours.",
            investigation_bridge_prompt="Detect recent statistical anomalies in retail sales data"
        ),
        "correlation_vs_causation": KnowledgeConcept(
            concept_id="correlation_vs_causation",
            title="Correlation vs Causation",
            category="Business Intelligence",
            definition="Correlation means two metrics move together; Causation proves one metric directly causes the other to change.",
            business_importance="Prevents costly executive missteps based on superficial metric co-movements.",
            formula="Correlation (r) = Co-movement Stat; Causation requires controlled experimental proof.",
            retail_example="High ice cream sales correlate with high sunglasses sales, but heat waves cause both.",
            investigation_bridge_prompt="Investigate root cause drivers of margin variance"
        )
    }

    @classmethod
    def get_concept(cls, query_text: str) -> Optional[KnowledgeConcept]:
        """
        Matches a user query string against the Business Knowledge Library concepts.
        """
        q_clean = query_text.lower().strip()
        
        # Exact/Keyword Alias Map
        alias_map = {
            "gross profit margin": "profit_margin",
            "profit margin": "profit_margin",
            "gross margin": "profit_margin",
            "margin": "profit_margin",
            "gross profit": "gross_profit",
            "net profit": "net_profit",
            "revenue": "revenue",
            "sales": "revenue",
            "contribution margin": "contribution_margin",
            "ebitda": "ebitda",
            "cogs": "cogs",
            "cost of goods": "cogs",
            "cost of goods sold": "cogs",
            "aov": "aov",
            "average order value": "aov",
            "sales growth": "sales_growth",
            "sales velocity": "sales_velocity",
            "sell through": "sell_through_rate",
            "sell-through": "sell_through_rate",
            "inventory turnover": "inventory_turnover",
            "stockout": "stockout_rate",
            "stockout rate": "stockout_rate",
            "safety stock": "safety_stock",
            "dead stock": "dead_stock",
            "reorder level": "reorder_level",
            "reorder point": "reorder_level",
            "roi": "roi",
            "return on investment": "roi",
            "roas": "roas",
            "return on ad spend": "roas",
            "ctr": "ctr",
            "click through": "ctr",
            "cpa": "cpa",
            "cost per acquisition": "cpa",
            "cac": "cac",
            "customer acquisition cost": "cac",
            "customer acquisition": "customer_acquisition",
            "ltv": "ltv",
            "customer lifetime value": "ltv",
            "lifetime value": "ltv",
            "repeat purchase": "repeat_purchase_rate",
            "repeat rate": "repeat_purchase_rate",
            "return rate": "return_rate",
            "return variance": "return_rate",
            "churn": "churn",
            "churn rate": "churn",
            "delivery sla": "delivery_sla",
            "sla": "delivery_sla",
            "lead time": "lead_time",
            "fulfilment rate": "fulfilment_rate",
            "fulfillment rate": "fulfilment_rate",
            "otif": "otif",
            "on time in full": "otif",
            "kpi": "kpi",
            "key performance indicator": "kpi",
            "business driver": "business_driver",
            "driver": "business_driver",
            "business health": "business_health",
            "health score": "business_health",
            "target variance": "target_variance",
            "variance": "target_variance",
            "anomaly": "anomaly",
            "correlation vs causation": "correlation_vs_causation",
            "correlation": "correlation_vs_causation"
        }

        # Check aliases
        for alias, cid in alias_map.items():
            if alias in q_clean:
                return cls.CONCEPTS.get(cid)

        # Check concept titles/ids directly
        for cid, concept in cls.CONCEPTS.items():
            if cid in q_clean or concept.title.lower() in q_clean:
                return concept

        return None

    @classmethod
    def get_all_concepts(cls) -> List[KnowledgeConcept]:
        return list(cls.CONCEPTS.values())
