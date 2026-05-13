import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, Cell,
} from 'recharts'
import { formatMonth } from '../../utils/formatters'

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="tooltip-base" style={{ minWidth: 160 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
        {formatMonth(label)}
      </p>
      {payload.map(p => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: 2, background: p.fill, display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.name}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>
            ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBarChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: '20px 22px', minHeight: 296 }}>
        <div className="skeleton" style={{ width: 160, height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: 220, height: 10, marginBottom: 24 }} />
        <div className="skeleton" style={{ width: '100%', height: 200, borderRadius: 12 }} />
      </div>
    )
  }

  const chartData = (data || []).map(d => ({
    ...d,
    income:  parseFloat(d.income)  || 0,
    expense: parseFloat(d.expense) || 0,
  }))

  return (
    <div className="card" style={{ padding: '20px 22px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3 className="font-display font-700" style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 3 }}>
            Monthly Comparison
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Side-by-side income & expense</p>
        </div>
        <span className="badge badge-purple">6M</span>
      </div>

      <ResponsiveContainer width="100%" height={218}>
        <BarChart data={chartData} margin={{ top: 4, right: 2, left: -24, bottom: 0 }} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            tick={{ fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={v => v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
          <Legend iconType="square" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 14 }} />
          <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={36} />
          <Bar dataKey="expense" name="Expense" fill="#6366f1" radius={[3, 3, 0, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
