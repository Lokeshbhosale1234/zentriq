import React from 'react'

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div
      className="flex items-center gap-3 rounded-xl px-4 py-3 mb-4 text-sm animate-fade-in"
      style={{
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.25)',
        color: '#ef4444',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="underline text-xs font-600"
          style={{ color: '#ef4444' }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
