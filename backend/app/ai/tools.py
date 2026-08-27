from typing import Any, Dict, List

# OpenAPI-compatible tool declarations for Gemini Function Calling

TOOLS_DEFINITION = [
    {
        "name": "group_and_aggregate",
        "description": "Groups tabular data along specified categorical dimensions and calculates numerical metric aggregates (sum, mean, count). Always use this tool for breakdowns by region, category, store, channel, or time.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "dimensions": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"},
                    "description": "List of categorical columns to group by (e.g. ['region', 'category'])."
                },
                "metrics": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"},
                    "description": "List of numerical columns to aggregate (e.g. ['revenue', 'cogs', 'quantity'])."
                },
                "filters": {
                    "type": "OBJECT",
                    "description": "Optional dictionary of column-value filters (e.g. {'region': 'Lagos'})."
                }
            },
            "required": ["dimensions", "metrics"]
        }
    },
    {
        "name": "rank_dimension",
        "description": "Ranks dimension entities by an aggregated metric (e.g. top 10 products by revenue, top 5 stores by return count).",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "dimension": {
                    "type": "STRING",
                    "description": "The categorical column to rank (e.g. 'product_name', 'store_name')."
                },
                "metric": {
                    "type": "STRING",
                    "description": "The numerical metric to rank by (e.g. 'revenue', 'quantity')."
                },
                "ascending": {
                    "type": "BOOLEAN",
                    "description": "True for lowest-first (bottom performers), False for highest-first (top performers). Default is False."
                },
                "limit": {
                    "type": "INTEGER",
                    "description": "Number of ranked items to return (e.g. 5, 10). Default is 10."
                },
                "filters": {
                    "type": "OBJECT",
                    "description": "Optional dictionary of filters to apply before ranking."
                }
            },
            "required": ["dimension", "metric"]
        }
    },
    {
        "name": "period_variance",
        "description": "Calculates percentage and absolute variance of a metric between two time periods (e.g. comparing July 2025 vs June 2025).",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "date_col": {
                    "type": "STRING",
                    "description": "The timestamp/date column in the dataset (e.g. 'order_date')."
                },
                "metric_col": {
                    "type": "STRING",
                    "description": "The numerical metric column to compare (e.g. 'revenue', 'gross_profit')."
                },
                "current_period": {
                    "type": "STRING",
                    "description": "The current period string (e.g. '2025-07')."
                },
                "previous_period": {
                    "type": "STRING",
                    "description": "The baseline comparison period string (e.g. '2025-06')."
                },
                "dimension_breakdown": {
                    "type": "STRING",
                    "description": "Optional categorical dimension to calculate period variances for each slice (e.g. 'region')."
                },
                "filters": {
                    "type": "OBJECT",
                    "description": "Optional filters to apply before computing variance."
                }
            },
            "required": ["date_col", "metric_col", "current_period", "previous_period"]
        }
    },
    {
        "name": "contribution_analysis",
        "description": "Calculates the percentage contribution share of each entity in a dimension to the total aggregate metric.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "metric": {
                    "type": "STRING",
                    "description": "The numerical measure (e.g. 'revenue', 'returns')."
                },
                "dimension": {
                    "type": "STRING",
                    "description": "The categorical dimension to analyze contribution for (e.g. 'category', 'channel')."
                },
                "filters": {
                    "type": "OBJECT",
                    "description": "Optional filters to apply."
                }
            },
            "required": ["metric", "dimension"]
        }
    },
    {
        "name": "check_data_sufficiency",
        "description": "Verifies whether specific columns or operational concepts exist in the connected dataset before attempting calculation.",
        "parameters": {
            "type": "OBJECT",
            "properties": {
                "required_fields": {
                    "type": "ARRAY",
                    "items": {"type": "STRING"},
                    "description": "List of column names or concepts to check (e.g. ['csat_score', 'nps_rating'])."
                }
            },
            "required": ["required_fields"]
        }
    }
]
