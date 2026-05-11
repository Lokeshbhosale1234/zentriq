import React, { useState, useCallback } from 'react'
import TransactionsTable   from '../components/transactions/TransactionsTable'
import ErrorBanner         from '../components/ui/ErrorBanner'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency, CATEGORIES } from '../utils/formatters'
import { transactionApi } from '../api/transactionApi'

export default function Transactions() {
  const { transactions, loading, error, deleteTransaction, refetch } = useTransactions()

  // ── Filter state (server-side search) ──────────────────────────────────────
  const [search,    setSearch]    = useState('')
  const [category,  setCategory]  = useState('')
  const [type,      setType]      = useState('')
  const [dateFrom,  setDateFrom]  = useState('')
  const [dateTo,    setDateTo]    = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // filtered = null means "show all transactions from hook"; otherwise server result
  const [filterLoading, setFilterLoading] = useState(false)
  const [filtered,      setFiltered]      = useState(null)

  const hasActiveFilters = search || category || type || dateFrom || dateTo || minAmount || maxAmount

  // ── Apply server-side filters ───────────────────────────────────────────────
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

  const displayData  = filtered !== null ? filtered : transactions
  const totalCredit  = displayData.filter(t => t.type === 'CREDIT').reduce((s, t) => s + parseFloat(t.amount), 0)
  const totalDebit   = displayData.filter(t => t.type === 'DEBIT') .reduce((s, t) => s + parseFloat(t.amount), 0)

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-in">
      <ErrorBanner message={error} onRetry={refetch} />

      {/* Summary mini-cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: 'Records',       value: displayData.length,          mono: false, color: 'var(--accent-cyan)'  },
          { label: 'Total Income',  value: formatCurrency(totalCredit), mono: true,  color: 'var(--accent-green)' },
          { label: 'Total Expense', value: formatCurrency(totalDebit),  mono: true,  color: 'var(--accent-red)'   },
        ].map(({ label, value, mono, color }) => (
          <div key={label} className="card p-3 sm:p-4">
            <p className="text-xs mb-1 truncate" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className={`text-base sm:text-xl font-700 ${mono ? 'font-mono' : ''} truncate`} style={{ color }}>
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      {/* ── Filter panel ─────────────────────────────────────────────────────── */}
      <div className="card overflow-hidden">
        {/* Top bar: search + quick type + filter toggle + apply */}
        <div
          className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 p-3 sm:p-4"
          style={{ borderBottom: showFilters ? '1px solid var(--border)' : 'none' }}
        >
          {/* Search input */}
          <div className="relative flex-1 min-w-0" style={{ minWidth: 140 }}>
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="input pl-8"
              style={{ height: '36px', fontSize: '0.82rem' }}
              placeholder="Search by title…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
            />
          </div>

          {/* Quick type pills (hidden on very small mobile) */}
          <div className="hidden sm:flex rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: '1px solid var(--border)' }}>
            {[{ v: '', l: 'All' }, { v: 'CREDIT', l: 'Income' }, { v: 'DEBIT', l: 'Expense' }].map(t => (
              <button key={t.v} onClick={() => setType(t.v)}
                className="px-3 py-1.5 text-xs font-500 transition-all"
                style={{
                  background: type === t.v ? 'rgba(99,102,241,0.2)' : 'transparent',
                  color:      type === t.v ? '#a5b4fc'               : 'var(--text-secondary)',
                }}>
                {t.l}
              </button>
            ))}
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="text-xs font-500 px-2 py-1 rounded-lg transition-colors"
                style={{ color: 'var(--accent-red)', background: 'rgba(239,68,68,0.08)' }}>
                Clear
              </button>
            )}
            <button
              onClick={() => setShowFilters(p => !p)}
              className="btn btn-ghost"
              style={{ padding: '0.4rem 0.7rem', fontSize: '0.8rem' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && <span style={{ color: 'var(--accent-purple)' }}>•</span>}
            </button>
            <button
              onClick={applyFilters}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.875rem', fontSize: '0.8rem' }}
              disabled={filterLoading}>
              {filterLoading
                ? <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".25"/>
                    <path d="M21 12a9 9 0 00-9-9"/>
                  </svg>
                : 'Search'
              }
            </button>
          </div>
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>

            {/* Category */}
            <div>
              <label className="block text-xs font-600 mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Category
              </label>
              <select className="input" style={{ fontSize: '0.8rem' }}
                value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Type (mobile only — desktop uses pills above) */}
            <div className="sm:hidden">
              <label className="block text-xs font-600 mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Type</label>
              <select className="input" style={{ fontSize: '0.8rem' }} value={type} onChange={e => setType(e.target.value)}>
                <option value="">All</option>
                <option value="CREDIT">Income</option>
                <option value="DEBIT">Expense</option>
              </select>
            </div>

            {/* Date from */}
            <div>
              <label className="block text-xs font-600 mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date From</label>
              <input className="input" style={{ fontSize: '0.8rem' }}
                type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            </div>

            {/* Date to */}
            <div>
              <label className="block text-xs font-600 mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Date To</label>
              <input className="input" style={{ fontSize: '0.8rem' }}
                type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>

            {/* Min amount */}
            <div>
              <label className="block text-xs font-600 mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Min Amount</label>
              <input className="input" style={{ fontSize: '0.8rem' }}
                type="number" placeholder="0" min="0" value={minAmount}
                onChange={e => setMinAmount(e.target.value)} />
            </div>

            {/* Max amount */}
            <div>
              <label className="block text-xs font-600 mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Max Amount</label>
              <input className="input" style={{ fontSize: '0.8rem' }}
                type="number" placeholder="Any" min="0" value={maxAmount}
                onChange={e => setMaxAmount(e.target.value)} />
            </div>
          </div>
        )}
      </div>

      {/* Transactions table */}
      <TransactionsTable
        transactions={displayData}
        loading={loading || filterLoading}
        totalCount={transactions.length}
        onDelete={async (id) => {
          await deleteTransaction(id)
          // Also remove from filtered results if active
          if (filtered !== null) setFiltered(prev => prev.filter(t => t.id !== id))
        }}
      />
    </div>
  )
}
