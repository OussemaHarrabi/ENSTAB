"""Entry point for the UCAR RAG Ingestion Pipeline.

Usage:
    python -m ingestion.main ingest --file docs/report.pdf
    python -m ingestion.main ingest --storage-path "2025/report.pdf"
    python -m ingestion.main status <document_id>
    python -m ingestion.main search "What is the dropout rate?"
"""

import argparse
import asyncio
import sys
from pathlib import Path
from uuid import UUID

from dotenv import load_dotenv

load_dotenv()

from ingestion.config import settings
from ingestion.pipeline.orchestrator import PipelineOrchestrator
from ingestion.services.embedding_service import EmbeddingService
from ingestion.services.supabase_client import SupabaseClient

import structlog
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

logger = structlog.get_logger(__name__)
console = Console()


async def cmd_ingest(args: argparse.Namespace) -> None:
    """Run the ingestion pipeline on a file."""
    orchestrator = PipelineOrchestrator()

    if args.storage_path:
        console.print(f"[bold blue]Ingesting from storage:[/] {args.storage_path}")
        result = await orchestrator.run_from_storage(
            storage_path=args.storage_path,
            file_name=args.file_name,
            source_type=args.source_type,
            tags=args.tags.split(",") if args.tags else None,
        )
    elif args.file:
        local_path = Path(args.file)
        if not local_path.exists():
            console.print(f"[red]File not found:[/] {args.file}")
            sys.exit(1)
        console.print(f"[bold blue]Ingesting local file:[/] {local_path}")
        result = await orchestrator.run_from_local(
            local_path=local_path,
            source_type=args.source_type,
            tags=args.tags.split(",") if args.tags else None,
            upload_to_supabase=not args.no_upload,
        )
    else:
        console.print("[red]Provide --file or --storage-path[/]")
        sys.exit(1)

    # Print result
    _print_pipeline_result(result)
    if result.status == "completed":
        console.print(f"\n[green]Pipeline completed successfully![/]")
    else:
        console.print(f"\n[red]Pipeline failed:[/] {result.error_message}")


async def cmd_status(args: argparse.Namespace) -> None:
    """Check status of a document."""
    supabase = SupabaseClient()
    doc = supabase.get_document(UUID(args.document_id))

    if not doc:
        console.print("[red]Document not found[/]")
        return

    table = Table(title=f"Document: {doc.get('file_name', 'Unknown')}")
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="white")

    for key, value in doc.items():
        if value is not None:
            table.add_row(key, str(value)[:100])

    console.print(table)


async def cmd_search(args: argparse.Namespace) -> None:
    """Search using vector similarity."""
    supabase = SupabaseClient()
    embeddings = EmbeddingService()

    query_embedding = await embeddings.embed_text(args.query)
    results = supabase.search_vectors(
        query_embedding=query_embedding,
        match_count=args.limit,
        similarity_threshold=args.threshold,
    )

    if not results:
        console.print("[yellow]No results found[/]")
        return

    console.print(f"\n[bold]Search results for:[/] {args.query}\n")
    for i, r in enumerate(results, 1):
        content = r.get("content", "")[:300]
        similarity = r.get("similarity", 0) * 100
        panel = Panel(
            content,
            title=f"[bold]#{i}[/] {r.get('document_name', 'Unknown')} (p.{r.get('page_number', '?')}) — {similarity:.1f}% match",
            border_style="green" if similarity > 80 else "yellow",
        )
        console.print(panel)


def _print_pipeline_result(result) -> None:
    """Pretty-print pipeline result."""
    table = Table(title="Pipeline Result")
    table.add_column("Metric", style="cyan")
    table.add_column("Value", style="white")

    table.add_row("Status", f"[{'green' if result.status == 'completed' else 'red'}]{result.status}[/]")
    table.add_row("Document ID", str(result.document_id))
    table.add_row("File", result.file_name)
    table.add_row("Pages", str(result.page_count))
    table.add_row("Chunks", str(result.total_chunks))
    table.add_row("Vectors", str(result.total_vectors))
    table.add_row("Duration", f"{result.total_duration_ms:,}ms")

    if result.error_message:
        table.add_row("Error", f"[red]{result.error_message[:200]}[/]")

    console.print(table)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="UCAR RAG Ingestion Pipeline",
        prog="ucar-ingest",
    )
    subparsers = parser.add_subparsers(dest="command", help="Commands")

    # ingest command
    ingest_parser = subparsers.add_parser("ingest", help="Run ingestion pipeline")
    ingest_group = ingest_parser.add_mutually_exclusive_group(required=True)
    ingest_group.add_argument("--file", "-f", help="Local file path to ingest")
    ingest_group.add_argument("--storage-path", "-s", help="Path in Supabase Storage bucket")
    ingest_parser.add_argument("--file-name", help="Override display filename")
    ingest_parser.add_argument("--source-type", default="manual_upload", help="Document source type")
    ingest_parser.add_argument("--tags", help="Comma-separated tags")
    ingest_parser.add_argument("--no-upload", action="store_true", help="Skip upload to Supabase Storage (local only)")
    ingest_parser.set_defaults(func=cmd_ingest)

    # status command
    status_parser = subparsers.add_parser("status", help="Check document status")
    status_parser.add_argument("document_id", help="Document UUID")
    status_parser.set_defaults(func=cmd_status)

    # search command
    search_parser = subparsers.add_parser("search", help="Semantic search")
    search_parser.add_argument("query", help="Search query text")
    search_parser.add_argument("--limit", "-n", type=int, default=5, help="Max results")
    search_parser.add_argument("--threshold", "-t", type=float, default=0.5, help="Similarity threshold (0-1)")
    search_parser.set_defaults(func=cmd_search)

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Run async command
    asyncio.run(args.func(args))


if __name__ == "__main__":
    main()
