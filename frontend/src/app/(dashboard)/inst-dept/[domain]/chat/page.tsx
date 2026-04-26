"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { ChatPanel } from "@/components/ai/chat-panel"
import { domainLabels } from "@/lib/mock-data"

export default function InstDeptChatPage() {
  const params = useParams()
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4"><h1 className="text-2xl font-bold text-slate-900">Assistant IA — {domainLabels[params.domain as string] || params.domain}</h1></div>
      <Card className="flex-1 overflow-hidden border-0 shadow-none"><ChatPanel embedded /></Card>
    </div>
  )
}
