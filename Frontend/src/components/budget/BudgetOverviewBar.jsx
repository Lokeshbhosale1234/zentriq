import React from 'react'
import { Link } from 'react-router-dom'

const fmtINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(v) || 0)

export default function BudgetOverviewBar({ analytics, loading }) {
  const items    = analytics || []
  const exceeded = items.filter(a => a.exceeded)
  const nearLimit = items.filter(a => !a.exceeded && (a.percentageUsed || 0) >= 80)

  /* ── Loading ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 140, height: 14 }} />
          <div className="skeleton" style={{ width: 64, height: 12 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div className="skeleton" style={{ width: 100, height: 10 }} />
                <div className="skeleton" style={{ width: 80, height: 10 }} />
              </div>
              <div className="skeleton" style={{ width: '100%', height: 4, borderRadius: 99 }} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── Empty state ─────────────────────────────────────────────── */
  if (items.length === 0) {
    return (
      <div
        className="card"
        style={{
          padding:        '14px 20px',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--indigo-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-light)" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>No budgets for this month</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Set spending limits to automatically track category usage</p>
          </div>
        </div>
        <Link
          to="/budgets"
          className="btn btn-primary"
          style={{ padding: '7px 13px', fontSize: 12, textDecoration: 'none', flexShrink: 0 }}
        >
          Set Budgets
        </Link>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: '18px 20px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <h3 className="font-display font-700" style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 2 }}>
            Budget Overview
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {items.length} budget{items.length !== 1 ? 's' : ''} this month
            {exceeded.length > 0
              ? <span style={{ color: '#f43f5e', fontWeight: 600 }}> · {exceeded.length} exceeded</span>
              : nearLimit.length > 0
              ? <span style={{ color: '#f59e0b', fontWeight: 600 }}> · {nearLimit.length} near limit</span>
              : <span style={{ color: '#10b981', fontWeight: 600 }}> · all on track</span>
            }
          </p>
        </div>
        <Link
          to="/budgets"
          style={{ fontSize: 11, fontWeight: 600, color: 'var(--indigo-light)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, padding: '5px 10px', borderRadius: 7, background: 'var(--indigo-dim)', border: '1px solid rgba(99,102,241,0.15)', transition: 'background 0.14s ease' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--indigo-dim)'}
        >
          Manage
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {/* Exceeded banners */}
      {exceeded.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
          {exceeded.map(a => (
            <div
              key={a.id}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '7px 12px', borderRadius: 9, background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.16)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span style={{ fontSize: 11, color: '#f43f5e', fontWeight: 500 }}>{a.category} budget exceeded</span>
              </div>
              <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: '#f43f5e', flexShrink: 0, marginLeft: 8 }}>
                +{fmtINR(Math.abs(parseFloat(a.remaining) || 0))}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Progress bars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px 20px' }}>
        {items.slice(0, 8).map(a => {
          const pct   = Math.min(parseFloat(a.percentageUsed) || 0, 100)
          const color = a.exceeded ? '#f43f5e' : pct >= 80 ? '#f59e0b' : '#10b981'
          return (
            <div key={a.id} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '50%' }}>
                  {a.category}
                </span>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--text-muted)', flexShrink: 0, marginLeft: 4 }}>
                  {fmtINR(a.spent)} / {fmtINR(a.limitAmount)}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          )
        })}
      </div>

      {items.length > 8 && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 10 }}>
          +{items.length - 8} more ·{' '}
          <Link to="/budgets" style={{ color: 'var(--indigo-light)', textDecoration: 'none' }}>View all</Link>
        </p>
      )}
    </div>
  )
}
