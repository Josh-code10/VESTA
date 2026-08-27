import re
from typing import Any, Callable, Dict, List, Optional, Tuple
import numpy as np
import pandas as pd
from app.models.domain import ActiveKPI, KPIDirectionality, KPIStatus

class SupportedKPIDefinition:
    def __init__(
        self,
        kpi_id: str,
        name: str,
        category: str,
        required_field_aliases: Dict[str, List[str]],
        directionality: KPIDirectionality,
        default_weight_pct: float,
        default_target: Optional[float],
        formula_description: str,
        calc_fn: Callable[[pd.DataFrame, Dict[str, str]], Tuple[float, Optional[float], str]]
    ):
        self.kpi_id = kpi_id
        self.name = name
        self.category = category
        self.required_field_aliases = required_field_aliases
        self.directionality = directionality
        self.default_weight_pct = default_weight_pct
        self.default_target = default_target
        self.formula_description = formula_description
        self.calc_fn = calc_fn

    def resolve_fields(self, df_columns: List[str]) -> Tuple[bool, Dict[str, str], List[str]]:
        """
        Resolves required fields against df_columns using fuzzy regex aliases.
        Returns: (is_supported, matched_field_map, missing_field_names)
        """
        matched_map: Dict[str, str] = {}
        missing_fields: List[str] = []
        normalized_cols = {str(c).strip().lower().replace(" ", "_").replace("-", "_"): c for c in df_columns}

        for req_field, aliases in self.required_field_aliases.items():
            matched_col = None
            for alias in aliases:
                for norm_name, original_col in normalized_cols.items():
                    if re.search(alias, norm_name, re.IGNORECASE):
                        matched_col = original_col
                        break
                if matched_col:
                    break

            if matched_col:
                matched_map[req_field] = matched_col
            else:
                missing_fields.append(req_field)

        is_supported = len(missing_fields) == 0
        return is_supported, matched_map, missing_fields


def _clean_numeric(series: pd.Series) -> pd.Series:
    """Converts strings with currency symbols, commas, or percentages to float."""
    if pd.api.types.is_numeric_dtype(series):
        return pd.to_numeric(series, errors='coerce').fillna(0.0)
    
    cleaned = (
        series.astype(str)
        .str.replace(r"[\$,₦,€,£,¥,%]", "", regex=True)
        .str.replace(",", "", regex=False)
        .str.strip()
    )
    return pd.to_numeric(cleaned, errors='coerce').fillna(0.0)


def _calc_total_revenue(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    rev_col = fields["revenue"]
    rev_series = _clean_numeric(df[rev_col])
    current = float(rev_series.sum())
    formula = f"SUM({rev_col})"
    return current, None, formula


def _calc_gross_profit(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    rev_col = fields["revenue"]
    rev_series = _clean_numeric(df[rev_col])
    if "profit" in fields:
        prof_col = fields["profit"]
        prof_series = _clean_numeric(df[prof_col])
        current = float(prof_series.sum())
        formula = f"SUM({prof_col})"
    else:
        cogs_col = fields["cogs"]
        cogs_series = _clean_numeric(df[cogs_col])
        current = float((rev_series - cogs_series).sum())
        formula = f"SUM({rev_col}) - SUM({cogs_col})"
    return current, None, formula


def _calc_gross_margin_pct(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    rev_col = fields["revenue"]
    rev_series = _clean_numeric(df[rev_col])
    total_rev = float(rev_series.sum())
    if total_rev == 0:
        return 0.0, None, "Total revenue is 0"

    if "profit" in fields:
        prof_col = fields["profit"]
        prof_series = _clean_numeric(df[prof_col])
        total_prof = float(prof_series.sum())
        margin = (total_prof / total_rev) * 100.0
        formula = f"(SUM({prof_col}) / SUM({rev_col})) * 100"
    else:
        cogs_col = fields["cogs"]
        cogs_series = _clean_numeric(df[cogs_col])
        total_cogs = float(cogs_series.sum())
        margin = ((total_rev - total_cogs) / total_rev) * 100.0
        formula = f"((SUM({rev_col}) - SUM({cogs_col})) / SUM({rev_col})) * 100"
    return round(margin, 2), None, formula


def _calc_units_sold(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    qty_col = fields["quantity"]
    qty_series = _clean_numeric(df[qty_col])
    current = float(qty_series.sum())
    formula = f"SUM({qty_col})"
    return current, None, formula


def _calc_return_rate_pct(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    ret_col = fields["return_flag"]
    total_records = len(df)
    if total_records == 0:
        return 0.0, None, "No transaction records"

    series = df[ret_col]
    if series.dtype == bool:
        returns_count = int(series.sum())
    elif pd.api.types.is_numeric_dtype(series):
        returns_count = int((series > 0).sum())
    else:
        returns_count = int(series.astype(str).str.strip().str.lower().isin(["yes", "true", "1", "returned", "refunded"]).sum())

    return_rate = (returns_count / total_records) * 100.0
    formula = f"(COUNT(returned_orders) / COUNT(total_orders)) * 100"
    return round(return_rate, 2), None, formula


def _calc_average_order_value(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    rev_col = fields["revenue"]
    rev_series = _clean_numeric(df[rev_col])
    total_rev = float(rev_series.sum())
    if "order_id" in fields:
        order_col = fields["order_id"]
        order_count = max(1, int(df[order_col].nunique()))
        formula = f"SUM({rev_col}) / DISTINCT_COUNT({order_col})"
    else:
        order_count = max(1, len(df))
        formula = f"SUM({rev_col}) / TOTAL_ROWS"
    aov = total_rev / order_count
    return round(aov, 2), None, formula


def _calc_discount_depth_pct(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    disc_col = fields["discount"]
    disc_series = _clean_numeric(df[disc_col])
    avg_disc = float(disc_series.mean())
    if avg_disc <= 1.0: # represented as fraction e.g. 0.15
        avg_disc *= 100.0
    formula = f"AVG({disc_col}) * 100"
    return round(avg_disc, 2), None, formula


def _calc_csat_score(df: pd.DataFrame, fields: Dict[str, str]) -> Tuple[float, Optional[float], str]:
    csat_col = fields["csat_score"]
    csat_series = _clean_numeric(df[csat_col])
    avg_csat = float(csat_series.mean())
    formula = f"AVG({csat_col})"
    return round(avg_csat, 2), None, formula


class KPIRegistry:
    """
    Deterministic Registry of Supported Enterprise KPIs.
    Ensures that only legitimately calculable KPIs are activated.
    """

    REGISTRY: List[SupportedKPIDefinition] = [
        SupportedKPIDefinition(
            kpi_id="kpi_total_revenue",
            name="Total Gross Revenue",
            category="Financial",
            required_field_aliases={
                "revenue": [
                    r"^revenue", r"^sales", r"sales_amount", r"total_sales", r"^amount",
                    r"^total$", r"^gross_revenue", r"^gross_sales", r"^subtotal",
                    r"line_total", r"item_price", r"^turnover"
                ]
            },
            directionality=KPIDirectionality.HIGHER_IS_BETTER,
            default_weight_pct=30.0,
            default_target=None,
            formula_description="Sum of all transaction revenue across channels",
            calc_fn=_calc_total_revenue
        ),
        SupportedKPIDefinition(
            kpi_id="kpi_gross_margin",
            name="Gross Profit Margin",
            category="Financial",
            required_field_aliases={
                "revenue": [
                    r"^revenue", r"^sales", r"sales_amount", r"total_sales", r"^amount",
                    r"^total$", r"^gross_revenue", r"^gross_sales", r"^subtotal",
                    r"line_total", r"item_price", r"^turnover"
                ],
                "cogs": [
                    r"^cogs", r"^cost", r"cost_amount", r"unit_cost", r"product_cost",
                    r"^profit", r"^gross_profit", r"^margin", r"expense"
                ]
            },
            directionality=KPIDirectionality.HIGHER_IS_BETTER,
            default_weight_pct=35.0,
            default_target=25.0, # Enterprise 25% gross margin benchmark
            formula_description="Gross Profit divided by Total Revenue expressed as a percentage",
            calc_fn=_calc_gross_margin_pct
        ),
        SupportedKPIDefinition(
            kpi_id="kpi_units_sold",
            name="Total Units Sold",
            category="Commercial",
            required_field_aliases={
                "quantity": [
                    r"^quantity", r"^qty", r"^units", r"items_sold", r"^volume",
                    r"^items$", r"^count$", r"order_quantity", r"num_items"
                ]
            },
            directionality=KPIDirectionality.HIGHER_IS_BETTER,
            default_weight_pct=20.0,
            default_target=None,
            formula_description="Total count of all physical and digital units sold",
            calc_fn=_calc_units_sold
        ),
        SupportedKPIDefinition(
            kpi_id="kpi_return_rate",
            name="Return Rate",
            category="Operations",
            required_field_aliases={
                "return_flag": [
                    r"^return", r"^returned", r"return_flag", r"is_return",
                    r"refund", r"refund_flag", r"^is_refunded"
                ]
            },
            directionality=KPIDirectionality.LOWER_IS_BETTER,
            default_weight_pct=15.0,
            default_target=8.0, # Retail 8% return rate benchmark
            formula_description="Returned orders divided by total orders expressed as a percentage",
            calc_fn=_calc_return_rate_pct
        ),
        SupportedKPIDefinition(
            kpi_id="kpi_average_order_value",
            name="Average Order Value (AOV)",
            category="Commercial",
            required_field_aliases={
                "revenue": [
                    r"^revenue", r"^sales", r"sales_amount", r"total_sales", r"^amount",
                    r"^total$", r"^gross_revenue", r"^gross_sales", r"^subtotal",
                    r"line_total", r"item_price", r"^turnover"
                ]
            },
            directionality=KPIDirectionality.HIGHER_IS_BETTER,
            default_weight_pct=15.0,
            default_target=None,
            formula_description="Total revenue divided by distinct transaction orders",
            calc_fn=_calc_average_order_value
        ),
        SupportedKPIDefinition(
            kpi_id="kpi_discount_depth",
            name="Average Discount Depth",
            category="Commercial",
            required_field_aliases={
                "discount": [
                    r"^discount", r"discount_rate", r"discount_pct",
                    r"promo_discount", r"markdown", r"coupon_discount"
                ]
            },
            directionality=KPIDirectionality.LOWER_IS_BETTER,
            default_weight_pct=10.0,
            default_target=8.0, # 8% maximum promotional discount benchmark
            formula_description="Average percentage promotional discount applied across transactions",
            calc_fn=_calc_discount_depth_pct
        ),
        SupportedKPIDefinition(
            kpi_id="kpi_csat",
            name="Customer Satisfaction (CSAT)",
            category="Customer",
            required_field_aliases={
                "csat_score": [
                    r"^csat", r"^nps", r"satisfaction", r"^rating", r"^score"
                ]
            },
            directionality=KPIDirectionality.HIGHER_IS_BETTER,
            default_weight_pct=15.0,
            default_target=85.0, # 85% CSAT target
            formula_description="Average customer satisfaction score from feedback surveys",
            calc_fn=_calc_csat_score
        )
    ]

    @classmethod
    def evaluate_active_kpis(
        cls,
        df: pd.DataFrame,
        custom_weights: Optional[Dict[str, float]] = None,
        custom_targets: Optional[Dict[str, float]] = None
    ) -> Tuple[List[ActiveKPI], List[Dict[str, Any]]]:
        """
        Inspects the DataFrame, resolves supported KPIs, calculates values,
        and constructs ActiveKPI instances with catalog availability metadata.
        """
        active_kpis: List[ActiveKPI] = []
        catalog_items: List[Dict[str, Any]] = []
        df_cols = df.columns.tolist()

        for kpi_def in cls.REGISTRY:
            is_supported, matched_fields, missing_fields = kpi_def.resolve_fields(df_cols)

            if is_supported:
                try:
                    curr_val, prev_val, formula = kpi_def.calc_fn(df, matched_fields)
                    weight = (custom_weights or {}).get(kpi_def.kpi_id, kpi_def.default_weight_pct)
                    target = (custom_targets or {}).get(kpi_def.kpi_id, kpi_def.default_target)

                    # Determine variance and score
                    variance_pct, metric_score, status = cls._score_kpi(
                        curr_val, prev_val, target, kpi_def.directionality
                    )

                    points_contributed = weight * (metric_score / 100.0)
                    drag_points = weight * ((100.0 - metric_score) / 100.0)

                    active_kpi = ActiveKPI(
                        kpi_id=kpi_def.kpi_id,
                        name=kpi_def.name,
                        category=kpi_def.category,
                        current_value=curr_val,
                        previous_value=prev_val,
                        target_value=target,
                        variance_pct=variance_pct,
                        metric_score=round(metric_score, 1),
                        weight_pct=weight,
                        points_contributed=round(points_contributed, 1),
                        drag_points=round(drag_points, 1),
                        status=status,
                        directionality=kpi_def.directionality,
                        formula_breadcrumb=formula,
                        is_available=True,
                        missing_fields=[]
                    )
                    active_kpis.append(active_kpi)

                    catalog_items.append({
                        "kpi_id": kpi_def.kpi_id,
                        "name": kpi_def.name,
                        "category": kpi_def.category,
                        "is_available": True,
                        "description": kpi_def.formula_description,
                        "missing_fields": []
                    })
                except Exception as e:
                    active_kpi = ActiveKPI(
                        kpi_id=kpi_def.kpi_id,
                        name=kpi_def.name,
                        category=kpi_def.category,
                        current_value=0.0,
                        metric_score=0.0,
                        weight_pct=kpi_def.default_weight_pct,
                        points_contributed=0.0,
                        drag_points=0.0,
                        status=KPIStatus.CRITICAL,
                        directionality=kpi_def.directionality,
                        formula_breadcrumb=f"Error evaluating: {str(e)}",
                        is_available=False,
                        missing_fields=list(kpi_def.required_field_aliases.keys())
                    )
                    active_kpis.append(active_kpi)
                    catalog_items.append({
                        "kpi_id": kpi_def.kpi_id,
                        "name": kpi_def.name,
                        "category": kpi_def.category,
                        "is_available": False,
                        "description": kpi_def.formula_description,
                        "missing_fields": list(kpi_def.required_field_aliases.keys())
                    })
            else:
                active_kpi = ActiveKPI(
                    kpi_id=kpi_def.kpi_id,
                    name=kpi_def.name,
                    category=kpi_def.category,
                    current_value=0.0,
                    metric_score=0.0,
                    weight_pct=kpi_def.default_weight_pct,
                    points_contributed=0.0,
                    drag_points=0.0,
                    status=KPIStatus.CRITICAL,
                    directionality=kpi_def.directionality,
                    formula_breadcrumb="Required column fields missing from dataset",
                    is_available=False,
                    missing_fields=missing_fields
                )
                active_kpis.append(active_kpi)

                catalog_items.append({
                    "kpi_id": kpi_def.kpi_id,
                    "name": kpi_def.name,
                    "category": kpi_def.category,
                    "is_available": False,
                    "description": kpi_def.formula_description,
                    "missing_fields": missing_fields
                })

        return active_kpis, catalog_items

    @classmethod
    def _score_kpi(
        cls,
        curr_val: float,
        prev_val: Optional[float],
        target: Optional[float],
        directionality: KPIDirectionality
    ) -> Tuple[Optional[float], float, KPIStatus]:
        """
        Determines 0-100 metric score and status.
        If target is provided, variance = (curr - target) / target.
        """
        if target is not None and target != 0:
            variance_pct = ((curr_val - target) / target) * 100.0

            if directionality == KPIDirectionality.HIGHER_IS_BETTER:
                if variance_pct >= 0:
                    metric_score = min(100.0, 85.0 + (variance_pct * 1.5))
                else:
                    metric_score = max(0.0, 85.0 + (variance_pct * 2.0))
            elif directionality == KPIDirectionality.LOWER_IS_BETTER:
                if variance_pct <= 0: # lower than target (better)
                    metric_score = min(100.0, 85.0 + (abs(variance_pct) * 1.5))
                else:
                    metric_score = max(0.0, 85.0 - (variance_pct * 0.4))
            else: # TARGET_RANGE
                dev = abs(variance_pct)
                metric_score = max(0.0, 100.0 - (dev * 3.0))

        else:
            variance_pct = None
            metric_score = 85.0

        if metric_score >= 80.0:
            status = KPIStatus.HEALTHY
        elif metric_score >= 55.0:
            status = KPIStatus.WARNING
        else:
            status = KPIStatus.CRITICAL

        return variance_pct, round(metric_score, 1), status
