from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.user import User
from app.models.credential import UserCredential
from app.api.auth import get_current_user
from app.schemas.settings_schemas import CredentialCreate, CredentialResponse, CredentialVerifyRequest
from app.services.encryption import get_encryption_service
from app.services.llm_service import get_llm_service

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/credentials", response_model=List[CredentialResponse])
def list_credentials(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all configured API keys for the user (masked)."""
    credentials = db.query(UserCredential).filter(UserCredential.user_id == str(current_user.id)).all()
    
    response = []
    encryption_service = get_encryption_service()
    
    for cred in credentials:
        # Decrypt to mask it properly
        plain_key = encryption_service.decrypt(cred.api_key_encrypted)
        masked = f"{plain_key[:3]}...{plain_key[-4:]}" if len(plain_key) > 7 else "***"
        
        response.append(CredentialResponse(
            id=cred.id,
            provider=cred.provider,
            is_active=cred.is_active,
            created_at=cred.created_at,
            masked_key=masked
        ))
    return response

@router.post("/credentials", response_model=CredentialResponse)
def add_credential(
    cred_in: CredentialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add or update an API key."""
    encryption_service = get_encryption_service()
    
    # Check if exists
    existing = db.query(UserCredential).filter(
        UserCredential.user_id == str(current_user.id),
        UserCredential.provider == cred_in.provider
    ).first()
    
    encrypted_key = encryption_service.encrypt(cred_in.api_key)
    
    if existing:
        existing.api_key_encrypted = encrypted_key
        existing.updated_at = existing.updated_at # force update timestamp
        db.commit()
        db.refresh(existing)
        db_obj = existing
    else:
        db_obj = UserCredential(
            user_id=str(current_user.id),
            provider=cred_in.provider,
            api_key_encrypted=encrypted_key
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
    
    masked = f"{cred_in.api_key[:3]}...{cred_in.api_key[-4:]}" if len(cred_in.api_key) > 7 else "***"
    
    return CredentialResponse(
        id=db_obj.id,
        provider=db_obj.provider,
        is_active=db_obj.is_active,
        created_at=db_obj.created_at,
        masked_key=masked
    )

@router.delete("/credentials/{provider}")
def delete_credential(
    provider: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove a credential."""
    cred = db.query(UserCredential).filter(
        UserCredential.user_id == str(current_user.id),
        UserCredential.provider == provider
    ).first()
    
    if not cred:
        raise HTTPException(status_code=404, detail="Credential not found")
        
    db.delete(cred)
    db.commit()
    return {"status": "success", "message": f"{provider} key removed"}

@router.post("/credentials/verify")
async def verify_credential(
    request: CredentialVerifyRequest,
    current_user: User = Depends(get_current_user)
):
    """Test if an API key works."""
    llm_service = get_llm_service()
    result = await llm_service.verify_key(request.provider, request.api_key)
    if not result:
        raise HTTPException(status_code=400, detail="Key verification failed")
    return {"status": "valid"}
