import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
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
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
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

export default function BalanceLineChart({ data, loading }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: '20px 22px', minHeight: 296 }}>
        <div className="skeleton" style={{ width: 140, height: 14, marginBottom: 6 }} />
        <div className="skeleton" style={{ width: 200, height: 10, marginBottom: 24 }} />
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
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h3
            className="font-display font-700"
            style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 3 }}
          >
            Cash Flow
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Income vs expenses · last 6 months</p>
        </div>
        <span className="badge badge-purple">6M</span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={218}>
        <AreaChart data={chartData} margin={{ top: 6, right: 2, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#10b981" stopOpacity={0.22} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0}    />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#6366f1" stopOpacity={0.18} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0}    />
            </linearGradient>
          </defs>
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
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
          <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11, paddingTop: 14 }} />
          <Area
            type="monotone" dataKey="income" name="Income"
            stroke="#10b981" strokeWidth={2.2}
            fill="url(#incomeGrad)"
            dot={false}
            activeDot={{ r: 3.5, fill: '#10b981', strokeWidth: 0 }}
          />
          <Area
            type="monotone" dataKey="expense" name="Expense"
            stroke="#6366f1" strokeWidth={2.2}
            fill="url(#expenseGrad)"
            dot={false}
            activeDot={{ r: 3.5, fill: '#6366f1', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
