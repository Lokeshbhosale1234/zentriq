import React from 'react'
import { Link } from 'react-router-dom'

function fmtINR(v) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(parseFloat(v) || 0)
}

/**
 * BudgetOverviewBar — compact dashboard widget showing current month's
 * budget status. Shows progress bars, exceeded alerts, and a link to /budgets.
 */
export default function BudgetOverviewBar({ analytics, loading }) {
  const items      = analytics || []
  const total      = items.length
  const exceeded   = items.filter(a => a.exceeded).length
  const overItems  = items.filter(a => a.exceeded)
  const nearItems  = items.filter(a => !a.exceeded && (a.percentageUsed || 0) >= 80)

  // Loading skeleton
  if (loading) {
    return (
      <div className="card p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-36 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
          <div className="h-4 w-16 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <div className="h-3 w-24 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-3 w-28 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
              <div className="h-1.5 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (total === 0) {
    return (
      <div className="card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/>
              <path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
              <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-500" style={{ color: 'var(--text-primary)' }}>No budgets for this month</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set spending limits to track your expenses</p>
          </div>
        </div>
        <Link to="/budgets" className="btn btn-primary flex-shrink-0"
          style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}>
          Set Budgets
        </Link>
      </div>
    )
  }

  return (
    <div className="card p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
            Budget Overview
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {total} budget{total !== 1 ? 's' : ''} this month
            {exceeded > 0
              ? ` · ⚠ ${exceeded} exceeded`
              : nearItems.length > 0
              ? ` · ${nearItems.length} near limit`
              : ' · All on track ✓'
            }
          </p>
        </div>
        <Link
          to="/budgets"
          className="text-xs font-500 transition-colors"
          style={{ color: 'var(--accent-purple)', flexShrink: 0 }}
          onMouseEnter={e => e.currentTarget.style.color = '#818cf8'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--accent-purple)'}
        >
          Manage →
        </Link>
      </div>

      {/* Exceeded alerts */}
      {overItems.length > 0 && (
        <div className="mb-4 space-y-2">
          {overItems.map(a => (
            <div key={a.id}
              className="flex items-center justify-between rounded-xl px-3 py-2"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border:     '1px solid rgba(239,68,68,0.15)',
              }}>
              <div className="flex items-center gap-2 min-w-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" style={{ color: '#ef4444', flexShrink: 0 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="text-xs truncate" style={{ color: '#ef4444' }}>{a.category} exceeded</span>
              </div>
              <span className="text-xs font-700 font-mono ml-2 flex-shrink-0" style={{ color: '#ef4444' }}>
                +{fmtINR(Math.abs(parseFloat(a.remaining) || 0))}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bars (show up to 6) */}
      <div className="space-y-2.5">
        {items.slice(0, 6).map(a => {
          const pct   = Math.min(parseFloat(a.percentageUsed) || 0, 100)
          const color = a.exceeded
            ? 'var(--accent-red)'
            : pct >= 80
            ? 'var(--accent-amber)'
            : 'var(--accent-green)'
          return (
            <div key={a.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-500 truncate" style={{ color: 'var(--text-secondary)', maxWidth: '45%' }}>
                  {a.category}
                </span>
                <span className="text-xs font-mono ml-1 flex-shrink-0" style={{ color }}>
                  {fmtINR(a.spent)} / {fmtINR(a.limitAmount)}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Show more link */}
      {items.length > 6 && (
        <p className="text-xs text-center mt-3" style={{ color: 'var(--text-muted)' }}>
          +{items.length - 6} more ·{' '}
          <Link to="/budgets" style={{ color: 'var(--accent-purple)' }}>View all</Link>
        </p>
      )}
    </div>
  )
}
