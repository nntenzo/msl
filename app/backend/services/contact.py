import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Dict, Any, Optional

from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)

RECIPIENT_EMAIL = "office@msl.com.mm"


class ContactService:
    """Service layer for contact form submissions"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def send_contact_message(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process a contact form submission.
        Stores the message and attempts to send an email notification.
        """
        name = data.get("name", "")
        email = data.get("email", "")
        message = data.get("message", "")

        if not name or not email or not message:
            raise ValueError("Name, email, and message are required")

        # Build the email content
        subject = f"New Contact Form Message from {name}"
        body = f"""
New message received from the Myanmar Swine Livestock website contact form:

From: {name}
Email: {email}

Message:
{message}

---
This message was sent via the MSL website contact form.
"""

        # Store the message in site_settings as a contact submission record
        from models.site_settings import Site_settings
        import json
        from datetime import datetime

        contact_record = Site_settings(
            setting_key=f"contact_msg_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
            setting_value=json.dumps({
                "name": name,
                "email": email,
                "message": message,
                "submitted_at": datetime.utcnow().isoformat(),
            }),
            category="contact_messages",
        )
        self.db.add(contact_record)
        await self.db.commit()

        logger.info(f"Contact message stored from {name} ({email})")

        # Attempt to send email notification
        email_sent = await self._send_email_notification(subject, body, email)

        return {
            "success": True,
            "message": "Message received successfully",
            "email_sent": email_sent,
            "recipient": RECIPIENT_EMAIL,
        }

    async def _send_email_notification(self, subject: str, body: str, reply_to: str) -> bool:
        """
        Attempt to send email notification to office@msl.com.mm.
        Uses SMTP if configured, otherwise logs the message.
        """
        import os

        smtp_host = os.environ.get("SMTP_HOST", "")
        smtp_port = int(os.environ.get("SMTP_PORT", "587"))
        smtp_user = os.environ.get("SMTP_USER", "")
        smtp_pass = os.environ.get("SMTP_PASSWORD", "")

        if not smtp_host or not smtp_user:
            logger.info(
                f"SMTP not configured. Email would be sent to {RECIPIENT_EMAIL}. "
                f"Subject: {subject}"
            )
            return False

        try:
            msg = MIMEMultipart()
            msg["From"] = smtp_user
            msg["To"] = RECIPIENT_EMAIL
            msg["Subject"] = subject
            msg["Reply-To"] = reply_to
            msg.attach(MIMEText(body, "plain"))

            with smtplib.SMTP(smtp_host, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_pass)
                server.sendmail(smtp_user, RECIPIENT_EMAIL, msg.as_string())

            logger.info(f"Email sent successfully to {RECIPIENT_EMAIL}")
            return True
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False