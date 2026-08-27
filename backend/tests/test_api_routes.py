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

def test_refresh_endpoint():
    client.post("/api/v1/data-source/connect", json={})
    response = client.post("/api/v1/data-source/refresh")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["sync_status"] == "READY"
    assert "last_synced_at" in data
    assert data["row_count"] > 0
    assert data["dataset_title"] != ""

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
    # If API key is not configured locally, it returns 401, otherwise 200
    assert response.status_code in [200, 401]

def test_session_data_manager_source_persistence():
    from app.api.deps import SessionDataManager
    SessionDataManager.set_data_source("ws_test", "https://docs.google.com/spreadsheets/d/abc1234/edit#gid=0")
    assert SessionDataManager.get_data_source("ws_test") == "https://docs.google.com/spreadsheets/d/abc1234/edit#gid=0"
    SessionDataManager.set_data_source("ws_test", None)
    assert SessionDataManager.get_data_source("ws_test") is None

def test_connect_stores_source_and_refresh_uses_it(monkeypatch):
    from app.api.deps import SessionDataManager
    import app.api.v1.data_source as ds_module
    import pandas as pd

    # Mock _load_google_sheet_or_file to track calls
    call_log = []
    def mock_load(url_or_preset, force_refresh=False, bypass_cache=False):
        call_log.append((url_or_preset, force_refresh or bypass_cache))
        sample_df = pd.DataFrame({
            "order_id": ["ORD-1", "ORD-2", "ORD-3"],
            "revenue": [1000.0, 2000.0, 3000.0],
            "cogs": [700.0, 1400.0, 2100.0],
            "quantity": [1, 2, 3],
            "region": ["Lagos", "Abuja", "Lagos"],
            "category": ["Electronics", "Appliances", "Electronics"],
            "return_flag": [0, 1, 0]
        })
        return sample_df, "Mocked Google Sheet Title"

    monkeypatch.setattr(ds_module, "_load_google_sheet_or_file", mock_load)

    test_url = "https://docs.google.com/spreadsheets/d/test_sheet_id/edit#gid=0"
    conn_res = client.post("/api/v1/data-source/connect", json={"sheet_url": test_url})
    assert conn_res.status_code == 200
    assert SessionDataManager.get_data_source("ws_default") == test_url
    assert len(call_log) == 1
    assert call_log[-1] == (test_url, True)

    ref_res = client.post("/api/v1/data-source/refresh")
    assert ref_res.status_code == 200
    ref_data = ref_res.json()
    assert ref_data["status"] == "success"
    assert ref_data["dataset_title"] == "Mocked Google Sheet Title"
    assert ref_data["row_count"] == 3
    assert len(call_log) == 2
    assert call_log[-1] == (test_url, True)


