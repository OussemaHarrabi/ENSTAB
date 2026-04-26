"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

interface Column<T> {
  key: string
  label: string
  render?: (item: T, index?: number) => React.ReactNode
  sortable?: boolean
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  searchable?: boolean
  pageSize?: number
  emptyMessage?: string
}

export function DataTable<T extends Record<string, any>>({ data, columns, searchable, pageSize = 10, emptyMessage = "Aucune donnée" }: DataTableProps<T>) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [page, setPage] = useState(0)

  let filtered = data
  if (search) {
    const q = search.toLowerCase()
    filtered = data.filter(item => Object.values(item).some(v => String(v).toLowerCase().includes(q)))
  }

  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const va = a[sortKey], vb = b[sortKey]
      if (typeof va === 'number' && typeof vb === 'number') return sortDir === 'asc' ? va - vb : vb - va
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }

  const totalPages = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice(page * pageSize, (page + 1) * pageSize)

  const handleSort = (key: string) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  return (
    <div>
      {searchable && (
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(0) }} placeholder="Rechercher..." className="h-9 w-64 rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map(col => (
                <th key={col.key} className={`text-left py-2.5 px-3 text-xs font-medium text-slate-500 uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-slate-700' : ''}`}
                  style={{ width: col.width }} onClick={() => col.sortable && handleSort(col.key)}>
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center py-12 text-slate-400 text-sm">{emptyMessage}</td></tr>
            ) : paged.map((item, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                {columns.map(col => (
                  <td key={col.key} className="py-2.5 px-3 text-sm text-slate-700">
                    {col.render ? col.render(item, page * pageSize + i) : item[col.key] ?? '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
          <span className="text-xs text-slate-400">{filtered.length} résultats</span>
          <div className="flex gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-xs rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-40">Précédent</button>
            <span className="px-3 py-1 text-xs text-slate-500">{page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-xs rounded border border-slate-300 hover:bg-slate-50 disabled:opacity-40">Suivant</button>
          </div>
        </div>
      )}
    </div>
  )
}
