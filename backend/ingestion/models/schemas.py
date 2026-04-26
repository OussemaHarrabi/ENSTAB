"""Pydantic schemas for ingestion pipeline data structures."""

from datetime import datetime
from enum import StrEnum
from typing import Any, Optional
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class DocumentStatus(StrEnum):
    UPLOADED = "uploaded"
    PARSING = "parsing"
    PARSED = "parsed"
    CHUNKING = "chunking"
    CHUNKED = "chunked"
    VECTORIZING = "vectorizing"
    COMPLETED = "completed"
    FAILED = "failed"


class DocumentRecord(BaseModel):
    """Represents a document in the ingestion pipeline."""

    id: UUID = Field(default_factory=uuid4)
    storage_path: str
    storage_bucket: str = "documents"
    file_name: str
    file_type: str
    file_size_bytes: Optional[int] = None
    mime_type: Optional[str] = None
    content_hash: Optional[str] = None
    institution_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    source_type: str = "manual_upload"
    uploaded_by: Optional[UUID] = None
    tags: list[str] = Field(default_factory=list)
    status: DocumentStatus = DocumentStatus.UPLOADED
    error_message: Optional[str] = None
    parsed_at: Optional[datetime] = None
    page_count: Optional[int] = None
    extracted_text_length: Optional[int] = None
    chunked_at: Optional[datetime] = None
    total_chunks: int = 0
    vectorized_at: Optional[datetime] = None
    total_vectors: int = 0
    embedding_model: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None


class ChunkRecord(BaseModel):
    """Represents a text chunk extracted from a document."""

    id: UUID = Field(default_factory=uuid4)
    document_id: UUID
    chunk_index: int
    content: str
    content_length: int = 0
    page_number: Optional[int] = None
    section_title: Optional[str] = None
    chunk_type: str = "text"
    previous_chunk_id: Optional[UUID] = None
    next_chunk_id: Optional[UUID] = None
    source_element_type: Optional[str] = None
    source_coordinates: Optional[dict[str, Any]] = None
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class VectorRecord(BaseModel):
    """Represents a vector embedding for a chunk."""

    id: UUID = Field(default_factory=uuid4)
    chunk_id: UUID
    document_id: UUID
    embedding: list[float]
    embedding_model: str
    embedding_dimension: int = 1536
    content_preview: Optional[str] = None
    institution_id: Optional[UUID] = None
    department_id: Optional[UUID] = None
    document_type: Optional[str] = None
    tags: list[str] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class IngestionEvent(BaseModel):
    """Logs a pipeline event."""

    id: UUID = Field(default_factory=uuid4)
    document_id: UUID
    event_type: str
    event_status: str  # 'success', 'failure', 'in_progress'
    payload: dict[str, Any] = Field(default_factory=dict)
    error_details: Optional[str] = None
    duration_ms: Optional[int] = None
    chunks_processed: Optional[int] = None
    vectors_generated: Optional[int] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class ParsedDocument(BaseModel):
    """Result of parsing a document with Unstructured.io."""

    elements: list[dict[str, Any]]
    page_count: int = 0
    total_text_length: int = 0
    metadata: dict[str, Any] = Field(default_factory=dict)


class PipelineResult(BaseModel):
    """Final result of a complete ingestion pipeline run."""

    document_id: UUID
    status: DocumentStatus
    file_name: str
    page_count: int = 0
    total_chunks: int = 0
    total_vectors: int = 0
    total_duration_ms: int = 0
    error_message: Optional[str] = None
    events: list[IngestionEvent] = Field(default_factory=list)
