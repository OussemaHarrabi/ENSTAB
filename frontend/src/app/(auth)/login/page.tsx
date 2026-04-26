"use client"

import { useStore } from "@/lib/store"
import { Card, CardContent, Button } from "@/components/ui"
import { Building2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const { setUser } = useStore()
  const router = useRouter()

  const handleLogin = () => {
    setUser({ id: '1', email: 'president@ucar.tn', firstName: 'Président', lastName: 'UCAR', role: 'hq_super_admin', roleLabel: 'Super Admin UCAR', institutionId: 'ucar-hq', institutionName: 'Université de Carthage' })
    router.push('/hq')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-700 flex items-center justify-center mx-auto mb-4"><Building2 size={32} className="text-white" /></div>
            <h1 className="text-2xl font-bold text-slate-900">UCAR Intelligence</h1>
            <p className="text-sm text-slate-500 mt-1">Plateforme de Gestion Intelligente</p>
            <p className="text-xs text-slate-400 mt-1">Université de Carthage</p>
          </div>
          <div className="space-y-4">
            <div><label className="text-sm font-medium text-slate-700">Email</label><input defaultValue="president@ucar.tn" className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm mt-1" /></div>
            <div><label className="text-sm font-medium text-slate-700">Mot de passe</label><input type="password" defaultValue="••••••••" className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm mt-1" /></div>
            <Button className="w-full h-10" onClick={handleLogin}>Se connecter</Button>
            <p className="text-xs text-slate-400 text-center">Cliquez sur Se connecter pour accéder à la démo</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
