import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

const Spinner = () => (
  <svg className="animate-spin-custom" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
    <path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

const FieldError = ({ msg }) => msg ? (
  <p className="animate-slide-down" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#f43f5e', marginTop: 5 }}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    {msg}
  </p>
) : null

/* Strength meter */
function StrengthBar({ password }) {
  const score = !password ? 0
    : password.length < 6  ? 1
    : password.length < 10 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4 : 3

  const colors = ['transparent', '#f43f5e', '#f59e0b', '#10b981', '#10b981']
  const labels = ['',            'Weak',     'Fair',    'Good',    'Strong']

  return score > 0 ? (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <div style={{ display: 'flex', gap: 3, flex: 1 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 99,
            background:  i <= score ? colors[score] : 'rgba(255,255,255,0.07)',
            transition: 'background 0.28s ease',
          }}/>
        ))}
      </div>
      <span style={{ fontSize: 10, fontWeight: 600, color: colors[score], minWidth: 36 }}>
        {labels[score]}
      </span>
    </div>
  ) : null
}

export default function SignupPage() {
  const navigate     = useNavigate()
  const { saveAuth } = useAuth()

  const [form,    setForm]    = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const [showPw,  setShowPw]  = useState(false)

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: null })) }

  const validate = () => {
    const e = {}
    if (!form.name.trim())                             e.name     = 'Full name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address'
    if (form.password.length < 6)                      e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirm)                e.confirm  = 'Passwords do not match'
    return e
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password })
      saveAuth(data)
      navigate('/', { replace: true })
    } catch (err) {
      setErrors({ submit: err.message || 'Registration failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight:      '100dvh',
      background:     'var(--bg-base)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '24px 16px',
      position:       'relative',
      overflow:       'hidden',
    }}>
      {/* Ambient glows */}
      <div aria-hidden style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(99,102,241,0.13) 0%, transparent 65%)',
      }}/>
      <div aria-hidden style={{
        position: 'fixed', bottom: '-20vh', left: '-10vw', zIndex: 0, pointerEvents: 'none',
        width: '55vw', height: '55vh',
        background: 'radial-gradient(ellipse, rgba(168,85,247,0.055) 0%, transparent 65%)',
      }}/>
      <div className="noise-overlay" aria-hidden/>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
            boxShadow:  '0 0 28px rgba(99,102,241,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="font-display font-700" style={{ fontSize: 20, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Zentriq
          </span>
        </div>

        {/* Card */}
        <div className="card-glass animate-slide-up" style={{
          padding:   '32px 32px 28px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          <div style={{ marginBottom: 24, textAlign: 'center' }}>
            <h1 className="font-display font-700" style={{ fontSize: 22, letterSpacing: '-0.025em', color: 'var(--text-primary)', marginBottom: 5 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Start tracking your finances with Zentriq
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>

            {/* Full name */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.03em' }}>
                Full name
              </label>
              <input
                className="input"
                type="text" autoComplete="name"
                placeholder="Jane Smith"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                disabled={loading}
                style={{ height: 42 }}
              />
              <FieldError msg={errors.name} />
            </div>

            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.03em' }}>
                Email address
              </label>
              <input
                className="input"
                type="email" autoComplete="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                disabled={loading}
                style={{ height: 42 }}
              />
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.03em' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  className="input"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  disabled={loading}
                  style={{ height: 42, paddingRight: 42 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', padding: 0, lineHeight: 0,
                    transition: 'color 0.14s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              <StrengthBar password={form.password} />
              <FieldError msg={errors.password} />
            </div>

            {/* Confirm password */}
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6, letterSpacing: '0.03em' }}>
                Confirm password
              </label>
              <input
                className="input"
                type="password" autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={e => set('confirm', e.target.value)}
                disabled={loading}
                style={{ height: 42 }}
              />
              <FieldError msg={errors.confirm} />
            </div>

            {/* Submit error */}
            {errors.submit && (
              <div className="animate-scale-in" style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '10px 13px', borderRadius: 10,
                background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
                fontSize: 13, color: '#f43f5e',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {errors.submit}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              style={{ height: 44, fontSize: 14, marginTop: 4, width: '100%' }}
              disabled={loading}
            >
              {loading ? <><Spinner /> Creating account…</> : 'Create account'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Already have an account?</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }}/>
          </div>

          <Link
            to="/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: 40, borderRadius: 10,
              background: 'var(--bg-input)', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 13, fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.16s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-input-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-input)';       e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            Sign in instead →
          </Link>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} Zentriq. All rights reserved.
        </p>
      </div>
    </div>
  )
}
