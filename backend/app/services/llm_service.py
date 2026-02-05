import os
from typing import Optional, Dict, Any
from functools import lru_cache

from langchain_core.messages import HumanMessage, SystemMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_openai import ChatOpenAI
from langchain_aws import ChatBedrock
from langchain_core.language_models.chat_models import BaseChatModel

class LLMService:
    def __init__(self):
        self._models: Dict[str, BaseChatModel] = {}
        self._setup_models()

    def _setup_models(self):
        """Initialize available LLM providers based on environment variables."""
        
        # Google Gemini
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if google_api_key:
            try:
                self._models["gemini-pro"] = ChatGoogleGenerativeAI(
                    model="gemini-pro",
                    google_api_key=google_api_key,
                    convert_system_message_to_human=True
                )
                print("✅ Gemini API initialized")
            except Exception as e:
                print(f"⚠️ Failed to initialize Gemini: {e}")

        # OpenAI
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if openai_api_key:
            try:
                self._models["gpt-4"] = ChatOpenAI(model="gpt-4", api_key=openai_api_key)
                self._models["gpt-3.5-turbo"] = ChatOpenAI(model="gpt-3.5-turbo", api_key=openai_api_key)
                print("✅ OpenAI API initialized")
            except Exception as e:
                print(f"⚠️ Failed to initialize OpenAI: {e}")

        # AWS Bedrock
        aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
        aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
        aws_region = os.getenv("AWS_REGION", "us-east-1")
        
        if aws_access_key and aws_secret_key:
            try:
                # Claude 3 Sonnet via Bedrock
                self._models["claude-3-sonnet"] = ChatBedrock(
                    model_id="anthropic.claude-3-sonnet-20240229-v1:0",
                    region_name=aws_region,
                    aws_access_key_id=aws_access_key,
                    aws_secret_access_key=aws_secret_key
                )
                print("✅ AWS Bedrock initialized")
            except Exception as e:
                print(f"⚠️ Failed to initialize AWS Bedrock: {e}")

    async def generate_text(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None, 
        model_name: str = "gemini-pro",
        temperature: float = 0.7
    ) -> str:
        """
        Generate text using the specified LLM model.
        """
        if model_name not in self._models:
            # Fallback to first available model if requested one is missing
            if not self._models:
                raise ValueError("No LLM models are available. Check your API keys.")
            fallback_model = list(self._models.keys())[0]
            print(f"⚠️ Model '{model_name}' not found, falling back to '{fallback_model}'")
            model_name = fallback_model

        llm = self._models[model_name]
        
        # Update temperature if supported (create a new instance with updated setting or adjust if possible)
        # Note: LangChain models are often immutable-ish, so we might need to rely on the default or re-instantiate.
        # For simplicity in this v1, we'll keep the default initialized temperature (usually 0.7) 
        # or we could adjust strictly if critical. 
        # Ideally, we should create the model instance per request if parameters vary wildly, 
        # but caching instances is better for connection pooling.
        # Let's try to set it dynamically if the library supports it, otherwise accept default.
        if hasattr(llm, "temperature"):
            llm.temperature = temperature

        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        
        messages.append(HumanMessage(content=prompt))

        try:
            response = await llm.ainvoke(messages)
            return response.content
        except Exception as e:
            print(f"❌ Error generating text with {model_name}: {e}")
            raise e

    def get_available_models(self) -> list[str]:
        return list(self._models.keys())

# Singleton instance
@lru_cache()
def get_llm_service() -> LLMService:
    return LLMService()
