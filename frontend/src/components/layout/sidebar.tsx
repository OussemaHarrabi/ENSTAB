"use client"

import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { BarChart3, BookOpen, Building2, ChevronLeft, ChevronRight, CreditCard, GraduationCap, Home, LineChart, Megaphone, Network, ShieldAlert, TreePine, Users, Wallet, Wrench, MessageSquare, FileText, Settings, UserCog, FileSearch } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { RoleSlug, MenuItem } from "@/lib/types"

const roleMenus: Record<RoleSlug, MenuItem[]> = {
  hq_super_admin: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/hq' },
    { label: 'Institutions', icon: 'Building2', href: '/hq/institutions' },
    { label: 'Benchmarks', icon: 'BarChart3', href: '/hq/benchmarks' },
    { label: 'Anomalies', icon: 'ShieldAlert', href: '/hq/anomalies', badge: 5 },
    { label: 'GreenMetric', icon: 'TreePine', href: '/hq/greenmetric' },
    { label: "Affiliations Recherche", icon: 'BookOpen', href: '/hq/research-affiliation' },
    { label: 'Conformité ISO', icon: 'ShieldAlert', href: '/hq/iso-compliance' },
    { label: 'KPI Définitions', icon: 'LineChart', href: '/hq/kpi-definitions' },
    { label: 'Rapports', icon: 'FileText', href: '/hq/reports' },
    { label: 'Utilisateurs', icon: 'Users', href: '/hq/users' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/hq/chat' },
  ],
  hq_dept_head: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/hq-domain/academic' },
    { label: 'Benchmarks', icon: 'BarChart3', href: '/hq-domain/academic/benchmarks' },
    { label: 'Anomalies', icon: 'ShieldAlert', href: '/hq-domain/academic/anomalies' },
    { label: 'Formules KPI', icon: 'LineChart', href: '/hq-domain/academic/formulas' },
    { label: 'Rapports', icon: 'FileText', href: '/hq-domain/academic/reports' },
    { label: 'Conformité', icon: 'ShieldAlert', href: '/hq-domain/academic/compliance' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/hq-domain/academic/chat' },
  ],
  hq_staff: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/hq-staff/academic' },
    { label: 'Rapports', icon: 'FileText', href: '/hq-staff/academic/reports' },
    { label: 'Qualité des Données', icon: 'LineChart', href: '/hq-staff/academic/data-quality' },
    { label: 'Réunions', icon: 'Users', href: '/hq-staff/academic/meetings' },
    { label: 'Documents', icon: 'FileText', href: '/hq-staff/academic/documents' },
  ],
  inst_admin: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/institution' },
    { label: 'Domaines', icon: 'BarChart3', href: '/institution/domains/academic' },
    { label: 'Approbations', icon: 'CreditCard', href: '/institution/approvals' },
    { label: 'Utilisateurs', icon: 'Users', href: '/institution/users' },
    { label: 'Rapports', icon: 'FileText', href: '/institution/reports' },
    { label: 'Prévisions', icon: 'LineChart', href: '/institution/forecasts' },
    { label: 'Sync Blueprint', icon: 'ShieldAlert', href: '/institution/blueprint-sync' },
    { label: 'Anomalies', icon: 'ShieldAlert', href: '/institution/anomalies' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/institution/chat' },
  ],
  inst_dept_head: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/inst-dept/academic' },
    { label: 'Ingestion', icon: 'FileText', href: '/inst-dept/academic/ingestion' },
    { label: 'Qualité', icon: 'LineChart', href: '/inst-dept/academic/data-quality' },
    { label: 'Validations', icon: 'CreditCard', href: '/inst-dept/academic/data-commits' },
    { label: 'Anomalies', icon: 'ShieldAlert', href: '/inst-dept/academic/anomalies' },
    { label: 'Rapports', icon: 'FileText', href: '/inst-dept/academic/reports' },
    { label: 'Chat IA', icon: 'MessageSquare', href: '/inst-dept/academic/chat' },
  ],
  inst_staff: [
    { label: 'Tableau de Bord', icon: 'Home', href: '/inst-staff/academic' },
    { label: 'Saisie', icon: 'FileText', href: '/inst-staff/academic/data-entry' },
    { label: 'Statut', icon: 'LineChart', href: '/inst-staff/academic/status' },
    { label: 'Tâches', icon: 'Users', href: '/inst-staff/academic/tasks' },
    { label: 'Incidents', icon: 'ShieldAlert', href: '/inst-staff/academic/incidents' },
  ],
  teacher: [
    { label: 'Mes Cours', icon: 'Home', href: '/teacher' },
    { label: 'Présences', icon: 'Users', href: '/teacher/attendance' },
    { label: 'Notes', icon: 'BookOpen', href: '/teacher/grades' },
    { label: 'Programme', icon: 'FileText', href: '/teacher/syllabus' },
    { label: 'Recherche', icon: 'BookOpen', href: '/teacher/research' },
    { label: 'Heures', icon: 'Wallet', href: '/teacher/hours' },
    { label: 'Salles', icon: 'Building2', href: '/teacher/rooms' },
    { label: 'Analyses', icon: 'BarChart3', href: '/teacher/analytics' },
  ],
  student: [
    { label: 'Mon UCAR', icon: 'Home', href: '/student' },
    { label: 'Notes', icon: 'BookOpen', href: '/student/grades' },
    { label: 'Présences', icon: 'Users', href: '/student/attendance' },
    { label: 'Emploi du Temps', icon: 'Calendar', href: '/student/schedule' },
    { label: 'Feedbacks', icon: 'Megaphone', href: '/student/feedback' },
    { label: 'Carrière', icon: 'GraduationCap', href: '/student/career' },
    { label: 'Mobilité', icon: 'Network', href: '/student/mobility' },
    { label: 'Carbone', icon: 'TreePine', href: '/student/carbon' },
    { label: 'Salles', icon: 'Building2', href: '/student/rooms' },
  ],
}

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home size={18} />, Building2: <Building2 size={18} />, BarChart3: <BarChart3 size={18} />,
  ShieldAlert: <ShieldAlert size={18} />, TreePine: <TreePine size={18} />, BookOpen: <BookOpen size={18} />,
  LineChart: <LineChart size={18} />, FileText: <FileText size={18} />, Users: <Users size={18} />,
  MessageSquare: <MessageSquare size={18} />, CreditCard: <CreditCard size={18} />, Wallet: <Wallet size={18} />,
  Wrench: <Wrench size={18} />, Network: <Network size={18} />, GraduationCap: <GraduationCap size={18} />,
  Megaphone: <Megaphone size={18} />, Settings: <Settings size={18} />, UserCog: <UserCog size={18} />,
  Audit: <FileSearch size={18} />,
}

export function Sidebar() {
  const pathname = usePathname()
  const { currentRole, sidebarCollapsed, toggleSidebar } = useStore()
  const menuItems = roleMenus[currentRole] || []

  return (
    <aside className={cn(
      'h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 sticky top-0',
      sidebarCollapsed ? 'w-16' : 'w-60'
    )}>
      <div className={cn('flex items-center h-16 border-b border-slate-200 px-4', sidebarCollapsed && 'justify-center')}>
        {!sidebarCollapsed && <><div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center mr-3"><span className="text-white font-bold text-sm">UC</span></div><span className="font-semibold text-slate-900 text-sm">UCAR Intelligence</span></>}
        <button onClick={toggleSidebar} className={cn('ml-auto p-1 hover:bg-slate-100 rounded', sidebarCollapsed && 'ml-0')}>
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map(item => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                sidebarCollapsed && 'justify-center px-2'
              )}>
              {iconMap[item.icon]}
              {!sidebarCollapsed && <span className="flex-1">{item.label}</span>}
              {!sidebarCollapsed && item.badge && <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{item.badge}</span>}
            </Link>
          )
        })}
      </nav>
      <div className={cn('border-t border-slate-200 p-4', sidebarCollapsed && 'p-2')}>
        <Link href="/settings" className={cn('flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-50', sidebarCollapsed && 'justify-center')}>
          <Settings size={18} />
          {!sidebarCollapsed && <span>Paramètres</span>}
        </Link>
      </div>
    </aside>
  )
}
