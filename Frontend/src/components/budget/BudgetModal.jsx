import React, { useState, useEffect } from 'react'
import { CATEGORIES } from '../../utils/formatters'

const MONTHS = [
  { v: 1,  l: 'January' }, { v: 2,  l: 'February' }, { v: 3,  l: 'March' },
  { v: 4,  l: 'April' },   { v: 5,  l: 'May' },      { v: 6,  l: 'June' },
  { v: 7,  l: 'July' },    { v: 8,  l: 'August' },   { v: 9,  l: 'September' },
  { v: 10, l: 'October' }, { v: 11, l: 'November' }, { v: 12, l: 'December' },
]

// Income categories shouldn't typically have expense budgets but we allow all
const INCOME_CATS  = ['Salary', 'Freelance', 'Investment']
const EXPENSE_CATS = CATEGORIES.filter(c => !INCOME_CATS.includes(c))

const currentYear  = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - 1 + i)

const EMPTY = { category: '', limitAmount: '', month: currentMonth, year: currentYear }

export default function BudgetModal({ onClose, onSubmit, editData }) {
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [loading, setLoading] = useState(false)

  // Pre-populate form when editing
  useEffect(() => {
    if (editData) {
      setForm({
        category:    editData.category    || '',
        limitAmount: editData.limitAmount || '',
        month:       editData.month       || currentMonth,
        year:        editData.year        || currentYear,
      })
    } else {
      setForm(EMPTY)
    }
  }, [editData])

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => ({ ...p, [k]: null }))
  }

  const validate = () => {
    const e = {}
    if (!form.category)                              e.category    = 'Please select a category'
    if (!form.limitAmount || Number(form.limitAmount) <= 0) e.limitAmount = 'Enter a valid amount greater than 0'
    return e
  }

  const handleSubmit = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await onSubmit({
        category:    form.category,
        limitAmount: parseFloat(form.limitAmount),
        month:       parseInt(form.month),
        year:        parseInt(form.year),
      })
      onClose()
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save budget. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const isEdit = Boolean(editData)

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="card w-full max-w-md mx-4 animate-slide-up overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5"
          style={{ borderBottom: '1px solid var(--border)' }}>
          <div>
            <h2 className="font-display font-700 text-lg" style={{ color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Budget' : 'Create Budget'}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Set a monthly spending limit for a category
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{ color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)' }}
          >
            ✕
          </button>
        </div>

        {/* Form body */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 space-y-4">

          {/* Category */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Category *
            </label>
            <select
              className="input"
              value={form.category}
              onChange={e => set('category', e.target.value)}
            >
              <option value="">Select a category…</option>
              <optgroup label="Expenses">
                {EXPENSE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
              <optgroup label="Income">
                {INCOME_CATS.map(c => <option key={c} value={c}>{c}</option>)}
              </optgroup>
            </select>
            {errors.category && (
              <p className="text-xs mt-1" style={{ color: 'var(--accent-red)' }}>{errors.category}</p>
            )}
          </div>

          {/* Monthly limit */}
          <div>
            <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider"
              style={{ color: 'var(--text-muted)' }}>
              Monthly Limit (₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: 'var(--text-muted)' }}>₹</span>
              <input
                className="input pl-7"
                type="number" min="1" step="100"
                placeholder="e.g. 10000"
                value={form.limitAmount}
                onChange={e => set('limitAmount', e.target.value)}
              />
            </div>
            {errors.limitAmount && (
              <p className="text-xs mt-1" style={{ color: 'var(--accent-red)' }}>{errors.limitAmount}</p>
            )}
          </div>

          {/* Month + Year — 2 col */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>Month</label>
              <select className="input" value={form.month} onChange={e => set('month', e.target.value)}>
                {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}>Year</label>
              <select className="input" value={form.year} onChange={e => set('year', e.target.value)}>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>

          {/* Submission error */}
          {errors.submit && (
            <div className="rounded-xl p-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(239,68,68,0.2)' }}>
              {errors.submit}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-5 sm:px-6 py-4"
          style={{ borderTop: '1px solid var(--border)' }}>
          <button
            className="btn btn-ghost flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary flex-1"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" opacity=".3"/>
                  <path d="M21 12a9 9 0 00-9-9"/>
                </svg>
                Saving…
              </span>
            ) : isEdit ? 'Save Changes' : 'Create Budget'}
          </button>
        </div>
      </div>
    </div>
  )
}
