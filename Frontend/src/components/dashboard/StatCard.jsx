import React from 'react'
import { formatCurrency } from '../../utils/formatters'

const COLOR_MAP = {
  green:  { bg: 'rgba(16,185,129,0.09)',  accent: '#10b981', glow: 'rgba(16,185,129,0.18)', bar: 'linear-gradient(90deg,#10b981,#34d399)' },
  red:    { bg: 'rgba(244,63,94,0.09)',   accent: '#f43f5e', glow: 'rgba(244,63,94,0.18)',  bar: 'linear-gradient(90deg,#f43f5e,#fb7185)'  },
  purple: { bg: 'rgba(99,102,241,0.09)',  accent: '#6366f1', glow: 'rgba(99,102,241,0.18)', bar: 'linear-gradient(90deg,#6366f1,#818cf8)'  },
  cyan:   { bg: 'rgba(34,211,238,0.09)',  accent: '#22d3ee', glow: 'rgba(34,211,238,0.18)', bar: 'linear-gradient(90deg,#22d3ee,#67e8f9)'  },
  amber:  { bg: 'rgba(245,158,11,0.09)',  accent: '#f59e0b', glow: 'rgba(245,158,11,0.18)', bar: 'linear-gradient(90deg,#f59e0b,#fcd34d)'  },
}

export default function StatCard({ title, value, icon, color = 'purple', prefix = '$', loading, trend, trendLabel }) {
  const c = COLOR_MAP[color] || COLOR_MAP.purple

  if (loading) {
    return (
      <div className="card" style={{ padding: '18px 20px', minHeight: 116, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 10 }} />
          <div className="skeleton" style={{ width: 52, height: 18, borderRadius: 20 }} />
        </div>
        <div className="skeleton" style={{ width: '55%', height: 10, marginBottom: 8 }} />
        <div className="skeleton" style={{ width: '80%', height: 22 }} />
      </div>
    )
  }

  return (
    <div
      className="card card-hover"
      style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden', minHeight: 116 }}
    >
      {/* Corner radial glow */}
      <div
        aria-hidden="true"
        style={{
          position:      'absolute',
          top:           -24,
          right:         -24,
          width:         96,
          height:        96,
          borderRadius:  '50%',
          background:    `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Subtle card shine */}
      <div
        aria-hidden="true"
        style={{
          position:        'absolute',
          inset:           0,
          background:      'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, transparent 55%)',
          pointerEvents:   'none',
          borderRadius:    'inherit',
        }}
      />

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, position: 'relative' }}>
        {/* Icon */}
        <div
          style={{
            width:          38,
            height:         38,
            borderRadius:   10,
            background:     c.bg,
            color:          c.accent,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            boxShadow:      `0 0 14px ${c.glow}`,
            border:         `1px solid ${c.accent}22`,
          }}
        >
          {icon}
        </div>

        {/* Trend */}
        {trend !== undefined && (
          <span
            className={`badge animate-scale-in ${trend >= 0 ? 'badge-green' : 'badge-red'}`}
          >
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Label */}
      <p
        style={{
          fontSize:      10,
          fontWeight:    700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color:         'var(--text-muted)',
          marginBottom:  4,
          position:      'relative',
        }}
      >
        {title}
      </p>

      {/* Value */}
      <p
        className="font-mono number-in"
        style={{
          fontSize:      22,
          fontWeight:    700,
          letterSpacing: '-0.03em',
          color:         'var(--text-primary)',
          lineHeight:    1.2,
          position:      'relative',
        }}
      >
        {prefix}{formatCurrency(value).replace('$', '')}
      </p>

      {trendLabel && (
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, position: 'relative' }}>
          {trendLabel}
        </p>
      )}

      {/* Bottom accent bar — appears on hover via CSS */}
      <div
        className="stat-accent-bar"
        aria-hidden="true"
        style={{ background: c.bar }}
      />
    </div>
  )
}
