import React from 'react'
import { useLocation } from 'react-router-dom'

const PAGE_META = {
  '/':             { title: 'Dashboard',    subtitle: 'Financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage your transactions' },
  '/analytics':    { title: 'Analytics',    subtitle: 'Insights & trends' },
}

export default function Topbar({ onAddTransaction }) {
  const { pathname } = useLocation()
  const meta = PAGE_META[pathname] || { title: 'FinFlow', subtitle: '' }
  const now  = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <header
      className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
      style={{
        background: 'rgba(10,10,20,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      {/* Page title */}
      <div>
        <h1 className="font-display text-xl font-700 tracking-tight" style={{ color: 'var(--text-primary)' }}>
          {meta.title}
        </h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{meta.subtitle}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <span className="hidden md:block text-xs" style={{ color: 'var(--text-muted)' }}>{dateStr}</span>

        {/* Add button (shown on dashboard + transactions) */}
        {(pathname === '/' || pathname === '/transactions') && (
          <button className="btn btn-primary" onClick={onAddTransaction}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Transaction
          </button>
        )}

        {/* Notification bell */}
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
