import logging

logger = logging.getLogger(__name__)
from fastapi import HTTPException

from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.models.worker import Worker
from app.db.models.daily_operations import DailyOperations
from app.db.models.policy_claims import PolicyClaims


def get_dashboard_data(worker_id: int, db: Session):

    logger.info(f"Fetching dashboard for worker {worker_id}")

    worker = db.query(Worker).filter(
        Worker.worker_id == worker_id
    ).first()

    if not worker:
        logger.warning(f"Worker not found: {worker_id}")
        raise HTTPException(status_code=404, detail="Worker not found")

    logger.info(f"Worker found: {worker.worker_name}")

    policy = db.query(PolicyClaims).filter(
        PolicyClaims.worker_id == worker_id
    ).order_by(
        PolicyClaims.activation_date.desc()
    ).first()

    logger.info(f"Policy fetched for worker {worker_id}")

    from sqlalchemy import cast, Integer

    earnings = db.query(
        func.avg(DailyOperations.daily_income),
        func.max(DailyOperations.daily_income),
        func.count(DailyOperations.log_id),
        func.sum(cast(DailyOperations.disruption_flag, Integer))
    ).filter(
        DailyOperations.worker_id == worker_id
    ).first()


    logger.info(f"Events summary computed for worker {worker_id}")

    payouts = db.query(PolicyClaims).filter(
        PolicyClaims.worker_id == worker_id
    ).order_by(
        PolicyClaims.payout_timestamp.desc()
    ).limit(5).all()

    logger.info(f"Fetched {len(payouts)} payouts for worker {worker_id}")

  
    return {
        "worker": {
            "worker_id": worker.worker_id,
            "worker_name": worker.worker_name,
            "platform": worker.platform,
            "city": worker.city
        },
        "policy": {
            "plan_tier": policy.plan_tier if policy else None,
            "policy_status": policy.policy_status if policy else None,
            "events_used": policy.events_used if policy else 0,
            "events_remaining": policy.events_remaining if policy else 0
        },
        "earnings": {
            "avg_income": float(earnings[0] or 0),
            "latest_income": float(earnings[1] or 0)
        },
        "events_summary": {
            "total_events": earnings[2] or 0,
            "disruptions": earnings[3] or 0
        },
        "recent_payouts": [
            {
                "amount": p.payout_amount,
                "status": p.payout_status,
                "timestamp": p.payout_timestamp,
                "trigger": p.trigger_type
            }
            for p in payouts
        ]
    }