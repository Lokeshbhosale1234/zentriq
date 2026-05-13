import React, { useState } from 'react'
import { formatCurrency, formatDate, STATUS_CONFIG, CATEGORY_COLORS, CATEGORIES } from '../../utils/formatters'

const getCategoryColor = (cat) => {
  const idx = CATEGORIES.indexOf(cat)
  return CATEGORY_COLORS[Math.max(idx, 0) % CATEGORY_COLORS.length]
}

const CAT_EMOJI = {
  'Food & Dining':  '🍽',  'Shopping':       '🛍',
  'Transportation': '🚗',  'Entertainment':  '🎬',
  'Healthcare':     '⚕',   'Education':      '📚',
  'Utilities':      '💡',  'Travel':         '✈',
  'Salary':         '💼',  'Freelance':      '💻',
  'Investment':     '📈',  'Other':          '📦',
}

const Spinner = () => (
  <svg className="animate-spin-custom" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
    <path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

export default function TransactionsTable({ transactions, loading, onDelete, totalCount }) {
  const [deletingId, setDeletingId] = useState(null)
  const list = transactions || []

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this transaction? This cannot be undone.')) return
    setDeletingId(id)
    try { await onDelete(id) }
    catch (err) { alert(err.message || 'Delete failed') }
    finally { setDeletingId(null) }
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      {/* Scrollable wrapper for mobile */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>

          {/* ── Head ───────────────────────────────────────────────── */}
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Transaction', 'Category', 'Date', 'Status', 'Amount', ''].map((h, i) => (
                <th
                  key={h || i}
                  style={{
                    padding:       '11px 16px',
                    textAlign:     'left',
                    fontSize:      10,
                    fontWeight:    700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    color:         'var(--text-muted)',
                    whiteSpace:    'nowrap',
                    background:    'rgba(255,255,255,0.012)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* ── Body ───────────────────────────────────────────────── */}
          <tbody>
            {loading ? (
              /* Skeleton rows */
              [...Array(6)].map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="skeleton" style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0 }} />
                      <div>
                        <div className="skeleton" style={{ width: 130, height: 11, marginBottom: 6 }} />
                        <div className="skeleton" style={{ width: 80, height: 9 }} />
                      </div>
                    </div>
                  </td>
                  {[70, 90, 60, 72].map(w => (
                    <td key={w} style={{ padding: '14px 16px' }}>
                      <div className="skeleton" style={{ width: w, height: 10 }} />
                    </td>
                  ))}
                  <td style={{ padding: '14px 16px' }}>
                    <div className="skeleton" style={{ width: 56, height: 26, borderRadius: 8 }} />
                  </td>
                </tr>
              ))
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '56px 24px', gap: 14 }}>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(99,102,241,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.4" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      </svg>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 4 }}>No transactions found</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Try adjusting your search or filter criteria</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              list.map((t, rowIdx) => {
                const isCredit   = t.type === 'CREDIT'
                const status     = STATUS_CONFIG[t.status] || { label: t.status, cls: 'badge-cyan' }
                const catColor   = getCategoryColor(t.category)
                const emoji      = CAT_EMOJI[t.category] || '💸'
                const isDeleting = deletingId === t.id

                return (
                  <tr
                    key={t.id}
                    className="table-row-hover"
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      opacity:      isDeleting ? 0.4 : 1,
                      transition:   'opacity 0.2s ease',
                      animationDelay: `${Math.min(rowIdx * 30, 240)}ms`,
                    }}
                  >
                    {/* Transaction title */}
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width:          34,
                            height:         34,
                            borderRadius:   10,
                            background:     isCredit ? 'rgba(16,185,129,0.1)' : `${catColor}14`,
                            color:          isCredit ? 'var(--green)'         : catColor,
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            flexShrink:     0,
                            fontSize:       14,
                            border:         isCredit ? '1px solid rgba(16,185,129,0.15)' : `1px solid ${catColor}20`,
                          }}
                        >
                          {isCredit ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                            </svg>
                          ) : emoji}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
                            {t.title}
                          </p>
                          {t.description && (
                            <p style={{ fontSize: 10, color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200, marginTop: 1 }}>
                              {t.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          display:        'inline-flex',
                          alignItems:     'center',
                          gap:            4,
                          padding:        '3px 8px',
                          borderRadius:   99,
                          fontSize:       10,
                          fontWeight:     600,
                          letterSpacing:  '0.04em',
                          background:     `${catColor}12`,
                          color:          catColor,
                          border:         `1px solid ${catColor}20`,
                          whiteSpace:     'nowrap',
                        }}
                      >
                        {t.category}
                      </span>
                    </td>

                    {/* Date */}
                    <td style={{ padding: '12px 16px', fontSize: 11, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      {formatDate(t.transactionDate)}
                    </td>

                    {/* Status */}
                    <td style={{ padding: '12px 16px' }}>
                      <span className={`badge ${status.cls}`}>{status.label}</span>
                    </td>

                    {/* Amount */}
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize:   13,
                          fontWeight: 700,
                          color:      isCredit ? 'var(--green)' : 'var(--text-primary)',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {isCredit ? '+' : '−'}{formatCurrency(t.amount)}
                      </span>
                    </td>

                    {/* Delete */}
                    <td style={{ padding: '12px 12px 12px 8px' }}>
                      <button
                        className="btn btn-danger"
                        style={{ padding: '5px 10px', fontSize: 11, gap: 4 }}
                        onClick={() => handleDelete(t.id)}
                        disabled={isDeleting}
                        title="Delete transaction"
                      >
                        {isDeleting ? <Spinner /> : (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
                          </svg>
                        )}
                        <span className="hidden sm:inline">{isDeleting ? 'Deleting…' : 'Delete'}</span>
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      {!loading && list.length > 0 && (
        <div
          style={{
            padding:     '10px 16px',
            borderTop:   '1px solid var(--border-subtle)',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'space-between',
          }}
        >
          <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Showing{' '}
            <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{list.length}</span>
            {totalCount !== undefined && totalCount !== list.length && (
              <> of <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{totalCount}</span></>
            )}
            {' '}transactions
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
              {list.filter(t => t.type === 'CREDIT').length} income
            </span>
            <span style={{ color: 'var(--border)', fontSize: 11 }}>·</span>
            <span style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600 }}>
              {list.filter(t => t.type === 'DEBIT').length} expense
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
