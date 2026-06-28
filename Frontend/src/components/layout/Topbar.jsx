import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PAGE_TITLES = {
  '/':             { title: 'Overview',      sub: 'Your financial overview' },
  '/transactions': { title: 'Transactions',  sub: 'Manage your money flow' },
  '/analytics':    { title: 'Analytics',     sub: 'Spending patterns & trends' },
  '/budgets':      { title: 'Budgets',       sub: 'Track your spending limits' },
  '/ai':           { title: 'AI Insights',   sub: 'AI-powered financial intelligence' },
  '/payment':      { title: 'Payments',      sub: 'Bill payments & transfers' },
}

const NOTIFS = [
  { id: 1, type: 'warning', title: 'Budget limit reached',  body: 'Food & Dining is at 92% of budget', time: '2m ago', unread: true  },
  { id: 2, type: 'info',    title: 'AI Insight ready',      body: 'New spending analysis available',   time: '1h ago', unread: true  },
  { id: 3, type: 'success', title: 'Goal milestone!',       body: 'Emergency Fund is at 60%',         time: '3h ago', unread: false },
  { id: 4, type: 'info',    title: 'Monthly report',        body: 'Your June summary is ready',       time: '1d ago', unread: false },
]

export default function Topbar({ onAddTransaction, onMobileMenuToggle }) {
  const location = useLocation()
  const { user } = useAuth()
  const [showNotifs, setShowNotifs] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFS)
  const notifRef = useRef(null)

  const page = PAGE_TITLES[location.pathname] || { title: 'Arvexa', sub: '' }
  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))

  return (
    <header style={{
      height: 'var(--topbar-h)',
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', padding: '0 18px', gap: 14,
      position: 'sticky', top: 0, zIndex: 30, flexShrink: 0,
    }}>
      {/* Mobile toggle */}
      <button onClick={onMobileMenuToggle} className="btn-icon lg:hidden" style={{ flexShrink: 0 }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
          {page.title}
        </h1>
        {page.sub && (
          <p style={{ fontSize: 11, color: '#444444', marginTop: 1 }}>{page.sub}</p>
        )}
      </div>

      {/* Search */}
      <div className="topbar-search hidden md:flex">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444444" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search transactions…" aria-label="Search" />
        <span style={{ fontSize: 10, color: '#333333', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: 3, letterSpacing: '0.04em' }}>⌘K</span>
      </div>

      {/* Add transaction */}
      <button onClick={onAddTransaction} className="btn btn-primary" style={{ height: 34, padding: '0 13px', fontSize: 12 }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span className="hidden sm:inline">Add</span>
      </button>

      {/* Notifications */}
      <div style={{ position: 'relative' }} ref={notifRef}>
        <button
          className="btn-icon"
          style={{ width: 34, height: 34, padding: 0, position: 'relative' }}
          onClick={() => setShowNotifs(p => !p)}
          aria-label="Notifications"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {unreadCount > 0 && <span className="notif-dot" />}
        </button>

        {showNotifs && (
          <div className="dropdown" style={{ position: 'absolute', right: 0, top: 42, width: 300, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px 9px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ fontSize: 11, color: '#666666', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 280, overflowY: 'auto', padding: '5px 0' }}>
              {notifs.map(n => (
                <div
                  key={n.id}
                  className="dropdown-item"
                  style={{ alignItems: 'flex-start', gap: 9, padding: '9px 11px' }}
                  onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 6, flexShrink: 0,
                    background: n.type === 'warning' ? 'rgba(245,158,11,0.1)' : n.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12,
                  }}>
                    {n.type === 'warning' ? '⚠' : n.type === 'success' ? '✓' : 'i'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{n.title}</p>
                      {n.unread && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ffffff', flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: 11, color: '#555555', marginTop: 1 }}>{n.body}</p>
                    <p style={{ fontSize: 10, color: '#333333', marginTop: 2 }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '6px' }}>
              <button className="dropdown-item" style={{ width: '100%', justifyContent: 'center', fontSize: 11, color: '#666666' }}>
                View all
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: 7, flexShrink: 0,
        background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 800, color: '#ffffff', cursor: 'pointer',
      }} title={user?.name}>
        {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'A'}
      </div>
    </header>
  )
}
