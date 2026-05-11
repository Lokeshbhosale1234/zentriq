import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ✅ Setup axios interceptors BEFORE anything else renders
import './api/axiosSetup'

import { AuthProvider }        from './context/AuthContext'
import ProtectedRoute          from './components/auth/ProtectedRoute'
import Layout                  from './components/layout/Layout'
import Dashboard               from './pages/Dashboard'
import Transactions            from './pages/Transactions'
import Analytics               from './pages/Analytics'
import BudgetsPage             from './pages/budget/BudgetsPage'
import LoginPage               from './pages/auth/LoginPage'
import SignupPage              from './pages/auth/SignupPage'
import AddTransactionModal     from './components/transactions/AddTransactionModal'
import { useTransactions }     from './hooks/useTransactions'

// ─── Inner app: protected routes + modal ─────────────────────────────────────
function AppInner() {
  const [showModal, setShowModal]   = useState(false)
  const { addTransaction, refetch } = useTransactions()

  const handleAdd = async (payload) => {
    await addTransaction(payload)
    refetch()
  }

  return (
    <>
      <Layout onAddTransaction={() => setShowModal(true)}>
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics"    element={<Analytics />} />
          <Route path="/budgets"      element={<BudgetsPage />} />
          <Route path="/ai"           element={<PlaceholderPage title="AI Insights"  desc="Coming soon — AI-powered financial insights and anomaly detection." />} />
          <Route path="/payment"      element={<PlaceholderPage title="Payments"     desc="Coming soon — integrated payment processing and transfers." />} />
          <Route path="*"             element={<PlaceholderPage title="404"          desc="Page not found." />} />
        </Routes>
      </Layout>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSubmit={handleAdd}
        />
      )}
    </>
  )
}

// ─── Reusable placeholder ─────────────────────────────────────────────────────
function PlaceholderPage({ title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] animate-fade-in">
      <div className="card p-10 text-center max-w-md">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <h2 className="font-display font-700 text-xl mb-2" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <p style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </div>
  )
}

// ─── Root: AuthProvider wraps everything ──────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* All other routes require authentication */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppInner />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
