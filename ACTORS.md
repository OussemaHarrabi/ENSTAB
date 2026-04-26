# 🎭 UCAR Intelligence Platform — Guide des Acteurs & Utilisateurs

Guide complet pour accéder et tester tous les rôles de la plateforme.

---

## 🔑 Accès Rapide

| Rôle | Email | Mot de passe | Page d'accueil |
|------|-------|-------------|----------------|
| 👑 Présidence | `president@ucar.tn` | `ucar2024` | `/president` |
| 📋 Secrétariat Général | `wahida.boutabba@ucar.tn` | `ucar2024` | `/sg` |
| 👥 RH | `mohamed.khedimallah@ucar.tn` | `ucar2024` | `/rh` |
| 📚 Enseignement | `samar.benyounes@ucar.tn` | `ucar2024` | `/enseignement` |
| 📖 Bibliothèque | `ridha.makadmi@ucar.tn` | `ucar2024` | `/bibliotheque` |
| 💰 Finances | `samir.ghodhbani@ucar.tn` | `ucar2024` | `/finances` |
| 🔧 Équipement | `neffisa.razouk@ucar.tn` | `ucar2024` | `/equipement` |
| 💻 Informatique | `iness.hmissi@ucar.tn` | `ucar2024` | `/informatique` |
| 📊 Budget | `abdelkader.dehliz@ucar.tn` | `ucar2024` | `/budget` |
| ⚖️ Juridique | `rawia.elwafi@ucar.tn` | `ucar2024` | `/juridique` |
| 🎓 Académique | `hatem.khaloui@ucar.tn` | `ucar2024` | `/academique` |
| 🔬 Recherche | `mehrez.hammami@ucar.tn` | `ucar2024` | `/recherche` |
| 🧑‍🏫 Enseignant | `ahmed.benali@ensi.tn` | `teacher2024` | `/teacher` |
| 🧑‍🎓 Étudiant | `oussema.harrabi@ensi.tn` | `student2024` | `/student` |

---

## 👑 1. PRÉSIDENCE (Niveau 0)

**Email**: `president@ucar.tn`
**Mot de passe**: `ucar2024`
**Page**: `/president`

### Accès
✅ Voir TOUS les services, TOUTES les institutions, TOUS les utilisateurs
✅ Assigner n'importe quel rôle à n'importe quel utilisateur
✅ Accéder à toutes les données consolidées UCAR

### Pages disponibles

| Page | URL | Ce qu'elle montre |
|------|-----|-------------------|
| **Dashboard** | `/president` | 6 KPI cards (étudiants, réussite, budget, publications, GreenMetric, classement THE), chart classements, chart GreenMetric, grille traffic-light 35×8, liens rapides |
| **GreenMetric** | `/president/greenmetric` | Score global UCAR (6 875/10 000), 7 critères détaillés, évolution historique, scores par établissement, recommandations IA |
| **Classements** | `/president/rankings` | Positions THE (#401), QS (#551), GreenMetric (#120), THE Impact (#251), comparaison concurrents (UTM, UMA, USF), écarts à combler, historique |
| **Conformité ISO** | `/president/compliance` | ISO 21001 (72%), ISO 14001 (55%), ISO 9001 (25%), étapes détaillées, conformité réglementaire, audits planifiés |
| **Recherche** | `/president/recherche` | 458 publications 2025, taux affiliation 84.1%, top institutions, publications à risque, projets (43, 16.6M DT), chercheurs par grade |
| **Anomalies IA** | `/president/anomalies` | Anomalies détectées (filtre: critique/warning/info), explications SHAP, actions (investiguer, accuser, faux positif) |
| **Appels d'Offres** | `/president/appels-offres` | Prédictions IA (5 appels à venir, probabilités), offres actives (3), budget total 2.85M DT |
| **Institutions** | `/president/institutions` | 12 établissements UCAR, recherche, filtre par type, stats |
| **Institution [id]** | `/president/institutions/:id` | KPIs de l'institution, radar domaines, GreenMetric, classements, anomalies |
| **Comparaisons** | `/president/comparaisons` | Sélection de KPI, choix 1-5 institutions, tableau comparatif classé, barres de progression |
| **Services UCAR** | `/president/services` | 11 services avec nombre de membres et directeur |
| **Utilisateurs** | `/president/utilisateurs` | Annuaire complet, rôles, services, statut actif/inactif |
| **Rapports** | `/president/rapports` | 6 templates de rapports, 3 rapports programmés |
| **Chat IA** | `/president/chat` | Assistant IA avec suggestions |

---

## 📋 2. SECRÉTARIAT GÉNÉRAL (Niveau 1)

**Email**: `wahida.boutabba@ucar.tn`
**Page**: `/sg`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/sg` | KPIs courrier, décisions, réunions |
| Courrier | `/sg/courrier` | 6 courriers avec urgence et statut |
| Décisions | `/sg/decisions` | 5 décisions publiées/en cours |
| Réunions | `/sg/reunions` | 6 réunions planifiées/tenues |
| Documents | `/sg/documents` | 7 documents archivés |
| Rapports | `/sg/rapports` | 3 templates |
| Chat | `/sg/chat` | Assistant SG |

---

## 👥 3. SERVICE RH (Niveau 2)

**Email**: `mohamed.khedimallah@ucar.tn`
**Page**: `/rh`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/rh` | Effectif 520, turnover 4.2%, absentéisme 3.1% |
| Personnel | `/rh/personnel` | Annuaire avec recherche, stats |
| Recrutement | `/rh/recrutement` | 8 postes ouverts, 95 candidats, pipeline |
| Congés | `/rh/conges` | 45 demandes ce mois, 12 en attente |
| Formation | `/rh/formation` | 6 programmes, 400 participants |
| Évaluations | `/rh/evaluations` | 285 planifiées, 177 complétées |
| Rapports | `/rh/rapports` | 6 templates RH |
| Chat | `/rh/chat` | Assistant RH |

---

## 📚 4. SERVICE ENSEIGNEMENT (Niveau 2)

**Email**: `samar.benyounes@ucar.tn`
**Page**: `/enseignement`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/enseignement` | 845 enseignants, ratio 18.5 |
| Enseignants | `/enseignement/enseignants` | Annuaire avec grade, publications, H-index |
| Promotions | `/enseignement/promotions` | 12 candidats, 4 étapes |
| Charges | `/enseignement/charges` | 13 505 heures, 6 départements |
| Heures | `/enseignement/heures` | 22 400h effectuées, 95.2% réalisation |
| Recherche | `/enseignement/recherche` | 900 publications, top chercheurs |
| Rapports | `/enseignement/rapports` | 5 templates |
| Chat | `/enseignement/chat` | Assistant Enseignement |

---

## 📖 5. SERVICE BIBLIOTHÈQUE (Niveau 2)

**Email**: `ridha.makadmi@ucar.tn`
**Page**: `/bibliotheque`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/bibliotheque` | 75 512 ressources, 2 300 prêts |
| Collections | `/bibliotheque/collections` | 6 catégories de ressources |
| Prêts | `/bibliotheque/prets` | Prêts/retours mensuels |
| Numérique | `/bibliotheque/numerique` | 12 plateformes, 52K sessions/mois |
| Budget | `/bibliotheque/budget` | 320K alloué, 87% exécuté |
| Rapports | `/bibliotheque/rapports` | 3 templates |

---

## 💰 6. SERVICE FINANCES (Niveau 2)

**Email**: `samir.ghodhbani@ucar.tn`
**Page**: `/finances`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/finances` | Revenus 28.5M DT, exécution 88.2% |
| Trésorerie | `/finances/tresorerie` | 3 comptes, 7.85M DT, flux mensuels |
| Paiements | `/finances/paiements` | 142 effectués, 18 en cours |
| Audits | `/finances/audits` | 5 audits, 21 constats |
| Marchés | `/finances/marches` | 12 marchés actifs |
| Appels d'Offres | `/finances/appels-offres` | 4 prédictions IA |
| Rapports | `/finances/rapports` | 5 templates |

---

## 🔧 7. SERVICE ÉQUIPEMENT (Niveau 2)

**Email**: `neffisa.razouk@ucar.tn`
**Page**: `/equipement`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/equipement` | 12 bâtiments, 3 377 équipements |
| Bâtiments | `/equipement/batiments` | 6 bâtiments, état, occupation |
| Maintenance | `/equipement/maintenance` | 20 demandes, 87% résolution |
| Équipements | `/equipement/equipements` | 8 catégories, dépréciation |
| Projets | `/equipement/projets` | 5 projets, 5.55M DT |

---

## 💻 8. SERVICE INFORMATIQUE (Niveau 2)

**Email**: `iness.hmissi@ucar.tn`
**Page**: `/informatique`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/informatique` | Disponibilité 99.2%, SLA 94.2% |
| Incidents | `/informatique/incidents` | 12 ouverts, 45 résolus |
| Systèmes | `/informatique/systemes` | 24 systèmes, 99.2% uptime |
| Sécurité | `/informatique/securite` | Score 82%, 37 vulnérabilités |
| Demandes | `/informatique/demandes` | 18 en attente, 45 résolus |

---

## 📊 9. SERVICE BUDGET (Niveau 2)

**Email**: `abdelkader.dehliz@ucar.tn`
**Page**: `/budget`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/budget` | 85M DT total, exécution 85.2% |
| Allocations | `/budget/allocations` | Par service, par institution |
| Exécution | `/budget/execution` | Cumul mensuel, par service |
| Prévisions | `/budget/previsions` | 3 scénarios (réaliste/optimiste/pessimiste) |
| Comparaisons | `/budget/comparaisons` | 8 institutions comparées |

---

## ⚖️ 10. SERVICE JURIDIQUE (Niveau 2)

**Email**: `rawia.elwafi@ucar.tn`
**Page**: `/juridique`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/juridique` | 8 contentieux, 52 contrats |
| Contentieux | `/juridique/contentieux` | 4 cas, 5 types |
| Contrats | `/juridique/contrats` | 5 contrats, échéances |
| Conformité | `/juridique/conformite` | 8 domaines réglementaires |
| Avis | `/juridique/avis` | 28 avis émis, 5 types |

---

## 🎓 11. SERVICE ACADÉMIQUE (Niveau 2)

**Email**: `hatem.khaloui@ucar.tn`
**Page**: `/academique`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/academique` | 43 200 étudiants, taux réussite 75.8% |
| Programmes | `/academique/programmes` | 85 programmes, accréditations |
| Inscriptions | `/academique/inscriptions` | Évolution 2020-2025 |
| Réussite | `/academique/reussite` | Par institution, stats |
| Calendrier | `/academique/calendrier` | Événements 2025-2026 |
| Vie Étudiante | `/academique/vie-etudiante` | 18 clubs, 495 membres |
| Comparaisons | `/academique/comparaisons` | 3 métriques (réussite, abandon, emploi) |

---

## 🔬 12. SERVICE RECHERCHE (Niveau 2)

**Email**: `mehrez.hammami@ucar.tn`
**Page**: `/recherche`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/recherche` | 458 publications, 84.1% affiliation |
| Publications | `/recherche/publications` | Évolution 2021-2025 |
| Projets | `/recherche/projets` | 43 projets, 16.6M DT |
| Coopération | `/recherche/cooperation` | 28 accords, 18 pays |
| Doctorants | `/recherche/doctorants` | 380 doctorants |
| Classements | `/recherche/classements` | THE, QS, GreenMetric |

---

## 🧑‍🏫 13. ENSEIGNANT (Niveau 3)

**Email**: `ahmed.benali@ensi.tn`
**Mot de passe**: `teacher2024`
**Page**: `/teacher`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/teacher` | 4 cours, 185 étudiants, heures |
| Présences | `/teacher/attendance` | Appel avec liste d'étudiants |
| Notes | `/teacher/grades` | Saisie notes, distribution |
| Programme | `/teacher/syllabus` | Progression syllabus |
| Recherche | `/teacher/research` | Publications, projets |
| Heures | `/teacher/hours` | 42h effectuées/48h |
| Salles | `/teacher/rooms` | Disponibilité |
| Analyses | `/teacher/analytics` | Performance cours |

---

## 🧑‍🎓 14. ÉTUDIANT (Niveau 4)

**Email**: `oussema.harrabi@ensi.tn`
**Mot de passe**: `student2024`
**Page**: `/student`

| Page | URL | Description |
|------|-----|-------------|
| Dashboard | `/student` | GPA, progression, events |
| Notes | `/student/grades` | 4 cours, moyenne 14.2/20 |
| Présences | `/student/attendance` | 85% global |
| Emploi du Temps | `/student/schedule` | Semaine complète |
| Feedbacks | `/student/feedback` | Soumettre, historique |
| Carrière | `/student/career` | Stages, offres, stats alumni |
| Mobilité | `/student/mobility` | Erasmus+, candidature |
| Carbone | `/student/carbon` | Empreinte 2.4T, challenges |
| Vie Étudiante | `/student/campus-life` | Clubs, événements |

---

## 🔄 Flux de Données

```
Étudiant (feedback, notes)
    ↓
Service Académique (inscriptions, réussite)
    ↓
Présidence (dashboard, classements)

Enseignant (publications, heures)
    ↓
Service Recherche + Service Enseignement
    ↓
Présidence (rankings THE/QS)

Équipement (maintenance)
    ↓
Service Équipement
    ↓
Présidence (budget exécution)

Tous les services (GreenMetric)
    ↓
Présidence (score GreenMetric, classement mondial)
```

---

## ✅ Parcours de Démo (15 minutes)

### 1. Connexion Présidence (2 min)
→ `http://localhost:3000`
→ Cliquer **Présidence** (quick access)
→ Voir le dashboard avec 6 KPI cards

### 2. GreenMetric (3 min)
→ Cliquer **GreenMetric** dans le sidebar
→ Voir le score UCAR 6 875/10 000
→ Voir les 7 critères avec tendances
→ Voir les scores par établissement

### 3. Classements (2 min)
→ Cliquer **Classements**
→ Voir THE #401, QS #551, GreenMetric #120
→ Comparaison avec UTM (concurrent)

### 4. Anomalies IA (2 min)
→ Cliquer **Anomalies IA**
→ Voir les alertes avec sévérité
→ Voir les explications SHAP

### 5. Institutions (2 min)
→ Cliquer **Institutions**
→ Cliquer sur **ENICarthage**
→ Voir le drill-down: KPIs, radar domaines, GreenMetric

### 6. Service RH (2 min)
→ Déconnexion → connexion avec `mohamed.khedimallah@ucar.tn`
→ Voir dashboard RH avec KPIs
→ Naviguer Personnel → Recrutement → Congés

### 7. Étudiant (2 min)
→ Déconnexion → connexion avec `oussema.harrabi@ensi.tn`
→ Voir notes, emploi du temps, feedback
