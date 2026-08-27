import requests
import json
import sys

# Ensure UTF-8 output encoding on Windows console
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def verify_live_stack():
    backend_url = "http://127.0.0.1:8000"
    frontend_url = "http://127.0.0.1:5173"

    print("==================================================")
    print("1. VERIFYING BACKEND SERVER & ROOT HEALTH")
    print("==================================================")
    res = requests.get(f"{backend_url}/")
    assert res.status_code == 200, f"Backend health failed: {res.status_code}"
    print("[OK] Backend status:", res.json())

    print("\n==================================================")
    print("2. CONNECTING & PROFILING LIVE DATASET")
    print("==================================================")
    res = requests.post(f"{backend_url}/api/v1/data-source/connect", json={})
    assert res.status_code == 200
    data = res.json()
    print(f"[OK] Connected Dataset: {data['dataset_title']} ({data['row_count']} rows, {data['column_count']} columns)")
    print(f"[OK] Detected Capabilities: {data['data_dictionary']['capabilities_detected']}")

    print("\n==================================================")
    print("3. EVALUATING UNIFIED EXECUTIVE INTELLIGENCE")
    print("==================================================")
    res = requests.get(f"{backend_url}/api/v1/health/dashboard")
    assert res.status_code == 200
    health = res.json()
    
    score_obj = health['health_score']
    print(f"[OK] Overall Health Score: {score_obj['overall_score']} / 100 [{score_obj['executive_status']}]")
    print(f"[OK] Calculation State: {score_obj['calculation_state']}")
    print(f"[OK] Confidence Level: {score_obj['confidence_level']} ({score_obj['confidence_reason']})")
    print(f"[OK] Available Categories: {health.get('available_categories', [])}")
    
    print("\nSynchronized Storyline:")
    print(f"   * Overall: {health['business_storyline']['overall_status']}")
    print(f"   * Win: {health['business_storyline']['biggest_win']}")
    print(f"   * Risk: {health['business_storyline']['biggest_risk']}")
    print(f"   * Actions: {health['business_storyline']['next_actions']}")
    
    print("\nManagement Attention (Top 3 Issues):")
    for idx, issue in enumerate(health['top_3_issues'], 1):
        print(f"   #{idx} [{issue['severity']}] {issue['title']} (Priority: {issue['normalized_priority_score']}) | {issue['financial_impact_label']}")

    print("\n==================================================")
    print("4. TESTING CONVERSATIONAL ROOT-CAUSE INVESTIGATION")
    print("==================================================")
    query_payload = {"question": "Why did gross profit margin collapse in Lagos in July?"}
    res = requests.post(f"{backend_url}/api/v1/investigate/query", json=query_payload)
    assert res.status_code == 200
    inv = res.json()
    print(f"[OK] Answerability: {inv['answerability']}")
    print(f"[OK] Epistemic Tag: {inv['node']['epistemic_status']}")
    print(f"[OK] Formula: {inv['node']['lineage']['formula_breadcrumb']}")
    print(f"[OK] Executive Finding:\n{inv['node']['executive_finding']}")

    print("\n==================================================")
    print("5. TESTING EPISTEMIC BOUNDARY (UNSUPPORTED CSAT QUERY)")
    print("==================================================")
    unsupported_payload = {"question": "What is our customer satisfaction CSAT score in Abuja?"}
    res = requests.post(f"{backend_url}/api/v1/investigate/query", json=unsupported_payload)
    assert res.status_code == 200
    boundary = res.json()
    print(f"[OK] Answerability: {boundary['answerability']}")
    print(f"[OK] Epistemic Tag: {boundary['node']['epistemic_status']}")
    print(f"[OK] Limitations Recorded:")
    print(f"   * Missing: {boundary['node']['limitations']['missing']}")
    print(f"   * Available: {boundary['node']['limitations']['available']}")
    print(f"   * Alternatives: {boundary['node']['limitations']['investigable_alternatives']}")

    print("\n==================================================")
    print("6. GENERATING EXECUTIVE MANAGEMENT REPORT")
    print("==================================================")
    report_payload = {
        "investigation_id": inv["investigation_id"],
        "report_title": "Executive Briefing: Q3 Margin Contraction"
    }
    res = requests.post(f"{backend_url}/api/v1/reports/generate", json=report_payload)
    assert res.status_code == 200
    report = res.json()
    print(f"[OK] Report ID: {report['report_id']}")
    print(f"[OK] Findings Count: {len(report['key_findings'])}")
    print(f"[OK] Executive Summary: {report['executive_summary']}")

    print("\n==================================================")
    print("7. VERIFYING FRONTEND VITE WEB SERVER")
    print("==================================================")
    res = requests.get(f"{frontend_url}/")
    assert res.status_code == 200
    assert "<div id=\"root\">" in res.text
    print(f"[OK] Frontend HTML served successfully with HTTP 200!")

    print("\n==================================================")
    print("[SUCCESS] ALL END-TO-END VERIFICATION CHECKS PASSED!")
    print("==================================================")

if __name__ == "__main__":
    try:
        verify_live_stack()
    except Exception as e:
        print(f"[ERROR] Verification failed: {e}")
        sys.exit(1)
