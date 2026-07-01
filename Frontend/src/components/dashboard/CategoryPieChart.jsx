import React, { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'

// Monochrome grays + one accent white — matches Efferd's pie chart style
const COLORS = ['#ffffff','#888888','#555555','#333333','#444444','#666666','#999999','#222222']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div style={{ background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
      <p style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>{d.name}</p>
      <p className="font-mono" style={{ fontSize: 11, color: '#888888', marginTop: 2 }}>
        ₹{(d.value || 0).toLocaleString('en-IN')} · {d.payload.percent?.toFixed(1)}%
      </p>
    </div>
  )
}

function normaliseData(data) {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (typeof data === 'object') {
    return Object.entries(data).map(([category, amount]) => ({
      category, amount: parseFloat(amount) || 0,
    }))
  }
  return []
}

export default function CategoryPieChart({ data, loading }) {
  const [active, setActive] = useState(null)

  if (loading) return (
    <div className="card" style={{ padding: 18, minHeight: 200 }}>
      <div className="skeleton" style={{ width: 110, height: 11, marginBottom: 18 }} />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="skeleton" style={{ width: 110, height: 110, borderRadius: '50%' }} />
      </div>
    </div>
  )

  const items = normaliseData(data)
  const total = items.reduce((s, d) => s + (d.amount || 0), 0)
  const formatted = items.map((d, i) => ({
    name:    d.category || d.name,
    value:   d.amount   || d.value || 0,
    percent: total ? ((d.amount || d.value || 0) / total * 100) : 0,
    fill:    COLORS[i % COLORS.length],
  }))

  if (formatted.length === 0) return (
    <div className="card" style={{ padding: 18 }}>
      <div className="section-header"><p className="section-title">Category Breakdown</p></div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: 6 }}>
        <p style={{ fontSize: 13, color: '#444444' }}>No expense data yet</p>
        <p style={{ fontSize: 11, color: '#333333' }}>Add transactions to see breakdown</p>
      </div>
    </div>
  )

  return (
    <div className="card" style={{ padding: 18 }}>
      <div className="section-header"><p className="section-title">Category Breakdown</p></div>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie data={formatted} cx="50%" cy="50%" innerRadius={42} outerRadius={62}
            paddingAngle={4} dataKey="value"
            onMouseEnter={(_, i) => setActive(i)}
            onMouseLeave={() => setActive(null)}>
            {formatted.map((entry, i) => (
              <Cell key={i} fill={entry.fill}
                opacity={active === null || active === i ? 1 : 0.35}
                stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 6 }}>
        {formatted.slice(0, 4).map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: item.fill, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: '#666666', fontWeight: 500 }}>{item.name}</span>
            </div>
            <span className="font-mono" style={{ fontSize: 11, color: '#888888', fontWeight: 600 }}>
              {item.percent.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
