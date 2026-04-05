from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.event_service import get_worker_events

router = APIRouter(prefix="/api/v1/events", tags=["Events"])

from typing import List
from app.schemas.event import EventResponse
from app.schemas.common import APIResponse

@router.get("/{worker_id}", response_model=APIResponse[List[EventResponse]])
def get_events(worker_id: int, db: Session = Depends(get_db)):
    data = get_worker_events(worker_id, db)

    return {
        "success": True,
        "message": "Events fetched successfully",
        "data": data
    }