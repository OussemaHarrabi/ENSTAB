-- ============================================================================
-- 001_ucar_full_schema.sql
-- Consolidated from:
-- - UCAR_Coding_Agent_Prompts_Master.md
-- - ucar_system_architecture_v2.md
-- Target: Supabase PostgreSQL
-- ============================================================================
BEGIN;
-- ----------------------------------------------------------------------------
-- Extensions
-- ----------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS btree_gist;
-- ----------------------------------------------------------------------------
-- Schemas
-- ----------------------------------------------------------------------------
CREATE SCHEMA IF NOT EXISTS audit;
-- ----------------------------------------------------------------------------
-- AUDIT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit.event_log (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
institution_id TEXT,
actor_id UUID,
actor_role TEXT,
event_type TEXT NOT NULL,
table_name TEXT,
row_id UUID,
old_value JSONB,
new_value JSONB,
valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
valid_to TIMESTAMPTZ,
system_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
system_to TIMESTAMPTZ,
ip_address INET,
request_id UUID,
ai_model_ver TEXT,
shap_summary JSONB,
metadata JSONB DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_audit_institution ON audit.event_log (institution_id, system_from DESC);
CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit.event_log (actor_id, system_from DESC);
CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit.event_log (event_type, system_from DESC);
REVOKE UPDATE, DELETE ON audit.event_log FROM PUBLIC;
-- ----------------------------------------------------------------------------
-- PUBLIC TABLES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.institutions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
short_code VARCHAR(20) UNIQUE NOT NULL,
name_fr VARCHAR(255) NOT NULL,
name_ar VARCHAR(255),
type VARCHAR(50) NOT NULL,
city VARCHAR(100),
address TEXT,
phone VARCHAR(30),
email VARCHAR(255),
website VARCHAR(255),
established_year INTEGER,
schema_name VARCHAR(50) UNIQUE NOT NULL,
blueprint_version INTEGER DEFAULT 1,
sync_status VARCHAR(20) DEFAULT 'synced',
accreditations TEXT[],
logo_url TEXT,
is_active BOOLEAN DEFAULT TRUE,
metadata JSONB DEFAULT '{}'::jsonb,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS public.kpi_definitions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
domain VARCHAR(50) NOT NULL,
kpi_code VARCHAR(100) UNIQUE NOT NULL,
kpi_name_fr VARCHAR(255) NOT NULL,
kpi_name_ar VARCHAR(255),
formula_sql TEXT NOT NULL,
unit VARCHAR(30),
higher_is_better BOOLEAN DEFAULT TRUE,
green_threshold DECIMAL(10,4),
yellow_threshold DECIMAL(10,4),
red_threshold DECIMAL(10,4),
ranking_mapping JSONB DEFAULT '{}'::jsonb,
version INTEGER DEFAULT 1,
is_active BOOLEAN DEFAULT TRUE,
created_by UUID,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.blueprint_templates (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
version INTEGER NOT NULL,
domain VARCHAR(50) NOT NULL,
table_name VARCHAR(100) NOT NULL,
column_name VARCHAR(100) NOT NULL,
data_type VARCHAR(50) NOT NULL,
is_required BOOLEAN DEFAULT FALSE,
validation_rule TEXT,
description_fr TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.system_config (
key VARCHAR(100) PRIMARY KEY,
value JSONB NOT NULL,
updated_by UUID,
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.compliance_rules (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
domain VARCHAR(50) NOT NULL,
kpi_code VARCHAR(100) REFERENCES public.kpi_definitions(kpi_code),
rule_name_fr VARCHAR(255) NOT NULL,
operator VARCHAR(10) NOT NULL,
threshold_value DECIMAL(10,4) NOT NULL,
severity VARCHAR(10) DEFAULT 'warning',
is_active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.anomaly_thresholds (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
domain VARCHAR(50) NOT NULL,
contamination_factor DECIMAL(5,4) DEFAULT 0.05,
zscore_fallback DECIMAL(5,2) DEFAULT 2.5,
min_history_months INTEGER DEFAULT 6,
is_active BOOLEAN DEFAULT TRUE,
updated_by UUID,
updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.anomaly_alerts (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
institution_id UUID NOT NULL REFERENCES public.institutions(id),
domain VARCHAR(50) NOT NULL,
kpi_code VARCHAR(100),
severity VARCHAR(10) NOT NULL,
status VARCHAR(20) DEFAULT 'new',
status_updated_by UUID,
status_updated_at TIMESTAMPTZ,
anomaly_score DECIMAL(6,4),
sigma_deviation DECIMAL(6,2),
affected_value DECIMAL(15,4),
baseline_value DECIMAL(15,4),
period VARCHAR(20),
shap_features JSONB,
explanation_fr TEXT NOT NULL,
explanation_ar TEXT,
investigation_notes TEXT,
model_version VARCHAR(50),
detected_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_anomaly_institution ON public.anomaly_alerts (institution_id, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_anomaly_status ON public.anomaly_alerts (status, domain);
CREATE TABLE IF NOT EXISTS public.forecast_results (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
institution_id UUID NOT NULL REFERENCES public.institutions(id),
domain VARCHAR(50) NOT NULL,
kpi_code VARCHAR(100) NOT NULL,
forecast_period VARCHAR(20) NOT NULL,
point_estimate DECIMAL(15,4) NOT NULL,
lower_ci_90 DECIMAL(15,4),
upper_ci_90 DECIMAL(15,4),
horizon_months INTEGER,
model_used VARCHAR(50),
model_version VARCHAR(50),
training_from DATE,
training_to DATE,
explanation_fr TEXT,
generated_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (institution_id, kpi_code, forecast_period)
);
CREATE TABLE IF NOT EXISTS public.benchmark_reports (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
domain VARCHAR(50) NOT NULL,
period VARCHAR(20) NOT NULL,
report_type VARCHAR(30) NOT NULL,
data JSONB NOT NULL,
generated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS public.ranking_submissions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
ranking_body VARCHAR(50) NOT NULL,
submission_year INTEGER NOT NULL,
status VARCHAR(20) DEFAULT 'draft',
data JSONB NOT NULL,
completeness_pct DECIMAL(5,2),
missing_fields JSONB DEFAULT '[]'::jsonb,
generated_at TIMESTAMPTZ DEFAULT NOW(),
submitted_at TIMESTAMPTZ,
submitted_by UUID,
UNIQUE (ranking_body, submission_year)
);
CREATE TABLE IF NOT EXISTS public.chat_sessions (
session_id UUID PRIMARY KEY,
user_id UUID NOT NULL,
institution_id TEXT NOT NULL,
role TEXT NOT NULL,
domain TEXT NOT NULL,
language TEXT NOT NULL DEFAULT 'fr',
created_at TIMESTAMPTZ DEFAULT NOW(),
last_active_at TIMESTAMPTZ DEFAULT NOW(),
turn_count INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS public.report_queue (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
institution_id UUID REFERENCES public.institutions(id),
report_type VARCHAR(50) NOT NULL,
domain VARCHAR(50),
period VARCHAR(20),
format VARCHAR(10) DEFAULT 'pdf',
status VARCHAR(20) DEFAULT 'pending',
file_url TEXT,
file_signed BOOLEAN DEFAULT FALSE,
requested_by UUID,
requested_at TIMESTAMPTZ DEFAULT NOW(),
completed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS public.document_embeddings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
doc_id TEXT NOT NULL,
institution_id TEXT NOT NULL,
domain TEXT NOT NULL DEFAULT 'ALL',
doc_type VARCHAR(50),
chunk_index INTEGER NOT NULL,
chunk_text TEXT NOT NULL,
embedding vector(1536),
metadata JSONB DEFAULT '{}'::jsonb,
created_at TIMESTAMPTZ DEFAULT NOW(),
CONSTRAINT uq_doc_chunk UNIQUE (doc_id, chunk_index)
);
CREATE INDEX IF NOT EXISTS idx_doc_embeddings_meta ON public.document_embeddings (institution_id, domain);
CREATE INDEX IF NOT EXISTS idx_doc_embeddings_vec
ON public.document_embeddings
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
-- Placeholder materialized view (can be replaced later by dbt-managed SQL)
CREATE MATERIALIZED VIEW IF NOT EXISTS public.kpis_aggregate AS
SELECT
i.id AS institution_id,
i.short_code,
i.name_fr,
NULL::VARCHAR(50) AS domain,
NULL::VARCHAR(100) AS kpi_code,
NULL::VARCHAR(20) AS period,
NULL::DECIMAL(20,6) AS value,
NOW() AS computed_at,
NOW() AS valid_from
FROM public.institutions i
WHERE FALSE
WITH NO DATA;
CREATE UNIQUE INDEX IF NOT EXISTS idx_kpis_aggregate_uniq
ON public.kpis_aggregate (institution_id, kpi_code, period);
-- ----------------------------------------------------------------------------
-- FUNCTIONS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS TRIGGER AS $$
BEGIN
INSERT INTO audit.event_log (
institution_id, actor_id, actor_role, event_type, table_name,
row_id, old_value, new_value, valid_from, system_from, request_id
) VALUES (
current_setting('app.institution_id', true),
NULLIF(current_setting('app.user_id', true), '')::UUID,
current_setting('app.role', true),
TG_OP,
TG_TABLE_NAME,
COALESCE(NEW.id, OLD.id),
CASE WHEN TG_OP <> 'INSERT' THEN to_jsonb(OLD) ELSE NULL END,
CASE WHEN TG_OP <> 'DELETE' THEN to_jsonb(NEW) ELSE NULL END,
NOW(),
NOW(),
NULLIF(current_setting('app.request_id', true), '')::UUID
);
RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION public.refresh_kpis_aggregate()
RETURNS TRIGGER AS $$
BEGIN
IF NEW.status = 'approved' AND OLD.status IS DISTINCT FROM 'approved' THEN
REFRESH MATERIALIZED VIEW CONCURRENTLY public.kpis_aggregate;
PERFORM pg_notify('kpi_refreshed', json_build_object(
'institution_id', NEW.institution_id,
'timestamp', NOW()
)::text);
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- ----------------------------------------------------------------------------
-- DYNAMIC INSTITUTION SCHEMA CREATOR
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.create_institution_schema(schema_name TEXT, institution_uuid UUID)
RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', schema_name);
-- Core control
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.system_config (
key VARCHAR(100) PRIMARY KEY,
value JSONB NOT NULL,
updated_by UUID,
updated_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.user_accounts (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
keycloak_id UUID UNIQUE,
email VARCHAR(255) UNIQUE NOT NULL,
first_name VARCHAR(100),
last_name VARCHAR(100),
role VARCHAR(50) NOT NULL,
domain VARCHAR(50),
department_id UUID,
employee_id VARCHAR(50),
student_id VARCHAR(50),
is_active BOOLEAN DEFAULT TRUE,
mfa_enabled BOOLEAN DEFAULT FALSE,
preferences JSONB DEFAULT '{}'::jsonb,
last_login_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.data_commits (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
institution_id UUID DEFAULT %L::uuid,
domain VARCHAR(50) NOT NULL,
batch_id UUID NOT NULL,
submitted_by UUID NOT NULL,
record_count INTEGER NOT NULL,
tables_affected TEXT[] NOT NULL,
data_quality_score DECIMAL(5,2),
validation_report JSONB,
status VARCHAR(20) DEFAULT 'pending',
approved_at TIMESTAMPTZ,
approved_by UUID,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, institution_uuid::text);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.approval_queue (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
commit_id UUID NOT NULL REFERENCES %I.data_commits(id),
submitted_by UUID NOT NULL,
submitted_at TIMESTAMPTZ DEFAULT NOW(),
reviewed_by UUID,
reviewed_at TIMESTAMPTZ,
status VARCHAR(20) DEFAULT 'pending',
rejection_reason TEXT,
diff_snapshot JSONB NOT NULL
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.alert_config (
domain VARCHAR(50) PRIMARY KEY,
custom_thresholds JSONB DEFAULT '{}'::jsonb,
notify_emails TEXT[],
updated_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.report_config (
report_type VARCHAR(50) PRIMARY KEY,
is_enabled BOOLEAN DEFAULT TRUE,
cron_expression VARCHAR(50),
recipients TEXT[],
updated_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.kpi_snapshots (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
domain VARCHAR(50) NOT NULL,
kpi_code VARCHAR(100) NOT NULL,
period VARCHAR(20) NOT NULL,
value DECIMAL(20,6) NOT NULL,
numerator DECIMAL(20,6),
denominator DECIMAL(20,6),
computed_at TIMESTAMPTZ DEFAULT NOW(),
dbt_model VARCHAR(100),
valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
valid_to TIMESTAMPTZ,
system_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
UNIQUE (domain, kpi_code, period, system_from)
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE INDEX IF NOT EXISTS %I
ON %I.kpi_snapshots (domain, kpi_code, period, valid_from DESC)
$sql$, schema_name || '_kpi_snapshots_idx', schema_name);
-- Academic
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.academic_years (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(20) NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
is_current BOOLEAN DEFAULT FALSE
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.semesters (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
academic_year_id UUID NOT NULL REFERENCES %I.academic_years(id),
name VARCHAR(20) NOT NULL,
number INTEGER NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.programs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
department_id UUID,
name_fr VARCHAR(255) NOT NULL,
short_code VARCHAR(50) UNIQUE NOT NULL,
level VARCHAR(30) NOT NULL,
duration_years INTEGER NOT NULL,
total_credits INTEGER,
is_active BOOLEAN DEFAULT TRUE,
accreditation VARCHAR(50),
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.students (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_account_id UUID REFERENCES %I.user_accounts(id),
student_number VARCHAR(50) UNIQUE NOT NULL,
program_id UUID NOT NULL REFERENCES %I.programs(id),
academic_year_id UUID NOT NULL REFERENCES %I.academic_years(id),
level VARCHAR(30) NOT NULL,
year_of_study INTEGER NOT NULL,
enrollment_status VARCHAR(20) DEFAULT 'active',
nationality VARCHAR(50) DEFAULT 'TN',
is_international BOOLEAN DEFAULT FALSE,
is_first_generation BOOLEAN DEFAULT FALSE,
gender VARCHAR(10),
enrollment_date DATE,
graduation_date DATE,
cumulative_gpa DECIMAL(4,2),
created_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
)
$sql$, schema_name, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.courses (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
program_id UUID NOT NULL REFERENCES %I.programs(id),
code VARCHAR(50) UNIQUE NOT NULL,
name_fr VARCHAR(255) NOT NULL,
credits INTEGER NOT NULL,
hours_lecture INTEGER DEFAULT 0,
hours_tutorial INTEGER DEFAULT 0,
hours_practical INTEGER DEFAULT 0,
semester_number INTEGER,
is_active BOOLEAN DEFAULT TRUE,
syllabus_url TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.course_assignments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
course_id UUID NOT NULL REFERENCES %I.courses(id),
teacher_id UUID NOT NULL REFERENCES %I.user_accounts(id),
semester_id UUID NOT NULL REFERENCES %I.semesters(id),
section VARCHAR(10),
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (course_id, teacher_id, semester_id, section)
)
$sql$, schema_name, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.enrollments (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID NOT NULL REFERENCES %I.students(id),
course_id UUID NOT NULL REFERENCES %I.courses(id),
assignment_id UUID NOT NULL REFERENCES %I.course_assignments(id),
semester_id UUID NOT NULL REFERENCES %I.semesters(id),
status VARCHAR(20) DEFAULT 'enrolled',
final_grade DECIMAL(5,2),
grade_letter VARCHAR(5),
attendance_pct DECIMAL(5,2),
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (student_id, course_id, semester_id)
)
$sql$, schema_name, schema_name, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.attendance (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
enrollment_id UUID NOT NULL REFERENCES %I.enrollments(id),
session_date DATE NOT NULL,
session_type VARCHAR(20) DEFAULT 'lecture',
status VARCHAR(20) NOT NULL,
check_in_time TIME,
recorded_by UUID REFERENCES %I.user_accounts(id),
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE INDEX IF NOT EXISTS %I
ON %I.attendance (enrollment_id, session_date)
$sql$, schema_name || '_attendance_enrollment_date_idx', schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.exams (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
course_id UUID NOT NULL REFERENCES %I.courses(id),
semester_id UUID NOT NULL REFERENCES %I.semesters(id),
type VARCHAR(30) NOT NULL,
exam_date TIMESTAMPTZ,
max_score DECIMAL(6,2) DEFAULT 20,
weight_pct DECIMAL(5,2),
room_id UUID
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.grades (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
exam_id UUID NOT NULL REFERENCES %I.exams(id),
enrollment_id UUID NOT NULL REFERENCES %I.enrollments(id),
score DECIMAL(6,2),
is_absence BOOLEAN DEFAULT FALSE,
submitted_by UUID REFERENCES %I.user_accounts(id),
submitted_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (exam_id, enrollment_id)
)
$sql$, schema_name, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.syllabus_progress (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
assignment_id UUID NOT NULL REFERENCES %I.course_assignments(id),
topic VARCHAR(500) NOT NULL,
week_number INTEGER,
status VARCHAR(20) DEFAULT 'pending',
covered_date DATE,
updated_by UUID REFERENCES %I.user_accounts(id),
updated_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
-- HR
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.academic_staff (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
user_account_id UUID REFERENCES %I.user_accounts(id),
employee_number VARCHAR(50) UNIQUE NOT NULL,
department_id UUID,
rank VARCHAR(50) NOT NULL,
contract_type VARCHAR(30) NOT NULL,
fte DECIMAL(4,2) DEFAULT 1.0,
teaching_hrs_weekly INTEGER DEFAULT 0,
is_active BOOLEAN DEFAULT TRUE,
start_date DATE NOT NULL,
end_date DATE,
supervisor_id UUID REFERENCES %I.user_accounts(id),
nationality VARCHAR(50) DEFAULT 'TN',
is_international BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW(),
deleted_at TIMESTAMPTZ
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.teaching_hours (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
staff_id UUID NOT NULL REFERENCES %I.academic_staff(id),
week_start DATE NOT NULL,
teaching_hrs DECIMAL(5,2) DEFAULT 0,
admin_hrs DECIMAL(5,2) DEFAULT 0,
research_hrs DECIMAL(5,2) DEFAULT 0,
submitted_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (staff_id, week_start)
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.leave_requests (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
staff_id UUID NOT NULL REFERENCES %I.user_accounts(id),
leave_type VARCHAR(30) NOT NULL,
start_date DATE NOT NULL,
end_date DATE NOT NULL,
days_count INTEGER GENERATED ALWAYS AS (end_date - start_date + 1) STORED,
reason TEXT,
status VARCHAR(20) DEFAULT 'pending',
approved_by UUID REFERENCES %I.user_accounts(id),
approved_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.training_programs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(255) NOT NULL,
provider VARCHAR(255),
type VARCHAR(50),
hours INTEGER,
start_date DATE,
end_date DATE,
is_external BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.training_completions (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
training_id UUID NOT NULL REFERENCES %I.training_programs(id),
staff_id UUID NOT NULL REFERENCES %I.user_accounts(id),
completion_status VARCHAR(20) DEFAULT 'enrolled',
certificate_url TEXT,
completed_at DATE,
UNIQUE (training_id, staff_id)
)
$sql$, schema_name, schema_name, schema_name);
-- Finance
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.budgets (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
fiscal_year INTEGER NOT NULL,
department_id UUID,
category VARCHAR(50) NOT NULL,
allocated DECIMAL(15,2) NOT NULL,
consumed DECIMAL(15,2) DEFAULT 0,
status VARCHAR(20) DEFAULT 'active',
approved_by UUID,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (fiscal_year, department_id, category)
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.expenses (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
budget_id UUID REFERENCES %I.budgets(id),
amount DECIMAL(15,2) NOT NULL,
description TEXT,
category VARCHAR(50) NOT NULL,
expense_date DATE NOT NULL,
receipt_url TEXT,
status VARCHAR(20) DEFAULT 'pending',
submitted_by UUID NOT NULL,
approved_by UUID,
approved_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.research_income (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
source_type VARCHAR(50) NOT NULL,
source_name VARCHAR(255),
amount_tnd DECIMAL(15,2) NOT NULL,
amount_eur DECIMAL(15,2),
year INTEGER NOT NULL,
project_id UUID,
is_confirmed BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.invoices (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
budget_id UUID REFERENCES %I.budgets(id),
vendor_name VARCHAR(255) NOT NULL,
invoice_number VARCHAR(100),
amount DECIMAL(15,2) NOT NULL,
invoice_date DATE NOT NULL,
due_date DATE,
category VARCHAR(50),
receipt_url TEXT,
status VARCHAR(20) DEFAULT 'pending',
submitted_by UUID NOT NULL,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name);
-- Research
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.publications (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
doi VARCHAR(255) UNIQUE,
title VARCHAR(1000) NOT NULL,
abstract TEXT,
type VARCHAR(30) NOT NULL,
journal_name VARCHAR(255),
publication_year INTEGER NOT NULL,
scopus_id VARCHAR(100) UNIQUE,
is_scopus_indexed BOOLEAN DEFAULT FALSE,
citation_count INTEGER DEFAULT 0,
citation_count_5yr INTEGER DEFAULT 0,
fwci DECIMAL(8,4),
top_10pct_citation BOOLEAN DEFAULT FALSE,
affiliation_verified BOOLEAN DEFAULT FALSE,
affiliation_string TEXT,
ucar_affiliation_valid BOOLEAN DEFAULT FALSE,
affiliation_flag VARCHAR(30) DEFAULT 'unverified',
correction_requested_at TIMESTAMPTZ,
sdg_tags INTEGER[],
authors JSONB NOT NULL,
intl_coauthor_count INTEGER DEFAULT 0,
project_id UUID,
pdf_url TEXT,
created_at TIMESTAMPTZ DEFAULT NOW(),
updated_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE INDEX IF NOT EXISTS %I ON %I.publications (publication_year, is_scopus_indexed)
$sql$, schema_name || '_pub_year_scopus_idx', schema_name);
EXECUTE format($sql$
CREATE INDEX IF NOT EXISTS %I ON %I.publications (fwci)
$sql$, schema_name || '_pub_fwci_idx', schema_name);
EXECUTE format($sql$
CREATE INDEX IF NOT EXISTS %I ON %I.publications USING GIN (sdg_tags)
$sql$, schema_name || '_pub_sdg_gin_idx', schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.phd_students (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID NOT NULL REFERENCES %I.students(id),
supervisor_id UUID NOT NULL REFERENCES %I.user_accounts(id),
thesis_title VARCHAR(500),
start_date DATE NOT NULL,
expected_defense_date DATE,
actual_defense_date DATE,
status VARCHAR(30) DEFAULT 'active',
affiliation_status VARCHAR(30) DEFAULT 'ucar_only',
affiliation_enforcement_flag BOOLEAN DEFAULT FALSE,
orcid_id VARCHAR(50),
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.research_projects (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(500) NOT NULL,
description TEXT,
category VARCHAR(50),
funding_source VARCHAR(255),
funding_amount DECIMAL(15,2),
funding_year INTEGER,
start_date DATE,
end_date DATE,
status VARCHAR(30) DEFAULT 'proposed',
lead_id UUID NOT NULL,
team_ids UUID[],
output_count INTEGER DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.patents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
title VARCHAR(500) NOT NULL,
application_number VARCHAR(100),
registration_number VARCHAR(100),
filing_date DATE,
grant_date DATE,
status VARCHAR(30) DEFAULT 'pending',
inventors JSONB NOT NULL,
project_id UUID,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
-- ESG + infra + partnerships + employment + ingestion (condensed but complete)
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.esg_metrics (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
metric_date DATE NOT NULL,
period_type VARCHAR(10) NOT NULL,
criterion VARCHAR(30) NOT NULL,
indicator_code VARCHAR(100) NOT NULL,
indicator_name VARCHAR(255) NOT NULL,
value DECIMAL(15,4) NOT NULL,
unit VARCHAR(30) NOT NULL,
data_source VARCHAR(100),
submitted_by UUID,
created_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (metric_date, indicator_code)
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.campus_areas (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
area_type VARCHAR(50) NOT NULL,
area_m2 DECIMAL(12,2) NOT NULL,
measurement_year INTEGER NOT NULL,
notes TEXT,
updated_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (area_type, measurement_year)
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.buildings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
code VARCHAR(50),
floors INTEGER,
total_area_m2 DECIMAL(10,2),
construction_year INTEGER,
has_green_cert BOOLEAN DEFAULT FALSE,
energy_meter_id VARCHAR(100),
is_accessible BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.rooms (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
building_id UUID NOT NULL REFERENCES %I.buildings(id),
room_number VARCHAR(50) NOT NULL,
type VARCHAR(50) NOT NULL,
capacity INTEGER,
area_m2 DECIMAL(10,2),
has_projector BOOLEAN DEFAULT FALSE,
has_ac BOOLEAN DEFAULT FALSE,
is_accessible BOOLEAN DEFAULT FALSE,
status VARCHAR(20) DEFAULT 'available',
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.room_bookings (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
room_id UUID NOT NULL REFERENCES %I.rooms(id),
booked_by UUID NOT NULL REFERENCES %I.user_accounts(id),
booking_date DATE NOT NULL,
start_time TIME NOT NULL,
end_time TIME NOT NULL,
purpose VARCHAR(100),
status VARCHAR(20) DEFAULT 'confirmed',
created_at TIMESTAMPTZ DEFAULT NOW(),
-- Immutable expression path: use tsrange over timestamp (no tz cast in index expr)
EXCLUDE USING GIST (
room_id WITH =,
tsrange(booking_date + start_time, booking_date + end_time, '[)') WITH &&
)
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.assets (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
asset_type VARCHAR(50) NOT NULL,
serial_number VARCHAR(100) UNIQUE,
qr_code VARCHAR(100) UNIQUE,
room_id UUID REFERENCES %I.rooms(id),
purchase_date DATE,
purchase_cost DECIMAL(12,2),
warranty_expiry DATE,
status VARCHAR(20) DEFAULT 'operational',
last_inspection DATE,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.maintenance_tickets (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
asset_id UUID REFERENCES %I.assets(id),
room_id UUID REFERENCES %I.rooms(id),
reported_by UUID NOT NULL REFERENCES %I.user_accounts(id),
issue_type VARCHAR(50) NOT NULL,
description TEXT,
photo_url TEXT,
priority VARCHAR(10) DEFAULT 'normal',
status VARCHAR(20) DEFAULT 'open',
assigned_to UUID REFERENCES %I.user_accounts(id),
resolved_at TIMESTAMPTZ,
downtime_hours DECIMAL(6,2),
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.partnerships (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
partner_name VARCHAR(255) NOT NULL,
partner_country VARCHAR(100) NOT NULL,
partner_type VARCHAR(50) NOT NULL,
agreement_type VARCHAR(50) NOT NULL,
start_date DATE NOT NULL,
end_date DATE,
status VARCHAR(20) DEFAULT 'active',
is_international BOOLEAN DEFAULT TRUE,
domains TEXT[],
document_url TEXT,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.student_mobility (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID NOT NULL REFERENCES %I.students(id),
partnership_id UUID NOT NULL REFERENCES %I.partnerships(id),
direction VARCHAR(10) NOT NULL,
destination_country VARCHAR(100),
program_type VARCHAR(30) NOT NULL,
start_date DATE NOT NULL,
end_date DATE,
status VARCHAR(20) DEFAULT 'active',
feedback_score INTEGER,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.alumni (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID NOT NULL REFERENCES %I.students(id),
graduation_year INTEGER NOT NULL,
program_id UUID NOT NULL REFERENCES %I.programs(id),
degree_level VARCHAR(30),
current_status VARCHAR(30),
employer VARCHAR(255),
first_employment_date DATE,
months_to_employment INTEGER,
role_relates_to_degree BOOLEAN,
survey_completed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.employment_surveys (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
alumni_id UUID NOT NULL REFERENCES %I.alumni(id),
survey_month INTEGER NOT NULL,
employment_status VARCHAR(30),
employer VARCHAR(255),
job_title VARCHAR(255),
role_relates_to_degree BOOLEAN,
salary_range VARCHAR(50),
submitted_at TIMESTAMPTZ DEFAULT NOW(),
UNIQUE (alumni_id, survey_month)
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.career_fairs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
name VARCHAR(255) NOT NULL,
event_date DATE NOT NULL,
location VARCHAR(255),
participating_companies INTEGER DEFAULT 0,
student_registrations INTEGER DEFAULT 0,
placements_reported INTEGER DEFAULT 0,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.internship_placements (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
student_id UUID NOT NULL REFERENCES %I.students(id),
employer VARCHAR(255) NOT NULL,
employer_type VARCHAR(50),
start_date DATE NOT NULL,
end_date DATE,
is_paid BOOLEAN DEFAULT FALSE,
converted_to_job BOOLEAN DEFAULT FALSE,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name);
EXECUTE format($sql$
CREATE TABLE IF NOT EXISTS %I.ingestion_jobs (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
submitted_by UUID NOT NULL REFERENCES %I.user_accounts(id),
domain VARCHAR(50) NOT NULL,
file_name VARCHAR(500) NOT NULL,
file_type VARCHAR(20) NOT NULL,
file_url TEXT NOT NULL,
file_hash VARCHAR(64) NOT NULL,
file_size_bytes INTEGER,
status VARCHAR(20) DEFAULT 'queued',
page_count INTEGER,
rows_extracted INTEGER,
rows_valid INTEGER,
rows_invalid INTEGER,
extraction_result JSONB,
validation_errors JSONB DEFAULT '[]'::jsonb,
corrections JSONB DEFAULT '[]'::jsonb,
commit_id UUID REFERENCES %I.data_commits(id),
error_message TEXT,
started_at TIMESTAMPTZ,
completed_at TIMESTAMPTZ,
created_at TIMESTAMPTZ DEFAULT NOW()
)
$sql$, schema_name, schema_name, schema_name);
EXECUTE format($sql$
CREATE INDEX IF NOT EXISTS %I
ON %I.ingestion_jobs (status, domain, created_at DESC)
$sql$, schema_name || '_ingestion_jobs_status_domain_created_idx', schema_name);
-- Trigger to refresh aggregate when commit approved
EXECUTE format($sql$
DROP TRIGGER IF EXISTS on_commit_approved ON %I.data_commits;
CREATE TRIGGER on_commit_approved
AFTER UPDATE ON %I.data_commits
FOR EACH ROW
EXECUTE FUNCTION public.refresh_kpis_aggregate();
$sql$, schema_name, schema_name);
-- Attach audit trigger to key mutable tables (extend list as needed)
EXECUTE format($sql$
DROP TRIGGER IF EXISTS trg_audit_students ON %I.students;
CREATE TRIGGER trg_audit_students
AFTER INSERT OR UPDATE OR DELETE ON %I.students
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_enrollments ON %I.enrollments;
CREATE TRIGGER trg_audit_enrollments
AFTER INSERT OR UPDATE OR DELETE ON %I.enrollments
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_grades ON %I.grades;
CREATE TRIGGER trg_audit_grades
AFTER INSERT OR UPDATE OR DELETE ON %I.grades
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_data_commits ON %I.data_commits;
CREATE TRIGGER trg_audit_data_commits
AFTER INSERT OR UPDATE OR DELETE ON %I.data_commits
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_publications ON %I.publications;
CREATE TRIGGER trg_audit_publications
AFTER INSERT OR UPDATE OR DELETE ON %I.publications
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_esg_metrics ON %I.esg_metrics;
CREATE TRIGGER trg_audit_esg_metrics
AFTER INSERT OR UPDATE OR DELETE ON %I.esg_metrics
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_budgets ON %I.budgets;
CREATE TRIGGER trg_audit_budgets
AFTER INSERT OR UPDATE OR DELETE ON %I.budgets
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
DROP TRIGGER IF EXISTS trg_audit_expenses ON %I.expenses;
CREATE TRIGGER trg_audit_expenses
AFTER INSERT OR UPDATE OR DELETE ON %I.expenses
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();
$sql$,
schema_name, schema_name,
schema_name, schema_name,
schema_name, schema_name,
schema_name, schema_name,
schema_name, schema_name,
schema_name, schema_name,
schema_name, schema_name,
schema_name, schema_name
);
-- Basic RLS enablement (policy details can be expanded table-by-table)
EXECUTE format($sql$ALTER TABLE %I.user_accounts ENABLE ROW LEVEL SECURITY;$sql$, schema_name);
EXECUTE format($sql$ALTER TABLE %I.students ENABLE ROW LEVEL SECURITY;$sql$, schema_name);
EXECUTE format($sql$ALTER TABLE %I.enrollments ENABLE ROW LEVEL SECURITY;$sql$, schema_name);
EXECUTE format($sql$ALTER TABLE %I.grades ENABLE ROW LEVEL SECURITY;$sql$, schema_name);
EXECUTE format($sql$ALTER TABLE %I.attendance ENABLE ROW LEVEL SECURITY;$sql$, schema_name);
EXECUTE format($sql$ALTER TABLE %I.data_commits ENABLE ROW LEVEL SECURITY;$sql$, schema_name);
END;
$$;
-- ----------------------------------------------------------------------------
-- Instantiate 3 sample institution schemas
-- ----------------------------------------------------------------------------
DO $$
DECLARE
inst1 UUID;
inst2 UUID;
inst3 UUID;
BEGIN
INSERT INTO public.institutions (short_code, name_fr, name_ar, type, city, schema_name, sync_status, is_active)
VALUES
('INST001', 'Institution 001', 'المؤسسة 001', 'faculty', 'Tunis', 'inst_001', 'synced', TRUE),
('INST002', 'Institution 002', 'المؤسسة 002', 'institute','Ariana', 'inst_002', 'synced', TRUE),
('INST003', 'Institution 003', 'المؤسسة 003', 'school', 'Manouba', 'inst_003', 'synced', TRUE)
ON CONFLICT (schema_name) DO NOTHING;
SELECT id INTO inst1 FROM public.institutions WHERE schema_name = 'inst_001';
SELECT id INTO inst2 FROM public.institutions WHERE schema_name = 'inst_002';
SELECT id INTO inst3 FROM public.institutions WHERE schema_name = 'inst_003';
PERFORM public.create_institution_schema('inst_001', inst1);
PERFORM public.create_institution_schema('inst_002', inst2);
PERFORM public.create_institution_schema('inst_003', inst3);
END$$;
-- ----------------------------------------------------------------------------
-- Seed KPI definitions (core subset from docs)
-- ----------------------------------------------------------------------------
INSERT INTO public.kpi_definitions (domain, kpi_code, kpi_name_fr, formula_sql, unit, higher_is_better, is_active)
VALUES
('academic','academic.staff_student_ratio','Ratio enseignants/étudiants','SUM(academic_staff.fte) / NULLIF(COUNT(students.id),0)','ratio',TRUE,TRUE),
('academic','academic.dropout_rate','Taux d''abandon','COUNT(*) FILTER (WHERE enrollment_status = ''dropped'')::numeric / NULLIF(COUNT(*),0) * 100','%',FALSE,TRUE),
('research','research.avg_fwci','FWCI moyen','AVG(publications.fwci)','ratio',TRUE,TRUE),
('research','research.affiliation_verified_pct','% affiliation UCAR vérifiée','COUNT(*) FILTER (WHERE ucar_affiliation_valid = TRUE)::numeric / NULLIF(COUNT(*),0) * 100','%',TRUE,TRUE),
('employment','employment.employability_rate','Taux d''employabilité','COUNT(*) FILTER (WHERE current_status = ''employed'')::numeric / NULLIF(COUNT(*),0) * 100','%',TRUE,TRUE),
('esg','esg.renewable_energy_pct','% énergie renouvelable','SUM(ec2) / NULLIF(SUM(ec1),0) * 100','%',TRUE,TRUE),
('finance','finance.budget_execution_rate','Taux d''exécution budgétaire','SUM(expenses.amount) / NULLIF(SUM(budgets.allocated),0) * 100','%',TRUE,TRUE),
('partnerships','partnerships.intl_agreements_count','Nombre d''accords internationaux','COUNT(*) FILTER (WHERE is_international = TRUE)','count',TRUE,TRUE)
ON CONFLICT (kpi_code) DO NOTHING;
-- ----------------------------------------------------------------------------
-- Seed anomaly thresholds per domain
-- ----------------------------------------------------------------------------
INSERT INTO public.anomaly_thresholds (domain, contamination_factor, zscore_fallback, min_history_months, is_active)
VALUES
('academic',0.05,2.5,6,TRUE),
('finance',0.05,2.5,6,TRUE),
('hr',0.05,2.5,6,TRUE),
('research',0.05,2.5,6,TRUE),
('infrastructure',0.05,2.5,6,TRUE),
('employment',0.05,2.5,6,TRUE),
('partnerships',0.05,2.5,6,TRUE),
('esg',0.05,2.5,6,TRUE)
ON CONFLICT DO NOTHING;
-- ----------------------------------------------------------------------------
-- Seed system config defaults
-- ----------------------------------------------------------------------------
INSERT INTO public.system_config (key, value)
VALUES
('default_language', '"fr"'::jsonb),
('kpi_refresh_mode', '"event_driven"'::jsonb),
('report_default_format', '"pdf"'::jsonb),
('anomaly_engine_enabled', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
COMMIT;
