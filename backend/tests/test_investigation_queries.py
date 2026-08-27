import sys
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.ai.gemini_client import GeminiOrchestrator
from app.api.deps import SessionDataManager

sys.stdout.reconfigure(encoding="utf-8")
client = TestClient(app)

def test_investigation_diverse_questions():
    df = SessionDataManager.load_demo_fixture("ws_default")
    orchestrator = GeminiOrchestrator()

    test_queries = [
        # Commercial / Operational
        "Why did gross profit margin collapse in Lagos in July?",
        "Which product categories have the highest return rate?",
        "Show average discount depth by channel",
        "Which specific regions and products drove that variance?",
        "Show me the gross profit margin breakdown by category.",
        "Rank top 5 products by return rate volume.",
        "Which stores are driving profitability, not just revenue?",
        "Compare Lagos and Abuja across every major business driver",
        "Which products account for most of our return losses?",
        "Show gross revenue by store",
        "Break down units sold by category",
        
        # Knowledge Concepts
        "What is Gross Profit Margin %?",
        "Explain Inventory Turnover Ratio",
        "What is Return on Ad Spend (ROAS)?",
        "Explain customer acquisition cost simply",
        
        # Dashboard Methodology
        "Why is Business Health 69.7?",
        "How is the Health Score calculated?",
        "Why is Return Rate marked yellow?",
        
        # Strategy Advisory
        "How should we reduce return rate in Lagos?",
        "What strategy can optimize promotional discounting?",
        
        # Epistemic Boundaries
        "What is our customer satisfaction CSAT score in Abuja?"
    ]

    for q in test_queries:
        node, answerability, filters = orchestrator.process_investigation_turn(df, q)
        assert node is not None, f"Node was None for query: {q}"
        assert node.insight is not None, f"Insight was None for query: {q}"
        assert node.insight.headline != "", f"Headline empty for query: {q}"
        assert node.executive_finding != "", f"Executive finding empty for query: {q}"


def test_investigation_api_query_endpoint():
    client.post("/api/v1/data-source/connect", json={})
    
    questions = [
        "Which product categories have the highest return rate?",
        "Show me the gross profit margin breakdown by category.",
        "Why is Business Health 69.7?",
        "What is Gross Profit Margin %?"
    ]
    
    for q in questions:
        res = client.post("/api/v1/investigate/query", json={"question": q})
        assert res.status_code == 200, f"Failed on {q}: {res.text}"
        data = res.json()
        assert "node" in data
        assert data["node"]["insight"]["headline"] != ""
