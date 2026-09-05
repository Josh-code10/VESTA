from datetime import datetime
from fastapi import APIRouter
from app.api.deps import SessionDataManager
from app.engines.health_engine import HealthEngine
from app.models.domain import SyncStatus
from app.models.schemas import HealthDashboardResponse, UpdateKPIConfigRequest

router = APIRouter()

@router.get("/dashboard", response_model=HealthDashboardResponse)
async def get_health_dashboard():
    workspace_id = "ws_default"
    df = SessionDataManager.get_dataframe(workspace_id)
    weights = SessionDataManager.get_kpi_weights(workspace_id)
    targets = SessionDataManager.get_kpi_targets(workspace_id)

    (
        health_score,
        top_3,
        view_more,
        storyline,
        active_kpis,
        available_categories,
        catalog,
        executive_intel
    ) = HealthEngine.compute_health_dashboard(
        df=df,
        custom_weights=weights,
        custom_targets=targets
    )

    data_dict = SessionDataManager.get_dictionary(workspace_id)
    title = data_dict.title if data_dict else "Connected Business Dataset"
    row_count = data_dict.row_count if data_dict else (len(df) if df is not None else 0)
    column_count = data_dict.column_count if data_dict else (len(df.columns) if df is not None else 0)

    return HealthDashboardResponse(
        workspace_id=workspace_id,
        dataset_title=title,
        row_count=row_count,
        column_count=column_count,
        last_synced_at=datetime.utcnow(),
        sync_status=SyncStatus.READY,
        business_storyline=storyline,
        health_score=health_score,
        top_3_issues=top_3,
        view_more_issues=view_more,
        kpis=active_kpis,
        available_categories=available_categories,
        available_kpi_catalog=catalog,
        inferred_questions=executive_intel.inferred_questions if executive_intel else [],
        executive_intelligence=executive_intel
    )

@router.post("/kpi")
async def update_kpi_config(req: UpdateKPIConfigRequest):
    workspace_id = "ws_default"
    if req.target_value is not None:
        SessionDataManager.set_kpi_target(workspace_id, req.kpi_id, req.target_value)
    return {"status": "success", "message": f"KPI '{req.kpi_id}' updated successfully."}
