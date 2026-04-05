from fastapi import APIRouter
from app.services.ml_service import run_fraud_pipeline

router = APIRouter(prefix="/api/v1/ml", tags=["ML"])

@router.post("/fraud-check")
def fraud_check(data: dict):
    result = run_fraud_pipeline(data)

    return {
        "success": True,
        "message": "Fraud analysis complete",
        "data": result
    }