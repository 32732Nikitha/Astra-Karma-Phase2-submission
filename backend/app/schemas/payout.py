from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PayoutResponse(BaseModel):
    amount: float
    status: str
    timestamp: Optional[datetime]
    trigger: Optional[str]

    class Config:
        from_attributes = True