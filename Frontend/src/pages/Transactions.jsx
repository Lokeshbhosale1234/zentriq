import React, { useState, useCallback } from 'react'
import TransactionsTable   from '../components/transactions/TransactionsTable'
import ErrorBanner         from '../components/ui/ErrorBanner'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, CATEGORIES } from '../utils/formatters'
import { transactionApi }  from '../api/transactionApi'

const Spinner = () => (
  <svg className="animate-spin-custom" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
    <path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

export default function Transactions() {
  const { transactions, loading, error, deleteTransaction, refetch } = useTransactions()

  const [search,      setSearch]      = useState('')
  const [category,    setCategory]    = useState('')
  const [type,        setType]        = useState('')
  const [dateFrom,    setDateFrom]    = useState('')
  const [dateTo,      setDateTo]      = useState('')
  const [minAmount,   setMinAmount]   = useState('')  
  const [maxAmount,   setMaxAmount]   = useState('')
 const [showFilters, setShowFilters] = useState(false)
const [filterLoading, setFilterLoading] = useState(false)
const [refreshing, setRefreshing] = useState(false)
const [filtered,    setFiltered]    = useState(null)

  const hasActiveFilters = search || category || type || dateFrom || dateTo || minAmount || maxAmount

  const applyFilters = useCallback(async () => {
    if (!hasActiveFilters) { setFiltered(null); return }
    setFilterLoading(true)
    try {
      const params = new URLSearchParams()
      if (search)    params.append('search',    search.trim())
      if (category)  params.append('category',  category)
      if (type)      params.append('type',      type)
      if (dateFrom)  params.append('dateFrom',  new Date(dateFrom).toISOString())
      if (dateTo)    params.append('dateTo',    new Date(dateTo + 'T23:59:59').toISOString())
      if (minAmount) params.append('minAmount', minAmount)
      if (maxAmount) params.append('maxAmount', maxAmount)
      const data = await transactionApi.search(params)
      setFiltered(data)
    } catch (err) {
      alert('Search failed: ' + err.message)
    } finally {
      setFilterLoading(false)
    }
  }, [search, category, type, dateFrom, dateTo, minAmount, maxAmount, hasActiveFilters])

  const clearFilters = () => {
    setSearch(''); setCategory(''); setType('')
    setDateFrom(''); setDateTo(''); setMinAmount(''); setMaxAmount('')
    setFiltered(null)
  }
  const handleRefresh = async () => {
  try {
    setRefreshing(true)

    await refetch()

    if (hasActiveFilters) {
      await applyFilters()
    }

  } catch (err) {
    console.error('Refresh failed:', err)
  } finally {
    setRefreshing(false)
  }
}

  const displayData = filtered !== null ? filtered : transactions
  const income      = displayData.filter(t => t.type === 'CREDIT').reduce((s, t) => s + parseFloat(t.amount), 0)
  const expense     = displayData.filter(t => t.type === 'DEBIT' ).reduce((s, t) => s + parseFloat(t.amount), 0)

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ErrorBanner message={error} onRetry={refetch} />

      {/* ── Summary chips ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Records',       value: displayData.length, mono: false, color: '#22d3ee' },
          { label: 'Total Income',  value: formatCurrency(income),  mono: true, color: '#10b981' },
          { label: 'Total Expense', value: formatCurrency(expense), mono: true, color: '#f43f5e' },
        ].map(({ label, value, mono, color }) => (
          <div key={label} className="card" style={{ padding: '14px 18px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
              {label}
            </p>
            <p
              className={mono ? 'font-mono' : ''}
              style={{ fontSize: 18, fontWeight: 700, color, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Search + filter panel ─────────────────────────────────── */}
      <div className="card" style={{ overflow: 'hidden' }}>

        {/* Top search bar */}
        <div
          style={{
            display:      'flex',
            flexWrap:     'wrap',
            alignItems:   'center',
            gap:          10,
            padding:      '14px 16px',
            borderBottom: showFilters ? '1px solid var(--border)' : 'none',
          }}
        >
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 160 }}>
            <svg
              style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}
              width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="input"
              style={{ paddingLeft: 32, height: 36, fontSize: 13 }}
              placeholder="Search by title…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
            />
          </div>

          {/* Type pills — desktop */}
          <div
            className="hidden sm:flex"
            style={{
              borderRadius: 9,
              overflow:     'hidden',
              border:       '1px solid var(--border)',
              flexShrink:   0,
            }}
          >
            {[{ v: '', l: 'All' }, { v: 'CREDIT', l: 'Income' }, { v: 'DEBIT', l: 'Expense' }].map(t => (
              <button
                key={t.v}
                type="button"
                onClick={() => setType(t.v)}
                style={{
                  padding:    '7px 13px',
                  fontSize:   12,
                  fontWeight: 600,
                  cursor:     'pointer',
                  border:     'none',
                  transition: 'all 0.15s ease',
                  background: type === t.v ? 'rgba(99,102,241,0.18)' : 'transparent',
                  color:      type === t.v ? 'var(--indigo-light)'   : 'var(--text-secondary)',
                }}
              >
                {t.l}
              </button>
            ))}
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto', flexShrink: 0 }}>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                style={{
                  fontSize:   11,
                  fontWeight: 600,
                  color:      'var(--red)',
                  background: 'var(--red-dim)',
                  border:     '1px solid rgba(244,63,94,0.18)',
                  borderRadius: 7,
                  padding:    '5px 10px',
                  cursor:     'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.14s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--red-dim)'}
              >
                ✕ Clear
              </button>
            )}
            <button
  type="button"
  onClick={handleRefresh}
  disabled={refreshing}
  className="btn btn-ghost refresh-btn"
  style={{
    padding: '6px 12px',
    fontSize: 12,
    gap: 6,
    opacity: refreshing ? 0.7 : 1,
    cursor: refreshing ? 'not-allowed' : 'pointer',
  }}
>
  <svg
    className={refreshing ? 'animate-spin-custom' : ''}
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
  >
    <path d="M21 2v6h-6"/>
    <path d="M3 12a9 9 0 0115-6.7L21 8"/>
    <path d="M3 22v-6h6"/>
    <path d="M21 12a9 9 0 01-15 6.7L3 16"/>
  </svg>

  {refreshing ? 'Refreshing…' : 'Refresh'}
</button>
            <button
              type="button"
              className="btn btn-ghost"
              style={{ padding: '6px 11px', fontSize: 12, gap: 5 }}
              onClick={() => setShowFilters(p => !p)}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filters
              {hasActiveFilters && (
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', flexShrink: 0 }} />
              )}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '6px 14px', fontSize: 12, gap: 5 }}
              onClick={applyFilters}
              disabled={filterLoading}
            >
              {filterLoading ? <Spinner /> : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              )}
              {filterLoading ? 'Searching…' : 'Search'}
            </button>
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <div
            className="animate-slide-down"
            style={{
              display:            'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap:                12,
              padding:            '14px 16px',
              background:         'rgba(255,255,255,0.015)',
              borderBottom:       '1px solid var(--border)',
            }}
          >
            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
                Category
              </label>
              <select className="input" style={{ fontSize: 12 }} value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type — mobile only */}
            <div className="sm:hidden">
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
                Type
              </label>
              <select className="input" style={{ fontSize: 12 }} value={type} onChange={e => setType(e.target.value)}>
                <option value="">All</option>
                <option value="CREDIT">Income</option>
                <option value="DEBIT">Expense</option>
              </select>
            </div>

            {/* Date from */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
                Date From
              </label>
              <input className="input" style={{ fontSize: 12 }} type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>

            {/* Date to */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
                Date To
              </label>
              <input className="input" style={{ fontSize: 12 }} type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>

            {/* Min amount */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
                Min Amount
              </label>
              <input className="input" style={{ fontSize: 12 }} type="number" placeholder="0" min="0" value={minAmount} onChange={e => setMinAmount(e.target.value)} />
            </div>

            {/* Max amount */}
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 5 }}>
                Max Amount
              </label>
              <input className="input" style={{ fontSize: 12 }} type="number" placeholder="Any" min="0" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <TransactionsTable
        transactions={displayData}
        loading={loading || filterLoading}
        totalCount={transactions.length}
        onDelete={async (id) => {
          await deleteTransaction(id)
          if (filtered !== null) setFiltered(prev => prev.filter(t => t.id !== id))
        }}
      />
    </div>
  )
}
