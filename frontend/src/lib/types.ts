export type RoleSlug = 'hq_super_admin' | 'hq_dept_head' | 'hq_staff' | 'inst_admin' | 'inst_dept_head' | 'inst_staff' | 'teacher' | 'student'

export type DomainSlug = 'academic' | 'hr' | 'finance' | 'research' | 'infrastructure' | 'employment' | 'partnerships' | 'esg'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: RoleSlug
  roleLabel: string
  institutionId: string
  institutionName: string
  departmentId?: string
  departmentName?: string
  domain?: DomainSlug
  avatar?: string
}

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

export interface ChartDataPoint {
  date: string
  value: number
  label?: string
}

export interface MenuItem {
  label: string
  icon: string
  href: string
  badge?: number
  children?: { label: string; href: string }[]
}
