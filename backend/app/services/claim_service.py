from sqlalchemy.orm import Session
from app.db.models.policy_claims import PolicyClaims


# 🔥 GET WORKER CLAIMS
def get_worker_claims(worker_id: int, db: Session):
    return db.query(PolicyClaims).filter(
        PolicyClaims.worker_id == worker_id
    ).order_by(
        PolicyClaims.claim_timestamp.desc()
    ).all()


# 🔥 GET CLAIM AUDIT
def get_claim_audit(claim_id: int, db: Session):
    claim = db.query(PolicyClaims).filter(
        PolicyClaims.claim_id == claim_id
    ).first()

    return {
        "claim_id": claim.claim_id,
        "fraud_flag": claim.fraud_flag,
        "payout_status": claim.payout_status,
        "reason": "Auto-generated fraud check"
    }


# 🔥 RELEASE CLAIM
def release_claim(claim_id: int, db: Session):
    claim = db.query(PolicyClaims).filter(
        PolicyClaims.claim_id == claim_id
    ).first()

    claim.payout_status = "paid"

    db.commit()
    return claim


# 🔥 REJECT CLAIM
def reject_claim(claim_id: int, reason: str, db: Session):
    claim = db.query(PolicyClaims).filter(
        PolicyClaims.claim_id == claim_id
    ).first()

    claim.payout_status = "rejected"
    claim.fraud_flag = True

    db.commit()
    return claim