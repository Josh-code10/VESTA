import uuid
from typing import Any, Dict, List, Optional, Tuple, Union
import numpy as np
import pandas as pd
from app.models.domain import EpistemicTag, LineageObject

class AnalyticsEngine:
    """
    The Deterministic Analytical Core of VESTA.
    Sole mathematical source of truth. All calculations, aggregations,
    variances, and anomaly detections are executed deterministically in Pandas.
    """

    @classmethod
    def apply_filters(cls, df: pd.DataFrame, filters: Optional[Dict[str, Any]]) -> pd.DataFrame:
        if not filters:
            return df

        filtered_df = df.copy()
        for col, val in filters.items():
            if col in filtered_df.columns:
                if isinstance(val, list):
                    filtered_df = filtered_df[filtered_df[col].isin(val)]
                elif isinstance(val, tuple) and len(val) == 2:
                    # Range filter e.g. (min_val, max_val)
                    filtered_df = filtered_df[(filtered_df[col] >= val[0]) & (filtered_df[col] <= val[1])]
                else:
                    # Exact match or string case-insensitive match
                    if pd.api.types.is_string_dtype(filtered_df[col]):
                        filtered_df = filtered_df[filtered_df[col].astype(str).str.lower() == str(val).lower()]
                    else:
                        filtered_df = filtered_df[filtered_df[col] == val]
        return filtered_df

    @classmethod
    def group_and_aggregate(
        cls,
        df: pd.DataFrame,
        dimensions: List[str],
        metrics: List[str],
        agg_functions: Optional[Dict[str, str]] = None,
        filters: Optional[Dict[str, Any]] = None,
        sort_metric: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Executes deterministic grouping and aggregation.
        Returns tabular records, formula breadcrumbs, and summary metadata.
        """
        filtered_df = cls.apply_filters(df, filters)
        # Filter valid dimensions and metrics that exist
        valid_dims = [d for d in dimensions if d in filtered_df.columns]
        valid_metrics = [m for m in metrics if m in filtered_df.columns]

        # Default agg_map: use mean for rate/pct/depth columns, sum for volume/financials
        agg_map = {}
        for m in valid_metrics:
            if any(k in m.lower() for k in ["rate", "pct", "depth", "margin", "ratio"]):
                agg_map[m] = "mean"
            else:
                agg_map[m] = "sum"
        if agg_functions:
            agg_map.update(agg_functions)

        if not valid_dims or not valid_metrics:
            return {
                "result_id": f"res_{uuid.uuid4().hex[:8]}",
                "success": False,
                "error": f"Invalid dimensions {dimensions} or metrics {metrics}",
                "records": [],
                "formula": "None"
            }

        grouped = filtered_df.groupby(valid_dims)[valid_metrics].agg(agg_map).reset_index()

        # Format numerical results & convert decimal rates (e.g. 0.05 -> 5.0%)
        for m in valid_metrics:
            if "discount" in m.lower() and grouped[m].max() <= 1.0:
                grouped[m] = (grouped[m] * 100.0).round(2)
            elif pd.api.types.is_float_dtype(grouped[m]):
                grouped[m] = grouped[m].round(2)

        # Calculate derived rate/ratio metrics if underlying columns exist
        ret_col = next((m for m in valid_metrics if m.lower() in ["return_flag", "returned", "is_return", "returns"]), None)
        qty_col = next((m for m in valid_metrics if m.lower() in ["quantity", "qty", "units", "units_sold"]), None)
        if ret_col and qty_col:
            grouped["return_rate"] = np.where(
                grouped[qty_col] > 0,
                ((grouped[ret_col] / grouped[qty_col]) * 100.0).round(2),
                0.0
            )

        prof_col = next((m for m in valid_metrics if m.lower() in ["gross_profit", "profit"]), None)
        rev_col = next((m for m in valid_metrics if m.lower() in ["revenue", "sales", "sales_amount", "gross_revenue"]), None)
        if prof_col and rev_col:
            grouped["gross_margin_pct"] = np.where(
                grouped[rev_col] > 0,
                ((grouped[prof_col] / grouped[rev_col]) * 100.0).round(2),
                0.0
            )

        # Deterministic sorting: sort by specified sort_metric, derived rate metric, or primary metric
        primary_sort = sort_metric
        if not primary_sort or primary_sort not in grouped.columns:
            if "return_rate" in grouped.columns and any("rate" in m.lower() or "pct" in m.lower() for m in metrics):
                primary_sort = "return_rate"
            elif "gross_margin_pct" in grouped.columns and any("margin" in m.lower() or "pct" in m.lower() for m in metrics):
                primary_sort = "gross_margin_pct"
            else:
                primary_sort = valid_metrics[0]

        grouped = grouped.sort_values(by=primary_sort, ascending=False).reset_index(drop=True)

        records = grouped.to_dict(orient="records")
        agg_str_list = [f"{m}:{agg_map.get(m, 'sum')}" for m in valid_metrics]
        formula = f"GROUP_BY({', '.join(valid_dims)}) -> AGG({', '.join(agg_str_list)}) -> SORT_DESC({primary_sort})"

        return {
            "result_id": f"res_{uuid.uuid4().hex[:8]}",
            "success": True,
            "row_count": len(records),
            "dimensions": valid_dims,
            "metrics": valid_metrics,
            "primary_sort_metric": primary_sort,
            "records": records,
            "formula": formula,
            "applied_filters": filters or {}
        }

    @classmethod
    def rank_dimension(
        cls,
        df: pd.DataFrame,
        dimension: str,
        metric: str,
        ascending: bool = False,
        limit: int = 10,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Ranks entities along a dimension by an aggregated metric.
        """
        filtered_df = cls.apply_filters(df, filters)
        if dimension not in filtered_df.columns or metric not in filtered_df.columns:
            return {
                "result_id": f"res_{uuid.uuid4().hex[:8]}",
                "success": False,
                "error": f"Columns '{dimension}' or '{metric}' not found.",
                "records": []
            }

        # Include secondary metrics for context (e.g. quantity for returns, revenue for profit)
        metrics_to_agg = [metric]
        if metric.lower() in ["return_flag", "returned", "is_return"] and "quantity" in filtered_df.columns:
            metrics_to_agg.append("quantity")
        elif metric.lower() in ["gross_profit", "profit"] and "revenue" in filtered_df.columns:
            metrics_to_agg.append("revenue")

        grouped = filtered_df.groupby(dimension)[list(set(metrics_to_agg))].sum().reset_index()

        # Calculate derived rate metrics if possible
        if metric.lower() in ["return_flag", "returned", "is_return"] and "quantity" in grouped.columns:
            grouped["return_rate"] = np.where(
                grouped["quantity"] > 0,
                ((grouped[metric] / grouped["quantity"]) * 100.0).round(2),
                0.0
            )

        sort_col = metric
        if "rate" in metric.lower() or "pct" in metric.lower():
            if "return_rate" in grouped.columns:
                sort_col = "return_rate"

        ranked = (
            grouped
            .sort_values(by=sort_col, ascending=ascending)
            .head(limit)
            .reset_index(drop=True)
        )

        total_sum = filtered_df[metric].sum()
        if total_sum > 0:
            ranked["share_pct"] = (ranked[metric] / total_sum * 100.0).round(2)

        records = ranked.to_dict(orient="records")
        order_str = "ASC" if ascending else "DESC"
        formula = f"RANK({dimension} BY {sort_col} {order_str} LIMIT {limit})"

        return {
            "result_id": f"res_{uuid.uuid4().hex[:8]}",
            "success": True,
            "dimension": dimension,
            "metric": metric,
            "primary_sort_metric": sort_col,
            "records": records,
            "formula": formula
        }

    @classmethod
    def analyze_contribution(
        cls,
        df: pd.DataFrame,
        dimension: str,
        metric: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes Contribution Analysis & Pareto cumulative share calculations.
        Returns sorted records with individual share_pct and cumulative_share_pct.
        """
        filtered_df = cls.apply_filters(df, filters)
        dim_col = dimension if dimension in filtered_df.columns else filtered_df.columns[0]
        metric_col = metric if metric in filtered_df.columns else [c for c in filtered_df.columns if pd.api.types.is_numeric_dtype(filtered_df[c])][0]

        grouped = filtered_df.groupby(dim_col)[metric_col].sum().reset_index()
        grouped = grouped.sort_values(by=metric_col, ascending=False).reset_index(drop=True)

        total_val = grouped[metric_col].sum()
        if total_val > 0:
            grouped["share_pct"] = (grouped[metric_col] / total_val * 100.0).round(2)
            grouped["cumulative_share_pct"] = (grouped[metric_col].cumsum() / total_val * 100.0).round(2)
        else:
            grouped["share_pct"] = 0.0
            grouped["cumulative_share_pct"] = 0.0

        raw_records = grouped.to_dict(orient="records")
        clean_records = []
        for r in raw_records:
            clean_rec = {}
            for k, v in r.items():
                if isinstance(v, (np.integer, int)):
                    clean_rec[k] = int(v)
                elif isinstance(v, (np.floating, float)):
                    clean_rec[k] = float(v)
                else:
                    clean_rec[k] = str(v)
            clean_records.append(clean_rec)

        formula = f"CONTRIBUTION_ANALYSIS({dim_col} BY {metric_col}) -> CUMULATIVE_SHARE()"

        return {
            "result_id": f"res_{uuid.uuid4().hex[:8]}",
            "success": True,
            "dimension": dim_col,
            "metric": metric_col,
            "primary_sort_metric": metric_col,
            "total_metric_value": float(total_val),
            "records": clean_records,
            "formula": formula
        }

    @classmethod
    def multi_driver_comparison(
        cls,
        df: pd.DataFrame,
        dimension: str,
        entities: List[str],
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes multi-driver comparison across every major business metric:
        Gross Revenue, Gross Profit, Gross Margin %, Return Rate %, Average Discount Depth %.
        """
        filtered_df = cls.apply_filters(df, filters)
        dim_col = dimension if dimension in filtered_df.columns else "region"
        if dim_col in filtered_df.columns and entities:
            filtered_df = filtered_df[filtered_df[dim_col].isin(entities)]

        records = []
        target_entities = entities if entities else (filtered_df[dim_col].dropna().unique() if dim_col in filtered_df.columns else [])
        for entity in target_entities:
            sub = filtered_df[filtered_df[dim_col] == entity]
            if sub.empty:
                continue
            
            rev = float(sub["revenue"].sum()) if "revenue" in sub.columns else 0.0
            profit = float(sub["gross_profit"].sum()) if "gross_profit" in sub.columns else 0.0
            margin = round((profit / rev * 100.0), 2) if rev > 0 else 0.0
            
            qty = float(sub["quantity"].sum()) if "quantity" in sub.columns else len(sub)
            returns = float(sub["return_flag"].sum()) if "return_flag" in sub.columns else 0.0
            ret_rate = round((returns / qty * 100.0), 2) if qty > 0 else 0.0
            
            disc = float(sub["discount_rate"].mean() * 100.0) if "discount_rate" in sub.columns else 0.0
            disc = round(disc, 2)
            
            records.append({
                dim_col: str(entity),
                "gross_revenue": rev,
                "gross_profit": profit,
                "gross_margin_pct": margin,
                "return_count": int(returns),
                "return_rate_pct": ret_rate,
                "discount_depth_pct": disc
            })

        return {
            "result_id": f"res_{uuid.uuid4().hex[:8]}",
            "success": True,
            "dimension": dim_col,
            "metrics": ["gross_revenue", "gross_profit", "gross_margin_pct", "return_rate_pct", "discount_depth_pct"],
            "records": records,
            "formula": f"MULTI_DRIVER_COMPARISON({dim_col} IN {entities}) -> COMPUTE(Revenue, Profit, Margin%, ReturnRate%, Discount%)"
        }

    @classmethod
    def period_variance(
        cls,
        df: pd.DataFrame,
        date_col: str,
        metric_col: str,
        current_period: str,
        previous_period: str,
        dimension_breakdown: Optional[str] = None,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates deterministic period-over-period variance.
        """
        filtered_df = cls.apply_filters(df, filters)
        if date_col not in filtered_df.columns or metric_col not in filtered_df.columns:
            return {
                "result_id": f"res_{uuid.uuid4().hex[:8]}",
                "success": False,
                "error": f"Columns '{date_col}' or '{metric_col}' not found.",
                "records": []
            }

        # Convert date column if string
        temp_df = filtered_df.copy()
        if not pd.api.types.is_datetime64_any_dtype(temp_df[date_col]):
            temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors="coerce")

        temp_df["period_str"] = temp_df[date_col].dt.strftime("%Y-%m")

        curr_df = temp_df[temp_df["period_str"] == current_period]
        prev_df = temp_df[temp_df["period_str"] == previous_period]

        if dimension_breakdown and dimension_breakdown in temp_df.columns:
            curr_agg = curr_df.groupby(dimension_breakdown)[metric_col].sum().rename("current_val")
            prev_agg = prev_df.groupby(dimension_breakdown)[metric_col].sum().rename("previous_val")

            merged = pd.concat([curr_agg, prev_agg], axis=1).fillna(0.0)
            merged["delta_abs"] = (merged["current_val"] - merged["previous_val"]).round(2)
            merged["delta_pct"] = np.where(
                merged["previous_val"] != 0,
                ((merged["delta_abs"] / merged["previous_val"]) * 100.0).round(2),
                0.0
            )
            records = merged.reset_index().to_dict(orient="records")
        else:
            curr_val = float(curr_df[metric_col].sum())
            prev_val = float(prev_df[metric_col].sum())
            delta_abs = round(curr_val - prev_val, 2)
            delta_pct = round(((delta_abs / prev_val) * 100.0) if prev_val != 0 else 0.0, 2)
            records = [{
                "current_period": current_period,
                "previous_period": previous_period,
                "current_val": curr_val,
                "previous_val": prev_val,
                "delta_abs": delta_abs,
                "delta_pct": delta_pct
            }]

        formula = f"VARIANCE({metric_col}) = ({current_period} - {previous_period}) / {previous_period}"

        return {
            "result_id": f"res_{uuid.uuid4().hex[:8]}",
            "success": True,
            "metric": metric_col,
            "current_period": current_period,
            "previous_period": previous_period,
            "records": records,
            "formula": formula
        }

    @classmethod
    def contribution_analysis(
        cls,
        df: pd.DataFrame,
        metric: str,
        dimension: str,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Calculates percentage contribution of each dimension value to the total metric.
        """
        filtered_df = cls.apply_filters(df, filters)
        if dimension not in filtered_df.columns or metric not in filtered_df.columns:
            return {
                "result_id": f"res_{uuid.uuid4().hex[:8]}",
                "success": False,
                "error": f"Columns '{dimension}' or '{metric}' not found."
            }

        grouped = filtered_df.groupby(dimension)[metric].sum().reset_index()
        total = float(grouped[metric].sum())

        if total > 0:
            grouped["contribution_pct"] = (grouped[metric] / total * 100.0).round(2)
        else:
            grouped["contribution_pct"] = 0.0

        grouped = grouped.sort_values(by=metric, ascending=False)
        records = grouped.to_dict(orient="records")
        formula = f"CONTRIBUTION({dimension}) = (SUM({metric} per {dimension}) / TOTAL_SUM({metric})) * 100"

        return {
            "result_id": f"res_{uuid.uuid4().hex[:8]}",
            "success": True,
            "metric": metric,
            "dimension": dimension,
            "total_value": round(total, 2),
            "records": records,
            "formula": formula
        }

    @classmethod
    def check_data_sufficiency(
        cls,
        df: pd.DataFrame,
        required_fields: List[str]
    ) -> Tuple[bool, List[str], List[str]]:
        """
        Checks whether the DataFrame contains the necessary fields to answer a query.
        Returns: (is_sufficient, available_fields, missing_fields)
        """
        df_cols = set(df.columns)
        available = [f for f in required_fields if f in df_cols]
        missing = [f for f in required_fields if f not in df_cols]
        is_sufficient = len(missing) == 0
        return is_sufficient, available, missing

    @classmethod
    def _find_col(cls, df: pd.DataFrame, candidates: List[str]) -> Optional[str]:
        """Case-insensitive and alias-aware column resolver."""
        cols = df.columns.tolist()
        col_map = {str(c).strip().lower().replace(" ", "_").replace("-", "_"): c for c in cols}
        for cand in candidates:
            cand_clean = cand.strip().lower().replace(" ", "_").replace("-", "_")
            if cand_clean in col_map:
                return col_map[cand_clean]
            for norm_col, orig_col in col_map.items():
                if cand_clean == norm_col or (len(cand_clean) >= 4 and cand_clean in norm_col):
                    return orig_col
        return None

    @classmethod
    def _find_default_dimension(cls, df: pd.DataFrame) -> str:
        """Finds the best semantic business dimension, strictly avoiding ID columns."""
        priority_dims = [
            ["category", "product_category", "department"],
            ["region", "store_region", "territory", "state", "city"],
            ["sales_channel", "channel", "payment_method"],
            ["store_name", "store", "location", "branch"],
            ["product_name", "product", "item_name", "sku_name", "item"]
        ]
        for cand_group in priority_dims:
            found = cls._find_col(df, cand_group)
            if found:
                return found
        
        # Fallback to first non-ID categorical column with reasonable cardinality
        for c in df.columns:
            c_lower = str(c).lower()
            if not any(c_lower.endswith(suffix) for suffix in ["_id", "_line_id", "_number", "_num", "_code", "id"]):
                if not pd.api.types.is_numeric_dtype(df[c]) and not pd.api.types.is_datetime64_any_dtype(df[c]):
                    if df[c].nunique() < 500:
                        return c
        
        return df.columns[0]

    @classmethod
    def execute_pattern_analysis(
        cls,
        pattern_id: str,
        df: pd.DataFrame,
        filters: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Executes deterministic Pandas analytical operations for the specified pattern ID.
        Returns structured numerical findings, formula breadcrumb, and lineage records.
        """
        filtered_df = cls.apply_filters(df, filters)

        if pattern_id in ["profit_decline_driver", "profitability_tradeoff"]:
            rev_col = cls._find_col(filtered_df, ["gross_revenue", "revenue", "sales_amount", "sales", "net_revenue", "total_sales"])
            prof_col = cls._find_col(filtered_df, ["gross_profit", "profit", "net_profit", "margin"])
            cogs_col = cls._find_col(filtered_df, ["cost", "cogs", "total_cost", "unit_cost"])
            disc_col = cls._find_col(filtered_df, ["discount_percentage", "discount_rate", "discount_depth_pct", "discount_amount", "discount"])
            
            dim = cls._find_col(filtered_df, ["category", "product_category", "region", "sales_channel", "store_name", "product_name"]) or cls._find_default_dimension(filtered_df)
            
            if rev_col and (prof_col or cogs_col):
                temp_df = filtered_df.copy()
                for c in [rev_col, prof_col, cogs_col, disc_col]:
                    if c and c in temp_df.columns:
                        temp_df[c] = pd.to_numeric(
                            temp_df[c].astype(str).str.replace(r"[\$,₦,€,£,¥,%]", "", regex=True).str.replace(",", "", regex=False),
                            errors="coerce"
                        ).fillna(0.0)
                
                if not prof_col and cogs_col:
                    temp_df["calculated_profit"] = temp_df[rev_col] - temp_df[cogs_col]
                    prof_col = "calculated_profit"

                agg_dict = {
                    rev_col: "sum",
                    prof_col: "sum"
                }
                if disc_col:
                    agg_dict[disc_col] = "mean"
                
                grouped = temp_df.groupby(dim).agg(agg_dict).reset_index()
                grouped["margin_pct"] = np.where(
                    grouped[rev_col] > 0,
                    (grouped[prof_col] / grouped[rev_col] * 100.0).round(2),
                    0.0
                )
                
                if disc_col:
                    if grouped[disc_col].max() <= 1.0:
                        grouped[disc_col] = (grouped[disc_col] * 100.0).round(2)
                    else:
                        grouped[disc_col] = grouped[disc_col].round(2)

                total_prof = float(grouped[prof_col].sum())
                grouped["contribution_pct"] = np.where(
                    total_prof > 0,
                    ((grouped[prof_col] / total_prof) * 100.0).round(2),
                    0.0
                )
                
                grouped = grouped.sort_values(by=rev_col, ascending=False).reset_index(drop=True)
                records = grouped.to_dict(orient="records")
                
                corr = 0.0
                if disc_col and len(grouped) > 1:
                    corr = float(grouped[disc_col].corr(grouped["margin_pct"]))
                    if np.isnan(corr):
                        corr = 0.0

                return {
                    "pattern_id": pattern_id,
                    "success": True,
                    "dimension": dim,
                    "records": records,
                    "correlation": round(corr, 3),
                    "primary_sort_metric": "margin_pct" if pattern_id == "profit_decline_driver" else rev_col,
                    "formula": f"DECOMPOSE({prof_col}, {rev_col}) BY {dim} -> MARGIN% = ({prof_col} / {rev_col}) * 100"
                }

        elif pattern_id == "return_driver":
            ret_col = cls._find_col(filtered_df, ["return_count", "returns", "return_flag", "is_return", "refund_count"])
            dim = cls._find_col(filtered_df, ["product_name", "product", "category", "store_name", "region"]) or cls._find_default_dimension(filtered_df)

            if ret_col:
                temp_df = filtered_df.copy()
                temp_df[ret_col] = pd.to_numeric(temp_df[ret_col], errors="coerce").fillna(0.0)
                grouped = temp_df.groupby(dim)[ret_col].sum().reset_index()
                grouped = grouped.sort_values(by=ret_col, ascending=False).reset_index(drop=True)
                total_ret = float(grouped[ret_col].sum())
                grouped["cum_returns"] = grouped[ret_col].cumsum()
                grouped["share_pct"] = np.where(total_ret > 0, ((grouped[ret_col] / total_ret) * 100).round(2), 0.0)
                grouped["cum_share_pct"] = np.where(total_ret > 0, ((grouped["cum_returns"] / total_ret) * 100).round(2), 0.0)
                return {
                    "pattern_id": pattern_id,
                    "success": True,
                    "dimension": dim,
                    "total_returns": total_ret,
                    "primary_sort_metric": ret_col,
                    "records": grouped.to_dict(orient="records"),
                    "formula": f"PARETO_CUMULATIVE({ret_col}) BY {dim}"
                }

        elif pattern_id == "store_profitability":
            store_col = cls._find_col(filtered_df, ["store_name", "store", "location", "branch", "region"]) or cls._find_default_dimension(filtered_df)
            rev_col = cls._find_col(filtered_df, ["gross_revenue", "revenue", "sales_amount", "sales", "net_revenue"])
            prof_col = cls._find_col(filtered_df, ["gross_profit", "profit", "net_profit", "margin"])

            if rev_col and prof_col:
                temp_df = filtered_df.copy()
                for c in [rev_col, prof_col]:
                    temp_df[c] = pd.to_numeric(temp_df[c], errors="coerce").fillna(0.0)
                grouped = temp_df.groupby(store_col).agg({
                    rev_col: "sum",
                    prof_col: "sum"
                }).reset_index()
                grouped["margin_pct"] = np.where(grouped[rev_col] > 0, (grouped[prof_col] / grouped[rev_col] * 100).round(2), 0.0)
                grouped = grouped.sort_values(by="margin_pct", ascending=False).reset_index(drop=True)
                return {
                    "pattern_id": pattern_id,
                    "success": True,
                    "dimension": store_col,
                    "primary_sort_metric": "margin_pct",
                    "records": grouped.to_dict(orient="records"),
                    "formula": f"RANK({store_col}) BY margin_pct"
                }

        elif pattern_id == "campaign_roi":
            camp_col = cls._find_col(filtered_df, ["marketing_campaign", "campaign", "campaign_name", "channel", "category"]) or cls._find_default_dimension(filtered_df)
            spend_col = cls._find_col(filtered_df, ["marketing_spend", "spend", "ad_spend", "budget", "cost"])
            rev_col = cls._find_col(filtered_df, ["revenue_attributed", "gross_revenue", "revenue", "sales"])

            if rev_col and spend_col:
                temp_df = filtered_df.copy()
                for c in [spend_col, rev_col]:
                    temp_df[c] = pd.to_numeric(temp_df[c], errors="coerce").fillna(0.0)
                grouped = temp_df.groupby(camp_col).agg({
                    spend_col: "sum",
                    rev_col: "sum"
                }).reset_index()
                grouped["roas"] = np.where(grouped[spend_col] > 0, (grouped[rev_col] / grouped[spend_col]).round(2), 0.0)
                grouped["roi_pct"] = np.where(grouped[spend_col] > 0, (((grouped[rev_col] - grouped[spend_col]) / grouped[spend_col]) * 100).round(2), 0.0)
                grouped = grouped.sort_values(by="roi_pct", ascending=False).reset_index(drop=True)
                return {
                    "pattern_id": pattern_id,
                    "success": True,
                    "dimension": camp_col,
                    "primary_sort_metric": "roi_pct",
                    "records": grouped.to_dict(orient="records"),
                    "formula": f"ROAS = {rev_col} / {spend_col}"
                }

        # Fallback multi-driver aggregation using semantic dimension
        default_dim = cls._find_default_dimension(filtered_df)
        num_cols = [c for c in filtered_df.columns if pd.api.types.is_numeric_dtype(filtered_df[c])]
        return cls.group_and_aggregate(
            df=filtered_df,
            dimensions=[default_dim],
            metrics=num_cols[:2] if num_cols else [filtered_df.columns[0]]
        )
