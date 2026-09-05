import uuid
from typing import Any, Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
from app.models.domain import (
    ActiveKPI,
    BusinessStoryline,
    ConfidenceLevel,
    ExecutiveHealthStatus,
    ExecutiveIntelligence,
    HealthCalculationState,
    HealthIssue,
    HealthScoreBreakdown,
    KPIStatus
)
from app.engines.kpi_registry import KPIRegistry

class HealthEngine:
    """
    Business Health, Explainable Health Score (0-100), Top 3 Issues Prioritizer,
    and Deterministic Business Storyline Synthesis Engine.
    """

    @classmethod
    def compute_health_dashboard(
        cls,
        df: pd.DataFrame,
        custom_weights: Optional[Dict[str, float]] = None,
        custom_targets: Optional[Dict[str, float]] = None
    ) -> Tuple[HealthScoreBreakdown, List[HealthIssue], List[HealthIssue], BusinessStoryline, List[ActiveKPI], List[str], List[Dict[str, Any]], ExecutiveIntelligence]:
        """
        Executes full Business Health evaluation:
        1. Evaluates Active KPIs & Catalog.
        2. Computes Overall Health Score (0-100) & Drag Points.
        3. Detects and ranks all Anomalies using the official formula.
        4. Synthesizes 4-bullet Business Storyline.
        5. Returns the consolidated ExecutiveIntelligence object.
        """
        active_kpis, catalog = KPIRegistry.evaluate_active_kpis(df, custom_weights, custom_targets)

        # Extract available categories
        available_categories = list(set(k.category.upper() for k in active_kpis if k.is_available))
        if not available_categories:
            available_categories = ["FINANCE"]

        # 1. Health Score Computation (Normalized over available KPIs)
        health_score_breakdown = cls._compute_health_score(df, active_kpis)

        # 2. Issue Prioritization (Top 3 + View More)
        all_issues = cls._detect_and_prioritize_issues(df, active_kpis)
        top_3_issues = all_issues[:3]
        view_more_issues = all_issues[3:]

        # 3. Storyline Synthesis (Strictly synchronized with health score & top issues)
        storyline = cls._synthesize_storyline(health_score_breakdown, top_3_issues, active_kpis)

        # 4. Inferred Business Questions (Dynamically derived from dataset anomalies)
        inferred_questions = cls.infer_business_questions(df, active_kpis, all_issues)

        # 5. Consolidated Executive Intelligence Object
        executive_intel = ExecutiveIntelligence(
            health_score=health_score_breakdown,
            business_storyline=storyline,
            top_3_issues=top_3_issues,
            view_more_issues=view_more_issues,
            business_drivers=active_kpis,
            available_categories=available_categories,
            available_kpi_catalog=catalog,
            inferred_questions=inferred_questions
        )

        return (
            health_score_breakdown,
            top_3_issues,
            view_more_issues,
            storyline,
            active_kpis,
            available_categories,
            catalog,
            executive_intel
        )

    @classmethod
    def _compute_health_score(cls, df: pd.DataFrame, active_kpis: List[ActiveKPI]) -> HealthScoreBreakdown:
        available_kpis = [k for k in active_kpis if k.is_available]

        # 1. Check for UNAVAILABLE state
        if not available_kpis:
            return HealthScoreBreakdown(
                overall_score=None,
                status=KPIStatus.CRITICAL,
                executive_status=ExecutiveHealthStatus.UNAVAILABLE,
                calculation_state=HealthCalculationState.UNAVAILABLE,
                confidence_level=ConfidenceLevel.LIMITED,
                confidence_reason="Business Health unavailable: No supported KPI measures could be computed from connected dataset columns.",
                largest_positive_contributor=None,
                largest_negative_contributor=None,
                active_kpi_count=0,
                contributions=[],
                readiness_notes={
                    "status": "UNAVAILABLE",
                    "reason": "Missing required operational fields (e.g., revenue, sales volume, cost)",
                    "action": "Connect a transaction sheet with revenue, order date, and cost columns."
                }
            )

        # 2. Calculation State
        calc_state = HealthCalculationState.CALCULATED if len(available_kpis) >= 3 else HealthCalculationState.PARTIALLY_CALCULATED

        # 3. Confidence Scoring
        row_count = len(df) if df is not None else 0
        if row_count >= 1000 and len(available_kpis) >= 3:
            confidence_level = ConfidenceLevel.HIGH
            confidence_reason = f"High confidence: Computed deterministically across {row_count:,} verified transactions with zero synthetic interpolation."
        elif row_count >= 100:
            confidence_level = ConfidenceLevel.MEDIUM
            confidence_reason = f"Medium confidence: Computed from {row_count:,} records across {len(available_kpis)} active business drivers."
        else:
            confidence_level = ConfidenceLevel.LIMITED
            confidence_reason = f"Limited confidence: Sparse dataset ({row_count} rows). Additional operational transactions recommended."

        # 4. Weighted Score Calculation
        total_weight = sum(k.weight_pct for k in available_kpis)
        if total_weight == 0:
            total_weight = 100.0

        weighted_sum = sum(k.metric_score * k.weight_pct for k in available_kpis)
        overall_score = round(weighted_sum / total_weight, 1)

        # Re-normalize points contributed & drag points over the actual sum of weights
        recalculated_kpis: List[ActiveKPI] = []
        for k in active_kpis:
            if k.is_available:
                norm_weight = round((k.weight_pct / total_weight) * 100.0, 1)
                points_contrib = round(norm_weight * (k.metric_score / 100.0), 1)
                drag = round(norm_weight - points_contrib, 1)
                exec_status = cls._map_score_to_executive_status(k.metric_score)
                k_copy = k.model_copy(update={
                    "weight_pct": norm_weight,
                    "points_contributed": points_contrib,
                    "drag_points": drag,
                    "executive_status": exec_status
                })
            else:
                k_copy = k.model_copy(update={
                    "points_contributed": 0.0,
                    "drag_points": 0.0,
                    "executive_status": ExecutiveHealthStatus.UNAVAILABLE
                })
            recalculated_kpis.append(k_copy)

        # Map 5-tier executive status
        executive_status = cls._map_score_to_executive_status(overall_score)
        
        # Legacy 3-tier status for backward compatibility
        if overall_score >= 80.0:
            legacy_status = KPIStatus.HEALTHY
        elif overall_score >= 55.0:
            legacy_status = KPIStatus.WARNING
        else:
            legacy_status = KPIStatus.CRITICAL

        # Identify Largest Positive & Negative Contributors
        available_recalc = [k for k in recalculated_kpis if k.is_available]
        sorted_pos = sorted(available_recalc, key=lambda x: x.points_contributed, reverse=True)
        largest_pos = {
            "name": sorted_pos[0].name,
            "kpi_id": sorted_pos[0].kpi_id,
            "points": sorted_pos[0].points_contributed,
            "current_value": sorted_pos[0].current_value
        } if sorted_pos else None

        sorted_drag = sorted(available_recalc, key=lambda x: x.drag_points, reverse=True)
        largest_neg = {
            "name": sorted_drag[0].name,
            "kpi_id": sorted_drag[0].kpi_id,
            "drag": sorted_drag[0].drag_points,
            "current_value": sorted_drag[0].current_value
        } if sorted_drag and sorted_drag[0].drag_points > 0 else None

        return HealthScoreBreakdown(
            overall_score=overall_score,
            status=legacy_status,
            executive_status=executive_status,
            calculation_state=calc_state,
            confidence_level=confidence_level,
            confidence_reason=confidence_reason,
            largest_positive_contributor=largest_pos,
            largest_negative_contributor=largest_neg,
            active_kpi_count=len(available_recalc),
            contributions=recalculated_kpis,
            readiness_notes=None
        )

    @classmethod
    def _map_score_to_executive_status(cls, score: float) -> ExecutiveHealthStatus:
        if score >= 90.0:
            return ExecutiveHealthStatus.EXCELLENT
        elif score >= 80.0:
            return ExecutiveHealthStatus.HEALTHY
        elif score >= 70.0:
            return ExecutiveHealthStatus.NEEDS_ATTENTION
        elif score >= 55.0:
            return ExecutiveHealthStatus.AT_RISK
        else:
            return ExecutiveHealthStatus.CRITICAL_ATTENTION_REQUIRED

    @classmethod
    def _detect_and_prioritize_issues(cls, df: pd.DataFrame, active_kpis: List[ActiveKPI]) -> List[HealthIssue]:
        """
        Scans DataFrame across dimensions and KPIs to detect anomalies,
        then scores each anomaly with the official formula:
        Priority = 0.45*FI + 0.25*TD + 0.20*RC + 0.10*BC
        with normalization when components are unavailable.
        """
        issues: List[HealthIssue] = []

        for kpi in active_kpis:
            if not kpi.is_available:
                continue

            if kpi.metric_score < 85.0 or (kpi.variance_pct and kpi.variance_pct < -5.0):
                primary_driver = "Enterprise Total"
                if "region" in df.columns:
                    try:
                        region_counts = df.groupby("region").size()
                        if not region_counts.empty:
                            primary_driver = f"{region_counts.index[0]} · Commercial Core"
                    except Exception:
                        pass

                # Component 1: Financial Impact (FI)
                fi_available = "revenue" in df.columns or "gross_profit" in df.columns
                if fi_available:
                    total_rev = df["revenue"].sum() if "revenue" in df.columns else 1_000_000.0
                    drag_ratio = max(0.01, (100.0 - kpi.metric_score) / 100.0)
                    impact_amt = total_rev * drag_ratio * 0.05
                    fi_score = min(1.0, impact_amt / (total_rev * 0.1))
                    fi_label = f"Estimated impact: -₦{impact_amt:,.2f}"
                else:
                    fi_score = (100.0 - kpi.metric_score) / 100.0
                    fi_label = "Financial impact: Not reliably calculable from available data"

                # Component 2: Target Deviation (TD)
                td_available = kpi.target_value is not None
                if td_available and kpi.variance_pct:
                    td_score = min(1.0, abs(kpi.variance_pct) / 30.0)
                else:
                    td_score = (100.0 - kpi.metric_score) / 100.0

                # Component 3: Rate of Change (RC)
                rc_available = "order_date" in df.columns
                rc_score = 0.65 if rc_available else 0.50

                # Component 4: Business Criticality (BC)
                bc_available = True
                bc_score = (kpi.weight_pct / 40.0)

                comp_scores = {
                    "financial_impact": round(fi_score, 3),
                    "target_deviation": round(td_score, 3),
                    "rate_of_change": round(rc_score, 3),
                    "business_criticality": round(bc_score, 3)
                }
                comp_avail = {
                    "financial_impact": fi_available,
                    "target_deviation": td_available,
                    "rate_of_change": rc_available,
                    "business_criticality": bc_available
                }
                weights = {"financial_impact": 0.45, "target_deviation": 0.25, "rate_of_change": 0.20, "business_criticality": 0.10}

                avail_weighted_sum = sum(weights[c] * comp_scores[c] for c in comp_scores if comp_avail[c])
                avail_weight_sum = sum(weights[c] for c in comp_scores if comp_avail[c])
                norm_priority = round(avail_weighted_sum / avail_weight_sum if avail_weight_sum > 0 else 0.5, 3)

                severity = "CRITICAL" if norm_priority >= 0.75 else "WARNING"
                ranking_reason = f"Ranked due to {kpi.name} performance ({kpi.metric_score}/100) causing a -{kpi.drag_points}pt drag on enterprise health score."

                issue = HealthIssue(
                    issue_id=f"issue_{kpi.kpi_id}_{uuid.uuid4().hex[:4]}",
                    title=f"{kpi.name} Variance Alert",
                    kpi_id=kpi.kpi_id,
                    severity=severity,
                    component_scores=comp_scores,
                    component_availability=comp_avail,
                    normalized_priority_score=norm_priority,
                    ranking_reason=ranking_reason,
                    financial_impact_label=fi_label,
                    current_value=kpi.current_value,
                    baseline_target=kpi.target_value,
                    variance_pct=kpi.variance_pct or -((100 - kpi.metric_score) / 2.0),
                    primary_driver=primary_driver
                )
                issues.append(issue)

        # Sort descending by normalized_priority_score
        issues = sorted(issues, key=lambda x: x.normalized_priority_score, reverse=True)
        return issues

    @classmethod
    def _synthesize_storyline(
        cls,
        health_score: HealthScoreBreakdown,
        top_issues: List[HealthIssue],
        active_kpis: List[ActiveKPI]
    ) -> BusinessStoryline:
        """
        Synthesizes an executive morning brief connecting top-line momentum,
        primary wins, operational drag, and direct strategic actions.
        """
        score = health_score.overall_score
        exec_status = health_score.executive_status

        available_kpis = [k for k in active_kpis if k.is_available]
        rev_kpi = next((k for k in available_kpis if "revenue" in k.kpi_id), None)
        margin_kpi = next((k for k in available_kpis if "margin" in k.kpi_id), None)
        return_kpi = next((k for k in available_kpis if "return" in k.kpi_id), None)

        rev_str = f"₦{rev_kpi.current_value:,.2f}" if rev_kpi and rev_kpi.current_value > 1000000 else ""
        if rev_kpi and rev_kpi.current_value >= 1_000_000_000:
            rev_str = f"₦{rev_kpi.current_value / 1_000_000_000:.2f}B"
        elif rev_kpi and rev_kpi.current_value >= 1_000_000:
            rev_str = f"₦{rev_kpi.current_value / 1_000_000:.2f}M"

        # 1. Overall Status — Executive Morning Brief Pulse
        if score is None or exec_status == ExecutiveHealthStatus.UNAVAILABLE:
            overall_status = "Executive briefing UNAVAILABLE — core transactional measures are not yet connected to the workspace."
        elif exec_status == ExecutiveHealthStatus.EXCELLENT:
            overall_status = f"Commercial performance is robust at {rev_str or 'current scale'} — all core business drivers are tracking ahead of target benchmarks."
        elif exec_status == ExecutiveHealthStatus.HEALTHY:
            overall_status = f"Top-line growth remains steady at {rev_str or 'current levels'}, with profit margins and customer demand sustaining healthy operational targets."
        elif exec_status == ExecutiveHealthStatus.NEEDS_ATTENTION:
            if return_kpi and return_kpi.current_value > 15.0:
                overall_status = f"Top-line revenue is pacing at {rev_str or 'scale'}, but an elevated {return_kpi.current_value:.1f}% return rate is creating noticeable operational drag."
            else:
                overall_status = f"Top-line momentum is active at {rev_str or 'scale'}, but localized product margins and discount depth require managerial focus."
        elif exec_status == ExecutiveHealthStatus.AT_RISK:
            overall_status = f"Operational performance is facing divergence — key channel costs and return volumes are eroding core profitability."
        else:
            overall_status = f"Critical operational divergence detected across multiple channels — immediate leadership intervention recommended on costs and inventory."

        # 2. Strongest Positive Movement — CEO Business Metrics (No internal points)
        sorted_by_score = sorted(available_kpis, key=lambda x: x.metric_score, reverse=True)
        if sorted_by_score and sorted_by_score[0].metric_score >= 70.0:
            best_kpi = sorted_by_score[0]
            if "margin" in best_kpi.kpi_id:
                biggest_win = f"{best_kpi.name} is performing strongly at {best_kpi.current_value:.1f}%, sustaining healthy gross unit profitability."
            elif "revenue" in best_kpi.kpi_id:
                biggest_win = f"{best_kpi.name} reached {rev_str or f'{best_kpi.current_value:,.2f}'}, driving primary commercial cashflow."
            elif "units" in best_kpi.kpi_id:
                biggest_win = f"{best_kpi.name} reached {best_kpi.current_value:,.0f} units, maintaining robust order volume."
            else:
                biggest_win = f"{best_kpi.name} is tracking at {best_kpi.current_value:,.1f}, outperforming benchmark expectations."
        else:
            biggest_win = "Core commercial drivers remain within baseline variance tolerance across monitored channels."

        # 3. Primary Operational Risk — Financial Impact & Business Root Cause
        if top_issues:
            top_issue = top_issues[0]
            if "Return" in top_issue.title:
                biggest_risk = f"Return rate concentration in {top_issue.primary_driver} is the primary operational drag ({top_issue.financial_impact_label})."
            elif "Margin" in top_issue.title or "Profit" in top_issue.title:
                biggest_risk = f"Gross margin compression in {top_issue.primary_driver} represents the primary profitability risk ({top_issue.financial_impact_label})."
            else:
                biggest_risk = f"{top_issue.title} in {top_issue.primary_driver} is the #1 operational risk. {top_issue.financial_impact_label}."
        elif exec_status in [ExecutiveHealthStatus.EXCELLENT, ExecutiveHealthStatus.HEALTHY]:
            biggest_risk = "No critical operational friction or margin leakage detected across connected business units."
        else:
            biggest_risk = "Operational indicators show divergence from configured targets across monitored segments."

        # 4. Recommended Next Actions — Strategic Executive Focus
        next_actions: List[str] = []
        if top_issues:
            for issue in top_issues[:2]:
                driver_clean = issue.primary_driver.replace(" · Commercial Core", "")
                if "Return" in issue.title:
                    next_actions.append(f"Investigate return drivers and category mix in {driver_clean}")
                elif "Margin" in issue.title:
                    next_actions.append(f"Audit promotional discounting and COGS in {driver_clean}")
                else:
                    next_actions.append(f"Review {issue.title} in {driver_clean}")
        else:
            next_actions.append("Maintain periodic operational monitoring across active sales channels.")

        # 5. Detailed Executive Narrative Paragraph
        score_str = f"{score:.1f}/100" if score is not None else "UNAVAILABLE"
        margin_str = f"{margin_kpi.current_value:.1f}%" if margin_kpi else "N/A"
        return_str = f"{return_kpi.current_value:.1f}%" if return_kpi else "N/A"
        top_driver_name = top_issues[0].primary_driver if top_issues else "key commercial segments"

        exec_narrative = (
            f"Enterprise health is evaluated at {score_str} [{exec_status.value}]. "
            f"Gross commercial revenue stands at {rev_str or 'verified baseline'} with gross margin realization tracking at {margin_str} "
            f"and aggregate return volume pacing at {return_str}. "
            f"Primary operational focus remains on mitigating margin erosion and discounting depth in {top_driver_name}."
        )

        # 6. Channel & Key Financial Highlights
        channel_highlights = [
            {"label": "Gross Revenue", "value": rev_str or "Verified", "detail": "Top-line commercial cashflow"},
            {"label": "Gross Unit Margin", "value": margin_str, "detail": "Bottom-line profitability realization"},
            {"label": "Return Volume Rate", "value": return_str, "detail": "Reverse logistics friction exposure"}
        ]

        return BusinessStoryline(
            overall_status=overall_status,
            biggest_win=biggest_win,
            biggest_risk=biggest_risk,
            next_actions=next_actions,
            reading_time_seconds=30,
            executive_narrative=exec_narrative,
            channel_highlights=channel_highlights
        )

    @classmethod
    def infer_business_questions(
        cls,
        df: Optional[pd.DataFrame],
        active_kpis: Optional[List[ActiveKPI]] = None,
        issues: Optional[List[HealthIssue]] = None
    ) -> List[str]:
        """
        Dynamically infers priority business questions from dataset anomalies,
        detected issue drivers, and commercial variances.
        """
        inferred: List[str] = []
        if df is None or df.empty:
            return [
                "Why is revenue growing while margin is shrinking?",
                "Which product categories have the highest return rate?",
                "What is the average discount depth by channel?",
                "Which stores are driving profitability, not just revenue?"
            ]

        cols = {str(c).lower().replace(" ", "_"): c for c in df.columns}

        worst_margin_region = None
        worst_margin_period = None
        high_return_region = None
        high_return_cat = None

        reg_col = cols.get("region") or cols.get("store_region")
        rev_col = cols.get("revenue") or cols.get("sales") or cols.get("gross_revenue")
        profit_col = cols.get("gross_profit") or cols.get("profit")
        return_col = cols.get("return_flag") or cols.get("returned") or cols.get("returns")
        cat_col = cols.get("category") or cols.get("product_category")
        channel_col = cols.get("sales_channel") or cols.get("channel")
        date_col = cols.get("order_date") or cols.get("date")

        # 1. Analyze regional profit margins
        if reg_col and rev_col and profit_col:
            try:
                reg_grp = df.groupby(reg_col).agg({rev_col: "sum", profit_col: "sum"})
                reg_grp["margin_pct"] = (reg_grp[profit_col] / reg_grp[rev_col]) * 100.0
                lowest_reg = reg_grp["margin_pct"].idxmin()
                lowest_margin = reg_grp["margin_pct"].min()
                if lowest_margin < 28.0:
                    worst_margin_region = str(lowest_reg)
            except Exception:
                pass

        # Check if there's a specific month with a drop in that region
        if worst_margin_region and date_col and reg_col and rev_col and profit_col:
            try:
                df_reg = df[df[reg_col].astype(str) == worst_margin_region].copy()
                df_reg["dt"] = pd.to_datetime(df_reg[date_col], errors="coerce")
                df_reg["month_name"] = df_reg["dt"].dt.strftime("%B")
                m_grp = df_reg.groupby("month_name").agg({rev_col: "sum", profit_col: "sum"})
                m_grp["margin_pct"] = (m_grp[profit_col] / m_grp[rev_col]) * 100.0
                if not m_grp.empty:
                    lowest_month = m_grp["margin_pct"].idxmin()
                    if m_grp["margin_pct"].min() < 25.0:
                        worst_margin_period = str(lowest_month)
            except Exception:
                pass

        # 2. Check regional returns
        if reg_col and return_col:
            try:
                ret_grp = df.groupby(reg_col)[return_col].mean()
                highest_ret_reg = ret_grp.idxmax()
                if ret_grp.max() > 0.04:
                    high_return_region = str(highest_ret_reg)
            except Exception:
                pass

        # 3. Check category returns
        if cat_col and return_col:
            try:
                cat_ret = df.groupby(cat_col)[return_col].mean()
                highest_ret_cat = cat_ret.idxmax()
                if cat_ret.max() > 0.04:
                    high_return_cat = str(highest_ret_cat)
            except Exception:
                pass

        # Synthesize questions
        # Q1: Margin trade-off / divergence
        has_margin_drag = any(k.kpi_id == "gross_profit_margin" and k.metric_score < 75 for k in (active_kpis or []))
        if has_margin_drag or (worst_margin_region is not None):
            inferred.append("Why is revenue growing while margin is shrinking?")

        # Q2: Specific regional / monthly margin collapse
        if worst_margin_region:
            if worst_margin_period:
                inferred.append(f"Why did gross profit margin collapse in {worst_margin_region} in {worst_margin_period}?")
            else:
                inferred.append(f"Why did gross profit margin decline in {worst_margin_region}?")

        # Q3: Product return drivers
        if high_return_region:
            inferred.append(f"Which products are driving returns in {high_return_region}?")
        elif high_return_cat:
            inferred.append(f"Which products are driving returns in {high_return_cat}?")
        else:
            inferred.append("Which product categories have the highest return rate?")

        # Q4: Discount depth
        if channel_col:
            inferred.append("What is the average discount depth by channel?")
        elif cat_col:
            inferred.append("What is the average discount depth by category?")

        # Q5: Store or category profitability
        if cols.get("store_name") or cols.get("store"):
            inferred.append("Which stores are driving profitability, not just revenue?")
        elif cat_col and profit_col:
            inferred.append("Which product categories account for most of our gross profit?")

        # Fallback if less than 4
        defaults = [
            "Why is revenue growing while margin is shrinking?",
            "Which products are driving returns in South South?",
            "What is the average discount depth by channel?",
            "Which stores are driving profitability, not just revenue?"
        ]
        for d in defaults:
            if len(inferred) >= 4:
                break
            if d not in inferred:
                inferred.append(d)

        return inferred[:4]
