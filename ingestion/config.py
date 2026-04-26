"""Configuration management for the UCAR ingestion pipeline."""

import os
from pathlib import Path

from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load .env from project root
ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(ENV_PATH)


class Settings(BaseSettings):
    """Pipeline settings loaded from environment variables."""

    # Supabase
    supabase_url: str = os.getenv("SUPABASE_URL", "")
    supabase_service_role_key: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    supabase_storage_bucket: str = os.getenv("SUPABASE_STORAGE_BUCKET", "documents")

    # Unstructured.io
    unstructured_api_key: str = os.getenv("UNSTRUCTURED_API_KEY", "")
    unstructured_api_url: str = os.getenv(
        "UNSTRUCTURED_API_URL", "https://api.unstructured.io/general/v0/general"
    )

    # OpenAI
    openai_api_key: str = os.getenv("OPENAI_API_KEY", "")
    openai_embedding_model: str = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")

    # NATS
    nats_url: str = os.getenv("NATS_URL", "nats://localhost:4222")

    # Pipeline parameters
    chunk_size: int = int(os.getenv("CHUNK_SIZE", "1000"))
    chunk_overlap: int = int(os.getenv("CHUNK_OVERLAP", "200"))
    vector_dimension: int = int(os.getenv("VECTOR_DIMENSION", "1536"))
    batch_size: int = int(os.getenv("BATCH_SIZE", "50"))
    max_retries: int = int(os.getenv("MAX_RETRIES", "3"))
    retry_delay_seconds: int = int(os.getenv("RETRY_DELAY_SECONDS", "2"))

    model_config = {"env_file": str(ENV_PATH), "extra": "allow"}


# Singleton
settings = Settings()
