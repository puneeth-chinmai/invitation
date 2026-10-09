import React, { useState, useMemo, useEffect } from 'react'
import {
  getPublishedEvents,
  getWeddingDestination,
} from '../../data/journeyEvents'
import { TEST_FIXTURE_EVENTS } from '../../data/journeyTestFixtures'
import { fetchPublishedEvents } from '../../services/journeyService'
import JourneyMapCanvas from './JourneyMapCanvas'
import EventGalleryModal from './EventGalleryModal'
import SectionTransitionCard from '../navigation/SectionTransitionCard'
import { CompassRose, AntiqueDivider } from './JourneyOrnaments'
import './OurJourney.css'

/**
 * OurJourney
 *
 * Independent Section 3: "Our Journey: From Then to Forever"
 * An interactive, genuine relationship map documenting Puneeth & Chinmai's journey.
 *
 * Aesthetics:
 *   - Continuous, double-layered antique-gold winding route with deliberate curvature
 *   - Cartographic background contour lines and coordinate grid markings (no fantasy landscape)
 *   - Compact photo waypoint markers on alternating sides
 *   - Dedicated event galleries supporting multiple photographs and native video playback
 *   - Final destination: "29 November 2026 — The Wedding Day (And so, forever begins.)"
 *   - Contextual section transition: "Send Your Blessings" leading to Blessings & Wishes
 */
export default function OurJourney({
  useTestFixtures: propUseTestFixtures = false,
  onNavigateToWishes,
}) {
  // Support toggling test fixtures via URL search param ?test-fixtures=1 or prop for automated verification
  const isTestMode = useMemo(() => {
    if (propUseTestFixtures) return true
    if (typeof window !== 'undefined') {
      const search = window.location.search
      return search.includes('test-fixtures=1') || search.includes('journey-test=1')
    }
    return false
  }, [propUseTestFixtures])

  const [liveEvents, setLiveEvents] = useState(null)
  const [, setIsLiveBackend] = useState(false)

  // Fetch live published events from persistent backend
  useEffect(() => {
    let isMounted = true
    async function loadEvents() {
      try {
        const res = await fetchPublishedEvents()
        if (isMounted) {
          if (res.events && res.events.length > 0) {
            setLiveEvents(res.events)
          }
          setIsLiveBackend(res.isLiveBackend)
        }
      } catch (err) {
        console.warn('Error loading live journey events:', err)
      }
    }
    loadEvents()
    return () => {
      isMounted = false
    }
  }, [])

  // Resolve events list: test mode -> live backend -> fallback initial events
  const events = useMemo(() => {
    if (isTestMode) {
      return getPublishedEvents(TEST_FIXTURE_EVENTS)
    }
    if (liveEvents && liveEvents.length > 0) {
      return liveEvents
    }
    return getPublishedEvents()
  }, [isTestMode, liveEvents])

  const destination = useMemo(() => getWeddingDestination(), [])

  // Currently opened event for dedicated modal gallery view
  const [selectedEventId, setSelectedEventId] = useState(null)

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null
    return events.find((e) => e.id === selectedEventId) || null
  }, [selectedEventId, events])


  return (
    <div
      className="journey-viewport"
      role="region"
      aria-label="Our Journey: From Then to Forever"
    >
      {/* 1. Ambient Parchment & Viewport Filigree Frame */}
      <div className="journey-parchment-overlay" aria-hidden="true" />
      <div className="journey-filigree-frame" aria-hidden="true" />
      <div className="journey-corner-motif tl" aria-hidden="true">❖</div>
      <div className="journey-corner-motif tr" aria-hidden="true">❖</div>
      <div className="journey-corner-motif bl" aria-hidden="true">❖</div>
      <div className="journey-corner-motif br" aria-hidden="true">❖</div>

      {/* 2. Ambient Warm Light Pool */}
      <div className="journey-light-glow" aria-hidden="true" />

      {/* 3. Main Scrollable Container */}
      <div className="journey-content-container">
        {/* ===================================================
            SECTION INTRODUCTION & VINTAGE MAP HEADER
        =================================================== */}
        <header className="journey-intro-header">
          <div className="journey-header-compass">
            <CompassRose size={48} />
          </div>

          <span className="journey-kannada-subtitle" lang="kn">
            ಪ್ರೀತಿಯ ಪಯಣ
          </span>

          <h1 className="journey-main-title">
            The JOURNEY
          </h1>

          <h2 className="journey-sub-title">
            From Then to Forever
          </h2>

          <AntiqueDivider />

          <p className="journey-intro-quote">
            “A journey of love and a thousand little moments.”
          </p>

          {isTestMode && (
            <div
              style={{
                marginTop: '12px',
                display: 'inline-block',
                background: 'rgba(109, 22, 32, 0.08)',
                border: '1px dashed #6d1620',
                borderRadius: '4px',
                padding: '4px 12px',
                fontFamily: 'Cinzel, serif',
                fontSize: '11px',
                color: '#6d1620',
                letterSpacing: '0.08em',
              }}
            >
              ⚙ TEST FIXTURES MODE ACTIVE (VERIFYING MULTI-MEDIA &amp; EMPTY STATES)
            </div>
          )}
        </header>

        {/* ===================================================
            RELATIONSHIP MAP WITH CHRONOLOGICAL WAYPOINTS
        =================================================== */}
        <JourneyMapCanvas
          events={events}
          destination={destination}
          onSelectEvent={(eventId) => setSelectedEventId(eventId)}
        />

        {/* ===================================================
            CONTEXTUAL TRANSITION: SEND YOUR BLESSINGS
        =================================================== */}
        {onNavigateToWishes && (
          <SectionTransitionCard
            kicker="HEARTFELT PRAYERS"
            title="Send Your Blessings"
            description="Share your heartfelt wishes for their beautiful new beginning."
            ctaText="Write a Blessing"
            ctaIcon="→"
            motifIcon="✉"
            onNavigate={onNavigateToWishes}
          />
        )}

        {/* ===================================================
            VINTAGE MAP FOOTER SEAL
        =================================================== */}
        <footer style={{ textAlign: 'center', marginTop: '24px', opacity: 0.85 }}>
          <AntiqueDivider />
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '14px',
              fontStyle: 'italic',
              color: '#6a441e',
              margin: '4px 0',
            }}
          >
            Puneeth Weds Chinmai
          </p>
        </footer>
      </div>

      {/* ===================================================
          DEDICATED EVENT MEDIA GALLERY OVERLAY
      =================================================== */}
      {selectedEvent && (
        <EventGalleryModal
          event={selectedEvent}
          onClose={() => setSelectedEventId(null)}
        />
      )}
    </div>
  )
}
