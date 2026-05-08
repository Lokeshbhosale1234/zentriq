import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PAGE_META = {
  '/':             { title: 'Dashboard',    subtitle: 'Financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage your transactions' },
  '/analytics':    { title: 'Analytics',    subtitle: 'Insights & trends' },
}

export default function Topbar({ onAddTransaction }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
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
        <span className="hidden md:block text-xs" style={{ color: 'var(--text-muted)' }}>{dateStr}</span>

        {/* Add Transaction button */}
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
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>

        {/* User + Logout */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-500" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
