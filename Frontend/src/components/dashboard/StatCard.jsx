import React from 'react'
import { formatCurrency } from '../../utils/formatters'

const COLOR_MAP = {
  green:  { bg: 'rgba(16,185,129,0.08)',  accent: '#10b981', glow: 'rgba(16,185,129,0.2)',  bar: 'linear-gradient(90deg,#10b981,#34d399)', border: 'rgba(16,185,129,0.15)' },
  red:    { bg: 'rgba(244,63,94,0.08)',   accent: '#f43f5e', glow: 'rgba(244,63,94,0.2)',   bar: 'linear-gradient(90deg,#f43f5e,#fb7185)',  border: 'rgba(244,63,94,0.15)'  },
  purple: { bg: 'rgba(99,102,241,0.1)',   accent: '#6366f1', glow: 'rgba(99,102,241,0.22)', bar: 'linear-gradient(90deg,#6366f1,#818cf8)',  border: 'rgba(99,102,241,0.18)' },
  cyan:   { bg: 'rgba(34,211,238,0.08)',  accent: '#22d3ee', glow: 'rgba(34,211,238,0.2)',  bar: 'linear-gradient(90deg,#22d3ee,#67e8f9)',  border: 'rgba(34,211,238,0.15)' },
  amber:  { bg: 'rgba(245,158,11,0.08)',  accent: '#f59e0b', glow: 'rgba(245,158,11,0.2)',  bar: 'linear-gradient(90deg,#f59e0b,#fcd34d)',  border: 'rgba(245,158,11,0.15)' },
  violet: { bg: 'rgba(168,85,247,0.08)',  accent: '#a855f7', glow: 'rgba(168,85,247,0.22)', bar: 'linear-gradient(90deg,#a855f7,#c084fc)',  border: 'rgba(168,85,247,0.18)' },
}

export default function StatCard({ title, value, icon, color = 'purple', prefix = '₹', loading, trend, trendLabel, subtitle }) {
  const c = COLOR_MAP[color] || COLOR_MAP.purple

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
      {/* Top glow */}
      <div aria-hidden style={{
        position: 'absolute', top: -30, right: -30, width: 100, height: 100,
        borderRadius: '50%', background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      {/* Shine */}
      <div aria-hidden style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.025) 0%, transparent 60%)',
        borderRadius: 'inherit', pointerEvents: 'none',
      }} />

      {/* Icon + trend row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11,
          background: c.bg, color: c.accent,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 16px ${c.glow}`,
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

      {/* Label */}
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5, position: 'relative' }}>
        {title}
      </p>

      {/* Value */}
      <p className="font-mono animate-count-up" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.2, position: 'relative' }}>
        {displayValue}
      </p>

      {(trendLabel || subtitle) && (
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5, position: 'relative' }}>
          {trendLabel || subtitle}
        </p>
      )}

      {/* Bottom accent */}
      <div className="stat-accent-bar" aria-hidden style={{ background: c.bar }} />
    </div>
  )
}
