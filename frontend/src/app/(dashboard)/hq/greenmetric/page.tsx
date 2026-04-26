"use client"

import { Card, CardContent, CardHeader, CardTitle, Progress, Badge, Button, Select } from "@/components/ui"
import { getGreenMetricData, generateChartData } from "@/lib/mock-data"
import { useState } from "react"
import { TreePine, Zap, Droplets, Trash2, Bus, BookOpen, Award, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, LineChart, Legend } from "recharts"

export default function GreenMetricPage() {
  const hqData = getGreenMetricData('ucar-hq')
  const yearlyData = [
    { year: '2020', score: 4800 }, { year: '2021', score: 5200 }, { year: '2022', score: 5600 },
    { year: '2023', score: 5900 }, { year: '2024', score: 6200 }, { year: '2025', score: 6500 },
    { year: '2026*', score: 6850 },
  ]
  const criteria = [
    { name: 'Setting & Infrastructure', icon: <Award size={16} />, score: hqData.criteria.settingInfrastructure.score, max: hqData.criteria.settingInfrastructure.max, pct: 68, weight: '15%' },
    { name: 'Energy & Climate Change', icon: <Zap size={16} />, score: hqData.criteria.energyClimate.score, max: hqData.criteria.energyClimate.max, pct: 72, weight: '21%' },
    { name: 'Waste', icon: <Trash2 size={16} />, score: hqData.criteria.waste.score, max: hqData.criteria.waste.max, pct: 55, weight: '18%' },
    { name: 'Water', icon: <Droplets size={16} />, score: hqData.criteria.water.score, max: hqData.criteria.water.max, pct: 60, weight: '10%' },
    { name: 'Transportation', icon: <Bus size={16} />, score: hqData.criteria.transportation.score, max: hqData.criteria.transportation.max, pct: 58, weight: '10%' },
    { name: 'Education', icon: <BookOpen size={16} />, score: hqData.criteria.education.score, max: hqData.criteria.education.max, pct: 65, weight: '15%' },
    { name: 'Governance & Digitalization', icon: <TrendingUp size={16} />, score: hqData.criteria.governance.score, max: hqData.criteria.governance.max, pct: 70, weight: '–' },
  ]
  const totalScore = criteria.reduce((s, c) => s + c.score, 0)
  const totalMax = criteria.reduce((s, c) => s + c.max, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">UI GreenMetric & ESG</h1>
          <p className="text-sm text-slate-500 mt-1">Suivi des performances environnementales et de développement durable</p>
        </div>
        <Button size="sm">📄 Soumettre GreenMetric 2026</Button>
      </div>

      {/* Global Score */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-emerald-600">{totalScore}</p>
                <p className="text-[10px] text-emerald-500">/ {totalMax}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-lg font-semibold text-slate-900">Score Global GreenMetric UCAR</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">Progression:</span>
                <TrendingUp size={16} className="text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600">+150 pts vs 2024</span>
                <Badge variant="success">Objectif 2026: 7 800</Badge>
              </div>
              <Progress value={(totalScore / totalMax) * 100} className="mt-2 h-3" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0</span>
                <span>Classement mondial: 350-500</span>
                <span>{totalMax}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Chart */}
      <Card>
        <CardHeader><CardTitle>Historique des Scores GreenMetric</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis domain={[3000, 8000]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={3} name="Score" dot={{ r: 5, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 7 Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {criteria.map(c => (
          <Card key={c.name}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-emerald-50 text-emerald-600">{c.icon}</div>
                  <span className="text-sm font-medium text-slate-700">{c.name}</span>
                </div>
                <span className="text-xs text-slate-400">Poids: {c.weight}</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-900">{c.score}</span>
                <span className="text-sm text-slate-400">/ {c.max}</span>
              </div>
              <Progress value={c.pct} className="mt-2" />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>{c.pct}%</span>
                <Badge variant={c.pct >= 70 ? 'success' : c.pct >= 50 ? 'warning' : 'danger'}>{c.pct >= 70 ? 'Bien' : c.pct >= 50 ? 'Moyen' : 'À améliorer'}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed ESG Metrics */}
      <Card>
        <CardHeader><CardTitle>Indicateurs ESG Détaillés</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><Zap size={14} />Énergie</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between"><span>Consommation totale</span><span className="font-medium">2.4M kWh</span></div>
                <div className="flex justify-between"><span>% Renouvelable</span><span className="font-medium text-emerald-600">18%</span></div>
                <div className="flex justify-between"><span>CO₂ émissions</span><span className="font-medium">840 tonnes</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><Trash2 size={14} />Déchets</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between"><span>Déchets générés</span><span className="font-medium">180 tonnes</span></div>
                <div className="flex justify-between"><span>Taux recyclage</span><span className="font-medium text-emerald-600">35%</span></div>
                <div className="flex justify-between"><span>Déchets dangereux</span><span className="font-medium">12 tonnes</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><Droplets size={14} />Eau</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between"><span>Consommation</span><span className="font-medium">45 000 m³</span></div>
                <div className="flex justify-between"><span>Eau recyclée</span><span className="font-medium">12%</span></div>
                <div className="flex justify-between"><span>Eau de pluie</span><span className="font-medium">5%</span></div>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1"><Bus size={14} />Mobilité</h4>
              <div className="space-y-1 text-sm text-slate-600">
                <div className="flex justify-between"><span>Transport public</span><span className="font-medium">42%</span></div>
                <div className="flex justify-between"><span>Véhicules électriques</span><span className="font-medium">8 stations</span></div>
                <div className="flex justify-between"><span>Pistes cyclables</span><span className="font-medium">12 km</span></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
