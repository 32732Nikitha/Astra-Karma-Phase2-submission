from sqlalchemy.orm import Session
from app.db.models.daily_operations import DailyOperations
from fastapi import HTTPException

# 🔥 LIVE TRIGGERS (latest record)
def get_live_triggers(worker_id: int, db: Session):

    latest = db.query(DailyOperations).filter(
        DailyOperations.worker_id == worker_id
    ).order_by(DailyOperations.date.desc()).first()

    if not latest:
        raise HTTPException(status_code=404, detail="No trigger data found")

    return {
        "composite_score": latest.composite_score,
        "rainfall": latest.rainfall,
        "aqi": latest.aqi,
        "temperature": latest.temperature,
        "traffic_index": latest.traffic_index,
        "disruption_flag": latest.disruption_flag
    }


# 🔥 HISTORY (last 10 records)
def get_trigger_history(worker_id: int, db: Session):
    records = db.query(DailyOperations).filter(
        DailyOperations.worker_id == worker_id
    ).order_by(
        DailyOperations.date.desc()
    ).limit(10).all()

    return [
        {
            "date": r.date,
            "rainfall": r.rainfall,
            "aqi": r.aqi,
            "temperature": r.temperature,
            "traffic_index": r.traffic_index,
            "composite_score": r.composite_score,
            "disruption_flag": r.disruption_flag
        }
        for r in records
    ]

from datetime import date
from app.db.models.daily_operations import DailyOperations


def simulate_trigger(worker_id: int, data: dict, db):
    record = DailyOperations(
        worker_id=worker_id,
        date=date.today(),
        rainfall=data.get("rainfall", 0),
        temperature=data.get("temperature", 0),
        aqi=data.get("aqi", 0),
        traffic_index=data.get("traffic_index", 0),
        composite_score=80,
        disruption_flag=True
    )

    db.add(record)
    db.commit()

    return record