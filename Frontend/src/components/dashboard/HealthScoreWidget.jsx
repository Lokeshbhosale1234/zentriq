import React, { useEffect, useState } from 'react'

const SCORE_COLORS = {
  excellent: { color: '#10b981', label: 'Excellent', bg: 'rgba(16,185,129,0.08)' },
  good:      { color: '#6366f1', label: 'Good',      bg: 'rgba(99,102,241,0.08)' },
  fair:      { color: '#f59e0b', label: 'Fair',      bg: 'rgba(245,158,11,0.08)' },
  poor:      { color: '#f43f5e', label: 'Needs Work',bg: 'rgba(244,63,94,0.08)'  },
}

function getScoreConfig(score) {
  if (score >= 80) return SCORE_COLORS.excellent
  if (score >= 60) return SCORE_COLORS.good
  if (score >= 40) return SCORE_COLORS.fair
  return SCORE_COLORS.poor
}

export default function HealthScoreWidget({ score = 72, breakdown, loading }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const cfg = getScoreConfig(score)

  // Animate score on mount
  useEffect(() => {
    if (loading) return
    const start = Date.now()
    const duration = 1200
    const raf = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimatedScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [score, loading])

  // SVG ring params
  const R = 52, C = 2 * Math.PI * R
  const pct = animatedScore / 100
  const dashOffset = C * (1 - pct)

  const bars = breakdown || [
    { label: 'Savings Rate',     value: score > 70 ? 85 : score > 50 ? 60 : 35, color: '#10b981' },
    { label: 'Budget Adherence', value: score > 70 ? 78 : score > 50 ? 55 : 40, color: '#6366f1' },
    { label: 'Expense Control',  value: score > 70 ? 72 : score > 50 ? 65 : 50, color: '#22d3ee' },
    { label: 'Income Stability', value: score > 70 ? 90 : score > 50 ? 75 : 60, color: '#a855f7' },
  ]

  if (loading) {
    return (
      <div className="card" style={{ padding: 20 }}>
        <div className="skeleton" style={{ width: 120, height: 12, marginBottom: 20 }} />
        <div style={{ display: 'flex', gap: 24 }}>
          <div className="skeleton" style={{ width: 120, height: 120, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 8, marginBottom: 12, width: `${70 + i*5}%` }} />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(99,102,241,0.04) 100%)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 2 }}>Financial Health</p>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Health Score</p>
        </div>
        <span className="badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`, fontSize: 10 }}>
          {cfg.label}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        {/* Ring */}
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            {/* Fill */}
            <circle
              cx="60" cy="60" r={R} fill="none"
              stroke={cfg.color} strokeWidth="10"
              strokeDasharray={C}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 8px ${cfg.color}80)` }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="font-mono" style={{ fontSize: 26, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
              {animatedScore}
            </span>
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>/100</span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {bars.map((bar, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 500 }}>{bar.label}</span>
                <span className="font-mono" style={{ fontSize: 11, color: bar.color, fontWeight: 600 }}>{bar.value}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${bar.value}%`, background: bar.color, boxShadow: `0 0 6px ${bar.color}60` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
