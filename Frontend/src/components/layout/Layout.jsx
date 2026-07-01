import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

export default function Layout({ children, onAddTransaction }) {
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(256)
  const [isMobile,     setIsMobile]     = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const el = document.querySelector('aside[aria-label="Main navigation"]')
    if (!el) return
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) setSidebarWidth(entry.contentRect.width)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const marginLeft = isMobile ? 0 : sidebarWidth

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', position: 'relative' }}>
      <div aria-hidden style={{
        position: 'fixed', top: '-30vh', left: '50%', transform: 'translateX(-50%)',
        width: '80vw', maxWidth: 1200, height: '60vh', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.04) 0%, transparent 70%)',
      }}/>
      <div className="noise-overlay" aria-hidden />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div style={{
        position: 'relative', zIndex: 1, minHeight: '100dvh',
        display: 'flex', flexDirection: 'column',
        marginLeft,
        transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <Topbar onAddTransaction={onAddTransaction} onMobileMenuToggle={() => setMobileOpen(p => !p)} />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarGutter: 'stable' }}>
          <div className="main-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
