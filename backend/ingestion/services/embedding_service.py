"""Embedding service for generating vector embeddings.

Uses OpenAI's text-embedding-3-small model by default (1536 dimensions).
Supports batch embedding for efficiency.
"""

import asyncio
from typing import Any, Optional

import structlog
from langchain_openai import OpenAIEmbeddings
from tenacity import retry, stop_after_attempt, wait_exponential

from ingestion.config import settings

logger = structlog.get_logger(__name__)


class EmbeddingService:
    """Generates vector embeddings for text chunks."""

    def __init__(self) -> None:
        self.model_name = settings.openai_embedding_model
        self.dimensions = settings.vector_dimension
        self._embeddings: Optional[OpenAIEmbeddings] = None

    @property
    def embeddings(self) -> OpenAIEmbeddings:
        if self._embeddings is None:
            if not settings.openai_api_key:
                raise ValueError("OPENAI_API_KEY is required for embeddings")
            self._embeddings = OpenAIEmbeddings(
                model=self.model_name,
                dimensions=self.dimensions,
                openai_api_key=settings.openai_api_key,
            )
            logger.info(
                "embedding_service_initialized",
                model=self.model_name,
                dimensions=self.dimensions,
            )
        return self._embeddings

    @retry(
        stop=stop_after_attempt(settings.max_retries),
        wait=wait_exponential(multiplier=1, min=2, max=30),
    )
    async def embed_texts(self, texts: list[str]) -> list[list[float]]:
        """Generate embeddings for a list of text strings.

        Args:
            texts: List of text strings to embed

        Returns:
            List of embedding vectors (each is list[float])
        """
        if not texts:
            return []

        logger.info("generating_embeddings", count=len(texts))

        try:
            # OpenAIEmbeddings.embed_documents is synchronous but we wrap in
            # asyncio.to_thread for non-blocking operation
            embeddings_result = await asyncio.to_thread(
                self.embeddings.embed_documents, texts
            )
            logger.info("embeddings_generated", count=len(embeddings_result))
            return embeddings_result
        except Exception as e:
            logger.error("embedding_error", error=str(e), text_count=len(texts))
            raise

    async def embed_text(self, text: str) -> list[float]:
        """Generate embedding for a single text string."""
        results = await self.embed_texts([text])
        return results[0] if results else []

    async def embed_with_context(
        self, texts: list[str], context_prefix: str = ""
    ) -> list[list[float]]:
        """Generate embeddings with optional context prefix for better retrieval.

        Adds a prefix like "search_document: " to improve retrieval quality.
        """
        if context_prefix:
            texts = [f"{context_prefix}{t}" for t in texts]
        return await self.embed_texts(texts)

    def count_tokens_estimate(self, text: str) -> int:
        """Rough token count estimate (~4 chars per token for English)."""
        return len(text) // 4

    async def close(self) -> None:
        """Cleanup resources."""
        self._embeddings = None
