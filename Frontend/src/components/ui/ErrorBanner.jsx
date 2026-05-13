import React, { useState } from 'react'

/**
 * ErrorBanner — dismissible error strip with optional retry action.
 * Renders nothing if no message is provided.
 */
export default function ErrorBanner({ message, onRetry }) {
  const [dismissed, setDismissed] = useState(false)

  if (!message || dismissed) return null

  return (
    <div
      className="animate-slide-down"
      role="alert"
      style={{
        display:      'flex',
        alignItems:   'center',
        gap:          12,
        padding:      '11px 16px',
        borderRadius: 12,
        background:   'rgba(244,63,94,0.07)',
        border:       '1px solid rgba(244,63,94,0.2)',
        marginBottom: 4,
      }}
    >
      {/* Icon */}
      <svg
        width="15" height="15"
        viewBox="0 0 24 24" fill="none" stroke="#f43f5e"
        strokeWidth="2" strokeLinecap="round"
        style={{ flexShrink: 0 }}
      >
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8"  x2="12"   y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>

      {/* Message */}
      <span style={{ flex: 1, fontSize: 13, color: '#f43f5e', fontWeight: 500, lineHeight: 1.5 }}>
        {message}
      </span>

      {/* Retry */}
      {onRetry && (
        <button
          onClick={() => { setDismissed(false); onRetry() }}
          style={{
            fontSize:     11,
            fontWeight:   600,
            color:        '#f43f5e',
            background:   'rgba(244,63,94,0.12)',
            border:       '1px solid rgba(244,63,94,0.22)',
            borderRadius: 7,
            padding:      '4px 10px',
            cursor:       'pointer',
            flexShrink:   0,
            transition:   'background 0.14s ease',
            whiteSpace:   'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(244,63,94,0.12)'}
        >
          Retry
        </button>
      )}

      {/* Dismiss */}
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss error"
        style={{
          width:          24, height: 24,
          borderRadius:   6,
          display:        'flex', alignItems: 'center', justifyContent: 'center',
          background:     'transparent',
          border:         'none',
          color:          'rgba(244,63,94,0.6)',
          cursor:         'pointer',
          flexShrink:     0,
          transition:     'color 0.14s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#f43f5e'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(244,63,94,0.6)'}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
