from sqlalchemy.orm import Session
from app.db.models.daily_operations import DailyOperations


def get_worker_events(worker_id: int, db: Session):
    events = db.query(DailyOperations).filter(
        DailyOperations.worker_id == worker_id
    ).order_by(DailyOperations.date.desc()).limit(50).all()

    return [
        {
            "date": e.date,
            "rainfall": e.rainfall,
            "aqi": e.aqi,
            "temperature": e.temperature,
            "traffic_index": e.traffic_index,
            "disruption_flag": e.disruption_flag
        }
        for e in events
    ]