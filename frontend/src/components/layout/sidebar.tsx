"use client"

import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Home, BarChart3, BookOpen, Building2, ChevronLeft, ChevronRight,
  ShieldAlert, TreePine, Users, Wallet, Wrench, MessageSquare, FileText,
  Settings, GraduationCap, Megaphone, Network, LineChart, UserCog, FileSearch,
  Crown, Monitor, Calculator, Scale, School, FlaskConical, BookMarked, User,
  BellRing, GanttChart, ScrollText, Handshake, Activity, BadgeCheck,
  PieChart, TrendingUp, AlertTriangle, ClipboardList, UsersRound,
  CalendarDays, GraduationCap as Cap, Globe, Lightbulb
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { RoleSlug, MenuItem } from "@/lib/types"
import { ROLE_ACCENT_COLORS, ROLE_ICONS, ROLE_SHORT_LABELS, ROLE_LABELS } from "@/lib/types"

// ---- MENU DEFINITIONS PER ROLE ----

const roleMenus: Record<RoleSlug, MenuItem[]> = {
  president: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/president' },
    { label: 'GreenMetric', icon: 'TreePine', href: '/president/greenmetric' },
    { label: 'Classements', icon: 'TrendingUp', href: '/president/rankings' },
    { label: 'Conformité ISO', icon: 'BadgeCheck', href: '/president/compliance' },
    { label: 'Recherche', icon: 'FlaskConical', href: '/president/recherche' },
    { label: 'Anomalies IA', icon: 'ShieldAlert', href: '/president/anomalies', badge: 5 },
    { label: 'Appels d\'Offres', icon: 'ScrollText', href: '/president/appels-offres' },
    { label: 'Institutions', icon: 'Building2', href: '/president/institutions' },
    { label: 'Comparaisons', icon: 'BarChart3', href: '/president/comparaisons' },
    { label: 'Services UCAR', icon: 'Users', href: '/president/services' },
    { label: 'Utilisateurs', icon: 'UserCog', href: '/president/utilisateurs' },
    { label: 'Rapports', icon: 'FileText', href: '/president/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/president/chat' },
  ],
  svc_secretaire: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/sg' },
    { label: 'Courrier', icon: 'ScrollText', href: '/sg/courrier' },
    { label: 'Décisions', icon: 'FileText', href: '/sg/decisions' },
    { label: 'Réunions', icon: 'CalendarDays', href: '/sg/reunions' },
    { label: 'Documents', icon: 'FileText', href: '/sg/documents' },
    { label: 'Rapports', icon: 'FileText', href: '/sg/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/sg/chat' },
  ],
  svc_rh: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/rh' },
    { label: 'Personnel', icon: 'Users', href: '/rh/personnel' },
    { label: 'Recrutement', icon: 'UserCog', href: '/rh/recrutement' },
    { label: 'Congés', icon: 'CalendarDays', href: '/rh/conges' },
    { label: 'Formation', icon: 'GraduationCap', href: '/rh/formation' },
    { label: 'Évaluations', icon: 'ClipboardList', href: '/rh/evaluations' },
    { label: 'Rapports', icon: 'FileText', href: '/rh/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/rh/chat' },
  ],
  svc_enseignement: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/enseignement' },
    { label: 'Enseignants', icon: 'GraduationCap', href: '/enseignement/enseignants' },
    { label: 'Promotions', icon: 'TrendingUp', href: '/enseignement/promotions' },
    { label: 'Charges', icon: 'ClipboardList', href: '/enseignement/charges' },
    { label: 'Heures', icon: 'Activity', href: '/enseignement/heures' },
    { label: 'Recherche', icon: 'BookOpen', href: '/enseignement/recherche' },
    { label: 'Rapports', icon: 'FileText', href: '/enseignement/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/enseignement/chat' },
  ],
  svc_bibliotheque: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/bibliotheque' },
    { label: 'Collections', icon: 'BookOpen', href: '/bibliotheque/collections' },
    { label: 'Prêts', icon: 'Activity', href: '/bibliotheque/prets' },
    { label: 'Numérique', icon: 'Monitor', href: '/bibliotheque/numerique' },
    { label: 'Budget', icon: 'Wallet', href: '/bibliotheque/budget' },
    { label: 'Rapports', icon: 'FileText', href: '/bibliotheque/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/bibliotheque/chat' },
  ],
  svc_finances: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/finances' },
    { label: 'Trésorerie', icon: 'Wallet', href: '/finances/tresorerie' },
    { label: 'Paiements', icon: 'Activity', href: '/finances/paiements' },
    { label: 'Audits', icon: 'FileSearch', href: '/finances/audits' },
    { label: 'Marchés', icon: 'ScrollText', href: '/finances/marches' },
    { label: 'Appels d\'Offres', icon: 'ScrollText', href: '/finances/appels-offres' },
    { label: 'Rapports', icon: 'FileText', href: '/finances/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/finances/chat' },
  ],
  svc_equipement: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/equipement' },
    { label: 'Bâtiments', icon: 'Building2', href: '/equipement/batiments' },
    { label: 'Maintenance', icon: 'Wrench', href: '/equipement/maintenance' },
    { label: 'Équipements', icon: 'Monitor', href: '/equipement/equipements' },
    { label: 'Projets', icon: 'GantChart', href: '/equipement/projets' },
    { label: 'Rapports', icon: 'FileText', href: '/equipement/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/equipement/chat' },
  ],
  svc_informatique: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/informatique' },
    { label: 'Incidents', icon: 'AlertTriangle', href: '/informatique/incidents' },
    { label: 'Systèmes', icon: 'Monitor', href: '/informatique/systemes' },
    { label: 'Sécurité', icon: 'ShieldAlert', href: '/informatique/securite' },
    { label: 'Demandes', icon: 'ClipboardList', href: '/informatique/demandes' },
    { label: 'Rapports', icon: 'FileText', href: '/informatique/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/informatique/chat' },
  ],
  svc_budget: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/budget' },
    { label: 'Allocations', icon: 'Wallet', href: '/budget/allocations' },
    { label: 'Exécution', icon: 'Activity', href: '/budget/execution' },
    { label: 'Prévisions', icon: 'TrendingUp', href: '/budget/previsions' },
    { label: 'Comparaisons', icon: 'BarChart3', href: '/budget/comparaisons' },
    { label: 'Rapports', icon: 'FileText', href: '/budget/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/budget/chat' },
  ],
  svc_juridique: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/juridique' },
    { label: 'Contentieux', icon: 'Scale', href: '/juridique/contentieux' },
    { label: 'Contrats', icon: 'ScrollText', href: '/juridique/contrats' },
    { label: 'Conformité', icon: 'BadgeCheck', href: '/juridique/conformite' },
    { label: 'Avis', icon: 'FileText', href: '/juridique/avis' },
    { label: 'Rapports', icon: 'FileText', href: '/juridique/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/juridique/chat' },
  ],
  svc_academique: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/academique' },
    { label: 'Programmes', icon: 'BookOpen', href: '/academique/programmes' },
    { label: ' inscriptions', icon: 'Users', href: '/academique/inscriptions' },
    { label: 'Réussite', icon: 'TrendingUp', href: '/academique/reussite' },
    { label: 'Calendrier', icon: 'CalendarDays', href: '/academique/calendrier' },
    { label: 'Vie Étudiante', icon: 'Megaphone', href: '/academique/vie-etudiante' },
    { label: 'Comparaisons', icon: 'BarChart3', href: '/academique/comparaisons' },
    { label: 'Rapports', icon: 'FileText', href: '/academique/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/academique/chat' },
  ],
  svc_recherche: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/recherche' },
    { label: 'Publications', icon: 'BookOpen', href: '/recherche/publications' },
    { label: 'Projets', icon: 'FlaskConical', href: '/recherche/projets' },
    { label: 'Coopération', icon: 'Handshake', href: '/recherche/cooperation' },
    { label: 'Doctorants', icon: 'Cap', href: '/recherche/doctorants' },
    { label: 'Classements', icon: 'TrendingUp', href: '/recherche/classements' },
    { label: 'Comparaisons', icon: 'BarChart3', href: '/recherche/comparaisons' },
    { label: 'Rapports', icon: 'FileText', href: '/recherche/rapports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/recherche/chat' },
  ],
  teacher: [
    { label: 'Mes Cours', icon: 'Home', href: '/teacher' },
    { label: 'Présences', icon: 'Users', href: '/teacher/attendance' },
    { label: 'Notes', icon: 'BookOpen', href: '/teacher/grades' },
    { label: 'Programme', icon: 'FileText', href: '/teacher/syllabus' },
    { label: 'Recherche', icon: 'BookOpen', href: '/teacher/research' },
    { label: 'Heures', icon: 'Activity', href: '/teacher/hours' },
    { label: 'Salles', icon: 'Building2', href: '/teacher/rooms' },
    { label: 'Analyses', icon: 'BarChart3', href: '/teacher/analytics' },
  ],
  student: [
    { label: 'Mon UCAR', icon: 'Home', href: '/student' },
    { label: 'Notes', icon: 'BookOpen', href: '/student/grades' },
    { label: 'Présences', icon: 'Users', href: '/student/attendance' },
    { label: 'Emploi du Temps', icon: 'CalendarDays', href: '/student/schedule' },
    { label: 'Feedbacks', icon: 'Megaphone', href: '/student/feedback' },
    { label: 'Carrière', icon: 'GraduationCap', href: '/student/career' },
    { label: 'Mobilité', icon: 'Network', href: '/student/mobility' },
    { label: 'Carbone', icon: 'TreePine', href: '/student/carbon' },
    { label: 'Vie Étudiante', icon: 'UsersRound', href: '/student/campus-life' },
    { label: 'Salles', icon: 'Building2', href: '/student/rooms' },
  ],
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={18} />,
  Building2: <Building2 size={18} />,
  BarChart3: <BarChart3 size={18} />,
  ShieldAlert: <ShieldAlert size={18} />,
  TreePine: <TreePine size={18} />,
  BookOpen: <BookOpen size={18} />,
  LineChart: <LineChart size={18} />,
  FileText: <FileText size={18} />,
  Users: <Users size={18} />,
  MessageSquare: <MessageSquare size={18} />,
  Wallet: <Wallet size={18} />,
  Wrench: <Wrench size={18} />,
  Network: <Network size={18} />,
  GraduationCap: <GraduationCap size={18} />,
  Megaphone: <Megaphone size={18} />,
  Settings: <Settings size={18} />,
  UserCog: <UserCog size={18} />,
  FileSearch: <FileSearch size={18} />,
  Crown: <Crown size={18} />,
  Monitor: <Monitor size={18} />,
  Calculator: <Calculator size={18} />,
  Scale: <Scale size={18} />,
  School: <School size={18} />,
  FlaskConical: <FlaskConical size={18} />,
  BookMarked: <BookMarked size={18} />,
  User: <User size={18} />,
  BellRing: <BellRing size={18} />,
  GanttChart: <GanttChart size={18} />,
  ScrollText: <ScrollText size={18} />,
  Handshake: <Handshake size={18} />,
  Activity: <Activity size={18} />,
  BadgeCheck: <BadgeCheck size={18} />,
  PieChart: <PieChart size={18} />,
  TrendingUp: <TrendingUp size={18} />,
  AlertTriangle: <AlertTriangle size={18} />,
  ClipboardList: <ClipboardList size={18} />,
  UsersRound: <UsersRound size={18} />,
  CalendarDays: <CalendarDays size={18} />,
  Cap: <Cap size={18} />,
  Globe: <Globe size={18} />,
  Lightbulb: <Lightbulb size={18} />,
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { currentRole, sidebarCollapsed, toggleSidebar, currentUser } = useStore()

  // Redirect to login if not authenticated
  if (!currentRole || !currentUser) {
    return null
  }

  const menuItems = roleMenus[currentRole] || []
  const accentColor = ROLE_ACCENT_COLORS[currentRole] || '#1E3A5F'
  const iconName = ROLE_ICONS[currentRole] || 'Home'
  const roleLabel = ROLE_SHORT_LABELS[currentRole] || currentRole

  return (
    <aside className={cn(
      'h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 sticky top-0 shrink-0',
      sidebarCollapsed ? 'w-16' : 'w-60'
    )}>
      {/* Header with brand */}
      <div className={cn(
        'flex items-center h-16 border-b border-slate-200',
        sidebarCollapsed ? 'justify-center px-2' : 'px-4'
      )}>
        {!sidebarCollapsed ? (
          <>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <span className="text-white font-bold text-sm">UC</span>
            </div>
            <div className="min-w-0">
              <span className="font-semibold text-slate-900 text-sm block truncate">UCAR Intelligence</span>
              <span className="text-xs text-slate-400 block truncate" style={{ color: accentColor }}>{roleLabel}</span>
            </div>
          </>
        ) : (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentColor }}>
            <span className="text-white font-bold text-sm">UC</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={cn('p-1 hover:bg-slate-100 rounded transition-colors', sidebarCollapsed ? 'ml-0 mt-2' : 'ml-auto')}
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
                isActive
                  ? 'text-white'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                sidebarCollapsed && 'justify-center px-2'
              )}
              style={isActive ? { backgroundColor: accentColor } : {}}
            >
              {iconMap[item.icon] || <Home size={18} />}
              {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}
              {!sidebarCollapsed && item.badge && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom link */}
      <div className={cn('border-t border-slate-200 p-4', sidebarCollapsed && 'p-2')}>
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50 transition-colors',
            sidebarCollapsed && 'justify-center'
          )}
        >
          <Settings size={18} />
          {!sidebarCollapsed && <span>Paramètres</span>}
        </Link>
      </div>
    </aside>
  )
}
