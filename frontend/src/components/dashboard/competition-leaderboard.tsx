"use client"

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui"
import { Award, Coins, Filter, Search, Sparkles, Trophy } from "lucide-react"

const leaderboard = [
  {
    rank: 1,
    institution: "SUP'COM",
    score: 93.2,
    publications: 142,
    collaborations: 28,
    compliance: 98,
    reward: "Prime Excellence",
    amount: 120000,
  },
  {
    rank: 2,
    institution: "INSAT",
    score: 89.7,
    publications: 115,
    collaborations: 22,
    compliance: 95,
    reward: "Prime Performance",
    amount: 95000,
  },
  {
    rank: 3,
    institution: "ENSTAB",
    score: 87.4,
    publications: 98,
    collaborations: 19,
    compliance: 92,
    reward: "Prime Progression",
    amount: 70000,
    highlighted: true,
  },
  {
    rank: 4,
    institution: "IHEC Carthage",
    score: 84.1,
    publications: 85,
    collaborations: 15,
    compliance: 88,
    reward: "Encouragement",
    amount: 45000,
  },
  {
    rank: 5,
    institution: "FST",
    score: 82.5,
    publications: 92,
    collaborations: 12,
    compliance: 90,
    reward: "Encouragement",
    amount: 35000,
  },
  {
    rank: 6,
    institution: "INAT",
    score: 79.8,
    publications: 74,
    collaborations: 10,
    compliance: 85,
    reward: "Accompagnement",
    amount: 25000,
  },
]

const rewardPool = [
  { label: "Budget total annuel", value: "450 000 TND", pct: 100 },
  { label: "Déjà réservé", value: "280 000 TND", pct: 62 },
  { label: "Bonus innovation", value: "+45 000 TND", pct: 10 },
]

const kpiDrivers = [
  { label: "Excellence académique", current: 88, target: 92, weight: 40, trend: "+2.4" },
  { label: "Production scientifique", current: 81, target: 86, weight: 25, trend: "+1.8" },
  { label: "Coopération internationale", current: 76, target: 84, weight: 20, trend: "+3.1" },
  { label: "Impact innovation", current: 72, target: 80, weight: 15, trend: "+2.0" },
]

const complianceControls = [
  { control: "Qualité des données KPI", owner: "Bureau UCAR", rate: 97, status: "ok", note: "Audit mensuel à jour" },
  { control: "Traçabilité des preuves", owner: "Doyens", rate: 93, status: "ok", note: "Pièces justificatives complètes" },
  { control: "Calendrier de soumission", owner: "Instituts", rate: 88, status: "warning", note: "2 instituts en retard" },
  { control: "Conformité méthodologique", owner: "Bureau UCAR", rate: 91, status: "ok", note: "Méthode harmonisée 2026" },
]

function rankBadge(rank: number) {
  if (rank === 1) return <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold">1</span>
  if (rank === 2) return <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-bold">2</span>
  if (rank === 3) return <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold">3</span>
  return <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-slate-100 text-slate-600 font-semibold">{rank}</span>
}

export function CompetitionLeaderboard() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-blue-800 via-blue-700 to-cyan-700 p-6 text-white shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-blue-100">Nouveau module 2026</p>
            <h1 className="text-2xl font-bold mt-1">Challenge Inter-Universités UCAR</h1>
            <p className="text-blue-100 mt-2 max-w-3xl">
              Classement compétitif entre établissements, piloté par le bureau UCAR et accessible aux doyens pour stimuler la performance académique et institutionnelle.
            </p>
          </div>
          <Badge className="bg-white/15 text-white border border-white/20 px-3 py-1.5 self-start">
            <Sparkles size={14} className="mr-1.5" />
            Démo Frontend (statique)
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500">Instituts classés</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">34</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Trophy size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500">Récompenses annuelles</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">450k TND</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Coins size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase text-slate-500">Prochaine clôture</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">31 Dec</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Award size={18} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-base">Classement général UCAR — Avril 2026</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled title="Prototype statique">
                <Filter size={14} className="mr-1" />Filtrer (bientôt)
              </Button>
              <Button variant="outline" size="sm" disabled title="Prototype statique">
                <Search size={14} className="mr-1" />Rechercher (bientôt)
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px]">
              <thead>
                <tr className="text-xs uppercase text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-3 text-left">Rang</th>
                  <th className="py-3 px-3 text-left">Institut</th>
                  <th className="py-3 px-3 text-right">Score global</th>
                  <th className="py-3 px-3 text-center">Publications</th>
                  <th className="py-3 px-3 text-center">Collaborations</th>
                  <th className="py-3 px-3 text-center">Compliance</th>
                  <th className="py-3 px-3 text-right">Récompense</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((row) => (
                  <tr
                    key={row.institution}
                    className={row.highlighted ? "bg-blue-50 border-y border-blue-200" : "border-b border-slate-100"}
                  >
                    <td className="py-3 px-3">{rankBadge(row.rank)}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{row.institution}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{row.score.toFixed(1)}</td>
                    <td className="py-3 px-3 text-center text-slate-700">{row.publications}</td>
                    <td className="py-3 px-3 text-center text-slate-700">{row.collaborations}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={row.compliance >= 90 ? "success" : "warning"}>{row.compliance}%</Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="font-semibold text-slate-900">{row.amount.toLocaleString("fr-FR")} TND</div>
                      <div className="text-xs text-slate-500">{row.reward}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Suivi du fonds d&apos;incitation (annuel)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {rewardPool.map((item) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-slate-600">{item.label}</span>
                <span className="text-sm font-semibold text-slate-900">{item.value}</span>
              </div>
              <Progress value={item.pct} />
            </div>
          ))}
          <p className="text-xs text-slate-500 pt-1">
            Note: cette page est un proof of concept frontend statique. Aucune logique backend n&apos;est connectée.
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pilotage KPI (pondération du classement)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {kpiDrivers.map((kpi) => (
              <div key={kpi.label} className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{kpi.label}</p>
                    <p className="text-xs text-slate-500">Poids dans le score global: {kpi.weight}%</p>
                  </div>
                  <Badge variant="info">{kpi.trend}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-2 text-sm">
                  <div>
                    <p className="text-slate-500">Actuel</p>
                    <p className="font-semibold text-slate-900">{kpi.current}/100</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Cible</p>
                    <p className="font-semibold text-slate-900">{kpi.target}/100</p>
                  </div>
                </div>
                <Progress value={Math.round((kpi.current / kpi.target) * 100)} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance Board (gouvernance & contrôle)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {complianceControls.map((item) => (
              <div key={item.control} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <p className="text-sm font-semibold text-slate-900">{item.control}</p>
                  <Badge variant={item.status === "ok" ? "success" : "warning"}>{item.rate}% conforme</Badge>
                </div>
                <p className="text-xs text-slate-500">Responsable: {item.owner}</p>
                <p className="text-xs text-slate-600 mt-1">{item.note}</p>
                <div className="mt-2">
                  <Progress value={item.rate} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
