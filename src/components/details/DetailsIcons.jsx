import React from 'react'

/**
 * DetailsIcons
 *
 * Restrained, elegant monochrome SVG line icons for the Wedding Details section.
 * Replaces all emojis with authentic antique-gold or deep-maroon linework.
 */

export function CalendarLineIcon({ className = '', size = 16, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <circle cx="8" cy="14" r="0.75" fill={color} />
      <circle cx="12" cy="14" r="0.75" fill={color} />
      <circle cx="16" cy="14" r="0.75" fill={color} />
      <circle cx="8" cy="18" r="0.75" fill={color} />
      <circle cx="12" cy="18" r="0.75" fill={color} />
      <circle cx="16" cy="18" r="0.75" fill={color} />
    </svg>
  )
}

export function ClockLineIcon({ className = '', size = 16, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15.5 14" />
    </svg>
  )
}

export function LocationPinLineIcon({ className = '', size = 18, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-6.5-7-11.5a7 7 0 1 1 14 0c0 5-7 11.5-7 11.5z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  )
}

export function ExternalArrowLineIcon({ className = '', size = 14, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  )
}

export function ShareLineIcon({ className = '', size = 16, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  )
}

export function WhatsAppLineIcon({ className = '', size = 16, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M9.5 8.5c.3-.4.6-.5.9-.5s.6.2.8.5l.8 1.4c.2.3.2.7 0 1l-.4.5a.6.6 0 0 0 0 .7 5.7 5.7 0 0 0 2.2 2.2.6.6 0 0 0 .7 0l.5-.4c.3-.2.7-.2 1 0l1.4.8c.3.2.5.5.5.8s-.1.6-.5.9c-.8.6-2 .7-3.8-.2a9.3 9.3 0 0 1-3.6-3.6c-.9-1.8-.8-3-.2-3.8z" />
    </svg>
  )
}

export function CopyLineIcon({ className = '', size = 16, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export function CheckLineIcon({ className = '', size = 14, color = 'currentColor' }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function DelicateDivider({ className = '' }) {
  return (
    <div className={`delicate-ornamental-divider ${className}`}>
      <div className="delicate-line" />
      <span className="delicate-diamond">❖</span>
      <div className="delicate-line" />
    </div>
  )
}
