"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui"
import { domainLabels } from "@/lib/mock-data"
import { Calendar, Users, Plus } from "lucide-react"

export default function MeetingsPage() {
  const params = useParams()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-slate-900">Coordination — {domainLabels[params.domain as string] || params.domain}</h1><Button size="sm"><Plus size={14} className="mr-1" />Nouvelle réunion</Button></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: 'Réunion des chefs de département', date: '2025-05-05', attendees: 12 },
          { title: 'Comité de suivi des KPIs', date: '2025-05-12', attendees: 8 },
          { title: 'Atelier qualité des données', date: '2025-05-20', attendees: 15 },
          { title: 'Revue trimestrielle', date: '2025-06-01', attendees: 25 },
        ].map((m, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <h3 className="font-medium text-slate-800">{m.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1"><Calendar size={12} />{m.date}</span>
                <span className="flex items-center gap-1"><Users size={12} />{m.attendees} participants</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
