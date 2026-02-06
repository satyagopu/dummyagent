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
        """Initialize system-level LLM providers (fallback)."""
        # ... (Existing init code largely same, but maybe simplified) ...
        # Keeping existing logic for now as fallback
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if google_api_key:
            try:
                self._models["gemini-pro"] = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=google_api_key)
                self._models["gemini-1.5-pro"] = ChatGoogleGenerativeAI(model="gemini-1.5-pro", google_api_key=google_api_key)
            except Exception: pass
            
        openai_key = os.getenv("OPENAI_API_KEY")
        if openai_key:
            try:
                self._models["gpt-4"] = ChatOpenAI(model="gpt-4", api_key=openai_key)
                self._models["gpt-3.5-turbo"] = ChatOpenAI(model="gpt-3.5-turbo", api_key=openai_key)
            except Exception: pass

    async def generate_text(
        self, 
        prompt: str, 
        system_prompt: Optional[str] = None, 
        model_name: str = "gemini-pro",
        temperature: float = 0.7,
        api_key: Optional[str] = None,
        provider: Optional[str] = None # e.g., 'openai', 'google'
    ) -> str:
        """Generate text, optionally using a user-provided API key."""
        
        llm = None
        
        # 1. Try to create user-specific instance if key is provided
        if api_key:
            llm = self._create_model_instance(model_name, api_key, temperature)
            
        # 2. Fallback to system models
        if not llm:
            if model_name in self._models:
                llm = self._models[model_name]
                # Try to adjust temp if possible, but system models are shared instances
            else:
                # If exact model missing, try to find a similar provider fallback or error
                # For Phase 6, strictly speaking execute with what we have
                pass
        
        if not llm:
             raise ValueError(f"Model {model_name} not available (no system key and no user key provided)")

        messages = []
        if system_prompt:
            messages.append(SystemMessage(content=system_prompt))
        messages.append(HumanMessage(content=prompt))

        try:
            response = await llm.ainvoke(messages)
            return response.content
        except Exception as e:
            # print(f"❌ Error generating text with {model_name}: {e}")
            raise e

    def _create_model_instance(self, model_name: str, api_key: str, temperature: float) -> Optional[BaseChatModel]:
        """Create an ephemeral model instance with a specific key."""
        try:
            if "gpt" in model_name:
                return ChatOpenAI(model=model_name, api_key=api_key, temperature=temperature)
            elif "gemini" in model_name:
                return ChatGoogleGenerativeAI(model=model_name, google_api_key=api_key, temperature=temperature)
            elif "claude" in model_name:
                from langchain_anthropic import ChatAnthropic
                return ChatAnthropic(model=model_name, api_key=api_key, temperature=temperature)
        except Exception as e:
            print(f"Failed to create instance for {model_name}: {e}")
            return None
        return None

    async def verify_key(self, provider: str, api_key: str) -> bool:
        """Verify an API key by making a minimal request."""
        try:
            if provider == 'openai':
                llm = ChatOpenAI(model="gpt-3.5-turbo", api_key=api_key, max_tokens=5)
            elif provider == 'google':
                llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=api_key)
            elif provider == 'anthropic':
                from langchain_anthropic import ChatAnthropic
                llm = ChatAnthropic(model="claude-3-sonnet-20240229", api_key=api_key, max_tokens=5)
            else:
                return False
                
            await llm.ainvoke([HumanMessage(content="Hello")])
            return True
        except Exception as e:
            print(f"Verification failed for {provider}: {e}")
            return False

    def get_available_models(self) -> list[str]:
        return list(self._models.keys()) + ["gpt-4o", "gemini-1.5-flash"] # Advertise all capability

# Singleton instance
@lru_cache()
def get_llm_service() -> LLMService:
    return LLMService()
