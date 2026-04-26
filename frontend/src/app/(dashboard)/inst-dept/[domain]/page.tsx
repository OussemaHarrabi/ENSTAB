"use client"

import { Card, CardContent, CardHeader, CardTitle, Button, Badge } from "@/components/ui"
import { DocumentUpload } from "@/components/forms"
import { ChatPanel } from "@/components/ai/chat-panel"
import { ArrowLeft, TrendingUp, Shield, FileText } from "lucide-react"
import { domainLabels, generateChartData } from "@/lib/mock-data"
import { useParams } from "next/navigation"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function InstDeptPage() {
  const params = useParams()
  const domain = params.domain as string
  const chartData = generateChartData(12, domain === 'finance' ? 65 : domain === 'research' ? 40 : 80, 10)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{domainLabels[domain] || domain} — Analyse Département</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tendance {domain === 'finance' ? 'Budgétaire' : domain === 'research' ? 'des Publications' : 'Générale'}</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Score d'Intégrité des Données</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center">
              <span className="text-xl font-bold text-emerald-600">87%</span>
            </div>
            <div>
              <p className="text-sm font-medium text-emerald-700">Bonne qualité</p>
              <p className="text-xs text-slate-500">Complétude: 92% | Cohérence: 85% | Rapidité: 78%</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <DocumentUpload />
    </div>
  )
}
