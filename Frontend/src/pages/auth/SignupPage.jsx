import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

const Spinner = () => (
  <svg className="animate-spin-custom" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/><path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

const ArvexaMark = ({ size = 26 }) => (
  <div style={{
    width: size, height: size, display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)', gap: Math.round(size * 0.1),
    flexShrink: 0, padding: Math.round(size * 0.1),
  }}>
    {[1,0,1, 1,1,0, 0,1,1].map((on, i) => (
      <div key={i} style={{ borderRadius: 2, background: on ? '#ffffff' : 'rgba(255,255,255,0.2)' }} />
    ))}
  </div>
)

const StrengthBar = ({ password }) => {
  const checks = [password.length >= 8, /[A-Z]/.test(password), /[0-9]/.test(password), /[^A-Za-z0-9]/.test(password)]
  const score  = checks.filter(Boolean).length
  const colors = ['', '#ef4444', '#f59e0b', '#888888', '#22c55e']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  if (!password) return null
  return (
    <div style={{ marginTop: 7 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 5 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: 2, borderRadius: 99, background: i <= score ? colors[score] : 'rgba(255,255,255,0.07)', transition: 'background 0.2s' }} />
        ))}
      </div>
      <p style={{ fontSize: 10, color: colors[score] || '#333333', fontWeight: 600 }}>{labels[score]}</p>
    </div>
  )
}

export default function SignupPage() {
  const navigate     = useNavigate()
  const { saveAuth } = useAuth()
  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError('') }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields'); return }
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password })
      saveAuth(data)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const labelStyle = { display: 'block', fontSize: 11, fontWeight: 600, color: '#555555', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.06em' }

  return (
    <div style={{ minHeight: '100dvh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          <ArvexaMark size={26} />
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff' }}>Arvexa</span>
        </div>

        <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '30px 26px' }}>
          <div style={{ marginBottom: 22 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff', marginBottom: 4 }}>Create your account</h2>
            <p style={{ fontSize: 12, color: '#555555' }}>Start managing your finances smarter today</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
            <div>
              <label style={labelStyle}>Full name</label>
              <input className="input" type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" autoComplete="name" disabled={loading} />
            </div>

            <div>
              <label style={labelStyle}>Email address</label>
              <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" autoComplete="email" disabled={loading} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: 'relative' }}>
                <input className="input" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" autoComplete="new-password" disabled={loading} style={{ paddingRight: 42 }} />
                <button type="button" onClick={() => setShowPw(p => !p)} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444444', display: 'flex', padding: 4 }}>
                  {showPw
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
                </button>
              </div>
              <StrengthBar password={form.password} />
            </div>

            <div>
              <label style={labelStyle}>Confirm password</label>
              <input className="input" type={showPw ? 'text' : 'password'} value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Re-enter password" autoComplete="new-password" disabled={loading} />
            </div>

            {error && (
              <div style={{ padding: '9px 13px', borderRadius: 8, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span style={{ fontSize: 12, color: '#ef4444' }}>{error}</span>
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ height: 42, marginTop: 2, fontSize: 13 }}>
              {loading ? <><Spinner /> Creating account…</> : 'Create account'}
            </button>
          </form>

          <div style={{ marginTop: 18, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: '#444444' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#888888', textDecoration: 'none', fontWeight: 600, borderBottom: '1px solid #333333' }}>Sign in</Link>
            </p>
          </div>
        </div>

        <p style={{ fontSize: 11, color: '#2a2a2a', textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
          By creating an account you agree to Arvexa's{' '}
          <span style={{ color: '#444444', cursor: 'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: '#444444', cursor: 'pointer' }}>Privacy Policy</span>.
        </p>
      </div>
    </div>
  )
}
