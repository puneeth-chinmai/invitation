import React from 'react'

/**
 * Cartographic Compass Rose
 * Elegant antique-gold 8-point nautical/cartographic compass ornament.
 */
export function CompassRose({ size = 52, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke="#c4964c" strokeWidth="0.8" strokeDasharray="2,2" opacity="0.6" />
      <circle cx="50" cy="50" r="42" stroke="#b88628" strokeWidth="1" opacity="0.85" />
      <circle cx="50" cy="50" r="32" stroke="#c4964c" strokeWidth="0.6" strokeDasharray="1,2" opacity="0.5" />

      {/* Primary Points (N, S, E, W) */}
      <polygon points="50,6 54,42 50,50" fill="#6d1620" />
      <polygon points="50,6 46,42 50,50" fill="#871f2c" />
      <polygon points="50,94 54,58 50,50" fill="#871f2c" />
      <polygon points="50,94 46,58 50,50" fill="#6d1620" />
      <polygon points="94,50 58,54 50,50" fill="#871f2c" />
      <polygon points="94,50 58,46 50,50" fill="#6d1620" />
      <polygon points="6,50 42,54 50,50" fill="#6d1620" />
      <polygon points="6,50 42,46 50,50" fill="#871f2c" />

      {/* Secondary Points (NE, NW, SE, SW) */}
      <polygon points="78,22 55,45 50,50" fill="#b88628" opacity="0.9" />
      <polygon points="78,22 45,55 50,50" fill="#dfb66d" opacity="0.7" />
      <polygon points="22,22 45,45 50,50" fill="#dfb66d" opacity="0.7" />
      <polygon points="22,22 55,55 50,50" fill="#b88628" opacity="0.9" />
      <polygon points="78,78 55,55 50,50" fill="#dfb66d" opacity="0.7" />
      <polygon points="78,78 45,45 50,50" fill="#b88628" opacity="0.9" />
      <polygon points="22,78 45,55 50,50" fill="#b88628" opacity="0.9" />
      <polygon points="22,78 55,45 50,50" fill="#dfb66d" opacity="0.7" />

      {/* Center Jewel */}
      <circle cx="50" cy="50" r="5" fill="#FAF4E8" stroke="#b88628" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="2.2" fill="#6d1620" />

      {/* Cardinal Labels */}
      <text x="50" y="16" fontFamily="Cinzel, serif" fontSize="6" fontWeight="bold" fill="#6d1620" textAnchor="middle">N</text>
      <text x="50" y="90" fontFamily="Cinzel, serif" fontSize="5.5" fontWeight="bold" fill="#8c6527" textAnchor="middle">S</text>
      <text x="86" y="52" fontFamily="Cinzel, serif" fontSize="5.5" fontWeight="bold" fill="#8c6527" textAnchor="middle">E</text>
      <text x="14" y="52" fontFamily="Cinzel, serif" fontSize="5.5" fontWeight="bold" fill="#8c6527" textAnchor="middle">W</text>
    </svg>
  )
}

/**
 * Botanical Sprig (Restrained leafy accent for route waypoints)
 */
export function BotanicalSprig({ className = '', width = 28, height = 18 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 28 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2 16 C 10 14, 18 10, 26 2"
        stroke="#4A6B53"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Leaves */}
      <path
        d="M8 13 C 7 10, 9 8, 12 9 C 11 11, 10 13, 8 13 Z"
        fill="#5F7D65"
        opacity="0.8"
      />
      <path
        d="M14 10 C 15 7, 18 6, 20 8 C 18 9, 16 11, 14 10 Z"
        fill="#4A6B53"
        opacity="0.85"
      />
      <path
        d="M20 6 C 21 3, 24 3, 25 5 C 23 6, 21 7, 20 6 Z"
        fill="#3A5643"
        opacity="0.9"
      />
    </svg>
  )
}

/**
 * Delicate Antique Divider
 */
export function AntiqueDivider({ className = '' }) {
  return (
    <div
      className={`antique-ornamental-divider ${className}`}
      role="separator"
      aria-hidden="true"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#b88628',
        margin: '10px auto',
        width: '80%',
        maxWidth: '260px',
        opacity: 0.85,
      }}
    >
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, #c4964c 60%, #b88628)',
        }}
      />
      <span style={{ fontSize: '12px', lineHeight: 1 }}>❦</span>
      <div
        style={{
          flex: 1,
          height: '1px',
          background: 'linear-gradient(90deg, #b88628, #c4964c 40%, transparent)',
        }}
      />
    </div>
  )
}

/**
 * Map Location Pin Icon
 */
export function MapPinIcon({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

/**
 * Refined Placeholder Icon for Events Without Media Yet
 */
export function CameraPlaceholderIcon({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="6"
        y="12"
        width="36"
        height="26"
        rx="3"
        stroke="#b88628"
        strokeWidth="1.5"
        strokeDasharray="3 2"
      />
      <path
        d="M17 12 L20 7 L28 7 L31 12"
        stroke="#b88628"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="25" r="7" stroke="#b88628" strokeWidth="1.5" />
      <circle cx="24" cy="25" r="3" fill="#c4964c" opacity="0.6" />
      <circle cx="35" cy="17" r="1.5" fill="#8c6527" />
    </svg>
  )
}

/**
 * Stacked Photos Badge Icon
 */
export function PhotoStackIcon({ size = 14, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <path d="M7 21h12a2 2 0 0 0 2-2V7" />
    </svg>
  )
}

/**
 * Video Play Icon for cards and gallery
 */
export function VideoPlayIcon({ size = 16, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

/**
 * Traditional Kalash & Mandap Arch Motif for the Wedding Destination
 */
export function MandapKalashMotif({ className = '', size = 56 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Auspicious Arch Silhouette */}
      <path
        d="M8 56 C 8 26, 24 10, 32 6 C 40 10, 56 26, 56 56"
        stroke="#c4964c"
        strokeWidth="1.4"
        strokeDasharray="2 2"
      />
      <path
        d="M14 56 C 14 32, 26 18, 32 14 C 38 18, 50 32, 50 56"
        stroke="#b88628"
        strokeWidth="1.2"
      />

      {/* Kalash Vessel */}
      <path
        d="M26 48 C 26 53, 38 53, 38 48 C 40 44, 41 38, 32 38 C 23 38, 24 44, 26 48 Z"
        fill="#FAF4E8"
        stroke="#b88628"
        strokeWidth="1.4"
      />
      {/* Mango leaves & Coconut */}
      <circle cx="32" cy="33" r="5" fill="#6d1620" stroke="#b88628" strokeWidth="1" />
      <path d="M25 36 C 22 31, 26 27, 29 32 Z" fill="#4A6B53" />
      <path d="M39 36 C 42 31, 38 27, 35 32 Z" fill="#4A6B53" />
      {/* Kalash base */}
      <rect x="27" y="52" width="10" height="3" rx="1.5" fill="#b88628" />

      {/* Top Auspicious Star */}
      <polygon points="32,2 33.5,5 36.5,5.5 34,7.5 35,10.5 32,9 29,10.5 30,7.5 27.5,5.5 30.5,5" fill="#b88628" />
    </svg>
  )
}
