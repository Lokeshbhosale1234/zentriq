import React, { useEffect, useState } from 'react'
import StatCard            from '../components/dashboard/StatCard'
import BalanceLineChart    from '../components/dashboard/BalanceLineChart'
import CategoryPieChart    from '../components/dashboard/CategoryPieChart'
import MonthlyBarChart     from '../components/dashboard/MonthlyBarChart'
import RecentTransactions  from '../components/dashboard/RecentTransactions'
import BudgetOverviewBar   from '../components/budget/BudgetOverviewBar'
import ErrorBanner         from '../components/ui/ErrorBanner'
import HealthScoreWidget   from '../components/dashboard/HealthScoreWidget'
import QuickActions        from '../components/dashboard/QuickActions'
import UpcomingBills       from '../components/dashboard/UpcomingBills'
import AIRecommendations   from '../components/dashboard/AIRecommendations'
import GoalsWidget         from '../components/dashboard/GoalsWidget'
import { useAnalytics }    from '../hooks/useAnalytics'
import { useTransactions } from '../hooks/useTransactions'
import { useBudgetAnalytics } from '../hooks/useBudgetAnalytics'
import { fetchInsightsSummary } from '../api/insights'
import { useAuth }         from '../context/AuthContext'

/* ── Icons ──────────────────────────────────────────────────────── */
const IconIncome  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
const IconExpense = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>
const IconBalance = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
const IconCount   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>

export default function Dashboard() {
  const now = new Date()
  const { user } = useAuth()
  const { analytics, loading: aLoading, error: aError, refetch: aRefetch } = useAnalytics()
  const { transactions, loading: tLoading, error: tError }                 = useTransactions()
  const { analytics: budgetData, loading: bLoading }                       = useBudgetAnalytics(now.getMonth() + 1, now.getFullYear())
  const [insightData, setInsightData] = useState(null)
  const [insightLoading, setInsightLoading] = useState(false)

  useEffect(() => {
    setInsightLoading(true)
    fetchInsightsSummary()
      .then(d => setInsightData(d?.data || d || null))
      .catch(() => null)
      .finally(() => setInsightLoading(false))
  }, [])

  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = user?.name?.split(' ')[0] || 'there'
  const combinedError = aError || tError

  const savings = (analytics?.totalIncome ?? 0) - (analytics?.totalExpense ?? 0)
  const savingsRate = analytics?.totalIncome ? Math.round((savings / analytics.totalIncome) * 100) : 0

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Error Banner ──────────────────────────────────────────── */}
      <ErrorBanner message={combinedError} onRetry={aRefetch} />

      {/* ── Hero greeting row ─────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            {greeting}, {firstName} 👋
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
            {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ padding: '8px 14px', borderRadius: 10, background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>All systems normal</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="lg:grid-cols-4">
        <StatCard
          title="Monthly Income"
          value={analytics?.totalIncome ?? 0}
          color="green"
          icon={<IconIncome />}
          loading={aLoading}
          prefix="₹"
          subtitle="This month's total"
        />
        <StatCard
          title="Monthly Expenses"
          value={analytics?.totalExpense ?? 0}
          color="red"
          icon={<IconExpense />}
          loading={aLoading}
          prefix="₹"
          subtitle="Total spent this month"
        />
        <StatCard
          title="Net Savings"
          value={savings}
          color="purple"
          icon={<IconBalance />}
          loading={aLoading}
          prefix="₹"
          subtitle={`Savings rate: ${savingsRate}%`}
        />
        <StatCard
          title="Transactions"
          value={analytics?.totalTransactions ?? 0}
          color="cyan"
          icon={<IconCount />}
          loading={aLoading}
          prefix=""
          subtitle="Total this month"
        />
      </div>

      {/* ── Health Score + Budget Overview ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-5">
        <div className="lg:col-span-2">

          <HealthScoreWidget
  score={insightData?.healthScore?.score ?? 72}
  breakdown={[
    {
      label: "Savings Rate",
      value: insightData?.healthScore?.savingsRatio ?? 0,
      color: "#10b981",
    },
    {
      label: "Budget Adherence",
      value: insightData?.healthScore?.budgetAdherence ?? 0,
      color: "#6366f1",
    },
    {
      label: "Expense Control",
      value: insightData?.healthScore?.spendingStability ?? 0,
      color: "#22d3ee",
    },
    {
      label: "Overspending",
      value: insightData?.healthScore?.overspendingPenalty ?? 0,
      color: "#ef4444",
    },
  ]}
  loading={insightLoading}
/>
        </div>
        <div className="lg:col-span-3">
          <BudgetOverviewBar analytics={budgetData} loading={bLoading} />
        </div>
      </div>

      {/* ── Main Charts Row ───────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceLineChart data={analytics?.monthlyTrend} loading={aLoading} />
        </div>
        <CategoryPieChart data={analytics?.categoryBreakdown} loading={aLoading} />
      </div>

      {/* ── AI Recommendations + Monthly Chart ───────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-2">
        <AIRecommendations
          insights={insightData?.insights || insightData?.topInsights || []}
          loading={insightLoading}
        />
        <MonthlyBarChart data={analytics?.monthlyTrend} loading={aLoading} />
      </div>

      {/* ── Bottom Row: Transactions + Quick Actions + Goals ─────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentTransactions transactions={transactions} loading={tLoading} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <QuickActions />
        </div>
      </div>

      {/* ── Goals + Upcoming Bills ────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }} className="lg:grid-cols-2">
        <GoalsWidget />
        <UpcomingBills />
      </div>

      {/* ── Portfolio / Investment placeholder ───────────────────── */}
      <div className="card" style={{ padding: 24, background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(168,85,247,0.04) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--violet-dim)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>Investments & Portfolio</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Track your stocks, mutual funds, and crypto holdings in one place
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="coming-soon-badge" style={{ padding: '4px 12px', fontSize: 10 }}>Coming Soon</span>
            <button className="btn btn-ghost" style={{ height: 34, fontSize: 12 }}>Get Notified</button>
          </div>
        </div>
      </div>

    </div>
  )
}
