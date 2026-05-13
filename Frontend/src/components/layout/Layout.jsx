import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

/**
 * Layout
 *
 * Sidebar is position:fixed (always) so it never affects document flow.
 * The main column gets a left margin on lg+ to compensate.
 * On mobile the sidebar slides in as an overlay — zero layout impact.
 *
 * CSS custom properties drive the sidebar widths:
 *   --sidebar-w:    260px  (expanded)
 *   --sidebar-w-sm: 70px   (collapsed)
 *
 * We read the actual rendered sidebar width via a ResizeObserver on the
 * sidebar element so the margin stays pixel-perfect during collapse animation.
 */
export default function Layout({ children, onAddTransaction }) {
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [sidebarWidth,  setSidebarWidth]  = useState(260)
  const sidebarRef = React.useRef(null)

  // Track sidebar width changes (collapse animation)
  useEffect(() => {
    const el = document.querySelector('aside[aria-label="Main navigation"]')
    if (!el) return
    sidebarRef.current = el
    const obs = new ResizeObserver(entries => {
      for (const entry of entries) {
        setSidebarWidth(entry.contentRect.width)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100dvh', position: 'relative' }}>
      {/* Ambient background glows */}
      <div aria-hidden style={{
        position: 'fixed', top: '-40vh', left: '50%', transform: 'translateX(-50%)',
        width: '90vw', maxWidth: 1400, height: '70vh', zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse, rgba(99,102,241,0.055) 0%, transparent 65%)',
      }}/>
      <div aria-hidden style={{
        position: 'fixed', bottom: '-25vh', right: '-8vw', zIndex: 0, pointerEvents: 'none',
        width: '55vw', height: '55vh',
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.03) 0%, transparent 65%)',
      }}/>

      {/* Sidebar — always fixed, slides in/out on mobile */}
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/*
        Main content column.
        - Mobile  (< lg): full width, no left margin (sidebar is overlay only)
        - Desktop (≥ lg): left margin = actual sidebar pixel width (tracked via ResizeObserver)
      */}
      <div
        style={{
          position:   'relative',
          zIndex:     1,
          minHeight:  '100dvh',
          display:    'flex',
          flexDirection: 'column',
          // Inline style drives the desktop margin; Tailwind class overrides for mobile
          transition: 'margin-left 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        // On mobile: no margin. On lg+: margin matches sidebar.
        // We use a data attribute + CSS rather than JS-controlled inline style for mobile
        className="lg:ml-[var(--sidebar-offset,260px)]"
        // Update the CSS variable so the Tailwind arbitrary value stays reactive
        ref={el => {
          if (el) el.style.setProperty('--sidebar-offset', `${sidebarWidth}px`)
        }}
      >
        <Topbar
          onAddTransaction={onAddTransaction}
          onMobileMenuToggle={() => setMobileOpen(p => !p)}
        />

        <main
          className="flex-1 overflow-y-auto overflow-x-hidden"
          style={{ scrollbarGutter: 'stable' }}
        >
          <div
            className="mx-auto"
            style={{ padding: 'clamp(16px, 3.5vw, 28px)', maxWidth: 1480 }}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
