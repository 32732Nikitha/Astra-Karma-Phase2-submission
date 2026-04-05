from pydantic import BaseModel
from typing import Optional, List


class FraudRequest(BaseModel):
    worker_id: int = 0
    payout_amount: float = 0.0
    location: Optional[str] = None
    gps_tower_delta: Optional[float] = None
    accelerometer_variance: Optional[float] = None
    claim_response_time_sec: Optional[float] = None


class FraudResponse(BaseModel):
    fraud_score: float
    fraud_flag: bool
    reason: List[str]
    decision: Optional[str] = None
    payout_status: Optional[str] = None
    percentile: Optional[float] = None