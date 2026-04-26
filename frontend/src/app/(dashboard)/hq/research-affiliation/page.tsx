"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress } from "@/components/ui"
import { getResearchAffiliation } from "@/lib/mock-data"
import { AlertTriangle, BookOpen, GraduationCap, Target, Users } from "lucide-react"
import { DataTable } from "@/components/tables/data-table"

export default function ResearchAffiliationPage() {
  const data = getResearchAffiliation()
  const affPct = Math.round((data.affiliated / data.total) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Affiliations Recherche UCAR</h1>
          <p className="text-sm text-slate-500 mt-1">Suivi et correction des affiliations institutionnelles pour THE/QS</p>
        </div>
        <Button size="sm">🔄 Correction en masse</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2"><BookOpen size={16} className="text-blue-600" /><span className="text-xs text-slate-500">Total Publications</span></div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{data.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2"><Target size={16} className="text-emerald-600" /><span className="text-xs text-slate-500">Affiliées UCAR</span></div>
            <p className="text-2xl font-bold text-emerald-600 mt-1">{data.affiliated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2"><AlertTriangle size={16} className="text-red-500" /><span className="text-xs text-slate-500">Non Affiliées</span></div>
            <p className="text-2xl font-bold text-red-500 mt-1">{data.unaffiliated}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-2"><Target size={16} className="text-amber-600" /><span className="text-xs text-slate-500">Taux d'Affiliation</span></div>
            <p className="text-2xl font-bold text-slate-900 mt-1">{affPct}%</p>
            <Progress value={affPct} className="mt-2" />
            <p className="text-xs text-slate-400 mt-1">Objectif: 100%</p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Institutions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Institutions à Risque — Publications Non Affiliées</CardTitle>
            <Badge variant="danger">{data.riskInstitutions.length} institutions</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={data.riskInstitutions}
            columns={[
              { key: 'name', label: 'Institution', sortable: true },
              { key: 'unaffiliated', label: 'Pub. Non Affiliées', sortable: true, render: (item: any) => <span className="text-red-600 font-medium">{item.unaffiliated}</span> },
              { key: 'phdStudents', label: 'Doctorants concernés', sortable: true, render: (item: any) => <span className="flex items-center gap-1"><GraduationCap size={13} />{item.phdStudents}</span> },
              { key: 'actions', label: 'Actions', render: () => <Button size="sm" variant="outline">✉️ Envoyer rappel</Button> },
            ]}
            searchable
          />
        </CardContent>
      </Card>

      {/* PhD tracking */}
      <Card>
        <CardHeader><CardTitle>Doctorants sans Affiliation UCAR</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
            <Users size={32} className="text-amber-500" />
            <div>
              <p className="font-semibold text-amber-800">156 doctorants sans affiliation UCAR explicite</p>
              <p className="text-sm text-amber-600">Ces publications ne seront pas comptabilisées dans THE/QS tant que l'affiliation n'est pas corrigée.</p>
            </div>
            <Button size="sm" className="ml-auto">Voir la liste</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
