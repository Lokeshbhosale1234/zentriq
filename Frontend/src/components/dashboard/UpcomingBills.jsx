import React from 'react'

const BILLS = [
  { name: 'Netflix',       amount: 649,   due: 'Jul 2',   cat: 'Entertainment', color: '#f43f5e', icon: '🎬' },
  { name: 'Spotify',       amount: 119,   due: 'Jul 5',   cat: 'Entertainment', color: '#10b981', icon: '🎵' },
  { name: 'Electricity',   amount: 1840,  due: 'Jul 8',   cat: 'Utilities',     color: '#f59e0b', icon: '⚡' },
  { name: 'Internet',      amount: 999,   due: 'Jul 10',  cat: 'Utilities',     color: '#6366f1', icon: '🌐' },
]

export default function UpcomingBills() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <span className="section-title">Upcoming Bills</span>
        <span className="coming-soon-badge">Demo</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {BILLS.map((b, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 0',
            borderBottom: i < BILLS.length - 1 ? '1px solid var(--border-subtle)' : 'none',
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 9, flexShrink: 0,
              background: `${b.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, border: `1px solid ${b.color}25`,
            }}>
              {b.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{b.name}</p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{b.cat} · Due {b.due}</p>
            </div>
            <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{b.amount.toLocaleString('en-IN')}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(245,158,11,0.07)', borderRadius: 10, border: '1px solid rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span style={{ fontSize: 11, color: '#f59e0b' }}>₹3,607 due in the next 10 days</span>
      </div>
    </div>
  )
}
