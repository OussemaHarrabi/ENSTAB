"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from "@/components/ui"
import { allInstitutions } from "@/lib/mock-data"
import { Building2, Download, RefreshCw, Search, MapPin, Users, GraduationCap, Filter } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const institutionTypes = [...new Set(allInstitutions.map(i => i.type))]

export default function InstitutionsPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = allInstitutions.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || i.type === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#1E3A5F20' }}>
              <Building2 size={20} className="text-slate-700" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Institutions</h1>
              <p className="text-sm text-slate-500">{allInstitutions.length} établissements — Université de Carthage</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download size={14} className="mr-1" /> Exporter</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Rechercher un établissement..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-1">
          <Filter size={14} className="text-slate-400" />
          {['all', ...institutionTypes].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {t === 'all' ? 'Tous' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Institution Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inst => (
          <Link key={inst.id} href={`/president/institutions/${inst.id}`}>
            <Card className="hover:shadow-md hover:border-blue-200 transition-all cursor-pointer h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-500">{inst.code.substring(0, 2).toUpperCase()}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{inst.type}</Badge>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{inst.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{inst.code}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
                  <MapPin size={12} /> {inst.city}
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Users size={12} /> {inst.totalStudents.toLocaleString()} étudiants</span>
                  <span className="flex items-center gap-1"><GraduationCap size={12} /> {inst.totalStaff} staff</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {inst.accreditationStatus.map((acc, i) => (
                    <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">{acc}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
