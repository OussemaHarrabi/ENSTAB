"""Event emitter for the ingestion pipeline.

Emits events to:
1. Supabase ingestion.events table (persistent audit log)
2. NATS pub/sub (optional real-time notifications)

The events provide real-time progress tracking for the frontend
and an audit trail for compliance.
"""

import json
import structlog
from typing import Any, Optional
from uuid import UUID, uuid4

from ingestion.config import settings
from ingestion.models.schemas import IngestionEvent

logger = structlog.get_logger(__name__)


class EventEmitter:
    """Emits pipeline events to Supabase and optionally NATS."""

    def __init__(self, supabase_client, nats_client=None):
        self.supabase = supabase_client
        self.nats = nats_client

    async def emit(
        self,
        document_id: UUID,
        event_type: str,
        event_status: str = "in_progress",
        payload: Optional[dict[str, Any]] = None,
        error_details: Optional[str] = None,
        duration_ms: Optional[int] = None,
        chunks_processed: Optional[int] = None,
        vectors_generated: Optional[int] = None,
    ) -> IngestionEvent:
        """Emit a pipeline event.

        Stores in Supabase events table AND publishes to NATS if available.

        Args:
            document_id: The document this event relates to
            event_type: E.g. 'pipeline_started', 'parsing_complete', 'pipeline_completed'
            event_status: 'in_progress', 'success', or 'failure'
            payload: Additional event-specific data
            error_details: Error message if event_status is 'failure'
            duration_ms: How long this step took in milliseconds
            chunks_processed: Number of chunks processed in this step
            vectors_generated: Number of vectors generated in this step

        Returns:
            The created IngestionEvent
        """
        event = IngestionEvent(
            id=uuid4(),
            document_id=document_id,
            event_type=event_type,
            event_status=event_status,
            payload=payload or {},
            error_details=error_details,
            duration_ms=duration_ms,
            chunks_processed=chunks_processed,
            vectors_generated=vectors_generated,
        )

        # Always persist to Supabase
        try:
            self.supabase.log_event(event)
            logger.info("event_logged", event_type=event_type, status=event_status)
        except Exception as e:
            logger.error("event_log_failed", event_type=event_type, error=str(e))

        # Optionally publish to NATS for real-time UI updates
        await self._publish_to_nats(event)

        return event

    async def _publish_to_nats(self, event: IngestionEvent) -> None:
        """Publish event to NATS for real-time consumption."""
        if not self.nats:
            return

        try:
            subject = f"ucar.ingestion.{event.event_type}"
            payload = event.model_dump_json(default=str)
            await self.nats.publish(subject, payload.encode())
            logger.debug("nats_published", subject=subject)
        except Exception as e:
            logger.warning("nats_publish_failed", error=str(e))

    async def pipeline_started(self, document_id: UUID, file_name: str) -> IngestionEvent:
        """Emit pipeline_started event."""
        return await self.emit(
            document_id=document_id,
            event_type="pipeline_started",
            event_status="in_progress",
            payload={"file_name": file_name},
        )

    async def parsing_complete(
        self,
        document_id: UUID,
        element_count: int,
        duration_ms: int,
    ) -> IngestionEvent:
        """Emit parsing_complete event."""
        return await self.emit(
            document_id=document_id,
            event_type="parsing_complete",
            event_status="success",
            payload={"element_count": element_count},
            duration_ms=duration_ms,
        )

    async def parsing_failed(
        self,
        document_id: UUID,
        error: str,
        duration_ms: int,
    ) -> IngestionEvent:
        """Emit parsing_failed event."""
        return await self.emit(
            document_id=document_id,
            event_type="parsing_complete",
            event_status="failure",
            error_details=error,
            duration_ms=duration_ms,
        )

    async def chunking_complete(
        self,
        document_id: UUID,
        chunk_count: int,
        duration_ms: int,
    ) -> IngestionEvent:
        """Emit chunking_complete event."""
        return await self.emit(
            document_id=document_id,
            event_type="chunking_complete",
            event_status="success",
            payload={"chunk_count": chunk_count},
            duration_ms=duration_ms,
            chunks_processed=chunk_count,
        )

    async def vectorization_complete(
        self,
        document_id: UUID,
        vector_count: int,
        duration_ms: int,
    ) -> IngestionEvent:
        """Emit vectorization_complete event."""
        return await self.emit(
            document_id=document_id,
            event_type="vectorization_complete",
            event_status="success",
            payload={"vector_count": vector_count},
            duration_ms=duration_ms,
            vectors_generated=vector_count,
        )

    async def pipeline_completed(
        self,
        document_id: UUID,
        total_duration_ms: int,
        chunks: int,
        vectors: int,
    ) -> IngestionEvent:
        """Emit pipeline_completed event."""
        return await self.emit(
            document_id=document_id,
            event_type="pipeline_completed",
            event_status="success",
            payload={
                "total_chunks": chunks,
                "total_vectors": vectors,
                "total_duration_ms": total_duration_ms,
            },
            duration_ms=total_duration_ms,
            chunks_processed=chunks,
            vectors_generated=vectors,
        )

    async def pipeline_failed(
        self,
        document_id: UUID,
        error: str,
        duration_ms: int,
    ) -> IngestionEvent:
        """Emit pipeline_failed event."""
        return await self.emit(
            document_id=document_id,
            event_type="pipeline_failed",
            event_status="failure",
            error_details=error,
            duration_ms=duration_ms,
        )
