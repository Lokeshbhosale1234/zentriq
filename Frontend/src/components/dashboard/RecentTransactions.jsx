import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatShortDate, STATUS_CONFIG } from '../../utils/formatters'

export default function RecentTransactions({ transactions, loading }) {
  const recent = (transactions || []).slice(0, 5)

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
            Recent Transactions
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Latest activity</p>
        </div>
        <Link to="/transactions"
          className="text-xs font-500 transition-colors"
          style={{ color: 'var(--accent-purple)' }}
          onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--accent-purple)'}
        >
          View all →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
              <div className="flex-1 space-y-2">
                <div className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', width: '40%' }} />
              </div>
              <div className="h-4 w-20 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          ))}
        </div>
      ) : recent.length === 0 ? (
        <div className="text-center py-10" style={{ color: 'var(--text-muted)' }}>
          <p>No transactions yet</p>
          <p className="text-xs mt-1">Add one to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recent.map(t => {
            const isCredit = t.type === 'CREDIT'
            const status   = STATUS_CONFIG[t.status] || { label: t.status, cls: 'badge-cyan' }
            return (
              <div key={t.id} className="flex items-center gap-3 py-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    background: isCredit ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                    color: isCredit ? '#10b981' : '#ef4444',
                  }}
                >
                  {isCredit ? '↓' : '↑'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-500 truncate" style={{ color: 'var(--text-primary)' }}>{t.title}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                    {t.category} · {formatShortDate(t.transactionDate)}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-700 font-mono" style={{ color: isCredit ? '#10b981' : '#ef4444' }}>
                    {isCredit ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <span className={`badge ${status.cls}`}>{status.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
