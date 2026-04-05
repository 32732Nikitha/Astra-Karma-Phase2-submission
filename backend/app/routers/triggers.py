from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.trigger_service import (
    get_live_triggers,
    get_trigger_history,
    simulate_trigger
)

router = APIRouter(prefix="/api/v1/triggers", tags=["Triggers"])

@router.get("/live/{worker_id}")
def live_triggers(worker_id: int, db: Session = Depends(get_db)):
    return get_live_triggers(worker_id, db)


@router.get("/history/{worker_id}")
def trigger_history(worker_id: int, db: Session = Depends(get_db)):
    return get_trigger_history(worker_id, db)

@router.post("/simulate/{worker_id}")
def simulate(worker_id: int, data: dict, db: Session = Depends(get_db)):
    result = simulate_trigger(worker_id, data, db)

    return {
        "success": True,
        "message": "Trigger simulated",
        "data": result
    }