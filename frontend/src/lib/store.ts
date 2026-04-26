import { create } from 'zustand'
import type { User, RoleSlug } from './types'
import { authenticateUser } from './mock-users'

export interface SessionData {
  currentUser: User | null
  currentRole: RoleSlug | null
  token: string | null
}

interface AppState {
  currentUser: User | null
  currentRole: RoleSlug | null
  token: string | null
  sidebarCollapsed: boolean
  language: 'fr'
  isAuthenticated: boolean
  login: (email: string, password: string) => { success: boolean; error?: string }
  setAuthFromApi: (token: string, user: User, role: RoleSlug) => void
  logout: () => void
  toggleSidebar: () => void
}

function loadSession(): SessionData {
  if (typeof window === 'undefined') return { currentUser: null, currentRole: null, token: null }
  try {
    const stored = localStorage.getItem('ucar_session')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.currentUser && parsed.currentRole) {
        return parsed as SessionData
      }
    }
  } catch {}
  return { currentUser: null, currentRole: null, token: null }
}

function saveSession(data: SessionData) {
  if (typeof window === 'undefined') return
  try {
    if (data.currentUser && data.currentRole) {
      localStorage.setItem('ucar_session', JSON.stringify(data))
    } else {
      localStorage.removeItem('ucar_session')
    }
  } catch {}
}

const initial = loadSession()

export const useStore = create<AppState>((set) => ({
  currentUser: initial.currentUser,
  currentRole: initial.currentRole,
  token: initial.token,
  sidebarCollapsed: false,
  language: 'fr',
  isAuthenticated: initial.currentUser !== null,

  login: (email: string, password: string) => {
    const user = authenticateUser(email, password)
    if (!user) {
      return { success: false, error: 'Email ou mot de passe incorrect. Contactez votre chef de service.' }
    }
    const session: SessionData = {
      currentUser: user,
      currentRole: user.role,
      token: `mock-token-${Date.now()}`
    }
    set({ ...session, isAuthenticated: true })
    saveSession(session)
    return { success: true }
  },

  setAuthFromApi: (token: string, user: User, role: RoleSlug) => {
    const session: SessionData = { currentUser: user, currentRole: role, token }
    set({ ...session, isAuthenticated: true })
    saveSession(session)
  },

  logout: () => {
    const empty: SessionData = { currentUser: null, currentRole: null, token: null }
    set({ ...empty, isAuthenticated: false })
    saveSession(empty)
  },

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
