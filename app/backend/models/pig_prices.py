from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Float, Integer, String


class Pig_prices(Base):
    __tablename__ = "pig_prices"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    price_type = Column(String, nullable=False)
    price_per_kg = Column(Float, nullable=False)
    price_per_head = Column(Float, nullable=True)
    is_active = Column(Boolean, nullable=False)
    notes_en = Column(String, nullable=True)
    notes_my = Column(String, nullable=True)
    notes_zh = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)