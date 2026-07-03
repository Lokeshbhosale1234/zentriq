import React, { useState, useCallback } from 'react'
import TransactionsTable   from '../components/transactions/TransactionsTable'
import ErrorBanner         from '../components/ui/ErrorBanner'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams] = useSearchParams()

  const [search,       setSearch]       = useState('')
  const [category,     setCategory]     = useState('')
  const [type,         setType]         = useState('')
  const [dateFrom,     setDateFrom]     = useState('')
  const [dateTo,       setDateTo]       = useState('')
  const [minAmount,    setMinAmount]    = useState('')
  const [maxAmount,    setMaxAmount]    = useState('')
  const [showFilters,  setShowFilters]  = useState(false)
  const [filterLoading,setFilterLoading]= useState(false)
  const [filterError,   setFilterError]   = useState(null)
  const [refreshing,   setRefreshing]   = useState(false)
  const [filtered,     setFiltered]     = useState(null)

  // Pick up ?q= param set by the topbar global search
  useEffect(() => {
    const q = searchParams.get('q')
    if (q && q !== search) {
      setSearch(q)
    }
  }, [searchParams])

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
      setFilterError(err?.response?.data?.message || err.message || 'Search failed')
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
      if (hasActiveFilters) await applyFilters()
    } catch (err) {
      console.error('Refresh failed:', err)
    } finally {
      setRefreshing(false)
    }
  }

  const displayData = filtered !== null ? filtered : transactions
  const income  = displayData.filter(t => t.type === 'CREDIT' || t.type === 'INCOME').reduce((s, t) => s + parseFloat(t.amount || 0), 0)
  const expense = displayData.filter(t => t.type === 'DEBIT'  || t.type === 'EXPENSE').reduce((s, t) => s + parseFloat(t.amount || 0), 0)

  const inputStyle = {
    background: 'var(--bg-input)', border: '1px solid var(--border)',
    borderRadius: 10, padding: '9px 12px', fontSize: 13, color: 'var(--text-primary)',
    fontFamily: 'inherit', outline: 'none', width: '100%',
    transition: 'border-color 0.15s ease',
  }

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <ErrorBanner message={error} onRetry={refetch} />
      {filterError && <ErrorBanner message={filterError} onRetry={applyFilters} />}

      {/* ── Summary stats ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Showing', value: `${displayData.length} tx`, color: 'var(--text-primary)', sub: filtered ? 'Filtered results' : 'All transactions' },
          { label: 'Total In',  value: `₹${income.toLocaleString('en-IN')}`,  color: '#10b981', sub: 'Filtered income'  },
          { label: 'Total Out', value: `₹${expense.toLocaleString('en-IN')}`, color: '#f43f5e', sub: 'Filtered expenses' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '16px 18px' }}>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>{s.label}</p>
            <p className="font-mono" style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Filters bar ───────────────────────────────────────────── */}
      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Search */}
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && applyFilters()}
              placeholder="Search transactions…"
              style={{ ...inputStyle, paddingLeft: 34 }}
            />
          </div>

          {/* Category */}
          <select value={category} onChange={e => setCategory(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 130, cursor: 'pointer' }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* Type */}
          <select value={type} onChange={e => setType(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 110, cursor: 'pointer' }}>
            <option value="">All Types</option>
            <option value="DEBIT">Expense</option>
            <option value="CREDIT">Income</option>
          </select>

          {/* Toggle advanced */}
          <button
            onClick={() => setShowFilters(p => !p)}
            className="btn btn-ghost"
            style={{ height: 38, fontSize: 12, gap: 6, flexShrink: 0 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
            Filters {hasActiveFilters && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--indigo)', display: 'inline-block' }} />}
          </button>

          {/* Actions */}
          <button onClick={applyFilters} disabled={filterLoading} className="btn btn-primary" style={{ height: 38, fontSize: 12, flexShrink: 0 }}>
            {filterLoading ? <><Spinner/>Searching</> : 'Search'}
          </button>

          <button onClick={handleRefresh} disabled={refreshing} className="btn btn-ghost" style={{ height: 38, fontSize: 12, flexShrink: 0 }}>
            {refreshing ? <Spinner/> : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>}
          </button>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn btn-ghost" style={{ height: 38, fontSize: 12, color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)', flexShrink: 0 }}>
              Clear
            </button>
          )}
        </div>

        {/* Advanced filters */}
        {showFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
            {[
              { label: 'From date',   value: dateFrom,   set: setDateFrom,   type: 'date' },
              { label: 'To date',     value: dateTo,     set: setDateTo,     type: 'date' },
              { label: 'Min amount ₹', value: minAmount,  set: setMinAmount,  type: 'number', placeholder: '0' },
              { label: 'Max amount ₹', value: maxAmount,  set: setMaxAmount,  type: 'number', placeholder: '99999' },
            ].map((f, i) => (
              <div key={i}>
                <label style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', display: 'block', marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={inputStyle} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────── */}
      <TransactionsTable
        transactions={displayData}
        loading={loading}
        onDelete={deleteTransaction}
        totalCount={transactions.length}
      />
    </div>
  )
}
