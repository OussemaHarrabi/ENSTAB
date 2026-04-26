"""Supabase client wrapper for the UCAR ingestion pipeline.

Handles all database operations: document tracking, chunk storage,
vector storage, event logging, and storage file operations.
"""

import hashlib
from datetime import datetime
from typing import Any, Optional
from uuid import UUID

import structlog
from supabase import Client, create_client
from tenacity import retry, stop_after_attempt, wait_exponential

from ingestion.config import settings
from ingestion.models.schemas import (
    ChunkRecord,
    DocumentRecord,
    DocumentStatus,
    IngestionEvent,
    VectorRecord,
)

logger = structlog.get_logger(__name__)


class SupabaseClient:
    """Wraps Supabase operations for the ingestion pipeline."""

    def __init__(self) -> None:
        self.url = settings.supabase_url
        self.key = settings.supabase_service_role_key
        self.bucket = settings.supabase_storage_bucket
        self._client: Optional[Client] = None

    @property
    def client(self) -> Client:
        if self._client is None:
            if not self.url or not self.key:
                raise ValueError(
                    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set"
                )
            self._client = create_client(self.url, self.key)
            logger.info("supabase_client_initialized", url=self.url)
        return self._client

    # ────────────────── Document Operations ──────────────────

    def compute_content_hash(self, content: bytes) -> str:
        """Compute SHA-256 hash of binary content for deduplication."""
        return hashlib.sha256(content).hexdigest()

    @retry(
        stop=stop_after_attempt(settings.max_retries),
        wait=wait_exponential(multiplier=1, min=1, max=10),
    )
    def check_duplicate(self, content_hash: str) -> Optional[dict[str, Any]]:
        """Check if a document with the same content hash already exists."""
        try:
            result = (
                self.client.rpc("check_duplicate", {"p_content_hash": content_hash})
                .execute()
            )
            if result.data:
                return result.data[0] if isinstance(result.data, list) else result.data
            return None
        except Exception as e:
            logger.warning("duplicate_check_error", error=str(e))
            return None

    def create_document_record(self, doc: DocumentRecord) -> dict[str, Any]:
        """Insert a new document record into the database."""
        data = {
            "id": str(doc.id),
            "storage_path": doc.storage_path,
            "storage_bucket": doc.storage_bucket,
            "file_name": doc.file_name,
            "file_type": doc.file_type,
            "file_size_bytes": doc.file_size_bytes,
            "mime_type": doc.mime_type,
            "content_hash": doc.content_hash,
            "institution_id": str(doc.institution_id) if doc.institution_id else None,
            "department_id": str(doc.department_id) if doc.department_id else None,
            "source_type": doc.source_type,
            "uploaded_by": str(doc.uploaded_by) if doc.uploaded_by else None,
            "tags": doc.tags,
            "status": doc.status.value,
        }
        result = self.client.table("documents").insert(data).execute()
        logger.info("document_record_created", document_id=str(doc.id))
        return result.data[0] if result.data else {}

    def update_document_status(
        self,
        document_id: UUID,
        status: DocumentStatus,
        error_message: Optional[str] = None,
        **extra_fields: Any,
    ) -> None:
        """Update a document's status and optional extra fields."""
        updates: dict[str, Any] = {
            "status": status.value,
            "updated_at": datetime.utcnow().isoformat(),
        }
        if error_message:
            updates["error_message"] = error_message
        if status in (DocumentStatus.COMPLETED, DocumentStatus.FAILED):
            updates["completed_at"] = datetime.utcnow().isoformat()
        updates.update(extra_fields)

        self.client.table("documents").update(updates).eq(
            "id", str(document_id)
        ).execute()

    def get_document(self, document_id: UUID) -> Optional[dict[str, Any]]:
        """Retrieve a document record by ID."""
        result = (
            self.client.table("documents")
            .select("*")
            .eq("id", str(document_id))
            .single()
            .execute()
        )
        return result.data

    # ────────────────── Storage Operations ──────────────────

    def download_file(self, storage_path: str) -> bytes:
        """Download a file from Supabase Storage."""
        result = self.client.storage.from_(self.bucket).download(storage_path)
        logger.info("file_downloaded", path=storage_path, size_bytes=len(result))
        return result

    def upload_file(
        self, local_path: str, storage_path: str, content_type: str = "application/pdf"
    ) -> dict[str, Any]:
        """Upload a file to Supabase Storage."""
        with open(local_path, "rb") as f:
            content = f.read()
        result = (
            self.client.storage.from_(self.bucket)
            .upload(
                path=storage_path,
                file=content,
                file_options={"content-type": content_type, "upsert": "true"},
            )
        )
        url = self.client.storage.from_(self.bucket).get_public_url(storage_path)
        logger.info("file_uploaded", path=storage_path, url=url)
        return {"path": storage_path, "url": url, "size": len(content)}

    def list_bucket_files(self, prefix: str = "") -> list[dict[str, Any]]:
        """List files in the storage bucket with optional prefix filter."""
        result = self.client.storage.from_(self.bucket).list(prefix)
        return result if result else []

    def get_file_url(self, storage_path: str) -> str:
        """Get a public URL for a file in storage."""
        return self.client.storage.from_(self.bucket).get_public_url(storage_path)

    # ────────────────── Chunk Operations ──────────────────

    def insert_chunks(self, chunks: list[ChunkRecord]) -> int:
        """Batch insert chunks into the database."""
        if not chunks:
            return 0

        chunk_data = []
        for i, c in enumerate(chunks):
            chunk_data.append({
                "id": str(c.id),
                "document_id": str(c.document_id),
                "chunk_index": c.chunk_index,
                "content": c.content,
                "content_length": len(c.content),
                "page_number": c.page_number,
                "section_title": c.section_title,
                "chunk_type": c.chunk_type,
                "previous_chunk_id": str(c.previous_chunk_id) if c.previous_chunk_id else None,
                "next_chunk_id": str(c.next_chunk_id) if c.next_chunk_id else None,
                "source_element_type": c.source_element_type,
                "source_coordinates": c.source_coordinates,
                "metadata": c.metadata,
            })

        # Insert in batches for performance
        total_inserted = 0
        batch_size = settings.batch_size
        for batch_start in range(0, len(chunk_data), batch_size):
            batch = chunk_data[batch_start : batch_start + batch_size]
            self.client.table("chunks").insert(batch).execute()
            total_inserted += len(batch)

        logger.info("chunks_inserted", count=total_inserted)
        return total_inserted

    def get_chunks_for_document(self, document_id: UUID) -> list[dict[str, Any]]:
        """Retrieve all chunks for a document."""
        result = (
            self.client.table("chunks")
            .select("*")
            .eq("document_id", str(document_id))
            .order("chunk_index")
            .execute()
        )
        return result.data if result.data else []

    # ────────────────── Vector Operations ──────────────────

    def insert_vectors(self, vectors: list[VectorRecord]) -> int:
        """Batch insert vector embeddings into pgvector."""
        if not vectors:
            return 0

        vector_data = []
        for v in vectors:
            vector_data.append({
                "id": str(v.id),
                "chunk_id": str(v.chunk_id),
                "document_id": str(v.document_id),
                "embedding": v.embedding,
                "embedding_model": v.embedding_model,
                "embedding_dimension": v.embedding_dimension,
                "content_preview": v.content_preview,
                "institution_id": str(v.institution_id) if v.institution_id else None,
                "department_id": str(v.department_id) if v.department_id else None,
                "document_type": v.document_type,
                "tags": v.tags,
            })

        total_inserted = 0
        batch_size = settings.batch_size
        for batch_start in range(0, len(vector_data), batch_size):
            batch = vector_data[batch_start : batch_start + batch_size]
            self.client.table("vectors").insert(batch).execute()
            total_inserted += len(batch)

        logger.info("vectors_inserted", count=total_inserted)
        return total_inserted

    def search_vectors(
        self,
        query_embedding: list[float],
        match_count: int = 5,
        filter_institution_id: Optional[UUID] = None,
        filter_document_type: Optional[str] = None,
        similarity_threshold: float = 0.7,
    ) -> list[dict[str, Any]]:
        """Search for similar vectors using cosine similarity."""
        result = self.client.rpc(
            "search_similar_chunks",
            {
                "query_embedding": query_embedding,
                "match_count": match_count,
                "filter_institution_id": str(filter_institution_id) if filter_institution_id else None,
                "filter_document_type": filter_document_type,
                "similarity_threshold": similarity_threshold,
            },
        ).execute()
        return result.data if result.data else []

    # ────────────────── Event Operations ──────────────────

    def log_event(self, event: IngestionEvent) -> dict[str, Any]:
        """Log a pipeline event."""
        data = {
            "id": str(event.id),
            "document_id": str(event.document_id),
            "event_type": event.event_type,
            "event_status": event.event_status,
            "payload": event.payload,
            "error_details": event.error_details,
            "duration_ms": event.duration_ms,
            "chunks_processed": event.chunks_processed,
            "vectors_generated": event.vectors_generated,
        }
        result = self.client.table("events").insert(data).execute()
        return result.data[0] if result.data else {}
