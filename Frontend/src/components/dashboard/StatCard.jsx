import React from 'react'
import { formatCurrency } from '../../utils/formatters'

export default function StatCard({ title, value, icon, color, change, prefix = '$', loading }) {
  const colorMap = {
    purple: { bg: 'rgba(99,102,241,0.12)',  icon: '#6366f1', glow: 'rgba(99,102,241,0.2)' },
    green:  { bg: 'rgba(16,185,129,0.12)',  icon: '#10b981', glow: 'rgba(16,185,129,0.2)' },
    red:    { bg: 'rgba(239,68,68,0.12)',   icon: '#ef4444', glow: 'rgba(239,68,68,0.2)'  },
    cyan:   { bg: 'rgba(6,182,212,0.12)',   icon: '#06b6d4', glow: 'rgba(6,182,212,0.2)'  },
    amber:  { bg: 'rgba(245,158,11,0.12)',  icon: '#f59e0b', glow: 'rgba(245,158,11,0.2)' },
  }
  const c = colorMap[color] || colorMap.purple

  return (
    <div className="card p-5 animate-slide-up" style={{ '--glow': c.glow }}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: c.bg, color: c.icon, boxShadow: `0 0 16px ${c.glow}` }}>
          {icon}
        </div>
        {change !== undefined && (
          <span className={`badge ${change >= 0 ? 'badge-green' : 'badge-red'}`}>
            {change >= 0 ? '↑' : '↓'} {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: '60%' }} />
          <div className="h-7 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: '80%' }} />
        </div>
      ) : (
        <>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{title}</p>
          <p className="text-2xl font-700 font-mono tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {prefix}{formatCurrency(value).replace('$', '')}
          </p>
        </>
      )}
    </div>
  )
}
