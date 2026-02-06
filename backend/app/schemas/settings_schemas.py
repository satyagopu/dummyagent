from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CredentialBase(BaseModel):
    provider: str

class CredentialCreate(CredentialBase):
    api_key: str

class CredentialResponse(CredentialBase):
    id: int
    is_active: bool
    created_at: datetime
    masked_key: str

    class Config:
        from_attributes = True

class CredentialVerifyRequest(CredentialBase):
    api_key: str
