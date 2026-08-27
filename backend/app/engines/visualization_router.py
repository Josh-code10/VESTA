from enum import Enum
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class AnalysisType(str, Enum):
    TREND = "TREND"
    COMPARISON = "COMPARISON"
    CONTRIBUTION = "CONTRIBUTION"
    PARETO = "PARETO"
    VARIANCE = "VARIANCE"
    ROOT_CAUSE = "ROOT_CAUSE"
    CORRELATION = "CORRELATION"
    DISTRIBUTION = "DISTRIBUTION"
    SEGMENTATION = "SEGMENTATION"
    OPERATIONAL_BOTTLENECK = "OPERATIONAL_BOTTLENECK"
    ROI_ANALYSIS = "ROI_ANALYSIS"
    TARGET_VARIANCE = "TARGET_VARIANCE"
    EXECUTIVE_COMPARISON = "EXECUTIVE_COMPARISON"

class SmartAnnotation(BaseModel):
    annotation_type: str  # 'peak', 'trough', 'largest_decline', 'top_contributor', 'pareto_80_20', 'outlier'
    label: str
    target_value: Optional[float] = None
    target_key: Optional[str] = None

class VisualizationSpec(BaseModel):
    analysis_type: AnalysisType
    primary_chart: str       # 'horizontal_bar', 'line', 'area', 'waterfall', 'scatter', 'heatmap', 'treemap', 'donut', 'stacked_bar', 'histogram', 'box_plot'
    secondary_chart: Optional[str] = None
    annotations: List[SmartAnnotation] = []
    pivot_required: bool = False
    pivot_dimensions: List[str] = []
    rationale: str = "Deterministic Visualization Router selection based on question intent."

class VisualizationRouter:
    """
    Deterministic Analytical Intelligence Engine.
    Classifies business questions into specific analysis types and maps them to exact chart specifications.
    The LLM NEVER selects chart types — the Visualization Router does.
    """

    @classmethod
    def route(
        cls,
        question: str,
        analytical_intent: str,
        dimensions: List[str],
        metrics: List[str],
        data_records: List[Dict[str, Any]]
    ) -> VisualizationSpec:
        q_lower = question.lower()
        
        # 1. Classify Analysis Type
        analysis_type = cls._classify_analysis_type(q_lower, analytical_intent, dimensions, metrics)
        
        # 2. Select Visualization & Pivot Spec
        primary_chart = cls._get_primary_chart(analysis_type, dimensions, metrics, data_records)
        secondary_chart = cls._get_secondary_chart(analysis_type)
        pivot_required = True  # Always enable contextual pivot matrix for deep CEO investigation
        
        # 3. Generate Smart Annotations
        annotations = cls._generate_smart_annotations(data_records, dimensions, metrics, analysis_type)

        # 4. Generate Visualization Router Rationale Explanation
        rationale = cls._generate_rationale(analysis_type, primary_chart, secondary_chart)

        return VisualizationSpec(
            analysis_type=analysis_type,
            primary_chart=primary_chart,
            secondary_chart=secondary_chart,
            annotations=annotations,
            pivot_required=pivot_required,
            pivot_dimensions=dimensions[:2] if len(dimensions) >= 2 else dimensions,
            rationale=rationale
        )

    @classmethod
    def _classify_analysis_type(cls, q: str, intent: str, dimensions: List[str], metrics: List[str]) -> AnalysisType:
        if any(w in q for w in ["most of our", "account for most", "pareto", "80/20", "80-20", "top drivers of loss", "loss concentration"]):
            return AnalysisType.PARETO
        elif any(w in q for w in ["roi", "campaign", "marketing", "wasted budget"]):
            return AnalysisType.ROI_ANALYSIS
        elif any(w in q for w in ["sales targets", "target", "without sacrificing", "performance matrix", "employees"]):
            return AnalysisType.TARGET_VARIANCE
        elif any(w in q for w in ["inventory", "inventory problems", "across stores and categories", "bottleneck", "fulfillment", "sla"]):
            return AnalysisType.OPERATIONAL_BOTTLENECK
        elif any(w in q for w in ["delivery partner", "customer experience", "distribution", "delivery"]):
            return AnalysisType.DISTRIBUTION
        elif any(w in q for w in ["discount", "discounts", "helping us grow", "hurting profitability", "correlation", "relationship", "vs", "versus"]):
            return AnalysisType.CORRELATION
        elif any(w in q for w in ["compare lagos and abuja", "compare lagos", "executive comparison"]):
            return AnalysisType.EXECUTIVE_COMPARISON
        elif any(w in q for w in ["why", "root cause", "decline in the second half", "despite revenue growth", "driver", "reason", "behind"]):
            return AnalysisType.ROOT_CAUSE
        elif any(w in q for w in ["customer segments", "most valuable", "segment", "cluster"]):
            return AnalysisType.SEGMENTATION
        elif any(w in q for w in ["trend", "over time", "monthly", "daily", "growth", "history"]):
            return AnalysisType.TREND
        elif any(w in q for w in ["variance", "gap", "deviation", "budget", "miss"]):
            return AnalysisType.VARIANCE
        elif any(w in q for w in ["share", "contribution", "breakdown", "portion", "percentage"]):
            return AnalysisType.CONTRIBUTION
        else:
            return AnalysisType.COMPARISON

    @classmethod
    def _get_primary_chart(cls, analysis_type: AnalysisType, dimensions: List[str], metrics: List[str], data: List[Dict[str, Any]]) -> str:
        if analysis_type == AnalysisType.PARETO:
            return "bar"
        elif analysis_type == AnalysisType.TREND:
            return "line"
        elif analysis_type == AnalysisType.COMPARISON:
            return "horizontal_bar"
        elif analysis_type == AnalysisType.EXECUTIVE_COMPARISON:
            return "horizontal_bar"
        elif analysis_type == AnalysisType.CONTRIBUTION:
            return "donut" if len(data) <= 5 else "treemap"
        elif analysis_type in [AnalysisType.VARIANCE, AnalysisType.ROOT_CAUSE]:
            return "waterfall"
        elif analysis_type in [AnalysisType.CORRELATION, AnalysisType.ROI_ANALYSIS, AnalysisType.TARGET_VARIANCE]:
            return "scatter"
        elif analysis_type == AnalysisType.DISTRIBUTION:
            return "box_plot"
        elif analysis_type == AnalysisType.OPERATIONAL_BOTTLENECK:
            return "heatmap"
        elif analysis_type == AnalysisType.SEGMENTATION:
            return "treemap"
        return "horizontal_bar"

    @classmethod
    def _get_secondary_chart(cls, analysis_type: AnalysisType) -> Optional[str]:
        if analysis_type == AnalysisType.PARETO:
            return "line"  # Cumulative % Pareto curve
        elif analysis_type in [AnalysisType.ROOT_CAUSE, AnalysisType.EXECUTIVE_COMPARISON]:
            return "line"
        elif analysis_type == AnalysisType.COMPARISON:
            return "scatter"  # Bubble Analysis
        elif analysis_type in [AnalysisType.CORRELATION, AnalysisType.TARGET_VARIANCE]:
            return "waterfall"
        elif analysis_type == AnalysisType.ROI_ANALYSIS:
            return "horizontal_bar"  # Ranking
        elif analysis_type == AnalysisType.OPERATIONAL_BOTTLENECK:
            return "treemap"
        elif analysis_type == AnalysisType.DISTRIBUTION:
            return "heatmap"
        elif analysis_type == AnalysisType.SEGMENTATION:
            return "donut"
        elif analysis_type == AnalysisType.TREND:
            return "area"
        return None

    @classmethod
    def _generate_smart_annotations(cls, data: List[Dict[str, Any]], dimensions: List[str], metrics: List[str], analysis_type: AnalysisType = AnalysisType.COMPARISON) -> List[SmartAnnotation]:
        annotations = []
        if not data or not metrics:
            return annotations

        m_key = metrics[0]
        dim_key = dimensions[0] if dimensions else None

        # Sort data descending by metric
        sorted_data = sorted([d for d in data if m_key in d and isinstance(d[m_key], (int, float))], key=lambda x: x[m_key], reverse=True)
        if not sorted_data:
            return annotations

        total_val = sum(d[m_key] for d in sorted_data)
        
        # 1. Pareto 80/20 Rule Annotation
        if analysis_type in [AnalysisType.PARETO, AnalysisType.CONTRIBUTION] and total_val > 0:
            cum_val = 0.0
            cum_items = 0
            for item in sorted_data:
                cum_val += item[m_key]
                cum_items += 1
                if cum_val / total_val >= 0.75:  # ~80% threshold
                    break
            pct_share = (cum_val / total_val) * 100
            annotations.append(SmartAnnotation(
                annotation_type="pareto_80_20",
                label=f"Pareto Rule (80/20): Top {cum_items} items account for {pct_share:.1f}% of total volume",
                target_value=float(pct_share),
                target_key=str(sorted_data[0].get(dim_key, ''))
            ))

        # 2. Top Contributor
        peak = sorted_data[0]
        annotations.append(SmartAnnotation(
            annotation_type="top_contributor",
            label=f"Top Contributor: {peak.get(dim_key, 'Primary')} ({peak[m_key]:,.2f})",
            target_value=float(peak[m_key]),
            target_key=str(peak.get(dim_key, ''))
        ))

        return annotations

    @classmethod
    def _generate_rationale(cls, analysis_type: AnalysisType, primary_chart: str, secondary_chart: Optional[str]) -> str:
        p_name = (primary_chart or "bar").replace("_", " ").title()
        s_name = (secondary_chart or "line").replace("_", " ").title()
        rationales = {
            AnalysisType.PARETO: f"Visualization Router selected a {p_name} chart + {s_name} cumulative curve to isolate the 80/20 loss concentration.",
            AnalysisType.ROOT_CAUSE: f"Visualization Router selected a {p_name} chart to isolate step-by-step sequential driver variance.",
            AnalysisType.COMPARISON: f"Visualization Router selected a {p_name} chart for direct entity scale comparison.",
            AnalysisType.EXECUTIVE_COMPARISON: f"Visualization Router selected a {p_name} chart to display multi-metric comparative balance across regions.",
            AnalysisType.CORRELATION: f"Visualization Router selected a {p_name} plot to evaluate metric trade-offs and relationship strength.",
            AnalysisType.ROI_ANALYSIS: f"Visualization Router selected a {p_name} plot to contrast commercial efficiency against capital expenditure.",
            AnalysisType.OPERATIONAL_BOTTLENECK: f"Visualization Router selected a {p_name} grid to highlight operational friction points across dimensions.",
            AnalysisType.DISTRIBUTION: f"Visualization Router selected a {p_name} plot to evaluate variance spread and outlier density.",
            AnalysisType.SEGMENTATION: f"Visualization Router selected a {p_name} layout to highlight hierarchical volume contribution.",
            AnalysisType.TARGET_VARIANCE: f"Visualization Router selected a {p_name} plot to measure performance against baseline targets.",
            AnalysisType.TREND: f"Visualization Router selected a {p_name} chart to visualize temporal trajectory.",
            AnalysisType.VARIANCE: f"Visualization Router selected a {p_name} chart to highlight budget-to-actual deviations."
        }
        return rationales.get(analysis_type, f"Visualization Router selected a {p_name} chart based on analytical intent.")

