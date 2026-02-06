import pytest
import os
from unittest.mock import MagicMock

@pytest.fixture(autouse=True)
def mock_env_vars():
    """Set environment variables for all tests."""
    # Store original values
    original_key = os.environ.get("ENCRYPTION_KEY")
    
    # Set test values
    # Valid Fernet key
    os.environ["ENCRYPTION_KEY"] = "srX6ITJOXCaz2VPAgo3TJb3Y0dtn9FeQqnWG5jEtm0c="
    
    yield
    
    # Restore original values
    if original_key:
        os.environ["ENCRYPTION_KEY"] = original_key
    else:
        if "ENCRYPTION_KEY" in os.environ:
            del os.environ["ENCRYPTION_KEY"]
