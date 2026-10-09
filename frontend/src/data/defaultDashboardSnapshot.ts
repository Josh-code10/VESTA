import type { HealthDashboardResponse } from "../types/api";

export const DEFAULT_DASHBOARD_SNAPSHOT: HealthDashboardResponse = {
  "workspace_id": "ws_default",
  "dataset_title": "NexaSphere Enterprise Dataset",
  "row_count": 30443,
  "column_count": 70,
  "last_synced_at": "2026-10-09T01:30:00.000Z",
  "sync_status": "READY",
  "business_storyline": {
    "overall_status": "Operational performance is facing divergence \u2014 key channel costs and return volumes are eroding core profitability.",
    "biggest_win": "Total Gross Revenue reached \u20a628.34B, driving primary commercial cashflow.",
    "biggest_risk": "Return rate concentration in FCT \u00b7 Commercial Core is the primary operational drag (Estimated impact: -\u20a61,417,135,876.89).",
    "next_actions": [
      "Investigate return drivers and category mix in FCT",
      "Audit promotional discounting and COGS in FCT"
    ],
    "reading_time_seconds": 30,
    "executive_narrative": "Enterprise health is evaluated at 59.5/100 [AT_RISK]. Gross commercial revenue stands at \u20a628.34B with gross margin realization tracking at 18.7% and aggregate return volume pacing at 28.1%. Primary operational focus remains on mitigating margin erosion and discounting depth in FCT \u00b7 Commercial Core.",
    "channel_highlights": [
      {
        "label": "Gross Revenue",
        "value": "\u20a628.34B",
        "detail": "Top-line commercial cashflow"
      },
      {
        "label": "Gross Unit Margin",
        "value": "18.7%",
        "detail": "Bottom-line profitability realization"
      },
      {
        "label": "Return Volume Rate",
        "value": "28.1%",
        "detail": "Reverse logistics friction exposure"
      }
    ],
    "generated_at": "2026-10-09T01:30:00.000Z"
  },
  "health_score": {
    "overall_score": 59.5,
    "status": "WARNING",
    "executive_status": "AT_RISK",
    "calculation_state": "CALCULATED",
    "confidence_level": "HIGH",
    "confidence_reason": "High confidence: Computed deterministically across 30,443 verified transactions with zero synthetic interpolation.",
    "largest_positive_contributor": {
      "name": "Total Gross Revenue",
      "kpi_id": "kpi_total_revenue",
      "points": 20.4,
      "current_value": 28342717537.760002
    },
    "largest_negative_contributor": {
      "name": "Gross Profit Margin",
      "kpi_id": "kpi_gross_margin",
      "drag": 18.3,
      "current_value": 18.73
    },
    "previous_score": null,
    "active_kpi_count": 6,
    "contributions": [
      {
        "kpi_id": "kpi_total_revenue",
        "name": "Total Gross Revenue",
        "category": "Financial",
        "current_value": 28342717537.760002,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 85.0,
        "weight_pct": 24.0,
        "points_contributed": 20.4,
        "drag_points": 3.6,
        "status": "HEALTHY",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "SUM(revenue)",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_gross_margin",
        "name": "Gross Profit Margin",
        "category": "Financial",
        "current_value": 18.73,
        "previous_value": null,
        "target_value": 25.0,
        "variance_pct": -25.08,
        "metric_score": 34.8,
        "weight_pct": 28.0,
        "points_contributed": 9.7,
        "drag_points": 18.3,
        "status": "CRITICAL",
        "executive_status": "CRITICAL_ATTENTION_REQUIRED",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "((SUM(revenue) - SUM(cogs)) / SUM(revenue)) * 100",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_units_sold",
        "name": "Total Units Sold",
        "category": "Commercial",
        "current_value": 61125.0,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 85.0,
        "weight_pct": 16.0,
        "points_contributed": 13.6,
        "drag_points": 2.4,
        "status": "HEALTHY",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "SUM(quantity)",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_return_rate",
        "name": "Return Rate",
        "category": "Operations",
        "current_value": 28.1,
        "previous_value": null,
        "target_value": 8.0,
        "variance_pct": 251.25000000000003,
        "metric_score": 0.0,
        "weight_pct": 12.0,
        "points_contributed": 0.0,
        "drag_points": 12.0,
        "status": "CRITICAL",
        "executive_status": "CRITICAL_ATTENTION_REQUIRED",
        "directionality": "LOWER_IS_BETTER",
        "formula_breadcrumb": "(COUNT(returned_orders) / COUNT(total_orders)) * 100",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_average_order_value",
        "name": "Average Order Value (AOV)",
        "category": "Commercial",
        "current_value": 931009.35,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 85.0,
        "weight_pct": 12.0,
        "points_contributed": 10.2,
        "drag_points": 1.8,
        "status": "HEALTHY",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "SUM(revenue) / TOTAL_ROWS",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_discount_depth",
        "name": "Average Discount Depth",
        "category": "Commercial",
        "current_value": 11.07,
        "previous_value": null,
        "target_value": 8.0,
        "variance_pct": 38.375,
        "metric_score": 69.7,
        "weight_pct": 8.0,
        "points_contributed": 5.6,
        "drag_points": 2.4,
        "status": "WARNING",
        "executive_status": "AT_RISK",
        "directionality": "LOWER_IS_BETTER",
        "formula_breadcrumb": "AVG(Discount_Percentage) * 100",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_csat",
        "name": "Customer Satisfaction (CSAT)",
        "category": "Customer",
        "current_value": 0.0,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 0.0,
        "weight_pct": 15.0,
        "points_contributed": 0.0,
        "drag_points": 0.0,
        "status": "CRITICAL",
        "executive_status": "UNAVAILABLE",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "Required column fields missing from dataset",
        "is_available": false,
        "missing_fields": [
          "csat_score"
        ]
      }
    ],
    "readiness_notes": null,
    "calculated_at": "2026-10-09T01:30:00.000Z"
  },
  "top_3_issues": [
    {
      "issue_id": "issue_kpi_return_rate_e06c",
      "title": "Return Rate Variance Alert",
      "kpi_id": "kpi_return_rate",
      "severity": "WARNING",
      "component_scores": {
        "financial_impact": 0.5,
        "target_deviation": 1.0,
        "rate_of_change": 0.65,
        "business_criticality": 0.375
      },
      "component_availability": {
        "financial_impact": true,
        "target_deviation": true,
        "rate_of_change": true,
        "business_criticality": true
      },
      "normalized_priority_score": 0.643,
      "ranking_reason": "Ranked due to Return Rate performance (0.0/100) causing a -15.0pt drag on enterprise health score.",
      "financial_impact_label": "Estimated impact: -\u20a61,417,135,876.89",
      "current_value": 28.1,
      "baseline_target": 8.0,
      "variance_pct": 251.25000000000003,
      "primary_driver": "FCT \u00b7 Commercial Core",
      "detected_at": "2026-10-09 01:15:52.915812"
    },
    {
      "issue_id": "issue_kpi_gross_margin_1695",
      "title": "Gross Profit Margin Variance Alert",
      "kpi_id": "kpi_gross_margin",
      "severity": "WARNING",
      "component_scores": {
        "financial_impact": 0.326,
        "target_deviation": 0.836,
        "rate_of_change": 0.65,
        "business_criticality": 0.875
      },
      "component_availability": {
        "financial_impact": true,
        "target_deviation": true,
        "rate_of_change": true,
        "business_criticality": true
      },
      "normalized_priority_score": 0.573,
      "ranking_reason": "Ranked due to Gross Profit Margin performance (34.8/100) causing a -22.8pt drag on enterprise health score.",
      "financial_impact_label": "Estimated impact: -\u20a6923,972,591.73",
      "current_value": 18.73,
      "baseline_target": 25.0,
      "variance_pct": -25.08,
      "primary_driver": "FCT \u00b7 Commercial Core",
      "detected_at": "2026-10-09 01:15:52.913588"
    },
    {
      "issue_id": "issue_kpi_discount_depth_d287",
      "title": "Average Discount Depth Variance Alert",
      "kpi_id": "kpi_discount_depth",
      "severity": "WARNING",
      "component_scores": {
        "financial_impact": 0.152,
        "target_deviation": 1.0,
        "rate_of_change": 0.65,
        "business_criticality": 0.25
      },
      "component_availability": {
        "financial_impact": true,
        "target_deviation": true,
        "rate_of_change": true,
        "business_criticality": true
      },
      "normalized_priority_score": 0.473,
      "ranking_reason": "Ranked due to Average Discount Depth performance (69.7/100) causing a -3.0pt drag on enterprise health score.",
      "financial_impact_label": "Estimated impact: -\u20a6429,392,170.70",
      "current_value": 11.07,
      "baseline_target": 8.0,
      "variance_pct": 38.375,
      "primary_driver": "FCT \u00b7 Commercial Core",
      "detected_at": "2026-10-09 01:15:52.918027"
    }
  ],
  "view_more_issues": [],
  "kpis": [
    {
      "kpi_id": "kpi_total_revenue",
      "name": "Total Gross Revenue",
      "category": "Financial",
      "current_value": 28342717537.760002,
      "previous_value": null,
      "target_value": null,
      "variance_pct": null,
      "metric_score": 85.0,
      "weight_pct": 30.0,
      "points_contributed": 25.5,
      "drag_points": 4.5,
      "status": "HEALTHY",
      "executive_status": "HEALTHY",
      "directionality": "HIGHER_IS_BETTER",
      "formula_breadcrumb": "SUM(revenue)",
      "is_available": true,
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_gross_margin",
      "name": "Gross Profit Margin",
      "category": "Financial",
      "current_value": 18.73,
      "previous_value": null,
      "target_value": 25.0,
      "variance_pct": -25.08,
      "metric_score": 34.8,
      "weight_pct": 35.0,
      "points_contributed": 12.2,
      "drag_points": 22.8,
      "status": "CRITICAL",
      "executive_status": "HEALTHY",
      "directionality": "HIGHER_IS_BETTER",
      "formula_breadcrumb": "((SUM(revenue) - SUM(cogs)) / SUM(revenue)) * 100",
      "is_available": true,
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_units_sold",
      "name": "Total Units Sold",
      "category": "Commercial",
      "current_value": 61125.0,
      "previous_value": null,
      "target_value": null,
      "variance_pct": null,
      "metric_score": 85.0,
      "weight_pct": 20.0,
      "points_contributed": 17.0,
      "drag_points": 3.0,
      "status": "HEALTHY",
      "executive_status": "HEALTHY",
      "directionality": "HIGHER_IS_BETTER",
      "formula_breadcrumb": "SUM(quantity)",
      "is_available": true,
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_return_rate",
      "name": "Return Rate",
      "category": "Operations",
      "current_value": 28.1,
      "previous_value": null,
      "target_value": 8.0,
      "variance_pct": 251.25000000000003,
      "metric_score": 0.0,
      "weight_pct": 15.0,
      "points_contributed": 0.0,
      "drag_points": 15.0,
      "status": "CRITICAL",
      "executive_status": "HEALTHY",
      "directionality": "LOWER_IS_BETTER",
      "formula_breadcrumb": "(COUNT(returned_orders) / COUNT(total_orders)) * 100",
      "is_available": true,
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_average_order_value",
      "name": "Average Order Value (AOV)",
      "category": "Commercial",
      "current_value": 931009.35,
      "previous_value": null,
      "target_value": null,
      "variance_pct": null,
      "metric_score": 85.0,
      "weight_pct": 15.0,
      "points_contributed": 12.8,
      "drag_points": 2.2,
      "status": "HEALTHY",
      "executive_status": "HEALTHY",
      "directionality": "HIGHER_IS_BETTER",
      "formula_breadcrumb": "SUM(revenue) / TOTAL_ROWS",
      "is_available": true,
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_discount_depth",
      "name": "Average Discount Depth",
      "category": "Commercial",
      "current_value": 11.07,
      "previous_value": null,
      "target_value": 8.0,
      "variance_pct": 38.375,
      "metric_score": 69.7,
      "weight_pct": 10.0,
      "points_contributed": 7.0,
      "drag_points": 3.0,
      "status": "WARNING",
      "executive_status": "HEALTHY",
      "directionality": "LOWER_IS_BETTER",
      "formula_breadcrumb": "AVG(Discount_Percentage) * 100",
      "is_available": true,
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_csat",
      "name": "Customer Satisfaction (CSAT)",
      "category": "Customer",
      "current_value": 0.0,
      "previous_value": null,
      "target_value": null,
      "variance_pct": null,
      "metric_score": 0.0,
      "weight_pct": 15.0,
      "points_contributed": 0.0,
      "drag_points": 0.0,
      "status": "CRITICAL",
      "executive_status": "HEALTHY",
      "directionality": "HIGHER_IS_BETTER",
      "formula_breadcrumb": "Required column fields missing from dataset",
      "is_available": false,
      "missing_fields": [
        "csat_score"
      ]
    }
  ],
  "available_categories": [
    "OPERATIONS",
    "COMMERCIAL",
    "FINANCIAL"
  ],
  "available_kpi_catalog": [
    {
      "kpi_id": "kpi_total_revenue",
      "name": "Total Gross Revenue",
      "category": "Financial",
      "is_available": true,
      "description": "Sum of all transaction revenue across channels",
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_gross_margin",
      "name": "Gross Profit Margin",
      "category": "Financial",
      "is_available": true,
      "description": "Gross Profit divided by Total Revenue expressed as a percentage",
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_units_sold",
      "name": "Total Units Sold",
      "category": "Commercial",
      "is_available": true,
      "description": "Total count of all physical and digital units sold",
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_return_rate",
      "name": "Return Rate",
      "category": "Operations",
      "is_available": true,
      "description": "Returned orders divided by total orders expressed as a percentage",
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_average_order_value",
      "name": "Average Order Value (AOV)",
      "category": "Commercial",
      "is_available": true,
      "description": "Total revenue divided by distinct transaction orders",
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_discount_depth",
      "name": "Average Discount Depth",
      "category": "Commercial",
      "is_available": true,
      "description": "Average percentage promotional discount applied across transactions",
      "missing_fields": []
    },
    {
      "kpi_id": "kpi_csat",
      "name": "Customer Satisfaction (CSAT)",
      "category": "Customer",
      "is_available": false,
      "description": "Average customer satisfaction score from feedback surveys",
      "missing_fields": [
        "csat_score"
      ]
    }
  ],
  "inferred_questions": [
    "Why is revenue growing while margin is shrinking?",
    "Why did gross profit margin collapse in South East in November?",
    "Which products are driving returns in South East?",
    "What is the average discount depth by channel?"
  ],
  "executive_intelligence": {
    "health_score": {
      "overall_score": 59.5,
      "status": "WARNING",
      "executive_status": "AT_RISK",
      "calculation_state": "CALCULATED",
      "confidence_level": "HIGH",
      "confidence_reason": "High confidence: Computed deterministically across 30,443 verified transactions with zero synthetic interpolation.",
      "largest_positive_contributor": {
        "name": "Total Gross Revenue",
        "kpi_id": "kpi_total_revenue",
        "points": 20.4,
        "current_value": 28342717537.760002
      },
      "largest_negative_contributor": {
        "name": "Gross Profit Margin",
        "kpi_id": "kpi_gross_margin",
        "drag": 18.3,
        "current_value": 18.73
      },
      "previous_score": null,
      "active_kpi_count": 6,
      "contributions": [
        {
          "kpi_id": "kpi_total_revenue",
          "name": "Total Gross Revenue",
          "category": "Financial",
          "current_value": 28342717537.760002,
          "previous_value": null,
          "target_value": null,
          "variance_pct": null,
          "metric_score": 85.0,
          "weight_pct": 24.0,
          "points_contributed": 20.4,
          "drag_points": 3.6,
          "status": "HEALTHY",
          "executive_status": "HEALTHY",
          "directionality": "HIGHER_IS_BETTER",
          "formula_breadcrumb": "SUM(revenue)",
          "is_available": true,
          "missing_fields": []
        },
        {
          "kpi_id": "kpi_gross_margin",
          "name": "Gross Profit Margin",
          "category": "Financial",
          "current_value": 18.73,
          "previous_value": null,
          "target_value": 25.0,
          "variance_pct": -25.08,
          "metric_score": 34.8,
          "weight_pct": 28.0,
          "points_contributed": 9.7,
          "drag_points": 18.3,
          "status": "CRITICAL",
          "executive_status": "CRITICAL_ATTENTION_REQUIRED",
          "directionality": "HIGHER_IS_BETTER",
          "formula_breadcrumb": "((SUM(revenue) - SUM(cogs)) / SUM(revenue)) * 100",
          "is_available": true,
          "missing_fields": []
        },
        {
          "kpi_id": "kpi_units_sold",
          "name": "Total Units Sold",
          "category": "Commercial",
          "current_value": 61125.0,
          "previous_value": null,
          "target_value": null,
          "variance_pct": null,
          "metric_score": 85.0,
          "weight_pct": 16.0,
          "points_contributed": 13.6,
          "drag_points": 2.4,
          "status": "HEALTHY",
          "executive_status": "HEALTHY",
          "directionality": "HIGHER_IS_BETTER",
          "formula_breadcrumb": "SUM(quantity)",
          "is_available": true,
          "missing_fields": []
        },
        {
          "kpi_id": "kpi_return_rate",
          "name": "Return Rate",
          "category": "Operations",
          "current_value": 28.1,
          "previous_value": null,
          "target_value": 8.0,
          "variance_pct": 251.25000000000003,
          "metric_score": 0.0,
          "weight_pct": 12.0,
          "points_contributed": 0.0,
          "drag_points": 12.0,
          "status": "CRITICAL",
          "executive_status": "CRITICAL_ATTENTION_REQUIRED",
          "directionality": "LOWER_IS_BETTER",
          "formula_breadcrumb": "(COUNT(returned_orders) / COUNT(total_orders)) * 100",
          "is_available": true,
          "missing_fields": []
        },
        {
          "kpi_id": "kpi_average_order_value",
          "name": "Average Order Value (AOV)",
          "category": "Commercial",
          "current_value": 931009.35,
          "previous_value": null,
          "target_value": null,
          "variance_pct": null,
          "metric_score": 85.0,
          "weight_pct": 12.0,
          "points_contributed": 10.2,
          "drag_points": 1.8,
          "status": "HEALTHY",
          "executive_status": "HEALTHY",
          "directionality": "HIGHER_IS_BETTER",
          "formula_breadcrumb": "SUM(revenue) / TOTAL_ROWS",
          "is_available": true,
          "missing_fields": []
        },
        {
          "kpi_id": "kpi_discount_depth",
          "name": "Average Discount Depth",
          "category": "Commercial",
          "current_value": 11.07,
          "previous_value": null,
          "target_value": 8.0,
          "variance_pct": 38.375,
          "metric_score": 69.7,
          "weight_pct": 8.0,
          "points_contributed": 5.6,
          "drag_points": 2.4,
          "status": "WARNING",
          "executive_status": "AT_RISK",
          "directionality": "LOWER_IS_BETTER",
          "formula_breadcrumb": "AVG(Discount_Percentage) * 100",
          "is_available": true,
          "missing_fields": []
        },
        {
          "kpi_id": "kpi_csat",
          "name": "Customer Satisfaction (CSAT)",
          "category": "Customer",
          "current_value": 0.0,
          "previous_value": null,
          "target_value": null,
          "variance_pct": null,
          "metric_score": 0.0,
          "weight_pct": 15.0,
          "points_contributed": 0.0,
          "drag_points": 0.0,
          "status": "CRITICAL",
          "executive_status": "UNAVAILABLE",
          "directionality": "HIGHER_IS_BETTER",
          "formula_breadcrumb": "Required column fields missing from dataset",
          "is_available": false,
          "missing_fields": [
            "csat_score"
          ]
        }
      ],
      "readiness_notes": null,
      "calculated_at": "2026-10-09 01:15:52.910777"
    },
    "business_storyline": {
      "overall_status": "Operational performance is facing divergence \u2014 key channel costs and return volumes are eroding core profitability.",
      "biggest_win": "Total Gross Revenue reached \u20a628.34B, driving primary commercial cashflow.",
      "biggest_risk": "Return rate concentration in FCT \u00b7 Commercial Core is the primary operational drag (Estimated impact: -\u20a61,417,135,876.89).",
      "next_actions": [
        "Investigate return drivers and category mix in FCT",
        "Audit promotional discounting and COGS in FCT"
      ],
      "reading_time_seconds": 30,
      "executive_narrative": "Enterprise health is evaluated at 59.5/100 [AT_RISK]. Gross commercial revenue stands at \u20a628.34B with gross margin realization tracking at 18.7% and aggregate return volume pacing at 28.1%. Primary operational focus remains on mitigating margin erosion and discounting depth in FCT \u00b7 Commercial Core.",
      "channel_highlights": [
        {
          "label": "Gross Revenue",
          "value": "\u20a628.34B",
          "detail": "Top-line commercial cashflow"
        },
        {
          "label": "Gross Unit Margin",
          "value": "18.7%",
          "detail": "Bottom-line profitability realization"
        },
        {
          "label": "Return Volume Rate",
          "value": "28.1%",
          "detail": "Reverse logistics friction exposure"
        }
      ],
      "generated_at": "2026-10-09 01:15:52.918615"
    },
    "top_3_issues": [
      {
        "issue_id": "issue_kpi_return_rate_e06c",
        "title": "Return Rate Variance Alert",
        "kpi_id": "kpi_return_rate",
        "severity": "WARNING",
        "component_scores": {
          "financial_impact": 0.5,
          "target_deviation": 1.0,
          "rate_of_change": 0.65,
          "business_criticality": 0.375
        },
        "component_availability": {
          "financial_impact": true,
          "target_deviation": true,
          "rate_of_change": true,
          "business_criticality": true
        },
        "normalized_priority_score": 0.643,
        "ranking_reason": "Ranked due to Return Rate performance (0.0/100) causing a -15.0pt drag on enterprise health score.",
        "financial_impact_label": "Estimated impact: -\u20a61,417,135,876.89",
        "current_value": 28.1,
        "baseline_target": 8.0,
        "variance_pct": 251.25000000000003,
        "primary_driver": "FCT \u00b7 Commercial Core",
        "detected_at": "2026-10-09 01:15:52.915812"
      },
      {
        "issue_id": "issue_kpi_gross_margin_1695",
        "title": "Gross Profit Margin Variance Alert",
        "kpi_id": "kpi_gross_margin",
        "severity": "WARNING",
        "component_scores": {
          "financial_impact": 0.326,
          "target_deviation": 0.836,
          "rate_of_change": 0.65,
          "business_criticality": 0.875
        },
        "component_availability": {
          "financial_impact": true,
          "target_deviation": true,
          "rate_of_change": true,
          "business_criticality": true
        },
        "normalized_priority_score": 0.573,
        "ranking_reason": "Ranked due to Gross Profit Margin performance (34.8/100) causing a -22.8pt drag on enterprise health score.",
        "financial_impact_label": "Estimated impact: -\u20a6923,972,591.73",
        "current_value": 18.73,
        "baseline_target": 25.0,
        "variance_pct": -25.08,
        "primary_driver": "FCT \u00b7 Commercial Core",
        "detected_at": "2026-10-09 01:15:52.913588"
      },
      {
        "issue_id": "issue_kpi_discount_depth_d287",
        "title": "Average Discount Depth Variance Alert",
        "kpi_id": "kpi_discount_depth",
        "severity": "WARNING",
        "component_scores": {
          "financial_impact": 0.152,
          "target_deviation": 1.0,
          "rate_of_change": 0.65,
          "business_criticality": 0.25
        },
        "component_availability": {
          "financial_impact": true,
          "target_deviation": true,
          "rate_of_change": true,
          "business_criticality": true
        },
        "normalized_priority_score": 0.473,
        "ranking_reason": "Ranked due to Average Discount Depth performance (69.7/100) causing a -3.0pt drag on enterprise health score.",
        "financial_impact_label": "Estimated impact: -\u20a6429,392,170.70",
        "current_value": 11.07,
        "baseline_target": 8.0,
        "variance_pct": 38.375,
        "primary_driver": "FCT \u00b7 Commercial Core",
        "detected_at": "2026-10-09 01:15:52.918027"
      }
    ],
    "view_more_issues": [],
    "business_drivers": [
      {
        "kpi_id": "kpi_total_revenue",
        "name": "Total Gross Revenue",
        "category": "Financial",
        "current_value": 28342717537.760002,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 85.0,
        "weight_pct": 30.0,
        "points_contributed": 25.5,
        "drag_points": 4.5,
        "status": "HEALTHY",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "SUM(revenue)",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_gross_margin",
        "name": "Gross Profit Margin",
        "category": "Financial",
        "current_value": 18.73,
        "previous_value": null,
        "target_value": 25.0,
        "variance_pct": -25.08,
        "metric_score": 34.8,
        "weight_pct": 35.0,
        "points_contributed": 12.2,
        "drag_points": 22.8,
        "status": "CRITICAL",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "((SUM(revenue) - SUM(cogs)) / SUM(revenue)) * 100",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_units_sold",
        "name": "Total Units Sold",
        "category": "Commercial",
        "current_value": 61125.0,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 85.0,
        "weight_pct": 20.0,
        "points_contributed": 17.0,
        "drag_points": 3.0,
        "status": "HEALTHY",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "SUM(quantity)",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_return_rate",
        "name": "Return Rate",
        "category": "Operations",
        "current_value": 28.1,
        "previous_value": null,
        "target_value": 8.0,
        "variance_pct": 251.25000000000003,
        "metric_score": 0.0,
        "weight_pct": 15.0,
        "points_contributed": 0.0,
        "drag_points": 15.0,
        "status": "CRITICAL",
        "executive_status": "HEALTHY",
        "directionality": "LOWER_IS_BETTER",
        "formula_breadcrumb": "(COUNT(returned_orders) / COUNT(total_orders)) * 100",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_average_order_value",
        "name": "Average Order Value (AOV)",
        "category": "Commercial",
        "current_value": 931009.35,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 85.0,
        "weight_pct": 15.0,
        "points_contributed": 12.8,
        "drag_points": 2.2,
        "status": "HEALTHY",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "SUM(revenue) / TOTAL_ROWS",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_discount_depth",
        "name": "Average Discount Depth",
        "category": "Commercial",
        "current_value": 11.07,
        "previous_value": null,
        "target_value": 8.0,
        "variance_pct": 38.375,
        "metric_score": 69.7,
        "weight_pct": 10.0,
        "points_contributed": 7.0,
        "drag_points": 3.0,
        "status": "WARNING",
        "executive_status": "HEALTHY",
        "directionality": "LOWER_IS_BETTER",
        "formula_breadcrumb": "AVG(Discount_Percentage) * 100",
        "is_available": true,
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_csat",
        "name": "Customer Satisfaction (CSAT)",
        "category": "Customer",
        "current_value": 0.0,
        "previous_value": null,
        "target_value": null,
        "variance_pct": null,
        "metric_score": 0.0,
        "weight_pct": 15.0,
        "points_contributed": 0.0,
        "drag_points": 0.0,
        "status": "CRITICAL",
        "executive_status": "HEALTHY",
        "directionality": "HIGHER_IS_BETTER",
        "formula_breadcrumb": "Required column fields missing from dataset",
        "is_available": false,
        "missing_fields": [
          "csat_score"
        ]
      }
    ],
    "available_categories": [
      "OPERATIONS",
      "COMMERCIAL",
      "FINANCIAL"
    ],
    "available_kpi_catalog": [
      {
        "kpi_id": "kpi_total_revenue",
        "name": "Total Gross Revenue",
        "category": "Financial",
        "is_available": true,
        "description": "Sum of all transaction revenue across channels",
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_gross_margin",
        "name": "Gross Profit Margin",
        "category": "Financial",
        "is_available": true,
        "description": "Gross Profit divided by Total Revenue expressed as a percentage",
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_units_sold",
        "name": "Total Units Sold",
        "category": "Commercial",
        "is_available": true,
        "description": "Total count of all physical and digital units sold",
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_return_rate",
        "name": "Return Rate",
        "category": "Operations",
        "is_available": true,
        "description": "Returned orders divided by total orders expressed as a percentage",
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_average_order_value",
        "name": "Average Order Value (AOV)",
        "category": "Commercial",
        "is_available": true,
        "description": "Total revenue divided by distinct transaction orders",
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_discount_depth",
        "name": "Average Discount Depth",
        "category": "Commercial",
        "is_available": true,
        "description": "Average percentage promotional discount applied across transactions",
        "missing_fields": []
      },
      {
        "kpi_id": "kpi_csat",
        "name": "Customer Satisfaction (CSAT)",
        "category": "Customer",
        "is_available": false,
        "description": "Average customer satisfaction score from feedback surveys",
        "missing_fields": [
          "csat_score"
        ]
      }
    ],
    "inferred_questions": [
      "Why is revenue growing while margin is shrinking?",
      "Why did gross profit margin collapse in South East in November?",
      "Which products are driving returns in South East?",
      "What is the average discount depth by channel?"
    ],
    "created_at": "2026-10-09 01:15:52.953928"
  }
};
