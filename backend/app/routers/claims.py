from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.db.database import get_db
from app.schemas.common import APIResponse
from app.schemas.claim import ClaimResponse, ClaimAuditResponse
from app.services.claim_service import (
    get_worker_claims,
    get_claim_audit,
    release_claim,
    reject_claim
)

router = APIRouter(prefix="/api/v1/claims", tags=["Claims"])


class RejectBody(BaseModel):
    reason: str = "Admin decision"


# 🔥 WORKER CLAIMS
@router.get("/{worker_id}", response_model=APIResponse[List[ClaimResponse]])
def get_claims(worker_id: int, db: Session = Depends(get_db)):
    claims = get_worker_claims(worker_id, db)
    return {
        "success": True,
        "message": "Claims fetched",
        "data": claims
    }


# 🔥 CLAIM AUDIT
@router.get("/{claim_id}/audit", response_model=APIResponse[ClaimAuditResponse])
def claim_audit(claim_id: int, db: Session = Depends(get_db)):
    audit = get_claim_audit(claim_id, db)
    return {
        "success": True,
        "message": "Audit fetched",
        "data": audit
    }


# 🔥 RELEASE CLAIM
@router.patch("/{claim_id}/release", response_model=APIResponse[ClaimResponse])
def release(claim_id: int, db: Session = Depends(get_db)):
    claim = release_claim(claim_id, db)
    return {
        "success": True,
        "message": "Claim released",
        "data": claim
    }


# 🔥 REJECT CLAIM — accepts reason as JSON body
@router.patch("/{claim_id}/reject", response_model=APIResponse[ClaimResponse])
def reject(claim_id: int, body: RejectBody, db: Session = Depends(get_db)):
    claim = reject_claim(claim_id, body.reason, db)
    return {
        "success": True,
        "message": "Claim rejected",
        "data": claim
    }