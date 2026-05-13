import React, { useState, useEffect } from 'react'
import { CATEGORIES } from '../../utils/formatters'

const MONTHS = [
  {v:1,l:'January'},{v:2,l:'February'},{v:3,l:'March'},{v:4,l:'April'},
  {v:5,l:'May'},{v:6,l:'June'},{v:7,l:'July'},{v:8,l:'August'},
  {v:9,l:'September'},{v:10,l:'October'},{v:11,l:'November'},{v:12,l:'December'},
]

const EXPENSE_CATS = CATEGORIES.filter(c => !['Salary','Freelance','Investment'].includes(c))
const INCOME_CATS  = ['Salary','Freelance','Investment']

const cy = new Date().getFullYear()
const cm = new Date().getMonth() + 1
const YEARS  = Array.from({ length: 5 }, (_, i) => cy - 1 + i)
const EMPTY  = { category: '', limitAmount: '', month: cm, year: cy }

const Spinner = () => (
  <svg className="animate-spin-custom" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".2"/>
    <path d="M21 12a9 9 0 00-9-9"/>
  </svg>
)

export default function BudgetModal({ onClose, onSubmit, editData }) {
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)
  const isEdit = Boolean(editData)

  useEffect(() => {
    if (editData) {
      setForm({ category: editData.category || '', limitAmount: editData.limitAmount || '', month: editData.month || cm, year: editData.year || cy })
    } else {
      setForm(EMPTY)
    }
  }, [editData])

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); if (errors[k]) setErrors(p => ({ ...p, [k]: null })) }

  const validate = () => {
    const e = {}
    if (!form.category)                                    e.category    = 'Select a category'
    if (!form.limitAmount || Number(form.limitAmount) <= 0) e.limitAmount = 'Enter a valid amount > 0'
    return e
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await onSubmit({ category: form.category, limitAmount: parseFloat(form.limitAmount), month: parseInt(form.month), year: parseInt(form.year) })
      onClose()
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="modal-sheet">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px 18px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-elevated)', zIndex: 1, borderRadius: '20px 20px 0 0' }}>
          <div>
            <h2 className="font-display font-700" style={{ fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 2 }}>
              {isEdit ? 'Edit Budget' : 'Create Budget'}
            </h2>
            <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Set a monthly spending limit for a category</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: 30, height: 30, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.14s ease' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Category */}
          <div>
            <Label>Category *</Label>
            <select className="input" value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">Choose a category…</option>
              <optgroup label="Expenses">{EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
              <optgroup label="Income">{INCOME_CATS.map(c => <option key={c} value={c}>{c}</option>)}</optgroup>
            </select>
            {errors.category && <FieldError msg={errors.category} />}
          </div>

          {/* Monthly limit */}
          <div>
            <Label>Monthly Limit (₹) *</Label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'var(--text-muted)', userSelect: 'none' }}>₹</span>
              <input
                className="input" style={{ paddingLeft: 26 }}
                type="number" min="1" step="100"
                placeholder="e.g. 10000"
                value={form.limitAmount}
                onChange={e => set('limitAmount', e.target.value)}
              />
            </div>
            {errors.limitAmount && <FieldError msg={errors.limitAmount} />}
          </div>

          {/* Month + Year */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <Label>Month</Label>
              <select className="input" value={form.month} onChange={e => set('month', e.target.value)}>
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div>
              <Label>Year</Label>
              <select className="input" value={form.year} onChange={e => set('year', e.target.value)}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {errors.submit && (
            <div className="animate-scale-in" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--red)', fontSize: 13 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', gap: 10, padding: '16px 24px 20px', borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)', borderRadius: '0 0 20px 20px', position: 'sticky', bottom: 0 }}>
          <button className="btn btn-ghost" style={{ flex: 1, padding: '10px 16px' }} onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" style={{ flex: 1, padding: '10px 16px' }} onClick={handleSubmit} disabled={loading}>
            {loading ? <><Spinner /> Saving…</> : isEdit ? 'Save Changes' : 'Create Budget'}
          </button>
        </div>
      </div>
    </div>
  )
}

const Label = ({ children }) => (
  <label style={{ display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 6 }}>
    {children}
  </label>
)

const FieldError = ({ msg }) => (
  <p className="animate-slide-down" style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--red)', marginTop: 5 }}>
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    {msg}
  </p>
)
