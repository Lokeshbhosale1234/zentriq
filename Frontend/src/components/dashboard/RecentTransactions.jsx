import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatShortDate, STATUS_CONFIG, CATEGORY_COLORS, CATEGORIES } from '../../utils/formatters'

const getCategoryColor = (cat) => {
  const idx = CATEGORIES.indexOf(cat)
  return CATEGORY_COLORS[Math.max(idx, 0) % CATEGORY_COLORS.length]
}

const CAT_EMOJI = {
  'Food & Dining':  '🍽',
  'Shopping':       '🛍',
  'Transportation': '🚗',
  'Entertainment':  '🎬',
  'Healthcare':     '⚕',
  'Education':      '📚',
  'Utilities':      '💡',
  'Travel':         '✈',
  'Salary':         '💼',
  'Freelance':      '💻',
  'Investment':     '📈',
  'Other':          '📦',
}

export default function RecentTransactions({ transactions, loading }) {
  const recent = (transactions || []).slice(0, 7)

  return (
    <div className="card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '18px 20px 14px',
          borderBottom:   '1px solid var(--border-subtle)',
        }}
      >
        <div>
          <h3
            className="font-display font-700"
            style={{ fontSize: 14, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 2 }}
          >
            Recent Activity
          </h3>
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Latest {recent.length} transactions</p>
        </div>
        <Link
          to="/transactions"
          style={{
            display:        'flex',
            alignItems:     'center',
            gap:            4,
            fontSize:       11,
            fontWeight:     600,
            color:          'var(--indigo-light)',
            textDecoration: 'none',
            padding:        '5px 10px',
            borderRadius:   8,
            background:     'var(--indigo-dim)',
            border:         '1px solid rgba(99,102,241,0.15)',
            transition:     'background 0.14s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--indigo-dim)'}
        >
          View all
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '8px 12px 12px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 6 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 8px' }}>
                <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton" style={{ width: '55%', height: 10 }} />
                  <div className="skeleton" style={{ width: '35%', height: 8 }} />
                </div>
                <div className="skeleton" style={{ width: 64, height: 12 }} />
              </div>
            ))}
          </div>
        ) : recent.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 4 }}>No transactions yet</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Add your first transaction to get started</p>
            </div>
          </div>
        ) : (
          <div className="stagger" style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingTop: 6 }}>
            {recent.map(t => {
              const isCredit = t.type === 'CREDIT'
              const status   = STATUS_CONFIG[t.status] || { label: t.status, cls: 'badge-cyan' }
              const catColor = getCategoryColor(t.category)
              const emoji    = CAT_EMOJI[t.category] || '💸'

              return (
                <div
                  key={t.id}
                  className="table-row-hover"
                  style={{
                    display:     'flex',
                    alignItems:  'center',
                    gap:         10,
                    padding:     '9px 8px',
                    borderRadius: 10,
                    cursor:       'default',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width:          34,
                      height:         34,
                      borderRadius:   10,
                      background:     isCredit ? 'rgba(16,185,129,0.1)' : `${catColor}15`,
                      color:          isCredit ? 'var(--green)' : catColor,
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      fontSize:       14,
                      flexShrink:     0,
                      border:         isCredit ? '1px solid rgba(16,185,129,0.14)' : `1px solid ${catColor}20`,
                    }}
                  >
                    {isCredit ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                      </svg>
                    ) : emoji}
                  </div>

                  {/* Title + meta */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                      {t.title}
                    </p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.3, marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.category} · {formatShortDate(t.transactionDate)}
                    </p>
                  </div>

                  {/* Amount + status */}
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p
                      className="font-mono"
                      style={{ fontSize: 13, fontWeight: 700, color: isCredit ? 'var(--green)' : 'var(--text-primary)', lineHeight: 1.4 }}
                    >
                      {isCredit ? '+' : '−'}{formatCurrency(t.amount)}
                    </p>
                    <span className={`badge ${status.cls}`} style={{ fontSize: 9, marginTop: 2 }}>
                      {status.label}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
