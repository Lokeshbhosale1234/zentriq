import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

export default function Layout({ children, onAddTransaction }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar
          onAddTransaction={onAddTransaction}
          onMobileMenuToggle={() => setMobileOpen(p => !p)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
