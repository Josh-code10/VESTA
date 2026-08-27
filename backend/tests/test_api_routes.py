from fastapi.testclient import TestClient
import pytest
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_connect_and_profile_endpoint():
    response = client.post("/api/v1/data-source/connect", json={})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["row_count"] > 0
    assert "data_dictionary" in data

def test_health_dashboard_endpoint():
    # Make sure data source is loaded
    client.post("/api/v1/data-source/connect", json={})
    response = client.get("/api/v1/health/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "health_score" in data
    assert "business_storyline" in data
    assert "top_3_issues" in data
    assert "kpis" in data
    assert len(data["kpis"]) > 0

def test_investigate_query_endpoint():
    client.post("/api/v1/data-source/connect", json={})
    response = client.post("/api/v1/investigate/query", json={
        "question": "Which regions had the highest revenue?"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["answerability"] == "ANSWERABLE"
    assert "node" in data
    assert data["node"]["epistemic_status"] in ["FACT", "OBSERVATION"]
    assert data["node"]["insight"] is not None
    assert data["node"]["insight"]["headline"] != ""
    assert data["node"]["lineage"]["formula_breadcrumb"] != ""

def test_investigate_unsupported_csat_query():
    client.post("/api/v1/data-source/connect", json={})
    response = client.post("/api/v1/investigate/query", json={
        "question": "What is our customer satisfaction CSAT score in Abuja?"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["answerability"] == "INSUFFICIENT_DATA"
    assert data["node"]["epistemic_status"] == "UNKNOWN"
    assert data["node"]["insight"] is not None
    assert "Unavailable" in data["node"]["insight"]["metric_highlight"]["value"]

def test_report_generation_endpoint():
    client.post("/api/v1/data-source/connect", json={})
    # Run a query to create a node
    q_res = client.post("/api/v1/investigate/query", json={
        "question": "Break down revenue by category"
    })
    inv_id = q_res.json()["investigation_id"]

    rep_res = client.post("/api/v1/reports/generate", json={
        "investigation_id": inv_id,
        "report_title": "Executive Category Breakdown"
    })
    assert rep_res.status_code == 200
    rep_data = rep_res.json()
    assert "Executive Summary" in rep_data["markdown_content"]
    assert len(rep_data["key_findings"]) > 0

def test_voice_storyline_endpoint():
    response = client.post("/api/v1/voice/storyline", json={
        "business_name": "Apex Retail Stores",
        "overall_status": "Top-line growth remains steady with profit margins sustaining healthy targets.",
        "biggest_win": "Gross profit margin is performing strongly at 24.2%.",
        "biggest_risk": "Return rate in Lagos is the primary operational drag.",
        "next_actions": ["Audit promotional discounting in Lagos"],
        "voice": "adam"
    })
    assert response.status_code == 200
    assert response.headers["content-type"] == "audio/mpeg"
    assert len(response.content) > 1000

