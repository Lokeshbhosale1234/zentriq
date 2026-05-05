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

export default function AddTransactionModal({ onClose, onSubmit }) {
  const [form, setForm]       = useState(INITIAL)
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.title.trim())    e.title    = 'Title is required'
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) e.amount = 'Enter a valid amount'
    if (!form.category)        e.category = 'Select a category'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await onSubmit({
        ...form,
        amount: parseFloat(form.amount),
        transactionDate: new Date(form.transactionDate).toISOString(),
      })
      onClose()
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to add transaction' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div
        className="card w-full max-w-lg mx-4 animate-slide-up overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="font-display font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
              Add Transaction
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Fill in the details below</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Type toggle */}
          <div>
            <label className="block text-xs font-600 mb-2 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Type
            </label>
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {['CREDIT', 'DEBIT'].map(t => (
                <button
                  key={t}
                  onClick={() => set('type', t)}
                  className="flex-1 py-2.5 text-sm font-600 transition-all"
                  style={{
                    background: form.type === t
                      ? t === 'CREDIT' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'
                      : 'transparent',
                    color: form.type === t
                      ? t === 'CREDIT' ? '#10b981' : '#ef4444'
                      : 'var(--text-secondary)',
                  }}
                >
                  {t === 'CREDIT' ? '↓ Income' : '↑ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Title *
            </label>
            <input
              className="input"
              placeholder="e.g. Netflix subscription"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
            {errors.title && <p className="text-xs mt-1" style={{ color: 'var(--accent-red)' }}>{errors.title}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Amount (USD) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-muted)' }}>$</span>
              <input
                className="input pl-7"
                type="number" min="0" step="0.01"
                placeholder="0.00"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
            </div>
            {errors.amount && <p className="text-xs mt-1" style={{ color: 'var(--accent-red)' }}>{errors.amount}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Category *
            </label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-xs mt-1" style={{ color: 'var(--accent-red)' }}>{errors.category}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Status
            </label>
            <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Date & Time
            </label>
            <input
              className="input"
              type="datetime-local"
              value={form.transactionDate}
              onChange={e => set('transactionDate', e.target.value)}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Description (optional)
            </label>
            <textarea
              className="input resize-none"
              rows={2}
              placeholder="Additional notes…"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          {errors.submit && (
            <div className="rounded-xl p-3 text-sm" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4" style={{ borderTop: '1px solid var(--border)' }}>
          <button className="btn btn-ghost flex-1" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary flex-1" onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/>
                  <path d="M21 12a9 9 0 00-9-9"/>
                </svg>
                Saving…
              </span>
            ) : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
