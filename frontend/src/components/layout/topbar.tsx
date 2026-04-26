"use client"

import { useStore } from "@/lib/store"
import { Avatar, Badge } from "@/components/ui"
import { Bell, Search, LogOut, User, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ROLE_ACCENT_COLORS, ROLE_SHORT_LABELS, ROLE_LABELS } from "@/lib/types"

export function TopBar() {
  const { currentUser, currentRole, logout } = useStore()
  const router = useRouter()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  const accentColor = currentRole ? ROLE_ACCENT_COLORS[currentRole] : '#1E3A5F'
  const roleLabel = currentRole ? ROLE_LABELS[currentRole] : ''
  const shortLabel = currentRole ? ROLE_SHORT_LABELS[currentRole] : ''

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
      {/* Left: Search */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Rechercher..."
            className="h-9 w-64 rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4">
        {/* Role badge */}
        {currentRole && (
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: accentColor + '15', color: accentColor }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
            {roleLabel}
          </div>
        )}

        {/* Notifications */}
        <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={18} className="text-slate-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Menu */}
        {currentUser && (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg py-1.5 pr-2 transition-colors"
            >
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900 leading-tight">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-xs text-slate-500">{shortLabel}</p>
              </div>
              <Avatar
                initials={`${currentUser.firstName?.[0] || ''}${currentUser.lastName?.[0] || ''}`}
                className="w-8 h-8"
                style={{ backgroundColor: accentColor }}
              />
              <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-lg border border-slate-200 z-20 py-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{currentUser.firstName} {currentUser.lastName}</p>
                    <p className="text-xs text-slate-500">{roleLabel}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs text-slate-500">{currentUser.serviceName}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors mt-1"
                  >
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
