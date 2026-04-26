"""Text chunking strategies for the ingestion pipeline.

Handles splitting parsed document elements into overlapping chunks
suitable for vectorization and retrieval.
"""

import re
from typing import Any
from uuid import UUID, uuid4

import structlog
from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)

from ingestion.config import settings
from ingestion.models.schemas import ChunkRecord

logger = structlog.get_logger(__name__)


class DocumentChunker:
    """Splits parsed document elements into overlapping text chunks."""

    def __init__(
        self,
        chunk_size: int | None = None,
        chunk_overlap: int | None = None,
    ) -> None:
        self.chunk_size = chunk_size or settings.chunk_size
        self.chunk_overlap = chunk_overlap or settings.chunk_overlap

        self._text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""],
            is_separator_regex=False,
        )

        self._md_splitter = MarkdownHeaderTextSplitter(
            headers_to_split_on=[
                ("#", "header_1"),
                ("##", "header_2"),
                ("###", "header_3"),
                ("####", "header_4"),
            ],
            strip_headers=True,
        )

    def chunk_elements(
        self,
        elements: list[dict[str, Any]],
        document_id: UUID,
    ) -> list[ChunkRecord]:
        """Convert Unstructured.io elements into ChunkRecords.

        Groups elements by page, then by section (detected headings),
        and splits into overlapping chunks.

        Args:
            elements: List of parsed elements from Unstructured.io
            document_id: UUID of the parent document

        Returns:
            List of ChunkRecord with correct chunk_index ordering
        """
        # First, extract page number info from page break elements
        page_map = self._build_page_map(elements)

        # Group elements by page for context
        elements_by_page: dict[int, list[dict[str, Any]]] = {}
        for el in elements:
            elem_type = el.get("type", "")
            if elem_type == "PageBreak":
                continue  # Skip page breaks, we use page_map
            page_num = el.get("metadata", {}).get("page_number", 1)
            elements_by_page.setdefault(page_num, []).append(el)

        # Convert each page's elements to text and chunk
        chunks: list[ChunkRecord] = []
        chunk_index = 0

        for page_num in sorted(elements_by_page.keys()):
            page_elements = elements_by_page[page_num]
            page_text = self._elements_to_text(page_elements)
            section_title = self._detect_section_title(page_elements)

            if not page_text.strip():
                continue

            # Split page text into chunks
            text_chunks = self._text_splitter.split_text(page_text)

            for text_chunk in text_chunks:
                chunk = ChunkRecord(
                    id=uuid4(),
                    document_id=document_id,
                    chunk_index=chunk_index,
                    content=text_chunk,
                    content_length=len(text_chunk),
                    page_number=page_num,
                    section_title=section_title,
                    chunk_type="text",
                    previous_chunk_id=chunks[-1].id if chunks else None,
                    next_chunk_id=None,  # Set in second pass
                    source_element_type="paragraph",
                    metadata={
                        "page_number": page_num,
                        "char_count": len(text_chunk),
                        "word_count": len(text_chunk.split()),
                    },
                )
                chunks.append(chunk)
                chunk_index += 1

        # Second pass: link previous/next chunks
        for i in range(len(chunks)):
            if i > 0:
                chunks[i].previous_chunk_id = chunks[i - 1].id
            if i < len(chunks) - 1:
                chunks[i].next_chunk_id = chunks[i + 1].id

        logger.info(
            "chunking_complete",
            document_id=str(document_id),
            total_chunks=len(chunks),
            total_pages=len(elements_by_page),
        )
        return chunks

    def chunk_text(self, text: str, document_id: UUID) -> list[ChunkRecord]:
        """Chunk plain text (no element metadata)."""
        text_chunks = self._text_splitter.split_text(text)
        chunks = []
        for i, content in enumerate(text_chunks):
            chunk = ChunkRecord(
                id=uuid4(),
                document_id=document_id,
                chunk_index=i,
                content=content,
                content_length=len(content),
                chunk_type="text",
                previous_chunk_id=chunks[-1].id if chunks else None,
                metadata={"char_count": len(content), "word_count": len(content.split())},
            )
            chunks.append(chunk)
        # Link next pointers
        for i in range(len(chunks)):
            if i < len(chunks) - 1:
                chunks[i].next_chunk_id = chunks[i + 1].id
        return chunks

    # ────────────────── Helpers ──────────────────

    def _build_page_map(self, elements: list[dict[str, Any]]) -> dict[int, int]:
        """Build a mapping from element index to page number."""
        page_map: dict[int, int] = {}
        current_page = 1
        for i, el in enumerate(elements):
            if el.get("type") == "PageBreak":
                current_page = el.get("metadata", {}).get("page_number", current_page + 1)
            page_map[i] = current_page
        return page_map

    def _elements_to_text(self, elements: list[dict[str, Any]]) -> str:
        """Convert a list of elements to a single text block.

        Handles different element types:
        - Title/Header: prepended with # markers
        - ListItem: bullet points
        - Table: formatted as markdown table
        - NarrativeText/UncategorizedText: plain text
        """
        lines = []
        for el in elements:
            el_type = el.get("type", "")
            text = el.get("text", "").strip()
            if not text:
                continue

            if el_type in ("Title",):
                lines.append(f"# {text}")
            elif el_type in ("Header", "SectionHeader"):
                lines.append(f"## {text}")
            elif el_type == "ListItem":
                lines.append(f"- {text}")
            elif el_type == "Table":
                lines.append(self._format_table_element(el))
            elif el_type in ("NarrativeText", "UncategorizedText", "Text"):
                lines.append(text)
            elif el_type == "Formula":
                lines.append(f"```\n{text}\n```")
            else:
                lines.append(text)

        return "\n\n".join(lines)

    def _format_table_element(self, el: dict[str, Any]) -> str:
        """Format a table element as markdown table string."""
        metadata = el.get("metadata", {})
        text = el.get("text", "")

        # Unstructured.io returns tables as CSV-like text or HTML
        if metadata.get("text_as_html"):
            html = metadata["text_as_html"]
            return self._html_table_to_md(html)
        return text

    @staticmethod
    def _html_table_to_md(html: str) -> str:
        """Simple HTML table to markdown conversion."""
        # Strip HTML tags, convert <tr> to newlines, <td>/<th> to pipe-separated
        text = re.sub(r"</?thead>|</?tbody>", "", html)
        text = re.sub(r"</tr>", "\n", text)
        text = re.sub(r"</t[dh]>", " | ", text)
        text = re.sub(r"<[^>]+>", "", text)
        text = re.sub(r"\n\s*\n", "\n", text)
        lines = [l.strip() for l in text.strip().split("\n") if l.strip()]
        return "\n".join(f"| {l} |" for l in lines)

    def _detect_section_title(self, elements: list[dict[str, Any]]) -> str | None:
        """Detect the first Title or Header element as the section title."""
        for el in elements:
            if el.get("type") in ("Title", "Header", "SectionHeader"):
                return el.get("text", "").strip()
        return None
