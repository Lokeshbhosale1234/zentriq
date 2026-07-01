import React, { useEffect, useState } from 'react'
import StatCard            from '../components/dashboard/StatCard'
import BalanceLineChart    from '../components/dashboard/BalanceLineChart'
import CategoryPieChart    from '../components/dashboard/CategoryPieChart'
import RecentTransactions  from '../components/dashboard/RecentTransactions'
import BudgetOverviewBar   from '../components/budget/BudgetOverviewBar'
import ErrorBanner         from '../components/ui/ErrorBanner'
import HealthScoreWidget   from '../components/dashboard/HealthScoreWidget'
import AIRecommendations   from '../components/dashboard/AIRecommendations'
import { useAnalytics }    from '../hooks/useAnalytics'
import { useTransactions } from '../hooks/useTransactions'
import { useBudgetAnalytics } from '../hooks/useBudgetAnalytics'
import { fetchInsightsSummary } from '../api/insights'
import { useAuth }         from '../context/AuthContext'

/* ── Icons ──────────────────────────────────────────────────────── */
const IconIncome  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IconExpense = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
const IconBalance = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
const IconCount   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>

export default function Dashboard() {
  const now = new Date()
  const { user } = useAuth()
  const { analytics, loading: aLoading, error: aError, refetch: aRefetch } = useAnalytics()
  const { transactions, loading: tLoading }                                  = useTransactions()
  const { analytics: budgetData, loading: bLoading }                         = useBudgetAnalytics(now.getMonth() + 1, now.getFullYear())
  const [insightData,    setInsightData]    = useState(null)
  const [insightLoading, setInsightLoading] = useState(false)

  useEffect(() => {
    setInsightLoading(true)
    fetchInsightsSummary()
      .then(d => setInsightData(d?.data || d || null))
      .catch(() => null)
      .finally(() => setInsightLoading(false))
  }, [])

  const greeting    = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const firstName   = user?.name?.split(' ')[0] || 'there'
  const savings     = (analytics?.totalIncome ?? 0) - (analytics?.totalExpense ?? 0)
  const savingsRate = analytics?.totalIncome ? Math.round((savings / analytics.totalIncome) * 100) : 0

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      <ErrorBanner message={aError} onRetry={aRefetch} />

      {/* ── Greeting ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
            {greeting}, {firstName}
          </h2>
          <p style={{ fontSize: 12, color: '#555555', marginTop: 2 }}>
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 99, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 700 }}>All systems normal</span>
        </div>
      </div>

      {/* ── Stat row — 2 cols mobile, 4 cols desktop ──────────────── */}
      <div className="dash-stats">
        <StatCard title="Monthly Income"   value={analytics?.totalIncome ?? 0}       color="green" icon={<IconIncome />}  loading={aLoading} prefix="₹" subtitle="This month" />
        <StatCard title="Monthly Expenses" value={analytics?.totalExpense ?? 0}      color="red"   icon={<IconExpense />} loading={aLoading} prefix="₹" subtitle="Total spent" />
        <StatCard title="Net Savings"      value={savings}                            color="mono"  icon={<IconBalance />} loading={aLoading} prefix="₹" subtitle={`${savingsRate}% savings rate`} />
        <StatCard title="Transactions"     value={analytics?.totalTransactions ?? 0} color="mono"  icon={<IconCount />}   loading={aLoading} prefix="" subtitle="This month" />
      </div>

      {/* ── Main 3-column grid ────────────────────────────────────── */}
      {/*
        Desktop (≥768px):  [Spending Trends — 2 cols] [Health Score — 1 col]
        Mobile  (<768px):  single column, stacks in source order
      */}
      <div className="dash-grid">

        {/* Spending Trends — wide */}
        <div className="col-2">
          <BalanceLineChart data={analytics?.monthlyTrend} loading={aLoading} />
        </div>

        {/* Health Score — narrow */}
        <div className="col-1">
          <HealthScoreWidget
            score={insightData?.healthScore?.score ?? 72}
            breakdown={[
              { label: 'Savings Rate',     value: insightData?.healthScore?.savingsRatio ?? 0,       color: '#22c55e' },
              { label: 'Budget Adherence', value: insightData?.healthScore?.budgetAdherence ?? 0,     color: '#ffffff' },
              { label: 'Expense Control',  value: insightData?.healthScore?.spendingStability ?? 0,   color: '#888888' },
              { label: 'Overspending',     value: insightData?.healthScore?.overspendingPenalty ?? 0, color: '#ef4444' },
            ]}
            loading={insightLoading}
          />
        </div>

        {/* Category Breakdown — 1 col */}
        <div className="col-1">
          <CategoryPieChart data={analytics?.categoryBreakdown} loading={aLoading} />
        </div>

        {/* Budget Overview — 1 col */}
        <div className="col-1">
          <BudgetOverviewBar analytics={budgetData} loading={bLoading} />
        </div>

        {/* AI Recommendations — 1 col */}
        <div className="col-1">
          <AIRecommendations
            insights={insightData?.insights || insightData?.topInsights || []}
            loading={insightLoading}
          />
        </div>

        {/* Recent Transactions — full width */}
        <div className="col-3">
          <RecentTransactions transactions={transactions} loading={tLoading} />
        </div>

      </div>

    </div>
  )
}
