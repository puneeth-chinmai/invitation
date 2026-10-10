import React from 'react'
import receptionArtUrl from '../../assets/images/reception_mandap_bg.jpg'
import muhurtamArtUrl from '../../assets/images/muhurtam_temple_bg.jpg'
import { CalendarLineIcon, ClockLineIcon, DelicateDivider } from './DetailsIcons'

/**
 * WeddingEvents
 *
 * Coordinated editorial event cards for:
 * 1. Reception — Saturday, 28 November 2026 · 7:30 PM onwards
 * 2. Muhurtam — Sunday, 29 November 2026 · 8:00 AM – 9:30 AM
 *
 * Features separate authentic watercolor artwork backdrops with translucent
 * warm-ivory contrast scrims, restrained typography, and zero emojis.
 */
export default function WeddingEvents() {
  return (
    <section className="wedding-events-section" aria-label="Wedding Events and Schedule">
      <div className="section-title-block">
        <span className="section-eyebrow">PROGRAMME</span>
        <h3 className="section-heading">Wedding Events</h3>
        <DelicateDivider />
      </div>

      <div className="events-editorial-grid">
        {/* =========================================
            EVENT 1: RECEPTION
        ========================================= */}
        <article className="event-editorial-card reception">
          {/* Watercolor Mandap Backdrop Layer */}
          <div className="event-card-art-backdrop" aria-hidden="true">
            <img
              src={receptionArtUrl}
              alt=""
              className="event-card-art-img reception-art"
              loading="lazy"
            />
            <div className="event-card-art-scrim" />
          </div>

          <div className="event-card-content">
            <div className="event-badge-label">EVENING CELEBRATION</div>
            <h4 className="event-editorial-title">RECEPTION</h4>
            <div className="event-accent-line" />

            <div className="event-detail-item">
              <span className="event-detail-icon">
                <CalendarLineIcon size={15} color="#8c5d1e" />
              </span>
              <div className="event-detail-text">
                <span className="event-primary-info">Saturday, 28 November 2026</span>
              </div>
            </div>

            <div className="event-detail-item">
              <span className="event-detail-icon">
                <ClockLineIcon size={15} color="#8c5d1e" />
              </span>
              <div className="event-detail-text">
                <span className="event-primary-info">7:30 PM onwards</span>
                <span className="event-secondary-info">Dinner and Celebrations</span>
              </div>
            </div>
          </div>
        </article>

        {/* =========================================
            EVENT 2: MUHURTAM
        ========================================= */}
        <article className="event-editorial-card muhurtam">
          {/* Watercolor Temple & Couple Backdrop Layer */}
          <div className="event-card-art-backdrop" aria-hidden="true">
            <img
              src={muhurtamArtUrl}
              alt=""
              className="event-card-art-img muhurtam-art"
              loading="lazy"
            />
            <div className="event-card-art-scrim" />
          </div>

          <div className="event-card-content">
            <div className="event-badge-label auspicious">AUSPICIOUS CEREMONY</div>
            <h4 className="event-editorial-title">MUHURTAM</h4>
            <div className="event-accent-line" />

            <div className="event-detail-item">
              <span className="event-detail-icon">
                <CalendarLineIcon size={15} color="#8c5d1e" />
              </span>
              <div className="event-detail-text">
                <span className="event-primary-info">Sunday, 29 November 2026</span>
              </div>
            </div>

            <div className="event-detail-item">
              <span className="event-detail-icon">
                <ClockLineIcon size={15} color="#8c5d1e" />
              </span>
              <div className="event-detail-text">
                <span className="event-primary-info">8:00 AM – 9:30 AM</span>
                <span className="event-secondary-info">Sacred Wedding Rituals</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
