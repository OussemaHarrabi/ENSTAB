import type { Institution, KPIValue, AnomalyAlert, DomainKPI, GreenMetricEntry, RankingData, ResearchProject, Publication, DomainSlug } from './types'

export const institutions: Institution[] = [
  { id: 'inst-01', name: 'École Nationale Supérieure des Sciences de l\'Informatique', code: 'ENSI', type: 'École', city: 'Manouba', establishedYear: 1984, totalStudents: 2800, totalStaff: 180, accreditationStatus: ['ISO 9001'], isActive: true },
  { id: 'inst-02', name: 'École Nationale d\'Ingénieurs de Carthage', code: 'ENICarthage', type: 'École', city: 'Carthage', establishedYear: 2002, totalStudents: 3200, totalStaff: 210, accreditationStatus: ['ISO 9001', 'CTI'], isActive: true },
  { id: 'inst-03', name: 'Faculté des Sciences de Tunis', code: 'FST', type: 'Faculté', city: 'Tunis', establishedYear: 1960, totalStudents: 4500, totalStaff: 320, accreditationStatus: ['ISO 9001'], isActive: true },
  { id: 'inst-04', name: 'Institut Supérieur de Gestion', code: 'ISG', type: 'Institut', city: 'Tunis', establishedYear: 1987, totalStudents: 3900, totalStaff: 240, accreditationStatus: [], isActive: true },
  { id: 'inst-05', name: 'École Supérieure des Communications de Tunis', code: 'SUP\'COM', type: 'École', city: 'Ariana', establishedYear: 1996, totalStudents: 1800, totalStaff: 140, accreditationStatus: ['ISO 9001', 'CTI'], isActive: true },
  { id: 'inst-06', name: 'Institut National des Sciences Appliquées et de Technologie', code: 'INSAT', type: 'Institut', city: 'Tunis', establishedYear: 1992, totalStudents: 3500, totalStaff: 260, accreditationStatus: ['ISO 9001'], isActive: true },
  { id: 'inst-07', name: 'École Polytechnique de Tunisie', code: 'EPT', type: 'École', city: 'La Marsa', establishedYear: 1990, totalStudents: 1200, totalStaff: 110, accreditationStatus: ['CTI'], isActive: true },
  { id: 'inst-08', name: 'Institut Préparatoire aux Études d\'Ingénieurs de Tunis', code: 'IPEIT', type: 'Institut', city: 'Tunis', establishedYear: 1995, totalStudents: 2100, totalStaff: 130, accreditationStatus: [], isActive: true },
  { id: 'inst-09', name: 'Faculté des Sciences Économiques et de Gestion de Tunis', code: 'FSEGT', type: 'Faculté', city: 'Tunis', establishedYear: 1960, totalStudents: 5200, totalStaff: 300, accreditationStatus: ['ISO 9001'], isActive: true },
  { id: 'inst-10', name: 'École Nationale Supérieure d\'Ingénieurs de Tunis', code: 'ENSIT', type: 'École', city: 'Tunis', establishedYear: 2008, totalStudents: 2400, totalStaff: 180, accreditationStatus: ['CTI'], isActive: true },
  { id: 'inst-11', name: 'Institut Supérieur des Études Technologiques de Radès', code: 'ISETR', type: 'Institut', city: 'Radès', establishedYear: 2001, totalStudents: 3100, totalStaff: 190, accreditationStatus: [], isActive: true },
  { id: 'inst-12', name: 'Faculté de Droit et des Sciences Politiques de Tunis', code: 'FDSPT', type: 'Faculté', city: 'Tunis', establishedYear: 1960, totalStudents: 4800, totalStaff: 280, accreditationStatus: [], isActive: true },
  { id: 'inst-13', name: 'Institut de Presse et des Sciences de l\'Information', code: 'IPSI', type: 'Institut', city: 'Tunis', establishedYear: 1967, totalStudents: 1600, totalStaff: 90, accreditationStatus: [], isActive: true },
  { id: 'inst-14', name: 'École Nationale d\'Architecture et d\'Urbanisme', code: 'ENAU', type: 'École', city: 'Tunis', establishedYear: 1994, totalStudents: 1100, totalStaff: 85, accreditationStatus: [], isActive: true },
  { id: 'inst-15', name: 'Institut Supérieur des Beaux-Arts de Tunis', code: 'ISBAT', type: 'Institut', city: 'Tunis', establishedYear: 1923, totalStudents: 1400, totalStaff: 95, accreditationStatus: [], isActive: true },
  { id: 'inst-16', name: 'Faculté de Médecine de Tunis', code: 'FMT', type: 'Faculté', city: 'Tunis', establishedYear: 1964, totalStudents: 3800, totalStaff: 650, accreditationStatus: ['ISO 9001'], isActive: true },
  { id: 'inst-17', name: 'Faculté de Pharmacie de Monastir', code: 'FPM', type: 'Faculté', city: 'Monastir', establishedYear: 1975, totalStudents: 1800, totalStaff: 200, accreditationStatus: ['ISO 9001'], isActive: true },
  { id: 'inst-18', name: 'Institut Supérieur des Langues de Tunis', code: 'ISLT', type: 'Institut', city: 'Tunis', establishedYear: 1988, totalStudents: 2500, totalStaff: 150, accreditationStatus: [], isActive: true },
  { id: 'inst-19', name: 'École Nationale Supérieure de Chimie de Tunis', code: 'ENSCT', type: 'École', city: 'Tunis', establishedYear: 2010, totalStudents: 800, totalStaff: 70, accreditationStatus: ['CTI'], isActive: true },
  { id: 'inst-20', name: 'Institut Supérieur de l\'Animation Culturelle et de la Jeunesse', code: 'ISACJ', type: 'Institut', city: 'Bizerte', establishedYear: 1990, totalStudents: 900, totalStaff: 60, accreditationStatus: [], isActive: true },
  { id: 'inst-21', name: 'Institut Supérieur des Arts et Métiers de Tunis', code: 'ISAMT', type: 'Institut', city: 'Tunis', establishedYear: 2005, totalStudents: 1200, totalStaff: 80, accreditationStatus: [], isActive: true },
  { id: 'inst-22', name: 'Institut Supérieur des Transports et de la Logistique', code: 'ISTL', type: 'Institut', city: 'Sousse', establishedYear: 2008, totalStudents: 1500, totalStaff: 100, accreditationStatus: [], isActive: true },
  { id: 'inst-23', name: 'Faculté des Sciences de Bizerte', code: 'FSB', type: 'Faculté', city: 'Bizerte', establishedYear: 1990, totalStudents: 3200, totalStaff: 220, accreditationStatus: [], isActive: true },
  { id: 'inst-24', name: 'Institut Supérieur d\'Informatique et des Technologies de Communication', code: 'ISITCOM', type: 'Institut', city: 'Hammam Sousse', establishedYear: 2005, totalStudents: 1800, totalStaff: 110, accreditationStatus: [], isActive: true },
  { id: 'inst-25', name: 'École Nationale Supérieure d\'Horticulture et d\'Aménagement du Paysage', code: 'ENSHAP', type: 'École', city: 'Chott Mariem', establishedYear: 2009, totalStudents: 700, totalStaff: 55, accreditationStatus: [], isActive: true },
  { id: 'inst-26', name: 'Institut Supérieur des Sciences Infirmières de Tunis', code: 'ISSIT', type: 'Institut', city: 'Tunis', establishedYear: 1994, totalStudents: 2200, totalStaff: 160, accreditationStatus: [], isActive: true },
  { id: 'inst-27', name: 'Institut Supérieur des Technologies de l\'Environnement', code: 'ISTE', type: 'Institut', city: 'Borj Cédria', establishedYear: 2007, totalStudents: 600, totalStaff: 45, accreditationStatus: ['ISO 14001'], isActive: true },
  { id: 'inst-28', name: 'Faculté des Sciences Juridiques Politiques et Sociales de Tunis', code: 'FSJPST', type: 'Faculté', city: 'Tunis', establishedYear: 1987, totalStudents: 4200, totalStaff: 250, accreditationStatus: [], isActive: true },
  { id: 'inst-29', name: 'Institut Supérieur d\'Éducation et de Formation Continue', code: 'ISEFC', type: 'Institut', city: 'Tunis', establishedYear: 1999, totalStudents: 1300, totalStaff: 85, accreditationStatus: [], isActive: true },
  { id: 'inst-30', name: 'Institut Supérieur des Études Supérieures Artistiques', code: 'ISESA', type: 'Institut', city: 'Tunis', establishedYear: 2000, totalStudents: 800, totalStaff: 55, accreditationStatus: [], isActive: true },
  { id: 'inst-31', name: 'École Nationale Supérieure de Géologie', code: 'ENSG', type: 'École', city: 'Bizerte', establishedYear: 2012, totalStudents: 500, totalStaff: 45, accreditationStatus: [], isActive: true },
  { id: 'inst-32', name: 'Institut Supérieur des Technologies Médicales', code: 'ISTM', type: 'Institut', city: 'Tunis', establishedYear: 2003, totalStudents: 1700, totalStaff: 130, accreditationStatus: [], isActive: true },
  { id: 'inst-33', name: 'Institut Supérieur des Sciences Biologiques Appliquées de Tunis', code: 'ISSBAT', type: 'Institut', city: 'Tunis', establishedYear: 2004, totalStudents: 1500, totalStaff: 100, accreditationStatus: [], isActive: true },
  { id: 'inst-34', name: 'Faculté des Sciences Humaines et Sociales de Tunis', code: 'FSHST', type: 'Faculté', city: 'Tunis', establishedYear: 1988, totalStudents: 4600, totalStaff: 290, accreditationStatus: [], isActive: true },
  { id: 'inst-35', name: 'École Supérieure de l\'Économie Numérique', code: 'ESEN', type: 'École', city: 'Manouba', establishedYear: 2015, totalStudents: 1200, totalStaff: 75, accreditationStatus: [], isActive: true },
]

function rand(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min))
}

function randFloat(min: number, max: number, decimals = 1): number {
  return parseFloat((min + Math.random() * (max - min)).toFixed(decimals))
}

function pickTrend(improving = true): 'up' | 'down' | 'stable' {
  const r = Math.random()
  if (r < 0.4) return improving ? 'up' : 'down'
  if (r < 0.75) return improving ? 'down' : 'up'
  return 'stable'
}

export function generateKPIs(): KPIValue[] {
  const kpis: KPIValue[] = []
  const kpiDefs = [
    { slug: 'success_rate', name: 'Taux de Réussite', cat: 'academic', unit: '%', targetRange: [75, 92], improving: true },
    { slug: 'dropout_rate', name: "Taux d'Abandon", cat: 'academic', unit: '%', targetRange: [5, 20], improving: false },
    { slug: 'attendance_rate', name: "Taux d'Assiduité", cat: 'academic', unit: '%', targetRange: [70, 95], improving: true },
    { slug: 'staff_ratio', name: 'Ratio Encadrement', cat: 'academic', unit: '/1', targetRange: [8, 20], improving: true },
    { slug: 'budget_execution', name: "Exécution Budgétaire", cat: 'finance', unit: '%', targetRange: [60, 98], improving: true },
    { slug: 'cost_per_student', name: 'Coût par Étudiant', cat: 'finance', unit: 'TND', targetRange: [3000, 15000], improving: false },
    { slug: 'staff_stability', name: 'Stabilité des Effectifs', cat: 'hr', unit: '%', targetRange: [75, 95], improving: true },
    { slug: 'absenteeism_rate', name: "Taux d'Absentéisme", cat: 'hr', unit: '%', targetRange: [3, 12], improving: false },
    { slug: 'training_completion', name: 'Formation Continue', cat: 'hr', unit: '%', targetRange: [40, 80], improving: true },
    { slug: 'publications_count', name: 'Publications Scopus', cat: 'research', unit: '', targetRange: [30, 450], improving: true },
    { slug: 'citation_impact', name: 'FWCI', cat: 'research', unit: '', targetRange: [0.5, 1.8], improving: true },
    { slug: 'research_funding', name: 'Financement Recherche', cat: 'research', unit: 'TND', targetRange: [200000, 2000000], improving: true },
    { slug: 'classroom_occupancy', name: "Occupation des Salles", cat: 'infrastructure', unit: '%', targetRange: [55, 85], improving: true },
    { slug: 'equipment_availability', name: 'Disponibilité Équipements', cat: 'infrastructure', unit: '%', targetRange: [70, 95], improving: true },
    { slug: 'employability_rate', name: "Taux d'Employabilité", cat: 'employment', unit: '%', targetRange: [40, 80], improving: true },
    { slug: 'active_partnerships', name: 'Partenariats Actifs', cat: 'partnerships', unit: '', targetRange: [10, 55], improving: true },
    { slug: 'mobility_count', name: 'Mobilité Étudiante', cat: 'partnerships', unit: '', targetRange: [10, 120], improving: true },
    { slug: 'green_score', name: 'Score GreenMetric', cat: 'esg', unit: '', targetRange: [3000, 7500], improving: true },
    { slug: 'energy_consumption', name: 'Consommation Énergie', cat: 'esg', unit: 'kWh', targetRange: [500000, 3000000], improving: false },
    { slug: 'recycling_rate', name: 'Taux de Recyclage', cat: 'esg', unit: '%', targetRange: [20, 55], improving: true },
  ]

  for (const inst of institutions) {
    for (const kpi of kpiDefs) {
      const base = kpi.targetRange[0] + Math.random() * (kpi.targetRange[1] - kpi.targetRange[0])
      const value = Math.round(kpi.unit === 'TND' ? base : base)
      const target = kpi.targetRange[1]
      kpis.push({
        institutionId: inst.id,
        kpiSlug: kpi.slug,
        kpiName: kpi.name,
        category: kpi.cat,
        value,
        target: Math.round(target),
        unit: kpi.unit,
        trend: pickTrend(kpi.improving),
        trendValue: randFloat(-8, 8),
        period: '2025-2026',
      })
    }
  }
  return kpis
}

const allKpis = generateKPIs()

export function getKPIsForInstitution(instId: string): KPIValue[] {
  return allKpis.filter(k => k.institutionId === instId)
}

export function getKPIsByCategory(instId: string, cat: string): KPIValue[] {
  return allKpis.filter(k => k.institutionId === instId && k.category === cat)
}

export function getDomainKPIs(instId: string): DomainKPI[] {
  const domains: { slug: DomainSlug; label: string; cats: string[] }[] = [
    { slug: 'academic', label: 'Académique', cats: ['academic'] },
    { slug: 'hr', label: 'Ressources Humaines', cats: ['hr'] },
    { slug: 'finance', label: 'Finance', cats: ['finance'] },
    { slug: 'research', label: 'Recherche', cats: ['research'] },
    { slug: 'infrastructure', label: 'Infrastructure', cats: ['infrastructure'] },
    { slug: 'employment', label: 'Emploi', cats: ['employment'] },
    { slug: 'partnerships', label: 'Partenariats', cats: ['partnerships'] },
    { slug: 'esg', label: 'ESG / Développement Durable', cats: ['esg'] },
  ]

  return domains.map(d => {
    const instKpis = d.cats.flatMap(c => getKPIsByCategory(instId, c))
    const avgScore = instKpis.length > 0
      ? instKpis.reduce((sum, k) => {
          const pct = k.target > 0 ? (k.value / k.target) * 100 : 50
          return sum + Math.min(pct, 100)
        }, 0) / instKpis.length
      : rand(50, 90)
    return {
      domain: d.slug,
      domainLabel: d.label,
      score: Math.round(avgScore),
      target: 90,
      status: avgScore >= 85 ? 'ok' : avgScore >= 65 ? 'warning' : 'critical',
      kpis: instKpis.map(k => ({
        name: k.kpiName,
        value: k.value,
        target: k.target,
        unit: k.unit,
      })),
    }
  })
}

export const alerts: AnomalyAlert[] = [
  {
    id: 'alert-1', institutionId: 'inst-03', institutionName: 'FST', domain: 'academic',
    severity: 'critical', title: "Hausse anormale du taux d'abandon",
    description: "Le taux d'abandon à la FST a augmenté de +2.3σ ce semestre. Cause principale: les résultats aux examens ont chuté de 18% en Mathématiques fondamentales.",
    shapFactors: [
      { name: 'Résultats aux examens', contribution: 62 },
      { name: "Taux d'assiduité", contribution: 28 },
      { name: 'Ratio encadrement', contribution: 10 },
    ],
    timestamp: new Date(Date.now() - 7200000).toISOString(), status: 'pending',
  },
  {
    id: 'alert-2', institutionId: 'inst-04', institutionName: 'ISG', domain: 'finance',
    severity: 'warning', title: "Exécution budgétaire insuffisante",
    description: "L'ISG n'a consommé que 45% de son budget alloué à mi-exercice. Des fonds risquent d'être perdus si la tendance se maintient.",
    shapFactors: [
      { name: 'Retards de recrutement', contribution: 45 },
      { name: 'Projets reportés', contribution: 35 },
      { name: 'Sous-utilisation des subventions', contribution: 20 },
    ],
    timestamp: new Date(Date.now() - 14400000).toISOString(), status: 'acknowledged',
  },
  {
    id: 'alert-3', institutionId: 'inst-09', institutionName: 'FSEGT', domain: 'esg',
    severity: 'critical', title: "Émissions de CO2 dépassent le seuil critique",
    description: "Les émissions de CO2 ont augmenté de 15% par rapport à l'année dernière. La consommation énergétique est 2x la moyenne UCAR.",
    shapFactors: [
      { name: 'Climatisation intensive', contribution: 55 },
      { name: 'Parc automobile vieillissant', contribution: 25 },
      { name: 'Absence de panneaux solaires', contribution: 20 },
    ],
    timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'pending',
  },
  {
    id: 'alert-4', institutionId: 'inst-06', institutionName: 'INSAT', domain: 'research',
    severity: 'info', title: "Baisse de productivité scientifique",
    description: "Le nombre de publications Scopus est en baisse de 12% cette année. Plusieurs laboratoires n'ont pas soumis de articles ce trimestre.",
    shapFactors: [
      { name: 'Départs de chercheurs', contribution: 45 },
      { name: 'Retards de financement', contribution: 30 },
      { name: 'Charges administratives élevées', contribution: 25 },
    ],
    timestamp: new Date(Date.now() - 86400000).toISOString(), status: 'investigating',
  },
  {
    id: 'alert-5', institutionId: 'inst-16', institutionName: 'FMT', domain: 'infrastructure',
    severity: 'warning', title: "Disponibilité des équipements critique",
    description: "3 salles de TP sont hors-service à la Faculté de Médecine. 40% des équipements biomédicaux nécessitent une maintenance urgente.",
    shapFactors: [
      { name: 'Équipements obsolètes', contribution: 50 },
      { name: 'Maintenance différée', contribution: 30 },
      { name: 'Budget d\'investissement insuffisant', contribution: 20 },
    ],
    timestamp: new Date(Date.now() - 36000000).toISOString(), status: 'pending',
  },
  {
    id: 'alert-6', institutionId: 'inst-02', institutionName: 'ENICarthage', domain: 'partnerships',
    severity: 'info', title: 'Mobilité Erasmus+ en baisse',
    description: "Le nombre d'étudiants partant en mobilité Erasmus+ a diminué de 22%. Les accords de partenariat avec l'UE arrivent à expiration.",
    shapFactors: [
      { name: "Accords arrivant à terme", contribution: 60 },
      { name: "Barrière linguistique", contribution: 25 },
      { name: "Procédures administratives lourdes", contribution: 15 },
    ],
    timestamp: new Date(Date.now() - 172800000).toISOString(), status: 'pending',
  },
  {
    id: 'alert-7', institutionId: 'inst-14', institutionName: 'ENAU', domain: 'employment',
    severity: 'warning', title: "Taux d'employabilité en baisse",
    description: "Le taux d'employabilité à 6 mois des diplômés ENAU est passé de 72% à 58%. Le secteur de l'architecture ralentit au niveau national.",
    shapFactors: [
      { name: 'Ralentissement du secteur BTP', contribution: 50 },
      { name: 'Concurrence accrue', contribution: 30 },
      { name: 'Formation non alignée au marché', contribution: 20 },
    ],
    timestamp: new Date(Date.now() - 259200000).toISOString(), status: 'pending',
  },
  {
    id: 'alert-8', institutionId: 'inst-27', institutionName: 'ISTE', domain: 'esg',
    severity: 'info', title: 'Bonnes pratiques ESG exemplaires',
    description: "L'ISTE Borj Cédria a atteint 92% de son objectif de recyclage. Le campus est un modèle pour les autres institutions UCAR en matière de gestion des déchets.",
    shapFactors: [
      { name: 'Programme de tri sélectif', contribution: 50 },
      { name: 'Sensibilisation étudiante', contribution: 30 },
      { name: 'Partenariat avec des recycleurs', contribution: 20 },
    ],
    timestamp: new Date(Date.now() - 43200000).toISOString(), status: 'false_positive',
  },
]

export function getInstitutionsForRole(role: string): Institution[] {
  if (role === 'student') return institutions.slice(0, 1)
  return institutions
}

export function getGreenMetricData(instId: string): GreenMetricEntry {
  const base = instId === 'inst-27' ? 7500 : rand(3500, 7200)
  return {
    institutionId: instId,
    year: 2025,
    totalScore: base,
    maxScore: 10000,
    criteria: {
      settingInfrastructure: { score: rand(400, 1300), max: 1500 },
      energyClimate: { score: rand(800, 1800), max: 2100 },
      waste: { score: rand(600, 1500), max: 1800 },
      water: { score: rand(300, 900), max: 1000 },
      transportation: { score: rand(300, 800), max: 1000 },
      education: { score: rand(500, 1300), max: 1500 },
      governance: { score: rand(100, 400), max: 500 },
    },
  }
}

export function getRankings(instId: string): RankingData[] {
  return [
    { institutionId: instId, rankingSystem: 'THE World University Rankings', rank: '1201-1500', year: 2025, score: rand(25, 45) },
    { institutionId: instId, rankingSystem: 'QS World University Rankings', rank: '1401-1600', year: 2025, score: rand(20, 35) },
    { institutionId: instId, rankingSystem: 'UI GreenMetric', rank: '350-500', year: 2025, score: rand(5000, 7500) },
    { institutionId: instId, rankingSystem: 'THE Impact Rankings', rank: '601-800', year: 2025, score: rand(45, 65) },
  ]
}

export function getResearchAffiliation(): { total: number; affiliated: number; unaffiliated: number; riskInstitutions: { id: string; name: string; unaffiliated: number; phdStudents: number }[] } {
  return {
    total: 440,
    affiliated: 342,
    unaffiliated: 98,
    riskInstitutions: [
      { id: 'inst-03', name: 'FST', unaffiliated: 45, phdStudents: 23 },
      { id: 'inst-04', name: 'ISG', unaffiliated: 32, phdStudents: 18 },
      { id: 'inst-09', name: 'FSEGT', unaffiliated: 28, phdStudents: 14 },
      { id: 'inst-16', name: 'FMT', unaffiliated: 52, phdStudents: 35 },
      { id: 'inst-34', name: 'FSHST', unaffiliated: 22, phdStudents: 11 },
    ],
  }
}

export function getISOCompliance(): { name: string; progress: number; items: { label: string; status: 'done' | 'pending' | 'overdue' }[] }[] {
  return [
    {
      name: 'ISO 21001:2018', progress: 78,
      items: [
        { label: 'Politique qualité documentée', status: 'done' },
        { label: "Analyse des parties intéressées", status: 'done' },
        { label: 'Objectifs qualité mesurables', status: 'pending' },
        { label: 'Audit interne planifié', status: 'pending' },
        { label: 'Revue de direction', status: 'pending' },
        { label: 'Maîtrise des processus', status: 'done' },
        { label: 'Gestion des risques', status: 'done' },
      ],
    },
    {
      name: 'ISO 14001:2015', progress: 45,
      items: [
        { label: 'Politique environnementale', status: 'done' },
        { label: 'Aspects environnementaux', status: 'done' },
        { label: "Objectifs environnementaux", status: 'pending' },
        { label: 'Plan d\'urgence', status: 'pending' },
        { label: 'Conformité légale', status: 'pending' },
      ],
    },
    {
      name: 'ISO 9001:2015', progress: 92,
      items: [
        { label: 'Système de management qualité', status: 'done' },
        { label: 'Responsabilité de la direction', status: 'done' },
        { label: 'Gestion des ressources', status: 'done' },
        { label: 'Réalisation du service', status: 'done' },
        { label: 'Mesure et amélioration', status: 'done' },
      ],
    },
  ]
}

export function generateChartData(points: number, base: number, variance: number): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = []
  let val = base
  const now = new Date()
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    val += randFloat(-variance, variance)
    val = Math.max(val, base * 0.5)
    data.push({
      date: d.toISOString().slice(0, 7),
      value: Math.round(val),
    })
  }
  return data
}

export function getNationalAverages(): { slug: string; name: string; ucar: number; national: number; target: number }[] {
  return [
    { slug: 'success_rate', name: 'Taux de Réussite', ucar: 76.3, national: 72.1, target: 85 },
    { slug: 'dropout_rate', name: "Taux d'Abandon", ucar: 14.2, national: 17.8, target: 8 },
    { slug: 'budget_execution', name: "Exécution Budgétaire", ucar: 71.5, national: 68.2, target: 90 },
    { slug: 'publications_count', name: 'Publications (moy./inst)', ucar: 185, national: 210, target: 350 },
    { slug: 'green_score', name: 'Score GreenMetric', ucar: 6200, national: 5800, target: 8000 },
    { slug: 'employability_rate', name: "Employabilité", ucar: 58.4, national: 55.1, target: 75 },
  ]
}

export function getResearchProjects(): ResearchProject[] {
  return [
    { id: 'proj-1', title: 'Plateforme IA pour la Gestion des Déchets Intelligents', institutionId: 'inst-02', leadResearcher: 'Pr. Mohamed Ben Ali', fundingAmount: 450000, fundingSource: 'PRF', status: 'En cours', startDate: '2024-01-01', endDate: '2026-12-31' },
    { id: 'proj-2', title: 'Transition Énergétique des Campus Universitaires', institutionId: 'inst-27', leadResearcher: 'Dr. Sarra Khelifi', fundingAmount: 320000, fundingSource: 'UE H2020', status: 'En cours', startDate: '2024-03-15', endDate: '2027-03-14' },
    { id: 'proj-3', title: 'Observatoire de l\'Employabilité des Diplômés', institutionId: 'inst-04', leadResearcher: 'Pr. Hichem Gharbi', fundingAmount: 180000, fundingSource: 'Banque Mondiale', status: 'En cours', startDate: '2024-06-01', endDate: '2025-12-31' },
    { id: 'proj-4', title: 'Smart Agriculture et IoT en Milieu Aride', institutionId: 'inst-25', leadResearcher: 'Dr. Amel Mansouri', fundingAmount: 550000, fundingSource: 'PRF', status: 'En cours', startDate: '2023-09-01', endDate: '2026-08-31' },
    { id: 'proj-5', title: 'Traitement Automatisé de la Langue Arabe pour l\'Éducation', institutionId: 'inst-18', leadResearcher: 'Pr. Khaled Ben Slimane', fundingAmount: 280000, fundingSource: 'ANPR', status: 'Terminé', startDate: '2021-01-01', endDate: '2024-12-31' },
    { id: 'proj-6', title: 'Évaluation de la Qualité de l\'Air dans le Grand Tunis', institutionId: 'inst-35', leadResearcher: 'Dr. Nadia Bouazizi', fundingAmount: 150000, fundingSource: 'Ministère', status: 'Soumis', startDate: '2025-09-01' },
    { id: 'proj-7', title: 'Blockchain pour la Traçabilité des Diplômes', institutionId: 'inst-05', leadResearcher: 'Pr. Sami Toumi', fundingAmount: 380000, fundingSource: 'UE H2020', status: 'En cours', startDate: '2024-04-01', endDate: '2027-03-31' },
  ]
}

export const domainLabels: Record<string, string> = {
  academic: 'Académique', hr: 'Ressources Humaines', finance: 'Finance', research: 'Recherche',
  infrastructure: 'Infrastructure', employment: 'Emploi', partnerships: 'Partenariats', esg: 'ESG',
}

export function generateEnrollmentTrend(): { date: string; value: number }[] {
  return [
    { date: '2020', value: 78000 }, { date: '2021', value: 79500 }, { date: '2022', value: 81200 },
    { date: '2023', value: 83500 }, { date: '2024', value: 85200 }, { date: '2025', value: 86800 },
  ]
}

export function generateBudgetData(): { category: string; allocated: number; consumed: number }[] {
  return [
    { category: 'Salaires', allocated: 180000000, consumed: 175000000 },
    { category: 'Équipement', allocated: 45000000, consumed: 32000000 },
    { category: 'Infrastructure', allocated: 35000000, consumed: 22000000 },
    { category: 'Recherche', allocated: 28000000, consumed: 18000000 },
    { category: 'Numérique', allocated: 15000000, consumed: 12000000 },
    { category: 'Formation', allocated: 8000000, consumed: 5500000 },
    { category: 'Événements', allocated: 5000000, consumed: 3500000 },
  ]
}

export const allInstitutions = institutions
export const allAlerts = alerts
export const allKpisData = allKpis
