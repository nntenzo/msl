import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.knowledge_articles import Knowledge_articles

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Knowledge_articlesService:
    """Service layer for Knowledge_articles operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Knowledge_articles]:
        """Create a new knowledge_articles"""
        try:
            obj = Knowledge_articles(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created knowledge_articles with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating knowledge_articles: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Knowledge_articles]:
        """Get knowledge_articles by ID"""
        try:
            query = select(Knowledge_articles).where(Knowledge_articles.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching knowledge_articles {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of knowledge_articless"""
        try:
            query = select(Knowledge_articles)
            count_query = select(func.count(Knowledge_articles.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Knowledge_articles, field):
                        query = query.where(getattr(Knowledge_articles, field) == value)
                        count_query = count_query.where(getattr(Knowledge_articles, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Knowledge_articles, field_name):
                        query = query.order_by(getattr(Knowledge_articles, field_name).desc())
                else:
                    if hasattr(Knowledge_articles, sort):
                        query = query.order_by(getattr(Knowledge_articles, sort))
            else:
                query = query.order_by(Knowledge_articles.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching knowledge_articles list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Knowledge_articles]:
        """Update knowledge_articles"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Knowledge_articles {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated knowledge_articles {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating knowledge_articles {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete knowledge_articles"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Knowledge_articles {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted knowledge_articles {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting knowledge_articles {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Knowledge_articles]:
        """Get knowledge_articles by any field"""
        try:
            if not hasattr(Knowledge_articles, field_name):
                raise ValueError(f"Field {field_name} does not exist on Knowledge_articles")
            result = await self.db.execute(
                select(Knowledge_articles).where(getattr(Knowledge_articles, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching knowledge_articles by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Knowledge_articles]:
        """Get list of knowledge_articless filtered by field"""
        try:
            if not hasattr(Knowledge_articles, field_name):
                raise ValueError(f"Field {field_name} does not exist on Knowledge_articles")
            result = await self.db.execute(
                select(Knowledge_articles)
                .where(getattr(Knowledge_articles, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Knowledge_articles.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching knowledge_articless by {field_name}: {str(e)}")
            raise