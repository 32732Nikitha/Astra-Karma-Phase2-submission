from pydantic import BaseModel
from datetime import date


class PolicyResponse(BaseModel):
    policy_id: int
    plan_tier: str
    policy_status: str
    events_used: int
    events_remaining: int
    activation_date: date
    last_active_date: date

    class Config:
        from_attributes = True