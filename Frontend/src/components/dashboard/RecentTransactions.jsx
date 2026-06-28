import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/formatters'

const CAT_ICONS = {
  'Food & Dining': '🍜', 'Entertainment': '🎬', 'Transport': '🚗',
  'Utilities': '⚡', 'Shopping': '🛍️', 'Healthcare': '🏥',
  'Education': '📚', 'Travel': '✈️', 'Salary': '💼', 'Other': '💳',
}

function getCatIcon(cat) {
  for (const [key, icon] of Object.entries(CAT_ICONS)) {
    if (cat?.toLowerCase().includes(key.toLowerCase())) return icon
  }
  return '💳'
}

export default function RecentTransactions({ transactions, loading }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 20 }} />
        {[1,2,3,4,5].map(i => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ width: '60%', height: 10, marginBottom: 6 }} />
              <div className="skeleton" style={{ width: '40%', height: 8 }} />
            </div>
            <div className="skeleton" style={{ width: 60, height: 12 }} />
          </div>
        ))}
      </div>
    )
  }

  const recent = (transactions || []).slice(0, 6)

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <p className="section-title">Recent Transactions</p>
        <Link to="/transactions" style={{ fontSize: 11, color: 'var(--indigo-light)', textDecoration: 'none', fontWeight: 600 }}>
          View all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '28px 0' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>No transactions yet</p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>Add your first transaction to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {recent.map((tx, i) => {
            const isIncome = tx.type === 'INCOME'
            const amount = tx.amount ?? 0
            return (
              <div key={tx.id || i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < recent.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: isIncome ? 'rgba(16,185,129,0.08)' : 'rgba(244,63,94,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, border: `1px solid ${isIncome ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}`,
                }}>
                  {getCatIcon(tx.category)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }} className="truncate">
                    {tx.description || tx.title || tx.category || 'Transaction'}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                    {tx.category} · {tx.date ? new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : ''}
                  </p>
                </div>
                <span className="font-mono" style={{
                  fontSize: 13, fontWeight: 700, flexShrink: 0,
                  color: isIncome ? '#10b981' : '#f43f5e',
                }}>
                  {isIncome ? '+' : '-'}₹{formatCurrency(Math.abs(amount)).replace('$','').replace('₹','')}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
