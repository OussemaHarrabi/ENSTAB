"use client"

import { ChatPanel } from "@/components/ai/chat-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Bot, Sparkles, Globe } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Assistant IA UCAR</h1>
          <p className="text-sm text-slate-500 mt-1">Posez des questions sur les données institutionnelles en langage naturel</p>
        </div>
        <Card className="flex-1 overflow-hidden border-0 shadow-none">
          <ChatPanel embedded />
        </Card>
      </div>
      <div className="w-72 space-y-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Bot size={16} />Assistant IA</div>
            <p className="text-xs text-slate-500 mt-2">Analyse les données de toutes les 35 institutions. Peut comparer, prédire et recommander.</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Sparkles size={16} />Capacités</div>
            <ul className="text-xs text-slate-500 mt-2 space-y-1 list-disc list-inside">
              <li>Analyse comparative</li>
              <li>Prévisions AutoARIMA</li>
              <li>Corrélations croisées</li>
              <li>Rapports automatiques</li>
              <li>Détection d'anomalies</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Globe size={16} />Portée</div>
            <p className="text-xs text-slate-500 mt-2">Nationale — toutes les institutions UCAR</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
