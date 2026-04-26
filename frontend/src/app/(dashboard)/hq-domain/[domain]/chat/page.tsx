"use client"

import { useParams } from "next/navigation"
import { ChatPanel } from "@/components/ai/chat-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { domainLabels } from "@/lib/mock-data"
import { Bot, Sparkles } from "lucide-react"

export default function DomainChatPage() {
  const params = useParams()
  const domain = params.domain as string

  return (
    <div className="flex gap-6 h-[calc(100vh-8rem)]">
      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Assistant IA — {domainLabels[domain] || domain}</h1>
          <p className="text-sm text-slate-500 mt-1">Requêtes en langage naturel limitées au domaine {domainLabels[domain]?.toLowerCase() || domain}</p>
        </div>
        <Card className="flex-1 overflow-hidden border-0 shadow-none"><ChatPanel embedded /></Card>
      </div>
      <div className="w-64 space-y-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Bot size={16} />Assistant IA</div><p className="text-xs text-slate-500 mt-2">Domaine: {domainLabels[domain] || domain}. Toutes institutions.</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2 text-sm font-medium text-slate-700"><Sparkles size={16} />Capacités</div><ul className="text-xs text-slate-500 mt-2 space-y-1 list-disc list-inside"><li>Analyse du domaine</li><li>Benchmarks</li><li>Tendances</li></ul></CardContent></Card>
      </div>
    </div>
  )
}
