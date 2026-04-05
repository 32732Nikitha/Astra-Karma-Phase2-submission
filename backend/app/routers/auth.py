from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.schemas.auth import RefreshResponse, TokenResponse
from app.schemas.common import APIResponse
from app.services.auth_service import (
    get_worker_for_phone,
    login_admin,
    logout,
    refresh_access_token,
    register_staff,
    send_otp,
    verify_otp,
)

router = APIRouter(prefix="/api/v1/auth", tags=["Auth"])


@router.post("/otp/send")
def send_otp_api(data: dict, db: Session = Depends(get_db)):
    phone = data.get("phone")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number required")
    result = send_otp(db, phone)
    return {"success": True, "message": "OTP sent", "data": result}


@router.post("/send-otp")
def send_otp_worker_alias(data: dict, db: Session = Depends(get_db)):
    phone = data.get("phone")
    if not phone:
        raise HTTPException(status_code=400, detail="Phone number required")
    result = send_otp(db, phone)
    return {"success": True, "message": "OTP sent", "data": result}


@router.post("/otp/verify", response_model=APIResponse[TokenResponse])
def verify_otp_api(data: dict, db: Session = Depends(get_db)):
    tokens = verify_otp(db, data.get("phone"), data.get("otp"))
    if not tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    return {
        "success": True,
        "message": "Login successful",
        "data": tokens,
    }


@router.post("/verify-otp")
def verify_otp_worker_flat(data: dict, db: Session = Depends(get_db)):
    phone = data.get("phone")
    otp = data.get("otp")
    if not phone or not otp:
        raise HTTPException(status_code=400, detail="phone and otp required")
    tokens = verify_otp(db, phone, otp)
    if not tokens:
        raise HTTPException(status_code=401, detail="Invalid or expired OTP")
    worker = get_worker_for_phone(db, phone)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {
        "user": {
            "worker_id": worker.worker_id,
            "name": worker.worker_name or "Worker",
            "onboarding_complete": True,
            "platform": worker.platform,
            "city": worker.city,
        },
        "access_token": tokens["access_token"],
        "refresh_token": tokens["refresh_token"],
    }


@router.post("/admin/login")
def admin_login(data: dict, db: Session = Depends(get_db)):
    email = data.get("email", "")
    password = data.get("password", "")
    result = login_admin(db, email, password)
    if not result:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        "success": True,
        "message": "Login successful",
        "data": result,
    }


@router.post("/register")
def register_portal_user(data: dict, db: Session = Depends(get_db)):
    ok, msg = register_staff(
        db,
        data.get("email", ""),
        data.get("password", ""),
        data.get("name", ""),
        data.get("role", ""),
    )
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg}


@router.get("/worker-by-phone/{phone:path}")
def get_worker_by_phone(phone: str, db: Session = Depends(get_db)):
    worker = get_worker_for_phone(db, phone)
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return {
        "success": True,
        "message": "Worker found",
        "data": {
            "worker_id": worker.worker_id,
            "worker_name": worker.worker_name,
            "platform": worker.platform,
            "city": worker.city,
            "kyc_verified": worker.kyc_verified,
        },
    }


@router.post("/refresh", response_model=APIResponse[RefreshResponse])
def refresh_api(data: dict):
    token = refresh_access_token(data.get("refresh_token", ""))
    if not token:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    return {
        "success": True,
        "message": "Token refreshed",
        "data": {"access_token": token},
    }


@router.post("/logout")
def logout_api(data: dict):
    logout(data.get("refresh_token", ""))
    return {"success": True, "message": "Logged out"}
