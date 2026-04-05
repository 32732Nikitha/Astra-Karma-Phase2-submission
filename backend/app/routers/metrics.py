from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from sqlalchemy import func, cast, Integer
from app.db.models.daily_operations import DailyOperations
from app.db.models.policy_claims import PolicyClaims

router = APIRouter(prefix="/api/v1/metrics", tags=["Metrics"])


@router.get("/pipeline")
def get_pipeline_metrics(db: Session = Depends(get_db)):
    """
    Return 7-day pipeline metrics from real DB:
    - signals: count of daily_operations records per day_of_week
    - triggers: count of disruption_flag=True per day_of_week
    - payouts: count of paid claims per day_of_week (by day 0-6)
    """
    day_labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    # Count daily_operations records (signals) per day_of_week
    signals_raw = db.query(
        DailyOperations.day_of_week,
        func.count(DailyOperations.log_id)
    ).group_by(DailyOperations.day_of_week).all()

    # Count disruptions per day_of_week
    triggers_raw = db.query(
        DailyOperations.day_of_week,
        func.count(DailyOperations.log_id)
    ).filter(
        DailyOperations.disruption_flag == True
    ).group_by(DailyOperations.day_of_week).all()

    # Count paid claims per day_of_week (use payout_timestamp day of week)
    payouts_raw = db.query(
        func.extract('dow', PolicyClaims.payout_timestamp).label('dow'),
        func.count(PolicyClaims.claim_id)
    ).filter(
        PolicyClaims.payout_status == 'paid',
        PolicyClaims.payout_timestamp.isnot(None)
    ).group_by('dow').all()

    signals_map = {int(r[0]): int(r[1]) for r in signals_raw if r[0] is not None}
    triggers_map = {int(r[0]): int(r[1]) for r in triggers_raw if r[0] is not None}
    # PostgreSQL DOW: 0=Sunday..6=Saturday -> remap to Mon=1..Sun=0
    payouts_map = {int(r[0]): int(r[1]) for r in payouts_raw if r[0] is not None}

    data = []
    for i, label in enumerate(day_labels):
        # day_of_week in our data: 0=Mon (Monday), 1=Tue, ..., 6=Sun typically
        # PostgreSQL extract('dow') returns 0=Sunday..6=Saturday
        # Map label index i -> postgres dow: Mon(0)->1, ..., Sat(5)->6, Sun(6)->0
        pg_dow = (i + 1) % 7

        data.append({
            "day": label,
            "signals": signals_map.get(i, signals_map.get(i % 7, 0)),
            "triggers": triggers_map.get(i, triggers_map.get(i % 7, 0)),
            "payouts": payouts_map.get(pg_dow, 0),
        })

    return {
        "success": True,
        "message": "Pipeline metrics from DB",
        "data": data
    }