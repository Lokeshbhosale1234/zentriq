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
      for (const entry of entries) {
        // Use the border-box size (matches the sidebar's actual rendered width,
        // since box-sizing: border-box is used globally) instead of contentRect,
        // which excludes the sidebar's 1px border and causes a hairline gap.
        const borderBoxWidth = entry.borderBoxSize?.[0]?.inlineSize
        setSidebarWidth(borderBoxWidth ?? entry.contentRect.width)
      }
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
        // No transition here on purpose: the ResizeObserver above already
        // reports the sidebar's width on every animation frame while it
        // transitions (aside has its own 'width 0.25s' transition). Adding
        // a second transition on marginLeft double-eases an already-animating
        // value, so content lags a step behind the sidebar and a gap appears
        // mid-animation. Letting marginLeft snap to each observed value keeps
        // it perfectly in lockstep with the sidebar instead.
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
