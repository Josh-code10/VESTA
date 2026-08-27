import os
from typing import Dict, Optional
import pandas as pd
from app.models.domain import DataDictionary, EvidenceNode

class SessionDataManager:
    """
    Manages in-memory active DataFrames, DataDictionaries, active investigations,
    and KPI configurations per workspace session.
    """
    _dataframes: Dict[str, pd.DataFrame] = {}
    _data_dictionaries: Dict[str, DataDictionary] = {}
    _investigation_nodes: Dict[str, list[EvidenceNode]] = {}
    _kpi_weights: Dict[str, Dict[str, float]] = {}
    _kpi_targets: Dict[str, Dict[str, float]] = {}

    @classmethod
    def load_demo_fixture(cls, workspace_id: str = "ws_default") -> pd.DataFrame:
        fixture_path = os.path.join(os.path.dirname(__file__), "..", "data", "demo_fixture.csv")
        if os.path.exists(fixture_path):
            df = pd.read_csv(fixture_path)
        else:
            # Fallback inline small DataFrame if file doesn't exist
            df = pd.DataFrame({
                "order_id": [f"ORD-{i}" for i in range(100)],
                "revenue": [1000.0 * (i + 1) for i in range(100)],
                "cogs": [700.0 * (i + 1) for i in range(100)],
                "quantity": [1 + (i % 5) for i in range(100)],
                "region": ["Lagos" if i % 2 == 0 else "Abuja" for i in range(100)],
                "category": ["Electronics" if i % 2 == 0 else "Appliances" for i in range(100)],
                "return_flag": [1 if i % 10 == 0 else 0 for i in range(100)]
            })
        cls._dataframes[workspace_id] = df
        return df

    @classmethod
    def get_dataframe(cls, workspace_id: str = "ws_default") -> pd.DataFrame:
        if workspace_id not in cls._dataframes:
            return cls.load_demo_fixture(workspace_id)
        return cls._dataframes[workspace_id]

    @classmethod
    def set_dataframe(cls, workspace_id: str, df: pd.DataFrame):
        cls._dataframes[workspace_id] = df

    @classmethod
    def get_dictionary(cls, workspace_id: str = "ws_default") -> Optional[DataDictionary]:
        return cls._data_dictionaries.get(workspace_id)

    @classmethod
    def set_dictionary(cls, workspace_id: str, dd: DataDictionary):
        cls._data_dictionaries[workspace_id] = dd

    @classmethod
    def add_evidence_node(cls, workspace_id: str, node: EvidenceNode):
        if workspace_id not in cls._investigation_nodes:
            cls._investigation_nodes[workspace_id] = []
        if not any(existing.node_id == node.node_id for existing in cls._investigation_nodes[workspace_id]):
            cls._investigation_nodes[workspace_id].append(node)

    @classmethod
    def get_evidence_nodes(cls, workspace_id: str, investigation_id: Optional[str] = None) -> list[EvidenceNode]:
        nodes = cls._investigation_nodes.get(workspace_id, [])
        if investigation_id:
            return [n for n in nodes if n.investigation_id == investigation_id]
        return nodes

    @classmethod
    def get_kpi_weights(cls, workspace_id: str = "ws_default") -> Dict[str, float]:
        return cls._kpi_weights.get(workspace_id, {})

    @classmethod
    def set_kpi_weight(cls, workspace_id: str, kpi_id: str, weight: float):
        if workspace_id not in cls._kpi_weights:
            cls._kpi_weights[workspace_id] = {}
        cls._kpi_weights[workspace_id][kpi_id] = weight

    @classmethod
    def get_kpi_targets(cls, workspace_id: str = "ws_default") -> Dict[str, float]:
        return cls._kpi_targets.get(workspace_id, {})

    @classmethod
    def set_kpi_target(cls, workspace_id: str, kpi_id: str, target: float):
        if workspace_id not in cls._kpi_targets:
            cls._kpi_targets[workspace_id] = {}
        cls._kpi_targets[workspace_id][kpi_id] = target
