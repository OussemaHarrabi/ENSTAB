"""Pipeline orchestrator for the UCAR RAG ingestion system.

Orchestrates the full ingestion flow:
1. Download document from Supabase Storage (or accept local file)
2. Parse with Unstructured.io
3. Chunk the extracted text
4. Generate embeddings with OpenAI
5. Store chunks and vectors in Supabase (pgvector)
6. Emit completion events

The pipeline is fault-tolerant: failures at any step are logged
and surfaced, but do not block other documents from processing.
"""

import hashlib
import time
from datetime import datetime
from pathlib import Path
from typing import Any, Optional
from uuid import UUID, uuid4

import structlog

from ingestion.config import settings
from ingestion.models.schemas import (
    DocumentRecord,
    DocumentStatus,
    ParsedDocument,
    PipelineResult,
    VectorRecord,
)
from ingestion.pipeline.chunker import DocumentChunker
from ingestion.pipeline.events import EventEmitter
from ingestion.services.embedding_service import EmbeddingService
from ingestion.services.supabase_client import SupabaseClient
from ingestion.services.unstructured_client import UnstructuredClient

logger = structlog.get_logger(__name__)


class PipelineOrchestrator:
    """Orchestrates the complete RAG ingestion pipeline.

    Usage:
        orchestrator = PipelineOrchestrator()
        result = await orchestrator.run_from_storage("path/to/doc.pdf")
        # or
        result = await orchestrator.run_from_local(Path("file.pdf"))
    """

    def __init__(
        self,
        supabase_client: Optional[SupabaseClient] = None,
        unstructured_client: Optional[UnstructuredClient] = None,
        embedding_service: Optional[EmbeddingService] = None,
        event_emitter: Optional[EventEmitter] = None,
    ) -> None:
        self.supabase = supabase_client or SupabaseClient()
        self.unstructured = unstructured_client or UnstructuredClient()
        self.embeddings = embedding_service or EmbeddingService()
        self.events = event_emitter or EventEmitter(self.supabase)
        self.chunker = DocumentChunker()

    # ────────────────── Main Entry Points ──────────────────

    async def run_from_storage(
        self,
        storage_path: str,
        file_name: Optional[str] = None,
        institution_id: Optional[UUID] = None,
        department_id: Optional[UUID] = None,
        source_type: str = "manual_upload",
        tags: Optional[list[str]] = None,
    ) -> PipelineResult:
        """Run the full pipeline on a file already in Supabase Storage.

        Args:
            storage_path: Path within the Supabase Storage bucket
            file_name: Display name (defaults to last part of path)
            institution_id: Associated institution UUID
            department_id: Associated department UUID
            source_type: Category of the document
            tags: Tags for filtering

        Returns:
            PipelineResult with status and metrics
        """
        file_name = file_name or Path(storage_path).name
        start_time = time.monotonic()

        # Step 0: Download file from storage
        logger.info("pipeline_starting_from_storage", path=storage_path)
        file_content = self.supabase.download_file(storage_path)
        file_type = self._detect_file_type(file_name)
        content_hash = self.supabase.compute_content_hash(file_content)

        return await self._run_pipeline(
            file_content=file_content,
            file_name=file_name,
            file_type=file_type,
            content_hash=content_hash,
            storage_path=storage_path,
            institution_id=institution_id,
            department_id=department_id,
            source_type=source_type,
            tags=tags or [],
            start_time=start_time,
        )

    async def run_from_local(
        self,
        local_path: Path,
        institution_id: Optional[UUID] = None,
        department_id: Optional[UUID] = None,
        source_type: str = "manual_upload",
        tags: Optional[list[str]] = None,
        upload_to_supabase: bool = True,
    ) -> PipelineResult:
        """Run the full pipeline on a local file.

        Optionally uploads to Supabase Storage first.

        Args:
            local_path: Path to the local file
            institution_id: Associated institution UUID
            department_id: Associated department UUID
            source_type: Category of the document
            tags: Tags for filtering
            upload_to_supabase: If True, upload to Supabase Storage first

        Returns:
            PipelineResult with status and metrics
        """
        start_time = time.monotonic()
        file_name = local_path.name
        file_type = self._detect_file_type(file_name)

        # Read file content
        file_content = local_path.read_bytes()
        content_hash = self.supabase.compute_content_hash(file_content)

        storage_path = f"{uuid4()}/{file_name}"
        if upload_to_supabase:
            self.supabase.upload_file(
                str(local_path), storage_path, self._get_mime(file_type)
            )

        return await self._run_pipeline(
            file_content=file_content,
            file_name=file_name,
            file_type=file_type,
            content_hash=content_hash,
            storage_path=storage_path if upload_to_supabase else str(local_path),
            institution_id=institution_id,
            department_id=department_id,
            source_type=source_type,
            tags=tags or [],
            start_time=start_time,
        )

    async def run_from_bytes(
        self,
        file_content: bytes,
        file_name: str,
        institution_id: Optional[UUID] = None,
        department_id: Optional[UUID] = None,
        source_type: str = "manual_upload",
        tags: Optional[list[str]] = None,
    ) -> PipelineResult:
        """Run the full pipeline on raw bytes (e.g., from API upload).

        Args:
            file_content: Raw file bytes
            file_name: Original filename
            institution_id: Associated institution UUID
            department_id: Associated department UUID
            source_type: Category of the document
            tags: Tags for filtering

        Returns:
            PipelineResult with status and metrics
        """
        start_time = time.monotonic()
        file_type = self._detect_file_type(file_name)
        content_hash = self.supabase.compute_content_hash(file_content)
        storage_path = f"{uuid4()}/{file_name}"

        return await self._run_pipeline(
            file_content=file_content,
            file_name=file_name,
            file_type=file_type,
            content_hash=content_hash,
            storage_path=storage_path,
            institution_id=institution_id,
            department_id=department_id,
            source_type=source_type,
            tags=tags or [],
            start_time=start_time,
        )

    # ────────────────── Core Pipeline ──────────────────

    async def _run_pipeline(
        self,
        file_content: bytes,
        file_name: str,
        file_type: str,
        content_hash: str,
        storage_path: str,
        institution_id: Optional[UUID] = None,
        department_id: Optional[UUID] = None,
        source_type: str = "manual_upload",
        tags: Optional[list[str]] = None,
        start_time: float = 0,
    ) -> PipelineResult:
        """Internal pipeline execution with full error handling."""
        start_time = start_time or time.monotonic()

        # Step -1: Check for duplicate
        duplicate = self.supabase.check_duplicate(content_hash)
        if duplicate:
            logger.info(
                "duplicate_detected",
                file_name=file_name,
                existing_id=duplicate.get("existing_id"),
            )

        # Step 0: Create document record
        doc_record = DocumentRecord(
            id=uuid4(),
            storage_path=storage_path,
            file_name=file_name,
            file_type=file_type,
            file_size_bytes=len(file_content),
            mime_type=self._get_mime(file_type),
            content_hash=content_hash,
            institution_id=institution_id,
            department_id=department_id,
            source_type=source_type,
            tags=tags or [],
            status=DocumentStatus.UPLOADED,
        )
        self.supabase.create_document_record(doc_record)
        document_id = doc_record.id

        # Emit pipeline started
        await self.events.pipeline_started(document_id, file_name)

        try:
            # Step 1: Parse with Unstructured.io
            step_start = time.monotonic()
            self.supabase.update_document_status(document_id, DocumentStatus.PARSING)
            elements = await self.unstructured.parse_document_sync(
                file_content, file_name
            )
            page_count = max(
                (el.get("metadata", {}).get("page_number", 0) for el in elements),
                default=0,
            )
            text_length = sum(len(el.get("text", "")) for el in elements)

            self.supabase.update_document_status(
                document_id,
                DocumentStatus.PARSED,
                parsed_at=datetime.utcnow().isoformat(),
                page_count=page_count,
                extracted_text_length=text_length,
            )
            parse_duration = int((time.monotonic() - step_start) * 1000)
            await self.events.parsing_complete(
                document_id, len(elements), parse_duration
            )

            # Step 2: Chunk the elements
            step_start = time.monotonic()
            self.supabase.update_document_status(document_id, DocumentStatus.CHUNKING)
            chunks = self.chunker.chunk_elements(elements, document_id)
            chunk_count = self.supabase.insert_chunks(chunks)

            self.supabase.update_document_status(
                document_id,
                DocumentStatus.CHUNKED,
                chunked_at=datetime.utcnow().isoformat(),
                total_chunks=chunk_count,
            )
            chunk_duration = int((time.monotonic() - step_start) * 1000)
            await self.events.chunking_complete(
                document_id, chunk_count, chunk_duration
            )

            # Step 3: Vectorize chunks
            step_start = time.monotonic()
            self.supabase.update_document_status(
                document_id, DocumentStatus.VECTORIZING
            )
            vectors = await self._vectorize_chunks(
                chunks, document_id, institution_id, department_id, file_type
            )
            vector_count = self.supabase.insert_vectors(vectors)

            self.supabase.update_document_status(
                document_id,
                DocumentStatus.COMPLETED,
                vectorized_at=datetime.utcnow().isoformat(),
                total_vectors=vector_count,
                embedding_model=settings.openai_embedding_model,
            )
            vector_duration = int((time.monotonic() - step_start) * 1000)
            await self.events.vectorization_complete(
                document_id, vector_count, vector_duration
            )

            # Success!
            total_duration = int((time.monotonic() - start_time) * 1000)
            await self.events.pipeline_completed(
                document_id, total_duration, chunk_count, vector_count
            )

            logger.info(
                "pipeline_completed",
                document_id=str(document_id),
                file_name=file_name,
                chunks=chunk_count,
                vectors=vector_count,
                duration_ms=total_duration,
            )

            return PipelineResult(
                document_id=document_id,
                status=DocumentStatus.COMPLETED,
                file_name=file_name,
                page_count=page_count,
                total_chunks=chunk_count,
                total_vectors=vector_count,
                total_duration_ms=total_duration,
            )

        except Exception as e:
            error_msg = str(e)
            total_duration = int((time.monotonic() - start_time) * 1000)

            logger.error(
                "pipeline_failed",
                document_id=str(document_id),
                file_name=file_name,
                error=error_msg,
            )

            self.supabase.update_document_status(
                document_id, DocumentStatus.FAILED, error_message=error_msg
            )
            await self.events.pipeline_failed(document_id, error_msg, total_duration)

            return PipelineResult(
                document_id=document_id,
                status=DocumentStatus.FAILED,
                file_name=file_name,
                total_duration_ms=total_duration,
                error_message=error_msg,
            )

    # ────────────────── Vectorization ──────────────────

    async def _vectorize_chunks(
        self,
        chunks: list,
        document_id: UUID,
        institution_id: Optional[UUID] = None,
        department_id: Optional[UUID] = None,
        document_type: Optional[str] = None,
    ) -> list[VectorRecord]:
        """Generate embeddings for all chunks and create VectorRecords.

        Processes in batches for efficiency.
        """
        if not chunks:
            return []

        texts = [c.content for c in chunks]
        chunk_texts = list(zip(chunks, texts))

        vectors: list[VectorRecord] = []
        batch_size = settings.batch_size
        total_batches = (len(chunk_texts) + batch_size - 1) // batch_size

        for batch_idx in range(0, len(chunk_texts), batch_size):
            batch = chunk_texts[batch_idx : batch_idx + batch_size]
            batch_texts = [t for _, t in batch]
            embeddings = await self.embeddings.embed_texts(batch_texts)

            for (chunk, _), embedding in zip(batch, embeddings):
                vector = VectorRecord(
                    id=uuid4(),
                    chunk_id=chunk.id,
                    document_id=document_id,
                    embedding=embedding,
                    embedding_model=settings.openai_embedding_model,
                    embedding_dimension=settings.vector_dimension,
                    content_preview=chunk.content[:200],
                    institution_id=institution_id,
                    department_id=department_id,
                    document_type=document_type,
                )
                vectors.append(vector)

            logger.info(
                "batch_vectorized",
                batch=f"{batch_idx // batch_size + 1}/{total_batches}",
                batch_size=len(batch),
            )

        return vectors

    # ────────────────── Helpers ──────────────────

    @staticmethod
    def _detect_file_type(file_name: str) -> str:
        """Detect file type from extension."""
        ext = file_name.lower().rsplit(".", 1)[-1] if "." in file_name else ""
        return ext

    @staticmethod
    def _get_mime(file_type: str) -> str:
        """Map file extension to MIME type."""
        mapping = {
            "pdf": "application/pdf",
            "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "csv": "text/csv",
            "txt": "text/plain",
            "html": "text/html",
            "md": "text/markdown",
            "png": "image/png",
            "jpg": "image/jpeg",
            "jpeg": "image/jpeg",
            "tiff": "image/tiff",
        }
        return mapping.get(file_type, "application/octet-stream")
