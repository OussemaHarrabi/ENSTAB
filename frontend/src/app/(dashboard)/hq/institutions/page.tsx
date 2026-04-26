"use client"

import { TrafficLightGrid } from "@/components/kpi/traffic-light-grid"
import { Card, CardContent, CardHeader, CardTitle, Input, Badge } from "@/components/ui"
import { useState } from "react"
import { institutions } from "@/lib/mock-data"
import { Search, MapPin, Users } from "lucide-react"
import Link from "next/link"

export default function InstitutionsPage() {
  const [search, setSearch] = useState('')
  const filtered = institutions.filter(i => i.name.toLowerCase().includes(search.toLowerCase()) || i.code.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Institutions</h1>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="h-9 w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm" />
        </div>
      </div>

      <TrafficLightGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(inst => (
          <Link key={inst.id} href={`/hq/institutions/${inst.id}`}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{inst.code}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{inst.name}</p>
                  </div>
                  <Badge variant={inst.accreditationStatus.length > 0 ? 'success' : 'outline'}>
                    {inst.accreditationStatus.length > 0 ? 'Certifié' : 'Non certifié'}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin size={12} />{inst.city}</span>
                  <span className="flex items-center gap-1"><Users size={12} />{inst.totalStudents.toLocaleString()} étudiants</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
