import React, { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export const ArvexaIcon = ({ size = 24 }) => (
  <svg
    width={size} height={size}
    viewBox="0 0 80 80"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: 'block', flexShrink: 0 }}
  >
    {/* Left leg — slightly wider base, refined taper */}
    <polygon points="6,72 28,8 38,8 16,72" fill="#ffffff" />
    {/* Right leg */}
    <polygon points="74,72 52,8 42,8 64,72" fill="#ffffff" />
    {/* Crossbar left — sits at visual midpoint */}
    <rect x="16" y="43" width="20" height="10" rx="1.5" fill="#ffffff" />
    {/* Crossbar right — gap reads as upward arrow */}
    <rect x="44" y="43" width="20" height="10" rx="1.5" fill="#ffffff" />
  </svg>
)

const DURATION = '0.22s'
const EASING   = 'cubic-bezier(0.4,0,0.2,1)'

const tx = (collapsed) => ({
  overflow:    'hidden',
  whiteSpace:  'nowrap',
  opacity:     collapsed ? 0 : 1,
  maxWidth:    collapsed ? 0 : 220,
  transform:   collapsed ? 'translateX(-4px)' : 'translateX(0)',
  transition:  `opacity ${DURATION} ${EASING}, transform ${DURATION} ${EASING}, max-width ${DURATION} ${EASING}`,
  pointerEvents: collapsed ? 'none' : 'auto',
})

const NAV = [
  { to: '/', label: 'Overview', end: true,
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/></svg> },
  { to: '/transactions', label: 'Transactions',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg> },
  { to: '/budgets', label: 'Budgets',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg> },
  { to: '/ai', label: 'AI Insights', badge: 'AI',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg> },
]

const SOON = [
  { label: 'Payments',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  { label: 'Goals',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg> },
  { label: 'Investments',
    icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
]

const IUser    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const IBilling = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
const IBell    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
const ILogout  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>

function PopoverBtn({ icon, label, danger, onClick }) {
  const [h, setH] = useState(false)
  return (
    <button
      role="menuitem"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 9,
        padding: '8px 10px', borderRadius: 7, fontSize: 12, border: 'none',
        background: h ? (danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.06)') : 'transparent',
        color: h ? (danger ? '#ef4444' : '#ffffff') : '#888888',
        cursor: 'pointer', textAlign: 'left', transition: 'background 0.12s, color 0.12s',
      }}
    >
      {icon}{label}
    </button>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const [collapsed,  setCollapsed]  = useState(false)
  const [showAcct,   setShowAcct]   = useState(false)
  const [btnHover,   setBtnHover]   = useState(false)
  const { user, logout } = useAuth()
  const location    = useLocation()
  const acctRef     = useRef(null)

  useEffect(() => { onMobileClose?.() }, [location.pathname])

  useEffect(() => {
    const h = (e) => { if (acctRef.current && !acctRef.current.contains(e.target)) setShowAcct(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A'

  return (
    <>
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          aria-hidden="true"
        />
      )}

      <aside
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, bottom: 0, left: 0,
          width: collapsed ? 'var(--sidebar-w-sm)' : 'var(--sidebar-w)',
          background: '#0f0f0f',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', flexDirection: 'column',
          zIndex: 50, overflow: 'hidden',
          transition: `width ${DURATION} ${EASING}, transform ${DURATION} ${EASING}`,
        }}
        className={`${mobileOpen ? '' : '-translate-x-full'} lg:translate-x-0`}
      >

        {/* ── LOGO + TOGGLE ROW ─────────────────────────────────────────
            Matches Efferd exactly: icon left, wordmark flex-1, toggle flush right.
            Toggle is a 24×24 rounded button with a double-chevron that
            rotates 180° on collapse — integrated into the header, not floating. */}
        <div style={{
          height: 'var(--topbar-h)',
          display: 'flex', alignItems: 'center',
          padding: '0 10px 0 12px', gap: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <ArvexaIcon size={22} />

          {/* Wordmark */}
          <span style={{
            ...tx(collapsed),
            marginLeft: 9,
            fontSize: 15, fontWeight: 800,
            letterSpacing: '-0.045em',
            color: '#ffffff',
            fontFamily: 'Inter, system-ui, sans-serif',
            userSelect: 'none',
            flex: 1,
          }}>
            Arvexa
          </span>

          {/* ── EFFERD-STYLE TOGGLE ──────────────────────────────────────
              24×24px, rounded-md, transparent bg with subtle hover,
              double chevron that rotates with the sidebar animation,
              desktop only (mobile uses hamburger in topbar). */}
          <button
            onClick={() => setCollapsed(p => !p)}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex"
            style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              alignItems: 'center', justifyContent: 'center',
              background: btnHover ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: `1px solid ${btnHover ? 'rgba(255,255,255,0.1)' : 'transparent'}`,
              cursor: 'pointer', padding: 0,
              transition: `background 0.13s ease, border-color 0.13s ease`,
              marginLeft: 4,
            }}
          >
            <svg
              width="14" height="14" viewBox="0 0 14 14"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              style={{
                color: btnHover ? '#cccccc' : '#555555',
                transition: `color 0.13s ease, transform ${DURATION} ${EASING}`,
                transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              {/* Double chevron — ‹‹ points left (collapse), rotates to ›› (expand) */}
              <path d="M8 2.5L4.5 7L8 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 2.5L7.5 7L11 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <nav style={{ flex: 1, padding: '6px 6px', overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* Section label */}
          <div style={{ padding: '10px 8px 5px', ...tx(collapsed) }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: '#353535' }}>Menu</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {NAV.map(item => (
              <NavLink
                key={item.to} to={item.to} end={item.end}
                title={collapsed ? item.label : undefined}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <div style={{
                    display: 'flex', alignItems: 'center',
                    padding: '7px 8px',
                    borderRadius: 7,
                    background: isActive ? 'rgba(255,255,255,0.09)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
                    color: isActive ? '#ffffff' : '#666666',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    transition: `background 0.13s ease, color 0.13s ease, padding ${DURATION} ${EASING}`,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#aaaaaa' } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#666666' } }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span style={{ ...tx(collapsed), marginLeft: collapsed ? 0 : 9, fontSize: 13, fontWeight: isActive ? 600 : 500, flex: 1 }}>
                      {item.label}
                    </span>
                    {item.badge && (
                      <span style={{ ...tx(collapsed), fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 99, background: 'rgba(255,255,255,0.08)', color: '#555555', flexShrink: 0 }}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 4px' }} />

          <div style={{ padding: '2px 8px 5px', ...tx(collapsed) }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: '#353535' }}>Coming Soon</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {SOON.map(item => (
              <div key={item.label}
                title={collapsed ? `${item.label} — Soon` : undefined}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '7px 8px', borderRadius: 7,
                  color: '#333333', userSelect: 'none', cursor: 'default',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  transition: `padding ${DURATION} ${EASING}`,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ ...tx(collapsed), marginLeft: collapsed ? 0 : 9, fontSize: 13, fontWeight: 500, flex: 1 }}>
                  {item.label}
                </span>
                <span style={{ ...tx(collapsed), fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 99, background: 'rgba(255,255,255,0.04)', color: '#333333', letterSpacing: '0.06em', flexShrink: 0 }}>
                  Soon
                </span>
              </div>
            ))}
          </div>
        </nav>

        {/* ── ACCOUNT ──────────────────────────────────────────────────── */}
        <div ref={acctRef} style={{ position: 'relative', padding: '6px', borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>

          {showAcct && (
            <div role="menu" style={{
              position: 'absolute', bottom: 'calc(100% + 6px)', left: 6, right: 6,
              background: '#1c1c1c', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 11, boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
              padding: 5, zIndex: 200, animation: 'fadeIn 0.14s ease both',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 9px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 3 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, flexShrink: 0, background: '#282828', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: '#fff' }}>{initials}</div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
                  <p style={{ fontSize: 10, color: '#555555', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
                </div>
              </div>
              <PopoverBtn icon={<IUser />}    label="Account" />
              <PopoverBtn icon={<IBilling />} label="Billing" />
              <PopoverBtn icon={<IBell />}    label="Notifications" />
              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '3px 5px' }} />
              <PopoverBtn icon={<ILogout />}  label="Log out" danger onClick={() => { setShowAcct(false); logout() }} />
            </div>
          )}

          <button
            onClick={() => setShowAcct(p => !p)}
            aria-haspopup="menu"
            aria-expanded={showAcct}
            style={{
              width: '100%', display: 'flex', alignItems: 'center',
              padding: '8px 9px', borderRadius: 8,
              background: showAcct ? 'rgba(255,255,255,0.07)' : 'transparent',
              border: `1px solid ${showAcct ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
              cursor: 'pointer', textAlign: 'left',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: `background 0.13s ease, border-color 0.13s ease, padding ${DURATION} ${EASING}`,
            }}
            onMouseEnter={e => { if (!showAcct) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' } }}
            onMouseLeave={e => { if (!showAcct) { e.currentTarget.style.background = 'transparent' } }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 7, flexShrink: 0, background: '#282828', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: '#fff' }}>
              {initials}
            </div>
            <div style={{ ...tx(collapsed), marginLeft: collapsed ? 0 : 9, flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#ffffff', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: 10, color: '#444444', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
            </div>
            <span style={{ ...tx(collapsed), color: '#444', display: 'flex', flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points={showAcct ? '6 15 12 9 18 15' : '6 9 12 15 18 9'} />
              </svg>
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}
