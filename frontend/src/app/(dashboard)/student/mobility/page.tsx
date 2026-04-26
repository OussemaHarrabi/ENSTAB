"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from "@/components/ui"
import { Globe, MapPin, Calendar, CheckCircle } from "lucide-react"

export default function StudentMobilityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mobilité Internationale</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Programmes Disponibles</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { prog: 'Erasmus+ France', univ: 'Université Paris-Saclay', places: 5, deadline: '30/05/2025' },
              { prog: 'Erasmus+ Espagne', univ: 'Universitat Politécnica', places: 3, deadline: '15/06/2025' },
              { prog: 'Bourse Canada', univ: 'Université Laval', places: 2, deadline: '01/07/2025' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div><p className="text-sm font-medium text-slate-700">{p.prog}</p><div className="text-xs text-slate-400"><Globe size={12} className="inline mr-1" />{p.univ}</div></div>
                <div className="text-right"><Badge variant="info">{p.places} places</Badge><p className="text-[10px] text-slate-400 mt-1">Limite: {p.deadline}</p></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Ma Candidature Erasmus+</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span className="text-sm">Dossier académique</span></div>
              <div className="flex items-center gap-2"><CheckCircle size={14} className="text-emerald-500" /><span className="text-sm">Test de langue</span></div>
              <div className="flex items-center gap-2"><span className="w-3.5 h-3.5 rounded-full border-2 border-amber-500 block" /><span className="text-sm">Lettre de motivation</span></div>
              <Progress value={66} className="mt-2" />
              <Button className="w-full" variant="outline">Continuer ma candidature</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
