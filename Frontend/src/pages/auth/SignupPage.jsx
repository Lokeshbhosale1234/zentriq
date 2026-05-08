import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/authApi'
import { useAuth } from '../../context/AuthContext'

function Field({
  id,
  label,
  type = 'text',
  placeholder,
  autoComplete,
  value,
  onChange,
  error,
  loading
}) {
  return (
    <div>
      <label
        className="block text-xs font-600 mb-1.5 uppercase tracking-wider"
        style={{ color: 'var(--text-muted)' }}
      >
        {label}
      </label>

      <input
        className="input"
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={loading}
      />

      {error && (
        <p
          className="text-xs mt-1"
          style={{ color: 'var(--accent-red)' }}
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default function SignupPage() {

  const navigate = useNavigate()
  const { saveAuth } = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const validate = () => {

    const e = {}

    if (!form.name.trim()) {
      e.name = 'Name is required'
    }

    if (!form.email.trim()) {
      e.email = 'Email is required'
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      e.email = 'Enter a valid email'
    }

    if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }

    if (form.password !== form.confirm) {
      e.confirm = 'Passwords do not match'
    }

    return e
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    const errs = validate()

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)

    try {

      const data = await register({
        name: form.name,
        email: form.email,
        password: form.password
      })

      saveAuth(data)

      navigate('/', { replace: true })

    } catch (err) {

      setErrors({
        submit: err.message || 'Registration failed'
      })

    } finally {

      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--bg-primary)' }}
    >

      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(99,102,241,0.12), transparent)',
        }}
      />

      <div
        className="w-full max-w-md animate-slide-up"
        style={{ position: 'relative', zIndex: 1 }}
      >

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">

          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #818cf8)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>

          <span
            className="font-display font-700 text-2xl"
            style={{ color: 'var(--text-primary)' }}
          >
            FinFlow
          </span>

        </div>

        {/* Card */}
        <div className="card p-8">

          <div className="mb-7 text-center">

            <h1
              className="font-display font-700 text-2xl mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              Create account
            </h1>

            <p
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              Get started with FinFlow today
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <Field
              id="name"
              label="Full Name"
              placeholder="John Doe"
              autoComplete="name"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              error={errors.name}
              loading={loading}
            />

            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              error={errors.email}
              loading={loading}
            />

            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              value={form.password}
              onChange={e => set('password', e.target.value)}
              error={errors.password}
              loading={loading}
            />

            <Field
              id="confirm"
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              autoComplete="new-password"
              value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
              error={errors.confirm}
              loading={loading}
            />

            {errors.submit && (
              <div
                className="rounded-xl px-4 py-3 text-sm animate-fade-in"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#ef4444'
                }}
              >
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full justify-center mt-2"
              style={{ padding: '0.75rem' }}
              disabled={loading}
            >

              {loading ? (

                <span className="flex items-center gap-2">

                  <svg
                    className="animate-spin"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      opacity=".25"
                    />
                    <path d="M21 12a9 9 0 00-9-9" />
                  </svg>

                  Creating account…

                </span>

              ) : 'Create account'}

            </button>

          </form>

          <p
            className="mt-6 text-center text-sm"
            style={{ color: 'var(--text-muted)' }}
          >
            Already have an account?{' '}

            <Link
              to="/login"
              className="font-600 transition-colors"
              style={{ color: 'var(--accent-purple)' }}
              onMouseEnter={e =>
                e.currentTarget.style.color = '#818cf8'
              }
              onMouseLeave={e =>
                e.currentTarget.style.color = 'var(--accent-purple)'
              }
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>
  )
}