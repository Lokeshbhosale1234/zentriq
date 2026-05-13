import React, { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const PAGE_META = {
  '/':             { title: 'Dashboard',    subtitle: 'Financial overview' },
  '/transactions': { title: 'Transactions', subtitle: 'Manage your activity' },
  '/analytics':    { title: 'Analytics',    subtitle: 'Insights & trends' },
  '/budgets':      { title: 'Budgets',      subtitle: 'Monthly spending limits' },
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Topbar({ onAddTransaction, onMobileMenuToggle }) {
  const { pathname }          = useLocation()
  const { user, logout }      = useAuth()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef               = useRef(null)

  const meta   = PAGE_META[pathname] || { title: 'Zentriq', subtitle: '' }
  const showAdd = pathname === '/' || pathname === '/transactions'

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!showMenu) return
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showMenu])

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <header
      style={{
        height:           'var(--topbar-h)',
        display:          'flex',
        alignItems:       'center',
        justifyContent:   'space-between',
        padding:          '0 clamp(12px, 3vw, 24px)',
        position:         'sticky',
        top:              0,
        zIndex:           30,
        background:       'rgba(5,5,16,0.82)',
        backdropFilter:   'blur(28px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(28px) saturate(1.5)',
        borderBottom:     '1px solid var(--border)',
        flexShrink:       0,
        gap:              12,
      }}
    >
      {/* ── Left ────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        {/* Hamburger */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden btn btn-ghost btn-icon"
          style={{ flexShrink: 0 }}
          aria-label="Open navigation"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="3" y1="7"  x2="21" y2="7"/>
            <line x1="3" y1="17" x2="21" y2="17"/>
          </svg>
        </button>

        {/* Page title block */}
        <div style={{ minWidth: 0 }}>
          <h1
            className="font-display font-700 truncate"
            style={{ fontSize: 17, letterSpacing: '-0.022em', color: 'var(--text-primary)', lineHeight: 1.2 }}
          >
            {meta.title}
          </h1>
          {user && (
            <p
              className="hidden sm:block truncate"
              style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.3, marginTop: 1 }}
            >
              {greeting()}, {user.name?.split(' ')[0] || 'there'} · {meta.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* ── Right ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

        {/* Add Transaction CTA */}
        {showAdd && (
          <button
            className="btn btn-primary"
            onClick={onAddTransaction}
            style={{ padding: '7px 13px', fontSize: 12, gap: 5 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5"  y1="12" x2="19" y2="12"/>
            </svg>
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}

        {/* Bell */}
        <button
          className="btn btn-ghost btn-icon"
          style={{ position: 'relative' }}
          aria-label="Notifications"
          title="Notifications"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {/* Active dot */}
          <span
            style={{
              position:     'absolute',
              top:          5,
              right:        5,
              width:        5,
              height:       5,
              borderRadius: '50%',
              background:   'var(--indigo)',
              border:       '1.5px solid var(--bg-surface)',
            }}
          />
        </button>

        {/* User menu */}
        {user && (
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMenu(p => !p)}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          8,
                padding:      '5px 8px 5px 5px',
                borderRadius: 10,
                border:       '1px solid var(--border)',
                background:   showMenu ? 'rgba(255,255,255,0.05)' : 'var(--bg-input)',
                cursor:       'pointer',
                transition:   'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
              onMouseLeave={e => { if (!showMenu) { e.currentTarget.style.background = 'var(--bg-input)'; e.currentTarget.style.borderColor = 'var(--border)' } }}
              aria-label="User menu"
            >
              {/* Avatar */}
              <div
                style={{
                  width:          28,
                  height:         28,
                  borderRadius:   8,
                  background:     'linear-gradient(135deg, #6366f1, #10b981)',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:       11,
                  fontWeight:     700,
                  color:          '#fff',
                  flexShrink:     0,
                  letterSpacing:  '0.04em',
                }}
              >
                {initials}
              </div>
              <span
                className="hidden md:block"
                style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-primary)', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {user.name?.split(' ')[0] || 'User'}
              </span>
              <svg
                width="10" height="10"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                className="hidden md:block"
                style={{
                  color:      'var(--text-muted)',
                  transform:  showMenu ? 'rotate(180deg)' : 'rotate(0)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Dropdown */}
            {showMenu && (
              <div
                className="animate-scale-in"
                style={{
                  position:     'absolute',
                  right:        0,
                  top:          'calc(100% + 8px)',
                  width:        220,
                  zIndex:       100,
                  background:   'var(--bg-elevated)',
                  border:       '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 14,
                  padding:      6,
                  boxShadow:    '0 16px 48px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04)',
                }}
              >
                {/* User info header */}
                <div style={{ padding: '10px 12px', marginBottom: 2 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.name}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </p>
                </div>

                <div style={{ height: 1, background: 'var(--border)', margin: '4px 0' }} />

                {/* Logout */}
                <button
                  onClick={() => { setShowMenu(false); logout() }}
                  style={{
                    width:        '100%',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          9,
                    padding:      '9px 12px',
                    borderRadius: 9,
                    fontSize:     13,
                    fontWeight:   500,
                    color:        'var(--red)',
                    background:   'transparent',
                    border:       'none',
                    cursor:       'pointer',
                    textAlign:    'left',
                    transition:   'background 0.14s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dim)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
