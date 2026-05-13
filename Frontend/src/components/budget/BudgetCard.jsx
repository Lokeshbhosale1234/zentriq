import React from 'react'
import { CATEGORY_COLORS, CATEGORIES } from '../../utils/formatters'

const fmtINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(v) || 0)

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const CAT_EMOJI = {
  'Food & Dining':  '🍽', 'Shopping':       '🛍',
  'Transportation': '🚗', 'Entertainment':  '🎬',
  'Healthcare':     '⚕',  'Education':      '📚',
  'Utilities':      '💡', 'Travel':         '✈',
  'Salary':         '💼', 'Freelance':      '💻',
  'Investment':     '📈', 'Other':          '📦',
}

export default function BudgetCard({ data, onEdit, onDelete, isAnalytics = false }) {
  const colorIdx = Math.max(CATEGORIES.indexOf(data.category), 0)
  const accent   = CATEGORY_COLORS[colorIdx % CATEGORY_COLORS.length]

  const pct      = isAnalytics ? Math.min(parseFloat(data.percentageUsed) || 0, 100) : 0
  const exceeded = isAnalytics && data.exceeded

  const barColor  = exceeded ? '#f43f5e' : pct >= 80 ? '#f59e0b' : '#10b981'
  const statusCls = exceeded ? 'badge-red' : pct >= 80 ? 'badge-amber' : 'badge-green'
  const statusLbl = exceeded ? 'Over limit' : pct >= 80 ? 'Near limit' : 'On track'
  const month     = MONTH_SHORT[(data.month || 1) - 1]

  return (
    <div
      className="card card-hover"
      style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 14 }}
    >
      {/* Accent top strip */}
      <div
        aria-hidden="true"
        style={{
          position:   'absolute',
          top:        0,
          left:       0,
          right:      0,
          height:     2,
          background: isAnalytics
            ? `linear-gradient(90deg, ${barColor}, ${barColor}88)`
            : `linear-gradient(90deg, ${accent}, ${accent}55)`,
          borderRadius: '16px 16px 0 0',
        }}
      />
      {/* Corner glow */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           -20,
          right:         -20,
          width:         80,
          height:        80,
          borderRadius:  '50%',
          background:    `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* ── Header row ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        {/* Left: icon + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div
            style={{
              width:          36,
              height:         36,
              borderRadius:   10,
              background:     `${accent}15`,
              border:         `1px solid ${accent}22`,
              color:          accent,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       16,
              flexShrink:     0,
            }}
          >
            {CAT_EMOJI[data.category] || '💰'}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>
              {data.category}
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>{month} {data.year}</p>
          </div>
        </div>

        {/* Right: status + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {isAnalytics && <span className={`badge ${statusCls}`}>{statusLbl}</span>}
          <div style={{ display: 'flex', gap: 4 }}>
            {onEdit && (
              <button
                onClick={() => onEdit(data)}
                title="Edit"
                style={{
                  width:          26, height: 26,
                  borderRadius:   7,
                  display:        'flex', alignItems: 'center', justifyContent: 'center',
                  background:     'rgba(255,255,255,0.04)',
                  border:         '1px solid var(--border)',
                  color:          'var(--text-muted)',
                  cursor:         'pointer',
                  transition:     'all 0.14s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'var(--text-muted)' }}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(data.id)}
                title="Delete"
                style={{
                  width:          26, height: 26,
                  borderRadius:   7,
                  display:        'flex', alignItems: 'center', justifyContent: 'center',
                  background:     'var(--red-dim)',
                  border:         '1px solid rgba(244,63,94,0.18)',
                  color:          'var(--red)',
                  cursor:         'pointer',
                  transition:     'all 0.14s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--red-dim)'}
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Amount rows ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Limit</span>
          <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
            {fmtINR(data.limitAmount)}
          </span>
        </div>
        {isAnalytics && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Spent</span>
              <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: exceeded ? '#f43f5e' : 'var(--text-primary)' }}>
                {fmtINR(data.spent)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Remaining</span>
              <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: exceeded ? '#f43f5e' : '#10b981' }}>
                {exceeded ? '−' : ''}{fmtINR(Math.abs(parseFloat(data.remaining) || 0))}
              </span>
            </div>
          </>
        )}
      </div>

      {/* ── Progress bar ─────────────────────────────────────────── */}
      {isAnalytics && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Usage</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: barColor }}>{(parseFloat(data.percentageUsed) || 0).toFixed(1)}%</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${pct}%`, background: barColor }}
            />
          </div>
        </div>
      )}

      {/* ── Alert strip ──────────────────────────────────────────── */}
      {isAnalytics && exceeded && (
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        7,
            padding:    '8px 11px',
            borderRadius: 9,
            background: 'rgba(244,63,94,0.08)',
            border:     '1px solid rgba(244,63,94,0.18)',
            fontSize:   11,
            color:      '#f43f5e',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Exceeded by {fmtINR(Math.abs(parseFloat(data.remaining) || 0))}
        </div>
      )}
      {isAnalytics && !exceeded && pct >= 80 && (
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        7,
            padding:    '8px 11px',
            borderRadius: 9,
            background: 'rgba(245,158,11,0.08)',
            border:     '1px solid rgba(245,158,11,0.18)',
            fontSize:   11,
            color:      '#f59e0b',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {(100 - pct).toFixed(1)}% remaining — watch your spending
        </div>
      )}
    </div>
  )
}
