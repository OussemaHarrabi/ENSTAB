# UCAR Intelligence Platform — API Contract

## Base Configuration
- **Base URL**: `https://api.ucar-erp.tn/api/v1`
- **Auth**: Bearer JWT in `Authorization` header
- **Format**: All requests/responses in JSON
- **Pagination**: `?page=1&limit=20`, returns `{ data[], total, page, limit, totalPages }`
- **Sorting**: `?sort_by=field&sort_order=asc|desc`
- **Filtering**: `?field=value&field=value`
- **Error Format**: `{ error: { code: string, message: string, details?: any } }`
- **Dates**: ISO 8601 (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`)
- **Currency**: TND (Tunisian Dinar), stored as integer centimes

## RBAC Notes
All endpoints are scoped by the JWT's `app_metadata`:
- `role`: `hq_super_admin` | `hq_dept_head` | `hq_staff` | `inst_admin` | `inst_dept_head` | `inst_staff` | `teacher` | `student`
- `institution_id`: `UUID` or `'ALL'` (for UCAR Bureau roles)
- `department_id`: `UUID` (for department-scoped roles)
- `domain`: `academic` | `hr` | `finance` | `research` | `infrastructure` | `employment` | `partnerships` | `esg`

---

## 1. AUTHENTICATION

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "president@ucar.tn",
  "password": "string"
}
```

**Response (200):**
```json
{
  "access_token": "jwt...",
  "refresh_token": "jwt...",
  "user": {
    "id": "uuid",
    "email": "string",
    "firstName": "string",
    "lastName": "string",
    "role": "hq_super_admin",
    "roleLabel": "Super Admin UCAR",
    "institutionId": "uuid",
    "institutionName": "string",
    "departmentId": "uuid|null",
    "departmentName": "string|null",
    "domain": "academic|null",
    "avatar": "url|null"
  }
}
```

### GET /auth/me
Get current authenticated user from JWT.

**Response (200):** Same `user` object as login.

### POST /auth/logout
Invalidate the current session.

**Response (200):** `{ "success": true }`

### POST /auth/refresh
Refresh an expired access token.

**Request:** `{ "refresh_token": "jwt..." }`
**Response (200):** `{ "access_token": "jwt..." }`

---

## 2. INSTITUTIONS

### GET /institutions
Get all institutions (scoped by role).

**Query:** `?search=text&page=1&limit=35`
**Roles:** All authenticated users. Response filtered by `institution_id` in JWT.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Faculte des Sciences de Tunis",
      "code": "FST",
      "type": "faculte|ecole|institut",
      "city": "Tunis",
      "establishedYear": 1960,
      "totalStudents": 4500,
      "totalStaff": 320,
      "logo": "url|null",
      "accreditationStatus": ["ISO 9001", "CTI"],
      "isActive": true
    }
  ],
  "total": 35,
  "page": 1,
  "limit": 35,
  "totalPages": 1
}
```

### GET /institutions/:id
Get single institution with summary KPIs.

**Roles:** All authenticated users scoped to their institution.

**Response (200):**
```json
{
  "institution": { "...same as list item..." },
  "stats": {
    "totalStudents": 4500,
    "totalStaff": 320,
    "avgDomainScore": 78.5
  }
}
```

### GET /institutions/:id/kpis
Get all KPI values for an institution.

**Query:** `?category=academic&period=2025-2026`
**Roles:** All authenticated users scoped to their institution.

**Response (200):**
```json
{
  "data": [
    {
      "institutionId": "uuid",
      "kpiSlug": "success_rate",
      "kpiName": "Taux de Reussite",
      "category": "academic",
      "value": 87.3,
      "target": 90,
      "unit": "%",
      "trend": "up",
      "trendValue": 3.2,
      "period": "2025-2026"
    }
  ]
}
```

### GET /institutions/:id/domain-kpis
Get aggregated domain scores (8 domains) for performance grid.

**Roles:** All authenticated users scoped to their institution.

**Response (200):**
```json
{
  "data": [
    {
      "domain": "academic",
      "domainLabel": "Academique",
      "score": 85,
      "target": 90,
      "status": "ok",
      "kpis": [
        {
          "name": "Taux de Reussite",
          "value": 87.3,
          "target": 90,
          "unit": "%"
        }
      ]
    }
  ]
}
```

### GET /institutions/:id/greenmetric
Get GreenMetric data for an institution.

**Query:** `?year=2025`
**Roles:** All authenticated users.

**Response (200):**
```json
{
  "institutionId": "uuid",
  "year": 2025,
  "totalScore": 6200,
  "maxScore": 10000,
  "criteria": {
    "settingInfrastructure": { "score": 750, "max": 1500 },
    "energyClimate": { "score": 1680, "max": 2100 },
    "waste": { "score": 1080, "max": 1800 },
    "water": { "score": 700, "max": 1000 },
    "transportation": { "score": 600, "max": 1000 },
    "education": { "score": 1200, "max": 1500 },
    "governance": { "score": 400, "max": 500 }
  }
}
```

### GET /institutions/:id/rankings
Get international rankings for an institution.

**Query:** `?year=2025`
**Response (200):**
```json
{
  "data": [
    {
      "rankingSystem": "THE World University Rankings",
      "rank": "1201-1500",
      "year": 2025,
      "score": 35
    }
  ]
}
```

### GET /institutions/:id/enrollment-trend
Get enrollment time series.

**Query:** `?from=2020&to=2025`
**Response (200):**
```json
{
  "data": [
    { "date": "2020", "value": 3800 },
    { "date": "2021", "value": 3950 }
  ]
}
```

---

## 3. ANALYTICS & BENCHMARKS

### GET /analytics/aggregate
UCAR-wide consolidated KPIs for HQ dashboard.

**Roles:** `hq_super_admin` only (or scoped to institution for `inst_admin`).
**Query:** `?institutionId=uuid` (optional, omit for UCAR-wide)

**Response (200):**
```json
{
  "totalStudents": 86800,
  "successRate": 76.3,
  "budgetExecution": 71.5,
  "totalPublications": 6470,
  "greenMetricScore": 6200,
  "theRanking": "1201-1500",
  "qsRanking": "1401-1600",
  "employabilityRate": 58.4
}
```

### GET /analytics/enrollment-trend
UCAR-wide enrollment evolution.

**Query:** `?from=2020&to=2025`
**Roles:** `hq_super_admin`, `hq_dept_head`, `inst_admin`

**Response (200):**
```json
{
  "data": [
    { "date": "2020", "value": 78000 },
    { "date": "2021", "value": 79500 }
  ]
}
```

### GET /analytics/timeseries
Generic time series for any metric.

**Query:** `?metric=success_rate|budget|dropout|enrollment|publications|green_score&points=12&institutionId=uuid`
**Roles:** Scoped by role. `hq_super_admin` gets any institution.

**Response (200):**
```json
{
  "metric": "success_rate",
  "data": [
    { "date": "2024-09", "value": 82.1 },
    { "date": "2024-10", "value": 83.5 }
  ]
}
```

### GET /analytics/forecast
AI forecast for a metric.

**Query:** `?metric=success_rate&horizon=6&institutionId=uuid`
**Roles:** `hq_super_admin`, `inst_admin`

**Response (200):**
```json
{
  "metric": "success_rate",
  "historical": [
    { "date": "2024-09", "value": 82.1 }
  ],
  "forecast": [
    { "date": "2025-10", "value": 84.5 }
  ],
  "confidenceLower": [
    { "date": "2025-10", "value": 78.2 }
  ],
  "confidenceUpper": [
    { "date": "2025-10", "value": 90.8 }
  ],
  "summary": "La tendance prevoit une augmentation moderee sur les 6 prochains mois."
}
```

### GET /analytics/forecasts-summary
Summary of all forecast metrics for dashboard cards.

**Query:** `?institutionId=uuid`
**Roles:** `hq_super_admin`, `inst_admin`

**Response (200):**
```json
{
  "data": [
    { "label": "Inscriptions 2026", "value": "2950", "trend": "+5.2%", "status": "ok" },
    { "label": "Budget 2026", "value": "12.5M TND", "trend": "+8%", "status": "ok" }
  ]
}
```

### GET /benchmarks/national-averages
UCAR-wide vs national comparison.

**Response (200):**
```json
{
  "data": [
    {
      "slug": "success_rate",
      "name": "Taux de Reussite",
      "ucar": 76.3,
      "national": 72.1,
      "target": 85
    }
  ]
}
```

### GET /benchmarks/compare
Compare institutions on a specific KPI.

**Query:** `?kpi=success_rate&institutions=inst-01,inst-02,inst-03`
**Response (200):**
```json
{
  "data": [
    { "institutionId": "inst-01", "code": "FST", "value": 87.3, "target": 90 },
    { "institutionId": "inst-02", "code": "ISG", "value": 79.1, "target": 85 }
  ]
}
```

### GET /benchmarks/grade-distribution
National grade distribution for teacher self-correction feature.

**Query:** `?courseId=uuid`
**Roles:** `teacher` scoped to their courses.

**Response (200):**
```json
{
  "national": {
    "mean": 13.5,
    "stdDev": 2.8,
    "distribution": [
      { "range": "0-5", "count": 120, "percentage": 2.4 },
      { "range": "5-10", "count": 850, "percentage": 17.0 }
    ]
  }
}
```

---

## 4. ANOMALIES

### GET /anomalies
Get anomaly alerts with optional filters.

**Query:** `?institutionId=uuid&domain=academic&severity=critical&status=pending&page=1&limit=20`
**Roles:** Scoped by role. `hq_super_admin` sees all. Others see their institution/domain.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "institutionId": "uuid",
      "institutionName": "FST",
      "domain": "academic",
      "severity": "critical",
      "title": "Hausse anormale du taux d'abandon",
      "description": "Le taux d'abandon a augmente de +2.3 sigma ce semestre.",
      "shapFactors": [
        { "name": "Resultats aux examens", "contribution": 62 },
        { "name": "Taux d'assiduite", "contribution": 28 }
      ],
      "timestamp": "2025-04-25T10:30:00Z",
      "status": "pending"
    }
  ],
  "summary": {
    "pending": 5,
    "acknowledged": 2,
    "investigating": 1,
    "falsePositive": 1
  }
}
```

### PUT /anomalies/:id/status
Update anomaly status. Only `hq_super_admin` can use this.

**Request:**
```json
{
  "status": "acknowledged",
  "notes": "Investigation en cours avec le departement concerne"
}
```

**Response (200):** `{ "id": "uuid", "status": "acknowledged", "updatedAt": "2025-04-26T12:00:00Z" }`

---

## 5. RESEARCH

### GET /research-affiliation
Get research affiliation statistics for UCAR vs UTM comparison.

**Roles:** `hq_super_admin`, `hq_dept_head` (research domain), `inst_admin`

**Response (200):**
```json
{
  "total": 440,
  "affiliated": 342,
  "unaffiliated": 98,
  "affiliationRate": 77.7,
  "targetRate": 100,
  "riskInstitutions": [
    {
      "id": "inst-03",
      "name": "FST",
      "unaffiliated": 45,
      "phdStudentsAtRisk": 23
    }
  ]
}
```

### GET /research-affiliation/phd-non-affiliated
List PhD students whose publications are not UCAR-affiliated.

**Query:** `?institutionId=uuid&page=1&limit=50`
**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ahmed Ben Salem",
      "phdStartDate": "2022-09-01",
      "supervisor": "Pr. Mohamed Ali",
      "institution": "FST",
      "publicationsWithoutAffiliation": 3
    }
  ]
}
```

### GET /publications
Get publication list.

**Query:** `?institutionId=uuid&isUcarAffiliated=true&researcherId=uuid&sdg=13&year=2024&page=1&limit=20`
**Roles:** Scoped to institution.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Deep Learning for Tunisian Dialect Processing",
      "doi": "10.1000/xyz123",
      "journal": "IEEE Access",
      "year": 2025,
      "authors": ["Pr. Mehdi Ben Ali", "Dr. Samir Toumi"],
      "institutionId": "inst-02",
      "isUcarAffiliated": true,
      "citations": 12,
      "fwci": 1.45,
      "sdgMapped": ["SDG 9", "SDG 4"]
    }
  ]
}
```

### POST /publications/lookup
Auto-fill publication from DOI.

**Request:** `{ "doi": "10.1000/xyz123" }`
**Roles:** `teacher`, `inst_dept_head`
**Response (200):** Full publication object (auto-filled title, journal, year, citations).

### GET /research-projects
Active research projects.

**Query:** `?institutionId=uuid&status=active&page=1&limit=10`
**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Plateforme IA pour la Gestion des Dechets",
      "institutionId": "inst-02",
      "leadResearcher": "Pr. Mohamed Ben Ali",
      "fundingAmount": 450000,
      "fundingSource": "PRF",
      "status": "En cours",
      "startDate": "2024-01-01",
      "endDate": "2026-12-31"
    }
  ]
}
```

---

## 6. ESG / GREENMETRIC

### GET /greenmetric/aggregate
UCAR-wide GreenMetric aggregate.

**Query:** `?year=2025`
**Response (200):** Same shape as `GET /institutions/:id/greenmetric` but aggregated across all institutions.

### GET /greenmetric/trend
GreenMetric score history.

**Query:** `?from=2020&to=2025&institutionId=uuid`
**Response (200):**
```json
{
  "data": [
    { "year": 2020, "score": 4800 },
    { "year": 2021, "score": 5200 }
  ]
}
```

### GET /esg/details
Detailed ESG sub-metrics.

**Query:** `?institutionId=uuid&year=2025`
**Response (200):**
```json
{
  "energy": {
    "totalConsumptionKwh": 2400000,
    "renewablePercentage": 18,
    "co2EmissionsTonnes": 840,
    "energyPerPerson": 1200
  },
  "waste": {
    "totalTonnes": 180,
    "recyclingRate": 35,
    "hazardousTonnes": 12
  },
  "water": {
    "totalM3": 45000,
    "recycledPercentage": 12,
    "rainwaterHarvestingPercentage": 5
  },
  "mobility": {
    "publicTransportPercentage": 42,
    "evChargingStations": 8,
    "bikeLanesKm": 12
  }
}
```

---

## 7. ISO COMPLIANCE

### GET /iso-compliance
ISO certification progress.

**Response (200):**
```json
{
  "data": [
    {
      "name": "ISO 21001:2018",
      "progress": 78,
      "items": [
        {
          "label": "Politique qualite documentee",
          "status": "done",
          "dueDate": null
        },
        {
          "label": "Objectifs qualite mesurables",
          "status": "pending",
          "dueDate": "2025-05-15"
        }
      ]
    }
  ]
}
```

---

## 8. DOMAIN-SPECIFIC

### GET /domain/:domain/summary
Cross-institution performance ranking for a single domain.

**Params:** `domain` = `academic|hr|finance|research|infrastructure|employment|partnerships|esg`
**Roles:** `hq_super_admin`, `hq_dept_head`

**Response (200):**
```json
{
  "domain": "academic",
  "domainLabel": "Academique",
  "data": [
    {
      "institutionId": "inst-01",
      "code": "ENSI",
      "avgScore": 92,
      "kpiCount": 4,
      "status": "ok",
      "rank": 1
    }
  ]
}
```

### GET /domain/:domain/compliance
Compliance status per institution for a domain.

**Response (200):**
```json
{
  "data": [
    {
      "institutionId": "inst-01",
      "code": "ENSI",
      "isCompliant": true,
      "certifications": ["ISO 9001"]
    }
  ]
}
```

---

## 9. DOCUMENT INGESTION

### POST /documents/ingest
Upload document for AI extraction (multipart/form-data).

**Roles:** `inst_dept_head`
**Request:** `FormData { file: binary, institutionId: string, domain: string }`
**Response (202):**
```json
{
  "documentId": "uuid",
  "status": "processing",
  "estimatedTimeSeconds": 30
}
```

### GET /documents/:id/status
Check ingestion progress.

**Response (200):**
```json
{
  "documentId": "uuid",
  "status": "parsing|parsed|chunking|chunked|vectorizing|completed|failed",
  "progress": 65,
  "currentStep": "Page 3/12: table extraite, 47 lignes trouvees",
  "extractedRecords": 47,
  "errors": []
}
```

### GET /ingestion/status
Get overall ingestion queue status.

**Response (200):**
```json
{
  "processedToday": 12,
  "pending": 3,
  "failed": 1,
  "averageProcessingTimeSeconds": 45
}
```

---

## 10. DOCUMENTS & REPORTS

### GET /documents
Policy documents and templates.

**Query:** `?domain=academic&type=policy&page=1&limit=20`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Circulaire N2025-012",
      "type": "PDF",
      "category": "policy",
      "date": "2025-04-20",
      "department": "Tous",
      "downloadUrl": "url"
    }
  ]
}
```

### GET /reports
Generated reports list.

**Query:** `?institutionId=uuid&period=monthly&domain=academic`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Rapport Executif Mensuel",
      "type": "PDF",
      "period": "Mensuel",
      "generatedAt": "2025-04-01",
      "size": "2.4MB",
      "downloadUrl": "url",
      "status": "Disponible"
    }
  ]
}
```

### GET /reports/drafts
Draft reports (HQ Staff).

**Query:** `?domain=academic`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Brouillon rapport academique",
      "lastEdited": "2025-04-25",
      "status": "draft"
    }
  ]
}
```

---

## 11. DATA QUALITY & COMMITS

### GET /data-quality
Data quality scores per institution/domain.

**Query:** `?institutionId=uuid&department=uuid&domain=academic`

**Response (200):**
```json
{
  "data": [
    {
      "institutionId": "inst-01",
      "code": "ENSI",
      "domain": "academic",
      "overall": 87,
      "completeness": 92,
      "consistency": 85,
      "timeliness": 78,
      "validity": 90
    }
  ]
}
```

### GET /data-commits
Data commit batches pending approval.

**Query:** `?status=pending&institutionId=uuid`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "batch": "BATCH-2025-04-25",
      "department": "Academique",
      "items": 47,
      "date": "2025-04-25",
      "submittedBy": "Chef Academique",
      "status": "En attente"
    }
  ]
}
```

### POST /data-commits/:id/approve
Approve a data commit (Dean role).

**Request:** `{}` (empty body)
**Response (200):** `{ "id": "uuid", "status": "Approuve", "approvedAt": "..." }`

### POST /data-commits/:id/reject
Reject a data commit.

**Request:** `{ "reason": "Donnees incompletes" }`
**Response (200):** `{ "id": "uuid", "status": "Rejete" }`

---

## 12. TEACHER

### GET /teacher/:id/profile
Teacher profile info.

**Roles:** `teacher` (own profile) or `inst_admin`, `inst_dept_head` (their institution's teachers)

**Response (200):**
```json
{
  "id": "uuid",
  "firstName": "Mehdi",
  "lastName": "Ben Ali",
  "email": "mehdi.benali@ensi.tn",
  "department": "Informatique",
  "institutionId": "inst-01",
  "grade": "Professeur",
  "hIndex": 7,
  "publications": 18,
  "grants": 2,
  "citations": 342
}
```

### GET /teacher/:id/dashboard
Teacher aggregate KPIs.

**Response (200):**
```json
{
  "totalCourses": 4,
  "totalStudents": 185,
  "successRate": 83,
  "hoursCompleted": 42,
  "hoursPlanned": 48,
  "overtime": 4
}
```

### GET /teacher/:id/courses
Teacher's assigned courses with progress.

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Algorithmique Avancee",
      "code": "INF-401",
      "students": 48,
      "sessionsTotal": 24,
      "sessionsCompleted": 20,
      "progress": 85,
      "avgGrade": 14.2
    }
  ]
}
```

### GET /teacher/:id/analytics
Course performance metrics with at-risk students.

**Query:** `?courseId=uuid`
**Response (200):**
```json
{
  "overallAvg": 13.9,
  "passRate": 84,
  "atRiskCount": 12,
  "attendanceRate": 82,
  "coursePerformance": [
    { "name": "INF-401", "avgGrade": 14.2, "passRate": 88 },
    { "name": "INF-302", "avgGrade": 12.8, "passRate": 75 }
  ]
}
```

### GET /teacher/:id/hours
Weekly teaching hours log.

**Response (200):**
```json
{
  "totalCompleted": 42,
  "totalPlanned": 48,
  "overtime": 4,
  "weeks": [
    { "week": 1, "month": "Avril 2025", "completed": 8.5, "planned": 8 }
  ]
}
```

### GET /teacher/:id/syllabus
Course syllabus progress.

**Query:** `?courseId=uuid`
**Response (200):**
```json
{
  "data": [
    {
      "name": "Chapitre 1: Introduction",
      "progress": 100,
      "status": "Termine",
      "order": 1
    }
  ]
}
```

### PUT /teacher/:id/syllabus
Update syllabus progress.

**Request:**
```json
{
  "courseId": "uuid",
  "topics": [
    { "name": "Chapitre 1", "progress": 100, "status": "Termine" }
  ]
}
```

### GET /courses/:courseId/students
Student roster for grades/attendance.

**Query:** `?page=1&limit=50`
**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Ali Ben Salem",
      "studentId": "ET-001",
      "enrollmentId": "uuid",
      "grades": { "ds": 14, "tp": 16, "exam": 12 },
      "finalGrade": 13.5,
      "attendanceRate": 92
    }
  ]
}
```

### GET /courses/:courseId/attendance
Attendance list for a specific session.

**Query:** `?sessionDate=2025-04-26`
**Response (200):**
```json
{
  "sessionDate": "2025-04-26",
  "courseId": "uuid",
  "students": [
    { "enrollmentId": "uuid", "name": "Ali Ben Salem", "status": "present" }
  ],
  "presentCount": 39,
  "totalCount": 48,
  "attendanceRate": 81.3
}
```

### PUT /courses/:courseId/attendance
Update attendance.

**Request:**
```json
{
  "sessionDate": "2025-04-26",
  "students": [
    { "enrollmentId": "uuid", "status": "present" }
  ]
}
```

### PUT /courses/:courseId/grades
Bulk save grades.

**Request:**
```json
{
  "students": [
    { "enrollmentId": "uuid", "ds": 14, "tp": 16, "exam": 12 }
  ]
}
```
**Response (200):**
```json
{
  "saved": 48,
  "warnings": [
    "La distribution des notes s'ecarte de la moyenne nationale de 15%"
  ]
}
```

---

## 13. STUDENT

### GET /students/:id/profile
Student profile.

**Response (200):**
```json
{
  "id": "uuid",
  "firstName": "Ali",
  "lastName": "Ben Salem",
  "studentId": "ET-001",
  "program": { "id": "uuid", "name": "INF-401", "level": "ingenieur" },
  "institutionId": "inst-01",
  "institutionName": "ENSI",
  "currentSemester": 6,
  "totalSemesters": 6
}
```

### GET /students/:id/dashboard
Student aggregate KPIs.

**Response (200):**
```json
{
  "currentSemesterAvg": 14.2,
  "cumulativeGpa": 14.8,
  "attendanceRate": 85,
  "progress": 78,
  "carbonFootprintTonnes": 2.4,
  "carbonAvgTonnes": 3.1,
  "validatedCredits": 19,
  "totalCredits": 19
}
```

### GET /students/:id/grades
Per-course grades.

**Query:** `?semester=6`
**Response (200):**
```json
{
  "data": [
    {
      "courseId": "uuid",
      "courseName": "Algorithmique Avancee",
      "credits": 6,
      "ds": 14,
      "tp": 16,
      "exam": 12,
      "finalGrade": 13.5
    }
  ],
  "semesterAvg": 14.2,
  "validatedCredits": 19,
  "totalCredits": 19
}
```

### GET /students/:id/grades-trend
Semester-by-semester GPA.

**Response (200):**
```json
{
  "data": [
    { "semester": "S1", "avg": 12.5, "validatedCredits": 30 },
    { "semester": "S2", "avg": 13.2, "validatedCredits": 30 }
  ]
}
```

### GET /students/:id/attendance
Per-course attendance percentages.

**Response (200):**
```json
{
  "overall": 85,
  "courses": [
    {
      "courseId": "uuid",
      "courseName": "Algorithmique Avancee",
      "present": 22,
      "total": 24,
      "percentage": 92
    }
  ]
}
```

### GET /students/:id/schedule
Weekly timetable.

**Query:** `?semester=6`
**Response (200):**
```json
{
  "data": [
    { "day": "Lundi", "sessions": [
      { "startTime": "08:00", "endTime": "10:00", "course": "Algorithmique Avancee", "room": "Salle 204" }
    ]}
  ]
}
```

### GET /students/:id/events
Upcoming events.

**Query:** `?upcoming=true&limit=5`
**Response (200):**
```json
{
  "data": [
    { "id": "uuid", "title": "Examen Algorithmique", "date": "2025-04-28", "type": "Examen" }
  ]
}
```

### GET /students/:id/carbon-footprint
Carbon footprint breakdown.

**Response (200):**
```json
{
  "totalTonnes": 2.4,
  "averageTonnes": 3.1,
  "breakdown": {
    "transport": { "tonnes": 1.2, "percentage": 50 },
    "waste": { "tonnes": 0.6, "percentage": 25 },
    "water": { "tonnes": 0.3, "percentage": 12.5 },
    "electricity": { "tonnes": 0.3, "percentage": 12.5 }
  },
  "challenges": [
    { "id": "uuid", "name": "Utiliser les transports en commun", "progress": 80, "points": 150 }
  ]
}
```

### GET /students/:id/mobility-application
Erasmus+ application progress.

**Response (200):**
```json
{
  "status": "En cours",
  "progress": 66,
  "checklist": [
    { "label": "Dossier academique", "status": "done" },
    { "label": "Test de langue", "status": "done" },
    { "label": "Lettre de motivation", "status": "pending" }
  ]
}
```

---

## 14. CAREER & EMPLOYMENT

### GET /career/listings
Job and internship listings.

**Query:** `?type=stage|cdi&institutionId=uuid&page=1&limit=10`
**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Stage Data Scientist",
      "company": "Vermeg",
      "location": "Tunis",
      "type": "stage",
      "postedDate": "2025-04-20",
      "description": "...",
      "applyUrl": "url"
    }
  ]
}
```

### GET /career/alumni-stats
Alumni statistics.

**Response (200):**
```json
{
  "totalAlumni": 12000,
  "averageSalaryTnd": 1800,
  "employedRate3Months": 62,
  "employedRate6Months": 78,
  "topSectors": [
    { "sector": "Technologies", "percentage": 35 },
    { "sector": "Finance", "percentage": 22 }
  ]
}
```

---

## 15. MOBILITY & PARTNERSHIPS

### GET /mobility/programs
Available mobility programs.

**Query:** `?institutionId=uuid`
**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "program": "Erasmus+ France",
      "university": "Universite Paris-Saclay",
      "country": "France",
      "availablePlaces": 5,
      "deadline": "2025-05-30",
      "requirements": ["Dossier academique", "Test de langue", "Lettre de motivation"]
    }
  ]
}
```

---

## 16. SUSTAINABILITY

### GET /sustainability/challenges
Active sustainability challenges (gamification).

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Utiliser les transports en commun",
      "description": "...",
      "progress": 80,
      "points": 150,
      "category": "mobility"
    }
  ]
}
```

### POST /sustainability/progress
Update challenge progress.

**Request:** `{ "challengeId": "uuid", "progress": 85 }`

---

## 17. FEEDBACK & SURVEYS

### GET /courses/:studentId/ratings
Courses available for student rating.

**Response (200):**
```json
{
  "data": [
    { "courseId": "uuid", "courseName": "Algorithmique Avancee", "rated": false }
  ]
}
```

### POST /feedback
Submit student feedback.

**Request:**
```json
{
  "type": "equipment|accessibility|suggestion|course-rating",
  "courseId": "uuid|null",
  "rating": 4,
  "description": "Projecteur defaillant Salle 204"
}
```

### POST /surveys/employability
Submit post-graduation employment survey.

**Request:**
```json
{
  "situation": "employed|searching|internship|studying",
  "timeToFirstJob": "less_than_3_months|3_6_months|6_12_months|over_1_year",
  "monthlySalary": "less_than_1000|1000_1500|1500_2000|2000_3000|3000_plus",
  "sector": "technology|finance|industry|education|health"
}
```

---

## 18. ROOMS & INCIDENTS

### GET /rooms
Room availability.

**Query:** `?institutionId=uuid&status=available&capacity_min=20&type=classroom|lab|study`
**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "number": "Salle 204",
      "building": "Batiment A",
      "capacity": 48,
      "equipment": ["Projecteur", "Tableau"],
      "type": "classroom",
      "isAccessible": true,
      "status": "Disponible"
    }
  ]
}
```

### POST /rooms/reserve
Reserve a room.

**Request:**
```json
{
  "roomId": "uuid",
  "date": "2025-04-28",
  "startTime": "08:00",
  "endTime": "10:00",
  "purpose": "Examen Algorithmique"
}
```

### GET /incidents
Incident reports.

**Query:** `?reporterId=uuid (teacher) or reporterType=teacher&status=open&institutionId=uuid`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "type": "equipment",
      "description": "Projecteur defectueux Salle 204",
      "equipmentId": "uuid|null",
      "roomId": "uuid",
      "reportedBy": { "id": "uuid", "name": "Pr. Mehdi Ben Ali" },
      "status": "En cours",
      "createdAt": "2025-04-25T10:00:00Z"
    }
  ]
}
```

### POST /incidents
Report new incident.

**Request:**
```json
{
  "type": "equipment|safety|accessibility|other",
  "description": "string",
  "roomId": "uuid",
  "equipmentId": "uuid|null",
  "photoUrl": "url|null"
}
```

---

## 19. TASKS & MEETINGS

### GET /tasks
Assigned tasks for staff.

**Query:** `?assigneeId=uuid (or from JWT)&status=pending`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Verifier les factures du mois",
      "assignedBy": "Chef de departement",
      "priority": "haute|moyenne|basse",
      "dueDate": "2025-04-30",
      "status": "pending"
    }
  ]
}
```

### GET /meetings
Scheduled meetings.

**Query:** `?domain=academic&institutionId=uuid&upcoming=true`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Reunion des chefs de departement",
      "date": "2025-05-05",
      "attendees": 12,
      "location": "Salle de conference",
      "agenda": "string"
    }
  ]
}
```

---

## 20. USERS & SETTINGS

### GET /users
User list (admin-only).

**Query:** `?role=teacher&institutionId=uuid&search=text&page=1&limit=20`
**Roles:** `hq_super_admin`, `inst_admin`

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "firstName": "Mehdi",
      "lastName": "Ben Ali",
      "email": "mehdi.benali@ensi.tn",
      "role": "teacher",
      "roleLabel": "Enseignant",
      "institutionId": "uuid",
      "institutionName": "ENSI",
      "departmentName": "Informatique",
      "isActive": true
    }
  ]
}
```

### GET /users/:id/settings
User settings.

**Response (200):**
```json
{
  "language": "fr",
  "notificationsEnabled": true,
  "theme": "light",
  "emailDigest": "weekly"
}
```

### PUT /users/:id/profile
Update profile.

**Request:** `{ "firstName": "string", "lastName": "string", "email": "string", "phone": "string" }`

### PUT /users/:id/notifications
Update notification preferences.

**Request:** `{ "enabled": true, "channels": ["email", "push"] }`

---

## 21. BLUEPRINT SYNC

### GET /blueprint/status
Blueprint sync status (for institution admins).

**Roles:** `inst_admin`

**Response (200):**
```json
{
  "currentVersion": "2.3",
  "latestVersion": "2.4",
  "updateAvailable": true,
  "lastSyncAt": "2025-04-15T10:30:00Z",
  "changesDescription": "Nouveau KPI: taux demission, schema modifie pour table rh"
}
```

### POST /blueprint/sync
Accept and sync blueprint update.

**Roles:** `inst_admin`
**Response (200):** `{ "version": "2.4", "syncedAt": "2025-04-26T12:00:00Z" }`

---

## 22. CHAT (AI)

### POST /chat/query
Natural language query over institutional data.

**Request:**
```json
{
  "message": "Quelles sont les 5 institutions avec le pire taux d execution budgetaire ?",
  "context": {
    "institutionId": "uuid|null",
    "domain": "academic|null",
    "role": "hq_super_admin"
  },
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response (200):**
```json
{
  "response": "Voici les resultats:\n1. ISG: 45%\n2. FST: 52%...",
  "data": [
    { "code": "ISG", "value": 45 },
    { "code": "FST", "value": 52 }
  ],
  "chartType": "bar",
  "chartData": [
    { "name": "ISG", "value": 45 }
  ],
  "exportable": true,
  "confidence": 0.95
}
```

---

## 23. DOMAINS (CONFIG)

### GET /domains
Domain metadata (for dynamic sidebar and labels).

**Response (200):**
```json
{
  "data": [
    {
      "slug": "academic",
      "label": "Academique",
      "icon": "BookOpen",
      "description": "Performance academique et pedagogique",
      "categories": ["enrollment", "exams", "pedagogy"]
    }
  ]
}
```

---

## 24. COMMON TYPES

### Pagination
```json
{
  "data": [],
  "total": 100,
  "page": 1,
  "limit": 20,
  "totalPages": 5
}
```

### Error Response
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Institution with id X not found",
    "details": { "institutionId": "X" }
  }
}
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async processing, e.g., ingestion) |
| 400 | Bad request (validation error) |
| 401 | Unauthenticated |
| 403 | Unauthorized (RBAC denied) |
| 404 | Not found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable (semantic error) |
| 429 | Rate limited |
| 500 | Server error |

---

## 25. WEBSOCKET EVENTS (NATS)

For real-time updates:

| Subject | Payload | Consumer |
|---------|---------|----------|
| `ucar.ingestion.progress` | `{ documentId, progress, step }` | Frontend upload UI |
| `ucar.ingestion.complete` | `{ documentId, extractedRecords }` | Frontend upload UI |
| `ucar.alert.created` | `AnomalyAlert` | Header notifications |
| `ucar.alert.status_updated` | `{ alertId, status }` | Anomaly dashboard |
| `ucar.blueprint.update_available` | `{ version, changes }` | Institution admin banner |
