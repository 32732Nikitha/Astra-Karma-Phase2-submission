from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas.common import APIResponse
from app.schemas.policy import PolicyResponse
from app.services.policy_service import (
    create_policy,
    get_active_policy,
    get_worker_policies,
    renew_policy,
    upgrade_policy,
    cancel_policy
)

router = APIRouter(prefix="/api/v1/policies", tags=["Policies"])


# 🔥 CREATE
@router.post("/", response_model=APIResponse[PolicyResponse])
def create_policy_api(worker_id: int, data: dict, db: Session = Depends(get_db)):
    policy = create_policy(worker_id, data, db)

    return {
        "success": True,
        "message": "Policy created",
        "data": policy
    }


# 🔥 ACTIVE POLICY
@router.get("/active/{worker_id}", response_model=APIResponse[PolicyResponse])
def get_active(worker_id: int, db: Session = Depends(get_db)):
    policy = get_active_policy(worker_id, db)

    return {
        "success": True,
        "message": "Active policy fetched",
        "data": policy
    }


# 🔥 ALL POLICIES (YES — NOW WITH response_model)
@router.get("/{worker_id}", response_model=APIResponse[List[PolicyResponse]])
def get_worker_policy(worker_id: int, db: Session = Depends(get_db)):
    policies = get_worker_policies(worker_id, db)

    return {
        "success": True,
        "message": "Policies fetched",
        "data": policies
    }


# 🔥 RENEW
@router.post("/renew/{policy_id}", response_model=APIResponse[PolicyResponse])
def renew(policy_id: int, db: Session = Depends(get_db)):
    policy = renew_policy(policy_id, db)

    return {
        "success": True,
        "message": "Policy renewed",
        "data": policy
    }


# 🔥 UPGRADE
@router.post("/upgrade/{policy_id}", response_model=APIResponse[PolicyResponse])
def upgrade(policy_id: int, new_tier: str, db: Session = Depends(get_db)):
    policy = upgrade_policy(policy_id, new_tier, db)

    return {
        "success": True,
        "message": "Policy upgraded",
        "data": policy
    }


# 🔥 CANCEL
@router.delete("/cancel/{policy_id}", response_model=APIResponse[PolicyResponse])
def cancel(policy_id: int, db: Session = Depends(get_db)):
    policy = cancel_policy(policy_id, db)

    return {
        "success": True,
        "message": "Policy cancelled",
        "data": policy
    }