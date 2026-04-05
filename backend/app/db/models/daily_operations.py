from sqlalchemy import Column, Integer, Float, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class DailyOperations(Base):
    __tablename__ = "daily_operations"

    log_id = Column(Integer, primary_key=True)

    # ✅ FIXED
    worker_id = Column(Integer, ForeignKey("workers.worker_id"))
    worker = relationship("Worker", back_populates="operations")

    date = Column(Date)
    day_of_week = Column(Integer)
    hour_of_day = Column(Integer)
    peak_hour_flag = Column(Boolean)
    weekend_flag = Column(Boolean)
    orders_per_day = Column(Integer)
    orders_per_hour = Column(Float)
    delivery_distance_km = Column(Float)
    earnings_per_order = Column(Float)
    base_pay = Column(Float)
    surge_multiplier = Column(Float)
    incentive_bonus = Column(Float)
    tip_amount = Column(Float)
    expected_income = Column(Float)
    actual_income = Column(Float)
    daily_income = Column(Float)
    income_loss = Column(Float)
    rainfall = Column(Float)
    rainfall_category = Column(String)
    temperature = Column(Float)
    aqi = Column(Integer)
    aqi_category = Column(String)
    traffic_index = Column(Float)
    composite_score = Column(Float)
    disruption_flag = Column(Boolean)