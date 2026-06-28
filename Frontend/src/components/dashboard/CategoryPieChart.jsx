import React, { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

const COLORS = ['#6366f1','#10b981','#f43f5e','#f59e0b','#22d3ee','#a855f7','#fb923c','#84cc16']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{d.name}</p>
      <p className="font-mono" style={{ fontSize: 12, color: d.payload.fill, marginTop: 2 }}>
        ₹{(d.value || 0).toLocaleString('en-IN')} · {d.payload.percent?.toFixed(1)}%
      </p>
    </div>
  )
}

export default function CategoryPieChart({ data, loading }) {
  const [active, setActive] = useState(null)

  if (loading) return (
    <div className="card" style={{ padding: 20, minHeight: 260 }}>
      <div className="skeleton" style={{ width: 120, height: 12, marginBottom: 24 }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}><div className="skeleton" style={{ width: 140, height: 140, borderRadius: '50%' }} /></div>
    </div>
  )

  const total = (data || []).reduce((s, d) => s + (d.amount || d.value || 0), 0)
  const formatted = (data || []).map((d, i) => ({
    name: d.category || d.name,
    value: d.amount || d.value || 0,
    percent: total ? ((d.amount || d.value || 0) / total * 100) : 0,
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <p className="section-title">Category Breakdown</p>
      </div>
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={formatted} cx="50%" cy="50%"
            innerRadius={50} outerRadius={72}
            paddingAngle={3} dataKey="value"
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            {formatted.map((entry, i) => (
              <Cell key={i} fill={entry.fill} opacity={active === null || active === i ? 1 : 0.4}
                stroke="transparent" style={{ transition: 'opacity 0.15s' }} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
        {formatted.slice(0, 5).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.fill, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{item.name}</span>
            </div>
            <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 600 }}>
              {item.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
