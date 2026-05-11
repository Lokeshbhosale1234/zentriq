import React, { useState } from 'react'
import { formatCurrency, formatDate, STATUS_CONFIG } from '../../utils/formatters'

/**
 * TransactionsTable — pure display component.
 * Receives already-filtered `transactions` from the parent page.
 * Supports local client-side quick-search/type toggle on top of server results.
 */
export default function TransactionsTable({ transactions, loading, onDelete, totalCount }) {
  const [deletingId, setDeletingId] = useState(null)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction?')) return
    setDeletingId(id)
    try { await onDelete(id) }
    catch (err) { alert(err.message || 'Delete failed') }
    finally { setDeletingId(null) }
  }

  const list = transactions || []

  return (
    <div className="card overflow-hidden">
      {/* Table wrapper — horizontally scrollable on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full" style={{ minWidth: '640px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Transaction', 'Category', 'Date', 'Status', 'Amount', ''].map(h => (
                <th key={h} className="text-left px-4 sm:px-5 py-3 text-xs font-600 uppercase tracking-wider"
                  style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              // Skeleton rows
              [...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  {[...Array(6)].map((_, j) => (
                    <td key={j} className="px-4 sm:px-5 py-4">
                      <div className="h-4 rounded animate-pulse"
                        style={{ background: 'rgba(255,255,255,0.06)', width: j === 0 ? '80%' : '60%' }} />
                    </td>
                  ))}
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
                  <div className="flex flex-col items-center gap-3">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="1.2" style={{ opacity: 0.4 }}>
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <div>
                      <p className="font-500 text-sm">No transactions found</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              list.map(t => {
                const isCredit   = t.type === 'CREDIT'
                const status     = STATUS_CONFIG[t.status] || { label: t.status, cls: 'badge-cyan' }
                const isDeleting = deletingId === t.id
                return (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      opacity:      isDeleting ? 0.4 : 1,
                      transition:   'opacity 0.2s, background 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Title + description */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                          style={{
                            background: isCredit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                            color:      isCredit ? '#10b981'                 : '#ef4444',
                          }}>
                          {isCredit ? '↓' : '↑'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-500 truncate" style={{ color: 'var(--text-primary)', maxWidth: 180 }}>{t.title}</p>
                          {t.description && (
                            <p className="text-xs truncate" style={{ color: 'var(--text-muted)', maxWidth: 180 }}>{t.description}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <span className="badge badge-purple" style={{ whiteSpace: 'nowrap' }}>{t.category}</span>
                    </td>

                    {/* Date */}
                    <td className="px-4 sm:px-5 py-3.5 text-xs" style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(t.transactionDate)}
                    </td>

                    {/* Status */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <span className={`badge ${status.cls}`} style={{ whiteSpace: 'nowrap' }}>{status.label}</span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <span className="font-700 font-mono text-sm" style={{
                        color: isCredit ? '#10b981' : '#ef4444',
                        whiteSpace: 'nowrap',
                      }}>
                        {isCredit ? '+' : '−'}{formatCurrency(t.amount)}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-4 sm:px-5 py-3.5">
                      <button
                        className="btn btn-danger"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', whiteSpace: 'nowrap' }}
                        onClick={() => handleDelete(t.id)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2">
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/>
                            <path d="M21 12a9 9 0 00-9-9"/>
                          </svg>
                        ) : 'Delete'}
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
      {!loading && list.length > 0 && (
        <div className="px-4 sm:px-5 py-3 text-xs" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          Showing <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{list.length}</span>
          {totalCount !== undefined && totalCount !== list.length && (
            <> of <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{totalCount}</span></>
          )}
          {' '}transactions
        </div>
      )}
    </div>
  )
}
