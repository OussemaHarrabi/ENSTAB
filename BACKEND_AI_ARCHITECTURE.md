# UCAR Intelligence Platform — Backend, AI & Supabase Architecture
# Complete Implementation Plan for Opus 4.6 / AI Agent

---

## TABLE OF CONTENTS
1. [Requirements & Prerequisites](#1-requirements--prerequisites)
2. [Environment Variables](#2-environment-variables-env)
3. [Architecture Overview](#3-architecture-overview)
4. [Supabase Database Schema](#4-supabase-database-schema)
5. [Authentication & RBAC with 2FA](#5-authentication--rbac-with-2fa)
6. [REST API Implementation (80+ Endpoints)](#6-rest-api-implementation-80-endpoints)
7. [AI Services Architecture](#7-ai-services-architecture)
8. [Anomaly Detection System](#8-anomaly-detection-system)
9. [Appel d'Offres Prediction System](#9-appel-doffres-prediction-system)
10. [RAG Ingestion Pipeline](#10-rag-ingestion-pipeline)
11. [AI Chat System](#11-ai-chat-system)
12. [Deployment & Testing](#12-deployment--testing)
13. [What You (Oussema) Should Do](#13-what-you-oussema-should-do)
14. [What The AI Agent Should Build](#14-what-the-ai-agent-should-build)
15. [Ultimate Prompt for Opus 4.6](#15-ultimate-prompt-for-opus-46)

---

## 1. REQUIREMENTS & PREREQUISITES

### What You Need To Provide Before Starting:
- [x] Frontend built, tested, and pushed (141 routes, 0 TypeScript errors)
- [x] Full API contract document (api-contract.md)
- [x] Supabase project created: qslfgwcyynqwfllfqmdf.supabase.co
- [ ] .env file with all API keys (see Section 2)
- [ ] Supabase SQL migration executed (copy-paste into SQL Editor)

### What The AI Agent Will Build:
1. **FastAPI Backend** — All REST endpoints from api-contract.md
2. **AI Services** — Anomaly detection, Appel d'offres prediction, RAG chat
3. **Supabase Integration** — Auth, pgvector, RLS, Storage
4. **Python ML Pipeline** — Predictive analytics with Prophet/Scikit-learn

### Tech Stack:
| Layer | Technology |
|-------|-----------|
| Backend | FastAPI (Python 3.11+) + Pydantic v2 |
| Database | Supabase PostgreSQL 15 + pgvector |
| Auth | Supabase Auth + JWT + TOTP 2FA |
| AI/ML | OpenAI GPT-4o, LangChain, Scikit-learn, Prophet |
| Vector DB | pgvector (in Supabase) |
| RAG | LangChain + OpenAI embeddings (text-embedding-3-small) |
| ETL | Python: Unstructured.io + Pandas + PDFPlumber |
| Queue | Celery + Redis (for async tasks) |
| Storage | Supabase Storage (S3-compatible) |
| Monitoring | Sentry + structlog |

---

## 2. ENVIRONMENT VARIABLES (.env)

Create this file at `backend/.env`:

```env
# ───── Supabase ─────
SUPABASE_URL=https://qslfgwcyynqwfllfqmdf.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbGZnd2N5eW53cWZsbGZxbWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxNjk4MDAsImV4cCI6MjAyMDc0NTgwMH0.hP9-yOY6JBf8uWYXeqg8m9KpUMVZ1ZZqB_nXKxYpFkY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzbGZnd2N5eW53cWZsbGZxbWRmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNTE2OTgwMCwiZXhwIjoyMDIwNzQ1ODAwfQ.your_service_role_key_here
SUPABASE_DB_URL=postgresql://postgres:[DB_PASSWORD]@db.qslfgwcyynqwfllfqmdf.supabase.co:5432/postgres
SUPABASE_DB_PASSWORD=Sk@nthebest20
SUPABASE_STORAGE_BUCKET=documents

# ───── OpenAI ─────
OPENAI_API_KEY=sk-your-openai-key
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
OPENAI_CHAT_MODEL=gpt-4o

# ───── Unstructured.io ─────
UNSTRUCTURED_API_KEY=your-unstructured-key
UNSTRUCTURED_API_URL=https://api.unstructured.io/general/v0/general

# ───── Redis (for Celery) ─────
REDIS_URL=redis://localhost:6379/0

# ───── JWT ─────
JWT_SECRET=ucar-hackathon-2025-super-secret-key-change-me

# ───── App ─────
APP_ENV=development
APP_DEBUG=true
API_BASE_URL=http://localhost:8000/api/v1
FRONTEND_URL=http://localhost:3000
```

---

## 3. ARCHITECTURE OVERVIEW

```
┌──────────────────────────────────────────────────────────────┐
│                   FRONTEND (Next.js 16)                      │
│   http://localhost:3000 - 141 routes, 14 roles               │
└────────────────────────┬─────────────────────────────────────┘
                         │ HTTPS
              ┌──────────▼──────────┐
              │   FastAPI Backend    │  ← The AI Agent builds THIS
              │   http://localhost:8000   │
              │                       │
              │  ┌─────────────────┐  │
              │  │ REST API Routes │  │  ← 80+ endpoints
              │  └────────┬────────┘  │
              │  ┌────────▼────────┐  │
              │  │  Service Layer   │  │  ← Business logic
              │  └────────┬────────┘  │
              │  ┌────────▼────────┐  │
              │  │  AI Services     │  │  ← Anomaly, Predict, RAG
              │  └────────┬────────┘  │
              │  ┌────────▼────────┐  │
              │  │  Data Layer      │  │  ← Supabase + pgvector
              │  └─────────────────┘  │
              └──────────┬────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
┌────────▼───────┐ ┌─────▼──────┐ ┌──────▼──────┐
│   Supabase     │ │   Redis    │ │   OpenAI    │
│  PostgreSQL    │ │  (Celery)  │ │  GPT-4o     │
│  + pgvector    │ │            │ │  Embeddings │
└────────────────┘ └────────────┘ └─────────────┘
```

### Directory Structure The AI Agent Should Create:

```
backend/
├── .env
├── requirements.txt
├── pyproject.toml
├── alembic.ini
├── Dockerfile
├── docker-compose.yml
├── main.py                          # FastAPI entry point
├── config.py                         # Settings from .env
│
├── api/
│   ├── __init__.py
│   ├── deps.py                       # Dependency injection (DB, auth)
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── router.py                 # Aggregates all route modules
│   │   ├── auth.py                   # POST /auth/login, /auth/refresh, etc.
│   │   ├── institutions.py           # CRUD + KPIs for institutions
│   │   ├── analytics.py              # Aggregate KPIs, forecasts, benchmarks
│   │   ├── anomalies.py              # GET/PUT anomalies
│   │   ├── research.py               # Publications, projects, affiliation
│   │   ├── greenmetric.py            # GreenMetric & ESG endpoints
│   │   ├── compliance.py             # ISO compliance tracking
│   │   ├── budget.py                 # Budget allocation/execution
│   │   ├── teacher.py                # Teacher endpoints
│   │   ├── student.py                # Student endpoints
│   │   ├── documents.py              # Document ingestion + reports
│   │   ├── chat.py                   # POST /chat/query (AI)
│   │   ├── users.py                  # User management
│   │   ├── rooms.py                  # Room availability
│   │   ├── incidents.py              # Incident reporting
│   │   ├── feedback.py               # Student feedback
│   │   ├── career.py                 # Career & alumni
│   │   └── mobility.py              # Mobility programs
│
├── services/
│   ├── __init__.py
│   ├── institution_service.py
│   ├── analytics_service.py
│   ├── anomaly_service.py
│   ├── research_service.py
│   ├── ai_service.py
│   └── chat_service.py
│
├── ai/
│   ├── __init__.py
│   ├── engine.py                     # AI orchestration engine
│   ├── anomaly_detector.py           # Statistical anomaly detection
│   ├── predictor.py                  # Time-series forecasting
│   ├── offer_predictor.py            # Appel d'offres prediction
│   ├── rag.py                        # RAG search over documents
│   ├── text_to_sql.py                # NL → SQL generation
│   └── report_generator.py           # Automated report writing
│
├── db/
│   ├── __init__.py
│   ├── supabase.py                   # Supabase client connection
│   ├── models.py                     # SQLAlchemy/Pydantic models
│   └── queries.py                    # Raw SQL queries
│
├── auth/
│   ├── __init__.py
│   ├── jwt.py                        # JWT creation/validation
│   ├── rbac.py                       # Role-based access control
│   └── two_factor.py                 # TOTP 2FA implementation
│
├── workers/
│   ├── __init__.py
│   ├── celery_app.py                 # Celery configuration
│   ├── ingestion_worker.py           # Async document ingestion
│   └── report_worker.py              # Report generation
│
└── migrations/
    └── versions/                     # Alembic migrations
```

---

## 4. SUPABASE DATABASE SCHEMA

### Execute this SQL in Supabase SQL Editor (copy-paste):

```sql
-- ================================================================
-- UCAR INTELLIGENCE PLATFORM — COMPLETE SUPABASE SCHEMA
-- ================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ROLES & PERMISSIONS ───

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE, -- president, svc_rh, svc_enseignement, etc.
    label TEXT NOT NULL,       -- Présidence, Service RH, etc.
    level INTEGER NOT NULL DEFAULT 0, -- hierarchy level (0=president, 1=sg, 2=service, 3=teacher, 4=student)
    accent_color TEXT DEFAULT '#1E3A5F',
    icon TEXT DEFAULT 'Home',
    route_prefix TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    resource TEXT NOT NULL,     -- e.g., 'institutions', 'anomalies', 'budget'
    action TEXT NOT NULL,       -- 'read', 'create', 'update', 'delete', 'assign'
    scope TEXT DEFAULT 'own',   -- 'all', 'own_institution', 'own_department'
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── USERS & PROFILES ───

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    encrypted_password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role_id UUID REFERENCES roles(id),
    service_id TEXT,
    service_name TEXT,
    assigned_by UUID REFERENCES users(id),
    institution_ids UUID[] DEFAULT '{}',  -- institutions this user can access
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

CREATE TABLE institutions (
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

CREATE TABLE kpi_definitions (
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

CREATE TABLE kpi_values (
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

CREATE TABLE anomalies (
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

CREATE TABLE publications (
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

CREATE TABLE research_projects (
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

CREATE TABLE greenmetric_entries (
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

CREATE TABLE rankings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    ranking_system TEXT NOT NULL,
    rank TEXT NOT NULL,
    year INTEGER NOT NULL,
    score NUMERIC,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── DOCUMENTS (for RAG) ───

CREATE TABLE documents (
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

CREATE TABLE chunks (
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

-- ─── VECTORS (pgvector) ───

CREATE TABLE vectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chunk_id UUID REFERENCES chunks(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id),
    embedding vector(1536),
    embedding_model TEXT,
    institution_id UUID REFERENCES institutions(id),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create HNSW index for fast vector search
CREATE INDEX ON vectors USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 200);

-- ─── OFFRE CALLS ───

CREATE TABLE offre_calls (
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

CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID REFERENCES documents(id),
    event_type TEXT NOT NULL,
    event_status TEXT DEFAULT 'in_progress',
    payload JSONB DEFAULT '{}',
    duration_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── SEED DATA: Roles ───

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
('student', 'Étudiant', 4, '#16A34A', '/student');

-- ─── SEED: Permissions ───

-- President can do everything
INSERT INTO permissions (role_id, resource, action, scope)
SELECT id, 'all', 'admin', 'all' FROM roles WHERE slug = 'president';

-- Service heads can manage their domain
INSERT INTO permissions (role_id, resource, action, scope)
SELECT r.id, 'domain', 'manage', 'own_institution'
FROM roles r WHERE r.level = 2;

-- ─── SEED: Default Admin User (President) ───
-- Password: ucar2024 (bcrypt hash)
INSERT INTO users (email, encrypted_password, first_name, last_name, role_id, service_id, service_name, can_access_all, is_active)
SELECT 'president@ucar.tn',
       crypt('ucar2024', gen_salt('bf')),
       'Nadia', 'Mzoughi Aguir',
       (SELECT id FROM roles WHERE slug = 'president'),
       'presidence', 'Présidence',
       true, true;

-- ─── RLS Policies ───

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kpi_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;

-- President sees all
CREATE POLICY "President can see all" ON users FOR SELECT USING (
    (SELECT r.level FROM roles r JOIN users u ON u.role_id = r.id WHERE u.id = auth.uid()) = 0
);

-- Users see their own institution
CREATE POLICY "Users see own institution" ON kpi_values FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid()
        AND (can_access_all = true OR institution_id = ANY(institution_ids))
    )
);
```

---

## 5. AUTHENTICATION & RBAC WITH 2FA

### Overview:
- **Login**: Email + password → JWT access token (30 min) + refresh token (7 days)
- **2FA**: TOTP-based (Google Authenticator compatible), enabled per user
- **RBAC**: Each JWT contains `role`, `level`, `service_id`, `institution_ids`
- **Route Protection**: FastAPI dependency checks JWT + role permissions

### 2FA Flow:
1. User logs in with email/password → gets temporary JWT (can only access `/auth/verify-2fa`)
2. If 2FA enabled, user must provide TOTP code → gets full JWT
3. If 2FA not enabled, user gets full JWT directly

### Implementation:
```python
# auth/jwt.py
def create_access_token(user: dict) -> str:
    payload = {
        "sub": user["id"],
        "email": user["email"],
        "role": user["role_slug"],
        "level": user["role_level"],
        "service_id": user["service_id"],
        "institution_ids": user["institution_ids"],
        "can_access_all": user["can_access_all"],
        "exp": datetime.utcnow() + timedelta(minutes=30)
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256")

# auth/two_factor.py
class TwoFactorService:
    def generate_secret(self) -> str: ...
    def verify_code(self, secret: str, code: str) -> bool: ...
    def get_qr_uri(self, email: str, secret: str) -> str: ...  # For QR code setup

# auth/rbac.py
class RBACChecker:
    def __init__(self, jwt_payload: dict):
        self.role = jwt_payload["role"]
        self.level = jwt_payload["level"]
        self.institution_ids = jwt_payload["institution_ids"]

    def can_access_institution(self, institution_id: UUID) -> bool: ...
    def can_manage_users(self) -> bool: ...  # Level <= 2
    def can_assign_role(self, target_role_level: int) -> bool: ...  # Must be higher level
```

---

## 6. REST API IMPLEMENTATION (80+ Endpoints)

The full API contract is documented in `api-contract.md` (1664 lines, 25 sections).

### Priority Implementation Order:

**Phase 1 — Auth & Core (Day 1):**
1. `POST /auth/login` — Email/password + 2FA support
2. `GET /auth/me` — Get current user from JWT
3. `POST /auth/logout` — Invalidate session
4. `POST /auth/refresh` — Refresh JWT
5. `GET /institutions` — List all institutions
6. `GET /institutions/:id` — Single institution

**Phase 2 — Data & Analytics (Day 2):**
7. `GET /institutions/:id/kpis` — KPI values
8. `GET /institutions/:id/domain-kpis` — Domain aggregates
9. `GET /analytics/aggregate` — UCAR-wide KPIs
10. `GET /analytics/enrollment-trend` — Time series
11. `GET /analytics/forecast` — AI predictions
12. `GET /benchmarks/national-averages` — Comparison data

**Phase 3 — Intelligence (Day 3):**
13. `GET /anomalies` — Anomaly alerts
14. `PUT /anomalies/:id/status` — Update anomaly
15. `GET /research-affiliation` — Affiliation stats
16. `GET /publications` — Publication list
17. `GET /greenmetric/aggregate` — GreenMetric
18. `POST /chat/query` — AI chat

**Phase 4 — Operations (Day 4):**
19. `POST /documents/ingest` — Document upload
20. Teacher/Student endpoints
21. Rooms/Incidents/Career endpoints
22. Reports generation

### FastAPI Pattern:
```python
# api/v1/institutions.py
from fastapi import APIRouter, Depends, Query
from api.deps import get_current_user, get_db
from services.institution_service import InstitutionService

router = APIRouter()

@router.get("/institutions")
async def list_institutions(
    search: str = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(35, le=100),
    current_user: dict = Depends(get_current_user),
    db=Depends(get_db)
):
    service = InstitutionService(db)
    return await service.list_institutions(
        user=current_user, search=search, page=page, limit=limit
    )
```

---

## 7. AI SERVICES ARCHITECTURE

### 4 Core AI Services:

| Service | Purpose | Tech | Trigger |
|---------|---------|------|---------|
| **Anomaly Detector** | Detect KPI outliers | Scikit-learn + Z-score | Cron (daily) |
| **Offer Predictor** | Predict future procurement needs | Prophet + OpenAI | Cron (weekly) |
| **RAG Engine** | Search documents with AI | pgvector + LangChain + OpenAI | On-demand (chat) |
| **Text-to-SQL** | NL → SQL for chat queries | OpenAI GPT-4o + schema | On-demand (chat) |

### AI Engine Architecture:
```python
# ai/engine.py
class AIEngine:
    def __init__(self):
        self.anomaly_detector = AnomalyDetector()
        self.offer_predictor = OfferPredictor()
        self.rag_engine = RAGEngine()
        self.text_to_sql = TextToSQL()
        self.llm = ChatOpenAI(model="gpt-4o", temperature=0.1)

    async def detect_anomalies(self, institution_id: UUID = None) -> List[Anomaly]:
        """Daily: Check all KPIs for statistical outliers"""
        ...

    async def predict_offres(self) -> List[OffrePrediction]:
        """Weekly: Predict upcoming procurement calls"""
        ...

    async def chat_query(self, message: str, context: dict) -> ChatResponse:
        """On-demand: Answer user query using RAG + Text-to-SQL"""
        # 1. Determine intent (data query vs. document search)
        intent = await self._classify_intent(message)

        if intent == "data_query":
            # Text-to-SQL path
            sql = await self.text_to_sql.generate(message, context)
            result = await db.fetch_all(sql)
            response = await self.llm.ainvoke([
                SystemMessage("Generate French response from SQL results"),
                HumanMessage(f"Results: {result}\nQuery: {message}")
            ])
            return ChatResponse(response=response, data=result, chartType="table")

        elif intent == "document_search":
            # RAG path
            chunks = await self.rag_engine.search(message, top_k=5)
            context_text = "\n".join(c.content for c in chunks)
            response = await self.llm.ainvoke([
                SystemMessage("Answer based on UCAR documents"),
                HumanMessage(f"Context: {context_text}\nQuestion: {message}")
            ])
            return ChatResponse(response=response, sources=chunks)
```

---

## 8. ANOMALY DETECTION SYSTEM

### How It Works:
1. **Input**: All KPI values across 35 institutions × 20 KPIs = 700 data points
2. **Method**: Statistical Z-score + Isolation Forest ML model
3. **Output**: AnomalyAlert with severity, title, description, and SHAP factors

### Implementation:
```python
# ai/anomaly_detector.py
class AnomalyDetector:
    def detect(self, kpi_values: List[KPIValue]) -> List[AnomalyAlert]:
        anomalies = []

        # Group by KPI slug
        for kpi_slug, group in groupby(kpi_values):
            values = [k.value for k in group]
            mean = statistics.mean(values)
            std = statistics.stdev(values)

            for kpi in group:
                z_score = abs(kpi.value - mean) / std if std > 0 else 0

                if z_score > 3.0:
                    anomalies.append(AnomalyAlert(
                        institution_id=kpi.institution_id,
                        kpi_slug=kpi.kpi_slug,
                        severity="critical",
                        title=f"Anomalie détectée: {kpi.kpi_name}",
                        description=f"Z-score de {z_score:.2f}. Valeur: {kpi.value}, Moyenne: {mean:.2f}",
                        z_score=z_score,
                        shap_factors=self._compute_shap(kpi, group)
                    ))
                elif z_score > 2.0:
                    anomalies.append(AnomalyAlert(severity="warning", z_score=z_score, ...))

        return anomalies

    def _compute_shap(self, kpi, group) -> list[dict]:
        """Which factors contributed most? Uses correlation analysis"""
        factors = []
        # Check correlation with enrollment, budget, staff, etc.
        correlations = compute_correlations(kpi, group)
        for name, corr in sorted(correlations, key=lambda x: abs(x[1]), reverse=True)[:5]:
            factors.append({"name": name, "contribution": round(abs(corr) * 100)})
        return factors
```

### Schedule:
- **Trigger**: Celery cron job every night at 2AM UTC
- **Processing**: Batch process all institutions
- **Storage**: Write anomalies to `anomalies` table
- **Alert**: Push notification to affected institution admins

---

## 9. APPEL D'OFFRES PREDICTION SYSTEM

### How It Works:
1. **Input**: Historical offre data (past 3 years), budget execution patterns, project completion rates
2. **Method**: Prophet time-series forecasting + classification model
3. **Output**: Predicted offer calls for next 6 months with probability scores

### Key Predictors:
- Budget allocation patterns (when departments typically spend)
- Equipment depreciation schedules
- Contract expiry dates
- Regulatory compliance deadlines (ISO audits require procurements)
- Academic calendar (textbook orders before semesters)

### Implementation:
```python
# ai/offer_predictor.py
class OfferPredictor:
    def predict(self, historical_data: pd.DataFrame) -> List[OffrePrediction]:
        predictions = []

        for service_id in ['svc_informatique', 'svc_equipement', 'svc_bibliotheque', ...]:
            service_data = historical_data[historical_data['service_id'] == service_id]

            # Train Prophet model on monthly offer frequency
            model = Prophet(yearly_seasonality=True)
            model.fit(service_data)

            future = model.make_future_dataframe(periods=6, freq='M')
            forecast = model.predict(future)

            for _, row in forecast.tail(6).iterrows():
                predictions.append(OffrePrediction(
                    title=self._generate_title(service_id, row),
                    service_id=service_id,
                    budget_estimated=self._estimate_budget(service_id, row),
                    probability=min(95, max(40, row['yhat'] * 25)),
                    deadline=row['ds']
                ))

        return predictions
```

---

## 10. RAG INGESTION PIPELINE

### Already Built (in `ingestion/` folder):
- ✅ `orchestrator.py` — Full pipeline: download → parse → chunk → embed → store
- ✅ `chunker.py` — LangChain text splitting with overlap
- ✅ `schemas.py` — Pydantic models for documents, chunks, vectors
- ✅ `config.py` — Environment configuration
- ✅ `events.py` — Event logging
- ✅ `services/unstructured_client.py` — Unstructured.io API client
- ✅ `services/embedding_service.py` — OpenAI embeddings
- ✅ `services/supabase_client.py` — Supabase storage + DB client

### What Needs To Be Done:
1. **Install dependencies**: `pip install -r requirements.txt`
2. **Set .env**: Add OpenAI key, Unstructured.io key, Supabase credentials
3. **Run SQL migration**: Execute the migration SQL in Supabase SQL Editor
4. **Run ingestion**: `python -m ingestion.main ingest --file document.pdf`
5. **Schedule**: Celery task for batch ingestion

### Integration with FastAPI:
```python
# api/v1/documents.py
@router.post("/documents/ingest")
async def ingest_document(
    file: UploadFile,
    institution_id: UUID,
    current_user: dict = Depends(get_current_user),
):
    # 1. Upload to Supabase Storage
    storage_path = await supabase_storage.upload(file)

    # 2. Create document record
    doc = await db.create_document(file.filename, storage_path, institution_id)

    # 3. Trigger async ingestion via Celery
    celery_app.send_task("workers.ingestion_worker.process_document", args=[doc.id])

    return {"documentId": doc.id, "status": "processing", "estimatedTimeSeconds": 30}
```

---

## 11. AI CHAT SYSTEM

### Architecture:
```
User Message → Intent Classifier → [Text-to-SQL | RAG Search | Direct LLM]
                                      ↓
                              Response + Chart Data + Export
```

### Implementation:
```python
# api/v1/chat.py
@router.post("/chat/query")
async def chat_query(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    ai = AIEngine()

    # Step 1: Classify intent
    intent = await ai.classify_intent(request.message)

    if intent == "data":
        # Generate SQL from NL
        sql = await ai.text_to_sql.generate(
            request.message,
            schema=get_db_schema(),
            context={"role": current_user["role"], "institution_id": request.context.get("institutionId")}
        )
        result = await db.fetch_all(sql)
        response, chart_data = await ai.format_response(result, request.message)

    elif intent == "document":
        # RAG search
        chunks = await ai.rag_engine.search(request.message, top_k=5)
        sources = [{"page": c.page_number, "title": c.section_title, "source": c.document_name} for c in chunks]
        response = await ai.llm_generate(chunks, request.message)

    elif intent == "prediction":
        # Get forecast
        forecast = await ai.predictor.forecast(request.context)
        response = f"Prévision: {forecast.summary}"

    return {
        "response": response,
        "data": result if intent == "data" else None,
        "chartType": "bar" if intent == "data" else None,
        "sources": sources if intent == "document" else None,
        "confidence": 0.95,
        "exportable": True
    }
```

### Example Chat Queries:
- "Quel est le taux de réussite à l'ENSI ?" → SQL → Chart
- "Quels sont les critères GreenMetric ?" → RAG → Document
- "Prédis le budget de l'année prochaine" → Prediction → Forecast chart
- "Quelles institutions ont le pire taux d'abandon ?" → SQL → Table

---

## 12. DEPLOYMENT & TESTING

### Docker Compose:
```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    env_file: ./backend/.env
    depends_on: [redis]
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  celery-worker:
    build: ./backend
    command: celery -A workers.celery_app worker --loglevel=info
    env_file: ./backend/.env
    depends_on: [redis]
  celery-beat:
    build: ./backend
    command: celery -A workers.celery_app beat --loglevel=info
    env_file: ./backend/.env
    depends_on: [redis]
```

### Testing:
```bash
# Start all services
docker-compose up -d

# Test health
curl http://localhost:8000/health

# Test login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"president@ucar.tn","password":"ucar2024"}'

# Test institutions (requires JWT)
curl http://localhost:8000/api/v1/institutions \
  -H "Authorization: Bearer $TOKEN"
```

---

## 13. WHAT YOU (Oussema) SHOULD DO

1. **Provide .env values**: OpenAI API key, Unstructured.io key, Supabase credentials
2. **Run the Supabase migration**: Copy the SQL from Section 4 into Supabase SQL Editor at https://supabase.com/dashboard/project/qslfgwcyynqwfllfqmdf/sql
3. **Connect the frontend**: Update `src/lib/mock-data.ts` → point to real API: change fetch calls from mock to `fetch('http://localhost:8000/api/v1/...')`
4. **Test flow**: Login as president → navigate dashboard → verify data loads from backend
5. **Deploy frontend**: `npm run build` then deploy to Vercel

### Frontend → Backend Connection Guide:
```typescript
// src/lib/api.ts (NEW FILE — create this)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export async function fetchApi(endpoint: string, options?: RequestInit) {
  const token = localStorage.getItem('ucar_session')
  const parsed = token ? JSON.parse(token) : null
  const jwt = parsed?.currentUser?.token || ''

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`,
      ...options?.headers,
    },
  })

  if (res.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  }

  return res.json()
}
```

---

## 14. WHAT THE AI AGENT SHOULD BUILD

### Deliverables Checklist:

- [ ] **FastAPI project** with directory structure above
- [ ] **All 25 route groups** from api-contract.md (80+ endpoints)
- [ ] **Supabase client** connection (singleton)
- [ ] **JWT auth** with login, refresh, logout
- [ ] **TOTP 2FA** generation and verification
- [ ] **RBAC middleware** checking role, level, institution access
- [ ] **Anomaly detection** service with Celery cron
- [ ] **Appel d'offres prediction** with Prophet
- [ ] **RAG integration** using existing ingestion pipeline
- [ ] **AI Chat** endpoint with Text-to-SQL + RAG
- [ ] **Celery workers** for async tasks
- [ ] **Docker** files for backend + workers
- [ ] **Seed script** for demo data (at least 5 institutions)
- [ ] **Unit tests** for core services
- [ ] **requirements.txt** with all dependencies

### Dependencies (requirements.txt):
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
supabase==2.7.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
pydantic==2.9.0
pydantic-settings==2.5.0
httpx==0.27.0
sqlalchemy==2.0.35
asyncpg==0.29.0
psycopg2-binary==2.9.9
pgvector==0.3.0
langchain==0.3.0
langchain-openai==0.2.0
openai==1.50.0
unstructured==0.15.0
scikit-learn==1.5.0
prophet==1.1.5
pandas==2.2.0
numpy==1.26.0
redis==5.1.0
celery==5.4.0
pyotp==2.9.0
qrcode==7.4.0
python-multipart==0.0.9
structlog==24.4.0
pytest==8.3.0
pytest-asyncio==0.24.0
```

---

## 15. ULTIMATE PROMPT FOR OPUS 4.6

---

**Copy-paste the ENTIRE document above (Sections 1-14) as your context, then add:**

---

### YOUR TASK:

Build the **complete backend** for the UCAR (Université de Carthage) Intelligence Platform. The frontend is already built (141 routes, 14 roles, zero errors) and the full API contract exists.

### PHASE 1: Foundation (Build First)
1. Create FastAPI project at `backend/` with the directory structure in Section 3
2. Set up `.env` with all variables from Section 2
3. Create `config.py` using Pydantic `BaseSettings`
4. Create database connection in `db/supabase.py` (singleton pattern)
5. Create the seed script that populates ALL demo data (see Section 14 for priorities)
6. Execute the SQL migration from Section 4 in Supabase (or create an Alembic migration)

### PHASE 2: Auth (Build Second)
7. Implement `auth/jwt.py` — create/validate JWT tokens with HS256
8. Implement `auth/rbac.py` — role-based access checking
9. Implement `auth/two_factor.py` — TOTP 2FA (pyotp)
10. Create routes:
    - `POST /auth/login` — accepts email+password, returns JWT or 2FA challenge
    - `GET /auth/me` — returns current user from JWT
    - `POST /auth/logout` — invalidates session
    - `POST /auth/refresh` — refreshes access token
    - `POST /auth/enable-2fa` — enables 2FA for user
    - `POST /auth/verify-2fa` — verifies TOTP code

### PHASE 3: Core API (Build Third)
11. Create `api/deps.py` with `get_current_user` and `get_db` dependencies
12. Implement ALL institution endpoints (Section 6)
13. Implement analytics endpoints (aggregate, trends, forecasts, benchmarks)
14. Implement anomaly endpoints (list with filters, update status)
15. Implement research endpoints (publications, affiliation, projects)
16. Implement GreenMetric endpoints (aggregate, trend, per-institution)

### PHASE 4: AI Services (Build Fourth)
17. Create `ai/anomaly_detector.py` — statistical outlier detection (Z-score + Isolation Forest)
18. Create `ai/offer_predictor.py` — Prophet-based procurement prediction
19. Create `ai/rag.py` — RAG search over pgvector using LangChain
20. Create `ai/text_to_sql.py` — NL to SQL using OpenAI GPT-4o
21. Create `ai/engine.py` — orchestration layer that routes chat queries
22. Create `POST /chat/query` — AI chat endpoint
23. Set up Celery cron tasks:
    - `detect_anomalies`: daily at 2AM
    - `predict_offres`: weekly on Monday
    - `generate_reports`: weekly on Friday

### PHASE 5: Document Pipeline
24. Integrate existing `ingestion/` Python modules
25. Create `POST /documents/ingest` — multipart upload endpoint
26. Create `GET /documents/:id/status` — check processing status
27. Create Celery task `workers/ingestion_worker.py` for async processing

### PHASE 6: Operations & Remaining Endpoints
28. Teacher endpoints (courses, grades, attendance, syllabus, analytics)
29. Student endpoints (profile, grades, schedule, carbon, mobility)
30. Career endpoints (listings, alumni stats)
31. Room management endpoints (availability, reservation)
32. Incident reporting endpoints
33. Feedback & survey endpoints
34. User management endpoints (list, update, assign roles)
35. ISO compliance endpoints
36. Report generation endpoints

### PHASE 7: Deployment
37. Create `Dockerfile` for FastAPI backend
38. Create `docker-compose.yml` with backend + Redis + Celery workers
39. Write `requirements.txt` with exact versions
40. Verify all endpoints work with curl tests

### VERIFICATION:
- [ ] `docker-compose up` starts everything
- [ ] `POST /auth/login` returns JWT
- [ ] `GET /institutions` returns 35 institutions (scoped to user's access)
- [ ] `GET /analytics/aggregate` returns UCAR-wide KPIs
- [ ] `GET /anomalies` returns anomaly alerts
- [ ] `POST /chat/query` returns AI response with data/chart
- [ ] Celery worker processes anomaly detection daily

### KEY RULES:
- ALL endpoints require JWT authentication (except login)
- ALL data access is scoped to user's `institution_ids` or `can_access_all`
- President (level 0) sees everything
- Service heads (level 2) see their service's data only
- Teachers see their own courses + students
- Students see only their own data
- ALL labels/messages in French
- Follow api-contract.md EXACTLY for request/response shapes
- Use the EXACT types from frontend's `src/lib/types.ts` equivalents

### IMPORTANT: This is a HACKATHON project. Prioritize:
1. Working demo flow (login → dashboard → data → AI query)
2. AI features (anomaly, predictions, chat) — these win hackathons
3. Clean demo data (5 institutions with realistic 3-year data)
4. Don't over-engineer — functional > perfect
