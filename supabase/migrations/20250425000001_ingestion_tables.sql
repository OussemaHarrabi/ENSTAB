-- ============================================================
-- UCAR RAG Ingestion Pipeline - Database Schema
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- ============================================================
-- 1. DOCUMENTS TABLE
-- Tracks every document uploaded for ingestion
-- ============================================================
CREATE TABLE IF NOT EXISTS ingestion.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Source identification
    storage_path TEXT NOT NULL,                    -- Path in Supabase Storage bucket
    storage_bucket TEXT NOT NULL DEFAULT 'documents',
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,                       -- 'pdf', 'docx', 'xlsx', 'csv', 'image', 'txt'
    file_size_bytes BIGINT,
    mime_type TEXT,
    
    -- Content hash for deduplication
    content_hash TEXT,                             -- SHA-256 of file content
    
    -- Metadata
    institution_id UUID,
    department_id UUID,
    source_type TEXT,                              -- 'enquiry_response', 'report', 'manual_upload', 'migration'
    uploaded_by UUID,                              -- Profile ID of uploader
    tags TEXT[] DEFAULT '{}',
    
    -- Processing status
    status TEXT NOT NULL DEFAULT 'uploaded',       -- 'uploaded', 'parsing', 'parsed', 'chunking', 'chunked', 
                                                   -- 'vectorizing', 'completed', 'failed'
    error_message TEXT,
    
    -- Parsing metadata
    parsed_at TIMESTAMPTZ,
    page_count INTEGER,
    extracted_text_length INTEGER,
    
    -- Chunking metadata
    chunked_at TIMESTAMPTZ,
    total_chunks INTEGER DEFAULT 0,
    
    -- Vectorization metadata
    vectorized_at TIMESTAMPTZ,
    total_vectors INTEGER DEFAULT 0,
    embedding_model TEXT,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Indexes
    CONSTRAINT valid_status CHECK (status IN (
        'uploaded', 'parsing', 'parsed', 'chunking', 'chunked', 
        'vectorizing', 'completed', 'failed'
    ))
);

CREATE INDEX idx_documents_status ON ingestion.documents(status);
CREATE INDEX idx_documents_institution ON ingestion.documents(institution_id);
CREATE INDEX idx_documents_content_hash ON ingestion.documents(content_hash);
CREATE INDEX idx_documents_file_type ON ingestion.documents(file_type);
CREATE INDEX idx_documents_created_at ON ingestion.documents(created_at DESC);

-- ============================================================
-- 2. CHUNKS TABLE
-- Stores text chunks extracted from documents
-- ============================================================
CREATE TABLE IF NOT EXISTS ingestion.chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Parent document
    document_id UUID NOT NULL REFERENCES ingestion.documents(id) ON DELETE CASCADE,
    
    -- Chunk content
    chunk_index INTEGER NOT NULL,                  -- Position in document (0-based)
    content TEXT NOT NULL,                         -- The actual text chunk
    content_length INTEGER,                        -- Character count
    
    -- Chunk metadata
    page_number INTEGER,                           -- Source page (for PDFs)
    section_title TEXT,                            -- Detected section heading
    chunk_type TEXT,                               -- 'text', 'table', 'list', 'header', 'footer'
    
    -- Overlap tracking
    previous_chunk_id UUID REFERENCES ingestion.chunks(id),
    next_chunk_id UUID REFERENCES ingestion.chunks(id),
    
    -- Source traceability
    source_element_type TEXT,                      -- 'paragraph', 'table', 'list_item', 'title'
    source_coordinates JSONB,                      -- Position in original document
    
    -- Metadata for retrieval
    metadata JSONB DEFAULT '{}',                   -- Flexible metadata (language, entities, etc.)
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes
    UNIQUE(document_id, chunk_index)
);

CREATE INDEX idx_chunks_document_id ON ingestion.chunks(document_id);
CREATE INDEX idx_chunks_chunk_index ON ingestion.chunks(document_id, chunk_index);
CREATE INDEX idx_chunks_page_number ON ingestion.chunks(document_id, page_number);

-- ============================================================
-- 3. VECTORS TABLE (pgvector)
-- Stores vector embeddings for semantic search
-- ============================================================
CREATE TABLE IF NOT EXISTS ingestion.vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Link to chunk
    chunk_id UUID NOT NULL REFERENCES ingestion.chunks(id) ON DELETE CASCADE,
    document_id UUID NOT NULL REFERENCES ingestion.documents(id) ON DELETE CASCADE,
    
    -- The embedding vector (1536 dimensions for text-embedding-3-small)
    embedding vector(1536) NOT NULL,
    
    -- Embedding metadata
    embedding_model TEXT NOT NULL,
    embedding_dimension INTEGER NOT NULL DEFAULT 1536,
    
    -- Content for hybrid search
    content_preview TEXT,                          -- First 200 chars of chunk for display
    
    -- Metadata for filtered search
    institution_id UUID,
    department_id UUID,
    document_type TEXT,
    tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes
    CONSTRAINT valid_dimension CHECK (embedding_dimension > 0)
);

-- IVFFlat index for approximate nearest neighbor search
CREATE INDEX idx_vectors_embedding ON ingestion.vectors 
    USING ivfflat (embedding vector_cosine_ops) 
    WITH (lists = 100);

-- Additional indexes for filtered search
CREATE INDEX idx_vectors_document_id ON ingestion.vectors(document_id);
CREATE INDEX idx_vectors_institution ON ingestion.vectors(institution_id);
CREATE INDEX idx_vectors_document_type ON ingestion.vectors(document_type);

-- ============================================================
-- 4. INGESTION EVENTS TABLE
-- Audit log of all pipeline events
-- ============================================================
CREATE TABLE IF NOT EXISTS ingestion.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event details
    document_id UUID REFERENCES ingestion.documents(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,                      -- 'pipeline_started', 'parsing_complete', 
                                                   -- 'chunking_complete', 'vectorization_complete',
                                                   -- 'pipeline_completed', 'pipeline_failed'
    event_status TEXT NOT NULL,                    -- 'success', 'failure', 'in_progress'
    
    -- Event data
    payload JSONB DEFAULT '{}',                    -- Event-specific data
    error_details TEXT,
    
    -- Performance metrics
    duration_ms INTEGER,                           -- How long this step took
    chunks_processed INTEGER,
    vectors_generated INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_document_id ON ingestion.events(document_id);
CREATE INDEX idx_events_type ON ingestion.events(event_type);
CREATE INDEX idx_events_created_at ON ingestion.events(created_at DESC);

-- ============================================================
-- 5. HELPER FUNCTIONS
-- ============================================================

-- Function to update document status and timestamp
CREATE OR REPLACE FUNCTION ingestion.update_document_status(
    p_document_id UUID,
    p_status TEXT,
    p_error_message TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE ingestion.documents 
    SET 
        status = p_status,
        error_message = COALESCE(p_error_message, error_message),
        updated_at = NOW(),
        completed_at = CASE 
            WHEN p_status IN ('completed', 'failed') THEN NOW() 
            ELSE completed_at 
        END
    WHERE id = p_document_id;
END;
$$ LANGUAGE plpgsql;

-- Function to check for duplicate documents by hash
CREATE OR REPLACE FUNCTION ingestion.check_duplicate(
    p_content_hash TEXT
) RETURNS TABLE(
    existing_id UUID,
    existing_name TEXT,
    existing_status TEXT,
    existing_created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.file_name, d.status, d.created_at
    FROM ingestion.documents d
    WHERE d.content_hash = p_content_hash
    AND d.status = 'completed'
    ORDER BY d.created_at DESC
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE ingestion.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion.chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion.vectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion.events ENABLE ROW LEVEL SECURITY;

-- Service role bypass (for backend pipeline)
CREATE POLICY "service_role_full_access" ON ingestion.documents
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access" ON ingestion.chunks
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access" ON ingestion.vectors
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_role_full_access" ON ingestion.events
    FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 7. SEARCH FUNCTION (for RAG retrieval)
-- ============================================================
CREATE OR REPLACE FUNCTION ingestion.search_similar_chunks(
    query_embedding vector(1536),
    match_count INTEGER DEFAULT 5,
    filter_institution_id UUID DEFAULT NULL,
    filter_document_type TEXT DEFAULT NULL,
    similarity_threshold FLOAT DEFAULT 0.7
) RETURNS TABLE(
    chunk_id UUID,
    document_id UUID,
    content TEXT,
    document_name TEXT,
    page_number INTEGER,
    similarity FLOAT,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.chunk_id,
        v.document_id,
        c.content,
        d.file_name AS document_name,
        c.page_number,
        1 - (v.embedding <=> query_embedding) AS similarity,
        c.metadata
    FROM ingestion.vectors v
    JOIN ingestion.chunks c ON c.id = v.chunk_id
    JOIN ingestion.documents d ON d.id = v.document_id
    WHERE (filter_institution_id IS NULL OR v.institution_id = filter_institution_id)
      AND (filter_document_type IS NULL OR v.document_type = filter_document_type)
      AND 1 - (v.embedding <=> query_embedding) > similarity_threshold
    ORDER BY v.embedding <=> query_embedding
    LIMIT match_count;
END;
$$ LANGUAGE plpgsql;