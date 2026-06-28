import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.fill }} />
          <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span className="font-mono" style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-primary)' }}>₹{(p.value||0).toLocaleString('en-IN')}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBarChart({ data, loading }) {
  if (loading) return (
    <div className="card" style={{ padding: 20, minHeight: 240 }}>
      <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 24 }} />
      <div className="skeleton" style={{ height: 170, borderRadius: 10 }} />
    </div>
  )

  const formatted = (data || []).map(d => ({
    month: d.month?.slice(0, 3) || d.month,
    income: d.income || 0,
    expense: d.expense || 0,
    net: (d.income || 0) - (d.expense || 0),
  }))

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <p className="section-title">Monthly Overview</p>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ label: 'Income', color: '#6366f1' }, { label: 'Expense', color: '#f43f5e' }].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 4, borderRadius: 2, background: l.color }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={formatted} barGap={4} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 600 }} axisLine={false} tickLine={false} dy={6} />
          <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="income" name="Income" fill="#6366f1" radius={[4,4,0,0]} maxBarSize={28} />
          <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4,4,0,0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
