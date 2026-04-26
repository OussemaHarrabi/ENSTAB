"use client"

import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Progress } from "@/components/ui"
import { Leaf, Zap, Trash2, Droplets, Bus, Award } from "lucide-react"

export default function StudentCarbonPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Mon Empreinte Carbone</h1>
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-emerald-50 border-4 border-emerald-500 flex items-center justify-center">
              <div className="text-center"><Leaf size={24} className="mx-auto text-emerald-500" /><span className="text-xs text-emerald-600 font-medium">2.4t</span></div>
            </div>
            <div><p className="font-semibold text-lg">2.4 tonnes CO₂ / an</p><p className="text-sm text-slate-500">Moins que la moyenne étudiante UCAR (3.1t)</p></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 text-center"><Zap size={24} className="mx-auto text-amber-500 mb-2" /><p className="text-lg font-bold">1.2t</p><p className="text-xs text-slate-400">Transport</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Trash2 size={24} className="mx-auto text-blue-500 mb-2" /><p className="text-lg font-bold">0.6t</p><p className="text-xs text-slate-400">Déchets</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Droplets size={24} className="mx-auto text-cyan-500 mb-2" /><p className="text-lg font-bold">0.3t</p><p className="text-xs text-slate-400">Eau</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Bus size={24} className="mx-auto text-green-500 mb-2" /><p className="text-lg font-bold">0.3t</p><p className="text-xs text-slate-400">Électricité</p></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Défis Durabilité</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {[{ challenge: 'Utiliser les transports en commun', progress: 80, points: 150 }, { challenge: 'Réduire sa consommation d\'eau', progress: 45, points: 100 }, { challenge: 'Participer au recyclage', progress: 20, points: 200 }].map((d, i) => (
            <div key={i} className="flex items-center gap-3"><Progress value={d.progress} className="flex-1" /><span className="text-xs text-slate-500 w-20">{d.progress}%</span><Badge variant="success">{d.points} pts</Badge></div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
