import pandas as pd
import pytest
from app.engines.kpi_registry import KPIRegistry
from app.models.domain import KPIStatus

def test_kpi_registry_activates_supported_and_marks_missing():
    df = pd.DataFrame({
        "sales_amount": [1000.0, 2000.0, 3000.0],
        "quantity": [1, 2, 3],
        "return_flag": [0, 0, 1]
    })

    active_kpis, catalog = KPIRegistry.evaluate_active_kpis(df)
    active_ids = [k.kpi_id for k in active_kpis]

    assert "kpi_total_revenue" in active_ids
    assert "kpi_units_sold" in active_ids
    assert "kpi_return_rate" in active_ids

    # CSAT is missing from this dataset, should be in catalog as is_available=False
    csat_item = next((c for c in catalog if c["kpi_id"] == "kpi_csat"), None)
    assert csat_item is not None
    assert csat_item["is_available"] is False
    assert "csat_score" in csat_item["missing_fields"]
