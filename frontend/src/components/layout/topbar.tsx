"use client"

import { useStore } from "@/lib/store"
import { Avatar, Badge } from "@/components/ui"
import { Bell, Search, LogOut } from "lucide-react"
import Link from "next/link"
import type { RoleSlug } from "@/lib/types"

const roleOptions: { slug: RoleSlug; label: string }[] = [
  { slug: 'hq_super_admin', label: 'Super Admin UCAR' },
  { slug: 'hq_dept_head', label: 'Chef Dept. Académique (UCAR)' },
  { slug: 'hq_staff', label: 'Staff UCAR - Académique' },
  { slug: 'inst_admin', label: 'Directeur ENSI' },
  { slug: 'inst_dept_head', label: 'Chef Dept. Académique (ENSI)' },
  { slug: 'inst_staff', label: 'Staff ENSI - Académique' },
  { slug: 'teacher', label: 'Enseignant - ENSI' },
  { slug: 'student', label: 'Étudiant - ENSI' },
]

export function TopBar() {
  const { currentUser, currentRole, setRole } = useStore()

  const userLabel = roleOptions.find(r => r.slug === currentRole)?.label || currentUser?.firstName

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Rechercher..." className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-slate-100 rounded-lg">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <select
          value={currentRole}
          onChange={e => setRole(e.target.value as RoleSlug)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {roleOptions.map(r => <option key={r.slug} value={r.slug}>{r.label}</option>)}
        </select>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <Avatar initials={currentUser?.firstName?.[0] || 'U'} className="w-8 h-8" />
          <div className="text-sm">
            <p className="font-medium text-slate-900">{currentUser?.firstName} {currentUser?.lastName}</p>
            <p className="text-xs text-slate-500">{userLabel}</p>
          </div>
          <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"><LogOut size={16} /></button>
        </div>
      </div>
    </header>
  )
}
