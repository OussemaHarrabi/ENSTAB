import { create } from 'zustand'
import type { User, RoleSlug } from './types'

interface AppState {
  currentUser: User | null
  currentRole: RoleSlug
  sidebarCollapsed: boolean
  language: 'fr'
  setUser: (user: User) => void
  setRole: (role: RoleSlug) => void
  toggleSidebar: () => void
}

// Default super admin user
const defaultUser: User = {
  id: '1',
  email: 'president@ucar.tn',
  firstName: 'Président',
  lastName: 'UCAR',
  role: 'hq_super_admin',
  roleLabel: 'Super Admin UCAR',
  institutionId: 'ucar-hq',
  institutionName: 'Université de Carthage',
}

export const useStore = create<AppState>((set) => ({
  currentUser: defaultUser,
  currentRole: 'hq_super_admin',
  sidebarCollapsed: false,
  language: 'fr',
  setUser: (user) => set({ currentUser: user, currentRole: user.role }),
  setRole: (role) => set({ currentRole: role }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
}))
