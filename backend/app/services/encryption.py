from cryptography.fernet import Fernet
import os
import base64
from typing import Optional

class EncryptionService:
    def __init__(self, key: str = None):
        self.key = key or os.getenv("ENCRYPTION_KEY")
        if not self.key:
            raise ValueError("ENCRYPTION_KEY not set in environment")
        self.fernet = Fernet(self.key)

    def encrypt(self, plain_text: str) -> str:
        """Encrypt a string and return the token."""
        if not plain_text:
            return ""
        return self.fernet.encrypt(plain_text.encode()).decode()

    def decrypt(self, token: str) -> str:
        """Decrypt a token and return the original string."""
        if not token:
            return ""
        try:
            return self.fernet.decrypt(token.encode()).decode()
        except Exception:
            # If decryption fails (e.g. key changed), return empty or raise
            return ""

# Singleton
_encryption_service = None

def get_encryption_service() -> EncryptionService:
    global _encryption_service
    if not _encryption_service:
        _encryption_service = EncryptionService()
    return _encryption_service
