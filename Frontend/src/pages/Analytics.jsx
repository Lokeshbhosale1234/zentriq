import React from 'react'
import BalanceLineChart from '../components/dashboard/BalanceLineChart'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart  from '../components/dashboard/MonthlyBarChart'
import ErrorBanner      from '../components/ui/ErrorBanner'
import { useAnalytics } from '../hooks/useAnalytics'
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters'

function SumCard({ label, value, color, loading }) {
  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
        {label}
      </p>
      {loading
        ? <div className="skeleton" style={{ height: 22, width: '70%' }} />
        : <p className="font-mono" style={{ fontSize: 19, fontWeight: 700, color: color, letterSpacing: '-0.02em' }}>{value}</p>
      }
    </div>
  )
}

export default function Analytics() {
  const { analytics, loading, error, refetch } = useAnalytics()

  const categoryEntries = analytics?.categoryBreakdown
    ? Object.entries(analytics.categoryBreakdown).sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
    : []

  const totalExpense = parseFloat(analytics?.totalExpense || 0)

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ErrorBanner message={error} onRetry={refetch} />

      {/* ── Summary bar ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="sm:grid-cols-4">
        <SumCard label="Net Balance"        value={formatCurrency(analytics?.balance       || 0)} color="#6366f1" loading={loading} />
        <SumCard label="Total Income"       value={formatCurrency(analytics?.totalIncome   || 0)} color="#10b981" loading={loading} />
        <SumCard label="Total Expense"      value={formatCurrency(analytics?.totalExpense  || 0)} color="#f43f5e" loading={loading} />
        <SumCard label="Total Transactions" value={analytics?.totalTransactions || 0}              color="#22d3ee" loading={loading} />
      </div>

      {/* ── Charts row ─────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-2">
        <BalanceLineChart data={analytics?.monthlyTrend}    loading={loading} />
        <MonthlyBarChart  data={analytics?.monthlyTrend}    loading={loading} />
      </div>

      {/* ── Category breakdown ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-3">
        <CategoryPieChart data={analytics?.categoryBreakdown} loading={loading} />

        {/* Detailed breakdown table */}
        <div className="card lg:col-span-2" style={{ overflow: 'hidden' }}>
          {/* Header */}
          <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-display font-700" style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 3 }}>
              Category Breakdown
            </h3>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Expense distribution ranked by amount</p>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 400 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Category', 'Amount', 'Share', 'Visual'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding:       '9px 16px',
                        textAlign:     'left',
                        fontSize:      10,
                        fontWeight:    700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color:         'var(--text-muted)',
                        background:    'rgba(255,255,255,0.012)',
                        whiteSpace:    'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      {[140, 90, 56, 120].map(w => (
                        <td key={w} style={{ padding: '12px 16px' }}>
                          <div className="skeleton" style={{ width: w, height: 10 }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : categoryEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      No expense data available
                    </td>
                  </tr>
                ) : (
                  categoryEntries.map(([cat, val], i) => {
                    const amount = parseFloat(val)
                    const pct    = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
                    const color  = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                    return (
                      <tr
                        key={cat}
                        className="table-row-hover"
                        style={{ borderBottom: '1px solid var(--border-subtle)' }}
                      >
                        <td style={{ padding: '11px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span
                              style={{
                                width:        10,
                                height:       10,
                                borderRadius: 3,
                                background:   color,
                                flexShrink:   0,
                              }}
                            />
                            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{cat}</span>
                          </div>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span className="font-mono" style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatCurrency(amount)}
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px' }}>
                          <span
                            style={{
                              display:     'inline-block',
                              padding:     '2px 7px',
                              borderRadius: 99,
                              fontSize:    10,
                              fontWeight:  700,
                              background:  `${color}15`,
                              color:       color,
                              border:      `1px solid ${color}22`,
                            }}
                          >
                            {pct.toFixed(1)}%
                          </span>
                        </td>
                        <td style={{ padding: '11px 16px', width: 140 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                              <div
                                style={{
                                  width:        `${Math.min(pct, 100)}%`,
                                  height:       '100%',
                                  borderRadius: 99,
                                  background:   color,
                                  transition:   'width 0.7s cubic-bezier(0.34,1.56,0.64,1)',
                                }}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
