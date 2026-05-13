import React, { useState } from 'react'
import { useBudgets }         from '../../hooks/useBudgets'
import { useBudgetAnalytics } from '../../hooks/useBudgetAnalytics'
import BudgetCard             from '../../components/budget/BudgetCard'
import BudgetModal            from '../../components/budget/BudgetModal'
import ErrorBanner            from '../../components/ui/ErrorBanner'

const fmtINR = (v) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(parseFloat(v) || 0)

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const cy = new Date().getFullYear()
const cm = new Date().getMonth() + 1
const YEARS = Array.from({ length: 5 }, (_, i) => cy - 1 + i)

const SkeletonCard = () => (
  <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    <div style={{ display: 'flex', gap: 10 }}>
      <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div className="skeleton" style={{ height: 12, width: '55%', marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 9,  width: '30%' }} />
      </div>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {[80, 65, 55].map(w => <div key={w} className="skeleton" style={{ height: 10, width: `${w}%` }} />)}
    </div>
    <div className="skeleton" style={{ height: 4, borderRadius: 99 }} />
  </div>
)

export default function BudgetsPage() {
  const [showModal, setShowModal] = useState(false)
  const [editData,  setEditData]  = useState(null)
  const [viewMonth, setViewMonth] = useState(cm)
  const [viewYear,  setViewYear]  = useState(cy)
  const [tab,       setTab]       = useState('analytics')

  const { budgets, loading: bLoading, error: bError, createBudget, updateBudget, deleteBudget, refetch: bRefetch } = useBudgets()
  const { analytics, loading: aLoading, error: aError, refetch: aRefetch } = useBudgetAnalytics(viewMonth, viewYear)

  const handleCreate = async (p) => { await createBudget(p); aRefetch() }
  const handleUpdate = async (p) => { await updateBudget(editData.id, p); aRefetch(); setEditData(null) }
  const handleEdit   = (d)         => { setEditData(d); setShowModal(true) }
  const handleDelete = async (id)  => {
    if (!window.confirm('Delete this budget?')) return
    try { await deleteBudget(id); aRefetch() } catch (err) { alert(err.message) }
  }
  const handleModalClose = () => { setShowModal(false); setEditData(null) }

  const totalLimit = analytics.reduce((s, a) => s + parseFloat(a.limitAmount || 0), 0)
  const totalSpent = analytics.reduce((s, a) => s + parseFloat(a.spent || 0), 0)
  const exceeded   = analytics.filter(a => a.exceeded).length

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ErrorBanner message={bError || aError} onRetry={() => { bRefetch(); aRefetch() }} />

      {/* ── Page title ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <h1 className="font-display font-700" style={{ fontSize: 20, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 3 }}>
            Budget Management
          </h1>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Set and track monthly spending limits by category</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)} style={{ gap: 6, flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Budget
        </button>
      </div>

      {/* ── Tab bar + period ──────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 10, padding: 3, gap: 2 }}>
          {[{ k: 'analytics', l: 'Analytics' }, { k: 'all', l: 'All Budgets' }].map(t => (
            <button
              key={t.k}
              type="button"
              onClick={() => setTab(t.k)}
              style={{
                padding:      '7px 16px',
                borderRadius: 8,
                fontSize:     12,
                fontWeight:   600,
                cursor:       'pointer',
                border:       'none',
                transition:   'all 0.18s ease',
                background:   tab === t.k ? 'var(--bg-elevated)' : 'transparent',
                color:        tab === t.k ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow:    tab === t.k ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        {/* Period picker */}
        {tab === 'analytics' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Period:</span>
            <select
              className="input"
              style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }}
              value={viewMonth}
              onChange={e => setViewMonth(parseInt(e.target.value))}
            >
              {MONTH_NAMES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
            <select
              className="input"
              style={{ width: 'auto', fontSize: 12, padding: '6px 10px' }}
              value={viewYear}
              onChange={e => setViewYear(parseInt(e.target.value))}
            >
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* ── Analytics Tab ─────────────────────────────────────────── */}
      {tab === 'analytics' && (
        <>
          {/* Summary bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }} className="sm:grid-cols-4">
            {[
              { label: 'Total Budget', value: fmtINR(totalLimit),          color: '#6366f1' },
              { label: 'Total Spent',  value: fmtINR(totalSpent),          color: '#f59e0b' },
              { label: 'Remaining',    value: fmtINR(Math.max(totalLimit - totalSpent, 0)), color: '#10b981' },
              { label: 'Exceeded',     value: exceeded > 0 ? `${exceeded} categor${exceeded > 1 ? 'ies' : 'y'}` : 'None', color: exceeded > 0 ? '#f43f5e' : '#10b981' },
            ].map(s => (
              <div key={s.label} className="card" style={{ padding: '14px 18px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</p>
                {aLoading
                  ? <div className="skeleton" style={{ height: 20, width: '75%' }} />
                  : <p className="font-mono" style={{ fontSize: 17, fontWeight: 700, color: s.color }}>{s.value}</p>
                }
              </div>
            ))}
          </div>

          {/* Overspend alert */}
          {!aLoading && exceeded > 0 && (
            <div className="animate-slide-down" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderRadius: 12, background: 'rgba(244,63,94,0.07)', border: '1px solid rgba(244,63,94,0.18)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f43f5e', marginBottom: 2 }}>
                  {exceeded} budget{exceeded > 1 ? 's' : ''} exceeded for {MONTH_SHORT[viewMonth - 1]} {viewYear}
                </p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  Review the categories below and adjust your spending or increase the limits.
                </p>
              </div>
            </div>
          )}

          {/* Budget cards */}
          {aLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : analytics.length === 0 ? (
            <div className="card" style={{ padding: '56px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: 36, marginBottom: 14 }}>🎯</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
                No budgets for {MONTH_SHORT[viewMonth - 1]} {viewYear}
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 360, margin: '0 auto 20px' }}>
                Create category budgets to automatically track how much you're spending against your monthly targets.
              </p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Create First Budget
              </button>
            </div>
          ) : (
            <div
              className="stagger"
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}
            >
              {[...analytics]
                .sort((a, b) => {
                  if (a.exceeded !== b.exceeded) return a.exceeded ? -1 : 1
                  return (b.percentageUsed || 0) - (a.percentageUsed || 0)
                })
                .map(a => (
                  <BudgetCard key={a.id} data={a} isAnalytics onEdit={handleEdit} onDelete={handleDelete} />
                ))
              }
            </div>
          )}
        </>
      )}

      {/* ── All Budgets Tab ───────────────────────────────────────── */}
      {tab === 'all' && (
        bLoading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : budgets.length === 0 ? (
          <div className="card" style={{ padding: '56px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 36, marginBottom: 14 }}>💰</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>No budgets yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 320, margin: '0 auto 20px' }}>
              Create your first monthly budget to start tracking spending against limits.
            </p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Create Budget</button>
          </div>
        ) : (
          <div
            className="stagger"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}
          >
            {budgets.map(b => (
              <BudgetCard key={b.id} data={b} isAnalytics={false} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )
      )}

      {/* Modal */}
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
