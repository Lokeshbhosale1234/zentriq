import React from 'react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend
} from 'recharts'
import { formatCurrency } from '../../utils/formatters'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="font-mono" style={{ fontSize: 11, color: 'var(--text-primary)', fontWeight: 700 }}>
            ₹{(p.value || 0).toLocaleString('en-IN')}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function BalanceLineChart({ data, loading }) {
  if (loading) return (
    <div className="card" style={{ padding: 20, minHeight: 260 }}>
      <div className="skeleton" style={{ width: 160, height: 12, marginBottom: 8 }} />
      <div className="skeleton" style={{ width: 100, height: 9, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 180, borderRadius: 10 }} />
    </div>
  )

  const formatted = (data || []).map(d => ({
    ...d,
    month: d.month?.slice(0, 3) || d.month,
  }))

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <div>
          <p className="section-title">Spending Trends</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Monthly income vs expenses</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ label: 'Income', color: '#10b981' }, { label: 'Expense', color: '#f43f5e' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: l.color }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} />
          <Area type="monotone" dataKey="expense" name="Expense" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4, fill: '#f43f5e', strokeWidth: 0 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
