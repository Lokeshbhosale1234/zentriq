import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PAGE_TITLES = {
  '/':             { title: 'Overview',     sub: 'Your financial overview' },
  '/transactions': { title: 'Transactions', sub: 'Manage your money flow' },
  '/budgets':      { title: 'Budgets',      sub: 'Track your spending limits' },
  '/ai':           { title: 'AI Insights',  sub: 'AI-powered financial intelligence' },
}

const NOTIFS = [
  { id: 1, type: 'warning', title: 'Budget limit reached',  body: 'Food & Dining is at 92% of budget', time: '2m ago', unread: true  },
  { id: 2, type: 'info',    title: 'AI Insight ready',      body: 'New spending analysis available',   time: '1h ago', unread: true  },
  { id: 3, type: 'success', title: 'Goal milestone!',       body: 'Emergency Fund is at 60%',         time: '3h ago', unread: false },
  { id: 4, type: 'info',    title: 'Monthly report',        body: 'Your June summary is ready',       time: '1d ago', unread: false },
]

/* ─────────────────────────────────────────────────────────────────────────────
   PanelToggleIcon — the Efferd-style sidebar toggle icon
   ─────────────────────────────────────────────────────────────────────────────
   Replaces the «» arrow buttons inside the sidebar.
   This is the standard panel/sidebar icon used by Linear, Efferd, Notion, etc:
   a rectangle representing the full window, with a vertical line on the left
   representing the sidebar panel. Clicking it collapses / expands the sidebar.
   ─────────────────────────────────────────────────────────────────────────────*/
const PanelToggleIcon = ({ collapsed }) => (
  <svg
    width="16" height="16" viewBox="0 0 16 16"
    fill="none" xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Outer window rectangle */}
    <rect x="1.5" y="1.5" width="13" height="13" rx="2.5"
      stroke="currentColor" strokeWidth="1.3"/>
    {/* Sidebar panel divider line */}
    <line x1="5.5" y1="1.5" x2="5.5" y2="14.5"
      stroke="currentColor" strokeWidth="1.3"/>
    {/* Small arrow chevron indicating collapse / expand direction */}
    {collapsed
      ? <path d="M7.5 5.5 L10 8 L7.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      : <path d="M9.5 5.5 L7 8 L9.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    }
  </svg>
)

export default function Topbar({ onAddTransaction, onMobileMenuToggle, onToggleSidebar, sidebarCollapsed }) {
  const location     = useLocation()
  const navigate     = useNavigate()
  const [showNotifs,  setShowNotifs]  = useState(false)
  const [notifs,      setNotifs]      = useState(NOTIFS)
  const [searchValue, setSearchValue] = useState('')
  const notifRef = useRef(null)

  const page        = PAGE_TITLES[location.pathname] || { title: 'Arvexa', sub: '' }
  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    const h = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/transactions?q=${encodeURIComponent(e.target.value.trim())}`)
      setSearchValue('')
    }
  }

  return (
    <header style={{
      height: 'var(--topbar-h)',
      background: 'rgba(10,10,10,0.92)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10,
      position: 'sticky', top: 0, zIndex: 30, flexShrink: 0,
    }}>

      {/* ── Mobile hamburger (small screens only) ─────────────────── */}
      <button
        onClick={onMobileMenuToggle}
        className="btn-icon lg:hidden"
        style={{ flexShrink: 0, width: 34, height: 34, padding: 0 }}
        aria-label="Open navigation"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6"  x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* ── Panel toggle (desktop only) — Efferd pattern ──────────────
          This is the primary sidebar collapse control. It lives in the
          topbar content area, not inside the sidebar itself. This is the
          same UX pattern Efferd, Linear, and Notion use: a panel icon
          in the breadcrumb / topbar area that controls the sidebar.
      ──────────────────────────────────────────────────────────────── */}
      <button
        onClick={onToggleSidebar}
        className="btn-icon hidden lg:flex"
        style={{ flexShrink: 0, width: 34, height: 34, padding: 0 }}
        aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <PanelToggleIcon collapsed={sidebarCollapsed} />
      </button>

      {/* ── Page title ────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.02em', color: '#ffffff', lineHeight: 1.2 }}>
          {page.title}
        </h1>
        {page.sub && (
          <p className="topbar-sub" style={{ fontSize: 11, color: '#444444', marginTop: 1 }}>{page.sub}</p>
        )}
      </div>

      {/* ── Global search ─────────────────────────────────────────────── */}
      <div className="topbar-search hidden md:flex">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#444444" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={handleSearchKey}
          placeholder="Search transactions…"
          aria-label="Search transactions"
        />
        <span className="shortcut-hint" style={{ fontSize: 10, color: '#2a2a2a', background: 'rgba(255,255,255,0.05)', padding: '2px 5px', borderRadius: 3 }}>↵</span>
      </div>

      {/* ── Add button ────────────────────────────────────────────────── */}
      <button
        onClick={onAddTransaction}
        className="btn btn-primary"
        style={{ height: 34, padding: '0 13px', fontSize: 12, flexShrink: 0 }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        <span className="hidden sm:inline">Add</span>
      </button>

      {/* ── Notifications ─────────────────────────────────────────────── */}
      <div style={{ position: 'relative' }} ref={notifRef}>
        <button
          className="btn-icon"
          style={{ width: 34, height: 34, padding: 0, position: 'relative', flexShrink: 0 }}
          onClick={() => setShowNotifs(p => !p)}
          aria-label="Notifications"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {unreadCount > 0 && <span className="notif-dot" />}
        </button>

        {showNotifs && (
          <div className="dropdown" style={{ position: 'absolute', right: 0, top: 42, width: 296, zIndex: 100 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px 9px', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#ffffff' }}>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))}
                  style={{ fontSize: 11, color: '#555555', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: 280, overflowY: 'auto' }}>
              {notifs.map(n => (
                <div key={n.id} className="dropdown-item"
                  style={{ alignItems: 'flex-start', padding: '9px 11px' }}
                  onClick={() => setNotifs(ns => ns.map(x => x.id === n.id ? { ...x, unread: false } : x))}>
                  <div style={{ width: 26, height: 26, borderRadius: 6, flexShrink: 0, background: n.type === 'warning' ? 'rgba(245,158,11,0.1)' : n.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                    {n.type === 'warning' ? '⚠' : n.type === 'success' ? '✓' : 'i'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, marginLeft: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#ffffff' }}>{n.title}</p>
                      {n.unread && <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#ffffff', flexShrink: 0 }} />}
                    </div>
                    <p style={{ fontSize: 11, color: '#555555', marginTop: 1 }}>{n.body}</p>
                    <p style={{ fontSize: 10, color: '#333333', marginTop: 2 }}>{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
