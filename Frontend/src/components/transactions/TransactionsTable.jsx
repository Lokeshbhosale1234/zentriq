import React, { useState } from 'react'
import { formatCurrency, formatDate, STATUS_CONFIG } from '../../utils/formatters'

export default function TransactionsTable({ transactions, loading, onDelete }) {
  const [deletingId, setDeletingId] = useState(null)
  const [search, setSearch]         = useState('')
  const [filterType, setFilterType] = useState('ALL')

  const filtered = (transactions || []).filter(t => {
    const matchSearch = !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'ALL' || t.type === filterType
    return matchSearch && matchType
  })

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    setDeletingId(id)
    try { await onDelete(id) }
    catch (err) { alert(err.message || 'Delete failed') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="card overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color: 'var(--text-muted)' }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="input pl-9"
            placeholder="Search title or category…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', flexShrink: 0 }}>
          {['ALL', 'CREDIT', 'DEBIT'].map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className="px-4 py-2 text-xs font-600 transition-all"
              style={{
                background: filterType === t ? 'rgba(99,102,241,0.2)' : 'transparent',
                color: filterType === t ? '#a5b4fc' : 'var(--text-secondary)',
              }}
            >
              {t === 'ALL' ? 'All' : t === 'CREDIT' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Transaction', 'Category', 'Date', 'Status', 'Amount', ''].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-600 uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: j === 0 ? '80%' : '60%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex flex-col items-center gap-2">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                      <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p>No transactions found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(t => {
                const isCredit = t.type === 'CREDIT'
                const status   = STATUS_CONFIG[t.status] || { label: t.status, cls: 'badge-cyan' }
                const isDeleting = deletingId === t.id
                return (
                  <tr
                    key={t.id}
                    style={{ borderBottom: '1px solid var(--border)', opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s' }}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                          style={{
                            background: isCredit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                            color: isCredit ? '#10b981' : '#ef4444',
                          }}
                        >
                          {isCredit ? '↓' : '↑'}
                        </div>
                        <div>
                          <p className="text-sm font-500" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                          {t.description && (
                            <p className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-muted)' }}>{t.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge badge-purple">{t.category}</span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(t.transactionDate)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${status.cls}`}>{status.label}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-700 font-mono text-sm" style={{ color: isCredit ? '#10b981' : '#ef4444' }}>
                        {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => handleDelete(t.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? '…' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      {!loading && filtered.length > 0 && (
        <div className="px-5 py-3 text-xs" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          Showing {filtered.length} of {transactions.length} transactions
        </div>
      )}
    </div>
  )
}
