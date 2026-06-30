import React, { useState } from 'react'
import { CATEGORIES } from '../../utils/formatters'

const INITIAL = {
  title:           '',
  description:     '',
  amount:          '',
  type:            'DEBIT',
  status:          'COMPLETED',
  category:        '',
  transactionDate: new Date().toISOString().slice(0, 16),
}

const STATUS_OPTIONS = [
  { value: 'COMPLETED', label: 'Completed', color: '#10b981' },
  { value: 'PENDING',   label: 'Pending',   color: '#f59e0b' },
  { value: 'FAILED',    label: 'Failed',     color: '#f43f5e' },
  { value: 'CANCELLED', label: 'Cancelled', color: '#6366f1' },
]

const Spinner = () => (
  <svg className="animate-spin-custom" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
    <path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

export default function AddTransactionModal({ onClose, onSubmit }) {
  const [form,    setForm]    = useState(INITIAL)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())                              e.title    = 'Title is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount > 0'
    if (!form.category)                                  e.category = 'Select a category'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        amount:          parseFloat(form.amount),
        transactionDate: new Date(form.transactionDate).toISOString(),
      })
      onClose()
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save transaction. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label="Add Transaction">
      <div className="modal-sheet">

        {/* ── Header ────────────────────────────────────────────── */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            padding:        '20px 24px 18px',
            borderBottom:   '1px solid var(--border)',
            position:       'sticky',
            top:            0,
            background:     'var(--bg-elevated)',
            zIndex:         1,
            borderRadius:   '20px 20px 0 0',
          }}
        >
          <div>
            <h2
              className="font-display font-700"
              style={{ fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 2 }}
            >
              New Transaction
            </h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Record a new income or expense</p>
          </div>
          <button
            onClick={onClose}
            style={{
              width:          30,
              height:         30,
              borderRadius:   8,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              background:     'rgba(255,255,255,0.05)',
              border:         '1px solid var(--border)',
              color:          'var(--text-secondary)',
              cursor:         'pointer',
              transition:     'all 0.14s ease',
              flexShrink:     0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            aria-label="Close modal"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* ── Body ──────────────────────────────────────────────── */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Type toggle */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 8 }}>
              Transaction Type
            </label>
            <div
              style={{
                display:      'grid',
                gridTemplateColumns: '1fr 1fr',
                gap:          4,
                background:   'var(--bg-input)',
                border:       '1px solid var(--border)',
                borderRadius: 12,
                padding:      4,
              }}
            >
              {[
                { v: 'DEBIT',  l: 'Expense', icon: '↑', color: '#f43f5e' },
                { v: 'CREDIT', l: 'Income',  icon: '↓', color: '#10b981' },
              ].map(t => (
                <button
                  key={t.v}
                  type="button"
                  onClick={() => set('type', t.v)}
                  style={{
                    padding:        '9px 12px',
                    borderRadius:   9,
                    fontSize:       13,
                    fontWeight:     600,
                    cursor:         'pointer',
                    border:         'none',
                    transition:     'all 0.18s ease',
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    gap:            6,
                    background:     form.type === t.v ? (t.v === 'DEBIT' ? 'rgba(244,63,94,0.15)' : 'rgba(16,185,129,0.15)') : 'transparent',
                    color:          form.type === t.v ? t.color : 'var(--text-secondary)',
                    boxShadow:      form.type === t.v ? `0 0 0 1px ${t.color}28` : 'none',
                  }}
                >
                  <span style={{ fontSize: 15, lineHeight: 1 }}>{t.icon}</span>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
              Title *
            </label>
            <input
              className="input"
              placeholder="e.g. Netflix subscription, Grocery run…"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            {errors.title && <FieldError msg={errors.title} />}
          </div>

          {/* Amount */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
              Amount *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text-muted)', userSelect: 'none' }}>₹</span>
              <input
                className="input"
                style={{ paddingLeft: 26 }}
                type="number" min="0.01" step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
            </div>
            {errors.amount && <FieldError msg={errors.amount} />}
          </div>

          {/* Category */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
              Category *
            </label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Choose a category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <FieldError msg={errors.category} />}
          </div>

          {/* Status + Date — 2 column */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
                Status
              </label>
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
                Date & Time
              </label>
              <input
                className="input"
                type="datetime-local"
                value={form.transactionDate}
                onChange={e => set('transactionDate', e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
              Notes <span style={{ color: 'var(--text-disabled)', fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              className="input"
              style={{ resize: 'none', minHeight: 64, lineHeight: 1.6 }}
              rows={2}
              placeholder="Additional notes or memo…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div
              className="animate-scale-in"
              style={{
                display:     'flex',
                alignItems:  'center',
                gap:         10,
                padding:     '11px 14px',
                borderRadius: 10,
                background:  'rgba(244,63,94,0.08)',
                border:      '1px solid rgba(244,63,94,0.2)',
                color:       'var(--red)',
                fontSize:    13,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errors.submit}
            </div>
          )}
        </div>

        {/* ── Footer ────────────────────────────────────────────── */}
        <div
          style={{
            display:      'flex',
            gap:          10,
            padding:      '16px 24px 20px',
            borderTop:    '1px solid var(--border)',
            background:   'var(--bg-elevated)',
            borderRadius: '0 0 20px 20px',
            position:     'sticky',
            bottom:       0,
          }}
        >
          <button
            className="btn btn-ghost"
            style={{ flex: 1, padding: '10px 16px' }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: '10px 16px' }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <><Spinner /> Saving…</> : (
              <>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add Transaction
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldError({ msg }) {
  return (
    <p
      className="animate-slide-down"
      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--red)', marginTop: 5 }}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      {msg}
    </p>
  )
}
