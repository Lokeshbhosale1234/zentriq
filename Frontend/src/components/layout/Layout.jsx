import React from 'react'
import Sidebar from './Sidebar'
import Topbar  from './Topbar'

export default function Layout({ children, onAddTransaction }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onAddTransaction={onAddTransaction} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
