import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// ✅ Global Axios interceptors — must be imported before any API call
import './api/axiosSetup'

import { AuthProvider }       from './context/AuthContext'
import ProtectedRoute         from './components/auth/ProtectedRoute'
import Layout                 from './components/layout/Layout'
import Dashboard              from './pages/Dashboard'
import Transactions           from './pages/Transactions'
import Analytics              from './pages/Analytics'
import BudgetsPage            from './pages/budget/BudgetsPage'
import LoginPage              from './pages/auth/LoginPage'
import SignupPage             from './pages/auth/SignupPage'
import AddTransactionModal    from './components/transactions/AddTransactionModal'
import { useTransactions }    from './hooks/useTransactions'

/* ── Placeholder for unimplemented routes ────────────────────────── */
function PlaceholderPage({ title, desc }) {
  return (
    <div style={{
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      minHeight:      '60vh',
      animation:      'fadeIn 0.32s ease both',
    }}>
      <div className="card" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 420 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 16,
          background: 'var(--indigo-dim)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 18px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--indigo-light)" strokeWidth="1.7" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8"  y1="12" x2="16" y2="12"/>
          </svg>
        </div>
        <h2 className="font-display font-700" style={{ fontSize: 18, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8 }}>
          {title}
        </h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
  )
}

/* ── Inner app — rendered once user is authenticated ─────────────── */
function AppInner() {
  const [showModal, setShowModal] = useState(false)
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
          <Route path="/ai"           element={<PlaceholderPage title="AI Insights"  desc="Coming soon — AI-powered anomaly detection, spending forecasts, and financial health scores." />} />
          <Route path="/payment"      element={<PlaceholderPage title="Payments"     desc="Coming soon — integrated payment processing, transfers, and bill scheduling." />} />
          <Route path="*"             element={<PlaceholderPage title="404 — Page Not Found" desc="The page you're looking for doesn't exist or has been moved." />} />
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

/* ── Root — AuthProvider wraps the entire tree ───────────────────── */
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected — everything else */}
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
