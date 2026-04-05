from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.common import APIResponse
from app.schemas.analytics import (
    LossRatioResponse,
    PremiumVsClaimsResponse,
    ZoneRiskResponse,
    FraudSummaryResponse
)
from app.services.analytics_service import (
    get_loss_ratio,
    get_premium_vs_claims,
    get_zone_risk,
    get_fraud_summary
)

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])


# 🔥 LOSS RATIO
@router.get("/loss-ratio", response_model=APIResponse[LossRatioResponse])
def loss_ratio(db: Session = Depends(get_db)):
    data = get_loss_ratio(db)

    return {
        "success": True,
        "message": "Loss ratio computed",
        "data": data
    }


# 🔥 PREMIUM VS CLAIMS
@router.get("/premium-vs-claims", response_model=APIResponse[PremiumVsClaimsResponse])
def premium_vs_claims(db: Session = Depends(get_db)):
    data = get_premium_vs_claims(db)

    return {
        "success": True,
        "message": "Premium vs claims",
        "data": data
    }


# 🔥 ZONE RISK
@router.get("/zone-risk", response_model=APIResponse[List[ZoneRiskResponse]])
def zone_risk(db: Session = Depends(get_db)):
    data = get_zone_risk(db)

    return {
        "success": True,
        "message": "Zone risk analytics",
        "data": data
    }


# 🔥 FRAUD SUMMARY
@router.get("/fraud-summary", response_model=APIResponse[FraudSummaryResponse])
def fraud_summary(db: Session = Depends(get_db)):
    data = get_fraud_summary(db)

    return {
        "success": True,
        "message": "Fraud summary",
        "data": data
    }