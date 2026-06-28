import React, { useState } from 'react'
import BalanceLineChart from '../components/dashboard/BalanceLineChart'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart  from '../components/dashboard/MonthlyBarChart'
import ErrorBanner      from '../components/ui/ErrorBanner'
import { useAnalytics } from '../hooks/useAnalytics'
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters'

const CAT_ICONS = {
  'Food': '🍜', 'Dining': '🍜', 'Entertainment': '🎬', 'Transport': '🚗',
  'Utilities': '⚡', 'Shopping': '🛍️', 'Healthcare': '🏥',
  'Education': '📚', 'Travel': '✈️', 'Salary': '💼', 'Other': '💳',
}
function getCatIcon(cat) {
  for (const [k, v] of Object.entries(CAT_ICONS)) {
    if (cat?.toLowerCase().includes(k.toLowerCase())) return v
  }
  return '💳'
}

const COLORS = ['#6366f1','#10b981','#f43f5e','#f59e0b','#22d3ee','#a855f7','#fb923c','#84cc16']

function SumCard({ label, value, color, sub, loading }) {
  return (
    <div className="card card-hover" style={{ padding: '18px 20px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>{label}</p>
      {loading
        ? <div className="skeleton" style={{ height: 24, width: '75%' }} />
        : <p className="font-mono" style={{ fontSize: 21, fontWeight: 800, color, letterSpacing: '-0.03em' }}>{value}</p>}
      {sub && <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</p>}
    </div>
  )
}

export default function Analytics() {
  const { analytics, loading, error, refetch } = useAnalytics()
  const [sortBy, setSortBy] = useState('amount')

  const categoryBreakdown = analytics?.categoryBreakdown || {}
  const categoryEntries = Object.entries(categoryBreakdown)
    .map(([cat, amount]) => ({ cat, amount: parseFloat(amount) || 0 }))
    .sort((a, b) => sortBy === 'amount' ? b.amount - a.amount : a.cat.localeCompare(b.cat))

  const totalExpense = parseFloat(analytics?.totalExpense || 0)
  const savingsRate = analytics?.totalIncome
    ? Math.round(((analytics.totalIncome - analytics.totalExpense) / analytics.totalIncome) * 100)
    : 0

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ErrorBanner message={error} onRetry={refetch} />

      {/* ── Summary stats ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="sm:grid-cols-4">
        <SumCard label="Net Balance"   value={`₹${formatCurrency(analytics?.balance || 0).replace('$','').replace('₹','')}`}  color="#6366f1" sub="Total accumulated" loading={loading} />
        <SumCard label="Total Income"  value={`₹${formatCurrency(analytics?.totalIncome || 0).replace('$','').replace('₹','')}`}  color="#10b981" sub="All income sources" loading={loading} />
        <SumCard label="Total Expense" value={`₹${formatCurrency(analytics?.totalExpense || 0).replace('$','').replace('₹','')}`} color="#f43f5e" sub="All expenses" loading={loading} />
        <SumCard label="Savings Rate"  value={`${savingsRate}%`} color="#22d3ee" sub="Income saved" loading={loading} />
      </div>

      {/* ── Charts row ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-2">
        <BalanceLineChart data={analytics?.monthlyTrend} loading={loading} />
        <MonthlyBarChart  data={analytics?.monthlyTrend} loading={loading} />
      </div>

      {/* ── Category detail ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-3">
        <CategoryPieChart data={analytics?.categoryBreakdown} loading={loading} />

        <div className="card lg:col-span-2" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Category Breakdown</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Expense distribution by category</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['amount', 'name'].map(s => (
                <button key={s} onClick={() => setSortBy(s)} style={{
                  fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6,
                  background: sortBy === s ? 'var(--indigo-dim)' : 'var(--bg-input)',
                  color: sortBy === s ? 'var(--indigo-light)' : 'var(--text-muted)',
                  border: `1px solid ${sortBy === s ? 'rgba(99,102,241,0.25)' : 'var(--border)'}`,
                  cursor: 'pointer', textTransform: 'capitalize',
                }}>
                  {s === 'amount' ? 'By spend' : 'A–Z'}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflow: 'auto', maxHeight: 400 }}>
            {loading ? (
              <div style={{ padding: 20 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ width: '45%', height: 10, marginBottom: 8 }} />
                      <div className="skeleton" style={{ height: 4, borderRadius: 99 }} />
                    </div>
                    <div className="skeleton" style={{ width: 60, height: 12 }} />
                  </div>
                ))}
              </div>
            ) : categoryEntries.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No expense data yet</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Add transactions to see category breakdown</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Spending</th>
                    <th>% of Total</th>
                    <th>Distribution</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryEntries.map(({ cat, amount }, i) => {
                    const pct = totalExpense ? (amount / totalExpense * 100) : 0
                    const color = COLORS[i % COLORS.length]
                    return (
                      <tr key={cat}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                              {getCatIcon(cat)}
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{cat}</span>
                          </div>
                        </td>
                        <td>
                          <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
                            ₹{amount.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ background: `${color}15`, color, border: `1px solid ${color}30`, fontSize: 10 }}>
                            {pct.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ width: 140 }}>
                          <div className="progress-track" style={{ width: 120 }}>
                            <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* ── Spending forecast placeholder ─────────────────────────── */}
      <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(34,211,238,0.05) 0%, rgba(99,102,241,0.03) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>AI Spending Forecast</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>Predict next month's expenses using your spending patterns</p>
            </div>
          </div>
          <span className="coming-soon-badge" style={{ padding: '4px 12px', fontSize: 10 }}>Coming Soon</span>
        </div>
      </div>
    </div>
  )
}
