import random
import re
from datetime import datetime, timedelta
from typing import Any, Optional

import bcrypt
import jwt
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.models.portal_staff import Admin, Manager, OtpToken
from app.db.models.worker import Worker

SECRET_KEY = "SUPER_SECRET_KEY"
ALGORITHM = "HS256"

refresh_tokens: dict[str, dict[str, Any]] = {}


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(
            plain.encode("utf-8"),
            password_hash.encode("utf-8"),
        )
    except Exception:
        return False


def normalize_phone_digits(phone: str) -> str:
    digits = re.sub(r"\D", "", phone or "")
    if len(digits) >= 10:
        return digits[-10:]
    return digits


def find_worker_by_phone(db: Session, phone: str) -> Optional[Worker]:
    """Match workers.phone_number whether stored as 10 digits, +91…, or full string."""
    ten = normalize_phone_digits(phone)
    if not ten:
        return None
    variants = {ten, f"+91{ten}", f"91{ten}"}
    raw = (phone or "").strip()
    if raw:
        variants.add(raw)
    conds = [Worker.phone_number == v for v in variants if v]
    if not conds:
        return None
    return db.query(Worker).filter(or_(*conds)).first()


def send_otp(db: Session, phone: str) -> dict:
    otp = f"{random.randint(100000, 999999)}"
    expires_at = datetime.utcnow() + timedelta(minutes=5)
    db.query(OtpToken).filter(
        OtpToken.phone_number == phone,
        OtpToken.is_used.is_(False),
    ).update({OtpToken.is_used: True}, synchronize_session=False)
    row = OtpToken(
        phone_number=phone,
        otp_code=otp,
        expires_at=expires_at,
        is_used=False,
    )
    db.add(row)
    db.commit()
    return {"message": "OTP sent", "otp": otp}


def _issue_worker_tokens(phone: str, worker: Worker) -> dict:
    """Build JWT pair for a verified worker (phone must match worker)."""
    sub = phone
    payload = {
        "sub": sub,
        "role": "worker",
        "worker_id": worker.worker_id,
        "exp": datetime.utcnow() + timedelta(hours=2),
    }
    access = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    refresh = jwt.encode(
        {
            "sub": sub,
            "type": "refresh",
            "role": "worker",
            "exp": datetime.utcnow() + timedelta(days=7),
        },
        SECRET_KEY,
        algorithm=ALGORITHM,
    )
    refresh_tokens[refresh] = {"sub": sub, "role": "worker"}
    return {
        "access_token": access,
        "refresh_token": refresh,
        "role": "worker",
        "worker_id": worker.worker_id,
    }


def verify_otp(db: Session, phone: str, otp: str) -> Optional[dict]:
    worker = find_worker_by_phone(db, phone)
    if not worker:
        return None

    # Dev bypass: any registered worker phone + OTP 123456 (no DB OTP row required)
    if (otp or "").strip() == "123456":
        return _issue_worker_tokens(phone, worker)

    now = datetime.utcnow()
    row = (
        db.query(OtpToken)
        .filter(
            OtpToken.phone_number == phone,
            OtpToken.otp_code == otp,
            OtpToken.is_used.is_(False),
        )
        .order_by(OtpToken.created_at.desc())
        .first()
    )
    if not row:
        return None
    if row.expires_at and row.expires_at < now:
        return None

    row.is_used = True
    db.commit()

    return _issue_worker_tokens(phone, worker)


def login_admin(db: Session, email: str, password: str) -> Optional[dict]:
    email_norm = (email or "").strip().lower()
    if not email_norm:
        return None

    admin = db.query(Admin).filter(Admin.email == email_norm).first()
    if admin and admin.is_active is False:
        admin = None
    if admin and verify_password(password, admin.password_hash):
        jwt_role = "admin"
        name = admin.name or "Admin"
        payload = {
            "sub": email_norm,
            "role": jwt_role,
            "name": name,
            "exp": datetime.utcnow() + timedelta(hours=8),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        refresh = jwt.encode(
            {
                "sub": email_norm,
                "role": jwt_role,
                "type": "refresh",
                "exp": datetime.utcnow() + timedelta(days=7),
            },
            SECRET_KEY,
            algorithm=ALGORITHM,
        )
        refresh_tokens[refresh] = {"sub": email_norm, "role": jwt_role}
        return {
            "access_token": token,
            "refresh_token": refresh,
            "role": jwt_role,
            "name": name,
            "email": email_norm,
        }

    manager = db.query(Manager).filter(Manager.email == email_norm).first()
    if manager and manager.is_active is False:
        manager = None
    if manager and verify_password(password, manager.password_hash):
        name = manager.name or "Manager"
        payload = {
            "sub": email_norm,
            "role": "manager",
            "name": name,
            "exp": datetime.utcnow() + timedelta(hours=8),
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        refresh = jwt.encode(
            {
                "sub": email_norm,
                "role": "manager",
                "type": "refresh",
                "exp": datetime.utcnow() + timedelta(days=7),
            },
            SECRET_KEY,
            algorithm=ALGORITHM,
        )
        refresh_tokens[refresh] = {"sub": email_norm, "role": "manager"}
        return {
            "access_token": token,
            "refresh_token": refresh,
            "role": "manager",
            "name": name,
            "email": email_norm,
        }

    return None


def register_staff(
    db: Session, email: str, password: str, name: str, role: str
) -> tuple[bool, str]:
    email_norm = (email or "").strip().lower()
    role_norm = (role or "").strip().lower()
    if role_norm not in ("admin", "manager"):
        return False, "role must be admin or manager"
    if not email_norm or not password or not (name or "").strip():
        return False, "email, password, and name are required"
    if len(password) < 6:
        return False, "password must be at least 6 characters"

    if role_norm == "admin":
        if db.query(Admin).filter(Admin.email == email_norm).first():
            return False, "email already registered"
        db.add(
            Admin(
                email=email_norm,
                password_hash=hash_password(password),
                name=name.strip(),
                role="admin",
                is_active=True,
            )
        )
    else:
        if db.query(Manager).filter(Manager.email == email_norm).first():
            return False, "email already registered"
        db.add(
            Manager(
                email=email_norm,
                password_hash=hash_password(password),
                name=name.strip(),
                is_active=True,
            )
        )
    db.commit()
    return True, "registered"


def refresh_access_token(refresh_token: str) -> Optional[str]:
    record = refresh_tokens.get(refresh_token)
    if not record:
        return None

    payload = {
        "sub": record["sub"],
        "role": record["role"],
        "exp": datetime.utcnow() + timedelta(hours=2),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def logout(refresh_token: str):
    refresh_tokens.pop(refresh_token, None)


def get_worker_for_phone(db: Session, phone: str) -> Optional[Worker]:
    return find_worker_by_phone(db, phone)


def ensure_demo_staff_accounts(db: Session) -> None:
    """Idempotent demo accounts matching the landing page hints (admin@bhimaastra.in / manager@bhimaastra.in)."""
    demos: list[tuple[str, str, str, str]] = [
        ("admin@bhimaastra.in", "admin123", "Admin User", "admin"),
        ("manager@bhimaastra.in", "manager123", "Manager User", "manager"),
    ]
    for email, plain, name, kind in demos:
        if kind == "admin":
            if db.query(Admin).filter(Admin.email == email).first():
                continue
            db.add(
                Admin(
                    email=email,
                    password_hash=hash_password(plain),
                    name=name,
                    role="admin",
                    is_active=True,
                )
            )
        else:
            if db.query(Manager).filter(Manager.email == email).first():
                continue
            db.add(
                Manager(
                    email=email,
                    password_hash=hash_password(plain),
                    name=name,
                    is_active=True,
                )
            )
    db.commit()


DEMO_WORKER_PHONE_TEN = "9876543210"


def ensure_demo_worker_phone(db: Session) -> None:
    """Ensure a demo worker can sign in: mobile 9876543210, OTP 123456."""
    if find_worker_by_phone(db, DEMO_WORKER_PHONE_TEN):
        return
    blank = (
        db.query(Worker)
        .filter(
            or_(
                Worker.phone_number.is_(None),
                Worker.phone_number == "",
            )
        )
        .order_by(Worker.worker_id)
        .first()
    )
    if blank:
        blank.phone_number = DEMO_WORKER_PHONE_TEN
        db.commit()
        return
    if db.query(Worker).count() == 0:
        db.add(
            Worker(
                worker_name="Demo Worker",
                phone_number=DEMO_WORKER_PHONE_TEN,
                platform="Demo",
                city="Mumbai",
            )
        )
        db.commit()
