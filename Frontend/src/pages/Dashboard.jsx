import React from 'react'
import StatCard           from '../components/dashboard/StatCard'
import BalanceLineChart   from '../components/dashboard/BalanceLineChart'
import CategoryPieChart   from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart    from '../components/dashboard/MonthlyBarChart'
import RecentTransactions from '../components/dashboard/RecentTransactions'
import BudgetOverviewBar  from '../components/budget/BudgetOverviewBar'
import ErrorBanner        from '../components/ui/ErrorBanner'
import { useAnalytics }   from '../hooks/useAnalytics'
import { useTransactions } from '../hooks/useTransactions'
import { useBudgetAnalytics } from '../hooks/useBudgetAnalytics'

/* ── Icon components (inline to keep imports zero) ─────────────── */
const IconIncome = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
)
const IconExpense = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
    <polyline points="17 18 23 18 23 12"/>
  </svg>
)
const IconBalance = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
)
const IconCount = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/>
    <line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

export default function Dashboard() {
  const now = new Date()
  const { analytics, loading: aLoading, error: aError, refetch: aRefetch } = useAnalytics()
  const { transactions, loading: tLoading, error: tError }                 = useTransactions()
  const { analytics: budgetData, loading: bLoading }                       = useBudgetAnalytics(now.getMonth() + 1, now.getFullYear())

  const combinedError = aError || tError

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      <ErrorBanner message={combinedError} onRetry={aRefetch} />

      {/* ── Stat cards ─────────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 14,
      }}
        className="lg:grid-cols-4"
      >
        <StatCard
          title="Total Income"
          value={analytics?.totalIncome ?? 0}
          color="green"
          icon={<IconIncome />}
          loading={aLoading}
        />
        <StatCard
          title="Total Expense"
          value={analytics?.totalExpense ?? 0}
          color="red"
          icon={<IconExpense />}
          loading={aLoading}
        />
        <StatCard
          title="Net Balance"
          value={analytics?.balance ?? 0}
          color="purple"
          icon={<IconBalance />}
          loading={aLoading}
        />
        <StatCard
          title="Transactions"
          value={analytics?.totalTransactions ?? 0}
          prefix=""
          color="cyan"
          icon={<IconCount />}
          loading={aLoading}
        />
      </div>

      {/* ── Budget overview strip ──────────────────────────────── */}
      <BudgetOverviewBar analytics={budgetData} loading={bLoading} />

      {/* ── Charts row ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceLineChart data={analytics?.monthlyTrend} loading={aLoading} />
        </div>
        <CategoryPieChart data={analytics?.categoryBreakdown} loading={aLoading} />
      </div>

      {/* ── Bottom row ────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-2">
        <MonthlyBarChart  data={analytics?.monthlyTrend} loading={aLoading} />
        <RecentTransactions transactions={transactions}   loading={tLoading} />
      </div>
    </div>
  )
}
