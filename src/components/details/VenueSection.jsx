import React from 'react'
import { LocationPinLineIcon, ExternalArrowLineIcon, DelicateDivider } from './DetailsIcons'

/**
 * VenueSection
 *
 * Dedicated venue guide for Gayatri Kalyana Mantapa, Chikkamagaluru:
 *   - Restrained monochrome SVG icons
 *   - Understated map preview panel
 *   - Direct "Get Directions" action opening Google Maps
 *   - No emojis
 */
export default function VenueSection() {
  const directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Gayatri+Kalyana+Mantapa,+Chikkamagaluru'

  const mapEmbedUrl =
    'https://maps.google.com/maps?q=Gayatri+Kalyana+Mantapa,+Chikkamagaluru&t=&z=15&ie=UTF8&iwloc=&output=embed'

  return (
    <section className="venue-card-section" aria-label="Wedding Venue and Directions">
      <div className="section-title-block">
        <span className="section-eyebrow">LOCATION</span>
        <h3 className="section-heading">The Wedding Venue</h3>
        <DelicateDivider />
      </div>

      <div className="venue-editorial-card">
        {/* Venue Info Top */}
        <div className="venue-header-row">
          <div className="venue-pin-container">
            <LocationPinLineIcon size={20} color="#6d1620" />
          </div>
          <div className="venue-title-container">
            <h4 className="venue-building-name">Gayatri Kalyana Mantapa</h4>
            <p className="venue-locality">Chikkamagaluru, Karnataka, India</p>
          </div>
        </div>

        {/* Map Preview Panel */}
        <div className="venue-map-panel">
          <iframe
            src={mapEmbedUrl}
            title="Gayatri Kalyana Mantapa Map Location"
            loading="lazy"
            allowFullScreen={false}
            referrerPolicy="no-referrer-when-downgrade"
            className="venue-map-frame"
          />
          <div className="venue-map-border-overlay" />
        </div>

        {/* Venue Actions */}
        <div className="venue-cta-row">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="venue-get-directions-btn"
            aria-label="Get Directions to Gayatri Kalyana Mantapa on Google Maps (opens in new tab)"
          >
            <span>Get Directions</span>
            <ExternalArrowLineIcon size={13} color="#FFF8E7" />
          </a>
          <span className="venue-directions-subnote">
            Opens Google Maps route to Gayatri Kalyana Mantapa
          </span>
        </div>
      </div>
    </section>
  )
}
