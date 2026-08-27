import requests

def test_10_ceo_triggers():
    s = requests.Session()
    s.post('http://127.0.0.1:8000/api/v1/data-source/connect')

    triggers = [
        ("Why did profit margin decline in the second half of the year despite revenue growth?", "ROOT_CAUSE", "waterfall", "line"),
        ("Which stores are driving the company's profitability, not just revenue?", "COMPARISON", "horizontal_bar", "scatter"),
        ("Which products account for most of our return losses?", "PARETO", "bar", "line"),
        ("Are discounts helping us grow sales, or hurting profitability?", "CORRELATION", "scatter", "waterfall"),
        ("Which marketing campaigns generated the highest ROI, and which wasted budget?", "ROI_ANALYSIS", "scatter", "horizontal_bar"),
        ("Show me where inventory problems exist across stores and categories.", "OPERATIONAL_BOTTLENECK", "heatmap", "treemap"),
        ("Which delivery partner is affecting customer experience the most?", "DISTRIBUTION", "box_plot", "heatmap"),
        ("Which customer segments are the most valuable to NexaSphere?", "SEGMENTATION", "treemap", "donut"),
        ("Which employees are achieving sales targets without sacrificing profit margin?", "TARGET_VARIANCE", "scatter", "waterfall"),
        ("Compare Lagos and Abuja across every major business driver.", "EXECUTIVE_COMPARISON", "horizontal_bar", "line")
    ]

    print("\n=================== 10 CEO ANALYTICAL INTELLIGENCE VERIFICATION ===================")
    passed_count = 0
    for idx, (question, exp_type, exp_primary, exp_secondary) in enumerate(triggers, 1):
        resp = s.post('http://127.0.0.1:8000/api/v1/investigate/query', json={'question': question}).json()
        node = resp.get('node', {})
        insight = node.get('insight', {})
        five_art = insight.get('five_artifact_response', {})
        vis_spec = five_art.get('visualization_spec', {})

        act_type = vis_spec.get('analysis_type')
        act_primary = vis_spec.get('primary_chart')
        act_secondary = vis_spec.get('secondary_chart')
        pivot_req = vis_spec.get('pivot_required')

        match_type = (act_type == exp_type)
        match_primary = (act_primary == exp_primary)
        match_secondary = (act_secondary == exp_secondary)

        status = "PASSED" if (match_type and match_primary and match_secondary and pivot_req) else "FAILED"
        if status == "PASSED":
            passed_count += 1

        print(f"\n{idx}. [{status}] Query: \"{question[:50]}...\"")
        print(f"   Expected: Type={exp_type}, Primary={exp_primary}, Secondary={exp_secondary}, Pivot=True")
        print(f"   Actual:   Type={act_type}, Primary={act_primary}, Secondary={act_secondary}, Pivot={pivot_req}")

    print(f"\n=================== TOTAL SCORE: {passed_count}/{len(triggers)} PASSED ===================")
    assert passed_count == len(triggers), f"Expected 10/10 passed, but got {passed_count}/10"

if __name__ == '__main__':
    test_10_ceo_triggers()
