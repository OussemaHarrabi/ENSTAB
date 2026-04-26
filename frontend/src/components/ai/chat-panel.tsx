"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui"
import { MessageSquare, Send, Bot, User, X, BarChart3, FileText } from "lucide-react"

interface Message {
  role: 'user' | 'assistant'
  content: string
  chart?: boolean
  exportable?: boolean
}

const suggestions = [
  "Quelles sont les 5 institutions avec le pire taux d'exécution budgétaire ?",
  "Comparez le taux de réussite entre ENSTAB et FST",
  "Quel est notre score GreenMetric projeté pour 2026 ?",
  "Analyser les corrélations entre budget et performance académique",
]

const sampleAnswers: Record<string, Message> = {
  "Quelles sont les 5 institutions avec le pire taux d'exécution budgétaire ?": {
    role: 'assistant', content: "Voici les 5 institutions avec le plus faible taux d'exécution budgétaire ce semestre :\n\n1. **ISG**: 45% d'exécution\n2. **FST**: 52%\n3. **ENSTAB**: 58%\n4. **ESAC**: 61%\n5. **IHEC**: 63%\n\nLa moyenne UCAR est de 71.5%, contre 68.2% au niveau national. 📊",
    chart: true,
  },
  "Comparez le taux de réussite entre ENSTAB et FST": {
    role: 'assistant', content: "**Comparaison Taux de Réussite 2025-2026**\n\n| Indicateur | ENSTAB | FST |\n|---|---|---|\n| Taux de Réussite | 87.3% | 79.1% |\n| Écart vs National | +5.2% | -3.0% |\n| Tendance | ↑ 3.2% | ↓ 1.8% |\n\nENSTAB surpasse la FST de 8.2 points de pourcentage cette année. L'écart s'explique principalement par un meilleur encadrement (ratio 12:1 vs 18:1).",
  },
  "Quel est notre score GreenMetric projeté pour 2026 ?": {
    role: 'assistant', content: "**Projection GreenMetric UCAR 2026**\n\nScore actuel (2025): **6 200 / 10 000**\nScore projeté (2026): **6 850 / 10 000** ↑\n\nObjectif 2027: **7 800 / 10 000**\n\n**Améliorations clés recommandées:**\n- Installer des panneaux solaires sur 5 campus (+300 pts)\n- Augmenter le taux de recyclage à 50% (+250 pts)\n- Développer 10 nouveaux cours sur le développement durable (+200 pts)",
    chart: true,
    exportable: true,
  },
}

export function ChatPanel({ embedded = false }: { embedded?: boolean }) {
  const [open, setOpen] = useState(embedded)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Je suis l\'assistant IA UCAR. Posez-moi des questions sur les données institutionnelles, les KPIs, les tendances et les prévisions.' },
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    const userMsg: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Check for matching answer
    setTimeout(() => {
      const answer = sampleAnswers[input.trim()]
      if (answer) {
        setMessages(prev => [...prev, answer])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `J'ai analysé votre question concernant "${input.slice(0, 50)}..."\n\nD'après les données disponibles dans le système UCAR, je peux vous fournir une analyse détaillée. Pour des résultats plus précis, essayez de formuler votre question avec des indicateurs spécifiques (taux de réussite, budget, effectifs, etc.).\n\nConsultez le tableau de bord pour plus de détails.`,
        }])
      }
    }, 800)
  }

  const chatContent = (
    <div className="flex flex-col h-full">
      {!embedded && <div className="flex items-center justify-between p-3 border-b border-slate-200"><h3 className="text-sm font-medium">💬 Assistant IA UCAR</h3></div>}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'assistant' && <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><Bot size={14} className="text-blue-600" /></div>}
            <div className={`max-w-[85%] rounded-xl p-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-800'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              {(msg.chart || msg.exportable) && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-slate-200">
                  {msg.chart && <button className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/80 hover:bg-white text-blue-700"><BarChart3 size={12} /> Voir graphique</button>}
                  {msg.exportable && <button className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-white/80 hover:bg-white text-blue-700"><FileText size={12} /> Exporter PDF</button>}
                </div>
              )}
            </div>
            {msg.role === 'user' && <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0"><User size={14} className="text-white" /></div>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {messages.length === 1 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-slate-400 mb-2">Suggestions:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => { setInput(s); handleSend() }} className="text-xs px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">{s}</button>
            ))}
          </div>
        </div>
      )}
      <div className="p-3 border-t border-slate-200">
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Posez votre question..." className="flex-1 h-9 rounded-lg border border-slate-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleSend} className="h-9 w-9 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"><Send size={15} /></button>
        </div>
      </div>
    </div>
  )

  if (embedded) return chatContent

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 flex items-center justify-center z-50">
        <MessageSquare size={20} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-50">
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-blue-600" />
          <span className="text-sm font-medium">Assistant IA UCAR</span>
        </div>
        <button onClick={() => setOpen(false)} className="p-1 hover:bg-slate-100 rounded"><X size={16} /></button>
      </div>
      {chatContent}
    </div>
  )
}
