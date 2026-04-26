-- ================================================================
-- UCAR COMPLETE OPERATIONAL SCHEMA + REAL INSTITUTIONS
-- Adds operational tables (courses, grades, attendance, feedback,
-- staff, contracts, etc.), seeds the 15 real Université de Carthage
-- institutions, KPI definitions, and updates vector dimension to
-- match the multilingual-e5-large model (1024 dim).
-- ================================================================

-- ─── Adjust vector dim to match HF intfloat/multilingual-e5-large (1024) ───
DROP INDEX IF EXISTS vectors_embedding_idx;
TRUNCATE TABLE vectors;
ALTER TABLE vectors ALTER COLUMN embedding TYPE vector(1024);
CREATE INDEX vectors_embedding_idx ON vectors USING hnsw (embedding vector_cosine_ops) WITH (m = 16, ef_construction = 200);

-- ─── KPI DEFINITIONS SEED (20 KPIs across 8 domains) ───
INSERT INTO kpi_definitions (slug, name, category, unit, description, domain_slug, target_default, weight) VALUES
('success_rate', 'Taux de Réussite', 'academic', '%', 'Pourcentage d''étudiants ayant validé leur année', 'academic', 85, 1.5),
('dropout_rate', 'Taux d''Abandon', 'academic', '%', 'Pourcentage d''étudiants ayant abandonné', 'academic', 8, 1.5),
('attendance_rate', 'Taux d''Assiduité', 'academic', '%', 'Présence moyenne aux cours', 'academic', 90, 1.0),
('staff_ratio', 'Ratio Encadrement', 'academic', '/1', 'Étudiants par enseignant', 'academic', 18, 1.0),
('budget_execution', 'Exécution Budgétaire', 'finance', '%', 'Pourcentage du budget consommé', 'finance', 95, 1.5),
('cost_per_student', 'Coût par Étudiant', 'finance', 'TND', 'Coût moyen par étudiant', 'finance', 8000, 1.0),
('staff_stability', 'Stabilité des Effectifs', 'hr', '%', 'Stabilité du personnel', 'hr', 90, 1.0),
('absenteeism_rate', 'Taux d''Absentéisme', 'hr', '%', 'Absentéisme du personnel', 'hr', 5, 1.0),
('training_completion', 'Formation Continue', 'hr', '%', 'Taux de formation du personnel', 'hr', 75, 1.0),
('publications_count', 'Publications Scopus', 'research', '', 'Nombre de publications indexées', 'research', 350, 2.0),
('citation_impact', 'FWCI', 'research', '', 'Field-Weighted Citation Impact', 'research', 1.5, 2.0),
('research_funding', 'Financement Recherche', 'research', 'TND', 'Budget recherche obtenu', 'research', 1500000, 1.5),
('classroom_occupancy', 'Occupation des Salles', 'infrastructure', '%', 'Taux occupation salles', 'infrastructure', 80, 1.0),
('equipment_availability', 'Disponibilité Équipements', 'infrastructure', '%', 'Équipements opérationnels', 'infrastructure', 92, 1.0),
('employability_rate', 'Taux d''Employabilité', 'employment', '%', 'Diplômés employés à 6 mois', 'employment', 75, 1.5),
('active_partnerships', 'Partenariats Actifs', 'partnerships', '', 'Accords internationaux actifs', 'partnerships', 50, 1.0),
('mobility_count', 'Mobilité Étudiante', 'partnerships', '', 'Étudiants en mobilité', 'partnerships', 100, 1.0),
('green_score', 'Score GreenMetric', 'esg', '', 'Score GreenMetric global', 'esg', 7500, 2.0),
('energy_consumption', 'Consommation Énergie', 'esg', 'kWh', 'Consommation annuelle', 'esg', 1500000, 1.0),
('recycling_rate', 'Taux de Recyclage', 'esg', '%', 'Déchets recyclés', 'esg', 50, 1.0)
ON CONFLICT (slug) DO NOTHING;

-- ─── REAL UCAR INSTITUTIONS (15 official) ───
DELETE FROM kpi_values;
DELETE FROM anomalies;
DELETE FROM publications;
DELETE FROM research_projects;
DELETE FROM greenmetric_entries;
DELETE FROM rankings;
DELETE FROM institutions;

INSERT INTO institutions (id, name, code, type, city, established_year, total_students, total_staff, accreditation_status, is_active) VALUES
('11111111-1111-1111-1111-111111111101', 'École Nationale d''Ingénieurs de Carthage', 'ENICarthage', 'École', 'Carthage', 2002, 1450, 180, ARRAY['CTI', 'ISO 9001'], true),
('11111111-1111-1111-1111-111111111102', 'École Polytechnique de Tunisie', 'EPT', 'École', 'La Marsa', 1991, 850, 110, ARRAY['CTI'], true),
('11111111-1111-1111-1111-111111111103', 'Institut National des Sciences Appliquées et de Technologie', 'INSAT', 'Institut', 'Tunis', 1992, 3500, 260, ARRAY['ISO 9001'], true),
('11111111-1111-1111-1111-111111111104', 'École Supérieure des Communications de Tunis', 'SUP''COM', 'École', 'Ariana', 1998, 1200, 140, ARRAY['CTI', 'ISO 9001'], true),
('11111111-1111-1111-1111-111111111105', 'École Supérieure de la Statistique et de l''Analyse de l''Information', 'ESSAI', 'École', 'Tunis', 2001, 600, 70, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111106', 'Institut des Hautes Études Commerciales de Carthage', 'IHEC Carthage', 'Institut', 'Carthage', 1942, 3200, 240, ARRAY['ISO 9001'], true),
('11111111-1111-1111-1111-111111111107', 'École Nationale d''Architecture et d''Urbanisme', 'ENAU', 'École', 'Sidi Bou Said', 1995, 1100, 85, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111108', 'Faculté des Sciences Économiques et de Gestion de Nabeul', 'FSEGN', 'Faculté', 'Nabeul', 2003, 4200, 270, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111109', 'Faculté des Sciences Juridiques, Politiques et Sociales de Tunis', 'FSJPST', 'Faculté', 'Tunis', 1987, 4800, 280, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111110', 'Institut Supérieur des Langues de Tunis', 'ISLT', 'Institut', 'Tunis', 1988, 2500, 150, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111111', 'Institut Préparatoire aux Études Scientifiques et Techniques', 'IPEST', 'Institut', 'La Marsa', 1991, 800, 95, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111112', 'Institut Supérieur des Sciences Humaines de Tunis', 'ISSHT', 'Institut', 'Tunis', 1991, 2200, 145, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111113', 'Faculté des Sciences de Bizerte', 'FSB', 'Faculté', 'Bizerte', 1990, 3200, 220, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111114', 'Institut des Hautes Études Touristiques de Sidi Dhrif', 'IHET', 'Institut', 'Sidi Bou Said', 1981, 700, 65, ARRAY[]::TEXT[], true),
('11111111-1111-1111-1111-111111111115', 'Institut Supérieur de l''Animation pour la Jeunesse et la Culture', 'ISAJC', 'Institut', 'Bir El Bey', 1984, 950, 70, ARRAY[]::TEXT[], true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  code = EXCLUDED.code,
  type = EXCLUDED.type,
  city = EXCLUDED.city,
  established_year = EXCLUDED.established_year,
  total_students = EXCLUDED.total_students,
  total_staff = EXCLUDED.total_staff,
  accreditation_status = EXCLUDED.accreditation_status,
  is_active = EXCLUDED.is_active;

-- ─── DEPARTMENTS ───
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    head_user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(institution_id, code)
);

-- ─── STAFF (HR) ───
CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    department_id UUID REFERENCES departments(id),
    role_label TEXT,
    rank TEXT,
    is_teaching BOOLEAN DEFAULT false,
    h_index INTEGER DEFAULT 0,
    publications_count INTEGER DEFAULT 0,
    employment_status TEXT DEFAULT 'Actif',
    hired_at DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── COURSES ───
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL,
    name TEXT NOT NULL,
    institution_id UUID REFERENCES institutions(id),
    department_id UUID REFERENCES departments(id),
    teacher_id UUID REFERENCES users(id),
    credits INTEGER DEFAULT 6,
    semester INTEGER DEFAULT 1,
    progress INTEGER DEFAULT 0,
    avg_grade NUMERIC,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── STUDENTS ───
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_number TEXT UNIQUE NOT NULL,
    institution_id UUID REFERENCES institutions(id),
    program_code TEXT,
    semester INTEGER DEFAULT 1,
    cumulative_gpa NUMERIC DEFAULT 0,
    validated_credits INTEGER DEFAULT 0,
    total_credits INTEGER DEFAULT 0,
    carbon_footprint_tonnes NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── ENROLLMENTS ───
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    ds NUMERIC,
    tp NUMERIC,
    exam NUMERIC,
    final_grade NUMERIC,
    status TEXT DEFAULT 'enrolled',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, course_id)
);

-- ─── ATTENDANCE ───
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id),
    session_date DATE NOT NULL,
    status TEXT CHECK (status IN ('present', 'absent', 'late', 'excused')) DEFAULT 'present',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(enrollment_id, session_date)
);

-- ─── SYLLABUS TOPICS ───
CREATE TABLE IF NOT EXISTS syllabus_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'A faire',
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── FEEDBACK ───
CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    course_id UUID REFERENCES courses(id),
    feedback_type TEXT NOT NULL,
    rating INTEGER,
    description TEXT,
    anonymous BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'received',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── SURVEYS ───
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    deadline DATE,
    target_role TEXT,
    questions JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS survey_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    survey_id UUID REFERENCES surveys(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    responses JSONB DEFAULT '[]',
    submitted_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(survey_id, user_id)
);

-- ─── INCIDENTS ───
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    incident_type TEXT NOT NULL,
    title TEXT,
    description TEXT,
    room_id UUID,
    priority TEXT DEFAULT 'Normale',
    status TEXT DEFAULT 'open',
    assigned_to UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- ─── ROOMS ───
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    number TEXT NOT NULL,
    building TEXT,
    capacity INTEGER DEFAULT 30,
    room_type TEXT DEFAULT 'classroom',
    equipment TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'Disponible',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── BUILDINGS ───
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    name TEXT NOT NULL,
    surface NUMERIC,
    floors INTEGER DEFAULT 1,
    state TEXT DEFAULT 'Bon',
    occupancy INTEGER DEFAULT 0,
    year INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── EQUIPMENTS ───
CREATE TABLE IF NOT EXISTS equipments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    name TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    status TEXT DEFAULT 'OK',
    depreciation INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── MAINTENANCE REQUESTS ───
CREATE TABLE IF NOT EXISTS maintenance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    title TEXT NOT NULL,
    priority TEXT DEFAULT 'Normale',
    status TEXT DEFAULT 'open',
    assigned_to TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── IT SYSTEMS / SECURITY ───
CREATE TABLE IF NOT EXISTS it_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    version TEXT,
    uptime NUMERIC DEFAULT 99,
    status TEXT DEFAULT 'OK',
    system_type TEXT DEFAULT 'Standard',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS it_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    service_area TEXT,
    priority TEXT DEFAULT 'Normale',
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS it_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    requester TEXT,
    priority TEXT DEFAULT 'Normale',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── FINANCE ───
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    beneficiary TEXT NOT NULL,
    amount NUMERIC NOT NULL,
    service TEXT,
    status TEXT DEFAULT 'pending',
    payment_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    bank TEXT,
    balance NUMERIC DEFAULT 0,
    currency TEXT DEFAULT 'TND',
    last_op DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    audit_ref TEXT NOT NULL,
    service TEXT,
    audit_type TEXT,
    findings INTEGER DEFAULT 0,
    critical INTEGER DEFAULT 0,
    status TEXT DEFAULT 'En cours',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── BUDGET ───
CREATE TABLE IF NOT EXISTS budget_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    year INTEGER NOT NULL,
    institution_id UUID REFERENCES institutions(id),
    service_id TEXT,
    category TEXT,
    allocated NUMERIC DEFAULT 0,
    consumed NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── LEGAL ───
CREATE TABLE IF NOT EXISTS legal_cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_ref TEXT NOT NULL,
    title TEXT NOT NULL,
    case_type TEXT,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_ref TEXT NOT NULL,
    title TEXT,
    partner TEXT,
    amount NUMERIC,
    deadline DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS legal_opinions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    requester TEXT,
    opinion_date DATE,
    status TEXT DEFAULT 'pending',
    opinion_type TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    status TEXT,
    deadline DATE,
    manager TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── PROGRAMS / ACADEMIC ───
CREATE TABLE IF NOT EXISTS academic_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    name TEXT NOT NULL,
    level TEXT,
    student_count INTEGER DEFAULT 0,
    accreditation_status TEXT,
    accreditation_year INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_date TEXT,
    event_label TEXT NOT NULL,
    event_type TEXT,
    status TEXT DEFAULT 'Planifié',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID REFERENCES institutions(id),
    name TEXT NOT NULL,
    members INTEGER DEFAULT 0,
    events INTEGER DEFAULT 0,
    category TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS club_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    club_id UUID REFERENCES clubs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    event_date DATE,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── COOPERATION ───
CREATE TABLE IF NOT EXISTS cooperation_agreements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country TEXT NOT NULL,
    partner TEXT NOT NULL,
    agreement_type TEXT,
    students_per_year INTEGER DEFAULT 0,
    since_year INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS phd_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    name TEXT NOT NULL,
    topic TEXT,
    director TEXT,
    year_label TEXT,
    status TEXT DEFAULT 'En cours',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── MOBILITY (Erasmus etc.) ───
CREATE TABLE IF NOT EXISTS mobility_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_name TEXT NOT NULL,
    university TEXT,
    country TEXT,
    places INTEGER DEFAULT 1,
    deadline DATE,
    is_open BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mobility_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID REFERENCES mobility_programs(id),
    user_id UUID REFERENCES users(id),
    status TEXT DEFAULT 'pending',
    progress INTEGER DEFAULT 0,
    checklist JSONB DEFAULT '[]',
    submitted_at TIMESTAMPTZ DEFAULT now()
);

-- ─── CAREER ───
CREATE TABLE IF NOT EXISTS career_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT,
    location TEXT,
    listing_type TEXT DEFAULT 'stage',
    posted_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    company TEXT,
    supervisor TEXT,
    status TEXT DEFAULT 'En cours',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── SG (Secretariat General) ───
CREATE TABLE IF NOT EXISTS mail (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mail_ref TEXT NOT NULL,
    subject TEXT,
    sender TEXT,
    received_date DATE DEFAULT CURRENT_DATE,
    urgency TEXT DEFAULT 'Normale',
    status TEXT DEFAULT 'received',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS official_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_ref TEXT NOT NULL,
    title TEXT,
    decision_type TEXT,
    decision_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    meeting_date DATE,
    meeting_time TEXT,
    location TEXT,
    participants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'planned',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── HR EXTRAS ───
CREATE TABLE IF NOT EXISTS recruitment_positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT,
    candidates INTEGER DEFAULT 0,
    status TEXT DEFAULT 'open',
    deadline DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    leave_type TEXT,
    days INTEGER DEFAULT 1,
    start_date DATE,
    end_date DATE,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    participants INTEGER DEFAULT 0,
    budget NUMERIC DEFAULT 0,
    sessions INTEGER DEFAULT 1,
    status TEXT DEFAULT 'En cours',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS performance_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    rating NUMERIC,
    status TEXT DEFAULT 'pending',
    evaluation_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── LIBRARY ───
CREATE TABLE IF NOT EXISTS library_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_type TEXT NOT NULL,
    count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    item_title TEXT,
    loan_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    return_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS library_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sessions INTEGER DEFAULT 0,
    searches INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── CHAT HISTORY ───
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    role_slug TEXT,
    message TEXT NOT NULL,
    response TEXT,
    intent TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── USER SETTINGS ───
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    language TEXT DEFAULT 'fr',
    notifications BOOLEAN DEFAULT true,
    theme TEXT DEFAULT 'light',
    extras JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── TEACHER HOURS ───
CREATE TABLE IF NOT EXISTS teacher_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID REFERENCES users(id),
    week_no INTEGER NOT NULL,
    month_label TEXT,
    completed NUMERIC DEFAULT 0,
    planned NUMERIC DEFAULT 0,
    overtime NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── INDICES for performance ───
CREATE INDEX IF NOT EXISTS idx_kpi_values_inst ON kpi_values(institution_id);
CREATE INDEX IF NOT EXISTS idx_kpi_values_slug ON kpi_values(kpi_slug);
CREATE INDEX IF NOT EXISTS idx_anomalies_inst ON anomalies(institution_id);
CREATE INDEX IF NOT EXISTS idx_anomalies_status ON anomalies(status);
CREATE INDEX IF NOT EXISTS idx_publications_inst ON publications(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_teacher ON courses(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_enroll ON attendance(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_feedback_inst ON feedback(institution_id);
CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages(user_id);

SELECT 'UCAR complete operational schema applied' AS result;
