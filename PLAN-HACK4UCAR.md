# HACK4UCAR 2025 — UCAR-ERP: Intelligent University Management Platform
## Track 4: End-to-End Smart Platform

---

# TABLE OF CONTENTS

1. [System Architecture Overview](#1-system-architecture-overview)
2. [Complete Supabase Database Schema](#2-complete-supabase-database-schema)
3. [ETL & Data Migration Strategy](#3-etl--data-migration-strategy)
4. [Data Warehouse & Data Mart Architecture](#4-data-warehouse--data-mart-architecture)
5. [Authentication & Role-Based Access Control (RBAC)](#5-authentication--role-based-access-control-rbac)
6. [API Contract (Complete)](#6-api-contract-complete)
7. [Monorepo Structure & Setup](#7-monorepo-structure--setup)
8. [Frontend Dashboard Design & Features](#8-frontend-dashboard-design--features)
9. [AI Integration Strategy](#9-ai-integration-strategy)
10. [Team Prioritization & Sprint Plan](#10-team-prioritization--sprint-plan)

---

# 1. SYSTEM ARCHITECTURE OVERVIEW

## 1.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Frontend** | Next.js 15 (App Router) + TypeScript | SSR, routing, API routes built-in |
| **UI Components** | shadcn/ui + Tailwind CSS v4 | Accessible, customizable, fast dev |
| **Charts/Dashboards** | Recharts + Tremor | React-native charts, KPI widgets |
| **Database** | Supabase (PostgreSQL 15) | Multi-tenant, RLS, realtime, auth, storage |
| **Auth** | Supabase Auth + Custom RBAC table | Built-in JWT, Row Level Security |
| **API Layer** | Next.js API Routes + Supabase Edge Functions | Unified frontend-backend contract |
| **AI/ML** | OpenAI GPT-4o / Claude 3.5 + LangChain (Python) | NLP, RAG, OCR, predictions |
| **ETL Pipeline** | Python (Pandas, PyPDF2, Tesseract OCR, OpenPyXL) | Data ingestion from PDF, Excel, images |
| **Queue/Scheduler** | Supabase Cron + Edge Functions | Automated report generation, alerts |
| **Storage** | Supabase Storage (S3-compatible) | Documents, PDFs, images, exports |
| **Monorepo** | Turborepo + pnpm workspaces | Parallel builds, shared packages |
| **CI/CD** | GitHub Actions | Lint, test, deploy per service |
| **Deployment** | Vercel (frontend) + Supabase Cloud | Free tier for hackathon, scales to 30+ institutions |

## 1.2 High-Level Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 15)                       │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│   │HQ Admin  │ │Instit.   │ │Dept.     │ │Teacher / Student │  │
│   │Dashboard │ │Admin     │ │Director  │ │Dashboard         │  │
│   └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │ REST / WebSocket
┌──────────────────────────▼───────────────────────────────────────┐
│                     API GATEWAY LAYER                            │
│        Next.js API Routes + Supabase Edge Functions              │
│  ┌───────────┐ ┌──────────┐ ┌──────────┐ ┌─────────────────┐   │
│  │Auth       │ │Academic  │ │Finance   │ │AI / NLP         │   │
│  │Middleware │ │Service   │ │Service   │ │Service          │   │
│  └───────────┘ └──────────┘ └──────────┘ └─────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                   SUPABASE BACKEND                               │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────────────┐  │
│  │PostgreSQL  │  │Auth (JWT)   │  │Storage (S3)              │  │
│  │(Multi-     │  │+ Custom     │  │Documents, Exports,       │  │
│  │tenant RLS) │  │RBAC Table   │  │Uploads                   │  │
│  └────────────┘  └─────────────┘  └──────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    ETL & AI PIPELINE                             │
│  ┌────────────┐ ┌─────────────┐ ┌────────────────────────────┐  │
│  │OCR (PDF,   │ │Data         │ │AI Models (OpenAI/Claude)   │  │
│  │Img→Text)   │ │Cleaning     │ │RAG, NLP, Prediction,      │  │
│  │            │ │Transform    │ │Anomaly Detection, Reports  │  │
│  └────────────┘ └─────────────┘ └────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## 1.3 Actor Hierarchy & Roles

```
LEVEL 0: HQ Super Admin (President, Vice-President of UCAR)
  ├── Full access to ALL institutions (30+)
  ├── Can create/edit/delete institutions
  ├── Define default role permissions
  ├── Override any role's permissions
  ├── View consolidated KPIs across all institutions
  └── Manage system-wide configurations

LEVEL 1: Institution Super Admin (Dean/Director of each faculty/institute)
  ├── Full control over their institution ONLY
  ├── Manage departments within institution
  ├── Create sub-roles for their institution
  ├── View institution-level KPIs
  └── Approve workflows within institution

LEVEL 2: Department Director / Staff
  ├── Access to their department data ONLY
  ├── Manage department operations (finance, HR, academic)
  ├── Submit data for HQ enquiries
  ├── View department-level KPIs
  └── Assign teachers to courses

LEVEL 3: Teachers / Professors
  ├── Manage their courses, students, grades
  ├── Submit attendance, exam results
  ├── View student performance dashboards
  ├── Access research tracking
  └── Submit leave requests, training

LEVEL 4: Students
  ├── View their courses, grades, attendance
  ├── Access library, enrollment, payments
  ├── Scholarship applications
  ├── Campus life, events
  └── Alumni tracking (post-graduation)

LEVEL 5: External Stakeholders (partners, auditors, accreditation bodies)
  ├── Read-only access to specific KPI dashboards
  ├── GreenMetric / ISO compliance reports
  └── Partnership agreement tracking
```

---

# 2. COMPLETE SUPABASE DATABASE SCHEMA

## 2.0 Schema Design Principles

- **Multi-tenant**: Every table has `institution_id` (FK to institutions)
- **Row Level Security (RLS)**: Enabled on ALL tables
- **Soft delete**: `deleted_at` timestamp on all tables (never hard delete)
- **Audit trail**: `created_at`, `updated_at`, `created_by`, `updated_by` on all tables
- **UUIDs**: All primary keys are UUID v4
- **JSONB**: Used for flexible KPI definitions, enquiry templates, and dynamic fields

## 2.1 CORE TABLES — Organization Hierarchy

### `institutions`
```sql
CREATE TABLE institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_institution_id UUID REFERENCES institutions(id) ON DELETE SET NULL, -- NULL = top-level (UCAR HQ)
  name VARCHAR(255) NOT NULL,
  short_code VARCHAR(20) UNIQUE NOT NULL, -- e.g. "ENSTAB", "FST", "ISG"
  type VARCHAR(50) NOT NULL, -- 'university_hq', 'faculty', 'institute', 'school', 'research_center'
  address TEXT,
  city VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(255),
  website VARCHAR(255),
  established_year INTEGER,
  total_students INTEGER DEFAULT 0,
  total_staff INTEGER DEFAULT 0,
  accreditation_status TEXT[], -- ['ISO 9001', 'ISO 14001', 'GreenMetric', 'NCEE']
  logo_url TEXT, -- Supabase Storage URL
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}', -- institution-specific settings
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### `departments`
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  short_code VARCHAR(20),
  type VARCHAR(50) NOT NULL, -- 'academic', 'administrative', 'research', 'service'
  service_category VARCHAR(100), -- Maps to UCAR's 10 services: 'hr', 'finance', 'it', 'legal', 'library', 'equipment', 'budgeting', 'academic', 'research', 'student_life'
  head_user_id UUID, -- FK to profiles (set later)
  budget_allocation DECIMAL(15,2) DEFAULT 0,
  parent_department_id UUID REFERENCES departments(id),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### `buildings` & `rooms`
```sql
CREATE TABLE buildings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50),
  floors INTEGER,
  total_area_sqm DECIMAL(10,2),
  energy_meter_id VARCHAR(100), -- For ESG tracking
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  building_id UUID NOT NULL REFERENCES buildings(id),
  room_number VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'classroom', 'lab', 'office', 'library', 'auditorium', 'meeting'
  capacity INTEGER,
  area_sqm DECIMAL(10,2),
  has_projector BOOLEAN DEFAULT false,
  has_ac BOOLEAN DEFAULT false,
  is_accessible BOOLEAN DEFAULT false, -- ESG: accessibility
  status VARCHAR(20) DEFAULT 'available', -- 'available', 'occupied', 'maintenance'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.2 USERS & AUTH TABLES

### `profiles` (extends Supabase auth.users)
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
  phone VARCHAR(30),
  avatar_url TEXT,
  role_id UUID NOT NULL REFERENCES roles(id),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  employee_id VARCHAR(50), -- University employee number
  student_id VARCHAR(50), -- University student number
  date_of_birth DATE,
  hire_date DATE,
  graduation_date DATE,
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}', -- language, notifications, theme
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
```

### `roles` (RBAC Core)
```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL, -- 'hq_super_admin', 'institution_admin', 'department_director', 'teacher', 'student', 'external_auditor'
  description TEXT,
  hierarchy_level INTEGER NOT NULL, -- 0=HQ, 1=Institution, 2=Department, 3=Teacher, 4=Student, 5=External
  is_system_role BOOLEAN DEFAULT true, -- false = custom role created by admin
  parent_role_id UUID REFERENCES roles(id),
  institution_id UUID REFERENCES institutions(id), -- NULL for system-wide roles
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `role_permissions` (Dynamic Permission Matrix)
```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  resource VARCHAR(100) NOT NULL, -- table or feature name: 'students', 'grades', 'finance', 'reports'
  action VARCHAR(50) NOT NULL, -- 'create', 'read', 'update', 'delete', 'export', 'approve'
  scope VARCHAR(50) DEFAULT 'own', -- 'own', 'department', 'institution', 'all'
  is_granted BOOLEAN DEFAULT true,
  UNIQUE(role_id, resource, action)
);

-- Default role definitions
-- slug: 'hq_super_admin' (level 0) → ALL resources, ALL actions (except where scoped)
-- slug: 'institution_admin' (level 1) → ALL resources within their institution
-- slug: 'department_director' (level 2) → Department-specific resources
-- slug: 'department_staff' (level 2) → Read + limited write within department
-- slug: 'teacher' (level 3) → Own courses, grades, attendance
-- slug: 'student' (level 4) → Own data read-only, submit requests
-- slug: 'external_auditor' (level 5) → Read-only KPIs, reports
-- slug: 'partner' (level 5) → Partnership agreements, mobility data
-- slug: 'librarian' (level 2) → Library resources management
-- slug: 'accountant' (level 2) → Finance, budget, procurement
-- slug: 'hr_manager' (level 2) → HR, staff, training
-- slug: 'it_admin' (level 2) → IT equipment, infrastructure
-- slug: 'legal_officer' (level 2) → Legal documents, compliance
-- slug: 'research_director' (level 2) → Research, publications, projects
-- slug: 'alumni' (level 5) → Read-only own data, employment tracking
```

## 2.3 ACADEMIC DOMAIN

### `academic_years` & `semesters`
```sql
CREATE TABLE academic_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL, -- '2025-2026'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  institution_id UUID REFERENCES institutions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  name VARCHAR(50) NOT NULL, -- 'Semester 1', 'Semester 2'
  number INTEGER NOT NULL, -- 1 or 2
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `programs` (Degrees/Diplomas)
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  name VARCHAR(255) NOT NULL,
  short_code VARCHAR(50),
  level VARCHAR(50) NOT NULL, -- 'bachelor', 'master_research', 'master_professional', 'engineering', 'phd', 'preparatory'
  duration_years INTEGER,
  total_credits INTEGER,
  accreditation_status VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `courses`
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  credits INTEGER NOT NULL,
  hours_lecture INTEGER DEFAULT 0,
  hours_tutorial INTEGER DEFAULT 0,
  hours_practical INTEGER DEFAULT 0,
  semester_number INTEGER,
  is_active BOOLEAN DEFAULT true,
  syllabus_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `enrollments`
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id),
  program_id UUID NOT NULL REFERENCES programs(id),
  academic_year_id UUID NOT NULL REFERENCES academic_years(id),
  enrollment_date DATE DEFAULT CURRENT_DATE,
  status VARCHAR(30) DEFAULT 'active', -- 'active', 'completed', 'dropped', 'suspended', 'graduated'
  current_semester INTEGER DEFAULT 1,
  cumulative_gpa DECIMAL(4,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_profile_id, program_id, academic_year_id)
);
```

### `course_enrollments`
```sql
CREATE TABLE course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id),
  course_id UUID NOT NULL REFERENCES courses(id),
  semester_id UUID NOT NULL REFERENCES semesters(id),
  teacher_profile_id UUID REFERENCES profiles(id),
  grade DECIMAL(5,2), -- Null until graded
  grade_letter VARCHAR(5), -- A, B+, B, C, D, F
  status VARCHAR(20) DEFAULT 'enrolled', -- 'enrolled', 'completed', 'failed', 'withdrawn'
  attendance_percentage DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, course_id, semester_id)
);
```

### `attendance`
```sql
CREATE TABLE attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_enrollment_id UUID NOT NULL REFERENCES course_enrollments(id),
  session_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'late', 'excused'
  check_in_time TIME,
  check_out_time TIME,
  recorded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `exams` & `exam_results`
```sql
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id),
  semester_id UUID NOT NULL REFERENCES semesters(id),
  exam_type VARCHAR(30) NOT NULL, -- 'midterm', 'final', 'practical', 'oral', 'remedial'
  exam_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  room_id UUID REFERENCES rooms(id),
  max_score DECIMAL(6,2) DEFAULT 100,
  weight_percentage DECIMAL(5,2), -- contribution to final grade
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE exam_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES exams(id),
  course_enrollment_id UUID NOT NULL REFERENCES course_enrollments(id),
  score DECIMAL(6,2),
  remarks TEXT,
  submitted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(exam_id, course_enrollment_id)
);
```

## 2.4 HR DOMAIN

### `staff` (extends profiles for employees)
```sql
CREATE TABLE staff_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) UNIQUE,
  employee_type VARCHAR(30) NOT NULL, -- 'teaching', 'administrative', 'technical', 'service'
  grade VARCHAR(30), -- 'professor', 'maitre_conference', 'assistant', 'administrator'
  contract_type VARCHAR(30), -- 'permanent', 'contractual', 'visiting', 'part_time'
  salary_grade VARCHAR(20),
  teaching_hours_weekly INTEGER DEFAULT 0,
  administrative_hours_weekly INTEGER DEFAULT 0,
  supervisor_id UUID REFERENCES profiles(id),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'on_leave', 'suspended', 'retired'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `leave_requests`
```sql
CREATE TABLE leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_profile_id UUID NOT NULL REFERENCES profiles(id),
  leave_type VARCHAR(30) NOT NULL, -- 'annual', 'sick', 'maternity', 'research', 'training', 'unpaid'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  approved_by UUID REFERENCES profiles(id),
  approval_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `training_programs`
```sql
CREATE TABLE training_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  provider VARCHAR(255),
  type VARCHAR(50), -- 'technical', 'pedagogical', 'administrative', 'research', 'language'
  duration_hours INTEGER,
  start_date DATE,
  end_date DATE,
  institution_id UUID REFERENCES institutions(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE training_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID NOT NULL REFERENCES training_programs(id),
  staff_profile_id UUID NOT NULL REFERENCES profiles(id),
  completion_status VARCHAR(20) DEFAULT 'enrolled', -- 'enrolled', 'completed', 'failed'
  score DECIMAL(5,2),
  certificate_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.5 FINANCE DOMAIN

### `budgets`
```sql
CREATE TABLE budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  fiscal_year INTEGER NOT NULL,
  total_allocated DECIMAL(15,2) NOT NULL,
  total_consumed DECIMAL(15,2) DEFAULT 0,
  category VARCHAR(50), -- 'operational', 'research', 'infrastructure', 'equipment', 'training', 'events'
  status VARCHAR(20) DEFAULT 'active', -- 'draft', 'approved', 'active', 'closed'
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `expenses`
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID REFERENCES budgets(id),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'salary', 'equipment', 'maintenance', 'utilities', 'supplies', 'travel', 'training'
  expense_date DATE NOT NULL,
  payment_method VARCHAR(30),
  receipt_url TEXT, -- Supabase Storage
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'paid'
  submitted_by UUID REFERENCES profiles(id),
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `procurement_offers` (Appels d'Offres)
```sql
CREATE TABLE procurement_offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  reference_number VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'equipment', 'construction', 'services', 'supplies', 'it'
  estimated_budget DECIMAL(15,2),
  publication_date DATE,
  submission_deadline DATE,
  status VARCHAR(30) DEFAULT 'draft', -- 'draft', 'published', 'evaluation', 'awarded', 'closed'
  awarded_to VARCHAR(255),
  awarded_amount DECIMAL(15,2),
  documents_urls TEXT[], -- Array of Supabase Storage URLs
  evaluation_committee UUID[], -- Array of profile IDs
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.6 RESEARCH DOMAIN

### `research_projects`
```sql
CREATE TABLE research_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  category VARCHAR(50), -- 'national', 'international', 'industry', 'academic'
  funding_source VARCHAR(255),
  funding_amount DECIMAL(15,2),
  start_date DATE,
  end_date DATE,
  status VARCHAR(30) DEFAULT 'proposed', -- 'proposed', 'active', 'completed', 'suspended'
  lead_researcher_id UUID REFERENCES profiles(id),
  team_members UUID[], -- Array of profile IDs
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `publications`
```sql
CREATE TABLE publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  abstract TEXT,
  type VARCHAR(30), -- 'journal_article', 'conference_paper', 'book', 'chapter', 'patent', 'thesis'
  journal_name VARCHAR(255),
  doi VARCHAR(255),
  publication_date DATE,
  volume VARCHAR(50),
  issue VARCHAR(50),
  pages VARCHAR(50),
  citation_count INTEGER DEFAULT 0,
  impact_factor DECIMAL(5,2),
  is_indexed BOOLEAN DEFAULT false, -- Scopus, Web of Science
  authors JSONB NOT NULL, -- [{profile_id, name, affiliation, order}]
  institution_id UUID NOT NULL REFERENCES institutions(id),
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.7 ESG / SUSTAINABILITY DOMAIN

### `esg_metrics`
```sql
CREATE TABLE esg_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  metric_date DATE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'energy', 'carbon', 'waste', 'water', 'mobility', 'accessibility', 'green_cover'
  metric_name VARCHAR(100) NOT NULL, -- 'electricity_consumption_kwh', 'co2_emissions_kg', 'recycling_rate_pct'
  metric_value DECIMAL(15,4) NOT NULL,
  unit VARCHAR(30) NOT NULL,
  source VARCHAR(255), -- where data came from
  submitted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Common ESG metrics tracked:
-- Energy: electricity_kwh, gas_m3, renewable_pct, energy_intensity_kwh_per_sqm
-- Carbon: scope1_emissions_kg, scope2_emissions_kg, scope3_emissions_kg, carbon_footprint_per_student
-- Waste: total_waste_kg, recycling_rate_pct, hazardous_waste_kg, paper_consumption_kg
-- Water: water_consumption_m3, water_recycling_pct, rainwater_harvesting_m3
-- Mobility: student_public_transport_pct, staff_public_transport_pct, ev_charging_stations, bike_parking
-- Accessibility: accessible_entrances_pct, accessible_restrooms, braille_signage, ramps_count
-- Green: green_space_sqm, tree_count, biodiversity_index, green_building_certifications
```

### `greenmetric_data` (UI GreenMetric specific)
```sql
CREATE TABLE greenmetric_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  submission_year INTEGER NOT NULL,
  -- Setting & Infrastructure (SI)
  si_campus_area_sqm DECIMAL(10,2),
  si_green_open_space_sqm DECIMAL(10,2),
  si_forest_vegetation_pct DECIMAL(5,2),
  si_budget_sustainability_pct DECIMAL(5,2),
  -- Energy & Climate Change (EC)
  ec_energy_efficient_appliances_count INTEGER,
  ec_smart_building_count INTEGER,
  ec_renewable_energy_pct DECIMAL(5,2),
  ec_total_electricity_kwh DECIMAL(15,2),
  ec_co2_emissions_tonnes DECIMAL(10,2),
  -- Waste (WS)
  ws_recycling_program BOOLEAN,
  ws_organic_waste_treatment BOOLEAN,
  ws_inorganic_waste_treatment BOOLEAN,
  ws_sewage_disposal BOOLEAN,
  -- Water (WR)
  wr_water_conservation_program BOOLEAN,
  wr_piped_water_program BOOLEAN,
  wr_water_recycling_pct DECIMAL(5,2),
  -- Transportation (TR)
  tr_public_transport_shuttle INTEGER,
  tr_zero_emission_vehicles INTEGER,
  tr_bicycle_policy BOOLEAN,
  tr_pedestrian_policy BOOLEAN,
  -- Education & Research (ED)
  ed_sustainability_courses_count INTEGER,
  ed_sustainability_research_funding DECIMAL(15,2),
  ed_sustainability_publications_count INTEGER,
  ed_sustainability_events_count INTEGER,
  total_score DECIMAL(8,2),
  ranking INTEGER,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.8 PARTNERSHIPS & MOBILITY

### `partnerships`
```sql
CREATE TABLE partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  partner_name VARCHAR(255) NOT NULL,
  partner_type VARCHAR(50), -- 'university', 'company', 'ngo', 'government', 'international_org'
  partner_country VARCHAR(100),
  agreement_type VARCHAR(50), -- 'mou', 'exchange', 'research', 'double_degree', 'internship'
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'draft', 'active', 'expired', 'terminated'
  description TEXT,
  contact_person_id UUID REFERENCES profiles(id),
  agreement_document_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `student_mobility`
```sql
CREATE TABLE student_mobility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id),
  partnership_id UUID REFERENCES partnerships(id),
  mobility_type VARCHAR(30), -- 'incoming', 'outgoing'
  program_type VARCHAR(30), -- 'erasmus', 'exchange', 'internship', 'double_degree'
  destination_institution VARCHAR(255),
  destination_country VARCHAR(100),
  start_date DATE,
  end_date DATE,
  status VARCHAR(20) DEFAULT 'planned', -- 'planned', 'active', 'completed'
  credits_transferred INTEGER,
  report_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.9 ENQUIRIES & WORKFLOWS

### `enquiry_templates`
```sql
CREATE TABLE enquiry_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50), -- 'academic', 'financial', 'research', 'esg', 'hr', 'infrastructure'
  fields_schema JSONB NOT NULL, -- Dynamic form definition: [{name, type, label, required, options}]
  deadline_days INTEGER DEFAULT 7, -- Default days to respond
  created_by UUID REFERENCES profiles(id),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `enquiries`
```sql
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES enquiry_templates(id),
  sender_institution_id UUID NOT NULL REFERENCES institutions(id),
  target_institution_ids UUID[] NOT NULL, -- Which institutions must respond
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(30) DEFAULT 'draft', -- 'draft', 'sent', 'partially_answered', 'completed', 'closed'
  due_date DATE,
  priority VARCHAR(10) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `enquiry_responses`
```sql
CREATE TABLE enquiry_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id UUID NOT NULL REFERENCES enquiries(id),
  respondent_institution_id UUID NOT NULL REFERENCES institutions(id),
  respondent_profile_id UUID NOT NULL REFERENCES profiles(id),
  response_data JSONB NOT NULL, -- Dynamic answers matching template schema
  attachments UUID[], -- Array of file IDs from Supabase Storage
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'reviewed', 'approved'
  notes TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enquiry_id, respondent_institution_id)
);
```

## 2.10 KPI & ANALYTICS

### `kpi_definitions`
```sql
CREATE TABLE kpi_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL, -- 'academic', 'employment', 'finance', 'esg', 'hr', 'research', 'infrastructure', 'partnerships'
  description TEXT,
  formula TEXT, -- SQL expression or description
  unit VARCHAR(50),
  target_value DECIMAL(15,4),
  warning_threshold DECIMAL(15,4),
  critical_threshold DECIMAL(15,4),
  aggregation_type VARCHAR(20) DEFAULT 'avg', -- 'avg', 'sum', 'min', 'max', 'count'
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `kpi_values` (Materialized data for fast dashboard)
```sql
CREATE TABLE kpi_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_definition_id UUID NOT NULL REFERENCES kpi_definitions(id),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  department_id UUID REFERENCES departments(id),
  period_type VARCHAR(10) NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly', 'annual'
  period_value VARCHAR(50) NOT NULL, -- '2025-04', '2025-Q2', '2025'
  value DECIMAL(15,4) NOT NULL,
  compared_to_previous DECIMAL(10,2), -- Percentage change
  compared_to_target DECIMAL(10,2), -- Percentage of target achieved
  status VARCHAR(10), -- 'ok', 'warning', 'critical' (computed)
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(kpi_definition_id, institution_id, period_type, period_value)
);
```

### `alerts`
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  kpi_definition_id UUID REFERENCES kpi_definitions(id),
  alert_type VARCHAR(30) NOT NULL, -- 'threshold_breach', 'anomaly', 'deadline', 'approval_required'
  severity VARCHAR(10) NOT NULL, -- 'info', 'warning', 'critical'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.11 LIBRARY DOMAIN

```sql
CREATE TABLE library_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES institutions(id),
  title VARCHAR(500) NOT NULL,
  type VARCHAR(30) NOT NULL, -- 'book', 'journal', 'thesis', 'ebook', 'multimedia'
  isbn VARCHAR(20),
  authors JSONB,
  publisher VARCHAR(255),
  publication_year INTEGER,
  category VARCHAR(100),
  location VARCHAR(100), -- shelf/call number
  total_copies INTEGER DEFAULT 1,
  available_copies INTEGER DEFAULT 1,
  language VARCHAR(50),
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE library_borrowings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID NOT NULL REFERENCES library_resources(id),
  borrower_profile_id UUID NOT NULL REFERENCES profiles(id),
  borrow_date DATE DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  return_date DATE,
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'returned', 'overdue', 'lost'
  fine_amount DECIMAL(8,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.12 NOTIFICATIONS & COMMUNICATION

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_profile_id UUID NOT NULL REFERENCES profiles(id),
  type VARCHAR(30) NOT NULL, -- 'alert', 'enquiry', 'approval', 'deadline', 'system', 'announcement'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  action_url TEXT, -- Deep link to relevant page
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.13 AUDIT LOG

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  institution_id UUID REFERENCES institutions(id),
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'export', 'approve'
  resource VARCHAR(100) NOT NULL, -- table name
  resource_id UUID,
  changes JSONB, -- {old: {...}, new: {...}}
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 2.14 RLS Policies (Row Level Security)

```sql
-- Example RLS for students table (enrollments)
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Policy: Students can only see their own enrollments
CREATE POLICY "students_own_enrollments" ON enrollments
  FOR SELECT USING (
    auth.uid() = student_profile_id
  );

-- Policy: Teachers can see enrollments in their department's programs
CREATE POLICY "teacher_department_enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      JOIN staff_details sd ON sd.profile_id = p.id
      JOIN departments d ON d.id = p.department_id
      JOIN programs prog ON prog.id = enrollments.program_id
      WHERE p.id = auth.uid()
      AND sd.employee_type = 'teaching'
      AND prog.department_id = d.id
    )
  );

-- Policy: Institution admins see all in their institution
CREATE POLICY "institution_admin_enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid()
      AND p.institution_id = enrollments.institution_id() -- via program join
    )
  );

-- Generic RLS pattern applied to ALL tables:
-- 1. HQ Super Admin: bypass RLS (has service_role key in API)
-- 2. Institution-level: WHERE institution_id = profile.institution_id
-- 3. Department-level: WHERE department_id = profile.department_id
-- 4. Own data: WHERE profile_id = auth.uid()
```

---

# 3. ETL & DATA MIGRATION STRATEGY

## 3.1 Data Source Inventory

| Source Type | Volume Estimate | Tools Required |
|------------|-----------------|----------------|
| Excel files (.xlsx, .xls) | 1000+ files across 30 institutions | OpenPyXL, Pandas |
| PDF documents (reports, forms) | 500+ documents | PyPDF2, pdfplumber, Tesseract OCR |
| Scanned images (paper records) | 2000+ pages | Tesseract OCR, OpenCV |
| Emails (Outlook/Gmail exports) | Various | Python email parser, IMAP |
| Legacy MySQL databases | Multiple per institution | pgLoader, Python SQLAlchemy |
| CSV exports | 100+ files | Pandas |
| Paper forms | Unknown (ongoing) | OCR via mobile upload |

## 3.2 ETL Pipeline Architecture

```
SOURCE LAYER              TRANSFORM LAYER           LOAD LAYER
┌─────────────┐          ┌──────────────────┐     ┌──────────────┐
│ Excel Files │──┐       │ Python ETL       │     │ Supabase     │
│ PDF Docs    │──┤       │ Container        │     │ PostgreSQL   │
│ Images      │──┼──────→│ (FastAPI/Django) │────→│ (Staging     │
│ Emails      │──┤       │                  │     │  Tables)     │
│ MySQL DBs   │──┤       │ - Data Cleaning  │     └──────┬───────┘
│ CSV Files   │──┘       │ - Normalization  │            │
└─────────────┘          │ - Deduplication  │     ┌──────▼───────┐
                         │ - AI Extraction  │     │ Production   │
                         │ - Validation     │     │ Tables       │
                         └──────────────────┘     │ (Validated)  │
                                                  └──────────────┘
```

## 3.3 ETL Phases

### Phase 1: Discovery & Inventory
1. Deploy institution-level file upload portal
2. Staff upload all Excel, PDF, CSV files per department
3. Auto-detect file types, extract metadata
4. Build source inventory database

### Phase 2: Extraction
1. **Excel**: Parse sheets → detect headers → map to schema fields
2. **PDF**: OCR pipeline → text extraction → field detection via regex + NLP
3. **Images**: Tesseract OCR + image preprocessing (OpenCV)
4. **Emails**: Parse .eml/.pst → extract attachments → extract structured data from body
5. **MySQL**: Direct migration via pgLoader with schema mapping

### Phase 3: Transformation (Cleaning)
1. **Standardization**: Normalize names, dates, currencies (TND), grades (0-20 scale)
2. **Deduplication**: Fuzzy matching on names/emails to merge duplicate records
3. **Validation**: Required fields, data type checks, foreign key lookups
4. **Enrichment**: AI-powered field completion (e.g., department from course name)
5. **Flagging**: Unresolvable records → human review queue

### Phase 4: Loading
1. Stage tables (raw data, traceable to source)
2. Validation pass → move to production tables
3. Review queue UI for flagged records
4. Audit log of every migration action

## 3.4 AI-Assisted Enquiry Filling (Key Innovation)

**Flow:**
```
1. HQ sends enquiry to 30 institutions
2. Institution staff upload raw data (Excel/PDF)
3. AI Pipeline:
   a. OCR + NLP extracts relevant fields
   b. Maps extracted data to enquiry template
   c. Pre-fills all answer fields
   d. Flags uncertain answers for human review
4. Staff reviews, corrects, and submits in minutes (not days)
```

---

# 4. DATA WAREHOUSE & DATA MART ARCHITECTURE

## 4.1 Data Warehouse Architecture (Star Schema)

```
                    ┌─────────────────────┐
                    │   FACT TABLES       │
                    ├─────────────────────┤
                    │ fact_enrollments    │── Student counts, success rates
                    │ fact_expenses       │── Financial transactions
                    │ fact_attendance     │── Daily attendance records
                    │ fact_exam_results   │── Grades, pass/fail
                    │ fact_esg_metrics    │── Energy, carbon, waste
                    │ fact_publications   │── Research output
                    │ fact_staff_events   │── Hiring, leaves, training
                    │ fact_partnerships   │── Agreements, mobility
                    └─────────┬───────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────▼────────┐  ┌─────────▼────────┐  ┌─────────▼────────┐
│ TIME DIMENSION │  │ INSTITUTION DIM  │  │ PROGRAM DIM      │
│ year           │  │ id, name, type   │  │ id, name, level  │
│ semester       │  │ parent, city     │  │ department,      │
│ month, week    │  │ accreditation    │  │ accreditation     │
│ date           │  └──────────────────┘  └──────────────────┘
└────────────────┘
```

## 4.2 Data Marts (Department-Specific Views)

| Data Mart | Consumers | Key Metrics | Refresh |
|-----------|-----------|-------------|---------|
| **Academic Mart** | Deans, Teachers, Students | Success rate, GPA, attendance, dropout | Daily |
| **Finance Mart** | Finance Dept, HQ | Budget vs actual, cost/student, spending categories | Daily |
| **HR Mart** | HR Directors | Headcount, absenteeism, training, stability | Weekly |
| **Research Mart** | Research Directors | Publications, funding, projects, patents | Weekly |
| **ESG Mart** | Sustainability Committee | Energy, carbon, recycling rates, mobility | Monthly |
| **Infrastructure Mart** | IT, Facilities | Room occupancy, equipment status, maintenance | Daily |
| **Partnerships Mart** | International Office | Active agreements, mobility, projects | Weekly |
| **Procurement Mart** | Procurement, Legal | Active offers, awarded contracts, timelines | Weekly |
| **HQ Consolidated Mart** | President, VP | Cross-institution KPI comparison, trends | Real-time |

## 4.3 Materialized Views for Performance

```sql
-- Example: Enrollment KPI Materialized View
CREATE MATERIALIZED VIEW mv_enrollment_kpis AS
SELECT
  i.id AS institution_id,
  i.name AS institution_name,
  ay.name AS academic_year,
  p.level AS program_level,
  COUNT(DISTINCT e.id) AS total_enrollments,
  COUNT(DISTINCT CASE WHEN e.status = 'graduated' THEN e.id END) AS graduates,
  AVG(e.cumulative_gpa) AS avg_gpa,
  (COUNT(DISTINCT CASE WHEN e.status = 'dropped' THEN e.id END) * 100.0 / NULLIF(COUNT(DISTINCT e.id), 0)) AS dropout_rate
FROM enrollments e
JOIN programs p ON p.id = e.program_id
JOIN institutions i ON i.id = p.institution_id
JOIN academic_years ay ON ay.id = e.academic_year_id
WHERE e.deleted_at IS NULL
GROUP BY i.id, i.name, ay.name, p.level;

-- Refresh via Supabase Cron (Edge Function) every hour
```

---

# 5. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC)

## 5.1 Auth Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     AUTHENTICATION FLOW                          │
│                                                                  │
│  1. User → Login Page (email/password or SSO)                    │
│  2. Supabase Auth → JWT Token (contains user_id, email, role)    │
│  3. Frontend → Decode JWT → Extract role_id + institution_id     │
│  4. Frontend → Fetch role_permissions for that role              │
│  5. Frontend → Fetch user profile (institution, department)      │
│  6. ALL API calls → Bearer token → RLS Policies on Supabase      │
│  7. Middleware checks: JWT validity + role has required action   │
└──────────────────────────────────────────────────────────────────┘
```

## 5.2 JWT Claims (Custom Hook)

```sql
-- Supabase Auth Hook to inject role & institution into JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB AS $$
DECLARE
  claims JSONB;
  user_profile RECORD;
BEGIN
  SELECT p.role_id, r.slug as role_slug, r.hierarchy_level, p.institution_id, p.department_id
  INTO user_profile
  FROM profiles p
  JOIN roles r ON r.id = p.role_id
  WHERE p.id = (event->>'user_id')::UUID;

  claims := event->'claims';

  -- Add custom claims
  claims := jsonb_set(claims, '{app_metadata,role_id}', to_jsonb(user_profile.role_id));
  claims := jsonb_set(claims, '{app_metadata,role_slug}', to_jsonb(user_profile.role_slug));
  claims := jsonb_set(claims, '{app_metadata,hierarchy_level}', to_jsonb(user_profile.hierarchy_level));
  claims := jsonb_set(claims, '{app_metadata,institution_id}', to_jsonb(user_profile.institution_id));
  claims := jsonb_set(claims, '{app_metadata,department_id}', to_jsonb(user_profile.department_id));

  event := jsonb_set(event, '{claims}', claims);
  RETURN event;
END;
$$ LANGUAGE plpgsql;
```

## 5.3 Permission System Design

### Permission Check Flow:
```
User requests action → Middleware extracts role_id from JWT
→ Query role_permissions WHERE role_id = X AND resource = Y AND action = Z
→ If is_granted = true AND scope matches → ALLOW
→ If not found → DENY (default deny)
```

### Default Role Permissions Matrix:

| Resource | hq_super_admin | institution_admin | department_director | teacher | student | external_auditor |
|----------|:---:|:---:|:---:|:---:|:---:|:---:|
| institutions | CRUD | R (own) | R (own) | - | - | R |
| departments | CRUD | CRUD | RU (own) | R | - | R |
| profiles (users) | CRUD | CRUD (instit.) | R (dept) | R (limited) | R (self) | - |
| enrollments | R | R (instit.) | R (dept) | R (courses) | R (own) | R (agg.) |
| grades | R | R | R | CRUD | R (own) | R (agg.) |
| attendance | R | R | R | CRUD | R (own) | R (agg.) |
| budgets | CRUD | CRUD (instit.) | RU (dept) | - | - | R |
| expenses | CRUD | CRUD (instit.) | CRU (dept) | - | - | R |
| research | CRUD | CRUD (instit.) | CRUD (dept) | CRU | R | R |
| esg_metrics | CRUD | CRUD (instit.) | R | - | - | CRU |
| partnerships | CRUD | CRUD (instit.) | R | R | R | R |
| enquiries | CRUD | RU | RU | - | - | - |
| procurement | CRUD | CRUD (instit.) | R | - | - | R |
| kpi_values | CRUD | R (instit.) | R (dept) | R (limited) | - | R |
| alerts | CRUD | R (instit.) | R (dept) | - | - | - |
| audit_logs | R | R (instit.) | - | - | - | - |
| role_permissions | CRUD | RU (instit.) | - | - | - | - |

### Dynamic Permission Override (HQ Super Admin):
```sql
-- HQ admin can grant/revoke ANY permission for ANY role
-- This is done via the Admin UI → updates role_permissions table
-- RLS ensures only hq_super_admin can modify role_permissions
```

## 5.4 Frontend RBAC Implementation

```typescript
// lib/permissions.ts
export async function hasPermission(
  user: UserWithRole,
  resource: string,
  action: string,
  scope?: string
): Promise<boolean> {
  // 1. Check role_permissions cache (Redis or in-memory)
  // 2. If not cached, query Supabase
  // 3. Cache result for session duration
  // 4. Apply scope check:
  //    - 'own': only records where created_by = user.id
  //    - 'department': only records where department_id = user.department_id
  //    - 'institution': only records where institution_id = user.institution_id
  //    - 'all': all records (HQ only)
}

// React Hook for UI-level permission checks
export function usePermission(resource: string, action: string) {
  // Returns { allowed: boolean, isLoading: boolean }
  // Used to conditionally render UI elements
}
```

---

# 6. API CONTRACT (COMPLETE)

## 6.1 API Design Standards

- **Base URL**: `https://api.ucar-erp.tn/v1` (or `/api/v1` for Next.js routes)
- **Auth**: Bearer JWT token in `Authorization` header
- **Format**: JSON request/response
- **Pagination**: `?page=1&limit=20` with `Link` header for next/prev
- **Filtering**: `?institution_id=uuid&status=active&search=term`
- **Sorting**: `?sort_by=created_at&sort_order=desc`
- **Error Format**: `{ error: { code: "string", message: "string", details: {} } }`
- **Versioning**: URL-based (`/v1/...`)

## 6.2 Complete API Endpoints

### AUTH & USERS

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| POST | `/auth/login` | Email/password login | Public | `{email, password}` | `{access_token, refresh_token, user}` |
| POST | `/auth/logout` | Logout | Authenticated | - | `{success: true}` |
| POST | `/auth/refresh` | Refresh token | Public | `{refresh_token}` | `{access_token}` |
| POST | `/auth/register` | Self-register (student) | Public | `{email, password, first_name, last_name, student_id}` | `{user}` |
| GET | `/users/me` | Get current user profile | Authenticated | - | `{profile, role, permissions[]}` |
| PUT | `/users/me` | Update own profile | Authenticated | `{first_name, last_name, phone, avatar_url}` | `{profile}` |
| GET | `/users` | List users (scoped) | institution_admin+ | `?institution_id=&department_id=&role=&search=` | `{users[], total, page}` |
| GET | `/users/:id` | Get user detail | institution_admin+ | - | `{user, profile, role}` |
| POST | `/users` | Create user (admin) | institution_admin+ | `{email, first_name, last_name, role_id, institution_id, department_id}` | `{user}` |
| PUT | `/users/:id` | Update user | institution_admin+ | `{role_id, department_id, is_active}` | `{user}` |
| DELETE | `/users/:id` | Soft-delete user | hq_super_admin | - | `{success: true}` |
| GET | `/roles` | List all roles | hq_super_admin | `?institution_id=` | `{roles[]}` |
| POST | `/roles` | Create custom role | hq_super_admin | `{name, institution_id, permissions[]}` | `{role}` |
| PUT | `/roles/:id/permissions` | Update role permissions | hq_super_admin | `{permissions: [{resource, action, is_granted}]}` | `{role}` |
| GET | `/roles/:id/permissions` | Get role permissions | Authenticated | - | `{permissions[]}` |

### INSTITUTIONS & DEPARTMENTS

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/institutions` | List all institutions | Authenticated | `?parent_id=&type=&search=` | `{institutions[], total}` |
| GET | `/institutions/:id` | Get institution detail | Authenticated | - | `{institution, departments[], stats}` |
| POST | `/institutions` | Create institution | hq_super_admin | `{name, type, address, ...}` | `{institution}` |
| PUT | `/institutions/:id` | Update institution | institution_admin+ | `{name, accreditation_status, ...}` | `{institution}` |
| GET | `/institutions/:id/kpi-summary` | Institution KPI summary | institution_admin+ | `?period=2025` | `{kpis: {academic, finance, esg, hr, research}}` |
| GET | `/departments` | List departments | Authenticated | `?institution_id=&type=&service_category=` | `{departments[]}` |
| POST | `/departments` | Create department | institution_admin+ | `{institution_id, name, type, ...}` | `{department}` |
| PUT | `/departments/:id` | Update department | institution_admin+ | `{name, head_user_id, budget}` | `{department}` |

### ACADEMIC

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/academic/programs` | List programs | Authenticated | `?institution_id=&level=&department_id=` | `{programs[]}` |
| POST | `/academic/programs` | Create program | institution_admin+ | `{institution_id, name, level, ...}` | `{program}` |
| GET | `/academic/courses` | List courses | Authenticated | `?program_id=&semester=&search=` | `{courses[]}` |
| POST | `/academic/courses` | Create course | department_director+ | `{program_id, name, code, credits, ...}` | `{course}` |
| GET | `/academic/enrollments` | List enrollments | Scoped | `?institution_id=&program_id=&year=&status=` | `{enrollments[], total}` |
| POST | `/academic/enrollments` | Enroll student | institution_admin+ | `{student_profile_id, program_id, academic_year_id}` | `{enrollment}` |
| PUT | `/academic/enrollments/:id` | Update enrollment | institution_admin+ | `{status, current_semester}` | `{enrollment}` |
| GET | `/academic/attendance` | Get attendance records | Scoped | `?course_id=&semester_id=&date_from=&date_to=` | `{records[], stats}` |
| POST | `/academic/attendance/batch` | Batch record attendance | teacher+ | `{records: [{course_enrollment_id, date, status}]}` | `{count}` |
| GET | `/academic/exams` | List exams | Scoped | `?course_id=&semester_id=&type=` | `{exams[]}` |
| POST | `/academic/exams` | Schedule exam | department_director+ | `{course_id, semester_id, type, date, ...}` | `{exam}` |
| GET | `/academic/results` | Get exam results | Scoped | `?exam_id=&enrollment_id=&course_id=` | `{results[], stats}` |
| POST | `/academic/results/batch` | Batch submit grades | teacher+ | `{results: [{exam_id, course_enrollment_id, score}]}` | `{count}` |
| GET | `/academic/transcripts/:student_id` | Student transcript | Scoped | - | `{student, enrollments[], gpa, rank}` |

### FINANCE

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/finance/budgets` | List budgets | finance_access+ | `?institution_id=&year=&department_id=&status=` | `{budgets[], summary}` |
| POST | `/finance/budgets` | Create budget | institution_admin+ | `{institution_id, department_id, year, total, ...}` | `{budget}` |
| GET | `/finance/expenses` | List expenses | finance_access+ | `?budget_id=&category=&date_from=&date_to=` | `{expenses[], total}` |
| POST | `/finance/expenses` | Submit expense | department_staff+ | `{budget_id, amount, category, description, receipt}` | `{expense}` |
| PUT | `/finance/expenses/:id/approve` | Approve expense | institution_admin+ | `{status: 'approved'}` | `{expense}` |
| GET | `/finance/procurement` | List procurement offers | Authenticated | `?institution_id=&status=&category=` | `{offers[]}` |
| POST | `/finance/procurement` | Create offer call | institution_admin+ | `{title, category, budget, deadline, ...}` | `{offer}` |
| PUT | `/finance/procurement/:id` | Update offer status | institution_admin+ | `{status, awarded_to, awarded_amount}` | `{offer}` |
| GET | `/finance/reports/:institution_id` | Financial report | finance_access+ | `?year=&format=pdf` | `{report_data}` or PDF binary |

### HR

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/hr/staff` | List staff | hr_access+ | `?institution_id=&department_id=&type=&status=` | `{staff[], total}` |
| GET | `/hr/staff/:id` | Staff detail | hr_access+ | - | `{staff, leaves[], trainings[]}` |
| POST | `/hr/staff` | Add staff member | hr_manager+ | `{profile_id, employee_type, grade, salary_grade, ...}` | `{staff}` |
| GET | `/hr/leaves` | List leave requests | hr_access+ | `?status=&staff_id=&date_from=&date_to=` | `{leaves[]}` |
| POST | `/hr/leaves` | Submit leave request | staff+ | `{type, start_date, end_date, reason}` | `{leave}` |
| PUT | `/hr/leaves/:id/approve` | Approve/reject leave | department_director+ | `{status: 'approved'|'rejected'}` | `{leave}` |
| GET | `/hr/trainings` | List training programs | hr_access+ | `?institution_id=&type=&upcoming=true` | `{trainings[]}` |
| POST | `/hr/trainings/:id/enroll` | Enroll in training | staff+ | `{staff_profile_id}` | `{enrollment}` |
| GET | `/hr/stats/:institution_id` | HR Statistics | hr_access+ | `?period=2025` | `{headcount, absenteeism_rate, turnover, training_completion}` |

### RESEARCH

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/research/projects` | List research projects | Authenticated | `?institution_id=&status=&category=&lead_id=` | `{projects[]}` |
| POST | `/research/projects` | Create project | research_director+ | `{title, institution_id, funding, team, ...}` | `{project}` |
| GET | `/research/publications` | List publications | Authenticated | `?institution_id=&type=&year=&author_id=&indexed=` | `{publications[], total}` |
| POST | `/research/publications` | Add publication | teacher+ | `{title, type, journal, doi, authors, ...}` | `{publication}` |
| GET | `/research/stats/:institution_id` | Research KPIs | Authenticated | `?year=2025` | `{publications_count, projects_active, funding_total, patents}` |

### ESG / SUSTAINABILITY

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/esg/metrics` | Get ESG metrics | Authenticated | `?institution_id=&category=&date_from=&date_to=` | `{metrics[], trends}` |
| POST | `/esg/metrics` | Submit ESG data | esg_staff+ | `{institution_id, category, metric_name, value, unit, date}` | `{metric}` |
| POST | `/esg/metrics/batch` | Batch upload ESG data | esg_staff+ | `{metrics: [...]}` | `{count}` |
| GET | `/esg/greenmetric/:institution_id` | GreenMetric data | Authenticated | `?year=2025` | `{greenmetric_data, scoring_summary}` |
| POST | `/esg/greenmetric/:institution_id` | Submit GreenMetric | esg_staff+ | `{year, ...all_greenmetric_fields}` | `{data}` |
| GET | `/esg/report/:institution_id` | ESG/Sustainability report | Authenticated | `?year=2025&format=pdf` | PDF binary |
| GET | `/esg/rankings` | GreenMetric comparison | Authenticated | `?year=2025` | `{rankings[]}` across institutions |

### ENQUIRIES

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/enquiries/templates` | List enquiry templates | Authenticated | `?category=&institution_id=` | `{templates[]}` |
| POST | `/enquiries/templates` | Create template | hq_staff+ | `{title, fields_schema, category, ...}` | `{template}` |
| GET | `/enquiries` | List enquiries | Authenticated | `?status=&sender_id=&target_id=&priority=` | `{enquiries[]}` |
| POST | `/enquiries` | Send enquiry | hq_staff+ | `{template_id, target_institution_ids, title, due_date}` | `{enquiry}` |
| GET | `/enquiries/:id/responses` | View responses | Scoped | - | `{responses[]}` |
| POST | `/enquiries/:id/respond` | Submit response | institution_staff+ | `{response_data, attachments}` | `{response}` |
| POST | `/enquiries/:id/ai-fill` | AI auto-fill from upload | institution_staff+ | `{files: [file_ids]}` | `{prefilled_response, confidence_scores}` |
| PUT | `/enquiries/:id/close` | Close enquiry | hq_staff+ | - | `{enquiry}` |

### KPI & ANALYTICS

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/kpis/definitions` | List KPI definitions | Authenticated | `?category=&is_visible=true` | `{kpis[]}` |
| GET | `/kpis/values` | Get KPI values | Scoped | `?institution_id=&kpi_slug=&period_type=&period_value=` | `{values[], trends}` |
| GET | `/kpis/dashboard` | Dashboard data (consolidated) | Authenticated | `?institution_id=&period=2025` | `{academic, finance, hr, esg, research, infrastructure}` |
| GET | `/kpis/compare` | Compare institutions | institution_admin+ | `?kpi_slug=&institution_ids=[]&period=2025` | `{comparison[]}` (bar/radar chart data) |
| GET | `/kpis/predictions` | AI predictions | institution_admin+ | `?kpi_slug=&institution_id=&periods_ahead=4` | `{historical[], predictions[], confidence[]}` |
| GET | `/alerts` | List alerts | Authenticated | `?institution_id=&severity=&is_resolved=` | `{alerts[]}` |
| PUT | `/alerts/:id/read` | Mark alert as read | Authenticated | - | `{alert}` |
| PUT | `/alerts/:id/resolve` | Resolve alert | institution_admin+ | - | `{alert}` |

### REPORTS & EXPORTS

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| POST | `/reports/generate` | Generate custom report | institution_admin+ | `{type, institution_id, period, kpis[], format}` | `{report_id, status}` |
| GET | `/reports/:id/download` | Download report | Authenticated | `?format=pdf` | PDF/Excel binary |
| GET | `/reports/scheduled` | List scheduled reports | institution_admin+ | - | `{scheduled[]}` |
| POST | `/reports/schedule` | Schedule periodic report | institution_admin+ | `{type, institution_id, frequency, recipients, kpis[]}` | `{schedule}` |
| POST | `/export/data` | Export any table to Excel/PDF | Authenticated | `{resource, filters, format, columns[]}` | Binary file |

### AI SERVICES

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| POST | `/ai/chat` | Natural language query | Authenticated | `{query: "Show me dropout rate for ENSTAB in 2024"}` | `{answer, data, sql_generated, chart_data}` |
| POST | `/ai/extract` | Extract data from uploaded file | Authenticated | `{file_id, extraction_type}` | `{extracted_data, confidence, review_needed}` |
| POST | `/ai/predict` | Predict KPI trend | institution_admin+ | `{kpi_slug, institution_id, periods_ahead}` | `{predictions[], confidence, explanation}` |
| POST | `/ai/anomalies` | Detect anomalies | institution_admin+ | `{institution_id, kpi_slugs[], time_range}` | `{anomalies[], severity, suggestions[]}` |
| POST | `/ai/report-generation` | AI-generated narrative report | institution_admin+ | `{institution_id, period, sections[]}` | `{report_text, charts[]}` |
| POST | `/ai/optimize` | Resource optimization suggestions | institution_admin+ | `{resource_type, institution_id}` | `{suggestions[], cost_impact}` |

### LIBRARY

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| GET | `/library/resources` | Search library catalog | Authenticated | `?institution_id=&type=&search=&category=` | `{resources[]}` |
| POST | `/library/resources` | Add resource | librarian+ | `{title, type, isbn, authors, copies, ...}` | `{resource}` |
| POST | `/library/borrow` | Borrow resource | student/staff | `{resource_id, borrower_profile_id}` | `{borrowing}` |
| PUT | `/library/return/:id` | Return resource | librarian+ | - | `{borrowing}` |
| GET | `/library/my-borrowings` | My borrowed items | Authenticated | - | `{borrowings[]}` |

### FILES & STORAGE

| Method | Endpoint | Description | Permission | Request Body | Response |
|--------|----------|-------------|------------|-------------|----------|
| POST | `/files/upload` | Upload file(s) | Authenticated | `multipart/form-data` | `{files: [{id, url, name, size, mime_type}]}` |
| GET | `/files/:id` | Get file metadata | Authenticated | - | `{file}` |
| GET | `/files/:id/download` | Download file | Authenticated | - | Binary stream |
| DELETE | `/files/:id` | Delete file | Owner or admin | - | `{success}` |

---

# 7. MONOREPO STRUCTURE & SETUP

## 7.1 Directory Structure

```
ENSTAB/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, typecheck, test per package
│       └── deploy.yml                # Deploy per service
├── apps/
│   ├── web/                          # Next.js 15 Frontend (App Router)
│   │   ├── app/
│   │   │   ├── (auth)/               # Login, Register, Forgot Password
│   │   │   ├── (dashboard)/          # All authenticated routes
│   │   │   │   ├── hq/              # HQ Super Admin Dashboard
│   │   │   │   ├── institution/     # Institution Admin Dashboard
│   │   │   │   ├── department/      # Department Director Dashboard
│   │   │   │   ├── teacher/         # Teacher Dashboard
│   │   │   │   ├── student/         # Student Dashboard
│   │   │   │   └── settings/        # User Settings
│   │   │   ├── api/                  # Next.js API Routes (BFF)
│   │   │   │   ├── v1/
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── institutions/
│   │   │   │   │   ├── academic/
│   │   │   │   │   ├── finance/
│   │   │   │   │   ├── hr/
│   │   │   │   │   ├── research/
│   │   │   │   │   ├── esg/
│   │   │   │   │   ├── enquiries/
│   │   │   │   │   ├── kpis/
│   │   │   │   │   ├── ai/
│   │   │   │   │   ├── reports/
│   │   │   │   │   └── files/
│   │   │   │   └── webhooks/         # Supabase webhooks
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/                   # shadcn/ui components
│   │   │   ├── dashboard/           # Dashboard widgets (KPIs, charts)
│   │   │   ├── forms/               # Reusable form components
│   │   │   ├── tables/              # Data tables with filters
│   │   │   ├── charts/              # Recharts wrappers
│   │   │   ├── ai/                  # AI chat interface components
│   │   │   └── layout/              # Sidebar, Header, Navigation
│   │   ├── lib/
│   │   │   ├── supabase/            # Supabase client (server + client)
│   │   │   ├── auth/                # Auth utilities, middleware
│   │   │   ├── permissions/         # RBAC helpers, hooks
│   │   │   ├── api/                 # API client functions
│   │   │   └── utils/               # Shared utilities
│   │   ├── hooks/                    # React hooks
│   │   ├── store/                    # Zustand state management
│   │   ├── types/                    # Shared TypeScript types
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── etl/                         # ETL Service (Python/FastAPI)
│       ├── app/
│       │   ├── extractors/          # PDF, Excel, Image, Email extractors
│       │   ├── transformers/        # Data cleaning, normalization
│       │   ├── loaders/             # Supabase loaders
│       │   ├── ai/                  # AI models for extraction
│       │   └── api/                 # FastAPI endpoints
│       ├── notebooks/               # Jupyter notebooks for analysis
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/
│   ├── shared-types/                 # Shared TypeScript types/interfaces
│   │   ├── src/
│   │   │   ├── database.ts          # Generated Supabase types
│   │   │   ├── api.ts               # API request/response types
│   │   │   ├── enums.ts             # Shared enums
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── ui/                           # Shared UI components
│   │   ├── src/
│   │   │   ├── kpi-card.tsx         # Standardized KPI display card
│   │   │   ├── data-table.tsx       # Reusable sortable/filterable table
│   │   │   ├── status-badge.tsx
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── supabase-client/              # Shared Supabase utilities
│   │   ├── src/
│   │   │   ├── server.ts            # Server-side client
│   │   │   ├── client.ts            # Client-side client
│   │   │   ├── admin.ts             # Service role client
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── auth/                         # Shared auth logic
│   │   ├── src/
│   │   │   ├── middleware.ts        # Auth middleware
│   │   │   ├── rbac.ts              # RBAC engine
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   └── config/                       # Shared configuration
│       ├── src/
│       │   ├── constants.ts
│       │   ├── kpi-definitions.ts   # All KPI definitions
│       │   ├── role-defaults.ts     # Default role permissions
│       │   └── index.ts
│       └── package.json
│
├── supabase/
│   ├── migrations/                   # Database migrations (SQL)
│   │   ├── 000001_core_tables.sql
│   │   ├── 000002_academic_tables.sql
│   │   ├── 000003_hr_tables.sql
│   │   ├── 000004_finance_tables.sql
│   │   ├── 000005_research_tables.sql
│   │   ├── 000006_esg_tables.sql
│   │   ├── 000007_enquiry_tables.sql
│   │   ├── 000008_kpi_tables.sql
│   │   ├── 000009_rls_policies.sql
│   │   ├── 000010_seed_data.sql
│   │   └── 000011_materialized_views.sql
│   ├── seed.sql                      # Development seed data
│   ├── config.toml                   # Supabase CLI config
│   └── edge-functions/
│       ├── ai-chat/                  # AI Chat endpoint
│       ├── ai-extract/              # AI data extraction
│       ├── report-generation/        # Periodic report generation
│       ├── alert-monitor/            # KPI threshold monitoring
│       ├── data-sync/                # ETL trigger
│       └── export/                   # PDF/Excel generation
│
├── turbo.json                        # Turborepo configuration
├── pnpm-workspace.yaml               # pnpm workspace definition
├── package.json                      # Root package.json
├── tsconfig.base.json                # Base TypeScript config
├── .env.example                      # Environment variables template
├── .gitignore
├── .prettierrc
├── .eslintrc.js
└── PLAN-HACK4UCAR.md                 # This document
```

## 7.2 Monorepo Configuration Files

### `pnpm-workspace.yaml`
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### `turbo.json`
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

---

# 8. FRONTEND DASHBOARD DESIGN & FEATURES

## 8.1 Dashboard Layouts by Role

### HQ Super Admin Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  UCAR-ERP  │ 🔔 3 Alerts │ 👤 Admin  │ 🌐 FR/EN/AR        │
├─────────────────────────────────────────────────────────────┤
│ SIDEBAR:                                          MAIN AREA │
│                                                              │
│ 📊 Overview                                          ┌──────┐│
│ 📚 Institutions    CONSOLIDATED KPIs                 │Total ││
│ 👥 Users & Roles    ┌────┬────┬────┬────┬────┐       │Insti ││
│ 📝 Enquiries       │ 🎓 │ 💼 │ 💰 │ 🌱 │ 👥 │       │tutio││
│ 🔔 Alerts          │ 85%│ 72%│ 67%│ 58%│ 90%│       │ns:35││
│ 📈 KPI Dashboard   └────┴────┴────┴────┴────┘       └──────┘│
│ 📊 Reports          Acad Empl Fin  ESG  HR                    │
│ 🔧 Settings         ┌──────────────────────────┐              │
│                     │  Trend Chart (all inst.) │              │
│ AI ASSISTANT        │  ┌──────────────────────┐│              │
│ ┌─────────────────┐ │  │  ████░░░░░░░░░░░░░░  ││              │
│ │ Ask anything... │ │  │  ██████░░░░░░░░░░░░░ ││              │
│ │                 │ │  └──────────────────────┘│              │
│ └─────────────────┘ └──────────────────────────┘              │
│                                                              │
│ ANOMALY ALERTS:                                              │
│ 🚨 FST: Dropout rate +12% vs last year (View)                │
│ ⚠️ ISG: Budget execution only 45% at Q3 (Investigate)        │
│ ℹ️ 3 institutions haven't submitted ESG data (Remind)        │
│                                                              │
│ INSTITUTION COMPARISON (Radar Chart):                        │
│ [ENSTAB] [FST] [ISG] [Add +]                                │
│ Academic ──── 85 ────                                        │
│ Research ──── 62 ────                                        │
│ ESG     ──── 58 ────                                        │
└─────────────────────────────────────────────────────────────┘
```

### Institution Admin Dashboard
- Institution-specific KPIs
- Department comparison
- Enquiry inbox (from HQ)
- Staff management
- Budget overview
- Research tracking

### Department Director Dashboard
- Department KPIs
- Course/program management
- Staff attendance & leave
- Budget vs actual spending
- Student performance overview

### Teacher Dashboard
- My courses & schedules
- Student grade entry
- Attendance recording
- Research publications tracking
- Leave requests

### Student Dashboard
- My courses & schedule
- Grades & GPA
- Attendance record
- Library borrowing
- Scholarship status
- Campus events

## 8.2 Reusable Components

| Component | Description | Used By |
|-----------|-------------|---------|
| `KpiCard` | Single KPI with value, trend arrow, target indicator | All dashboards |
| `KpiGrid` | Responsive grid of KpiCards | All dashboards |
| `DataTable` | Sortable, filterable, paginated table with export | All views |
| `TrendChart` | Time-series line/area chart with prediction overlay | All dashboards |
| `ComparisonChart` | Bar or radar chart comparing institutions/departments | HQ, Institution |
| `AlertPanel` | Real-time alert feed with severity badges | All dashboards |
| `EnquiryCard` | Enquiry with progress bar (responses received/total) | HQ, Institution |
| `FileDropzone` | Drag-and-drop file upload with AI extraction preview | Enquiry responses |
| `AIChatPanel` | Floating chatbot for natural language queries | All dashboards |
| `ReportBuilder` | Drag-and-drop report customizer | Institution, Department |
| `RolePermissionMatrix` | Checkbox grid for managing permissions | HQ Admin |
| `AuditTrailViewer` | Filterable audit log viewer | HQ Admin |

---

# 9. AI INTEGRATION STRATEGY

## 9.1 AI Features (Core to Hackathon Solution)

### Feature 1: AI Data Extraction & Enquiry Auto-Fill
- **Input**: Uploaded PDFs, Excel, images
- **AI**: OCR (Tesseract) + NLP (OpenAI GPT-4o / Claude) for field extraction
- **Output**: Pre-filled enquiry response with confidence scores
- **Impact**: Reduces enquiry response time from days to minutes

### Feature 2: Natural Language KPI Query (AI Chat)
- **Input**: "Show me dropout rate for ENSTAB compared to FST in 2024"
- **AI**: Text-to-SQL + response formatting
- **Output**: Chart + explanation + raw data
- **Impact**: Non-technical staff can query complex data

### Feature 3: Predictive Analytics
- **Input**: Historical KPI data (all institutions)
- **AI**: Time-series forecasting (Prophet / LSTM)
- **Output**: Trend predictions with confidence intervals
- **Impact**: Proactive decision-making (budget, staffing, enrollment)

### Feature 4: Anomaly Detection
- **Input**: Real-time KPI streams
- **AI**: Statistical outlier detection + ML models
- **Output**: Alerts with severity and suggested actions
- **Impact**: Early warning system for critical issues

### Feature 5: Automated Report Generation
- **Input**: KPI data + report template
- **AI**: LLM for narrative generation from data
- **Output**: Auto-generated PDF/Word reports with analysis
- **Impact**: Eliminates manual report writing

### Feature 6: Intelligent Offer Call Processing
- **Input**: Procurement documents
- **AI**: Extract requirements, suggest evaluation criteria
- **Output**: Structured offer call with auto-fill
- **Impact**: Faster procurement cycles

## 9.2 AI Architecture

```
┌─────────────────────────────────────────────┐
│              AI SERVICE (Edge Function)      │
│                                              │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐ │
│  │ Text2SQL  │  │ RAG       │  │ Predict  │ │
│  │ Pipeline  │  │ Pipeline  │  │ Pipeline │ │
│  └─────┬─────┘  └─────┬─────┘  └────┬─────┘ │
│        │              │              │       │
│  ┌─────▼──────────────▼──────────────▼─────┐ │
│  │         LLM Gateway (OpenAI/Claude)     │ │
│  └─────────────────┬──────────────────────┘ │
│                    │                        │
│  ┌─────────────────▼──────────────────────┐ │
│  │   Vector Store (pgvector in Supabase)  │ │
│  │   - University documents indexed       │ │
│  │   - KPI definitions & historical data  │ │
│  │   - Policy documents (ISO, GreenMetric)│ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

---

# 10. TEAM PRIORITIZATION & SPRINT PLAN

## 10.1 Team Roles (Suggested)

| Role | Responsibilities | Count |
|------|-----------------|-------|
| **Frontend Lead (You)** | Next.js app, UI components, dashboards, all views | 1 |
| **Auth & RBAC Developer** | Supabase Auth, JWT, RLS, role_permissions, middleware | 1 |
| **Backend/Database Developer** | Schema migrations, API routes, Supabase services | 1-2 |
| **AI/ML Developer** | AI extraction, NLP chat, predictions, anomaly detection | 1-2 |
| **ETL Developer** | Python pipeline, OCR, data migration, cleaning | 1 |
| **Full-Stack (support)** | Cross-cutting features, integrations, testing | 1 |

## 10.2 Sprint Plan (3-4 Days Hackathon)

### DAY 1: Foundation (CRITICAL PATH)

| Time | Task | Assigned To | Dependency |
|------|------|-------------|------------|
| **Morning** | Monorepo setup (Turborepo, pnpm, packages) | Frontend Lead | None |
| | Supabase project creation + schema migration files | DB Developer | None |
| | Auth setup: Supabase Auth, JWT hook, roles table, seed default roles | Auth Dev | None |
| **Afternoon** | Core tables migration (institutions, departments, profiles, roles, permissions) | DB Developer | Monorepo |
| | Auth middleware + RBAC engine (package) | Auth Dev | Roles table |
| | Login/Register UI + basic layout (sidebar, header) | Frontend Lead | Auth setup |
| | ETL: Set up Python project, file upload API, OCR pipeline | ETL Dev | Supabase setup |
| **Evening** | RLS policies on core tables | DB Developer | Core tables |
| | Institution CRUD UI | Frontend Lead | API routes |
| | AI service structure (Edge Functions skeleton) | AI Dev | Supabase setup |
| **DELIVERABLE**: Working auth, 2 dashboards (HQ + Institution admin), DB schema deployed |

### DAY 2: Core Features

| Time | Task | Assigned To | Dependency |
|------|------|-------------|------------|
| **Morning** | Academic tables + API routes (programs, courses, enrollments) | DB + Backend | Day 1 |
| | Academic dashboard UI (programs, courses, student list) | Frontend Lead | Academic API |
| | ETL: Excel parser + PDF OCR implementation | ETL Dev | Day 1 |
| | AI: Text-to-SQL pipeline + basic chat endpoint | AI Dev | Schema ready |
| **Afternoon** | Finance tables + API routes (budgets, expenses, procurement) | DB + Backend | Day 1 |
| | Finance dashboard UI | Frontend Lead | Finance API |
| | Enquiry system: tables + create/send/respond APIs | DB + Backend | Day 1 |
| | Enquiry UI: template builder, send, respond | Frontend Lead | Enquiry API |
| **Evening** | AI: Data extraction from files (enquiry auto-fill) | AI Dev | ETL + Enquiry |
| | Role-based UI rendering (hide/show elements based on permissions) | Frontend Lead | RBAC engine |
| | KPI definitions + materialized views | DB Developer | Core tables |
| **DELIVERABLE**: Academic, Finance, Enquiry modules working with AI auto-fill demo |

### DAY 3: Intelligence & Advanced Features

| Time | Task | Assigned To | Dependency |
|------|------|-------------|------------|
| **Morning** | KPI dashboard UI (cards, charts, comparisons) | Frontend Lead | KPI definitions |
| | AI: Predictive analytics endpoint | AI Dev | Historical KPI data |
| | ETL: Batch upload, validation UI, review queue | ETL Dev | Day 2 |
| | HR tables + API routes | DB + Backend | Day 1 |
| **Afternoon** | HR dashboard UI | Frontend Lead | HR API |
| | ESG/GreenMetric tables + API + UI | Full-Stack | Day 1 |
| | AI: Anomaly detection + alert generation | AI Dev | KPI data |
| | Automated report generation (PDF/Excel) | Backend | KPI + reports |
| **Evening** | Research + Partnerships modules | Full-Stack | Day 1 |
| | Library module | Full-Stack | Day 1 |
| | Polish all dashboards, ensure responsiveness | Frontend Lead | All modules |
| | AI Chat integration into all dashboards | AI + Frontend | AI endpoint |
| **DELIVERABLE**: Full KPI dashboard, AI predictions, ESG, HR modules working |

### DAY 4: Polish & Pitch

| Time | Task | Assigned To | Dependency |
|------|------|-------------|------------|
| **Morning** | Integration testing all flows end-to-end | All | All modules |
| | Bug fixes | All | Testing |
| | Performance optimization (materialized views, caching) | Backend | All modules |
| **Afternoon** | Prepare demo data (seed 3 institutions with realistic data) | All | All modules |
| | Record demo video / prepare live demo | Frontend Lead | All features |
| | Prepare pitch deck (5-7 minutes) | All | All |
| | Deploy to Vercel + Supabase production | Frontend + DB | All features |
| **Evening** | Final review, practice pitch, submit | All | All |
| **DELIVERABLE**: Working prototype with live demo, pitch deck, deployed |

## 10.3 MVP Priorities (What Makes the Demo)

For the hackathon demo, prioritize these 5 features (they showcase ALL 4 tracks):

1. **AI-Powered Enquiry Auto-Fill** (Tracks 1+3): Upload Excel → AI extracts → enquiry answered
   - *Demo flow*: HQ sends enquiry → Institution uploads data → AI fills it → staff reviews & submits → HQ sees consolidated responses
   
2. **Consolidated KPI Dashboard** (Tracks 2+4): Real-time KPIs across 2-3 demo institutions
   - *Demo flow*: HQ sees dropout rate, budget execution, ESG scores → click to compare → AI predicts next quarter

3. **AI Chat for Natural Language Queries** (Track 3): "What's the success rate at ENSTAB vs national average?"
   - *Demo flow*: Type question → AI generates SQL → shows chart + explanation

4. **GreenMetric / ESG Tracker** (All tracks): Energy, carbon, recycling dashboards with predictions
   - *Demo flow*: Show carbon footprint trend → AI predicts 2026 → shows how UCAR can improve rank

5. **Role-Based Access Demo**: Log in as different roles → see different dashboards → admin changes permissions → instantly reflected

---

# NEXT STEPS

1. **Approve this plan** — Let me know if any section needs changes
2. **I'll scaffold the monorepo** — Push the full directory structure with configs to the ENSTAB repo
3. **I'll write all Supabase migrations** — Complete SQL for every table
4. **I'll set up the frontend shell** — Next.js with all route groups, layouts, shadcn/ui
5. **Team can start building in parallel** — Each person takes a domain from the sprint plan

**Questions for you before I proceed:**
- Is the Next.js + Supabase + Turborepo stack acceptable?
- Should I start implementing immediately after plan approval, or do you want to review/annotate first?
- Do you have a specific AI provider preference (OpenAI, Claude, Google Gemini)?
