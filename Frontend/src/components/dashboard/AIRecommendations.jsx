import React, { useState } from 'react'

const RECS = [
  {
    id: 1, type: 'saving',
    title: 'Reduce dining spend by 20%',
    body: 'You spent ₹8,400 on Food & Dining this month — 32% above your average. Cutting back could save ₹1,680/month.',
    impact: '+₹1,680/mo', color: '#10b981', bg: 'rgba(16,185,129,0.06)',
  },
  {
    id: 2, type: 'alert',
    title: 'Entertainment budget at 89%',
    body: 'You\'ve used ₹2,136 of your ₹2,400 entertainment budget with 12 days remaining.',
    impact: 'Budget alert', color: '#f59e0b', bg: 'rgba(245,158,11,0.06)',
  },
  {
    id: 3, type: 'insight',
    title: 'Savings rate improved 8%',
    body: 'Your savings rate increased from 18% to 26% compared to last month. Keep up the momentum!',
    impact: '26% rate', color: '#6366f1', bg: 'rgba(99,102,241,0.06)',
  },
]

const TypeIcon = ({ type }) => {
  if (type === 'saving') return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
  if (type === 'alert')   return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
  return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
}

export default function AIRecommendations({ insights, loading }) {
  const [expanded, setExpanded] = useState(null)
  const recs = insights?.length ? insights.slice(0, 3).map((ins, i) => ({
    id: i, type: ins.severity === 'danger' ? 'alert' : ins.severity === 'success' ? 'insight' : 'saving',
    title: ins.title || ins.message?.slice(0, 50),
    body: ins.message || ins.description || '',
    impact: ins.potentialSavings ? `+₹${Math.round(ins.potentialSavings).toLocaleString('en-IN')}/mo` : 'Action',
    color: ins.severity === 'danger' ? '#f43f5e' : ins.severity === 'success' ? '#10b981' : '#6366f1',
    bg: ins.severity === 'danger' ? 'rgba(244,63,94,0.06)' : ins.severity === 'success' ? 'rgba(16,185,129,0.06)' : 'rgba(99,102,241,0.06)',
  })) : RECS

  if (loading) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div className="skeleton" style={{ width: 140, height: 12, marginBottom: 16 }} />
        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 68, marginBottom: 8, borderRadius: 12 }} />)}
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 20 }}>
      <div className="section-header">
        <div>
          <span className="section-title">AI Recommendations</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>Live AI</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {recs.map((rec, i) => (
          <div
            key={rec.id}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              padding: '13px 14px', borderRadius: 12,
              background: rec.bg, border: `1px solid ${rec.color}22`,
              cursor: 'pointer', transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${rec.color}40` }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = `${rec.color}22` }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 9 }}>
                <div style={{ color: rec.color, marginTop: 1, flexShrink: 0 }}>
                  <TypeIcon type={rec.type} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{rec.title}</p>
                  {expanded === i && (
                    <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 5, lineHeight: 1.5 }}>{rec.body}</p>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: rec.color, whiteSpace: 'nowrap', background: `${rec.color}12`, padding: '2px 7px', borderRadius: 99 }}>
                {rec.impact}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <a href="/ai" style={{ fontSize: 12, color: 'var(--indigo-light)', textDecoration: 'none', fontWeight: 500 }}>
          View all insights →
        </a>
      </div>
    </div>
  )
}
