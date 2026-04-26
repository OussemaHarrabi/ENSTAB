"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { ROLE_ROUTE_PREFIX, ROLE_ACCENT_COLORS } from "@/lib/types"
import { Building2, LogIn, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { login, isAuthenticated } = useStore()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect
  if (isAuthenticated && typeof window !== 'undefined') {
    const role = useStore.getState().currentRole
    if (role) {
      router.push(ROLE_ROUTE_PREFIX[role])
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate network delay
    await new Promise(r => setTimeout(r, 600))

    const result = login(email, password)
    if (result.success) {
      const user = useStore.getState().currentUser
      const role = useStore.getState().currentRole
      if (user && role) {
        router.push(ROLE_ROUTE_PREFIX[role])
      }
    } else {
      setError(result.error || "Erreur de connexion")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-900/30">
            <Building2 size={36} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">UCAR Intelligence</h1>
          <p className="text-blue-200/80 mt-2 text-sm">Plateforme de Gestion Intelligente</p>
          <p className="text-blue-300/50 text-xs mt-1">Université de Carthage — Hack4UCAR 2025</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email institutionnel</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="prenom.nom@ucar.tn"
                required
                className="w-full h-11 rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 rounded-xl border border-slate-300 bg-white px-4 pr-11 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-60 shadow-lg shadow-blue-900/20"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Connexion...
                </span>
              ) : (
                <><LogIn size={18} /> Se connecter</>
              )}
            </button>
          </form>

          {/* Quick access hint */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <p className="text-xs text-slate-400 text-center mb-3">Accès rapide — Comptes de démonstration</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { setEmail('president@ucar.tn'); setPassword('ucar2024') }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors text-left"
              >
                <span className="font-medium">Présidence</span>
                <br /><span className="text-slate-400">president@ucar.tn</span>
              </button>
              <button
                onClick={() => { setEmail('mohamed.khedimallah@ucar.tn'); setPassword('ucar2024') }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-colors text-left"
              >
                <span className="font-medium">RH</span>
                <br /><span className="text-slate-400">mohamed.khedimallah@ucar.tn</span>
              </button>
              <button
                onClick={() => { setEmail('samar.benyounes@ucar.tn'); setPassword('ucar2024') }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-600 hover:text-violet-700 transition-colors text-left"
              >
                <span className="font-medium">Enseignement</span>
                <br /><span className="text-slate-400">samar.benyounes@ucar.tn</span>
              </button>
              <button
                onClick={() => { setEmail('samir.ghodhbani@ucar.tn'); setPassword('ucar2024') }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors text-left"
              >
                <span className="font-medium">Finances</span>
                <br /><span className="text-slate-400">samir.ghodhbani@ucar.tn</span>
              </button>
              <button
                onClick={() => { setEmail('oussema.harrabi@ensi.tn'); setPassword('student2024') }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-600 hover:text-green-700 transition-colors text-left"
              >
                <span className="font-medium">Étudiant</span>
                <br /><span className="text-slate-400">oussema.harrabi@ensi.tn</span>
              </button>
              <button
                onClick={() => { setEmail('ahmed.benali@ensi.tn'); setPassword('teacher2024') }}
                className="text-xs px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50 text-slate-600 hover:text-sky-700 transition-colors text-left"
              >
                <span className="font-medium">Enseignant</span>
                <br /><span className="text-slate-400">ahmed.benali@ensi.tn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-blue-300/40 text-xs mt-6">
          © {new Date().getFullYear()} Université de Carthage. Tous droits réservés.
        </p>
      </div>
    </div>
  )
}
