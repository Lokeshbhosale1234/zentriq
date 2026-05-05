import React from 'react'
import TransactionsTable from '../components/transactions/TransactionsTable'
import ErrorBanner       from '../components/ui/ErrorBanner'
import { useTransactions } from '../hooks/useTransactions'
import { formatCurrency }  from '../utils/formatters'

export default function Transactions() {
  const { transactions, loading, error, deleteTransaction, refetch } = useTransactions()

  const totalCredit = transactions.filter(t => t.type === 'CREDIT').reduce((s, t) => s + parseFloat(t.amount), 0)
  const totalDebit  = transactions.filter(t => t.type === 'DEBIT').reduce((s,  t) => s + parseFloat(t.amount), 0)

  return (
    <div className="space-y-5 animate-fade-in">
      <ErrorBanner message={error} onRetry={refetch} />

      {/* Summary mini-cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Records',  value: transactions.length, mono: true,  color: 'var(--accent-cyan)',   bg: 'rgba(6,182,212,0.1)'   },
          { label: 'Total Income',   value: `$${formatCurrency(totalCredit).replace('$','')}`, mono: true, color: 'var(--accent-green)', bg: 'rgba(16,185,129,0.1)' },
          { label: 'Total Expense',  value: `$${formatCurrency(totalDebit ).replace('$','')}`, mono: true, color: 'var(--accent-red)',   bg: 'rgba(239,68,68,0.1)'  },
        ].map(({ label, value, mono, color, bg }) => (
          <div key={label} className="card p-4">
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
            <p className={`text-xl font-700 ${mono ? 'font-mono' : ''}`} style={{ color }}>
              {loading ? '—' : value}
            </p>
          </div>
        ))}
      </div>

      <TransactionsTable
        transactions={transactions}
        loading={loading}
        onDelete={deleteTransaction}
      />
    </div>
  )
}
