from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Page_contents(Base):
    __tablename__ = "page_contents"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    page_key = Column(String, nullable=False)
    section_key = Column(String, nullable=False)
    content_en = Column(String, nullable=True)
    content_my = Column(String, nullable=True)
    content_zh = Column(String, nullable=True)
    image_url = Column(String, nullable=True)
    is_visible = Column(Boolean, nullable=True)
    sort_order = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)