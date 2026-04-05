from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ClaimResponse(BaseModel):
    claim_id: int
    worker_id: int
    trigger_type: Optional[str]
    trigger_level: Optional[str]
    payout_amount: Optional[float]
    payout_status: Optional[str]
    claim_timestamp: Optional[datetime]
    fraud_flag: Optional[bool]

    class Config:
        from_attributes = True


class ClaimAuditResponse(BaseModel):
    claim_id: int
    fraud_flag: bool
    payout_status: str
    reason: str | None = None