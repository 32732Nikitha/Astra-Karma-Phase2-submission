from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from app.db.database import get_db
from app.db.models.policy_claims import PolicyClaims
from app.db.models.worker import Worker
from app.schemas.fraud import FraudRequest, FraudResponse
from app.schemas.common import APIResponse
from app.services.fraud_service import calculate_fraud_score

router = APIRouter(prefix="/api/v1/fraud", tags=["Fraud"])


@router.post("/check", response_model=APIResponse[FraudResponse])
def check_fraud(data: FraudRequest):
    result = calculate_fraud_score(data.dict())
    return {
        "success": True,
        "message": "Fraud check completed",
        "data": result
    }


@router.get("/cases")
def get_fraud_cases(
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Return all flagged claims joined with worker names."""
    rows = db.query(
        PolicyClaims, Worker.worker_name, Worker.city, Worker.geo_zone_id, Worker.fraud_risk_score
    ).join(
        Worker, PolicyClaims.worker_id == Worker.worker_id
    ).filter(
        PolicyClaims.fraud_flag == True
    ).order_by(
        PolicyClaims.claim_timestamp.desc()
    ).offset(offset).limit(limit).all()

    cases = []
    for claim, worker_name, city, geo_zone_id, fraud_risk_score in rows:
        cases.append({
            "case_id": f"FRD-{claim.claim_id:04d}",
            "claim_id": claim.claim_id,
            "worker_id": f"WRK-{claim.worker_id:04d}",
            "worker_name": worker_name or "Unknown",
            "city": city or "",
            "geo_zone_id": geo_zone_id or "",
            "fraud_score": float(fraud_risk_score or 0.0),
            "fraud_flag": bool(claim.fraud_flag),
            "fraud_reason": f"{claim.trigger_type or 'Unknown trigger'} — flagged",
            "status": (
                "Confirmed" if claim.payout_status == "rejected"
                else "Under Review" if claim.payout_status in ("pending", "held", None)
                else "Cleared"
            ),
            "payout_amount": float(claim.payout_amount or 0),
            "payout_status": claim.payout_status,
            "trigger_type": claim.trigger_type,
            "claim_timestamp": str(claim.claim_timestamp) if claim.claim_timestamp else None,
        })

    total = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True
    ).scalar() or 0

    return {
        "success": True,
        "message": "Fraud cases fetched",
        "data": cases,
        "total": total
    }


@router.get("/summary")
def get_fraud_summary_endpoint(db: Session = Depends(get_db)):
    """Fraud stats summary for the admin fraud page."""
    total = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True
    ).scalar() or 0

    confirmed = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True,
        PolicyClaims.payout_status == "rejected"
    ).scalar() or 0

    under_review = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True,
        PolicyClaims.payout_status.in_(["pending", "held"])
    ).scalar() or 0

    cleared = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True,
        PolicyClaims.payout_status == "paid"
    ).scalar() or 0

    all_claims = db.query(func.count(PolicyClaims.claim_id)).scalar() or 0
    fraud_rate = round((total / all_claims), 4) if all_claims else 0

    return {
        "success": True,
        "message": "Fraud summary",
        "data": {
            "total_flagged": total,
            "confirmed_fraud": confirmed,
            "under_review": under_review,
            "cleared": cleared,
            "fraud_rate": fraud_rate,
            "total_claims": all_claims,
        }
    }