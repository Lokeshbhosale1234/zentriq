import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    to: '/', label: 'Dashboard', end: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="3" width="7" height="7" rx="1.5"/>
        <rect x="14" y="14" width="7" height="7" rx="1.5"/>
        <rect x="3" y="14" width="7" height="7" rx="1.5"/>
      </svg>
    ),
  },
  {
    to: '/transactions', label: 'Transactions',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
      </svg>
    ),
  },
  {
    to: '/analytics', label: 'Analytics',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-4"/>
      </svg>
    ),
  },
  {
    to: '/budgets', label: 'Budgets',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>
        <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
      </svg>
    ),
  },
]

const SOON = [
  {
    label: 'AI Insights',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
      </svg>
    ),
  },
  {
    label: 'Payments',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
  },
]

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const location  = useLocation()

  // Auto-close on route change (mobile)
  useEffect(() => { onMobileClose?.() }, [location.pathname])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'Z'

  return (
    <>
      {/* ── Mobile overlay ────────────────────────────────────────── */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: 'rgba(3,3,11,0.75)',
          backdropFilter: 'blur(6px)',
          opacity:        mobileOpen ? 1 : 0,
          pointerEvents:  mobileOpen ? 'auto' : 'none',
          transition:     'opacity 0.28s ease',
        }}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* ── Sidebar panel ─────────────────────────────────────────── */}
      <aside
        aria-label="Main navigation"
        style={{
          position:       'fixed',
          insetY:         0,
          left:           0,
          zIndex:         50,
          display:        'flex',
          flexDirection:  'column',
          height:         '100dvh',
          width:          collapsed ? 'var(--sidebar-w-sm)' : 'var(--sidebar-w)',
          background:     'var(--bg-surface)',
          borderRight:    '1px solid var(--border)',
          flexShrink:     0,
          transition:     'width 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          transform:      mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          // Desktop override via media-query handled by class below
        }}
        className="lg:!translate-x-0"
      >
        {/* ── Logo area ─────────────────────────────────────────── */}
        <div
          className="flex items-center flex-shrink-0"
          style={{
            height:       'var(--topbar-h)',
            padding:      '0 14px',
            borderBottom: '1px solid var(--border)',
            gap:          12,
          }}
        >
          {/* Logo mark */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width:      32,
              height:     32,
              borderRadius: 9,
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
              boxShadow:  '0 0 20px rgba(99,102,241,0.35)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>

          {/* Brand name */}
          {!collapsed && (
            <span
              className="font-display font-700 flex-1 min-w-0 truncate"
              style={{ fontSize: 15, letterSpacing: '-0.025em', color: 'var(--text-primary)' }}
            >
              Zentriq
            </span>
          )}

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(c => !c)}
            className="hidden lg:flex items-center justify-center transition-all duration-150"
            style={{
              width:        24,
              height:       24,
              borderRadius: 6,
              color:        'var(--text-muted)',
              background:   'transparent',
              flexShrink:   0,
              border:       'none',
              cursor:       'pointer',
              marginLeft:   collapsed ? 0 : 'auto',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)' }}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              {collapsed ? <path d="M9 18l6-6-6-6"/> : <path d="M15 18l-6-6 6-6"/>}
            </svg>
          </button>

          {/* Mobile close */}
          <button
            onClick={onMobileClose}
            className="lg:hidden flex items-center justify-center ml-auto"
            style={{
              width:        28,
              height:       28,
              borderRadius: 8,
              color:        'var(--text-secondary)',
              background:   'rgba(255,255,255,0.05)',
              border:       '1px solid var(--border)',
              cursor:       'pointer',
              flexShrink:   0,
            }}
            aria-label="Close menu"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Nav ───────────────────────────────────────────────── */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3" style={{ padding: collapsed ? '12px 8px' : '12px 8px' }}>
          {!collapsed && (
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 10px', marginBottom: 6 }}>
              Main
            </p>
          )}

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NAV.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                  style={{ justifyContent: collapsed ? 'center' : undefined, padding: collapsed ? '9px 0' : undefined }}
                >
                  <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  {!collapsed && <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Coming soon */}
          <div style={{ marginTop: 20 }}>
            {!collapsed && (
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '0 10px', marginBottom: 6 }}>
                Coming Soon
              </p>
            )}
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
              {SOON.map(item => (
                <li key={item.label}>
                  <div
                    className="nav-item"
                    style={{
                      cursor:         'not-allowed',
                      opacity:        0.45,
                      justifyContent: collapsed ? 'center' : undefined,
                      padding:        collapsed ? '9px 0' : undefined,
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                    {!collapsed && (
                      <>
                        <span style={{ flex: 1 }}>{item.label}</span>
                        <span className="badge badge-violet" style={{ fontSize: 9 }}>Soon</span>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* ── User footer ───────────────────────────────────────── */}
        <div
          style={{
            flexShrink: 0,
            padding:    '10px 8px',
            borderTop:  '1px solid var(--border)',
          }}
        >
          <div
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            10,
              padding:        '8px 8px',
              borderRadius:   10,
              background:     'rgba(255,255,255,0.025)',
              justifyContent: collapsed ? 'center' : undefined,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width:        30,
                height:       30,
                borderRadius: 8,
                background:   'linear-gradient(135deg, #6366f1, #10b981)',
                display:      'flex',
                alignItems:   'center',
                justifyContent: 'center',
                fontSize:     11,
                fontWeight:   700,
                color:        '#fff',
                flexShrink:   0,
                letterSpacing: '0.04em',
              }}
            >
              {initials}
            </div>
            {!collapsed && user && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.name || 'User'}
                </p>
                <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
