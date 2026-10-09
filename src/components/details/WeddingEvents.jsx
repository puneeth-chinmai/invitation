import React from 'react'
import { CalendarLineIcon, ClockLineIcon, DelicateDivider } from './DetailsIcons'

/**
 * WeddingEvents
 *
 * Editorial-style event cards for:
 * 1. Reception — Saturday, 28 November 2026 · 7:30 PM onwards
 * 2. Muhurtam — Sunday, 29 November 2026 · 8:00 AM
 *
 * Restrained typography, delicate antique-gold dividers, and zero emojis.
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
          <div className="event-badge-label">EVENING CELEBRATION</div>
          <h4 className="event-editorial-title">RECEPTION</h4>
          <div className="event-accent-line" />

          <div className="event-detail-item">
            <span className="event-detail-icon">
              <CalendarLineIcon size={15} color="#8c5d1e" />
            </span>
            <div className="event-detail-text">
              <span className="event-primary-info">Saturday, 28 November 2026</span>
              <span className="event-secondary-info">28th November 2026</span>
            </div>
          </div>

          <div className="event-detail-item">
            <span className="event-detail-icon">
              <ClockLineIcon size={15} color="#8c5d1e" />
            </span>
            <div className="event-detail-text">
              <span className="event-primary-info">7:30 PM Onwards</span>
              <span className="event-secondary-info">Dinner and Celebrations</span>
            </div>
          </div>
        </article>

        {/* =========================================
            EVENT 2: MUHURTAM
        ========================================= */}
        <article className="event-editorial-card muhurtam">
          <div className="event-badge-label auspicious">AUSPICIOUS CEREMONY</div>
          <h4 className="event-editorial-title">MUHURTAM</h4>
          <div className="event-accent-line" />

          <div className="event-detail-item">
            <span className="event-detail-icon">
              <CalendarLineIcon size={15} color="#8c5d1e" />
            </span>
            <div className="event-detail-text">
              <span className="event-primary-info">Sunday, 29 November 2026</span>
              <span className="event-secondary-info">29th November 2026</span>
            </div>
          </div>

          <div className="event-detail-item">
            <span className="event-detail-icon">
              <ClockLineIcon size={15} color="#8c5d1e" />
            </span>
            <div className="event-detail-text">
              <span className="event-primary-info">8:00 AM</span>
              <span className="event-secondary-info">Sacred Wedding Rituals</span>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
