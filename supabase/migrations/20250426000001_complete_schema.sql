-- ================================================================
-- UCAR INTELLIGENCE PLATFORM — SUPABASE-COMPATIBLE SCHEMA
-- STEP 1: First go to Dashboard → Database → Extensions → Enable "vector"
-- STEP 2: Then run this entire file in SQL Editor
-- ================================================================

-- Enable extensions (in Supabase, extensions live in "extensions" schema)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA extensions;
-- vector extension must be enabled from Dashboard first, then this works:
CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA extensions;

-- ─── ROLES ───
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    accent_color TEXT DEFAULT '#1E3A5F',
    icon TEXT DEFAULT 'Home',
    route_prefix TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PERMISSIONS ───
CREATE TABLE IF NOT EXISTS permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    resource TEXT NOT NULL,
    action TEXT NOT NULL,
    scope TEXT DEFAULT 'own',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── USERS ───
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    encrypted_password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role_id UUID REFERENCES roles(id),
    service_id TEXT,
    service_name TEXT,
    assigned_by UUID REFERENCES users(id),
    institution_ids UUID[] DEFAULT '{}',
    can_access_all BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    phone TEXT,
    title TEXT,
    avatar_url TEXT,
    two_factor_enabled BOOLEAN DEFAULT false,
    two_factor_secret TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INSTITUTIONS ───
CREATE TABLE IF NOT EXISTS institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    city TEXT,
    established_year INTEGER,
    total_students INTEGER DEFAULT 0,
    total_staff INTEGER DEFAULT 0,
    logo_url TEXT,
    accreditation_status TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── KPI DEFINITIONS ───
CREATE TABLE IF NOT EXISTS kpi_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    unit TEXT DEFAULT '%',
    description TEXT,
    formula_sql TEXT,
    domain_slug TEXT,
    target_default NUMERIC,
    weight NUMERIC DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── KPI VALUES ───
CREATE TABLE IF NOT EXISTS kpi_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    kpi_slug TEXT REFERENCES kpi_definitions(slug),
    value NUMERIC NOT NULL,
    target NUMERIC,
    unit TEXT DEFAULT '%',
    trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
    trend_value NUMERIC,
    period TEXT,
    is_validated BOOLEAN DEFAULT false,
    validated_by UUID REFERENCES users(id),
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ANOMALIES ───
CREATE TABLE IF NOT EXISTS anomalies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    kpi_slug TEXT REFERENCES kpi_definitions(slug),
    domain_slug TEXT,
    severity TEXT CHECK (severity IN ('critical', 'warning', 'info')),
    title TEXT NOT NULL,
    description TEXT,
    z_score NUMERIC,
    shap_factors JSONB DEFAULT '[]',
    status TEXT CHECK (status IN ('pending', 'acknowledged', 'investigating', 'false_positive')) DEFAULT 'pending',
    detected_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id),
    notes TEXT
);

-- ─── PUBLICATIONS ───
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    doi TEXT UNIQUE,
    journal TEXT,
    year INTEGER,
    authors TEXT[] DEFAULT '{}',
    institution_id UUID REFERENCES institutions(id),
    is_ucar_affiliated BOOLEAN DEFAULT false,
    citations INTEGER DEFAULT 0,
    fwci NUMERIC,
    sdg_mapped TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── RESEARCH PROJECTS ───
CREATE TABLE IF NOT EXISTS research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    institution_id UUID REFERENCES institutions(id),
    lead_researcher TEXT,
    funding_amount NUMERIC DEFAULT 0,
    funding_source TEXT,
    status TEXT DEFAULT 'En cours',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── GREENMETRIC ───
CREATE TABLE IF NOT EXISTS greenmetric_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    year INTEGER NOT NULL,
    total_score NUMERIC DEFAULT 0,
    max_score NUMERIC DEFAULT 10000,
    setting_infrastructure_score NUMERIC DEFAULT 0,
    setting_infrastructure_max NUMERIC DEFAULT 1500,
    energy_climate_score NUMERIC DEFAULT 0,
    energy_climate_max NUMERIC DEFAULT 2100,
    waste_score NUMERIC DEFAULT 0,
    waste_max NUMERIC DEFAULT 1800,
    water_score NUMERIC DEFAULT 0,
    water_max NUMERIC DEFAULT 1000,
    transportation_score NUMERIC DEFAULT 0,
    transportation_max NUMERIC DEFAULT 1800,
    education_score NUMERIC DEFAULT 0,
    education_max NUMERIC DEFAULT 1400,
    governance_score NUMERIC DEFAULT 0,
    governance_max NUMERIC DEFAULT 900,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(institution_id, year)
);

-- ─── RANKINGS ───
CREATE TABLE IF NOT EXISTS rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    ranking_system TEXT NOT NULL,
    rank TEXT NOT NULL,
    year INTEGER NOT NULL,
    score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── DOCUMENTS (for RAG) ───
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT,
    file_size_bytes BIGINT,
    institution_id UUID REFERENCES institutions(id),
    department_id UUID,
    uploaded_by UUID REFERENCES users(id),
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploaded', 'parsing', 'parsed', 'chunking', 'chunked', 'vectorizing', 'completed', 'failed')),
    page_count INTEGER,
    extracted_text_length INTEGER,
    total_chunks INTEGER DEFAULT 0,
    total_vectors INTEGER DEFAULT 0,
    embedding_model TEXT,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ
);

-- ─── CHUNKS (for RAG) ───
CREATE TABLE IF NOT EXISTS chunks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    content_length INTEGER DEFAULT 0,
    page_number INTEGER,
    section_title TEXT,
    chunk_type TEXT DEFAULT 'text',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── VECTORS (pgvector via extensions.vector) ───
CREATE TABLE IF NOT EXISTS vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id UUID REFERENCES chunks(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    embedding vector(1536),
    embedding_model TEXT,
    institution_id UUID REFERENCES institutions(id),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- HNSW index for fast vector similarity search
CREATE INDEX IF NOT EXISTS vectors_embedding_idx ON vectors USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 200);

-- ─── OFFRE CALLS ───
CREATE TABLE IF NOT EXISTS offre_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    service_id TEXT,
    budget_estimated NUMERIC,
    ai_probability NUMERIC,
    ai_recommendation TEXT,
    deadline date,
    status TEXT DEFAULT 'predicted' CHECK (status IN ('predicted', 'drafted', 'published', 'evaluation', 'awarded', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── EVENTS LOG ───
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id),
    event_type TEXT NOT NULL,
    event_status TEXT DEFAULT 'in_progress',
    payload JSONB DEFAULT '{}',
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ================================================================
-- SEED DATA
-- ================================================================

-- Seed: 14 Roles
INSERT INTO roles (slug, label, level, accent_color, route_prefix) VALUES
('president', 'Présidence', 0, '#1E3A5F', '/president'),
('svc_secretaire', 'Secrétariat Général', 1, '#4A5568', '/sg'),
('svc_rh', 'Service RH', 2, '#0D9488', '/rh'),
('svc_enseignement', 'Service Personnel Enseignant', 2, '#7C3AED', '/enseignement'),
('svc_bibliotheque', 'Service Bibliothèque', 2, '#B45309', '/bibliotheque'),
('svc_finances', 'Service Affaires Financières', 2, '#059669', '/finances'),
('svc_equipement', 'Service Équipement & Bâtiments', 2, '#D97706', '/equipement'),
('svc_informatique', 'Service Informatique', 2, '#2563EB', '/informatique'),
('svc_budget', 'Service Budget', 2, '#0891B2', '/budget'),
('svc_juridique', 'Service Affaires Juridiques', 2, '#991B1B', '/juridique'),
('svc_academique', 'Service Affaires Académiques', 2, '#4F46E5', '/academique'),
('svc_recherche', 'Service Recherche & Coopération', 2, '#9333EA', '/recherche'),
('teacher', 'Enseignant', 3, '#0369A1', '/teacher'),
('student', 'Étudiant', 4, '#16A34A', '/student')
ON CONFLICT (slug) DO NOTHING;

-- Seed: President can do everything
INSERT INTO permissions (role_id, resource, action, scope)
SELECT id, 'all', 'admin', 'all' FROM roles WHERE slug = 'president'
ON CONFLICT DO NOTHING;

-- Seed: Service heads can manage their domain
INSERT INTO permissions (role_id, resource, action, scope)
SELECT r.id, 'domain', 'manage', 'own_institution'
FROM roles r WHERE r.level = 2
ON CONFLICT DO NOTHING;

-- Seed: Default President User (password: ucar2024)
INSERT INTO users (email, encrypted_password, first_name, last_name, role_id, service_id, service_name, can_access_all, is_active)
SELECT 'president@ucar.tn',
       crypt('ucar2024', gen_salt('bf')),
       'Nadia', 'Mzoughi Aguir',
       (SELECT id FROM roles WHERE slug = 'president'),
       'presidence', 'Présidence',
       true, true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'president@ucar.tn');

-- ================================================================
-- RLS POLICIES (enable after seed)
-- ================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- President sees all
DROP POLICY IF EXISTS "President can see all" ON users;
CREATE POLICY "President can see all" ON users FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM roles r JOIN users u ON u.role_id = r.id
        WHERE u.id = auth.uid() AND r.level = 0
    )
);

-- Users see own institution data
DROP POLICY IF EXISTS "Users see own institution" ON kpi_values;
CREATE POLICY "Users see own institution" ON kpi_values FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE id = auth.uid()
        AND (can_access_all = true OR institution_id = ANY(institution_ids))
    )
);

-- Done!
SELECT 'Schema created successfully' AS result;
