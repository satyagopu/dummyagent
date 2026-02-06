import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from app.services.llm_service import LLMService

@pytest.fixture
def mock_llm_service():
    with patch("app.services.llm_service.ChatGoogleGenerativeAI") as mock_gemini, \
         patch("app.services.llm_service.ChatOpenAI") as mock_openai, \
         patch("app.services.llm_service.ChatBedrock") as mock_bedrock, \
         patch("os.getenv") as mock_getenv:
        
        # Mock env vars to trigger initialization
        mock_getenv.side_effect = lambda k, d=None: "fake_key" if k in ["GOOGLE_API_KEY", "OPENAI_API_KEY", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"] else d
        
        service = LLMService()
        yield service, mock_gemini, mock_openai, mock_bedrock

@pytest.mark.asyncio
async def test_initialization(mock_llm_service):
    service, mock_gemini, mock_openai, mock_bedrock = mock_llm_service
    
    assert "gemini-pro" in service.get_available_models()
    assert "gpt-4" in service.get_available_models()
    assert "claude-3-sonnet" in service.get_available_models()

@pytest.mark.asyncio
async def test_generate_text_gemini(mock_llm_service):
    service, mock_gemini, _, _ = mock_llm_service
    
    # Mock behavior
    mock_response = MagicMock()
    mock_response.content = "Hello from Gemini"
    mock_gemini.return_value.ainvoke = AsyncMock(return_value=mock_response)
    
    # Re-initialize to attach the mock to the internal dict (or we can patch the dict directly)
    # Since __init__ runs during fixture setup, we need to ensure the mock used in init is the same.
    # The fixture patches the class, so the instance creation in init uses the mock class.
    # implementation detail: service._models['gemini-pro'] is an instance of the mock class.
    
    response = await service.generate_text(prompt="Hi", model_name="gemini-pro")
    
    assert response == "Hello from Gemini"
    service._models["gemini-pro"].ainvoke.assert_called_once()

@pytest.mark.asyncio
async def test_generate_text_fallback(mock_llm_service):
    service, _, _, _ = mock_llm_service
    
    # Mock behavior for fallback
    # Let's say we request a non-existent model
    # We need to ensure at least one model exists (guaranteed by fixture)
    
    mock_instance = service._models["gemini-pro"]
    mock_response = MagicMock()
    mock_response.content = "Fallback Response"
    mock_instance.ainvoke = AsyncMock(return_value=mock_response)
    
    response = await service.generate_text(prompt="Hi", model_name="non-existent-model")
    
    assert response == "Fallback Response"
