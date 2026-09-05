import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.engines.health_engine import HealthEngine
from app.ai.gemini_client import GeminiOrchestrator
from app.api.deps import SessionDataManager

client = TestClient(app)

def test_inferred_business_questions_generation():
    df = SessionDataManager.load_demo_fixture("ws_default")
    questions = HealthEngine.infer_business_questions(df)

    assert isinstance(questions, list)
    assert len(questions) >= 3
    # Check that questions are relevant to the demo dataset anomalies
    has_margin_q = any("margin" in q.lower() for q in questions)
    has_return_q = any("return" in q.lower() for q in questions)
    assert has_margin_q, "Expected a margin-related inferred question"
    assert has_return_q, "Expected a return-related inferred question"


def test_health_dashboard_api_returns_inferred_questions():
    client.post("/api/v1/data-source/connect", json={})
    res = client.get("/api/v1/health/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert "inferred_questions" in data
    assert isinstance(data["inferred_questions"], list)
    assert len(data["inferred_questions"]) > 0


def test_colloquial_and_diverse_phrasings():
    df = SessionDataManager.load_demo_fixture("ws_default")
    orchestrator = GeminiOrchestrator()

    colloquial_tests = [
        # Margin / Profit loss phrasing
        "Where are we losing money?",
        "Which areas have the worst margins?",
        "Tell me which branch is least profitable",
        "Where are we leaking cash across our territories?",

        # Discount & promotional phrasing
        "Are markdowns eating into our margins?",
        "How deep are our promo discounts across platforms?",

        # Returns phrasing
        "Which items do customers keep sending back?",
        "Where are return losses coming from?",

        # Revenue & sales ranking
        "Who is generating the most revenue?",
        "Which shop leads top line cashflow?",

        # Clarification
        "How is our business doing overall?",
        "Explain the health score and what the yellow return rate means"
    ]

    for q in colloquial_tests:
        node, answerability, filters = orchestrator.process_investigation_turn(df, q)
        assert node is not None, f"Node was None for colloquial query: '{q}'"
        assert node.insight is not None, f"Insight was None for query: '{q}'"
        assert node.insight.headline, f"Headline empty for query: '{q}'"
        assert node.executive_finding, f"Executive finding empty for query: '{q}'"

        # Check specific intent handling
        if "losing money" in q or "worst margins" in q:
            assert node.insight.metric_highlight is not None
            # Lowest margin should be highlighted as warning
            assert node.insight.metric_highlight.status == "warning" or "lowest" in node.insight.headline.lower()


def test_product_breakdown_by_store_location():
    df = SessionDataManager.load_demo_fixture("ws_default")
    orchestrator = GeminiOrchestrator()

    # Query with active regional filter
    node, answerability, filters = orchestrator.process_investigation_turn(
        df=df,
        user_question="Break down Inverter Split AC 1.5HP (AC-902) by store location",
        active_filters={"region": "Port Harcourt"}
    )

    assert node is not None
    assert node.evidence_data.get("dimensions") == ["store_name"]
    records = node.evidence_data.get("records", [])
    assert len(records) == 2, f"Expected 2 stores in Port Harcourt, got {len(records)}"
    store_names = [r["store_name"] for r in records]
    assert "GRA Phase 2 Store" in store_names
    assert "Trans-Amadi Commercial" in store_names
