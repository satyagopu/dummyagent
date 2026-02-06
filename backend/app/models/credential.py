from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class UserCredential(Base):
    __tablename__ = "user_credentials"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    provider = Column(String, nullable=False)  # e.g., 'openai', 'google', 'anthropic'
    api_key_encrypted = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="credentials")

    def __repr__(self):
        return f"<UserCredential provider={self.provider}>"
