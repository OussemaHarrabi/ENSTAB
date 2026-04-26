"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, Button, Input } from "@/components/ui"
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

const LABELS = {
  title: "Ingestion Intelligente de Documents",
  dropText: "Deposez vos fichiers PDF ou Excel ici",
  clickText: "ou cliquez pour parcourir",
  selectFiles: "Selectionner des fichiers",
  processing: "Traitement en cours...",
  pageStatus: "Page 3/12: table extraite, 47 lignes trouvees",
}

export function DocumentUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploaded, setUploaded] = useState<{ name: string; status: 'success' | 'error'; message: string }[]>([])

  const handleUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploading(false)
          setUploaded(prev => [...prev, { name: 'rapport_annuel_2025.pdf', status: 'success', message: 'Extraction terminee: 12 pages, 47 lignes de donnees extraites' }])
          return 100
        }
        return prev + (Math.random() * 15 + 5)
      })
    }, 300)
  }

  return (
    <Card>
      <CardHeader><CardTitle>{LABELS.title}</CardTitle></CardHeader>
      <CardContent>
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
          <Upload size={32} className="mx-auto text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-600">{LABELS.dropText}</p>
          <p className="text-xs text-slate-400 mt-1">{LABELS.clickText}</p>
          <Button size="sm" className="mt-4" onClick={handleUpload} disabled={uploading}>
            {uploading ? <><Loader2 size={14} className="animate-spin mr-2" />{LABELS.processing}</> : LABELS.selectFiles}
          </Button>
        </div>
        {uploading && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-slate-600">{LABELS.pageStatus}</span>
              <span className="text-slate-500">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}
        {uploaded.map((item, i) => (
          <div key={i} className="flex items-center gap-3 mt-3 p-3 rounded-lg border border-slate-200">
            {item.status === 'success' ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertCircle size={16} className="text-red-500" />}
            <FileText size={16} className="text-slate-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-700 truncate">{item.name}</p>
              <p className="text-xs text-slate-400">{item.message}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function DataEntryForm({ fields }: { fields: { label: string; type: string; options?: { value: string; label: string }[] }[] }) {
  return (
    <div className="space-y-3">
      {fields.map((f, i) => (
        <div key={i}>
          <label className="text-sm font-medium text-slate-700 block mb-1">{f.label}</label>
          {f.type === 'select' && f.options ? (
            <select className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Selectionner...</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : f.type === 'textarea' ? (
            <textarea className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
          ) : (
            <Input type={f.type || 'text'} />
          )}
        </div>
      ))}
      <Button className="w-full">Enregistrer</Button>
    </div>
  )
}
