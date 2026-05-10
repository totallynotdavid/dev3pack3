"""
Seleccion centralizada de modelo LLM.

Controla que proveedor se usa definiendo MODEL_PROVIDER en .env:

    MODEL_PROVIDER=openrouter        -> llama-3.3-70b-instruct:free via OpenRouter
    MODEL_PROVIDER=openrouter_claude -> claude-sonnet-4.6 (requiere credito)
    MODEL_PROVIDER=huggingface       -> Qwen2.5-7B via HF OpenAI-compatible endpoint
    MODEL_PROVIDER=huggingface_llama -> Llama-3.1-8B via HF (sin function calling nativo)

HuggingFace se conecta al endpoint /v1 (OpenAI-compatible) para que los tool
calls funcionen correctamente con el protocolo que usa ADK/LiteLLM.
"""
import os
from typing import Literal
from dataclasses import dataclass
from google.adk.models.lite_llm import LiteLlm

_DEFAULT_PROVIDER = "openrouter"

_HF_API_BASE = "https://api-inference.huggingface.co/v1"

_HF_MODELS = {
    "huggingface": "Qwen/Qwen2.5-7B-Instruct",
    "huggingface_llama": "meta-llama/Llama-3.1-8B-Instruct",
}

_VALID_PROVIDERS = Literal["openrouter", "openrouter_claude", "huggingface", "huggingface_llama"]


@dataclass
class ModelConfig:
    provider: str

    def __post_init__(self):
        self.provider = self.provider.lower().strip()
        valid = {"openrouter", "openrouter_claude", "huggingface", "huggingface_llama"}
        if self.provider not in valid:
            raise ValueError(
                f"MODEL_PROVIDER='{self.provider}' no reconocido. "
                f"Valores validos: {', '.join(sorted(valid))}"
            )

        required_keys = {
            "openrouter": [],
            "openrouter_claude": ["OPENROUTER_API_KEY"],
            "huggingface": ["HUGGINGFACE_API_KEY"],
            "huggingface_llama": ["HUGGINGFACE_API_KEY"],
        }

        missing = []
        for key in required_keys[self.provider]:
            if not os.getenv(key):
                missing.append(key)

        if missing:
            raise ValueError(
                f"Proveedor '{self.provider}' requiere: {', '.join(missing)}. "
                f"Setea estas variables de ambiente."
            )

    def get_model(self, num_retries: int = 3) -> LiteLlm:
        if self.provider == "openrouter":
            model = "openrouter/meta-llama/llama-3.3-70b-instruct:free"
            print(f"[FactorBridge] Proveedor: {self.provider} | Modelo: {model}")
            return LiteLlm(model=model, num_retries=num_retries)

        if self.provider == "openrouter_claude":
            model = "openrouter/anthropic/claude-sonnet-4.6"
            print(f"[FactorBridge] Proveedor: {self.provider} | Modelo: {model}")
            return LiteLlm(model=model, num_retries=num_retries)

        if self.provider in _HF_MODELS:
            hf_model_id = _HF_MODELS[self.provider]
            litellm_model = f"huggingface/{hf_model_id}"
            api_key = os.getenv("HUGGINGFACE_API_KEY")
            print(f"[FactorBridge] Proveedor: {self.provider} | Modelo: {hf_model_id}")
            return LiteLlm(
                model=litellm_model,
                api_key=api_key,
                num_retries=num_retries,
            )

        raise ValueError(f"Proveedor '{self.provider}' no soportado")


def get_model(num_retries: int = 3) -> LiteLlm:
    provider_name = os.getenv("MODEL_PROVIDER", _DEFAULT_PROVIDER)
    config = ModelConfig(provider=provider_name)
    return config.get_model(num_retries=num_retries)