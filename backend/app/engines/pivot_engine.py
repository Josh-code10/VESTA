from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class PivotCell(BaseModel):
    row_key: str
    col_key: str
    value: float

class PivotTableSpec(BaseModel):
    title: str
    row_dimension: str
    col_dimension: str
    metric: str
    rows: List[str]
    columns: List[str]
    matrix: Dict[str, Dict[str, float]]  # row -> col -> val
    row_totals: Dict[str, float]
    col_totals: Dict[str, float]
    grand_total: float

class PivotEngine:
    """
    Contextual Pivot Table Engine.
    Generates 2D cross-tabulation matrices with totals for executive multidimensional review.
    """

    @classmethod
    def generate_pivot(
        cls,
        data: List[Dict[str, Any]],
        row_dim: str,
        col_dim: str,
        metric: str
    ) -> Optional[PivotTableSpec]:
        if not data or not row_dim or not col_dim or not metric:
            return None

        matrix: Dict[str, Dict[str, float]] = {}
        rows_set = set()
        cols_set = set()
        row_totals: Dict[str, float] = {}
        col_totals: Dict[str, float] = {}
        grand_total = 0.0

        for row in data:
            r_val = str(row.get(row_dim, 'Unknown'))
            c_val = str(row.get(col_dim, 'General'))
            val = float(row.get(metric, 0.0)) if isinstance(row.get(metric), (int, float)) else 0.0

            rows_set.add(r_val)
            cols_set.add(c_val)

            if r_val not in matrix:
                matrix[r_val] = {}
            matrix[r_val][c_val] = matrix[r_val].get(c_val, 0.0) + val

            row_totals[r_val] = row_totals.get(r_val, 0.0) + val
            col_totals[c_val] = col_totals.get(c_val, 0.0) + val
            grand_total += val

        rows_list = sorted(list(rows_set))
        cols_list = sorted(list(cols_set))

        return PivotTableSpec(
            title=f"Cross-Tabulation Matrix: {row_dim.title()} × {col_dim.title()}",
            row_dimension=row_dim,
            col_dimension=col_dim,
            metric=metric,
            rows=rows_list,
            columns=cols_list,
            matrix=matrix,
            row_totals=row_totals,
            col_totals=col_totals,
            grand_total=grand_total
        )
