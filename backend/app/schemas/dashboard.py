from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class WorkerSchema(BaseModel):
    worker_id: int
    worker_name: str
    platform: str
    city: str

class PolicySchema(BaseModel):
    plan_tier: Optional[str]
    policy_status: Optional[str]
    events_used: int
    events_remaining: int

class EarningsSchema(BaseModel):
    avg_income: float
    latest_income: float

class EventsSummarySchema(BaseModel):
    total_events: int
    disruptions: int

class DashboardSchema(BaseModel):
    worker: WorkerSchema
    policy: PolicySchema
    earnings: EarningsSchema
    events_summary: EventsSummarySchema
    recent_payouts: List[dict]