import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'
import { ArvexaIcon } from '../../components/layout/Sidebar'

const Spinner = () => (
  <svg className="animate-spin-custom" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/><path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

export default function LoginPage() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const { saveAuth } = useAuth()
  const from         = location.state?.from?.pathname || '/'
  const [form,    setForm]    = useState({ email: '', password: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Please fill in all fields'); return }
    setLoading(true)
    try {
      const data = await login(form)
      saveAuth(data)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      <div aria-hidden style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% -5%, rgba(255,255,255,0.03) 0%, transparent 60%)' }}/>

      {/* Left panel */}
      <div className="hidden lg:flex" style={{ flex: '0 0 42%', flexDirection: 'column', background: '#0f0f0f', borderRight: '1px solid rgba(255,255,255,0.06)', padding: '48px 52px', position: 'relative', zIndex: 1, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <ArvexaIcon size={22} />
          <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.045em', color: '#ffffff', fontFamily: 'Inter, system-ui, sans-serif' }}>Arvexa</span>
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1.1, color: '#ffffff', marginBottom: 14 }}>
            Start your<br />journey with us.
          </h1>
          <p style={{ fontSize: 14, color: '#555555', lineHeight: 1.7, maxWidth: 300, marginBottom: 36 }}>
            AI-powered personal finance management. Track, analyse, and grow your wealth intelligently.
          </p>
          {['◈  Financial health score updated daily', '◉  AI insights powered by Gemini', '◎  Real-time budget & spending alerts'].map((f, i) => (
            <p key={i} style={{ fontSize: 13, color: '#3a3a3a', marginBottom: 10 }}>{f}</p>
          ))}
        </div>
        <div>
          <p style={{ fontSize: 10, color: '#2a2a2a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Trusted by teams at</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Startups', 'Freelancers', 'Enterprises'].map(t => (
              <span key={t} style={{ fontSize: 12, color: '#2a2a2a', fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: '#0a0a0a', position: 'relative', zIndex: 1 }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <div className="flex lg:hidden" style={{ alignItems: 'center', justifyContent: 'center', gap: 9, marginBottom: 36 }}>
            <ArvexaIcon size={22} />
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: '-0.045em', color: '#ffffff' }}>Arvexa</span>
          </div>
          <div style={{ marginBottom: 26 }}>
            <h2 style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff', lineHeight: 1.25 }}>Login or create your<br />Arvexa account.</h2>
          </div>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#444444', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" disabled={loading} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#444444', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" autoComplete="current-password" disabled={loading} style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444444', display: 'flex', padding: 4 }}>
                  {showPw
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
            </div>
            {error && (
              <div style={{ padding: '10px 13px', borderRadius: 8, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 42, marginTop: 4, fontSize: 13 }}>
              {loading ? <><Spinner /> Signing in…</> : 'Continue with Email'}
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <span style={{ fontSize: 11, color: '#333333', fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>
          <p style={{ fontSize: 12, color: '#3a3a3a', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#888888', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #333333' }}>Create account</Link>
          </p>
          <p style={{ fontSize: 11, color: '#2a2a2a', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
            By continuing, you agree to Arvexa's <span style={{ color: '#3a3a3a', cursor: 'pointer' }}>privacy policy</span>.
          </p>
        </div>
      </div>
    </div>
  )
}
