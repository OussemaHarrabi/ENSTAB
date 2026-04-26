"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { Briefcase, Building2, GraduationCap, MapPin } from "lucide-react"

export default function StudentCareerPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Carrière & Emploi</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Offres de Stage/Emploi</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Stage Data Scientist', company: 'Vermeg', loc: 'Tunis', type: 'Stage PFE' },
              { title: 'Développeur Full Stack', company: 'InstaDeep', loc: 'Tunis', type: 'CDI' },
              { title: 'Analyste IA', company: 'Expensya', loc: 'Remote', type: 'Stage' },
            ].map((j, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div><p className="text-sm font-medium text-slate-700">{j.title}</p><div className="flex items-center gap-2 text-xs text-slate-400 mt-1"><Building2 size={12} />{j.company}<MapPin size={12} />{j.loc}</div></div>
                <Badge variant="info">{j.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Réseau Alumni</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50">
              <GraduationCap size={40} className="text-blue-600" />
              <div><p className="font-medium text-blue-800">+12,000 Alumni</p><p className="text-sm text-blue-600">Salaire moyen: 1,800 TND/mois</p></div>
            </div>
            <Button className="w-full mt-4" variant="outline">Explorer le réseau</Button>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardContent className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="font-medium text-amber-800">Enquête d'employabilité (30 secondes)</p>
          <p className="text-sm text-amber-600">Aidez UCAR à améliorer ses statistiques d'insertion professionnelle</p>
          <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700">Répondre</Button>
        </CardContent>
      </Card>
    </div>
  )
}
