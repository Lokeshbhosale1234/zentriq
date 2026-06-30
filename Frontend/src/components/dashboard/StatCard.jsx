import React from 'react'
import { formatCurrency } from '../../utils/formatters'

// ─────────────────────────────────────────────────────────────────────────────
// COLOR_MAP — restricted palette
// ─────────────────────────────────────────────────────────────────────────────
// Previously this had 6 colors (green, red, purple, cyan, amber, violet) used
// across the dashboard, which made the UI look busy compared to the reference
// (Efferd) design — which is almost entirely monochrome (white/gray/black)
// with color reserved ONLY for actual gain (green) / loss (red) signals.
//
// "purple", "cyan", "violet" now all resolve to the same neutral "mono" style
// so any card using them automatically becomes monochrome without needing to
// touch every call site.
// ─────────────────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  green: { bg: 'rgba(34,197,94,0.08)', accent: '#22c55e', glow: 'rgba(34,197,94,0.16)', bar: '#22c55e', border: 'rgba(34,197,94,0.18)' },
  red:   { bg: 'rgba(239,68,68,0.08)', accent: '#ef4444', glow: 'rgba(239,68,68,0.16)', bar: '#ef4444', border: 'rgba(239,68,68,0.18)' },
  mono:  { bg: 'rgba(255,255,255,0.05)', accent: '#ffffff', glow: 'rgba(255,255,255,0.08)', bar: 'rgba(255,255,255,0.18)', border: 'rgba(255,255,255,0.1)' },

  // Legacy aliases — kept so existing call sites (Dashboard.jsx etc.) don't break.
  purple: { bg: 'rgba(255,255,255,0.05)', accent: '#ffffff', glow: 'rgba(255,255,255,0.08)', bar: 'rgba(255,255,255,0.18)', border: 'rgba(255,255,255,0.1)' },
  cyan:   { bg: 'rgba(255,255,255,0.05)', accent: '#ffffff', glow: 'rgba(255,255,255,0.08)', bar: 'rgba(255,255,255,0.18)', border: 'rgba(255,255,255,0.1)' },
  amber:  { bg: 'rgba(255,255,255,0.05)', accent: '#ffffff', glow: 'rgba(255,255,255,0.08)', bar: 'rgba(255,255,255,0.18)', border: 'rgba(255,255,255,0.1)' },
  violet: { bg: 'rgba(255,255,255,0.05)', accent: '#ffffff', glow: 'rgba(255,255,255,0.08)', bar: 'rgba(255,255,255,0.18)', border: 'rgba(255,255,255,0.1)' },
}

export default function StatCard({ title, value, icon, color = 'mono', prefix = '₹', loading, trend, trendLabel, subtitle }) {
  const c = COLOR_MAP[color] || COLOR_MAP.mono

  if (loading) {
    return (
      <div className="card" style={{ padding: '20px', minHeight: 120, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 11 }} />
          <div className="skeleton" style={{ width: 50, height: 18, borderRadius: 20 }} />
        </div>
        <div className="skeleton" style={{ width: '45%', height: 9, marginBottom: 10 }} />
        <div className="skeleton" style={{ width: '75%', height: 24 }} />
      </div>
    )
  }

  const displayValue = typeof value === 'number' && prefix !== ''
    ? `${prefix}${formatCurrency(value).replace('$', '').replace('₹', '')}`
    : String(value ?? 0)

  return (
    <div className="card card-hover" style={{ padding: '20px', position: 'relative', overflow: 'hidden', minHeight: 120 }}>
      <div aria-hidden style={{
        position: 'absolute', top: -30, right: -30, width: 100, height: 100,
        borderRadius: '50%', background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: c.bg, color: c.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${c.border}`,
        }}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`badge animate-scale-in ${trend >= 0 ? 'badge-green' : 'badge-red'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5, position: 'relative' }}>
        {title}
      </p>

      <p className="font-mono animate-count-up" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2, position: 'relative' }}>
        {displayValue}
      </p>

      {(trendLabel || subtitle) && (
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, position: 'relative' }}>
          {trendLabel || subtitle}
        </p>
      )}

      <div className="stat-accent-bar" aria-hidden style={{ background: c.bar }} />
    </div>
  )
}
