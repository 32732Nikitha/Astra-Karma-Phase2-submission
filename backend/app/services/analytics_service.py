from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Integer
from app.db.models.policy_claims import PolicyClaims
from app.db.models.daily_operations import DailyOperations
from app.db.models.worker import Worker


# 🔥 LOSS RATIO
def get_loss_ratio(db: Session):
    total_premium = db.query(func.sum(PolicyClaims.weekly_premium)).scalar() or 0
    total_claims = db.query(func.sum(PolicyClaims.payout_amount)).scalar() or 0

    loss_ratio = (total_claims / total_premium) if total_premium else 0

    return {
        "total_premium": float(total_premium),
        "total_claims": float(total_claims),
        "loss_ratio": round(loss_ratio, 2)
    }


# 🔥 PREMIUM VS CLAIMS
def get_premium_vs_claims(db: Session):
    premium = db.query(func.sum(PolicyClaims.weekly_premium)).scalar() or 0
    claims = db.query(func.sum(PolicyClaims.payout_amount)).scalar() or 0

    return {
        "premium_collected": float(premium),
        "claims_paid": float(claims)
    }


# 🔥 ZONE RISK
def get_zone_risk(db: Session):
    results = db.query(
        Worker.geo_zone_id,
        func.count(PolicyClaims.claim_id),
        func.avg(DailyOperations.income_loss)
    ).join(
        PolicyClaims, Worker.worker_id == PolicyClaims.worker_id
    ).join(
        DailyOperations, Worker.worker_id == DailyOperations.worker_id
    ).group_by(
        Worker.geo_zone_id
    ).all()

    return [
        {
            "geo_zone_id": r[0],
            "total_claims": r[1],
            "avg_income_loss": float(r[2] or 0)
        }
        for r in results
    ]


# 🔥 FRAUD SUMMARY
def get_fraud_summary(db: Session):
    total = db.query(func.count(PolicyClaims.claim_id)).scalar() or 0

    fraud = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True
    ).scalar() or 0

    rate = (fraud / total) if total else 0

    return {
        "total_claims": total,
        "fraud_cases": fraud,
        "fraud_rate": round(rate, 2)
    }