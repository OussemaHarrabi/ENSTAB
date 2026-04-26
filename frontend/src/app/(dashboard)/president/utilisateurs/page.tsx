"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { MOCK_USERS } from "@/lib/mock-users"
import { Users, Download, RefreshCw, Search, UserPlus, Shield, CheckCircle2, XCircle, UserCog, Building2 } from "lucide-react"
import { ROLE_LABELS, ROLE_ACCENT_COLORS } from "@/lib/types"
import { useState } from "react"

export default function UtilisateursPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_USERS.filter(u =>
    u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.serviceName.toLowerCase().includes(search.toLowerCase())
  )

  const activeUsers = MOCK_USERS.filter(u => u.isActive).length
  const svcCount = new Set(MOCK_USERS.map(u => u.serviceId)).size

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1E3A5F20' }}>
              <UserCog size={20} className="text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Utilisateurs & Rôles</h1>
              <p className="text-sm text-slate-500">Gestion des accès à la plateforme UCAR Intelligence</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="flex items-center gap-1.5"><UserPlus size={14} /> Ajouter</Button>
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Users size={20} className="text-blue-600" />
            <div><p className="text-xl font-bold text-blue-700">{MOCK_USERS.length}</p><p className="text-xs text-blue-600">Total</p></div>
          </CardContent>
        </Card>
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <div><p className="text-xl font-bold text-emerald-700">{activeUsers}</p><p className="text-xs text-emerald-600">Actifs</p></div>
          </CardContent>
        </Card>
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Shield size={20} className="text-amber-600" />
            <div><p className="text-xl font-bold text-amber-700">14</p><p className="text-xs text-amber-600">Rôles</p></div>
          </CardContent>
        </Card>
        <Card className="bg-violet-50 border-violet-200">
          <CardContent className="p-4 flex items-center gap-3">
            <Building2 size={20} className="text-violet-600" />
            <div><p className="text-xl font-bold text-violet-700">{svcCount}</p><p className="text-xs text-violet-600">Services</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Rechercher un utilisateur..." value={search} onChange={e => setSearch(e.target.value)} className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm" />
      </div>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Utilisateur</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Rôle</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Niveau</th>
                  <th className="text-center py-3 px-4 font-semibold text-slate-600 text-xs uppercase">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const accent = ROLE_ACCENT_COLORS[u.role]
                  return (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: accent }}>
                            {u.firstName[0]}{u.lastName[0]}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{u.firstName} {u.lastName}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge style={{ backgroundColor: accent + '15', color: accent }} className="border-0 text-xs">
                          {ROLE_LABELS[u.role]}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">{u.serviceName}</td>
                      <td className="py-3 px-4 text-sm text-slate-500">Niveau {u.level}</td>
                      <td className="py-3 px-4 text-center">
                        {u.isActive
                          ? <CheckCircle2 size={16} className="text-emerald-500 mx-auto" />
                          : <XCircle size={16} className="text-red-300 mx-auto" />
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
