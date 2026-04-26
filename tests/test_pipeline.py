"""Tests for the UCAR RAG Ingestion Pipeline.

Run with: pytest tests/ -v
"""

import asyncio
from pathlib import Path
from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from ingestion.models.schemas import (
    ChunkRecord,
    DocumentRecord,
    DocumentStatus,
    PipelineResult,
)
from ingestion.pipeline.chunker import DocumentChunker
from ingestion.pipeline.events import EventEmitter
from ingestion.pipeline.orchestrator import PipelineOrchestrator


# ────────────────── Chunker Tests ──────────────────

def test_chunker_empty_elements():
    """Chunker should handle empty element list gracefully."""
    chunker = DocumentChunker(chunk_size=500, chunk_overlap=50)
    from uuid import uuid4
    chunks = chunker.chunk_elements([], uuid4())
    assert len(chunks) == 0


def test_chunker_basic_text():
    """Chunker should split long text into overlapping chunks."""
    chunker = DocumentChunker(chunk_size=100, chunk_overlap=20)
    from uuid import uuid4

    elements = [
        {
            "type": "NarrativeText",
            "text": "This is a test document. " * 50,  # ~1350 chars
            "metadata": {"page_number": 1},
        }
    ]
    chunks = chunker.chunk_elements(elements, uuid4())
    assert len(chunks) > 1  # Should be split into multiple chunks
    for c in chunks:
        assert len(c.content) <= 100 + 20  # chunk_size + overlap tolerance


def test_chunker_preserves_page_numbers():
    """Chunks should carry page_number metadata."""
    chunker = DocumentChunker(chunk_size=500, chunk_overlap=50)
    from uuid import uuid4

    elements = [
        {
            "type": "NarrativeText",
            "text": "Page one content. " * 80,
            "metadata": {"page_number": 1},
        },
        {
            "type": "NarrativeText",
            "text": "Page two content. " * 80,
            "metadata": {"page_number": 2},
        },
    ]
    chunks = chunker.chunk_elements(elements, uuid4())
    pages = {c.page_number for c in chunks}
    assert 1 in pages
    assert 2 in pages


def test_chunker_links_neighbors():
    """Chunks should have previous_chunk_id and next_chunk_id set."""
    chunker = DocumentChunker(chunk_size=50, chunk_overlap=10)
    from uuid import uuid4

    elements = [
        {
            "type": "NarrativeText",
            "text": "a " * 100,
            "metadata": {},
        }
    ]
    chunks = chunker.chunk_elements(elements, uuid4())
    assert len(chunks) >= 2

    # First chunk: no previous, has next
    assert chunks[0].previous_chunk_id is None
    assert chunks[0].next_chunk_id is not None

    # Last chunk: has previous, no next
    assert chunks[-1].previous_chunk_id is not None
    assert chunks[-1].next_chunk_id is None

    # Middle chunk has both
    if len(chunks) >= 3:
        assert chunks[1].previous_chunk_id is not None
        assert chunks[1].next_chunk_id is not None


# ────────────────── DocumentRecord Tests ──────────────────

def test_document_record_creation():
    """DocumentRecord should be created with defaults."""
    doc = DocumentRecord(
        storage_path="test/path.pdf",
        file_name="test.pdf",
        file_type="pdf",
    )
    assert doc.status == DocumentStatus.UPLOADED
    assert doc.file_name == "test.pdf"
    assert doc.total_chunks == 0


def test_pipeline_result_creation():
    """PipelineResult should capture completion metrics."""
    from uuid import uuid4
    result = PipelineResult(
        document_id=uuid4(),
        status=DocumentStatus.COMPLETED,
        file_name="test.pdf",
        total_chunks=10,
        total_vectors=10,
        total_duration_ms=5000,
    )
    assert result.status == DocumentStatus.COMPLETED
    assert result.total_chunks == 10


# ────────────────── Schema Validation Tests ──────────────────

def test_chunk_record_validation():
    """ChunkRecord should enforce required fields."""
    from uuid import uuid4
    chunk = ChunkRecord(
        document_id=uuid4(),
        chunk_index=0,
        content="Test content",
    )
    assert chunk.chunk_index == 0
    assert chunk.content == "Test content"


# ────────────────── Integration Smoke Tests ──────────────────
# These require actual API keys - skip by default

@pytest.mark.skip(reason="Requires OPENAI_API_KEY and UNSTRUCTURED_API_KEY")
@pytest.mark.asyncio
async def test_full_pipeline_local_pdf():
    """End-to-end pipeline test with a local PDF (needs API keys)."""
    orchestrator = PipelineOrchestrator()
    test_pdf = Path(__file__).parent.parent / "Problem Statement.pdf"
    if not test_pdf.exists():
        pytest.skip("Problem Statement.pdf not found")

    result = await orchestrator.run_from_local(
        local_path=test_pdf,
        source_type="test",
        upload_to_supabase=False,
    )
    assert result.status == DocumentStatus.COMPLETED
    assert result.total_chunks > 0
    assert result.total_vectors > 0
