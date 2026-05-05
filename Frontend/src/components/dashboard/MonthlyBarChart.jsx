import React from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts'
import { formatMonth } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="card p-3 text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      <p className="mb-2 font-600" style={{ color: 'var(--text-primary)' }}>{formatMonth(label)}</p>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm" style={{ background: p.fill }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="font-600 font-mono" style={{ color: 'var(--text-primary)' }}>
            ${Number(p.value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBarChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card p-5">
        <div className="h-4 w-40 rounded animate-pulse mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="h-56 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
      </div>
    )
  }

  const chartData = (data || []).map(d => ({
    ...d,
    income:  parseFloat(d.income)  || 0,
    expense: parseFloat(d.expense) || 0,
  }))

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
            Monthly Comparison
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Side-by-side income & expense</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickFormatter={formatMonth} tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <Bar dataKey="income"  name="Income"  fill="#10b981" radius={[4,4,0,0]} maxBarSize={40} />
          <Bar dataKey="expense" name="Expense" fill="#6366f1" radius={[4,4,0,0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
