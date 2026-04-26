# 🎓 UCAR Intelligence Platform

**Université de Carthage — Hack4UCAR 2025**

Plateforme de gestion intelligente centralisant les données des 12 établissements de l'Université de Carthage pour améliorer les KPIs, la prise de décision et le classement international.

---

## 📋 Table des matières

1. [Architecture](#-architecture)
2. [Modules & Fonctionnalités](#-modules--fonctionnalités)
3. [14 Rôles Utilisateurs](#-14-rôles-utilisateurs)
4. [Technologies](#-technologies)
5. [Installation & Démarrage](#-installation--démarrage)
6. [Docker](#-docker)
7. [API Documentation](#-api-documentation)
8. [Déploiement](#-déploiement)
9. [Structure du Projet](#-structure-du-projet)
10. [Équipe](#-équipe)

---

## 🏗 Architecture

<img width="6187" height="8192" alt="User Access   API Gateway-2026-04-26-082008" src="https://github.com/user-attachments/assets/5c2f48d8-9387-4ed4-b7d8-a3bb7a519085" />



## 🧩 Modules & Fonctionnalités

### 🏛 Présidence (Tableau de Bord Stratégique)
| Page | Description |
|------|-------------|
| Dashboard | 6 KPI cards, classements THE/QS/GreenMetric, traffic-light 35×8 grid |
| GreenMetric | 7 critères (Infrastructure, Énergie, Déchets, Eau, Transport, Éducation, Gouvernance) |
| Classements | Évolution THE, QS, UI GreenMetric, THE Impact, analyse des écarts |
| Conformité ISO | ISO 21001/14001/9001 — progression, deadlines, audits planifiés |
| Recherche | Publications, affiliation UCAR, doctorants, projets, chercheurs |
| Anomalies IA | Détection automatique avec explications SHAP |
| Appels d'Offres | Prédictions IA des besoins d'achats, suivi des offres |
| Institutions | 12 établissements UCAR, drill-down avec KPIs et domaines |
| Comparaisons | Multi-institutions, sélection de KPI, classement interactif |
| Services UCAR | Vue d'ensemble des 11 services |
| Utilisateurs | Gestion des accès et rôles |
| Rapports | Templates PDF/XLSX, rapports programmés |

### 11 Services UCAR (Chaque service a son mini-ERP)
| Service | Pages |
|---------|-------|
| **RH** | Dashboard, Personnel, Recrutement, Congés, Formation, Évaluations |
| **Enseignement** | Dashboard, Enseignants, Promotions, Charges, Heures, Recherche |
| **Finances** | Dashboard, Trésorerie, Paiements, Audits, Marchés, Appels d'Offres |
| **Budget** | Dashboard, Allocations, Exécution, Prévisions, Comparaisons |
| **Informatique** | Dashboard, Incidents, Systèmes, Sécurité, Demandes |
| **Équipement** | Dashboard, Bâtiments, Maintenance, Équipements, Projets |
| **Bibliothèque** | Dashboard, Collections, Prêts, Numérique, Budget |
| **Juridique** | Dashboard, Contentieux, Contrats, Conformité, Avis |
| **Académique** | Dashboard, Programmes, Inscriptions, Réussite, Calendrier, Vie Étudiante |
| **Recherche** | Dashboard, Publications, Projets, Coopération, Doctorants, Classements |
| **SG** | Dashboard, Courrier, Décisions, Réunions, Documents |

### 👨‍🏫 Portail Enseignant
Cours, présences, notes, recherches, heures, syllabus, analytics

### 👩‍🎓 Portail Étudiant
Notes, présences, emploi du temps, feedbacks, carbon footprint, carrière, mobilité Erasmus+, enquêtes

### 🤖 Intelligence Artificielle
- **Anomaly Detection**: Z-score + Isolation Forest sur les KPIs
- **Appel d'Offres Prediction**: Prophet + classification sur l'historique
- **RAG Chat**: LangChain + pgvector + embeddings multilingues (HF)
- **Text-to-SQL**: Groq LLaMA 3.3 70B convertit le langage naturel en SQL

---

## 👥 14 Rôles Utilisateurs

| # | Rôle | Niveau | Accès | Se connecte avec |
|---|------|--------|-------|-----------------|
| 0 | **Présidence** | 0 | Tous les services, toutes les institutions | `president@ucar.tn` / `ucar2024` |
| 1 | **Secrétariat Général** | 1 | Courrier, décisions, réunions | `wahida.boutabba@ucar.tn` / `ucar2024` |
| 2 | **Service RH** | 2 | RH uniquement | `mohamed.khedimallah@ucar.tn` / `ucar2024` |
| 3 | **Service Enseignement** | 2 | Enseignement uniquement | `samar.benyounes@ucar.tn` / `ucar2024` |
| 4 | **Service Bibliothèque** | 2 | Bibliothèque uniquement | `ridha.makadmi@ucar.tn` / `ucar2024` |
| 5 | **Service Finances** | 2 | Finances uniquement | `samir.ghodhbani@ucar.tn` / `ucar2024` |
| 6 | **Service Équipement** | 2 | Équipement uniquement | `neffisa.razouk@ucar.tn` / `ucar2024` |
| 7 | **Service Informatique** | 2 | Informatique uniquement | `iness.hmissi@ucar.tn` / `ucar2024` |
| 8 | **Service Budget** | 2 | Budget uniquement | `abdelkader.dehliz@ucar.tn` / `ucar2024` |
| 9 | **Service Juridique** | 2 | Juridique uniquement | `rawia.elwafi@ucar.tn` / `ucar2024` |
| 10 | **Service Académique** | 2 | Académique uniquement | `hatem.khaloui@ucar.tn` / `ucar2024` |
| 11 | **Service Recherche** | 2 | Recherche uniquement | `mehrez.hammami@ucar.tn` / `ucar2024` |
| 12 | **Enseignant** | 3 | Ses cours, ses étudiants | `ahmed.benali@ensi.tn` / `teacher2024` |
| 13 | **Étudiant** | 4 | Son profil, ses notes, sa vie étudiante | `oussema.harrabi@ensi.tn` / `student2024` |

---

## 🛠 Technologies

### Frontend
- **Framework**: Next.js 16 (App Router) + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts (Bar, Line, Area, Pie, Radar)
- **State**: Zustand
- **Icons**: Lucide React
- **Routes**: 141 pages, 0 erreurs TypeScript

### Backend
- **API**: FastAPI + Pydantic v2
- **Auth**: Supabase Auth + JWT (python-jose) + TOTP 2FA
- **RBAC**: Hiérarchie niveau 0-4 avec permissions par service
- **Database**: Supabase PostgreSQL 15 + pgvector
- **AI**: Groq LLaMA 3.3 70B (chat, text-to-SQL)
- **Embeddings**: HuggingFace `intfloat/multilingual-e5-large` (1024 dim)
- **Document Ingestion**: Unstructured.io + LangChain

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / Railway
- **Database**: Supabase Cloud
- **Storage**: Supabase Storage (bucket: `unicar`)
- **Containers**: Docker + docker-compose

---

## 🚀 Installation & Démarrage

### Prérequis
- Node.js 20+
- Python 3.11+
- Docker & Docker Compose (optionnel)
- Compte Supabase

### 1. Clone
```bash
git clone https://github.com/OussemaHarrabi/ENSTAB.git
cd ENSTAB
```

### 2. Database (Supabase)
1. Aller sur [Supabase Dashboard](https://supabase.com/dashboard/project/jaemsntxgyuttfvxdxpj)
2. Database → Extensions → Enable `vector`
3. SQL Editor → Copier-coller `supabase/migrations/20250426000001_complete_schema.sql` → Run

### 3. Backend
```bash
cd backend
cp .env .env.local   # Éditer avec vos clés
pip install -r requirements.txt
python seed.py       # Peupler la base avec les données de démo
uvicorn main:app --reload --port 8000
```

### 4. Frontend
```bash
cd frontend
npm install
npm run dev          # http://localhost:3000
```

### 5. Accéder
Ouvrir [http://localhost:3000](http://localhost:3000) et se connecter avec `president@ucar.tn` / `ucar2024`

---

## 🐳 Docker

```bash
# Tout builder et lancer
docker-compose up --build

# Ou service par service
docker-compose up frontend
docker-compose up backend
docker-compose up redis

# Arrêter
docker-compose down
```

Les services :
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:8000
- **Redis**: localhost:6379
- **API Docs**: http://localhost:8000/docs

---

## 📖 API Documentation

Une fois le backend lancé :
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health**: http://localhost:8000/health

### Endpoints principaux

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/v1/auth/login` | Connexion |
| GET | `/api/v1/auth/me` | Profil connecté |
| GET | `/api/v1/president/dashboard` | Dashboard présidence |
| GET | `/api/v1/president/greenmetric` | GreenMetric UCAR |
| GET | `/api/v1/president/rankings` | Classements |
| GET | `/api/v1/president/compliance` | Conformité ISO |
| GET | `/api/v1/president/recherche` | Recherche |
| GET | `/api/v1/president/anomalies` | Anomalies IA |
| GET | `/api/v1/president/appels-offres` | Appels d'offres prédictifs |
| GET | `/api/v1/president/institutions` | Institutions |
| GET | `/api/v1/president/institutions/:id` | Drill-down institution |
| GET | `/api/v1/president/comparaisons` | Comparaisons |
| GET | `/api/v1/svc/rh/dashboard` | Dashboard RH |
| GET | `/api/v1/svc/finances/tresorerie` | Trésorerie |
| GET | `/api/v1/svc/recherche/publications` | Publications |
| POST | `/api/v1/chat/query` | Chat IA |
| GET | `/api/v1/teacher/dashboard` | Dashboard enseignant |
| GET | `/api/v1/student/dashboard` | Dashboard étudiant |

---

## 🌐 Déploiement

### Frontend → Vercel
```bash
cd frontend
npm run build
npx vercel --prod
```
Variables d'environnement :
- `NEXT_PUBLIC_API_URL`: URL du backend déployé

### Backend → Render
1. Connecter le repo GitHub
2. Service → Web Service
3. Root Directory: `backend`
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Ajouter les variables d'environnement du `.env`

### Base de données → Supabase
Le projet Supabase est déjà configuré :
- **URL**: `https://jaemsntxgyuttfvxdxpj.supabase.co`
- **Bucket Storage**: `unicar`
- Les migrations SQL sont dans `supabase/migrations/`

---

## 📁 Structure du Projet

```
ENSTAB/
├── backend/                    # FastAPI Backend (Python)
│   ├── api/
│   │   └── v1/                 # 21 fichiers de routes
│   │       ├── auth.py         # Auth (login, 2FA, refresh)
│   │       ├── president.py    # Présidence (13 endpoints)
│   │       ├── analytics.py    # Analytics & KPIs
│   │       ├── services_*.py   # 11 services UCAR
│   │       ├── teacher.py      # Portail enseignant
│   │       ├── student.py      # Portail étudiant
│   │       ├── chat.py         # Chat IA
│   │       ├── documents.py    # Ingestion documents
│   │       ├── users.py        # Gestion utilisateurs
│   │       ├── rooms.py        # Salles & incidents
│   │       ├── settings.py     # Paramètres
│   │       └── router.py       # Agrégateur de routes
│   ├── auth/                   # JWT, RBAC, 2FA, password
│   ├── ai/
│   │   └── engine.py           # Moteur IA (Groq + HF)
│   ├── db/
│   │   └── supabase.py         # Client Supabase + SQL
│   ├── services/               # Services métier
│   ├── ingestion/              # Pipeline RAG (Python)
│   ├── main.py                 # Point d'entrée FastAPI
│   ├── seed.py                 # Script de seeding
│   ├── config.py               # Configuration
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/                   # Next.js Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/login/   # Page de connexion
│   │   │   └── (dashboard)/    # 141 routes de dashboard
│   │   │       ├── president/  # 13 pages Présidence
│   │   │       ├── rh/         # 8 pages RH
│   │   │       ├── finances/   # 8 pages Finances
│   │   │       ├── enseignement/ # 8 pages Enseignement
│   │   │       ├── budget/     # 7 pages Budget
│   │   │       ├── informatique/ # 7 pages IT
│   │   │       ├── equipement/ # 7 pages Équipement
│   │   │       ├── bibliotheque/ # 7 pages Bibliothèque
│   │   │       ├── juridique/  # 7 pages Juridique
│   │   │       ├── academique/ # 9 pages Académique
│   │   │       ├── recherche/  # 9 pages Recherche
│   │   │       ├── sg/         # 7 pages SG
│   │   │       ├── teacher/    # 9 pages Enseignant
│   │   │       └── student/    # 10 pages Étudiant
│   │   ├── components/         # Composants React
│   │   │   ├── kpi/            # KPI cards, charts, anomalies
│   │   │   ├── layout/         # Sidebar, TopBar
│   │   │   ├── ai/             # Chat panel
│   │   │   └── ui/             # UI primitives
│   │   └── lib/
│   │       ├── types.ts        # Types 14 rôles
│   │       ├── store.ts        # Zustand (auth state)
│   │       ├── api.ts          # Client API (→ backend)
│   │       ├── mock-data.ts    # Données mock
│   │       ├── mock-users.ts   # 35+ utilisateurs réels
│   │       └── utils.ts        # Helpers
│   ├── Dockerfile
│   └── package.json
│
├── supabase/
│   └── migrations/             # SQL migrations
│
├── docker-compose.yml          # Frontend + Backend + Redis
├── BACKEND_AI_ARCHITECTURE.md  # Documentation backend
├── api-contract.md             # Contrat API v2
└── README.md                   # Ce fichier
```

---

## 👨‍💻 Équipe

- **Oussema Harrabi** — Lead Developer, Frontend, Architecture
- **Chahin** — Backend API, Base de données
- **Université de Carthage** — Hack4UCAR 2025

---

## 📜 Licence

Projet développé dans le cadre du Hack4UCAR 2025 — Université de Carthage.
