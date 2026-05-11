import React from 'react'
import StatCard            from '../components/dashboard/StatCard'
import BalanceLineChart    from '../components/dashboard/BalanceLineChart'
import CategoryPieChart    from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart     from '../components/dashboard/MonthlyBarChart'
import RecentTransactions  from '../components/dashboard/RecentTransactions'
import BudgetOverviewBar   from '../components/budget/BudgetOverviewBar'
import ErrorBanner         from '../components/ui/ErrorBanner'
import { useAnalytics }    from '../hooks/useAnalytics'
import { useTransactions } from '../hooks/useTransactions'
import { useBudgetAnalytics } from '../hooks/useBudgetAnalytics'

const IncomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
)
const ExpenseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
  </svg>
)
const BalanceIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
)
const CountIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/>
    <line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
)

export default function Dashboard() {
  const now          = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear  = now.getFullYear()

  const { analytics, loading: aLoading, error: aError, refetch: aRefetch } = useAnalytics()
  const { transactions, loading: tLoading, error: tError }                 = useTransactions()
  const { analytics: budgetAnalytics, loading: bLoading }                  = useBudgetAnalytics(currentMonth, currentYear)

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in">
      <ErrorBanner message={aError || tError} onRetry={aRefetch} />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Income"   value={analytics?.totalIncome   || 0} color="green"  icon={<IncomeIcon />}  loading={aLoading} />
        <StatCard title="Total Expense"  value={analytics?.totalExpense  || 0} color="red"    icon={<ExpenseIcon />} loading={aLoading} />
        <StatCard title="Net Balance"    value={analytics?.balance       || 0} color="purple" icon={<BalanceIcon />} loading={aLoading} />
        <StatCard
          title="Transactions"
          value={analytics?.totalTransactions || 0}
          prefix=""
          color="cyan"
          icon={<CountIcon />}
          loading={aLoading}
        />
      </div>

      {/* Budget overview — shows current month budgets with spend progress */}
      <BudgetOverviewBar analytics={budgetAnalytics} loading={bLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <BalanceLineChart data={analytics?.monthlyTrend} loading={aLoading} />
        </div>
        <div>
          <CategoryPieChart data={analytics?.categoryBreakdown} loading={aLoading} />
        </div>
      </div>

      {/* Bar chart + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlyBarChart  data={analytics?.monthlyTrend} loading={aLoading} />
        <RecentTransactions transactions={transactions}  loading={tLoading} />
      </div>
    </div>
  )
}
