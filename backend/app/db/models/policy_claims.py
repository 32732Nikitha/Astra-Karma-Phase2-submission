from sqlalchemy import Column, Integer, Float, String, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class PolicyClaims(Base):
    __tablename__ = "policy_claims"

    claim_id = Column(Integer, primary_key=True)

    # ✅ FIXED
    worker_id = Column(Integer, ForeignKey("workers.worker_id"))
    worker = relationship("Worker", back_populates="claims")

    policy_id = Column(Integer)
    plan_tier = Column(String)
    weekly_premium = Column(Float)

    activation_date = Column(Date)
    last_active_date = Column(Date)

    policy_status = Column(String)
    eligibility_flag = Column(Boolean)

    events_used = Column(Integer)
    events_remaining = Column(Integer)

    trigger_type = Column(String)
    trigger_level = Column(String)
    trigger_value = Column(Float)

    claim_timestamp = Column(DateTime)
    payout_status = Column(String)
    payout_timestamp = Column(DateTime)

    payout_amount = Column(Float)
    fraud_flag = Column(Boolean)