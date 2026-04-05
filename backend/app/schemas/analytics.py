from pydantic import BaseModel


class LossRatioResponse(BaseModel):
    total_premium: float
    total_claims: float
    loss_ratio: float


class PremiumVsClaimsResponse(BaseModel):
    premium_collected: float
    claims_paid: float


class ZoneRiskResponse(BaseModel):
    geo_zone_id: str
    total_claims: int
    avg_income_loss: float


class FraudSummaryResponse(BaseModel):
    total_claims: int
    fraud_cases: int
    fraud_rate: float