import React, { useEffect, useState } from 'react'

function getScoreConfig(score) {
  if (score >= 80) return { color: '#22c55e', label: 'Excellent' }
  if (score >= 60) return { color: '#ffffff', label: 'Good'      }
  if (score >= 40) return { color: '#f59e0b', label: 'Fair'      }
  return              { color: '#ef4444', label: 'Needs Work' }
}

export default function HealthScoreWidget({ score = 72, breakdown, loading }) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const cfg = getScoreConfig(score)

  useEffect(() => {
    if (loading) return
    const start = Date.now(), duration = 1000
    const raf = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      setAnimatedScore(Math.round((1 - Math.pow(1 - p, 3)) * score))
      if (p < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [score, loading])

  const R = 44, C = 2 * Math.PI * R
  const dashOffset = C * (1 - animatedScore / 100)

  const bars = breakdown || [
    { label: 'Savings Rate',     value: 35, color: '#22c55e' },
    { label: 'Budget Adherence', value: 60, color: '#ffffff' },
    { label: 'Expense Control',  value: 75, color: '#888888' },
    { label: 'Overspending',     value: 5,  color: '#ef4444' },
  ]

  if (loading) return (
    <div className="card" style={{ padding: 18 }}>
      <div className="skeleton" style={{ width: 120, height: 11, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 16 }}>
        <div className="skeleton" style={{ width: 96, height: 96, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 7, marginBottom: 10, width: `${80 + i * 3}%` }} />)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="card" style={{ padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#444444', marginBottom: 1 }}>Financial Health</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Health Score</p>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: `${cfg.color}14`, color: cfg.color, border: `1px solid ${cfg.color}28` }}>
          {cfg.label}
        </span>
      </div>

      <div className="health-score-inner" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ position: 'relative', width: 96, height: 96, flexShrink: 0 }}>
          <svg width="96" height="96" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="48" cy="48" r={R} fill="none"
              stroke={cfg.color} strokeWidth="8"
              strokeDasharray={C} strokeDashoffset={dashOffset}
              strokeLinecap="round" transform="rotate(-90 48 48)"
              style={{ transition: 'stroke-dashoffset 0.05s linear', filter: `drop-shadow(0 0 6px ${cfg.color}60)` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="font-mono" style={{ fontSize: 22, fontWeight: 800, color: cfg.color, lineHeight: 1 }}>{animatedScore}</span>
            <span style={{ fontSize: 9, color: '#444444', marginTop: 1 }}>/100</span>
          </div>
        </div>

        <div className="health-score-bars" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {bars.map((bar, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 10, color: '#666666', fontWeight: 500 }}>{bar.label}</span>
                <span className="font-mono" style={{ fontSize: 10, color: bar.color, fontWeight: 600 }}>{bar.value}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${bar.value}%`, background: bar.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
