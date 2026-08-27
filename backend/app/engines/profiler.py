import re
from typing import Any, Dict, List, Tuple
import numpy as np
import pandas as pd
from app.models.domain import ColumnProfile, ColumnRole, DataDictionary

class DataProfiler:
    """
    Automated Data Profiling Engine implementing the 'CEO of the Dataset' principle.
    Inspects tabular data, detects types, classifies measures vs dimensions,
    flags ambiguities, and infers available operational capabilities.
    """

    CAPABILITY_PATTERNS = {
        "financial": [r"revenue", r"sales", r"profit", r"margin", r"cogs", r"cost", r"price", r"income", r"amount", r"turnover", r"total"],
        "commercial": [r"quantity", r"qty", r"units", r"volume", r"discount", r"order", r"transaction", r"item", r"count"],
        "customer": [r"customer", r"client", r"buyer", r"user", r"csat", r"nps", r"rating", r"score"],
        "returns": [r"return", r"refund", r"damage", r"replacement", r"reversal"],
        "inventory": [r"stock", r"inventory", r"warehouse", r"sku", r"reorder", r"on_hand"],
        "delivery": [r"delivery", r"dispatch", r"transit", r"lead_time", r"shipping", r"carrier", r"hub"],
        "marketing": [r"campaign", r"ad_spend", r"channel", r"click", r"impression", r"attribution"],
        "employee": [r"employee", r"sales_rep", r"agent", r"staff", r"quota"]
    }

    DATE_PATTERNS = [r"date", r"time", r"timestamp", r"year", r"month", r"day", r"period"]
    ID_PATTERNS = [r"_id$", r"^id$", r"code$", r"number$", r"num$", r"reference", r"ref$"]

    @classmethod
    def profile_dataframe(cls, df: pd.DataFrame, title: str = "Connected Business Dataset") -> DataDictionary:
        """
        Profiles a pandas DataFrame and generates a structured DataDictionary.
        """
        row_count = len(df)
        column_count = len(df.columns)
        columns_dict: Dict[str, ColumnProfile] = {}

        for col_name in df.columns:
            series = df[col_name]
            profile = cls._profile_column(col_name, series, row_count)
            columns_dict[col_name] = profile

        # Infer overall operational capabilities
        capabilities = cls._infer_capabilities(columns_dict)

        return DataDictionary(
            title=title,
            row_count=row_count,
            column_count=column_count,
            columns=columns_dict,
            capabilities_detected=capabilities
        )

    @classmethod
    def _profile_column(cls, col_name: str, series: pd.Series, total_rows: int) -> ColumnProfile:
        col_clean = str(col_name).strip().lower().replace(" ", "_").replace("-", "_")
        null_count = int(series.isna().sum())
        null_pct = round((null_count / total_rows * 100.0) if total_rows > 0 else 0.0, 2)
        non_null_series = series.dropna()
        distinct_count = int(non_null_series.nunique())

        # Sample non-null values
        sample_vals = [
            str(x) if isinstance(x, (pd.Timestamp, np.datetime64)) else (float(x) if isinstance(x, (np.floating, float)) else (int(x) if isinstance(x, (np.integer, int)) else str(x)))
            for x in non_null_series.head(5).tolist()
        ]

        inferred_type = "text"
        role = ColumnRole.DIMENSION
        is_ambiguous = False
        ambiguity_reason = None

        # 1. Date Detection
        is_date_named = any(re.search(p, col_clean) for p in cls.DATE_PATTERNS)
        if pd.api.types.is_datetime64_any_dtype(series):
            inferred_type = "datetime"
            role = ColumnRole.DATE
        elif is_date_named:
            try:
                parsed = pd.to_datetime(non_null_series.head(20), errors="coerce")
                if parsed.notna().sum() >= len(parsed) * 0.7:
                    inferred_type = "datetime"
                    role = ColumnRole.DATE
            except Exception:
                pass

        # 2. Numeric / Currency / Measure Detection
        if role != ColumnRole.DATE:
            is_numeric = pd.api.types.is_numeric_dtype(series)
            # Try cleaning currency strings if not directly numeric
            if not is_numeric and len(non_null_series) > 0:
                sample_clean = (
                    non_null_series.head(20).astype(str)
                    .str.replace(r"[\$,₦,€,£,¥,%]", "", regex=True)
                    .str.replace(",", "", regex=False)
                    .str.strip()
                )
                numeric_parsed = pd.to_numeric(sample_clean, errors="coerce")
                if numeric_parsed.notna().sum() >= len(sample_clean) * 0.8:
                    is_numeric = True

            if is_numeric:
                is_id_named = any(re.search(p, col_clean) for p in cls.ID_PATTERNS)
                if is_id_named and distinct_count > total_rows * 0.7:
                    inferred_type = "id"
                    role = ColumnRole.IDENTIFIER
                elif distinct_count <= 2 and (col_clean.endswith("_flag") or col_clean.endswith("_return") or col_clean in ["returned", "refunded"]):
                    inferred_type = "category"
                    role = ColumnRole.DIMENSION
                else:
                    if any(re.search(p, col_clean) for p in [r"revenue", r"sales", r"price", r"profit", r"cogs", r"cost", r"spend", r"amount", r"total", r"margin"]):
                        inferred_type = "currency"
                    else:
                        inferred_type = "numeric"
                    role = ColumnRole.MEASURE
            else:
                # Text or Category or String ID
                is_id_named = any(re.search(p, col_clean) for p in cls.ID_PATTERNS)
                if is_id_named and distinct_count > total_rows * 0.5:
                    inferred_type = "id"
                    role = ColumnRole.IDENTIFIER
                elif distinct_count < 100 or distinct_count < total_rows * 0.2:
                    inferred_type = "category"
                    role = ColumnRole.DIMENSION
                else:
                    inferred_type = "text"
                    role = ColumnRole.TEXT

        # 3. Ambiguity Check
        if col_clean in ["val", "misc", "temp"]:
            is_ambiguous = True
            ambiguity_reason = f"Field '{col_name}' is generic. Unit of measure should be verified."

        if null_pct > 40.0:
            is_ambiguous = True
            ambiguity_reason = f"High missingness ({null_pct}% nulls) detected in column '{col_name}'."

        return ColumnProfile(
            name=col_name,
            inferred_type=inferred_type,
            role=role,
            null_count=null_count,
            null_pct=null_pct,
            distinct_count=distinct_count,
            is_ambiguous=is_ambiguous,
            ambiguity_reason=ambiguity_reason,
            sample_values=sample_vals
        )

    @classmethod
    def _infer_capabilities(cls, columns: Dict[str, ColumnProfile]) -> List[str]:
        capabilities: List[str] = []
        col_names_clean = [str(c).strip().lower().replace(" ", "_").replace("-", "_") for c in columns.keys()]

        for cap_name, patterns in cls.CAPABILITY_PATTERNS.items():
            for pat in patterns:
                if any(re.search(pat, c) for c in col_names_clean):
                    capabilities.append(cap_name)
                    break

        return sorted(capabilities)
