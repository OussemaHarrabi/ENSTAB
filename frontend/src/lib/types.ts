// ============================================================
// UCAR Intelligence Platform — Type Definitions
// 14 roles mapped to real UCAR organizational chart
// ============================================================

// --- Role System ---

export type RoleSlug =
  | 'president'
  | 'svc_secretaire'
  | 'svc_rh'
  | 'svc_enseignement'
  | 'svc_bibliotheque'
  | 'svc_finances'
  | 'svc_equipement'
  | 'svc_informatique'
  | 'svc_budget'
  | 'svc_juridique'
  | 'svc_academique'
  | 'svc_recherche'
  | 'teacher'
  | 'student'

export type DomainSlug = 'academic' | 'hr' | 'finance' | 'research' | 'infrastructure' | 'employment' | 'partnerships' | 'esg'

export const ROLE_LABELS: Record<RoleSlug, string> = {
  president: 'Présidence',
  svc_secretaire: 'Secrétariat Général',
  svc_rh: 'Service Ressources Humaines',
  svc_enseignement: 'Service Personnel Enseignant',
  svc_bibliotheque: 'Service Bibliothèque',
  svc_finances: 'Service Affaires Financières',
  svc_equipement: 'Service Équipement & Bâtiments',
  svc_informatique: 'Service Informatique',
  svc_budget: 'Service Budget',
  svc_juridique: 'Service Affaires Juridiques',
  svc_academique: 'Service Affaires Académiques',
  svc_recherche: 'Service Recherche & Coopération',
  teacher: 'Enseignant',
  student: 'Étudiant',
}

export const ROLE_SHORT_LABELS: Record<RoleSlug, string> = {
  president: 'Présidence',
  svc_secretaire: 'Sec. Génér.',
  svc_rh: 'RH',
  svc_enseignement: 'Ens. Sup.',
  svc_bibliotheque: 'Bibliothèque',
  svc_finances: 'Finances',
  svc_equipement: 'Équipement',
  svc_informatique: 'Informatique',
  svc_budget: 'Budget',
  svc_juridique: 'Juridique',
  svc_academique: 'Académique',
  svc_recherche: 'Recherche',
  teacher: 'Enseignant',
  student: 'Étudiant',
}

export const ROLE_LEVELS: Record<RoleSlug, number> = {
  president: 0,
  svc_secretaire: 1,
  svc_rh: 2,
  svc_enseignement: 2,
  svc_bibliotheque: 2,
  svc_finances: 2,
  svc_equipement: 2,
  svc_informatique: 2,
  svc_budget: 2,
  svc_juridique: 2,
  svc_academique: 2,
  svc_recherche: 2,
  teacher: 3,
  student: 4,
}

export const ROLE_ACCENT_COLORS: Record<RoleSlug, string> = {
  president: '#1E3A5F',
  svc_secretaire: '#4A5568',
  svc_rh: '#0D9488',
  svc_enseignement: '#7C3AED',
  svc_bibliotheque: '#B45309',
  svc_finances: '#059669',
  svc_equipement: '#D97706',
  svc_informatique: '#2563EB',
  svc_budget: '#0891B2',
  svc_juridique: '#991B1B',
  svc_academique: '#4F46E5',
  svc_recherche: '#9333EA',
  teacher: '#0369A1',
  student: '#16A34A',
}

export const ROLE_ROUTE_PREFIX: Record<RoleSlug, string> = {
  president: '/president',
  svc_secretaire: '/sg',
  svc_rh: '/rh',
  svc_enseignement: '/enseignement',
  svc_bibliotheque: '/bibliotheque',
  svc_finances: '/finances',
  svc_equipement: '/equipement',
  svc_informatique: '/informatique',
  svc_budget: '/budget',
  svc_juridique: '/juridique',
  svc_academique: '/academique',
  svc_recherche: '/recherche',
  teacher: '/teacher',
  student: '/student',
}

export const ROLE_ICONS: Record<RoleSlug, string> = {
  president: 'Crown',
  svc_secretaire: 'FileText',
  svc_rh: 'Users',
  svc_enseignement: 'GraduationCap',
  svc_bibliotheque: 'BookOpen',
  svc_finances: 'Wallet',
  svc_equipement: 'Wrench',
  svc_informatique: 'Monitor',
  svc_budget: 'Calculator',
  svc_juridique: 'Scale',
  svc_academique: 'School',
  svc_recherche: 'FlaskConical',
  teacher: 'BookMarked',
  student: 'User',
}

/** Roles that a given role can assign to new users */
export const ASSIGNABLE_ROLES: Record<RoleSlug, RoleSlug[]> = {
  president: ['svc_secretaire', 'svc_rh', 'svc_enseignement', 'svc_bibliotheque', 'svc_finances', 'svc_equipement', 'svc_informatique', 'svc_budget', 'svc_juridique', 'svc_academique', 'svc_recherche'],
  svc_secretaire: [],
  svc_rh: [],
  svc_enseignement: ['teacher', 'student'],
  svc_bibliotheque: ['teacher', 'student'],
  svc_finances: [],
  svc_equipement: [],
  svc_informatique: [],
  svc_budget: [],
  svc_juridique: [],
  svc_academique: ['teacher', 'student'],
  svc_recherche: ['teacher', 'student'],
  teacher: [],
  student: [],
}

/** Domain relevant to each service role */
export const SERVICE_DOMAINS: Partial<Record<RoleSlug, DomainSlug>> = {
  svc_rh: 'hr',
  svc_enseignement: 'academic',
  svc_bibliotheque: 'academic',
  svc_finances: 'finance',
  svc_equipement: 'infrastructure',
  svc_informatique: 'infrastructure',
  svc_budget: 'finance',
  svc_juridique: 'partnerships',
  svc_academique: 'academic',
  svc_recherche: 'research',
}

// --- User ---

export interface User {
  id: string
  email: string
  password: string
  firstName: string
  lastName: string
  role: RoleSlug
  roleLabel: string
  serviceId: string
  serviceName: string
  level: number
  assignedBy: string
  canAccessInstitutions: string[]
  isActive: boolean
  avatar?: string
  phone?: string
  title?: string
}

// --- Institution ---

export interface Institution {
  id: string
  name: string
  code: string
  type: string
  city: string
  establishedYear: number
  totalStudents: number
  totalStaff: number
  logo?: string
  accreditationStatus: string[]
  isActive: boolean
}

// --- KPIs ---

export interface KPIValue {
  institutionId: string
  kpiSlug: string
  kpiName: string
  category: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  period: string
}

export interface DomainKPI {
  domain: DomainSlug
  domainLabel: string
  score: number
  target: number
  status: 'ok' | 'warning' | 'critical'
  kpis: { name: string; value: number; target: number; unit: string }[]
}

// --- Alerts ---

export interface AnomalyAlert {
  id: string
  institutionId: string
  institutionName: string
  domain: DomainSlug
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  shapFactors: { name: string; contribution: number }[]
  timestamp: string
  status: 'pending' | 'acknowledged' | 'investigating' | 'false_positive'
}

// --- Research ---

export interface Publication {
  id: string
  title: string
  doi: string
  journal: string
  year: number
  authors: string[]
  institutionId: string
  isUcarAffiliated: boolean
  citations: number
  fwci: number
  sdgMapped: string[]
}

export interface GreenMetricEntry {
  institutionId: string
  year: number
  totalScore: number
  maxScore: number
  criteria: {
    settingInfrastructure: { score: number; max: number }
    energyClimate: { score: number; max: number }
    waste: { score: number; max: number }
    water: { score: number; max: number }
    transportation: { score: number; max: number }
    education: { score: number; max: number }
    governance: { score: number; max: number }
  }
}

export interface RankingData {
  institutionId: string
  rankingSystem: string
  rank: string
  year: number
  score: number
}

export interface ResearchProject {
  id: string
  title: string
  institutionId: string
  leadResearcher: string
  fundingAmount: number
  fundingSource: string
  status: string
  startDate: string
  endDate?: string
}

// --- Charts ---

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

// --- Navigation ---

export interface MenuItem {
  label: string
  icon: string
  href: string
  badge?: number
  children?: { label: string; href: string }[]
}