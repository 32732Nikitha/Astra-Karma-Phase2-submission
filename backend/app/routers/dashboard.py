from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
router = APIRouter(prefix="/api/v1/dashboard", tags=["Dashboard"])
from app.services.dashboard_service import get_dashboard_data

from app.schemas.dashboard import DashboardSchema
from app.schemas.common import APIResponse

@router.get("/{worker_id}", response_model=APIResponse[DashboardSchema])
def get_dashboard(worker_id: int, db: Session = Depends(get_db)):
    data = get_dashboard_data(worker_id, db)

    return {
        "success": True,
        "message": "Dashboard fetched successfully",
        "data": data
    }