import pandas as pd
import pytest
from app.engines.analytics_engine import AnalyticsEngine

def test_analytics_group_and_aggregate():
    df = pd.DataFrame({
        "region": ["Lagos", "Lagos", "Abuja", "Abuja"],
        "category": ["Electronics", "Appliances", "Electronics", "Appliances"],
        "revenue": [100.0, 200.0, 300.0, 400.0]
    })

    res = AnalyticsEngine.group_and_aggregate(df, dimensions=["region"], metrics=["revenue"])
    assert res["success"] is True
    assert len(res["records"]) == 2
    rec_map = {r["region"]: r["revenue"] for r in res["records"]}
    assert rec_map["Lagos"] == 300.0
    assert rec_map["Abuja"] == 700.0
    assert "GROUP_BY" in res["formula"]

def test_analytics_rank_dimension():
    df = pd.DataFrame({
        "product_name": ["Phone", "Laptop", "AC"],
        "revenue": [500.0, 1500.0, 800.0]
    })

    res = AnalyticsEngine.rank_dimension(df, dimension="product_name", metric="revenue", ascending=False)
    assert res["success"] is True
    assert res["records"][0]["product_name"] == "Laptop"
    assert res["records"][0]["revenue"] == 1500.0
    assert res["records"][0]["share_pct"] == round((1500.0 / 2800.0) * 100, 2)

def test_analytics_contribution_analysis():
    df = pd.DataFrame({
        "category": ["A", "B"],
        "revenue": [400.0, 600.0]
    })

    res = AnalyticsEngine.contribution_analysis(df, metric="revenue", dimension="category")
    assert res["success"] is True
    assert res["records"][0]["category"] == "B"
    assert res["records"][0]["contribution_pct"] == 60.0
