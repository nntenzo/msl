from core.database import Base
from datetime import datetime
from sqlalchemy import Boolean, Column, DateTime, Integer, String


class Knowledge_articles(Base):
    __tablename__ = "knowledge_articles"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    slug = Column(String, nullable=False)
    title_en = Column(String, nullable=False)
    title_my = Column(String, nullable=True)
    title_zh = Column(String, nullable=True)
    content_en = Column(String, nullable=True)
    content_my = Column(String, nullable=True)
    content_zh = Column(String, nullable=True)
    category = Column(String, nullable=True)
    thumbnail_url = Column(String, nullable=True)
    is_published = Column(Boolean, nullable=False)
    sort_order = Column(Integer, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.now)
    updated_at = Column(DateTime(timezone=True), default=datetime.now, onupdate=datetime.now)