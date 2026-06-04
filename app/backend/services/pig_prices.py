import logging
from typing import Optional, Dict, Any, List

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.pig_prices import Pig_prices

logger = logging.getLogger(__name__)


# ------------------ Service Layer ------------------
class Pig_pricesService:
    """Service layer for Pig_prices operations"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create(self, data: Dict[str, Any]) -> Optional[Pig_prices]:
        """Create a new pig_prices"""
        try:
            obj = Pig_prices(**data)
            self.db.add(obj)
            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Created pig_prices with id: {obj.id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error creating pig_prices: {str(e)}")
            raise

    async def get_by_id(self, obj_id: int) -> Optional[Pig_prices]:
        """Get pig_prices by ID"""
        try:
            query = select(Pig_prices).where(Pig_prices.id == obj_id)
            result = await self.db.execute(query)
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching pig_prices {obj_id}: {str(e)}")
            raise

    async def get_list(
        self, 
        skip: int = 0, 
        limit: int = 20, 
        query_dict: Optional[Dict[str, Any]] = None,
        sort: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Get paginated list of pig_pricess"""
        try:
            query = select(Pig_prices)
            count_query = select(func.count(Pig_prices.id))
            
            if query_dict:
                for field, value in query_dict.items():
                    if hasattr(Pig_prices, field):
                        query = query.where(getattr(Pig_prices, field) == value)
                        count_query = count_query.where(getattr(Pig_prices, field) == value)
            
            count_result = await self.db.execute(count_query)
            total = count_result.scalar()

            if sort:
                if sort.startswith('-'):
                    field_name = sort[1:]
                    if hasattr(Pig_prices, field_name):
                        query = query.order_by(getattr(Pig_prices, field_name).desc())
                else:
                    if hasattr(Pig_prices, sort):
                        query = query.order_by(getattr(Pig_prices, sort))
            else:
                query = query.order_by(Pig_prices.id.desc())

            result = await self.db.execute(query.offset(skip).limit(limit))
            items = result.scalars().all()

            return {
                "items": items,
                "total": total,
                "skip": skip,
                "limit": limit,
            }
        except Exception as e:
            logger.error(f"Error fetching pig_prices list: {str(e)}")
            raise

    async def update(self, obj_id: int, update_data: Dict[str, Any]) -> Optional[Pig_prices]:
        """Update pig_prices"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Pig_prices {obj_id} not found for update")
                return None
            for key, value in update_data.items():
                if hasattr(obj, key):
                    setattr(obj, key, value)

            await self.db.commit()
            await self.db.refresh(obj)
            logger.info(f"Updated pig_prices {obj_id}")
            return obj
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error updating pig_prices {obj_id}: {str(e)}")
            raise

    async def delete(self, obj_id: int) -> bool:
        """Delete pig_prices"""
        try:
            obj = await self.get_by_id(obj_id)
            if not obj:
                logger.warning(f"Pig_prices {obj_id} not found for deletion")
                return False
            await self.db.delete(obj)
            await self.db.commit()
            logger.info(f"Deleted pig_prices {obj_id}")
            return True
        except Exception as e:
            await self.db.rollback()
            logger.error(f"Error deleting pig_prices {obj_id}: {str(e)}")
            raise

    async def get_by_field(self, field_name: str, field_value: Any) -> Optional[Pig_prices]:
        """Get pig_prices by any field"""
        try:
            if not hasattr(Pig_prices, field_name):
                raise ValueError(f"Field {field_name} does not exist on Pig_prices")
            result = await self.db.execute(
                select(Pig_prices).where(getattr(Pig_prices, field_name) == field_value)
            )
            return result.scalar_one_or_none()
        except Exception as e:
            logger.error(f"Error fetching pig_prices by {field_name}: {str(e)}")
            raise

    async def list_by_field(
        self, field_name: str, field_value: Any, skip: int = 0, limit: int = 20
    ) -> List[Pig_prices]:
        """Get list of pig_pricess filtered by field"""
        try:
            if not hasattr(Pig_prices, field_name):
                raise ValueError(f"Field {field_name} does not exist on Pig_prices")
            result = await self.db.execute(
                select(Pig_prices)
                .where(getattr(Pig_prices, field_name) == field_value)
                .offset(skip)
                .limit(limit)
                .order_by(Pig_prices.id.desc())
            )
            return result.scalars().all()
        except Exception as e:
            logger.error(f"Error fetching pig_pricess by {field_name}: {str(e)}")
            raise