import pytest
import pandas as pd
from app.engines.pattern_registry import PatternRegistry, PatternMatchResult
from app.engines.analytics_engine import AnalyticsEngine
from app.engines.visualization_router import VisualizationRouter, AnalysisType
from app.engines.implication_engine import ImplicationEngine

# 10 CEO Demo Test Questions
DEMO_QUESTIONS = [
    ("Why did profit margin decline in the second half of the year despite revenue growth?", "profit_decline_driver", "waterfall"),
    ("Are discounts helping us grow sales, or hurting profitability?", "profitability_tradeoff", "scatter"),
    ("Which products account for most of our return losses?", "return_driver", "bar"),
    ("Which stores are driving the company's profitability, not just revenue?", "store_profitability", "horizontal_bar"),
    ("Which marketing campaigns generated the highest ROI, and which wasted budget?", "campaign_roi", "scatter"),
    ("Show me where inventory problems exist across stores and categories.", "inventory_imbalance", "heatmap"),
    ("Which delivery partner is affecting customer experience the most?", "delivery_performance", "box_plot"),
    ("Which customer segments are the most valuable to NexaSphere?", "customer_value_segmentation", "treemap"),
    ("Which employees are achieving sales targets without sacrificing profit margin?", "employee_target_profitability", "scatter"),
    ("Compare Lagos and Abuja across every major business driver.", "executive_dimension_comparison", "horizontal_bar")
]

MOCK_COLUMNS = [
    "gross_revenue", "gross_profit", "discount_amount", "discount_depth_pct",
    "return_count", "inventory_quantity", "delivery_time_days", "marketing_spend",
    "sales_target", "order_count", "region", "store_name", "category",
    "product_name", "sales_channel", "marketing_campaign", "delivery_partner",
    "customer_segment", "employee_name", "date"
]

def test_pattern_routing_for_all_10_demo_questions():
    for q, expected_pattern, expected_chart in DEMO_QUESTIONS:
        res = PatternRegistry.match_question(q, available_columns=MOCK_COLUMNS)
        assert res is not None, f"Failed to match question: '{q}'"
        assert res.pattern_id == expected_pattern, f"Expected {expected_pattern}, got {res.pattern_id} for '{q}'"
        assert res.status == "ANSWERABLE"
        assert res.contract.primary_vis == expected_chart

def test_required_data_validation_missing_fields():
    # Test missing required discount field for profitability_tradeoff
    limited_cols = ["gross_revenue", "gross_profit", "region"]
    q = "Are discounts hurting profit?"
    res = PatternRegistry.match_question(q, available_columns=limited_cols)
    assert res is not None
    assert res.pattern_id == "profitability_tradeoff"
    assert res.status == "INSUFFICIENT_DATA"
    assert "discount_amount" in res.missing_fields

def test_deterministic_calculation_accuracy():
    df = pd.DataFrame({
        "product_name": ["Product A", "Product B", "Product C"],
        "return_count": [10, 80, 10]
    })
    res = AnalyticsEngine.execute_pattern_analysis("return_driver", df)
    assert res["success"] is True
    assert res["dimension"] == "product_name"
    records = res["records"]
    assert records[0]["product_name"] == "Product B"
    assert records[0]["return_count"] == 80
    assert records[0]["share_pct"] == 80.0
    assert records[0]["cum_share_pct"] == 80.0

def test_five_artifact_schema_completeness():
    data_records = [{"region": "Lagos", "gross_revenue": 1000.0, "gross_profit": 200.0}]
    resp = ImplicationEngine.generate_five_artifacts(
        question="Why did profit margin decline?",
        analytical_intent="ROOT_CAUSE",
        dimensions=["region"],
        metrics=["gross_profit"],
        data_records=data_records,
        executive_finding="Lagos accounted for margin decline.",
        executive_summary="Profit deterioration is concentrated in Lagos.",
        analysis_plan=[{"step": "Comparing periods", "status": "COMPLETED"}],
        management_attention="Management may want to review discounting rules.",
        limitations=["Causes outside transactional records cannot be inferred."]
    )
    assert resp.executive_answer == "Lagos accounted for margin decline."
    assert resp.visualization_spec.primary_chart == "waterfall"
    assert resp.management_attention == "Management may want to review discounting rules."
    assert len(resp.analysis_plan) == 1
    assert len(resp.limitations) == 1
