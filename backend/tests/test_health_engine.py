import pandas as pd
import pytest
from app.engines.health_engine import HealthEngine
from app.models.domain import (
    ConfidenceLevel,
    ExecutiveHealthStatus,
    HealthCalculationState,
    KPIStatus
)

def test_health_score_calculation_and_decomposition():
    df = pd.DataFrame({
        "revenue": [1000.0, 2000.0, 3000.0],
        "quantity": [5, 10, 15],
        "return_flag": [0, 0, 0]
    })

    (
        score,
        top_3,
        view_more,
        storyline,
        active_kpis,
        available_categories,
        catalog,
        executive_intel
    ) = HealthEngine.compute_health_dashboard(df)

    assert score.overall_score is not None
    assert 0.0 <= score.overall_score <= 100.0
    assert len(score.contributions) > 0
    assert score.calculation_state in [HealthCalculationState.CALCULATED, HealthCalculationState.PARTIALLY_CALCULATED]
    assert score.executive_status in [ExecutiveHealthStatus.EXCELLENT, ExecutiveHealthStatus.HEALTHY, ExecutiveHealthStatus.NEEDS_ATTENTION, ExecutiveHealthStatus.AT_RISK, ExecutiveHealthStatus.CRITICAL_ATTENTION_REQUIRED]

    # Test that sum of contributions + drag points equals total points for available KPIs
    for c in score.contributions:
        if c.is_available:
            assert round(c.points_contributed + c.drag_points, 1) == round(c.weight_pct, 1)

    # Test that Storyline contains 4 bullets and strictly aligns
    assert storyline.overall_status != ""
    assert storyline.biggest_win != ""
    assert "stable transaction volume" not in storyline.biggest_win.lower()
    assert storyline.biggest_risk != ""
    assert len(storyline.next_actions) > 0

    # Test that executive_intelligence matches components
    assert executive_intel.health_score.overall_score == score.overall_score
    assert len(executive_intel.top_3_issues) == len(top_3)

def test_issue_priority_formula_normalization():
    df = pd.DataFrame({
        "revenue": [100.0, 200.0, 50.0],
        "quantity": [1, 2, 1],
        "return_flag": [1, 0, 1], # high returns
        "region": ["Lagos", "Lagos", "Abuja"]
    })

    (
        score,
        top_3,
        view_more,
        storyline,
        active_kpis,
        available_categories,
        catalog,
        executive_intel
    ) = HealthEngine.compute_health_dashboard(df)

    for issue in top_3:
        assert 0.0 <= issue.normalized_priority_score <= 1.0
        assert issue.ranking_reason != ""
        assert "Estimated impact" in issue.financial_impact_label or "Not reliably calculable" in issue.financial_impact_label

def test_unavailable_health_state():
    df_empty = pd.DataFrame({
        "unknown_column_a": ["a", "b", "c"],
        "unknown_column_b": [1, 2, 3]
    })

    (
        score,
        top_3,
        view_more,
        storyline,
        active_kpis,
        available_categories,
        catalog,
        executive_intel
    ) = HealthEngine.compute_health_dashboard(df_empty)

    assert score.calculation_state == HealthCalculationState.UNAVAILABLE
    assert score.overall_score is None
    assert score.executive_status == ExecutiveHealthStatus.UNAVAILABLE
    assert score.readiness_notes is not None
    assert "UNAVAILABLE" in storyline.overall_status
