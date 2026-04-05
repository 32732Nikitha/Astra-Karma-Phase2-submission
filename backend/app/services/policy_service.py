from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.models.policy_claims import PolicyClaims


# 🔥 CREATE POLICY
def create_policy(worker_id: int, data: dict, db: Session):
    policy = PolicyClaims(
        worker_id=worker_id,
        plan_tier=data["plan_tier"],
        weekly_premium=data["weekly_premium"],
        activation_date=datetime.utcnow().date(),
        last_active_date=(datetime.utcnow() + timedelta(days=7)).date(),
        policy_status="active",
        eligibility_flag=True,
        events_used=0,
        events_remaining=2
    )

    db.add(policy)
    db.commit()
    db.refresh(policy)

    return policy


# 🔥 GET ACTIVE POLICY
def get_active_policy(worker_id: int, db: Session):
    return db.query(PolicyClaims).filter(
        PolicyClaims.worker_id == worker_id,
        PolicyClaims.policy_status == "active"
    ).order_by(PolicyClaims.activation_date.desc()).first()


# 🔥 GET ALL POLICIES
def get_worker_policies(worker_id: int, db: Session):
    return db.query(PolicyClaims).filter(
        PolicyClaims.worker_id == worker_id
    ).all()


# 🔥 RENEW POLICY
def renew_policy(policy_id: int, db: Session):
    policy = db.query(PolicyClaims).filter(
        PolicyClaims.claim_id == policy_id
    ).first()

    policy.activation_date = datetime.utcnow().date()
    policy.last_active_date = (datetime.utcnow() + timedelta(days=7)).date()
    policy.policy_status = "active"

    db.commit()
    return policy


# 🔥 UPGRADE POLICY
def upgrade_policy(policy_id: int, new_tier: str, db: Session):
    policy = db.query(PolicyClaims).filter(
        PolicyClaims.claim_id == policy_id
    ).first()

    policy.plan_tier = new_tier
    policy.weekly_premium *= 1.2  # simple logic

    db.commit()
    return policy


# 🔥 CANCEL POLICY
def cancel_policy(policy_id: int, db: Session):
    policy = db.query(PolicyClaims).filter(
        PolicyClaims.claim_id == policy_id
    ).first()

    policy.policy_status = "cancelled"

    db.commit()
    return policy