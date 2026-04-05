from sqlalchemy.orm import Session
from app.db.models.policy_claims import PolicyClaims


def get_worker_payouts(worker_id: int, db: Session):
    payouts = db.query(PolicyClaims).filter(
        PolicyClaims.worker_id == worker_id
    ).order_by(PolicyClaims.payout_timestamp.desc()).all()

    return [
        {
            "amount": p.payout_amount,
            "status": p.payout_status,
            "timestamp": p.payout_timestamp,
            "trigger": p.trigger_type
        }
        for p in payouts
    ]