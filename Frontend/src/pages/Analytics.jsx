import React from 'react'
import BalanceLineChart from '../components/dashboard/BalanceLineChart'
import CategoryPieChart from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart  from '../components/dashboard/MonthlyBarChart'
import ErrorBanner      from '../components/ui/ErrorBanner'
import { useAnalytics } from '../hooks/useAnalytics'
import { formatCurrency, CATEGORY_COLORS } from '../utils/formatters'

export default function Analytics() {
  const { analytics, loading, error, refetch } = useAnalytics()

  const categoryEntries = analytics?.categoryBreakdown
    ? Object.entries(analytics.categoryBreakdown)
    : []

  const totalExpense = parseFloat(analytics?.totalExpense || 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <ErrorBanner message={error} onRetry={refetch} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceLineChart data={analytics?.monthlyTrend} loading={loading} />
        <MonthlyBarChart  data={analytics?.monthlyTrend} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie chart */}
        <div>
          <CategoryPieChart data={analytics?.categoryBreakdown} loading={loading} />
        </div>

        {/* Category breakdown table */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
            <h3 className="font-display font-700 text-base" style={{ color: 'var(--text-primary)' }}>
              Category Breakdown
            </h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Expense distribution by category</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Category', 'Amount', 'Share', 'Bar'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-600 uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-5 py-3">
                          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : categoryEntries.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-12" style={{ color: 'var(--text-muted)' }}>
                      No data available
                    </td>
                  </tr>
                ) : (
                  categoryEntries
                    .sort((a, b) => parseFloat(b[1]) - parseFloat(a[1]))
                    .map(([cat, val], i) => {
                      const amount  = parseFloat(val)
                      const pct     = totalExpense > 0 ? (amount / totalExpense) * 100 : 0
                      const color   = CATEGORY_COLORS[i % CATEGORY_COLORS.length]
                      return (
                        <tr key={cat} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
                              <span className="text-sm font-500" style={{ color: 'var(--text-primary)' }}>{cat}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 font-mono text-sm" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(amount)}
                          </td>
                          <td className="px-5 py-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            {pct.toFixed(1)}%
                          </td>
                          <td className="px-5 py-3 w-32">
                            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
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

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Net Balance',       value: analytics?.balance,            color: '#6366f1' },
          { label: 'Total Income',      value: analytics?.totalIncome,        color: '#10b981' },
          { label: 'Total Expense',     value: analytics?.totalExpense,       color: '#ef4444' },
          { label: 'Total Transactions',value: analytics?.totalTransactions,  color: '#06b6d4', isMoney: false },
        ].map(({ label, value, color, isMoney = true }) => (
          <div key={label} className="card p-4">
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className="text-xl font-700 font-mono" style={{ color }}>
              {loading ? '—' : isMoney ? formatCurrency(value || 0) : (value || 0)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
