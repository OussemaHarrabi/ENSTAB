"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress } from "@/components/ui"
import { getISOCompliance } from "@/lib/mock-data"
import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function ISOCompliancePage() {
  const certifications = getISOCompliance()

  const statusIcon = (status: string) => {
    if (status === 'done') return <CheckCircle2 size={16} className="text-emerald-500" />
    if (status === 'pending') return <Clock size={16} className="text-amber-500" />
    return <AlertCircle size={16} className="text-red-500" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Conformité & Certifications ISO</h1>
          <p className="text-sm text-slate-500 mt-1">Suivi des certifications qualité, environnement et management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {certifications.map(cert => (
          <Card key={cert.name}>
            <CardContent className="p-5">
              <h3 className="font-semibold text-slate-900">{cert.name}</h3>
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Progression</span>
                  <span className="font-bold text-slate-700">{cert.progress}%</span>
                </div>
                <Progress value={cert.progress} className="mt-1 h-2.5" />
              </div>
              <div className="mt-4 space-y-2">
                {cert.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    {statusIcon(item.status)}
                    <span className={item.status === 'done' ? 'text-slate-600 line-through' : 'text-slate-700'}>{item.label}</span>
                    <Badge variant={item.status === 'done' ? 'success' : item.status === 'pending' ? 'warning' : 'danger'} className="ml-auto text-[10px]">
                      {item.status === 'done' ? '✅' : item.status === 'pending' ? '⏳' : '❌'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
