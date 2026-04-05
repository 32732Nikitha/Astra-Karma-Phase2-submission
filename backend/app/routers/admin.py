from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.db.database import get_db
from app.db.models.worker import Worker
from app.db.models.policy_claims import PolicyClaims
from app.db.models.daily_operations import DailyOperations

router = APIRouter(prefix="/api/v1/admin", tags=["Admin"])


@router.get("/workers")
def get_all_workers(
    search: Optional[str] = None,
    platform: Optional[str] = None,
    city: Optional[str] = None,
    worker_id: Optional[int] = Query(None),
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Returns all workers with their latest policy info and fraud_risk_score.
    Supports search by name/worker_id, filter by platform/city.
    """
    query = db.query(Worker)

    if search:
        query = query.filter(
            Worker.worker_name.ilike(f"%{search}%")
        )
    if platform:
        query = query.filter(Worker.platform == platform)
    if city:
        query = query.filter(Worker.city.ilike(f"%{city}%"))
    if worker_id:
        query = query.filter(Worker.worker_id == worker_id)

    total = query.count()
    workers = query.offset(offset).limit(limit).all()

    result = []
    for w in workers:
        # Get latest policy
        policy = db.query(PolicyClaims).filter(
            PolicyClaims.worker_id == w.worker_id
        ).order_by(PolicyClaims.activation_date.desc()).first()

        # Get latest daily op (for disruption info)
        latest_op = db.query(DailyOperations).filter(
            DailyOperations.worker_id == w.worker_id
        ).order_by(DailyOperations.date.desc()).first()

        fraud_score = float(w.fraud_risk_score or 0.0)
        result.append({
            "worker_id": f"WRK-{w.worker_id:04d}",
            "worker_id_int": w.worker_id,
            "name": w.worker_name or "Unknown",
            "city": w.city or "",
            "geo_zone_id": w.geo_zone_id or "",
            "platform": w.platform or "",
            "vehicle_type": w.vehicle_type or "2W",
            "plan_tier": policy.plan_tier if policy else "Basic",
            "status": "Active" if (policy and policy.policy_status == "active") else "Inactive",
            "trigger": latest_op.rainfall_category if latest_op else "None",
            "risk": "high" if fraud_score > 0.6 else "medium" if fraud_score > 0.3 else "low",
            "fraud_risk_score": round(fraud_score, 4),
            "kyc_verified": bool(w.kyc_verified),
            "bank_verified": bool(w.bank_verified),
            "device_id": w.device_id or "N/A",
            "upi_id": w.upi_id or "",
            "employment_type": w.employment_type or "",
            "experience_level": float(w.experience_level or 0),
            "shift_hours": float(w.shift_hours or 0),
            "payment_verified_status": w.payment_verified_status or "pending",
        })

    return {
        "success": True,
        "message": "Workers fetched",
        "data": result,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/claims")
def get_all_claims(
    status: Optional[str] = None,
    fraud_only: bool = False,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db),
):
    """
    Returns all claims joined with worker name/city.
    Supports filter by payout_status and fraud_only flag.
    """
    query = db.query(
        PolicyClaims, Worker.worker_name, Worker.city, Worker.geo_zone_id,
        Worker.fraud_risk_score
    ).join(
        Worker, PolicyClaims.worker_id == Worker.worker_id, isouter=True
    )

    if status:
        query = query.filter(PolicyClaims.payout_status == status)
    if fraud_only:
        query = query.filter(PolicyClaims.fraud_flag == True)

    total = query.count()
    rows = query.order_by(PolicyClaims.claim_timestamp.desc()).offset(offset).limit(limit).all()

    claims = []
    for claim, worker_name, city, geo_zone_id, fraud_risk_score in rows:
        claims.append({
            "claim_id": f"CLM-{claim.claim_id:04d}",
            "claim_id_int": claim.claim_id,
            "worker_id": f"WRK-{claim.worker_id:04d}",
            "worker_id_int": claim.worker_id,
            "worker_name": worker_name or "Unknown",
            "city": city or "",
            "geo_zone_id": geo_zone_id or "",
            "trigger_type": claim.trigger_type or "Unknown",
            "trigger_level": claim.trigger_level or "",
            "trigger_value": float(claim.trigger_value or 0),
            "payout_amount": float(claim.payout_amount or 0),
            "payout_status": claim.payout_status or "pending",
            "fraud_flag": bool(claim.fraud_flag),
            "fraud_score": float(fraud_risk_score or 0.0),
            "plan_tier": claim.plan_tier or "Basic",
            "weekly_premium": float(claim.weekly_premium or 0),
            "events_used": claim.events_used or 0,
            "events_remaining": claim.events_remaining or 0,
            "claim_timestamp": str(claim.claim_timestamp) if claim.claim_timestamp else None,
            "payout_timestamp": str(claim.payout_timestamp) if claim.payout_timestamp else None,
            "activation_date": str(claim.activation_date) if claim.activation_date else None,
            "policy_status": claim.policy_status or "unknown",
        })

    return {
        "success": True,
        "message": "Claims fetched",
        "data": claims,
        "total": total,
        "limit": limit,
        "offset": offset,
    }


@router.get("/stats")
def get_admin_stats(db: Session = Depends(get_db)):
    """High-level platform stats for the admin overview."""
    total_workers = db.query(func.count(Worker.worker_id)).scalar() or 0
    active_policies = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.policy_status == "active"
    ).scalar() or 0
    total_claims = db.query(func.count(PolicyClaims.claim_id)).scalar() or 0
    fraud_cases = db.query(func.count(PolicyClaims.claim_id)).filter(
        PolicyClaims.fraud_flag == True
    ).scalar() or 0
    total_premium = db.query(func.sum(PolicyClaims.weekly_premium)).scalar() or 0
    total_payout = db.query(func.sum(PolicyClaims.payout_amount)).filter(
        PolicyClaims.payout_status == "paid"
    ).scalar() or 0
    kyc_verified = db.query(func.count(Worker.worker_id)).filter(
        Worker.kyc_verified == True
    ).scalar() or 0
    high_risk = db.query(func.count(Worker.worker_id)).filter(
        Worker.fraud_risk_score > 0.6
    ).scalar() or 0

    loss_ratio = round((float(total_payout) / float(total_premium)), 4) if total_premium else 0

    return {
        "success": True,
        "message": "Admin stats",
        "data": {
            "total_workers": total_workers,
            "active_policies": active_policies,
            "total_claims": total_claims,
            "fraud_cases": fraud_cases,
            "total_premium": float(total_premium),
            "total_payout": float(total_payout),
            "kyc_verified": kyc_verified,
            "high_risk_workers": high_risk,
            "loss_ratio": loss_ratio,
        }
    }
