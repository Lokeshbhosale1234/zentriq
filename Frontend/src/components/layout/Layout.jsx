import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

export default function Layout({ children, onAddTransaction }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(264)

  useEffect(() => {
    const el = document.querySelector('aside[aria-label="Main navigation"]')
    if (!el) return
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) setSidebarWidth(entry.contentRect.width)
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', position: 'relative' }}>
      {/* Ambient glows */}
      <div aria-hidden style={{
        position: 'fixed', top: '-30vh', left: '50%', transform: 'translateX(-50%)',
        width: '80vw', maxWidth: 1200, height: '60vh', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
      }}/>
      <div aria-hidden style={{
        position: 'fixed', bottom: '-20vh', right: '-5vw', zIndex: 0, pointerEvents: 'none',
        width: '50vw', height: '50vh',
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.035) 0%, transparent 70%)',
      }}/>
      <div className="noise-overlay" aria-hidden />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div
        style={{
          position: 'relative', zIndex: 1, minHeight: '100dvh',
          display: 'flex', flexDirection: 'column',
          transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        className="lg:ml-[var(--sidebar-offset,264px)]"
        ref={el => { if (el) el.style.setProperty('--sidebar-offset', `${sidebarWidth}px`) }}
      >
        <Topbar onAddTransaction={onAddTransaction} onMobileMenuToggle={() => setMobileOpen(p => !p)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarGutter: 'stable' }}>
          <div className="mx-auto" style={{ padding: 'clamp(16px, 3vw, 24px)', maxWidth: 1440 }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
