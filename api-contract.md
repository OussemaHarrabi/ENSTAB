# UCAR Intelligence Platform — API Contract v2.0
# Matches frontend: 14 roles, 141 routes, 12 service platforms

---

## BASE CONFIGURATION
- **Base URL:** `http://localhost:8000/api/v1` (dev) / `https://api.ucar.tn/api/v1` (prod)
- **Auth:** `Authorization: Bearer <jwt>`
- **Content-Type:** `application/json`
- **Dates:** ISO 8601 `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm:ssZ`
- **Pagination:** `?page=1&limit=20` → `{ data[], pagination: { page, limit, total, totalPages } }`
- **Errors:** `{ error: { code: string, message: string } }`
- **Currency:** Tunisian Dinar (DT), stored as decimal

## 14 ROLES (new)
```
president, svc_secretaire, svc_rh, svc_enseignement, svc_bibliotheque,
svc_finances, svc_equipement, svc_informatique, svc_budget, svc_juridique,
svc_academique, svc_recherche, teacher, student
```
**Hierarchy:** Level 0 (president) > 1 (svc_secretaire) > 2 (services) > 3 (teacher) > 4 (student)
**President** sees all. Service heads see their domain. Teachers/Students see own data only.

---

# 1. AUTHENTICATION

### POST /auth/login
Login with email/password. Returns JWT or 2FA challenge.

**Request:**
```json
{ "email": "president@ucar.tn", "password": "ucar2024" }
```
**Response 200:**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "expires_in": 1800,
  "user": {
    "id": "u-001", "email": "president@ucar.tn",
    "firstName": "Nadia", "lastName": "Mzoughi Aguir",
    "role": "president", "roleLabel": "Présidence",
    "serviceId": "presidence", "serviceName": "Présidence",
    "level": 0, "accentColor": "#1E3A5F",
    "canAccessInstitutions": ["all"], "isActive": true,
    "title": "Pr.", "avatar": null
  }
}
```
**Response 200 (2FA required):**
```json
{ "requires_2fa": true, "temp_token": "eyJ...", "message": "Code 2FA requis" }
```

### POST /auth/verify-2fa
Submit TOTP code to complete login.

**Request:** `{ "temp_token": "eyJ...", "code": "123456" }`
**Response 200:** Same as login success.

### GET /auth/me
Get current user from JWT. **Response:** Same `user` object.

### POST /auth/logout
Invalidate session. **Response:** `{ "success": true }`

### POST /auth/refresh
Refresh expired token. **Request:** `{ "refresh_token": "eyJ..." }` **Response:** `{ "access_token": "eyJ..." }`

---

# 2. USER MANAGEMENT & ROLE ASSIGNMENT

### GET /users
List users (scoped by role level). President sees all. Service heads see their service only.

**Query:** `?search=&role=svc_rh&service=svc_rh&status=active&page=1&limit=20`
**Roles:** president, svc_secretaire, all level-2 services
**Response:**
```json
{
  "data": [{
    "id": "u-012", "email": "oussema.khimissi@ucar.tn",
    "firstName": "Oussema", "lastName": "Khimissi",
    "role": "svc_rh", "roleLabel": "Administrateur RH",
    "serviceId": "svc_rh", "serviceName": "Service RH",
    "level": 2, "assignedBy": "u-010",
    "canAccessInstitutions": ["ensi"],
    "isActive": true, "phone": null, "title": null
  }],
  "pagination": { "page": 1, "limit": 20, "total": 35, "totalPages": 2 }
}
```

### POST /users/assign
Assign a new user to a role (only higher-level users can assign).

**Request:**
```json
{
  "email": "nouvel.admin@ucar.tn", "password": "temp123",
  "firstName": "Ali", "lastName": "Ben Salem",
  "role": "svc_rh", "canAccessInstitutions": ["ensi"],
  "serviceId": "svc_rh", "serviceName": "Service RH"
}
```
**Roles:** president, svc_secretaire, level-2 services (can only assign roles below their level)
**Response 201:** Created user object.

### PUT /users/:id
Update user profile/access. **Request:** `{ "isActive": false }`
### DELETE /users/:id
Deactivate user (soft delete). **Response:** `{ "success": true }`

---

# 3. PRÉSIDENCE PLATFORM

## 3.1 Dashboard

### GET /president/dashboard
Aggregate UCAR-wide KPIs for the executive dashboard.

**Roles:** president
**Response:**
```json
{
  "kpis": [
    { "title": "Étudiants", "value": 42350, "unit": "", "target": 45000, "trend": "up", "trendValue": 3.2, "sparkline": [40000, 41000, 41500, 42000, 42150, 42300, 42350] },
    { "title": "Taux Réussite", "value": 74.5, "unit": "%", "target": 80, "trend": "up", "trendValue": 2.1 },
    { "title": "Budget Exécuté", "value": 88.2, "unit": "%", "target": 95, "trend": "up", "trendValue": 1.5 },
    { "title": "Publications", "value": 385, "unit": "", "target": 400, "trend": "up", "trendValue": 8.7 },
    { "title": "Score GreenMetric", "value": 76.5, "unit": "%", "target": 85, "trend": "up", "trendValue": 4.3 },
    { "title": "Classement THE", "value": 401, "unit": "", "target": 350, "trend": "up", "trendValue": -12.5 }
  ],
  "rankingProgress": [
    { "year": 2020, "the": 1201, "qs": 1400, "greenmetric": 350 },
    { "year": 2025, "the": 401, "qs": 551, "greenmetric": 120 }
  ],
  "greenMetricCriteria": [
    { "name": "Infrastructure", "score": 85, "max": 100 },
    { "name": "Énergie & Climat", "score": 72, "max": 100 }
  ],
  "trafficLight": [
    { "institutionId": "ensi", "institutionName": "ENSI", "domains": [
      { "domain": "academic", "score": 82, "status": "ok" },
      { "domain": "finance", "score": 45, "status": "critical" }
    ]}
  ],
  "anomalyCount": 5,
  "pendingDecisions": 3
}
```

## 3.2 GreenMetric

### GET /president/greenmetric
UCAR-wide GreenMetric overview.

**Response:**
```json
{
  "totalScore": 6875, "maxScore": 10000, "percentage": 68.75,
  "worldRank": 145, "nationalRank": 1,
  "trend": { "year": 2021, "score": 5200, "rank": 220 },
  "criteria": [
    { "name": "Infrastructure", "score": 825, "max": 1500, "percentage": 55, "trend": "+2.1%" },
    { "name": "Énergie & Climat", "score": 1125, "max": 1800, "percentage": 62.5, "trend": "+4.3%" }
  ],
  "historical": [
    { "year": 2020, "score": 4800, "target": 5000 },
    { "year": 2025, "score": 6875, "target": 7500 }
  ],
  "institutions": [
    { "name": "ENSI", "score": 78, "rank": 1, "trend": "up" },
    { "name": "ISG", "score": 58, "rank": 8, "trend": "down" }
  ],
  "recommendations": [
    { "title": "Transport", "description": "Prioriser navettes électriques pour gagner 850 points", "impact": 850 }
  ]
}
```

## 3.3 Rankings

### GET /president/rankings
International ranking progress.

**Response:**
```json
{
  "rankings": [
    {
      "system": "THE World University Rankings",
      "rank2025": 401, "rank2024": 501, "rank2023": 601,
      "score2025": 38.5, "target2026": 350, "color": "#2563EB"
    }
  ],
  "competitors": [
    { "name": "UCAR", "the": 401, "qs": 551, "greenmetric": 120 },
    { "name": "UTM", "the": 501, "qs": 651, "greenmetric": 150 }
  ],
  "kpiGaps": [
    { "kpi": "Publications par chercheur", "value": 1.8, "target": 2.5, "weight": "Très haut", "impact": "+80 places" }
  ],
  "historical": [
    { "year": 2021, "the": 1201, "qs": 1400, "greenmetric": 350 }
  ]
}
```

## 3.4 Compliance (ISO)

### GET /president/compliance
ISO certification tracking.

**Response:**
```json
{
  "standards": [
    {
      "name": "ISO 21001", "label": "Systèmes de management pour l'éducation",
      "progress": 72, "deadline": "Juin 2026", "color": "#2563EB",
      "stages": [
        { "label": "Diagnostic initial", "done": true, "date": "Jan 2025" },
        { "label": "Certification", "done": false, "date": "Juin 2026" }
      ]
    }
  ],
  "complianceTrend": [
    { "month": "Jan 2025", "items": 5, "completed": 5 }
  ],
  "upcomingAudits": [
    { "service": "Service RH", "type": "Audit RH", "date": "15 Mai 2025", "priority": "high" }
  ]
}
```

## 3.5 Research & Affiliation

### GET /president/recherche
Research dashboard data.

**Response:**
```json
{
  "kpIs": {
    "publications2025": 458, "affiliationRate": 84.1,
    "activeResearchers": 1245, "phdStudents": 380, "activeProjects": 43
  },
  "affiliationTrend": [
    { "year": "2021", "total": 320, "affiliated": 210, "unaffiliated": 110 }
  ],
  "topInstitutions": [
    { "name": "FST", "publications": 85, "affiliated": 78, "rate": 91.8, "researchers": 120 }
  ],
  "projectsByType": [
    { "name": "Projets Nationaux", "count": 18, "funding": 4.5, "color": "#2563EB" }
  ],
  "atRiskPublications": [
    { "title": "Advanced ML in Healthcare", "institution": "FST", "authors": "Amira Ben Salah", "year": 2024 }
  ],
  "researcherStats": {
    "professeurs": 245, "mcf": 380, "ma": 420, "hdr": 185
  }
}
```

## 3.6 Anomalies

### GET /president/anomalies
AI-detected anomalies with severity filter.

**Query:** `?severity=critical&status=pending&institution=ensi&page=1&limit=20`
**Response:**
```json
{
  "data": [{
    "id": "ano-001", "institutionId": "ensi", "institutionName": "ENSI",
    "domain": "academic", "severity": "critical",
    "title": "Hausse anormale du taux d'abandon",
    "description": "Le taux a augmenté de +2.3 sigma ce semestre.",
    "shapFactors": [
      { "name": "Résultats aux examens", "contribution": 62 },
      { "name": "Taux d'assiduité", "contribution": 28 }
    ],
    "timestamp": "2025-04-25T10:30:00Z",
    "status": "pending"
  }],
  "summary": { "pending": 5, "acknowledged": 2, "investigating": 1, "falsePositive": 1 },
  "pagination": { "page": 1, "limit": 20, "total": 8, "totalPages": 1 }
}
```

### PUT /president/anomalies/:id/status
Update anomaly status. **Request:** `{ "status": "acknowledged", "notes": "En cours d'investigation" }`
**Response:** Updated anomaly object.

## 3.7 Appels d'Offres

### GET /president/appels-offres
AI predictions + active procurement.

**Response:**
```json
{
  "predictions": [
    { "id": "AO-001", "title": "Fourniture équipements informatiques", "service": "Service Informatique",
      "budget": 450000, "probability": 92, "deadline": "Juin 2025", "status": "high" }
  ],
  "active": [
    { "id": "AO-101", "title": "Acquisition mobilier", "service": "Budget",
      "budget": 300000, "status": "open", "deadline": "15 Mai 2025", "responses": 4 }
  ],
  "stats": { "predictions": 5, "active": 3, "totalBudget": "2.85M", "savings": "12%" }
}
```

## 3.8 Institutions

### GET /president/institutions
List all institutions.

**Query:** `?search=&type=&page=1&limit=35`
**Response:**
```json
{
  "data": [
    { "id": "ensi", "name": "École Nationale des Sciences de l'Informatique", "code": "ENSI",
      "type": "ecole", "city": "La Manouba", "establishedYear": 1984,
      "totalStudents": 1450, "totalStaff": 180,
      "accreditationStatus": ["CTI", "ISO 9001"], "isActive": true }
  ],
  "pagination": { "page": 1, "limit": 35, "total": 35, "totalPages": 1 }
}
```

### GET /president/institutions/:id
Full institution detail drill-down.

**Response:**
```json
{
  "institution": { "...same as list item..." },
  "kpIs": [
    { "kpiName": "Taux de Réussite", "value": 82, "target": 85, "unit": "%", "trend": "up", "trendValue": 2.1 }
  ],
  "domains": [
    { "domain": "academic", "domainLabel": "Académique", "score": 82, "target": 90, "status": "ok",
      "kpis": [{ "name": "Taux de Réussite", "value": 82, "target": 85, "unit": "%" }] }
  ],
  "categoryAverages": [
    { "category": "academic", "avgValue": 82, "avgTarget": 88 }
  ],
  "greenMetric": { "year": 2025, "totalScore": 6200, "maxScore": 10000, "criteria": {...} },
  "rankings": [{ "rankingSystem": "THE", "rank": "1201-1500", "year": 2025, "score": 35 }],
  "anomalies": [{ "id": "ano-001", "severity": "warning", "title": "..." }]
}
```

## 3.9 Comparisons

### GET /president/comparaisons
Compare institutions on selectable KPIs.

**Query:** `?kpi=success_rate&institutions=ensi,enit,fst`
**Response:**
```json
{
  "kpi": "success_rate", "kpiLabel": "Taux de Réussite", "unit": "%",
  "data": [
    { "institutionId": "ensi", "name": "ENSI", "code": "ENSI", "value": 82, "average": 68, "difference": 14 }
  ],
  "summary": "ENSI est en tête avec 82%, soit +14% de plus que la moyenne."
}
```

## 3.10 Services Overview

### GET /president/services
All UCAR services at a glance.

**Response:**
```json
{
  "data": [
    { "slug": "svc_rh", "label": "Service RH", "memberCount": 16, "director": "Mohamed Khedimallah",
      "accentColor": "#0D9488", "routePrefix": "/rh" }
  ]
}
```

## 3.11 Reports

### GET /president/reports
Report templates and scheduled reports.

**Response:**
```json
{
  "templates": [
    { "name": "Rapport de Performance Global", "type": "PDF", "lastGenerated": "24 Avr 2025", "color": "#1E3A5F" }
  ],
  "scheduled": [
    { "name": "Rapport Mensuel", "frequency": "Mensuel", "nextRun": "01 Mai 2025", "format": "PDF" }
  ]
}
```

---

# 4. SERVICE PLATFORMS (11 services)

Each service returns domain-specific data structured the same way.

## 4.1 Service RH (`/svc/rh`)

### GET /svc/rh/dashboard
HR KPI overview. **Response:**
```json
{
  "service": { "slug": "svc_rh", "label": "Service RH", "accentColor": "#0D9488" },
  "kpIs": [
    { "label": "Effectif Total", "value": 520, "unit": "", "target": 550 },
    { "label": "Turnover", "value": 4.2, "unit": "%", "target": 5 }
  ],
  "trendChart": [
    { "date": "Jan", "value": 510 }, { "date": "Fév", "value": 515 }
  ],
  "distributionChart": [
    { "label": "Administratif", "value": 320 }, { "label": "Technique", "value": 200 }
  ]
}
```

### GET /svc/rh/personnel
Staff list. **Query:** `?search=&institution=&page=1&limit=20`
**Response:**
```json
{
  "data": [
    { "id": 1, "name": "Oussema Khimissi", "role": "Administrateur", "institution": "ENSI", "status": "Actif", "email": "o.khimissi@ensi.tn" }
  ],
  "stats": { "total": 520, "turnover": "4.2%", "seniority": "8.5 ans", "absenteeism": "3.1%" },
  "pagination": { "page": 1, "limit": 20, "total": 520, "totalPages": 26 }
}
```

### GET /svc/rh/recrutement
Recruitment pipeline. **Response:**
```json
{
  "stats": { "openPositions": 8, "candidates": 95, "inEvaluation": 12, "accepted": 8 },
  "pipeline": [
    { "stage": "Candidatures", "count": 95 },
    { "stage": "Pré-sélection", "count": 62 },
    { "stage": "Entretiens", "count": 38 },
    { "stage": "Offres", "count": 12 },
    { "stage": "Acceptées", "count": 8 }
  ],
  "positions": [
    { "title": "Administrateur RH", "dept": "RH", "candidates": 12, "status": "Ouvert", "deadline": "15 Mai 2025" }
  ]
}
```

### GET /svc/rh/conges
Leave tracking. **Response:**
```json
{
  "stats": { "thisMonth": 45, "pending": 12, "approved": 28, "rejected": 5 },
  "pending": [
    { "name": "Ahmed Ben Ali", "type": "Congé Annuel", "days": 12, "period": "01-15 Mai 2025", "status": "En attente" }
  ],
  "monthlyData": [
    { "month": "Jan", "pris": 85, "planifies": 95 }
  ]
}
```

### PUT /svc/rh/conges/:id
Approve/reject leave. **Request:** `{ "status": "approved" }`

### GET /svc/rh/formation
Training programs. **Response:**
```json
{
  "stats": { "activePrograms": 6, "participants": 400, "hours": 2450, "budget": 355000 },
  "programs": [
    { "name": "Management Public", "participants": 45, "budget": 60000, "status": "En cours", "sessions": 3 }
  ],
  "categories": [
    { "name": "Informatique", "count": 25, "color": "#2563EB" }
  ]
}
```

### GET /svc/rh/evaluations
Performance reviews. **Response:**
```json
{
  "stats": { "planned": 285, "completed": 177, "inProgress": 68, "pending": 40 },
  "evaluations": [
    { "name": "Oussema Khimissi", "rating": 4.2, "status": "Complété", "date": "15 Mar 2025" }
  ],
  "monthlyProgress": [
    { "month": "Jan", "completees": 25, "en_attente": 12 }
  ]
}
```

### GET /svc/rh/rapports
HR report templates. **Response:** `{ "data": [{ "name": "...", "type": "PDF", "date": "..." }] }`

### POST /svc/rh/chat
AI chat scoped to HR. **Request:** `{ "message": "..." }` — same format as `/chat/query` below.

---

## 4.2 Service Enseignement (`/svc/enseignement`)

### GET /svc/enseignement/dashboard
Teaching staff KPIs. **Response:**
```json
{
  "service": { "slug": "svc_enseignement", "label": "Service Personnel Enseignant", "accentColor": "#7C3AED" },
  "kpIs": [
    { "label": "Enseignants", "value": 845, "unit": "", "target": 850 },
    { "label": "Ratio Étudiant/Ens.", "value": 18.5, "unit": "", "target": 20 }
  ],
  "trendChart": [{ "date": "Sep", "value": 830 }, { "date": "Oct", "value": 840 }]
}
```

### GET /svc/enseignement/enseignants
Teacher directory. **Query:** `?search=&rank=&institution=&page=1`
**Response:**
```json
{
  "data": [
    { "name": "Pr. Mohamed Salah", "rank": "Professeur", "institution": "ENSI", "status": "Actif",
      "publications": 45, "hIndex": 12 }
  ],
  "stats": { "professeurs": 185, "mcf": 320, "ma": 340, "hdr": 145 },
  "pagination": {}
}
```

### GET /svc/enseignement/promotions
Promotion tracking. **Response:**
```json
{
  "stats": { "candidates": 12, "complete": 8, "inProgress": 5, "positionsAvailable": 15 },
  "pipeline": [
    { "stage": "Dossiers", "count": 12 },
    { "stage": "Comité Scientifique", "count": 8 },
    { "stage": "Validation", "count": 5 },
    { "stage": "Approbation", "count": 3 }
  ],
  "candidates": [
    { "name": "Dr. Mohamed Ali", "grade": "MA → MCF", "institution": "ENSI", "status": "Dossier", "date": "01 Mai 2025" }
  ]
}
```

### GET /svc/enseignement/charges
Teaching loads. **Response:**
```json
{
  "stats": { "teachers": 190, "totalHours": 13505, "avgWeekly": "70h", "departments": 6 },
  "byDepartment": [
    { "department": "Informatique", "teachers": 45, "hours": 3240, "avgHours": 72, "ratio": 18.5 }
  ]
}
```

### GET /svc/enseignement/heures
Hours tracking. **Response:**
```json
{
  "stats": { "completed": 22400, "rate": 95.2, "overtime": 340, "activeTeachers": 190 },
  "monthly": [
    { "month": "Sep", "prevues": 2800, "effectuees": 2650 }
  ]
}
```

### GET /svc/enseignement/recherche
Teacher research output. **Response:**
```json
{
  "stats": { "publications": 900, "supervisionRate": 15.2, "avgHIndex": 7.8, "hdrResearchers": 145 },
  "byRank": [
    { "rank": "Professeurs", "count": 185, "publications": 285 }
  ],
  "topResearchers": [
    { "name": "Pr. Mohamed Salah", "publications": 45, "hIndex": 12, "citations": 1280 }
  ]
}
```

### GET /svc/enseignement/rapports
Report templates. Same pattern as other report endpoints.

---

## 4.3 Service Finances (`/svc/finances`)

### GET /svc/finances/dashboard
Finance KPIs. **Response:**
```json
{
  "service": { "slug": "svc_finances", "label": "Affaires Financières", "accentColor": "#059669" },
  "kpIs": [
    { "label": "Revenus", "value": 28.5, "unit": "MDT", "target": 30 },
    { "label": "Taux Exécution", "value": 88.2, "unit": "%", "target": 95 }
  ],
  "trendChart": [{ "month": "Jan", "value": 85 }],
  "distributionChart": [{ "category": "Budget", "value": 42 }]
}
```

### GET /svc/finances/tresorerie
Cash flow. **Response:**
```json
{
  "totalSolde": 7.85, "unit": "MDT",
  "accounts": [
    { "name": "Compte Courant", "bank": "BH Bank", "solde": 2.45, "devise": "MDT", "lastOp": "24 Avr 2025" }
  ],
  "monthlyFlow": [
    { "month": "Jan", "entrées": 2.8, "sorties": 2.2 }
  ]
}
```

### GET /svc/finances/paiements
Payment tracking. **Query:** `?status=pending&page=1`
**Response:**
```json
{
  "stats": { "completed": 142, "processing": 18, "pending": 5, "totalAmount": "2.8M DT" },
  "data": [
    { "id": "P-001", "beneficiary": "Tunisie Telecom", "amount": 45000, "service": "Informatique",
      "status": "Effectué", "date": "24 Avr 2025" }
  ],
  "pagination": {}
}
```

### GET /svc/finances/audits
Audit reports. **Response:**
```json
{
  "stats": { "completed": 3, "inProgress": 2, "findings": 21, "critical": 3 },
  "audits": [
    { "id": "AUD-2025-01", "service": "RH", "type": "Audit RH", "findings": 3, "critical": 0, "status": "Clôturé" }
  ],
  "findingsByCategory": [
    { "category": "Financier", "count": 18 }
  ]
}
```

### GET /svc/finances/marches
Public procurement. **Response:**
```json
{
  "stats": { "active": 12, "published": 2, "awarded": 5, "inEvaluation": 3 },
  "data": [
    { "ref": "M-2025-01", "title": "Acquisition IT", "budget": 350000, "dept": "Informatique",
      "status": "En cours", "deadline": "30 Juin 2025" }
  ]
}
```

### GET /svc/finances/appels-offres
Procurement predictions. **Response:**
```json
{
  "stats": { "predictions": 8, "active": 12, "closed": 45, "totalBudget": "4.2M DT" },
  "predictions": [
    { "title": "Renouvellement licences", "budget": 280000, "probability": 92, "deadline": "Juin 2025" }
  ]
}
```

---

## 4.4 Service Budget (`/svc/budget`)

### GET /svc/budget/dashboard
Budget KPIs. **Response:** Same pattern with `allocations`, `execution`, `predictions` KPIs.

### GET /svc/budget/allocations
Budget allocation. **Response:**
```json
{
  "stats": { "total": "85M DT", "allocated": "78.5M DT", "reserved": "6.5M DT" },
  "byService": [
    { "name": "Enseignement", "budget": 28.5, "color": "#7C3AED" }
  ],
  "byInstitution": [
    { "name": "ENSI", "budget": 8.2 }
  ]
}
```

### GET /svc/budget/execution
Execution tracking. **Response:**
```json
{
  "stats": { "allocated": "42.0M DT", "consumed": "37.5M DT", "rate": 85.2, "overspend": 3 },
  "monthlyCumulative": [
    { "month": "Jan", "alloue": 7.0, "consomme": 5.8 }
  ],
  "byService": [
    { "name": "Enseignement", "alloue": 28.5, "consomme": 24.2, "taux": 84.9 }
  ]
}
```

### GET /svc/budget/previsions
Forecasts. **Response:**
```json
{
  "historical": [{ "year": 2021, "reel": 72.0, "prevu": 70.0 }, { "year": 2025, "reel": 85.0, "prevu": 83.0 }],
  "scenarios": [
    { "name": "Scénario Réaliste", "budget": 88.0, "probability": 55, "description": "Croissance stable +8%" }
  ]
}
```

### GET /svc/budget/comparaisons
Institution budget comparison. **Query:** `?sortBy=budget`
**Response:**
```json
{
  "data": [
    { "name": "ENSI", "budget": 8.2, "execution": 87.5, "prevision": 8.5 }
  ]
}
```

---

## 4.5 Service Informatique (`/svc/informatique`)

### GET /svc/informatique/dashboard
IT service KPIs. **Response:** Same pattern.

### GET /svc/informatique/incidents
IT incidents. **Response:**
```json
{
  "stats": { "open": 12, "resolved": 45, "avgResolution": "2.4h", "sla": 94.2 },
  "incidents": [
    { "id": "INC-045", "title": "Panne serveur", "service": "Réseau", "priority": "Critique", "status": "En cours" }
  ],
  "byPriority": [{ "level": "Critique", "count": 3 }]
}
```

### GET /svc/informatique/systemes
System inventory. **Response:**
```json
{
  "stats": { "total": 24, "operational": 22, "warning": 2, "offline": 0 },
  "systems": [
    { "name": "ERP UCAR", "version": "v4.2", "uptime": 99.8, "status": "OK", "type": "Critique" }
  ]
}
```

### GET /svc/informatique/securite
Security dashboard. **Response:**
```json
{
  "score": 82, "vulnerabilities": 37, "audits": 4, "gdprCompliance": 82,
  "byLevel": [{ "level": "Critique", "count": 2 }, { "level": "Élevée", "count": 5 }],
  "checks": [
    { "name": "Pare-feu", "score": 100, "status": "OK" },
    { "name": "MFA", "score": 72, "status": "Warning" }
  ]
}
```

### GET /svc/informatique/demandes
IT support requests. **Response:**
```json
{
  "stats": { "pending": 18, "inProgress": 12, "resolved": 45, "sla": 92 },
  "requests": [
    { "id": "REQ-101", "title": "Création compte", "requester": "RH", "priority": "Normale", "status": "En cours" }
  ]
}
```

---

## 4.6 Service Équipement (`/svc/equipement`)

### GET /svc/equipement/dashboard — Same pattern
### GET /svc/equipement/batiments
Buildings. **Response:**
```json
{
  "stats": { "total": 12, "good": 8, "renovate": 4, "totalArea": "20800 m²" },
  "buildings": [
    { "name": "Bâtiment A", "surface": 3200, "floors": 4, "etat": "Bon", "occupancy": 85, "year": 2005 }
  ]
}
```

### GET /svc/equipement/maintenance
Maintenance requests. **Response:**
```json
{
  "stats": { "total": 20, "open": 8, "resolved": 35, "rate": 87 },
  "requests": [
    { "id": "MAINT-01", "title": "Fuite d'eau", "priority": "Urgente", "status": "En cours", "assigned": "Hamdi Moulhi" }
  ],
  "byPriority": [{ "level": "Urgente", "count": 3 }]
}
```

### GET /svc/equipement/equipements
Equipment inventory. **Response:**
```json
{
  "stats": { "total": 3377, "operational": 2850, "warning": 420, "offline": 107 },
  "equipments": [
    { "name": "Ordinateurs", "count": 850, "status": "OK", "depreciation": 65 }
  ]
}
```

### GET /svc/equipement/projets
Projects. **Response:**
```json
{
  "stats": { "active": 3, "completed": 1, "planned": 1, "budget": "5.55M DT" },
  "projects": [
    { "name": "Rénovation Bâtiment A", "budget": 1200000, "progress": 65, "deadline": "Déc 2025" }
  ]
}
```

---

## 4.7 Service Bibliothèque (`/svc/bibliotheque`)

### GET /svc/bibliotheque/dashboard
### GET /svc/bibliotheque/collections
**Response:**
```json
{
  "stats": { "paper": 48500, "digital": 20512, "newMonthly": 450, "activeUsers": 8500 },
  "collectionData": [
    { "type": "Livres Papier", "count": 45000 }
  ]
}
```

### GET /svc/bibliotheque/prets
Loans. **Response:**
```json
{
  "stats": { "active": 2300, "overdue": 85, "todayReturns": 42, "returnRate": 88 },
  "monthlyData": [
    { "month": "Jan", "prets": 520, "retours": 480 }
  ]
}
```

### GET /svc/bibliotheque/numerique
Digital resources. **Response:**
```json
{
  "stats": { "platforms": 12, "sessionsPerMonth": 52000, "searchesPerMonth": 145000, "remoteUsers": 3200 },
  "topPlatforms": [
    { "platform": "ScienceDirect", "sessions": 4500, "searches": 12500 }
  ]
}
```

### GET /svc/bibliotheque/budget
Budget. **Response:**
```json
{
  "stats": { "allocated": 320000, "spent": 280000, "rate": 87 },
  "byCategory": [
    { "category": "Abonnements", "allocated": 180, "spent": 165 }
  ]
}
```

---

## 4.8 Service Juridique (`/svc/juridique`)

### GET /svc/juridique/dashboard
### GET /svc/juridique/contentieux
**Response:**
```json
{
  "stats": { "active": 8, "inProgress": 5, "closed": 15, "favorableRate": 82 },
  "cases": [
    { "ref": "C-2025-01", "title": "Contentieux foncier", "type": "Foncier", "status": "En cours" }
  ],
  "byType": [{ "type": "Commercial", "count": 5 }]
}
```

### GET /svc/juridique/contrats
Contracts. **Response:**
```json
{
  "stats": { "active": 52, "renewal": 3, "expired": 2, "totalAmount": "18.5M DT" },
  "contracts": [
    { "ref": "CT-2025-01", "title": "Maintenance", "partner": "Société ABC", "amount": 450000, "deadline": "31 Déc 2025" }
  ]
}
```

### GET /svc/juridique/conformite
Compliance. **Response:**
```json
{
  "overall": 78,
  "items": [
    { "domain": "Protection des données", "score": 95, "status": "Conforme", "deadline": null, "manager": "Service IT" }
  ]
}
```

### GET /svc/juridique/avis
Legal opinions. **Response:**
```json
{
  "stats": { "issued": 28, "inProgress": 5, "requested": 3, "avgDays": 4.2 },
  "opinions": [
    { "title": "Marché maintenance IT", "requester": "IT", "date": "22 Avr 2025", "status": "Émis" }
  ],
  "byType": [{ "type": "Contrats", "count": 18 }]
}
```

---

## 4.9 Service Académique (`/svc/academique`)

### GET /svc/academique/dashboard
### GET /svc/academique/programmes
**Response:**
```json
{
  "stats": { "total": 85, "accredited": 12, "renewal": 3, "new2025": 5 },
  "programs": [
    { "name": "Licence Informatique", "level": "Licence", "institution": "ENSI", "students": 450,
      "status": "Accrédité", "accreditation": "2027" }
  ]
}
```

### GET /svc/academique/inscriptions
Enrollment. **Response:**
```json
{
  "stats": { "total2025": 43200, "newStudents": 11800, "growth": 2.3 },
  "trend": [
    { "year": 2020, "inscriptions": 38500, "nouveaux": 9500 }
  ]
}
```

### GET /svc/academique/reussite
Success rates. **Response:**
```json
{
  "stats": { "rate": 75.8, "dropout": 8.2, "graduates2024": 8500, "honors": 32 },
  "byInstitution": [
    { "institution": "ENSI", "taux": 82 }
  ]
}
```

### GET /svc/academique/calendrier
Academic calendar. **Response:**
```json
{
  "events": [
    { "date": "15-20 Sep 2025", "event": "Pré-rentrée", "type": "Administratif", "status": "Planifié" }
  ]
}
```

### GET /svc/academique/vie-etudiante
Student life. **Response:**
```json
{
  "stats": { "clubs": 18, "members": 495, "eventsPerYear": 56, "categories": 6 },
  "clubs": [
    { "name": "Club Robotique", "members": 45, "events": 12, "category": "Scientifique" }
  ]
}
```

### GET /svc/academique/comparaisons
Academic comparisons. **Query:** `?metric=taux&institutions=ensi,fst`
**Response:**
```json
{
  "data": [
    { "name": "ENSI", "taux": 82, "aband": 5, "emploi": 78 }
  ]
}
```

---

## 4.10 Service Recherche (`/svc/recherche`)

### GET /svc/recherche/dashboard
### GET /svc/recherche/publications
**Response:**
```json
{
  "stats": { "total2025": 458, "affiliated": 385, "international": 175, "unaffiliated": 73 },
  "trend": [
    { "year": 2021, "total": 320, "affiliated": 210 }
  ]
}
```

### GET /svc/recherche/projets
Research projects. **Response:**
```json
{
  "stats": { "total": 43, "active": 12, "budget": "16.6M DT", "externalFunding": 68 },
  "projects": [
    { "name": "Smart Agriculture IoT", "leader": "Pr. Mohamed Salah", "budget": 450000, "funding": "PRF", "status": "En cours" }
  ],
  "byStatus": [{ "status": "En cours", "count": 12 }]
}
```

### GET /svc/recherche/cooperation
International cooperation. **Response:**
```json
{
  "stats": { "agreements": 28, "active": 25, "mobilitesPerYear": 120, "countries": 18 },
  "agreements": [
    { "country": "France", "partner": "Université Paris-Saclay", "type": "Erasmus+", "students": 12, "since": "2018" }
  ]
}
```

### GET /svc/recherche/doctorants
PhD tracking. **Response:**
```json
{
  "stats": { "total": 380, "new2025": 65, "defended": 42, "completionRate": 72 },
  "phds": [
    { "name": "Mohamed Ali", "topic": "ML en Santé", "director": "Pr. Salah", "year": "3e", "status": "En cours" }
  ],
  "byYear": [{ "year": "1ère", "count": 85 }]
}
```

### GET /svc/recherche/classements
Rankings from research perspective. **Response:**
```json
{
  "rankings": [
    { "system": "THE 2025", "rank": "#401", "target": "#350", "delta": "+100" }
  ],
  "trend": [{ "year": 2021, "the": 1201 }]
}
```

### GET /svc/recherche/comparaisons
Research comparison. **Query:** `?metric=pubs`
**Response:**
```json
{
  "data": [
    { "name": "FST", "pubs": 85, "aff": 78, "phds": 45, "projets": 12 }
  ]
}
```

---

## 4.11 Secrétariat Général (`/svc/sg`)

### GET /svc/sg/dashboard
### GET /svc/sg/courrier
Mail tracking. **Response:**
```json
{
  "stats": { "received": 145, "inProgress": 12, "processed": 128, "urgent": 5 },
  "mails": [
    { "ref": "C-2025-001", "objet": "Demande accréditation", "expediteur": "ENSI",
      "date": "24 Avr 2025", "urgence": "Haute", "statut": "Traité" }
  ]
}
```

### GET /svc/sg/decisions
Official decisions. **Response:**
```json
{
  "stats": { "published": 45, "inProgress": 8, "draft": 5, "pending": 3 },
  "decisions": [
    { "ref": "D-2025-001", "title": "Nomination Chef département", "type": "Nominative", "date": "22 Avr 2025", "status": "Publié" }
  ]
}
```

### GET /svc/sg/reunions
Meetings. **Response:**
```json
{
  "stats": { "thisMonth": 18, "planned": 3, "held": 15, "participants": 70 },
  "meetings": [
    { "title": "Conseil d'Université", "date": "15 Mai 2025", "time": "09:00", "lieu": "Salle du Conseil", "participants": 18, "status": "Planifié" }
  ]
}
```

### GET /svc/sg/documents
Document archive. **Response:**
```json
{
  "stats": { "total": 245, "minutes": 85, "reports": 42, "archives2025": 38 },
  "documents": [
    { "name": "PV Conseil 25-03-2025", "type": "PDF", "size": "2.4 MB", "date": "25 Mar 2025", "category": "PV" }
  ]
}
```

---

# 5. TEACHER PORTAL

### GET /teacher/dashboard
Teacher dashboard. **Response:**
```json
{
  "profile": {
    "id": "u-200", "firstName": "Ahmed", "lastName": "Ben Ali",
    "email": "ahmed.benali@ensi.tn", "title": "Dr.",
    "institution": "ENSI", "department": "Informatique"
  },
  "kpIs": {
    "totalCourses": 4, "totalStudents": 185, "successRate": 83,
    "hoursCompleted": 42, "hoursPlanned": 48, "overtime": 4
  },
  "courses": [
    { "id": "crs-001", "name": "Algorithmique Avancée", "students": 48, "progress": 85, "avgGrade": 14.2 }
  ],
  "upcoming": [
    { "type": "Examen", "date": "28 Avr 2025", "course": "INF-401" }
  ]
}
```

### GET /teacher/attendance
Attendance records. **Response:**
```json
{
  "courses": [{ "id": "crs-001", "name": "INF-401", "attendanceRate": 85 }],
  "sessions": [
    { "date": "26 Avr 2025", "course": "INF-401", "students": [
      { "name": "Ali Salem", "status": "present" }
    ]}
  ]
}
```

### PUT /teacher/attendance
Mark attendance. **Request:**
```json
{
  "courseId": "crs-001",
  "date": "2025-04-26",
  "students": [
    { "enrollmentId": "enr-001", "status": "present" }
  ]
}
```

### GET /teacher/grades
Student grades for teacher's courses. **Query:** `?courseId=crs-001`
**Response:**
```json
{
  "students": [
    { "name": "Ali Salem", "studentId": "ET-001", "ds": 14, "tp": 16, "exam": 12, "finalGrade": 13.5 }
  ],
  "distribution": {
    "classAvg": 13.9, "nationalAvg": 13.5, "stdDev": 2.8,
    "histogram": [{ "range": "0-5", "count": 2 }, { "range": "15-20", "count": 15 }]
  }
}
```

### PUT /teacher/grades
Submit grades. **Request:**
```json
{
  "courseId": "crs-001",
  "students": [
    { "enrollmentId": "enr-001", "ds": 14, "tp": 16, "exam": 12 }
  ]
}
```
**Response:**
```json
{ "saved": 48, "warnings": ["La distribution s'écarte de la moyenne nationale de 15%"] }
```

### GET /teacher/research
Teacher's research portfolio. **Response:**
```json
{
  "publications": [
    { "title": "Deep Learning in NLP", "journal": "IEEE Access", "year": 2025, "doi": "10.1000/xyz",
      "isUcarAffiliated": true, "citations": 12 }
  ],
  "projects": [{ "title": "AI for Education", "role": "Co-PI", "funding": "PRF" }]
}
```

### POST /teacher/research
Submit new publication. **Request:**
```json
{
  "title": "New Research Paper", "journal": "Nature", "year": 2025,
  "doi": "10.1000/abc", "isUcarAffiliated": true,
  "authors": ["Ahmed Ben Ali", "Sana Mejri"]
}
```

### GET /teacher/hours
Teaching hours. **Response:**
```json
{
  "totalCompleted": 42, "totalPlanned": 48, "overtime": 4,
  "weeks": [{ "week": 1, "month": "Avril 2025", "completed": 8.5, "planned": 8 }]
}
```

### GET /teacher/syllabus
Course syllabus progress. **Response:**
```json
{
  "data": [
    { "name": "Chapitre 1: Introduction", "progress": 100, "status": "Termine", "order": 1 }
  ]
}
```

### PUT /teacher/syllabus
Update syllabus. **Request:**
```json
{
  "courseId": "crs-001",
  "topics": [{ "name": "Chapitre 1", "progress": 100, "status": "Terminé" }]
}
```

### GET /teacher/analytics
Course analytics. **Response:**
```json
{
  "overallAvg": 13.9, "passRate": 84, "atRisk": 12, "attendanceRate": 82,
  "coursePerformance": [{ "name": "INF-401", "avgGrade": 14.2, "passRate": 88 }]
}
```

### GET /teacher/rooms
Room availability. Same as general rooms endpoint scoped to teacher's institution.

### POST /teacher/incidents
Report incident. **Request:** `{ "type": "equipment", "description": "...", "roomId": "..." }`

---

# 6. STUDENT PORTAL

### GET /student/dashboard
Student home. **Response:**
```json
{
  "profile": {
    "id": "u-300", "firstName": "Oussema", "lastName": "Harrabi",
    "studentId": "ET-001", "program": "INF-401", "institution": "ENSI",
    "semester": 6
  },
  "kpIs": {
    "currentAvg": 14.2, "cumulativeGpa": 14.8, "attendanceRate": 85,
    "progress": 78, "carbonFootprintTonnes": 2.4, "carbonAvgTonnes": 3.1,
    "validatedCredits": 19, "totalCredits": 19
  }
}
```

### GET /student/grades
All grades. **Response:**
```json
{
  "courses": [
    { "courseName": "INF-401", "credits": 6, "ds": 14, "tp": 16, "exam": 12, "finalGrade": 13.5 }
  ],
  "semesterAvg": 14.2, "cumulativeGpa": 14.8,
  "trend": [{ "semester": "S1", "avg": 12.5 }, { "semester": "S6", "avg": 14.2 }]
}
```

### GET /student/attendance
Attendance. **Response:**
```json
{
  "overall": 85,
  "byCourse": [{ "courseName": "INF-401", "present": 22, "total": 24, "percentage": 92 }]
}
```

### GET /student/schedule
Weekly schedule. **Response:**
```json
{
  "week": [
    { "day": "Lundi", "sessions": [
      { "start": "08:00", "end": "10:00", "course": "INF-401", "room": "Salle 204" }
    ]}
  ]
}
```

### GET /student/feedback
Feedback forms. **Response:**
```json
{
  "available": [
    { "course": "INF-401", "canRate": true, "lastRated": null }
  ],
  "submitted": [
    { "type": "equipment", "description": "Projecteur défaillant", "status": "En cours", "date": "20 Avr 2025" }
  ]
}
```

### POST /student/feedback
Submit feedback. **Request:**
```json
{
  "type": "course-rating",
  "courseId": "crs-001",
  "rating": 4,
  "description": "Excellent cours, bien structuré",
  "anonymous": false
}
```

### GET /student/carbon
Carbon footprint. **Response:**
```json
{
  "totalTonnes": 2.4, "averageTonnes": 3.1,
  "breakdown": {
    "transport": { "tonnes": 1.2, "percentage": 50 }
  },
  "challenges": [
    { "name": "Utiliser transports en commun", "progress": 80, "points": 150 }
  ]
}
```

### GET /student/career
Career & internship. **Response:**
```json
{
  "listings": [
    { "title": "Stage Data Scientist", "company": "Vermeg", "location": "Tunis", "type": "stage", "date": "20 Avr 2025" }
  ],
  "internship": { "company": "Vermeg", "supervisor": "M. Ali", "status": "En cours" },
  "alumniStats": { "employed3Months": 62, "avgSalary": 1800 }
}
```

### GET /student/mobility
Erasmus+ and mobility. **Response:**
```json
{
  "programs": [
    { "program": "Erasmus+ France", "university": "Paris-Saclay", "country": "France", "places": 5, "deadline": "30 Mai 2025" }
  ],
  "application": {
    "status": "En cours", "progress": 66,
    "checklist": [
      { "label": "Dossier académique", "status": "done" },
      { "label": "Lettre de motivation", "status": "pending" }
    ]
  }
}
```

### GET /student/survey
Available surveys. **Response:**
```json
{
  "surveys": [
    { "title": "Satisfaction enseignants", "deadline": "15 Mai 2025", "status": "Non répondu" },
    { "title": "Employabilité", "status": "Complété" }
  ]
}
```

### POST /student/survey
Submit survey. **Request:**
```json
{
  "surveyId": "sur-001",
  "responses": [
    { "questionId": "q1", "answer": "Satisfait" }
  ]
}
```

### GET /student/campus-life
Student clubs and events. **Response:**
```json
{
  "clubs": [{ "name": "Club Robotique", "category": "Scientifique" }],
  "events": [
    { "title": "Hackathon ENSTAB", "date": "15 Mai 2025", "location": "Amphi A" }
  ]
}
```

---

# 7. CROSS-CUTTING ENDPOINTS

## 7.1 AI Chat

### POST /chat/query
Natural language AI assistant. Scoped to user's role and institution.

**Request:**
```json
{
  "message": "Quel est le taux de réussite à l'ENSI ?",
  "context": {
    "role": "president",
    "institutionId": null,
    "serviceId": null
  },
  "history": []
}
```
**Response:**
```json
{
  "response": "Le taux de réussite à l'ENSI est de 82% en 2025.",
  "data": [{ "name": "ENSI", "value": 82 }],
  "chartType": "bar",
  "exportable": true,
  "confidence": 0.95,
  "sources": [{ "document": "Rapport Annuel 2024" }]
}
```

## 7.2 Document Ingestion

### POST /documents/ingest
Upload document for AI extraction. **Request:** `multipart/form-data`
```
file: binary
institutionId: uuid
domain: string
```
**Response 202:**
```json
{ "documentId": "uuid", "status": "processing", "estimatedTimeSeconds": 30 }
```

### GET /documents/:id/status
Check progress. **Response:**
```json
{
  "documentId": "uuid",
  "status": "vectorizing",
  "progress": 80,
  "extractedRecords": 47
}
```

## 7.3 Rooms

### GET /rooms
Room availability. **Query:** `?institutionId=&type=classroom`
**Response:**
```json
{
  "data": [
    { "id": "r-001", "number": "Salle 204", "building": "Bâtiment A", "capacity": 48,
      "equipment": ["Projecteur"], "status": "Disponible" }
  ]
}
```

## 7.4 Settings

### GET /settings
User settings. **Response:** `{ "language": "fr", "notifications": true, "theme": "light" }`

### PUT /settings
Update settings. **Request:** `{ "language": "fr", "notifications": true }`

---

# 8. COMMON RESPONSE TYPES

### Pagination Object
```json
{ "page": 1, "limit": 20, "total": 100, "totalPages": 5 }
```

### KPI Object
```json
{ "title": "string", "value": 100, "unit": "%", "target": 120, "trend": "up", "trendValue": 5.2 }
```

### Chart Data Point
```json
{ "date": "2025-01", "value": 100, "label": "Janvier" }
```

### Error Response
```json
{ "error": { "code": "NOT_FOUND", "message": "Institution non trouvée" } }
```

### HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async) |
| 400 | Bad request |
| 401 | Unauthenticated |
| 403 | Forbidden (wrong role) |
| 404 | Not found |
| 422 | Validation error |
| 500 | Server error |

---

# API ENDPOINTS INDEX (by frontend page)

| Frontend Page | API Endpoint | Method |
|--------------|-------------|--------|
| Login | `/auth/login` | POST |
| Login (2FA) | `/auth/verify-2fa` | POST |
| President Dashboard | `/president/dashboard` | GET |
| GreenMetric | `/president/greenmetric` | GET |
| Rankings | `/president/rankings` | GET |
| Compliance | `/president/compliance` | GET |
| Research | `/president/recherche` | GET |
| Anomalies | `/president/anomalies` | GET |
| Anomalies (update) | `/president/anomalies/:id/status` | PUT |
| Appels d'Offres | `/president/appels-offres` | GET |
| Institutions List | `/president/institutions` | GET |
| Institution Detail | `/president/institutions/:id` | GET |
| Comparisons | `/president/comparaisons` | GET |
| Services | `/president/services` | GET |
| Reports | `/president/reports` | GET |
| Users | `/users` | GET |
| Assign User | `/users/assign` | POST |
| RH Dashboard | `/svc/rh/dashboard` | GET |
| RH Personnel | `/svc/rh/personnel` | GET |
| RH Recrutement | `/svc/rh/recrutement` | GET |
| RH Congés | `/svc/rh/conges` | GET |
| RH Formation | `/svc/rh/formation` | GET |
| RH Évaluations | `/svc/rh/evaluations` | GET |
| Enseignement Dashboard | `/svc/enseignement/dashboard` | GET |
| Enseignement Enseignants | `/svc/enseignement/enseignants` | GET |
| Enseignement Promotions | `/svc/enseignement/promotions` | GET |
| Enseignement Charges | `/svc/enseignement/charges` | GET |
| Enseignement Heures | `/svc/enseignement/heures` | GET |
| Enseignement Recherche | `/svc/enseignement/recherche` | GET |
| Finances Dashboard | `/svc/finances/dashboard` | GET |
| Finances Trésorerie | `/svc/finances/tresorerie` | GET |
| Finances Paiements | `/svc/finances/paiements` | GET |
| Finances Audits | `/svc/finances/audits` | GET |
| Finances Marchés | `/svc/finances/marches` | GET |
| Finances Appels d'Offres | `/svc/finances/appels-offres` | GET |
| Budget Dashboard | `/svc/budget/dashboard` | GET |
| Budget Allocations | `/svc/budget/allocations` | GET |
| Budget Execution | `/svc/budget/execution` | GET |
| Budget Previsions | `/svc/budget/previsions` | GET |
| Budget Comparaisons | `/svc/budget/comparaisons` | GET |
| Informatique Dashboard | `/svc/informatique/dashboard` | GET |
| Informatique Incidents | `/svc/informatique/incidents` | GET |
| Informatique Systèmes | `/svc/informatique/systemes` | GET |
| Informatique Sécurité | `/svc/informatique/securite` | GET |
| Informatique Demandes | `/svc/informatique/demandes` | GET |
| Équipement Dashboard | `/svc/equipement/dashboard` | GET |
| Équipement Bâtiments | `/svc/equipement/batiments` | GET |
| Équipement Maintenance | `/svc/equipement/maintenance` | GET |
| Équipement Équipements | `/svc/equipement/equipements` | GET |
| Équipement Projets | `/svc/equipement/projets` | GET |
| Bibliothèque Dashboard | `/svc/bibliotheque/dashboard` | GET |
| Bibliothèque Collections | `/svc/bibliotheque/collections` | GET |
| Bibliothèque Prêts | `/svc/bibliotheque/prets` | GET |
| Bibliothèque Numérique | `/svc/bibliotheque/numerique` | GET |
| Bibliothèque Budget | `/svc/bibliotheque/budget` | GET |
| Juridique Dashboard | `/svc/juridique/dashboard` | GET |
| Juridique Contentieux | `/svc/juridique/contentieux` | GET |
| Juridique Contrats | `/svc/juridique/contrats` | GET |
| Juridique Conformité | `/svc/juridique/conformite` | GET |
| Juridique Avis | `/svc/juridique/avis` | GET |
| Académique Dashboard | `/svc/academique/dashboard` | GET |
| Académique Programmes | `/svc/academique/programmes` | GET |
| Académique Inscriptions | `/svc/academique/inscriptions` | GET |
| Académique Réussite | `/svc/academique/reussite` | GET |
| Académique Calendrier | `/svc/academique/calendrier` | GET |
| Académique Vie Étudiante | `/svc/academique/vie-etudiante` | GET |
| Académique Comparaisons | `/svc/academique/comparaisons` | GET |
| Recherche Dashboard | `/svc/recherche/dashboard` | GET |
| Recherche Publications | `/svc/recherche/publications` | GET |
| Recherche Projets | `/svc/recherche/projets` | GET |
| Recherche Coopération | `/svc/recherche/cooperation` | GET |
| Recherche Doctorants | `/svc/recherche/doctorants` | GET |
| Recherche Classements | `/svc/recherche/classements` | GET |
| Recherche Comparaisons | `/svc/recherche/comparaisons` | GET |
| SG Dashboard | `/svc/sg/dashboard` | GET |
| SG Courrier | `/svc/sg/courrier` | GET |
| SG Décisions | `/svc/sg/decisions` | GET |
| SG Réunions | `/svc/sg/reunions` | GET |
| SG Documents | `/svc/sg/documents` | GET |
| Teacher Dashboard | `/teacher/dashboard` | GET |
| Teacher Attendance | `/teacher/attendance` | GET/PUT |
| Teacher Grades | `/teacher/grades` | GET/PUT |
| Teacher Research | `/teacher/research` | GET/POST |
| Teacher Hours | `/teacher/hours` | GET |
| Teacher Syllabus | `/teacher/syllabus` | GET/PUT |
| Teacher Analytics | `/teacher/analytics` | GET |
| Student Dashboard | `/student/dashboard` | GET |
| Student Grades | `/student/grades` | GET |
| Student Attendance | `/student/attendance` | GET |
| Student Schedule | `/student/schedule` | GET |
| Student Feedback | `/student/feedback` | GET/POST |
| Student Carbon | `/student/carbon` | GET |
| Student Career | `/student/career` | GET |
| Student Mobility | `/student/mobility` | GET |
| Student Surveys | `/student/survey` | GET/POST |
| Student Campus Life | `/student/campus-life` | GET |
| AI Chat | `/chat/query` | POST |
| Document Ingest | `/documents/ingest` | POST |
| Room Availability | `/rooms` | GET |
| Settings | `/settings` | GET/PUT |
| All report pages | `/svc/*/rapports` | GET (same pattern) |