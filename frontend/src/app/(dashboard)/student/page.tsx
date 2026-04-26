"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { BookOpen, Award, TrendingUp, Calendar, Leaf, BarChart3 } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function StudentPage() {
  const grades = [{ s: 'S1', v: 12.5 }, { s: 'S2', v: 13.2 }, { s: 'S3', v: 11.8 }, { s: 'S4', v: 14.1 }, { s: 'S5', v: 14.8 }, { s: 'S6', v: 15.2 }]
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-900">Mon UCAR</h1><p className="text-sm text-slate-500 mt-1">Ali Ben Salem · INF-401 · ENSI</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Moyenne Générale" value="14.2/20" trend="up" trendValue={0.8} targetValue="16/20" icon={<Award size={18} />} status="ok" />
        <KpiCard title="Assiduité" value="85%" trend="up" trendValue={5} targetValue="90%" icon={<BookOpen size={18} />} status="warning" />
        <KpiCard title="Progression" value="78%" icon={<TrendingUp size={18} />} status="ok" />
        <KpiCard title="Empreinte Carbone" value="2.4t CO₂" trend="down" trendValue={-8} icon={<Leaf size={18} />} status="ok" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Évolution Semestrielle</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grades}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="s" tick={{ fontSize: 11 }} />
                  <YAxis domain={[8, 20]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="v" stroke="#1e40af" strokeWidth={2} dot={{ r: 4 }} name="Moyenne" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Mes Prochains Événements</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { event: 'Examen Algorithmique', date: '28/04/2025', type: 'Examen' },
              { event: 'Soutenance PFE', date: '15/06/2025', type: 'Soutenance' },
              { event: 'Atelier CV & Entretien', date: '10/05/2025', type: 'Atelier' },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /><span className="text-sm text-slate-700">{e.event}</span></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-400">{e.date}</span><Badge variant="outline">{e.type}</Badge></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><Leaf size={20} /></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">Mon Empreinte Carbone Estimée</p>
              <Progress value={35} className="mt-2" />
              <p className="text-xs text-slate-400 mt-1">2.4 tonnes CO₂/an — Moins que la moyenne étudiante (3.1t)</p>
            </div>
            <Badge variant="success">Éco-friendly</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
