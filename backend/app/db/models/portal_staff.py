from sqlalchemy import Boolean, Column, DateTime, Integer, String
from sqlalchemy.sql import func

from app.db.database import Base


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String)
    is_active = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())


class Manager(Base):
    __tablename__ = "managers"

    manager_id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String, nullable=False)
    phone = Column(String)
    assigned_zones = Column(String)
    is_active = Column(Boolean)
    created_at = Column(DateTime, server_default=func.now())


class OtpToken(Base):
    __tablename__ = "otp_tokens"

    otp_id = Column(Integer, primary_key=True)
    phone_number = Column(String(20), nullable=False)
    otp_code = Column(String(6), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    expires_at = Column(DateTime)
    is_used = Column(Boolean, default=False)
