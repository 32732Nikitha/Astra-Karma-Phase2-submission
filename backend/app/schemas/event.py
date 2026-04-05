from pydantic import BaseModel
from datetime import date

class EventResponse(BaseModel):
    date: date
    rainfall: float
    aqi: int
    temperature: float
    traffic_index: float
    disruption_flag: bool

    class Config:
        from_attributes = True