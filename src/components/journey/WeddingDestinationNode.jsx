import React from 'react'
import { MandapKalashMotif, AntiqueDivider } from './JourneyOrnaments'

/**
 * WeddingDestinationNode
 *
 * The final destination milestone capping Puneeth & Chinmai's journey:
 * 29 NOVEMBER 2026 — The Wedding Day
 * “A new chapter begins.”
 *
 * This milestone is a destination, not an ordinary event.
 * It does not require photographs or videos and is always rendered at the end.
 */
export default function WeddingDestinationNode({ destination }) {
  return (
    <div
      className="journey-destination-node"
      role="region"
      aria-label="Final Journey Destination: The Wedding Day"
    >
      <div className="destination-radiance" aria-hidden="true" />

      {/* Auspicious Mandap Kalash Motif */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
        <MandapKalashMotif size={58} />
      </div>

      {/* Kannada Blessing */}
      <div className="destination-kannada-seal" lang="kn">
        {destination.kannadaBlessing || 'ಮಾಂಗಲ್ಯ ಧಾರಣೆ'}
      </div>

      {/* Destination Date */}
      <div className="destination-date-badge">
        {destination.date}
      </div>

      {/* Destination Title */}
      <h2 className="destination-heading">
        {destination.title}
      </h2>

      <AntiqueDivider />

      {/* Subtitle / Quote */}
      <p className="destination-quote">
        “{destination.subtitle}”
      </p>

      <p
        style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '11px',
          letterSpacing: '0.14em',
          color: '#8c6527',
          marginTop: '12px',
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        Chikkamagaluru, Karnataka
      </p>
    </div>
  )
}
