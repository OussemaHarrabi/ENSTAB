"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge, Progress } from "@/components/ui"
import { KpiCard } from "@/components/kpi/kpi-card"
import { BookOpen, Users, BarChart3, Award, Clock } from "lucide-react"
import Link from "next/link"

export default function TeacherPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-slate-900">Mes Cours</h1><p className="text-sm text-slate-500 mt-1">Bienvenue, Pr. Mehdi Ben Ali — Département Informatique</p></div></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Cours assignés" value={4} icon={<BookOpen size={18} />} compact />
        <KpiCard title="Étudiants" value={185} icon={<Users size={18} />} compact />
        <KpiCard title="Taux de Réussite" value="83%" status="ok" icon={<Award size={18} />} compact />
        <KpiCard title="Heures effectuées" value="42h/48h" icon={<Clock size={18} />} compact status="warning" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Algorithmique Avancée', code: 'INF-401', students: 48, sessions: 24, progress: 85, avgGrade: '14.2/20' },
          { name: 'Structure de Données', code: 'INF-302', students: 52, sessions: 22, progress: 78, avgGrade: '12.8/20' },
          { name: 'Intelligence Artificielle', code: 'INF-501', students: 38, sessions: 18, progress: 62, avgGrade: '15.1/20' },
          { name: 'Projet de Fin d\'Études', code: 'INF-601', students: 47, sessions: 12, progress: 45, avgGrade: '-' },
        ].map((c, i) => (
          <Link key={i} href="/teacher/grades">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex justify-between"><div><h3 className="font-semibold text-slate-800">{c.name}</h3><p className="text-xs text-slate-400">{c.code}</p></div><Badge variant="info">{c.students} étudiants</Badge></div>
                <Progress value={c.progress} className="mt-3" /><div className="flex justify-between text-xs text-slate-400 mt-1"><span>{c.sessions} séances</span><span>Moyenne: {c.avgGrade}</span></div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
