import React from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { CATEGORY_COLORS } from '../../utils/formatters'

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="tooltip-base">
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{d.name}</p>
      <p style={{ fontSize: 13, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
        ${Number(d.value).toLocaleString('en-US', { minimumFractionDigits: 0 })}
      </p>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{d.payload.pct}% of total</p>
    </div>
  )
}

export default function CategoryPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: '20px 22px', minHeight: 296 }}>
        <div className="skeleton" style={{ width: 120, height: 14, marginBottom: 20 }} />
        <div className="skeleton" style={{ width: 160, height: 160, borderRadius: '50%', margin: '0 auto 16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[80, 65, 50].map(w => (
            <div key={w} className="skeleton" style={{ width: `${w}%`, height: 10 }} />
          ))}
        </div>
      </div>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div
        className="card"
        style={{ padding: '20px 22px', minHeight: 296, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="12" cy="12" r="9"/><path d="M9 12h6M12 9v6"/>
          </svg>
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>No expense data yet</p>
        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>Add debit transactions to see your spending breakdown</p>
      </div>
    )
  }

  const total = Object.values(data).reduce((a, b) => a + parseFloat(b), 0)
  const chartData = Object.entries(data)
    .map(([name, value]) => ({
      name,
      value: parseFloat(value),
      pct:   total > 0 ? ((parseFloat(value) / total) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div className="card" style={{ padding: '20px 22px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ marginBottom: 16 }}>
        <h3 className="font-display font-700" style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 3 }}>
          Category Split
        </h3>
        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expense breakdown by category</p>
      </div>

      {/* Donut */}
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={52}
            outerRadius={82}
            paddingAngle={2.5}
            dataKey="value"
            strokeWidth={0}
          >
            {chartData.map((_, i) => (
              <Cell
                key={i}
                fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                style={{ filter: 'none', outline: 'none' }}
              />
            ))}
          </Pie>
          <Tooltip content={<ChartTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend rows */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {chartData.slice(0, 5).map((d, i) => {
          const pct   = parseFloat(d.pct)
          const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
          return (
            <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 3, background: color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 11, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.name}</span>
              <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-muted)', flexShrink: 0 }}>{d.pct}%</span>
              <div style={{ width: 48, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', flexShrink: 0 }}>
                <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: color, borderRadius: 99 }} />
              </div>
            </div>
          )
        })}
        {chartData.length > 5 && (
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, textAlign: 'center' }}>
            +{chartData.length - 5} more categories
          </p>
        )}
      </div>
    </div>
  )
}
