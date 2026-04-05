from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.payout_service import get_worker_payouts

router = APIRouter(prefix="/api/v1/payouts", tags=["Payouts"])

from typing import List
from app.schemas.payout import PayoutResponse
from app.schemas.common import APIResponse

@router.get("/{worker_id}", response_model=APIResponse[List[PayoutResponse]])
def get_payouts(worker_id: int, db: Session = Depends(get_db)):
    data = get_worker_payouts(worker_id, db)

    return {
        "success": True,
        "message": "Payouts fetched successfully",
        "data": data
    }