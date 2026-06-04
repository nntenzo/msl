import json
import logging
from typing import List, Optional

from datetime import datetime, date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.pig_prices import Pig_pricesService

# Set up logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/entities/pig_prices", tags=["pig_prices"])


# ---------- Pydantic Schemas ----------
class Pig_pricesData(BaseModel):
    """Entity data schema (for create/update)"""
    price_type: str
    price_per_kg: float
    price_per_head: float = None
    is_active: bool
    notes_en: str = None
    notes_my: str = None
    notes_zh: str = None


class Pig_pricesUpdateData(BaseModel):
    """Update entity data (partial updates allowed)"""
    price_type: Optional[str] = None
    price_per_kg: Optional[float] = None
    price_per_head: Optional[float] = None
    is_active: Optional[bool] = None
    notes_en: Optional[str] = None
    notes_my: Optional[str] = None
    notes_zh: Optional[str] = None


class Pig_pricesResponse(BaseModel):
    """Entity response schema"""
    id: int
    price_type: str
    price_per_kg: float
    price_per_head: Optional[float] = None
    is_active: bool
    notes_en: Optional[str] = None
    notes_my: Optional[str] = None
    notes_zh: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Pig_pricesListResponse(BaseModel):
    """List response schema"""
    items: List[Pig_pricesResponse]
    total: int
    skip: int
    limit: int


class Pig_pricesBatchCreateRequest(BaseModel):
    """Batch create request"""
    items: List[Pig_pricesData]


class Pig_pricesBatchUpdateItem(BaseModel):
    """Batch update item"""
    id: int
    updates: Pig_pricesUpdateData


class Pig_pricesBatchUpdateRequest(BaseModel):
    """Batch update request"""
    items: List[Pig_pricesBatchUpdateItem]


class Pig_pricesBatchDeleteRequest(BaseModel):
    """Batch delete request"""
    ids: List[int]


# ---------- Routes ----------
@router.get("", response_model=Pig_pricesListResponse)
async def query_pig_pricess(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Query pig_pricess with filtering, sorting, and pagination"""
    logger.debug(f"Querying pig_pricess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")
    
    service = Pig_pricesService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")
        
        result = await service.get_list(
            skip=skip, 
            limit=limit,
            query_dict=query_dict,
            sort=sort,
        )
        logger.debug(f"Found {result['total']} pig_pricess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying pig_pricess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/all", response_model=Pig_pricesListResponse)
async def query_pig_pricess_all(
    query: str = Query(None, description="Query conditions (JSON string)"),
    sort: str = Query(None, description="Sort field (prefix with '-' for descending)"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(20, ge=1, le=2000, description="Max number of records to return"),
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    # Query pig_pricess with filtering, sorting, and pagination without user limitation
    logger.debug(f"Querying pig_pricess: query={query}, sort={sort}, skip={skip}, limit={limit}, fields={fields}")

    service = Pig_pricesService(db)
    try:
        # Parse query JSON if provided
        query_dict = None
        if query:
            try:
                query_dict = json.loads(query)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid query JSON format")

        result = await service.get_list(
            skip=skip,
            limit=limit,
            query_dict=query_dict,
            sort=sort
        )
        logger.debug(f"Found {result['total']} pig_pricess")
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error querying pig_pricess: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/{id}", response_model=Pig_pricesResponse)
async def get_pig_prices(
    id: int,
    fields: str = Query(None, description="Comma-separated list of fields to return"),
    db: AsyncSession = Depends(get_db),
):
    """Get a single pig_prices by ID"""
    logger.debug(f"Fetching pig_prices with id: {id}, fields={fields}")
    
    service = Pig_pricesService(db)
    try:
        result = await service.get_by_id(id)
        if not result:
            logger.warning(f"Pig_prices with id {id} not found")
            raise HTTPException(status_code=404, detail="Pig_prices not found")
        
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching pig_prices {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("", response_model=Pig_pricesResponse, status_code=201)
async def create_pig_prices(
    data: Pig_pricesData,
    db: AsyncSession = Depends(get_db),
):
    """Create a new pig_prices"""
    logger.debug(f"Creating new pig_prices with data: {data}")
    
    service = Pig_pricesService(db)
    try:
        result = await service.create(data.model_dump())
        if not result:
            raise HTTPException(status_code=400, detail="Failed to create pig_prices")
        
        logger.info(f"Pig_prices created successfully with id: {result.id}")
        return result
    except ValueError as e:
        logger.error(f"Validation error creating pig_prices: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error creating pig_prices: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.post("/batch", response_model=List[Pig_pricesResponse], status_code=201)
async def create_pig_pricess_batch(
    request: Pig_pricesBatchCreateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create multiple pig_pricess in a single request"""
    logger.debug(f"Batch creating {len(request.items)} pig_pricess")
    
    service = Pig_pricesService(db)
    results = []
    
    try:
        for item_data in request.items:
            result = await service.create(item_data.model_dump())
            if result:
                results.append(result)
        
        logger.info(f"Batch created {len(results)} pig_pricess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch create: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch create failed: {str(e)}")


@router.put("/batch", response_model=List[Pig_pricesResponse])
async def update_pig_pricess_batch(
    request: Pig_pricesBatchUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update multiple pig_pricess in a single request"""
    logger.debug(f"Batch updating {len(request.items)} pig_pricess")
    
    service = Pig_pricesService(db)
    results = []
    
    try:
        for item in request.items:
            # Only include non-None values for partial updates
            update_dict = {k: v for k, v in item.updates.model_dump().items() if v is not None}
            result = await service.update(item.id, update_dict)
            if result:
                results.append(result)
        
        logger.info(f"Batch updated {len(results)} pig_pricess successfully")
        return results
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch update: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch update failed: {str(e)}")


@router.put("/{id}", response_model=Pig_pricesResponse)
async def update_pig_prices(
    id: int,
    data: Pig_pricesUpdateData,
    db: AsyncSession = Depends(get_db),
):
    """Update an existing pig_prices"""
    logger.debug(f"Updating pig_prices {id} with data: {data}")

    service = Pig_pricesService(db)
    try:
        # Only include non-None values for partial updates
        update_dict = {k: v for k, v in data.model_dump().items() if v is not None}
        result = await service.update(id, update_dict)
        if not result:
            logger.warning(f"Pig_prices with id {id} not found for update")
            raise HTTPException(status_code=404, detail="Pig_prices not found")
        
        logger.info(f"Pig_prices {id} updated successfully")
        return result
    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"Validation error updating pig_prices {id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating pig_prices {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.delete("/batch")
async def delete_pig_pricess_batch(
    request: Pig_pricesBatchDeleteRequest,
    db: AsyncSession = Depends(get_db),
):
    """Delete multiple pig_pricess by their IDs"""
    logger.debug(f"Batch deleting {len(request.ids)} pig_pricess")
    
    service = Pig_pricesService(db)
    deleted_count = 0
    
    try:
        for item_id in request.ids:
            success = await service.delete(item_id)
            if success:
                deleted_count += 1
        
        logger.info(f"Batch deleted {deleted_count} pig_pricess successfully")
        return {"message": f"Successfully deleted {deleted_count} pig_pricess", "deleted_count": deleted_count}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error in batch delete: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Batch delete failed: {str(e)}")


@router.delete("/{id}")
async def delete_pig_prices(
    id: int,
    db: AsyncSession = Depends(get_db),
):
    """Delete a single pig_prices by ID"""
    logger.debug(f"Deleting pig_prices with id: {id}")
    
    service = Pig_pricesService(db)
    try:
        success = await service.delete(id)
        if not success:
            logger.warning(f"Pig_prices with id {id} not found for deletion")
            raise HTTPException(status_code=404, detail="Pig_prices not found")
        
        logger.info(f"Pig_prices {id} deleted successfully")
        return {"message": "Pig_prices deleted successfully", "id": id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting pig_prices {id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")