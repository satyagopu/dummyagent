import pytest
from app.services.encryption import EncryptionService
import os

def test_encryption_service_initialization():
    # Test valid key
    key = "srX6ITJOXCaz2VPAgo3TJb3Y0dtn9FeQqnWG5jEtm0c="
    service = EncryptionService(key=key)
    assert service.fernet is not None

    # Test missing key env var
    original_key = os.environ.get("ENCRYPTION_KEY")
    if original_key:
        del os.environ["ENCRYPTION_KEY"]
    
    with pytest.raises(ValueError):
        EncryptionService()
        
    if original_key:
        os.environ["ENCRYPTION_KEY"] = original_key

def test_encrypt_decrypt():
    key = "srX6ITJOXCaz2VPAgo3TJb3Y0dtn9FeQqnWG5jEtm0c="
    service = EncryptionService(key=key)
    
    plain_text = "sk-test-12345"
    encrypted = service.encrypt(plain_text)
    
    assert encrypted != plain_text
    assert len(encrypted) > 0
    
    decrypted = service.decrypt(encrypted)
    assert decrypted == plain_text

def test_decrypt_invalid_token():
    key = "srX6ITJOXCaz2VPAgo3TJb3Y0dtn9FeQqnWG5jEtm0c="
    service = EncryptionService(key=key)
    
    assert service.decrypt("invalid-token") == ""
    assert service.decrypt("") == ""
    assert service.encrypt("") == ""
