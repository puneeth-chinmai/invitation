import React from 'react'
import { MandapKalashMotif, AntiqueDivider } from './JourneyOrnaments'

/**
 * DestinationMedallion
 *
 * Visually prominent destination terminal capping the relationship map:
 *   29 NOVEMBER 2026
 *   The Wedding Day
 *   “And so, forever begins.”
 *
 * Terminal destination marker, not a media event.
 * Always positioned at the end of the route.
 */
export default function DestinationMedallion({ destination }) {
  return (
    <div
      className="map-destination-terminal"
      role="region"
      aria-label="Final Journey Destination: The Wedding Day"
    >
      {/* Route Junction Terminal Stop */}
      <div className="terminal-junction-pin" aria-hidden="true">
        <div className="terminal-pin-ring">
          <div className="terminal-pin-core" />
        </div>
      </div>

      {/* Main Destination Medallion Card */}
      <div className="terminal-medallion-box">
        <div className="terminal-ambient-glow" aria-hidden="true" />

        {/* Sacred Kalash Emblem */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
          <MandapKalashMotif size={52} />
        </div>

        {/* Kannada Blessing */}
        <div className="terminal-kannada-seal" lang="kn">
          {destination.kannadaBlessing || 'ಮಾಂಗಲ್ಯ ಧಾರಣೆ'}
        </div>

        {/* Date Ribbon */}
        <div className="terminal-date-ribbon">
          <span>{destination.date}</span>
        </div>

        {/* Title */}
        <h2 className="terminal-title">
          {destination.title}
        </h2>

        <AntiqueDivider className="terminal-divider" />

        {/* Subtitle quote: "And so, forever begins." */}
        <p className="terminal-subtitle">
          “{destination.subtitle}”
        </p>

        <div className="terminal-coordinates">
          <span>CHIKKAMAGALURU, KARNATAKA</span>
        </div>
      </div>
    </div>
  )
}
