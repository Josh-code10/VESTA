import pandas as pd
import pytest
from app.engines.profiler import DataProfiler
from app.models.domain import ColumnRole

def test_profiler_detects_columns_and_roles():
    df = pd.DataFrame({
        "order_id": ["ORD-001", "ORD-002", "ORD-003"],
        "order_date": ["2025-07-01", "2025-07-02", "2025-07-03"],
        "revenue": [150000.0, 240000.0, 85000.0],
        "quantity": [2, 3, 1],
        "region": ["Lagos", "Abuja", "Lagos"],
        "return_flag": [0, 1, 0]
    })

    dd = DataProfiler.profile_dataframe(df, title="Test Dataset")
    
    assert dd.row_count == 3
    assert dd.column_count == 6
    assert "revenue" in dd.columns
    assert dd.columns["revenue"].role == ColumnRole.MEASURE
    assert dd.columns["revenue"].inferred_type == "currency"
    assert dd.columns["order_date"].role == ColumnRole.DATE
    assert dd.columns["order_id"].role == ColumnRole.IDENTIFIER
    assert "financial" in dd.capabilities_detected
    assert "commercial" in dd.capabilities_detected
    assert "returns" in dd.capabilities_detected

def test_profiler_flags_ambiguity():
    df = pd.DataFrame({
        "amount": [100.0, 200.0, None, None, None],
        "category": ["A", "B", "C", "D", "E"]
    })

    dd = DataProfiler.profile_dataframe(df)
    assert dd.columns["amount"].is_ambiguous is True
    assert "generic" in dd.columns["amount"].ambiguity_reason.lower() or "missingness" in dd.columns["amount"].ambiguity_reason.lower()
