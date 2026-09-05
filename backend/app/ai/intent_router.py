from enum import Enum
from typing import Dict, List, Optional, Tuple, Any
import pandas as pd
from app.ai.knowledge_library import BusinessKnowledgeLibrary, KnowledgeConcept

class InvestigatorIntent(str, Enum):
    EXPLAIN = "EXPLAIN"          # Pure Business Knowledge Brain (definition, formula, retail example)
    CLARIFY = "CLARIFY"          # Dashboard Clarification Mode (explains Health score, status colors, methodology)
    INVESTIGATE = "INVESTIGATE"  # Business Investigation Brain (runs deterministic analytics on live dataset)
    HYBRID = "HYBRID"            # Dual Intelligence Mode (Combines EXPLAIN concept + INVESTIGATE live data)

class IntentResult(BaseModel := type('BaseModel', (), {})):
    intent: InvestigatorIntent
    concept: Optional[KnowledgeConcept] = None
    is_live_data_required: bool = False
    is_dashboard_clarify: bool = False
    is_hybrid: bool = False

class IntentRouter:
    """
    Deterministic intent classification layer evaluated BEFORE tool execution.
    Determines whether a user query requires Business Knowledge, Dashboard Clarification,
    Live Business Analytics, or a Hybrid Dual-Intelligence response.
    """

    @classmethod
    def classify_intent(cls, user_question: str, df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        q_lower = user_question.lower().strip()

        # 1. Check for Dashboard Clarification keywords (CLARIFY intent)
        dashboard_keywords = [
            "business health", "health score", "health status", "why is health", "how is health",
            "why is return rate red", "why is margin yellow", "why is revenue green",
            "explain this score", "explain the score", "explain the health score", "what does the score mean",
            "dashboard methodology", "why is profit yellow", "why is margin red",
            "how are we doing", "how is my business", "how is the business", "overall business health",
            "why are we at risk"
        ]
        if any(kw in q_lower for kw in dashboard_keywords):
            return {
                "intent": InvestigatorIntent.CLARIFY,
                "concept": BusinessKnowledgeLibrary.get_concept(q_lower),
                "is_live_data_required": False,
                "is_dashboard_clarify": True,
                "is_hybrid": False
            }

        # 2. Match against Business Knowledge Library
        concept = BusinessKnowledgeLibrary.get_concept(q_lower)

        # Check for Live Data references (dimensions, regions, stores, specific filter values)
        has_location_or_dimension = False
        if df is not None:
            for col in df.columns:
                if not pd.api.types.is_numeric_dtype(df[col]) and not pd.api.types.is_datetime64_any_dtype(df[col]):
                    for val in df[col].dropna().unique()[:50]:
                        val_str = str(val).strip().lower()
                        if len(val_str) >= 3 and val_str in q_lower:
                            has_location_or_dimension = True
                            break

        live_data_keywords = [
            "which", "compare", "lagos", "abuja", "kano", "ibadan", "port harcourt", "south", "north",
            "top", "worst", "best", "lowest", "highest", "store", "product", "channel", "category", "in july", "in june",
            "why did", "why is", "why has", "what caused", "decline", "drop", "fall", "increase",
            "growth", "collapse", "variance", "second half", "first half", "h1", "h2", "q1", "q2", "q3", "q4",
            "despite", "versus", "compared", "year", "month", "quarter",
            "losing money", "leaking cash", "bleeding", "markdown", "markdowns", "sending back", "sent back",
            "area", "territory", "outlet", "branch", "where", "who", "eating into", "sacrificing"
        ]
        has_live_data_intent = has_location_or_dimension or any(kw in q_lower for kw in live_data_keywords)

        # 3. Check for EXPLAIN vs HYBRID vs INVESTIGATE
        explain_prefixes = [
            "what is", "what's", "what does", "define", "explain", "how is", "how to calculate",
            "what is the formula", "formula for", "meaning of", "definition of", "tell me about", "understand"
        ]
        is_explain_syntax = any(q_lower.startswith(p) or p in q_lower for p in explain_prefixes) and not any(
            emp in q_lower for emp in ["why did", "why is", "why has", "decline", "drop", "fall", "collapse", "second half", "despite", "compare", "in july", "in june"]
        )

        # If question starts with "compare", force pure INVESTIGATE intent
        if q_lower.startswith("compare"):
            return {
                "intent": InvestigatorIntent.INVESTIGATE,
                "concept": None,
                "is_live_data_required": True,
                "is_dashboard_clarify": False,
                "is_hybrid": False
            }

        # A. Direct concept query without empirical data filters -> PURE EXPLAIN INTENT
        if concept and not has_live_data_intent:
            return {
                "intent": InvestigatorIntent.EXPLAIN,
                "concept": concept,
                "is_live_data_required": False,
                "is_dashboard_clarify": False,
                "is_hybrid": False
            }

        # B. Explicit concept request + live dataset reference -> HYBRID INTENT
        if concept and is_explain_syntax and has_live_data_intent:
            return {
                "intent": InvestigatorIntent.HYBRID,
                "concept": concept,
                "is_live_data_required": True,
                "is_dashboard_clarify": False,
                "is_hybrid": True
            }

        # C. Concept request without live data -> EXPLAIN INTENT
        if is_explain_syntax and not has_live_data_intent:
            return {
                "intent": InvestigatorIntent.EXPLAIN,
                "concept": concept,
                "is_live_data_required": False,
                "is_dashboard_clarify": False,
                "is_hybrid": False
            }

        # D. Empirical Investigation Intent: Pure live data analytics query (no theoretical concept box)
        return {
            "intent": InvestigatorIntent.INVESTIGATE,
            "concept": None,
            "is_live_data_required": True,
            "is_dashboard_clarify": False,
            "is_hybrid": False
        }
