import React from 'react'
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts'
import { CATEGORY_COLORS } from '../../utils/formatters'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="card p-3 text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <p className="font-600 mb-1" style={{ color: 'var(--text-primary)' }}>{d.name}</p>
      <p className="font-mono" style={{ color: 'var(--text-secondary)' }}>
        ${Number(d.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{d.payload.percent}% of total</p>
    </div>
  )
}

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null
  const RADIAN = Math.PI / 180
  const r = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central"
      style={{ fontSize: 11, fontWeight: 600 }}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function CategoryPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="h-4 w-32 rounded animate-pulse mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-56 rounded-full mx-auto animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', width: '200px' }} />
      </div>
    )
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="card p-5 flex flex-col items-center justify-center" style={{ minHeight: '280px' }}>
        <p style={{ color: 'var(--text-muted)' }}>No category data available</p>
      </div>
    )
  }

  const total = Object.values(data).reduce((a, b) => a + parseFloat(b), 0)
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value: parseFloat(value),
    percent: total > 0 ? ((parseFloat(value) / total) * 100).toFixed(1) : 0,
  }))

  return (
    <div className="card p-5">
      <div className="mb-5">
        <h3 className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
          Category Split
        </h3>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Expense breakdown by category</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
