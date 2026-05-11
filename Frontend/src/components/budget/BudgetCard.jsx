import React from 'react'
import { CATEGORY_COLORS, CATEGORIES } from '../../utils/formatters'

// Format in INR
function fmt(v) {
  const n = parseFloat(v) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n)
}

const MONTH_NAMES = [
  'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',
]

const CATEGORY_EMOJI = {
  'Food & Dining':  '🍽️',
  'Shopping':       '🛍️',
  'Transportation': '🚗',
  'Entertainment':  '🎬',
  'Healthcare':     '⚕️',
  'Education':      '📚',
  'Utilities':      '💡',
  'Travel':         '✈️',
  'Salary':         '💼',
  'Freelance':      '💻',
  'Investment':     '📈',
  'Other':          '📦',
}

/**
 * BudgetCard renders:
 * - isAnalytics=true  → shows spent / remaining / progress bar / warnings
 * - isAnalytics=false → shows limit only (for "All Budgets" tab)
 */
export default function BudgetCard({ data, onEdit, onDelete, isAnalytics = false }) {
  const colorIdx = Math.max(CATEGORIES.indexOf(data.category), 0)
  const color    = CATEGORY_COLORS[colorIdx % CATEGORY_COLORS.length]

  const pct      = isAnalytics ? Math.min(parseFloat(data.percentageUsed) || 0, 100) : 0
  const exceeded = isAnalytics && data.exceeded

  const barColor = exceeded
    ? 'var(--accent-red)'
    : pct >= 80
    ? 'var(--accent-amber)'
    : 'var(--accent-green)'

  return (
    <div
      className="card p-4 sm:p-5 flex flex-col gap-3 sm:gap-4 animate-slide-up transition-all"
      style={{ '--card-accent': color }}
    >
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Category icon */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-sm"
            style={{ background: `${color}22`, color }}
          >
            {CATEGORY_EMOJI[data.category] || '💰'}
          </div>
          <div className="min-w-0">
            <p className="font-600 text-sm truncate" style={{ color: 'var(--text-primary)' }}>
              {data.category}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {MONTH_NAMES[(data.month || 1) - 1]} {data.year}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(data)}
              title="Edit"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(data.id)}
              title="Delete"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--accent-red)', background: 'rgba(239,68,68,0.08)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* ── Amounts ─────────────────────────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Budget Limit</span>
          <span className="font-700 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
            {fmt(data.limitAmount)}
          </span>
        </div>

        {isAnalytics && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Spent</span>
              <span className="font-600 font-mono text-sm"
                style={{ color: exceeded ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {fmt(data.spent)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Remaining</span>
              <span className="font-600 font-mono text-sm"
                style={{ color: exceeded ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {exceeded ? '−' : ''}{fmt(Math.abs(parseFloat(data.remaining) || 0))}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Progress bar ────────────────────────────────────────────────────── */}
      {isAnalytics && (
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Usage</span>
            <span className="text-xs font-700" style={{ color: barColor }}>
              {(parseFloat(data.percentageUsed) || 0).toFixed(1)}%
            </span>
          </div>
          {/* Track */}
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {/* Fill */}
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
        </div>
      )}

      {/* ── Alerts ──────────────────────────────────────────────────────────── */}
      {isAnalytics && exceeded && (
        <div className="flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-2"
          style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Exceeded by {fmt(Math.abs(parseFloat(data.remaining) || 0))}
        </div>
      )}

      {isAnalytics && !exceeded && pct >= 80 && (
        <div className="flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-2"
          style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--accent-amber)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {(100 - pct).toFixed(1)}% remaining — approaching limit
        </div>
      )}

      {isAnalytics && !exceeded && pct < 80 && pct > 0 && (
        <div className="flex items-center gap-1.5 text-xs rounded-lg px-2.5 py-2"
          style={{ background: 'rgba(16,185,129,0.08)', color: 'var(--accent-green)', border: '1px solid rgba(16,185,129,0.1)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          On track · {fmt(parseFloat(data.remaining) || 0)} remaining
        </div>
      )}
    </div>
  )
}
