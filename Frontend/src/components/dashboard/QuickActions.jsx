import React from 'react'

const ACTIONS = [
  { label: 'Add Income',    color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.2)',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> },
  { label: 'Add Expense',   color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',   border: 'rgba(244,63,94,0.2)',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg> },
  { label: 'Set Budget',    color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.2)',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
  { label: 'View Report',   color: '#22d3ee', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.2)', soon: true,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
]

export default function QuickActions({ onAddTransaction }) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <span className="section-title">Quick Actions</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {ACTIONS.map((a, i) => (
          <button
            key={i}
            onClick={a.soon ? undefined : onAddTransaction}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 8, padding: '14px 10px',
              background: a.bg, border: `1px solid ${a.border}`,
              borderRadius: 12, cursor: a.soon ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease', opacity: a.soon ? 0.5 : 1,
              position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => { if (!a.soon) e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ color: a.color }}>{a.icon}</div>
            <span style={{ fontSize: 11, fontWeight: 600, color: a.color }}>{a.label}</span>
            {a.soon && <span className="coming-soon-badge" style={{ position: 'absolute', top: 4, right: 4, fontSize: 8 }}>Soon</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
