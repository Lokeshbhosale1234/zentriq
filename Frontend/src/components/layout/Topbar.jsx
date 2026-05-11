import React from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PAGE_META = {
  '/':             { title: 'Dashboard',    subtitle: 'Financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage your transactions' },
  '/analytics':    { title: 'Analytics',    subtitle: 'Insights & trends' },
  '/budgets':      { title: 'Budgets',      subtitle: 'Track spending limits' },
}

export default function Topbar({ onAddTransaction, onMobileMenuToggle }) {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const meta = PAGE_META[pathname] || { title: 'FinFlow', subtitle: '' }
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <header
      className="flex items-center justify-between px-4 sm:px-6 py-4 sticky top-0 z-10"
      style={{
        background: 'rgba(10,10,20,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className="min-w-0">
          <h1 className="font-display text-lg sm:text-xl font-700 tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
            {meta.title}
          </h1>
          <p className="text-xs mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <span className="hidden xl:block text-xs" style={{ color: 'var(--text-muted)' }}>{dateStr}</span>

        {/* Add Transaction — shown on relevant pages */}
        {(pathname === '/' || pathname === '/transactions') && (
          <button className="btn btn-primary" onClick={onAddTransaction}
            style={{ padding: '0.5rem 0.875rem', fontSize: '0.8rem' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* Notification bell */}
        <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
        </button>

        {/* User + Logout */}
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-500 truncate max-w-[120px]" style={{ color: 'var(--text-primary)' }}>{user.name}</span>
              <span className="text-xs truncate max-w-[120px]" style={{ color: 'var(--text-muted)' }}>{user.email}</span>
            </div>
            <button onClick={logout} title="Logout"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
