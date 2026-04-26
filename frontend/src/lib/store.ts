import { create } from 'zustand'
import type { User, RoleSlug } from './types'
import { authenticateUser } from './mock-users'

interface AppState {
  currentUser: User | null
  currentRole: RoleSlug | null
  sidebarCollapsed: boolean
  language: 'fr'
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  logout: () => void
  toggleSidebar: () => void
}

function loadSession(): { currentUser: User | null; currentRole: RoleSlug | null } {
  if (typeof window === 'undefined') return { currentUser: null, currentRole: null }
  try {
    const stored = localStorage.getItem('ucar_session')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.currentUser && parsed.currentRole) {
        return parsed
      }
    }
  } catch {}
  return { currentUser: null, currentRole: null }
}

function saveSession(user: User | null, role: RoleSlug | null) {
  if (typeof window === 'undefined') return
  try {
    if (user && role) {
      localStorage.setItem('ucar_session', JSON.stringify({ currentUser: user, currentRole: role }))
    } else {
      localStorage.removeItem('ucar_session')
    }
  } catch {}
}

const initial = loadSession()

export const useStore = create<AppState>((set) => ({
  currentUser: initial.currentUser,
  currentRole: initial.currentRole,
  sidebarCollapsed: false,
  language: 'fr',
  isAuthenticated: initial.currentUser !== null,

  login: (email: string, password: string) => {
    const user = authenticateUser(email, password)
    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect. Contactez votre chef de service.' }
    }
    set({ currentUser: user, currentRole: user.role, isAuthenticated: true })
    saveSession(user, user.role)
    return { success: true }
  },

  logout: () => {
    set({ currentUser: null, currentRole: null, isAuthenticated: false })
    saveSession(null, null)
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
