import React, { useState } from 'react'
import { useBudgets }         from '../../hooks/useBudgets'
import { useBudgetAnalytics } from '../../hooks/useBudgetAnalytics'
import BudgetCard             from '../../components/budget/BudgetCard'
import BudgetModal            from '../../components/budget/BudgetModal'
import ErrorBanner            from '../../components/ui/ErrorBanner'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const currentYear  = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const YEARS        = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

function fmtINR(v) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(parseFloat(v) || 0)
}

export default function BudgetsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editData,  setEditData]  = useState(null)
  const [viewMonth, setViewMonth] = useState(currentMonth)
  const [viewYear,  setViewYear]  = useState(currentYear)
  const [tab,       setTab]       = useState('analytics') // 'analytics' | 'all'

  const {
    budgets, loading: bLoading, error: bError,
    createBudget, updateBudget, deleteBudget, refetch: bRefetch,
  } = useBudgets()

  const {
    analytics, loading: aLoading, error: aError, refetch: aRefetch,
  } = useBudgetAnalytics(viewMonth, viewYear)

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleCreate = async (payload) => {
    await createBudget(payload)
    aRefetch()
  }

  const handleUpdate = async (payload) => {
    await updateBudget(editData.id, payload)
    aRefetch()
    setEditData(null)
  }

  const handleEdit = (data) => {
    setEditData(data)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return
    try {
      await deleteBudget(id)
      aRefetch()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditData(null)
  }

  // ── Computed stats (analytics tab) ──────────────────────────────────────────
  const totalLimit = analytics.reduce((s, a) => s + parseFloat(a.limitAmount || 0), 0)
  const totalSpent = analytics.reduce((s, a) => s + parseFloat(a.spent        || 0), 0)
  const exceeded   = analytics.filter(a => a.exceeded).length
  const remaining  = Math.max(totalLimit - totalSpent, 0)

  const SUMMARY = [
    { label: 'Total Budget',  value: fmtINR(totalLimit), color: '#6366f1', bg: 'rgba(99,102,241,0.1)'  },
    { label: 'Total Spent',   value: fmtINR(totalSpent), color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
    { label: 'Remaining',     value: fmtINR(remaining),  color: '#10b981', bg: 'rgba(16,185,129,0.1)'  },
    {
      label: 'Exceeded',
      value: exceeded > 0 ? `${exceeded} categor${exceeded > 1 ? 'ies' : 'y'}` : 'None',
      color: exceeded > 0 ? '#ef4444' : '#10b981',
      bg:    exceeded > 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
    },
  ]

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Error banners */}
      <ErrorBanner message={bError || aError} onRetry={() => { bRefetch(); aRefetch() }} />

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-700 text-xl" style={{ color: 'var(--text-primary)' }}>
            Budget Management
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
            Set and track monthly spending limits by category
          </p>
        </div>
        <button
          className="btn btn-primary self-start sm:self-auto"
          onClick={() => setShowModal(true)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Budget
        </button>
      </div>

      {/* Tab bar + period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Tab switcher */}
        <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)', width: 'fit-content' }}>
          {[{ k: 'analytics', l: 'Analytics' }, { k: 'all', l: 'All Budgets' }].map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className="px-4 py-2 text-sm font-500 transition-all"
              style={{
                background: tab === t.k ? 'rgba(99,102,241,0.2)' : 'transparent',
                color:      tab === t.k ? '#a5b4fc'               : 'var(--text-secondary)',
              }}>
              {t.l}
            </button>
          ))}
        </div>

        {/* Period selector (analytics tab only) */}
        {tab === 'analytics' && (
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Period:</span>
            <select
              className="input"
              style={{ width: 'auto', padding: '0.375rem 0.625rem', fontSize: '0.8rem' }}
              value={viewMonth}
              onChange={e => setViewMonth(parseInt(e.target.value))}
            >
              {MONTH_NAMES.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
            <select
              className="input"
              style={{ width: 'auto', padding: '0.375rem 0.625rem', fontSize: '0.8rem' }}
              value={viewYear}
              onChange={e => setViewYear(parseInt(e.target.value))}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* ── Analytics Tab ──────────────────────────────────────────────────────── */}
      {tab === 'analytics' && (
        <>
          {/* Summary stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SUMMARY.map(s => (
              <div key={s.label} className="card p-3 sm:p-4">
                <p className="text-xs mb-1.5 truncate" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                {aLoading
                  ? <div className="h-6 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  : <p className="text-sm sm:text-base font-700 font-mono truncate" style={{ color: s.color }}>{s.value}</p>
                }
              </div>
            ))}
          </div>

          {/* Overspending alert banner */}
          {!aLoading && exceeded > 0 && (
            <div className="flex items-center gap-3 rounded-xl px-4 py-3"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" style={{ color: '#ef4444', flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <p className="text-sm font-600" style={{ color: '#ef4444' }}>
                  {exceeded} budget{exceeded > 1 ? 's' : ''} exceeded for {MONTH_SHORT[viewMonth - 1]} {viewYear}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Review your spending in the categories below
                </p>
              </div>
            </div>
          )}

          {/* Budget analytics cards grid */}
          {aLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                      <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)', width: '40%' }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)' }} />
                    <div className="h-2.5 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  </div>
                  <div className="h-2 rounded-full animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                </div>
              ))}
            </div>
          ) : analytics.length === 0 ? (
            <div className="card p-10 sm:p-14 text-center">
              <p className="text-4xl mb-4">🎯</p>
              <p className="font-600 mb-1" style={{ color: 'var(--text-primary)' }}>
                No budgets for {MONTH_SHORT[viewMonth - 1]} {viewYear}
              </p>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                Create budgets to start tracking your spending against limits
              </p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Create First Budget
              </button>
            </div>
          ) : (
            // Sort: exceeded first, then by % used desc
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...analytics]
                .sort((a, b) => {
                  if (a.exceeded !== b.exceeded) return a.exceeded ? -1 : 1
                  return (b.percentageUsed || 0) - (a.percentageUsed || 0)
                })
                .map(a => (
                  <BudgetCard
                    key={a.id}
                    data={a}
                    isAnalytics
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              }
            </div>
          )}
        </>
      )}

      {/* ── All Budgets Tab ──────────────────────────────────────────────────── */}
      {tab === 'all' && (
        bLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-5 h-36 animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : budgets.length === 0 ? (
          <div className="card p-10 sm:p-14 text-center">
            <p className="text-4xl mb-4">💰</p>
            <p className="font-600 mb-1" style={{ color: 'var(--text-primary)' }}>No budgets yet</p>
            <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
              Create your first monthly budget to start tracking spending
            </p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              Create Budget
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgets.map(b => (
              <BudgetCard
                key={b.id}
                data={b}
                isAnalytics={false}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )
      )}

      {/* ── Modal ───────────────────────────────────────────────────────────── */}
      {showModal && (
        <BudgetModal
          onClose={handleModalClose}
          onSubmit={editData ? handleUpdate : handleCreate}
          editData={editData}
        />
      )}
    </div>
  )
}
