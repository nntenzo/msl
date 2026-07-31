import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from services.contact import ContactService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/contact", tags=["contact"])


class ContactMessageRequest(BaseModel):
    """Contact form submission schema"""
    name: str
    email: str
    message: str


class ContactMessageResponse(BaseModel):
    """Contact form response schema"""
    success: bool
    message: str
    email_sent: bool
    recipient: str


@router.post("/send", response_model=ContactMessageResponse)
async def send_contact_message(
    data: ContactMessageRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    Receive a contact form submission and send it to office@msl.com.mm.
    The message is stored in the database and an email notification is attempted.
    """
    try:
        service = ContactService(db)
        result = await service.send_contact_message(data.model_dump())
        return ContactMessageResponse(**result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing contact message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process your message. Please try again.")