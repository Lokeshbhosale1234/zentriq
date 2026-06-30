import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV = [
  {
    to: '/', label: 'Overview', end: true,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>,
  },
  {
    to: '/transactions', label: 'Transactions',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>,
  },
  {
    to: '/budgets', label: 'Budgets',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>,
  },
  {
    to: '/ai', label: 'AI Insights',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>,
    badge: 'AI',
  },
]

const SOON = [
  {
    to: '/payment', label: 'Payments',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>,
  },
  {
    to: '/goals', label: 'Goals',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  },
  {
    to: '/investments', label: 'Investments',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
  },
]

/* ── Arvexa Wordmark Logo ───────────────────────────────────────── */
const ArvexaLogo = ({ collapsed }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
    {/* Icon — 3×3 grid dots, white */}
    <div style={{
      width: 28, height: 28, display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)', gap: 3, flexShrink: 0,
      padding: 3,
    }}>
      {[1,0,1, 1,1,0, 0,1,1].map((on, i) => (
        <div key={i} style={{ borderRadius: 2, background: on ? '#ffffff' : 'rgba(255,255,255,0.18)' }} />
      ))}
    </div>
    {!collapsed && (
      <span style={{
        fontSize: 16, fontWeight: 800, letterSpacing: '-0.04em',
        color: '#ffffff', whiteSpace: 'nowrap', fontFamily: 'Inter, sans-serif',
      }}>
        Arvexa
      </span>
    )}
  </div>
)

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  useEffect(() => { onMobileClose?.() }, [location.pathname])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  const w = collapsed ? 'var(--sidebar-w-sm)' : 'var(--sidebar-w)'

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 lg:hidden"
        style={{
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          transition: 'opacity 0.22s ease',
        }}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          width: w,
          background: '#0f0f0f',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column', zIndex: 50,
          transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
          overflow: 'hidden',
        }}
        className={`${mobileOpen ? '' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* ── Logo row ────────────────────────────────────────────── */}
        <div style={{
          height: 'var(--topbar-h)', padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <ArvexaLogo collapsed={collapsed} />

          <button
            onClick={() => setCollapsed(p => !p)}
            className="btn-icon hidden lg:flex"
            style={{ width: 28, height: 28, padding: 0, flexShrink: 0 }}
            aria-label={collapsed ? 'Expand' : 'Collapse'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {collapsed
                ? <path d="M13 17l5-5-5-5M6 17l5-5-5-5"/>
                : <path d="M11 17l-5-5 5-5M18 17l-5-5 5-5"/>}
            </svg>
          </button>
        </div>

        {/* ── Nav ─────────────────────────────────────────────────── */}
        <nav style={{ padding: '10px 8px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {!collapsed && (
            <p className="section-subtitle" style={{ padding: '4px 8px 8px' }}>Menu</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NAV.map(item => (
              <NavLink
                key={item.to} to={item.to} end={item.end}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon" style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 99, background: 'rgba(255,255,255,0.1)', color: '#888888' }}>{item.badge}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '14px 4px' }} />

          {!collapsed && (
            <p className="section-subtitle" style={{ padding: '4px 8px 8px' }}>Coming Soon</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {SOON.map(item => (
              <div
                key={item.to}
                className="nav-link"
                style={{ opacity: 0.35, cursor: 'default', pointerEvents: 'none' }}
                title={collapsed ? `${item.label} — Soon` : undefined}
              >
                <span style={{ flexShrink: 0, display: 'flex' }}>{item.icon}</span>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <span className="coming-soon-badge">Soon</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* ── User ────────────────────────────────────────────────── */}
        <div style={{ padding: '10px 8px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 9,
            padding: '9px 10px', borderRadius: 9,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, flexShrink: 0,
              background: '#222222', border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#ffffff',
            }}>
              {initials}
            </div>
            {!collapsed && (
              <>
                <div style={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', lineHeight: 1.3 }} className="truncate">
                    {user?.name || 'User'}
                  </p>
                  <p style={{ fontSize: 10, color: '#555555' }} className="truncate">
                    {user?.email || ''}
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="btn-icon"
                  style={{ width: 26, height: 26, padding: 0, flexShrink: 0, border: 'none' }}
                  aria-label="Sign out"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
