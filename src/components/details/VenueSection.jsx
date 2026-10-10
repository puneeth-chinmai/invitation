import React from 'react'
import venueMantapaVisualUrl from '../../assets/images/venue_mantapa_visual.jpg'
import { LocationPinLineIcon, ExternalArrowLineIcon, DelicateDivider } from './DetailsIcons'

/**
 * VenueSection
 *
 * Dedicated venue presentation for Gayathri Devi Kalyana Mantapa, Chikkamagaluru:
 *   - Immersive cinematic architectural visual of traditional South Indian Kalyana Mantapa
 *   - Feathered ivory overlay blending seamlessly with the royal wedding parchment palette
 *   - Grand venue title and locality with refined insignia
 *   - Neatly framed secondary Google Maps preview panel
 *   - Prominent touch-friendly "Get Directions" action in royal maroon & gold
 *   - No emojis, zero clutter, elegant South Indian craftsmanship
 */
export default function VenueSection() {
  const directionsUrl =
    'https://www.google.com/maps/dir/?api=1&destination=Gayathri+Devi+Kalyana+Mantapa,+Chikkamagaluru'

  const mapEmbedUrl =
    'https://maps.google.com/maps?q=Gayathri+Devi+Kalyana+Mantapa,+Chikkamagaluru&t=&z=15&ie=UTF8&iwloc=&output=embed'

  return (
    <section className="venue-card-section" aria-label="Wedding Venue and Directions">
      <div className="section-title-block">
        <span className="section-eyebrow">LOCATION</span>
        <h3 className="section-heading">The Wedding Venue</h3>
        <DelicateDivider />
      </div>

      <div className="venue-cinematic-card">
        {/* Continuous Architectural Atmosphere Layer */}
        <div className="venue-art-atmosphere" aria-hidden="true">
          <img
            src={venueMantapaVisualUrl}
            alt=""
            className="venue-atmosphere-img"
            loading="lazy"
          />
          <div className="venue-atmosphere-scrim" />
        </div>

        {/* Unified Venue Content Flow */}
        <div className="venue-content-flow">
          {/* Destination Identity Block */}
          <div className="venue-destination-block">
            <div className="venue-pin-badge" aria-hidden="true">
              <LocationPinLineIcon size={18} color="#6d1620" />
            </div>
            <h4 className="venue-grand-name">Gayathri Devi Kalyana Mantapa</h4>
            <p className="venue-grand-locality">Chikkamagaluru, Karnataka, India</p>
            <div className="venue-details-accent-rule" />
          </div>

          {/* Secondary Framed Map Preview Panel */}
          <div className="venue-map-preview-panel">
            <iframe
              src={mapEmbedUrl}
              title="Gayathri Devi Kalyana Mantapa Map Location"
              loading="lazy"
              allowFullScreen={false}
              referrerPolicy="no-referrer-when-downgrade"
              className="venue-map-frame"
            />
            <div className="venue-map-frame-border" />
          </div>

          {/* Primary Directions Action */}
          <div className="venue-cta-block">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="venue-directions-primary-btn"
              aria-label="Get Directions to Gayathri Devi Kalyana Mantapa on Google Maps (opens in new tab)"
            >
              <span>Get Directions</span>
              <ExternalArrowLineIcon size={13} color="#FFF8E7" />
            </a>
            <span className="venue-directions-subnote">
              Opens Google Maps route to Gayathri Devi Kalyana Mantapa
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
