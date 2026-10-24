import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MapPinIcon, CameraPlaceholderIcon, VideoPlayIcon } from './JourneyOrnaments'
import AlbumLightbox from './AlbumLightbox'
import { normalizeMediaList } from '../../utils/mediaNormalizer'
import './EventAlbum.css'

/**
 * EventGalleryModal
 *
 * Premium Editorial Wedding Keepsake View for Puneeth & Chinmai's Journey.
 *
 * Features:
 *   1. Quiet Header: Subtle "← Return to Timeline" action and circular close button.
 *   2. Single Framed Cover Photo: Exactly one cover photo in an antique-gold & ivory
 *      keepsake frame, preserving 100% of the original photo aspect ratio (no crop).
 *   3. Bespoke Album-Opening Affordance: Illustrated keepsake book motif with opening pages,
 *      "View Full Album" title, and media breakdown subtitle (shown only when total > 1).
 *   4. Clear Metadata Hierarchy:
 *        - Date: Elegant ruby/gold seal treatment with decorative diamond accent.
 *        - Location: Direct value (e.g., "Chikkamagaluru") with MapPinIcon (NO field label).
 *        - Category: Milestone tag (rendered only if genuinely present).
 *        - Title: Prominent burgundy editorial serif heading.
 *        - Story / Description: Complete unabridged text styled as an intimate editorial passage.
 *        - Album Summary: Accurate photo & film count.
 *   5. Immersive Album Entry: Seamlessly opens the full AlbumLightbox viewer with zoom,
 *      pan, fullscreen, thumbnail strip, and video player.
 */
export default function EventGalleryModal({
  event,
  onClose,
}) {
  const modalWindowRef = useRef(null)
  const backBtnRef = useRef(null)

  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [prevEventId, setPrevEventId] = useState(event?.id)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Lock body scroll while modal is active
  useEffect(() => {
    if (typeof document === 'undefined') return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Auto-focus back button on mount for accessibility
  useEffect(() => {
    backBtnRef.current?.focus()
  }, [])

  const rawMedia = event?.media

  // Canonical normalized media collection, sorted strictly by explicit order
  const sortedMedia = useMemo(() => {
    return normalizeMediaList(rawMedia)
  }, [rawMedia])

  const coverMediaId = event?.coverMediaId

  // Determine initial index based on designated cover media
  const initialIndex = useMemo(() => {
    if (sortedMedia.length === 0) return 0
    if (coverMediaId) {
      const idx = sortedMedia.findIndex((m) => m.id === coverMediaId)
      if (idx !== -1) return idx
    }
    return 0
  }, [sortedMedia, coverMediaId])

  // Synchronize index if event changes
  if (event?.id !== prevEventId) {
    setPrevEventId(event?.id)
    setCurrentIndex(initialIndex)
    setIsLightboxOpen(false)
  }

  const primaryCoverItem = useMemo(() => {
    if (sortedMedia.length === 0) return null
    if (coverMediaId) {
      const found = sortedMedia.find((m) => m.id === coverMediaId)
      if (found) return found
    }
    return sortedMedia[0]
  }, [sortedMedia, coverMediaId])

  const total = sortedMedia.length

  // Count photos & videos
  const photoCount = useMemo(() => {
    return sortedMedia.filter((m) => m.type === 'image').length
  }, [sortedMedia])

  const videoCount = useMemo(() => {
    return sortedMedia.filter((m) => m.type === 'video').length
  }, [sortedMedia])


  // Subtitle text for bespoke "View Full Album" affordance
  const mediaSummaryDetail = useMemo(() => {
    if (total === 0) return ''
    const parts = []
    if (photoCount > 0) parts.push(`${photoCount} ${photoCount === 1 ? 'photograph' : 'photographs'}`)
    if (videoCount > 0) parts.push(`${videoCount} ${videoCount === 1 ? 'film' : 'films'}`)
    return parts.join(' · ')
  }, [total, photoCount, videoCount])

  // Exit fullscreen cleanly and invoke onClose
  const handleCloseModal = useCallback(() => {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {})
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen()
        }
      } catch {
        // ignore
      }
    }
    onClose()
  }, [onClose])

  // Escape key handler (only active when Lightbox is NOT open)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLightboxOpen) return
      if (e.key === 'Escape') {
        handleCloseModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, handleCloseModal])

  const modalContent = (
    <div
      className="royal-album-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseModal()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="royal-album-title"
    >
      <div className="royal-album-window is-editorial-keepsake" ref={modalWindowRef}>
        {/* ===================================================
            1. SINGLE COMPACT NAVIGATION HEADER
        =================================================== */}
        <header className="royal-album-top-bar">

          <div className="inner-header-seal" aria-hidden="true">
            <span className="inner-seal-text">Wedding Chronicle</span>
          </div>

          <button
            type="button"
            ref={backBtnRef}
            className="royal-album-back-btn"
            onClick={handleCloseModal}
            aria-label="Return"
          >
            <span className="back-arrow" aria-hidden="true">←</span>
            <span>Return</span>
          </button>

          
        </header>

        {/* ===================================================
            2. ROYAL WEDDING CHRONICLE BODY (CONTENT-DRIVEN HEIGHT)
        =================================================== */}
        <div className="inner-editorial-keepsake-body">
          <article className="inner-chronicle-card">
            {/* -------------------------------------------------
                A. EVENT IDENTITY & METADATA (PRIMARY FOCUS)
            ------------------------------------------------- */}
            <div className="inner-identity-section">
              <h1 id="royal-album-title" className="inner-chronicle-title">
                {event?.title}
              </h1>

              <div className="inner-meta-row">
                {event?.date && (
                  <span className="inner-meta-date">
                    <span className="meta-accent" aria-hidden="true">❖</span>
                    <span>{event.date}</span>
                  </span>
                )}

                {event?.location && (
                  <span className="inner-meta-location">
                    <MapPinIcon size={12} />
                    <span>{event.location}</span>
                  </span>
                )}

                
              </div>
              {event?.category && event.category.trim().length > 0 && (
                  <span className="inner-meta-category">
                    <span>{event.category}</span>
                  </span>
                )}

              <div className="inner-identity-divider" aria-hidden="true" />
            </div>

            {/* -------------------------------------------------
                B. DEDICATED STORY PANEL (DIRECTLY ABOVE COVER)
            ------------------------------------------------- */}
            {event?.description && event.description.trim().length > 0 && (
              <section className="inner-story-panel" aria-label="Event story">
                <span className="story-corner tl" aria-hidden="true">❖</span>
                <span className="story-corner tr" aria-hidden="true">❖</span>
                <span className="story-corner bl" aria-hidden="true">❖</span>
                <span className="story-corner br" aria-hidden="true">❖</span>

                <div className="story-panel-header">
                  <h2 className="story-heading">The Story</h2>
                </div>

                <div className="story-body">
                  <p>{event.description}</p>
                </div>
              </section>
            )}

            {/* -------------------------------------------------
                C. ONE MAGNIFICENT FRAMED COVER PHOTOGRAPH
            ------------------------------------------------- */}
            <div className="inner-cover-showcase">
              <div
                className={`inner-cover-frame ${total >= 1 ? 'is-interactive' : ''}`}
                onClick={() => {
                  if (total >= 1) {
                    setCurrentIndex(initialIndex)
                    setIsLightboxOpen(true)
                  }
                }}
                onKeyDown={(e) => {
                  if (total >= 1 && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    setCurrentIndex(initialIndex)
                    setIsLightboxOpen(true)
                  }
                }}
                role={total >= 1 ? 'button' : undefined}
                tabIndex={total >= 1 ? 0 : -1}
                aria-label={
                  total > 1
                    ? `Open ${event?.title} full album (${total} moments)`
                    : `View ${event?.title} photograph in full view`
                }
              >
                {/* Antique Gold Corner Filigree Accents */}
                <span className="inner-filigree tl" aria-hidden="true" />
                <span className="inner-filigree tr" aria-hidden="true" />
                <span className="inner-filigree bl" aria-hidden="true" />
                <span className="inner-filigree br" aria-hidden="true" />

                <div className="inner-cover-frame-matting">
                  {primaryCoverItem ? (
                    <>
                      <img
                        src={
                          primaryCoverItem.type === 'video'
                            ? primaryCoverItem.thumbnailUrl || primaryCoverItem.url
                            : primaryCoverItem.url
                        }
                        alt={primaryCoverItem.altText || primaryCoverItem.caption || event?.title}
                        className="inner-cover-photo-img"
                        loading="eager"
                        decoding="async"
                      />
                      {primaryCoverItem.type === 'video' && (
                        <span className="inner-video-badge">
                          <VideoPlayIcon size={10} />
                          <span>Film</span>
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="inner-cover-empty-matting">
                      <CameraPlaceholderIcon size={36} />
                      <span className="inner-empty-title">Moments to be cherished</span>
                      <span className="inner-empty-sub">Photographs will be added soon</span>
                    </div>
                  )}
                </div>
              </div>

              {/* -------------------------------------------------
                  D. SIGNATURE ALBUM INVITATION (SHOWN ONLY WHEN total > 1)
              ------------------------------------------------- */}
              {total > 1 && (
                <div className="inner-album-invitation-wrapper">
                  <button
                    type="button"
                    className="inner-view-album-affordance"
                    onClick={() => {
                      setCurrentIndex(initialIndex)
                      setIsLightboxOpen(true)
                    }}
                    aria-label={`View full album containing ${total} moments`}
                  >
                    <div className="affordance-book-motif" aria-hidden="true">
                      <span className="book-leaf-left" />
                      <span className="book-binding" />
                      <span className="book-leaf-right" />
                      <span className="book-sparkle">✦</span>
                    </div>
                    <div className="affordance-content">
                      <span className="affordance-label">View Full Album</span>
                      <span className="affordance-count">{mediaSummaryDetail}</span>
                    </div>
                    <span className="affordance-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>

      {/* ===================================================
          3. IMMERSIVE ALBUM VIEWER (ENLARGED FULL LIGHTBOX)
      =================================================== */}
      {isLightboxOpen && (
        <AlbumLightbox
          media={sortedMedia}
          currentIndex={currentIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={(newIdx) => setCurrentIndex(newIdx)}
          eventTitle={event?.title || ''}
        />
      )}
    </div>
  )

  // Mount outside parent stacking and transform contexts
  if (mounted && typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}
