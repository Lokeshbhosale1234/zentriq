import { useCallback, useEffect, useState } from 'react'
import { fetchInsightsSummary } from '../api/insights'
import HealthScoreWidget from '../components/dashboard/HealthScoreWidget'

/* ── Tab configuration (unchanged logic) ──────────────────────────── */
const TABS = [
  { key: 'ALL',     label: 'All' },
  { key: 'WARNING', label: 'Warnings' },
  { key: 'DANGER',  label: 'Critical' },
  { key: 'SAVINGS', label: 'Savings' },
  { key: 'TRENDS',  label: 'Trends' },
  { key: 'SUCCESS', label: 'Wins' },
]

function matchesTab(tab, insight) {
  switch (tab) {
    case 'ALL':     return true
    case 'WARNING': return insight.severity === 'warning'
    case 'DANGER':  return insight.severity === 'danger'
    case 'SAVINGS': return insight.type === 'SAVINGS_SUGGESTION'
    case 'TRENDS':  return insight.type === 'TREND_ANALYSIS' || insight.type === 'CATEGORY_INTELLIGENCE'
    case 'SUCCESS': return insight.severity === 'success'
    default:        return true
  }
}

/* ── Severity config ─────────────────────────────────────────────── */
const SEV = {
  danger:  { color: '#f43f5e', bg: 'rgba(244,63,94,0.08)',   border: 'rgba(244,63,94,0.2)',   label: 'Critical', badgeBg: 'rgba(244,63,94,0.12)'  },
  warning: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.2)',  label: 'Warning',  badgeBg: 'rgba(245,158,11,0.12)' },
  success: { color: '#10b981', bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.2)', label: 'Positive', badgeBg: 'rgba(16,185,129,0.12)' },
  info:    { color: '#6366f1', bg: 'rgba(99,102,241,0.07)',  border: 'rgba(99,102,241,0.2)', label: 'Info',     badgeBg: 'rgba(99,102,241,0.12)' },
}

/* ── Sub-components ──────────────────────────────────────────────── */
function TabBar({ activeTab, onChange, counts }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
      {TABS.map(({ key, label }) => {
        const count = counts[key] ?? 0
        const isActive = activeTab === key
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '6px 12px', borderRadius: 99,
              fontSize: 12, fontWeight: 600,
              background: isActive ? '#6366f1' : 'rgba(255,255,255,0.05)',
              color: isActive ? 'white' : 'var(--text-secondary)',
              border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
              cursor: 'pointer', transition: 'all 0.15s ease',
              boxShadow: isActive ? '0 4px 14px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            {label}
            {count > 0 && (
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99,
                background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
                color: isActive ? 'white' : 'var(--text-muted)',
              }}>{count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

function InsightCard({ insight }) {
  const cfg = SEV[insight.severity] || SEV.info
  const barWidth = insight.changePercent != null ? Math.min(Math.abs(insight.changePercent), 100) : null
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      onClick={() => setExpanded(p => !p)}
      style={{
        padding: '14px 16px', borderRadius: 14,
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        cursor: 'pointer', transition: 'all 0.15s ease',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color + '50'; e.currentTarget.style.transform = 'translateY(-1px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = cfg.border; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {insight.icon && <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{insight.icon}</span>}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{insight.title}</h3>
            {insight.trend && (
              <span style={{ color: insight.trend === 'up' ? '#f43f5e' : insight.trend === 'down' ? '#10b981' : 'var(--text-muted)', fontSize: 14, lineHeight: 1 }}>
                {insight.trend === 'up' ? '↑' : insight.trend === 'down' ? '↓' : '→'}
              </span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 99, background: cfg.badgeBg, color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
          {(expanded || !insight.message?.length > 100) && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{insight.message}</p>
          )}
          {!expanded && insight.message?.length > 100 && (
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{insight.message.slice(0, 100)}… <span style={{ color: 'var(--indigo-light)' }}>more</span></p>
          )}
        </div>
      </div>

      {barWidth !== null && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="progress-track" style={{ flex: 1 }}>
            <div className="progress-fill" style={{ width: `${barWidth}%`, background: cfg.color }} />
          </div>
          <span className="font-mono" style={{ fontSize: 10, color: cfg.color, fontWeight: 700, minWidth: 36, textAlign: 'right' }}>
            {Math.abs(insight.changePercent).toFixed(1)}%
          </span>
        </div>
      )}

      {insight.category && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Category:</span>
          <span style={{ fontSize: 10, color: 'var(--text-secondary)', fontWeight: 600 }}>{insight.category}</span>
        </div>
      )}
    </div>
  )
}

function SmartSummaryCard({ data, loading }) {
  if (loading) return (
    <div className="card" style={{ padding: 20 }}>
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 10, marginBottom: 8, width: `${90 - i*10}%` }} />)}
    </div>
  )
  if (!data?.smartSummary) return null
  return (
    <div className="card" style={{ padding: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.07) 0%, rgba(168,85,247,0.04) 100%)', borderColor: 'rgba(99,102,241,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--violet-dim)', border: '1px solid rgba(168,85,247,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>✨</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>AI Smart Summary</p>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Generated by Gemini</p>
        </div>
        <div style={{ marginLeft: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
      </div>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{data.smartSummary}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 16 }}>
        {[
          { label: 'Income',   value: `₹${(data.totalIncome || 0).toLocaleString('en-IN')}`,   color: '#10b981' },
          { label: 'Expenses', value: `₹${(data.totalExpenses || 0).toLocaleString('en-IN')}`, color: '#f43f5e' },
          { label: 'Saved',    value: `${(data.savingsRate || 0).toFixed(1)}%`,                 color: '#6366f1' },
        ].map((m, i) => (
          <div key={i} style={{ padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <p className="font-mono" style={{ fontSize: 15, fontWeight: 800, color: m.color }}>{m.value}</p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, fontWeight: 600 }}>{m.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function TrendCard({ data, loading }) {
  if (loading) return (
    <div className="card" style={{ padding: 20 }}>
      <div className="skeleton" style={{ height: 12, width: 120, marginBottom: 16 }} />
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 44, marginBottom: 8, borderRadius: 10 }} />)}
    </div>
  )
  if (!data?.topCategory) return null
  return (
    <div className="card" style={{ padding: 20 }}>
      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 14 }}>Trend Analysis</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { label: 'Top spending', value: data.topCategory, icon: '📊', color: '#f43f5e' },
          { label: 'Fastest growing', value: data.fastestGrowingCategory || '—', icon: '📈', color: '#f59e0b' },
        ].map((t, i) => (
          <div key={i} style={{ padding: '10px 12px', borderRadius: 10, background: `${t.color}08`, border: `1px solid ${t.color}20`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <div>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{t.label}</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: t.color, marginTop: 2 }}>{t.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────── */
export default function Insights() {
  const [data,    setData]    = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)
  const [tab,     setTab]     = useState('ALL')

  const load = useCallback(() => {
    setLoading(true); setError(null)
    fetchInsightsSummary()
      .then(res => { setData(res?.data || res); setLoading(false) })
      .catch(err => { setError(err?.response?.data?.message || err?.message || 'Unexpected error'); setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  const tabCounts = TABS.reduce((acc, { key }) => {
    acc[key] = key === 'ALL' ? (data?.insights?.length ?? 0) : (data?.insights?.filter(i => matchesTab(key, i))?.length ?? 0)
    return acc
  }, {})

  const filteredInsights = data?.insights?.filter(i => matchesTab(tab, i)) || []
  const healthScore = data?.healthScore?.score ?? data?.healthScore?.overallScore ?? data?.healthScore ?? null

  return (
    <div className="page-enter" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Error */}
      {error && (
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--red-dim)', border: '1px solid rgba(244,63,94,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span style={{ flex: 1, fontSize: 13, color: '#f43f5e' }}>{error}</span>
          <button onClick={load} style={{ fontSize: 11, fontWeight: 600, color: '#f43f5e', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.25)', borderRadius: 7, padding: '4px 10px', cursor: 'pointer' }}>Retry</button>
        </div>
      )}

      {/* ── Main layout ──────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20 }} className="xl:grid-cols-3">

        {/* Left: health + trends */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <HealthScoreWidget
            score={typeof healthScore === 'number' ? healthScore : 72}
            breakdown={data?.healthScore?.components ? Object.entries(data.healthScore.components).map(([label, value], i) => ({
              label, value: Math.round(value), color: ['#10b981','#6366f1','#22d3ee','#a855f7'][i % 4]
            })) : undefined}
            loading={loading}
          />
          <TrendCard data={data} loading={loading} />
        </div>

        {/* Right: smart summary + insight cards */}
        <div className="xl:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SmartSummaryCard data={data} loading={loading} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <TabBar activeTab={tab} onChange={setTab} counts={tabCounts} />
            <div style={{ display: 'flex', align: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', alignSelf: 'center' }}>
                {loading ? 'Loading…' : `${filteredInsights.length} insight${filteredInsights.length !== 1 ? 's' : ''}`}
              </span>
              <button
                onClick={load} disabled={loading}
                style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', opacity: loading ? 0.5 : 1 }}
              >
                {loading ? 'Loading…' : '↻ Refresh'}
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 110, borderRadius: 14 }} />)}
            </div>
          ) : filteredInsights.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
              {filteredInsights.map((insight, idx) => (
                <InsightCard key={`${insight.type}-${idx}`} insight={insight} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>All clear in this category!</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>No insights match the current filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
