"""Unstructured.io API client for document parsing.

Uses the Unstructured.io General API to parse PDFs, DOCX, XLSX, images
into structured elements with text, tables, and metadata.
"""

import asyncio
from typing import Any, Optional

import httpx
import structlog
from tenacity import retry, stop_after_attempt, wait_exponential

from ingestion.config import settings

logger = structlog.get_logger(__name__)


class UnstructuredClient:
    """Client for the Unstructured.io document parsing API."""

    def __init__(self) -> None:
        self.api_key = settings.unstructured_api_key
        self.api_url = settings.unstructured_api_url
        self._client: Optional[httpx.AsyncClient] = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None:
            self._client = httpx.AsyncClient(
                base_url=self.api_url,
                timeout=httpx.Timeout(120.0),
                headers={
                    "accept": "application/json",
                    "unstructured-api-key": self.api_key,
                },
            )
        return self._client

    @retry(
        stop=stop_after_attempt(settings.max_retries),
        wait=wait_exponential(multiplier=1, min=2, max=30),
    )
    async def parse_document(
        self,
        file_content: bytes,
        file_name: str,
        strategy: str = "auto",
        chunking_strategy: Optional[str] = None,
        include_page_breaks: bool = True,
        include_orig_elements: bool = True,
        **kwargs: Any,
    ) -> dict[str, Any]:
        """Parse a document using Unstructured.io API.

        Args:
            file_content: Raw file bytes
            file_name: Original filename (used for type detection)
            strategy: Parsing strategy - 'auto', 'fast', 'hi_res', 'ocr_only'
            chunking_strategy: Optional chunking strategy - 'by_title', 'by_page', 'basic'
            include_page_breaks: Include page break markers
            include_orig_elements: Include original elements in response
            **kwargs: Additional API parameters

        Returns:
            Parsed document as dict with 'elements' list
        """
        if not self.api_key:
            raise ValueError("UNSTRUCTURED_API_KEY is required")

        client = await self._get_client()

        # Determine content type from filename
        content_type = self._get_content_type(file_name)

        # Build form data
        files = {
            "files": (file_name, file_content, content_type),
        }

        data = {
            "strategy": strategy,
            "include_page_breaks": str(include_page_breaks).lower(),
            "include_orig_elements": str(include_orig_elements).lower(),
        }

        if chunking_strategy:
            data["chunking_strategy"] = chunking_strategy

        data.update({k: str(v).lower() if isinstance(v, bool) else v for k, v in kwargs.items()})

        logger.info(
            "parsing_document",
            file_name=file_name,
            strategy=strategy,
            content_type=content_type,
            size_bytes=len(file_content),
        )

        try:
            response = await client.post(
                "/general/v0/general",
                files=files,
                data=data,
            )
            response.raise_for_status()
            result = response.json()
            logger.info(
                "document_parsed",
                file_name=file_name,
                element_count=len(result) if isinstance(result, list) else 0,
            )
            return {"elements": result if isinstance(result, list) else []}
        except httpx.HTTPStatusError as e:
            logger.error("unstructured_api_error", status=e.response.status_code, body=e.response.text[:500])
            raise
        except Exception as e:
            logger.error("unstructured_error", error=str(e))
            raise

    async def parse_document_sync(
        self,
        file_content: bytes,
        file_name: str,
        **kwargs: Any,
    ) -> list[dict[str, Any]]:
        """Convenience synchronous wrapper that extracts elements list."""
        result = await self.parse_document(file_content, file_name, **kwargs)
        elements = result.get("elements", [])
        return elements if isinstance(elements, list) else []

    @staticmethod
    def _get_content_type(file_name: str) -> str:
        """Map file extension to MIME type."""
        ext = file_name.lower().split(".")[-1] if "." in file_name else ""
        mapping = {
            "pdf": "application/pdf",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "doc": "application/msword",
            "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "xls": "application/vnd.ms-excel",
            "csv": "text/csv",
            "txt": "text/plain",
            "html": "text/html",
            "md": "text/markdown",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "tiff": "image/tiff",
        }
        return mapping.get(ext, "application/octet-stream")

    async def chunk_with_unstructured(
        self,
        file_content: bytes,
        file_name: str,
        chunking_strategy: str = "by_title",
        max_characters: int = 2000,
        overlap: int = 200,
    ) -> list[dict[str, Any]]:
        """Parse and chunk in one API call using Unstructured's built-in chunking."""
        return await self.parse_document_sync(
            file_content,
            file_name,
            strategy="auto",
            chunking_strategy=chunking_strategy,
            max_characters=str(max_characters),
            overlap=str(overlap),
            include_page_breaks=True,
            include_orig_elements=False,
        )

    async def close(self) -> None:
        """Close the HTTP client."""
        if self._client:
            await self._client.aclose()
            self._client = None
