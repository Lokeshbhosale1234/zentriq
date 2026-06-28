import React from 'react'

const GOALS = [
  { name: 'Emergency Fund', target: 300000, current: 182000, color: '#10b981', icon: '🛡️', deadline: 'Dec 2026' },
  { name: 'Vacation Trip',  target: 80000,  current: 34500,  color: '#6366f1', icon: '✈️', deadline: 'Mar 2027' },
  { name: 'New Laptop',     target: 120000, current: 78000,  color: '#22d3ee', icon: '💻', deadline: 'Sep 2026' },
]

export default function GoalsWidget() {
  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <span className="section-title">Savings Goals</span>
        <span className="coming-soon-badge">Demo</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {GOALS.map((g, i) => {
          const pct = Math.round((g.current / g.target) * 100)
          return (
            <div key={i}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{g.icon}</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{g.name}</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Due {g.deadline}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="font-mono" style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{pct}%</span>
                  <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>₹{g.current.toLocaleString('en-IN')} / ₹{g.target.toLocaleString('en-IN')}</p>
                </div>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${g.color}, ${g.color}cc)`, boxShadow: `0 0 8px ${g.color}40` }} />
              </div>
            </div>
          )
        })}
      </div>
      <button className="btn btn-ghost" style={{ width: '100%', marginTop: 14, fontSize: 12 }}>
        + Add a Goal
      </button>
    </div>
  )
}
