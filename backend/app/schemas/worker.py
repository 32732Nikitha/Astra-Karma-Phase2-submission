from pydantic import BaseModel


class WorkerBasicResponse(BaseModel):
    worker_id: int
    worker_name: str
    platform: str
    city: str


class WorkerFullResponse(BaseModel):
    worker_id: int
    worker_name: str
    platform: str
    city: str
    geo_zone_id: str
    vehicle_type: str
    shift_hours: float
    experience_level: float
    employment_type: str
    upi_id: str | None
    bank_ifsc: str | None
    fraud_risk_score: float

    class Config:
        from_attributes = True