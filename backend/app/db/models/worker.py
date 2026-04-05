from sqlalchemy import Column, Integer, String, Float, Boolean
from app.db.database import Base
from sqlalchemy.orm import relationship

class Worker(Base):
    __tablename__ = "workers"

    worker_id = Column(Integer, primary_key=True)

    # relationships
    operations = relationship("DailyOperations", back_populates="worker")
    claims = relationship("PolicyClaims", back_populates="worker")

    worker_name = Column(String)
    platform = Column(String)
    city = Column(String)
    geo_zone_id = Column(String)
    vehicle_type = Column(String)
    shift_hours = Column(Float)
    experience_level = Column(Float)
    employment_type = Column(String)
    upi_id = Column(String)
    phone_number = Column(String)
    bank_ifsc = Column(String)
    device_id = Column(String)
    kyc_verified = Column(Boolean)
    bank_verified = Column(Boolean)
    fraud_risk_score = Column(Float)
    payment_verified_status = Column(String)