import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { MapPinIcon, CameraPlaceholderIcon, VideoPlayIcon } from './JourneyOrnaments'
import RoyalVideoPlayer from './RoyalVideoPlayer'
import AlbumLightbox from './AlbumLightbox'
import './EventAlbum.css'

/**
 * EventGalleryModal
 *
 * Compact, responsive guest-facing media carousel for Puneeth & Chinmai's wedding website.
 * Features:
 *   - Stacking context fixed via React Portal to document.body (unobstructed by global navbar)
 *   - Safe-area insets respected on mobile
 *   - Single media carousel: cover photo is initial item (NO duplicated cover or stacked grids)
 *   - Responsive main viewer: 1 item at a time with contain aspect ratio
 *   - Left and right chevrons, desktop arrow keys, and mobile touch swipe
 *   - Interactive Royal Video Player with timeline scrubbing (click & drag)
 *   - Full-screen photo lightbox with keyboard and swipe navigation
 *   - Horizontally scrollable thumbnail strip with auto-scrolling active indicator
 *   - Compact, vertical space-saving event header
 */
export default function EventGalleryModal({
  event,
  onClose,
}) {
  const modalWindowRef = useRef(null)
  const backBtnRef = useRef(null)
  const thumbStripRef = useRef(null)
  const activeThumbRef = useRef(null)
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)

  // Lock body scroll while modal is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [])

  // Auto-focus the back button for accessibility
  useEffect(() => {
    backBtnRef.current?.focus()
  }, [])

  const rawMedia = event?.media

  // Sort media strictly by persisted sort order
  const sortedMedia = useMemo(() => {
    if (!rawMedia || !Array.isArray(rawMedia)) return []
    return [...rawMedia].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
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

  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [prevEventId, setPrevEventId] = useState(event?.id)

  // Synchronize index if event changes during render
  if (event?.id !== prevEventId) {
    setPrevEventId(event?.id)
    setCurrentIndex(initialIndex)
  }

  const total = sortedMedia.length
  const currentItem = sortedMedia[currentIndex] || null

  // Image-only list for the full-screen photo lightbox
  const imageMediaList = useMemo(() => {
    return sortedMedia.filter((m) => m.type === 'image')
  }, [sortedMedia])

  // Count photos & videos
  const photoCount = useMemo(() => {
    return sortedMedia.filter((m) => m.type === 'image').length
  }, [sortedMedia])

  const videoCount = useMemo(() => {
    return sortedMedia.filter((m) => m.type === 'video').length
  }, [sortedMedia])

  // Media count text for header
  const mediaCountText = useMemo(() => {
    if (total === 0) return 'No media uploaded'
    const parts = []
    if (photoCount > 0) parts.push(`${photoCount} ${photoCount === 1 ? 'photo' : 'photos'}`)
    if (videoCount > 0) parts.push(`${videoCount} ${videoCount === 1 ? 'video' : 'videos'}`)
    return parts.join(' · ')
  }, [total, photoCount, videoCount])

  // Navigation handlers
  const handlePrev = useCallback(() => {
    if (total <= 1) return
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
  }, [total])

  const handleNext = useCallback(() => {
    if (total <= 1) return
    setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
  }, [total])

  const handleSelectIndex = useCallback((idx) => {
    if (idx >= 0 && idx < total) {
      setCurrentIndex(idx)
    }
  }, [total])

  // Automatically scroll the active thumbnail into view
  useEffect(() => {
    if (activeThumbRef.current && thumbStripRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [currentIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isLightboxOpen) {
          setIsLightboxOpen(false)
        } else {
          onClose()
        }
      } else if (!isLightboxOpen) {
        if (e.key === 'ArrowLeft') {
          handlePrev()
        } else if (e.key === 'ArrowRight') {
          handleNext()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, onClose, handlePrev, handleNext])

  // Touch swipe support on main viewer
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartX.current = e.touches[0].clientX
      touchEndX.current = e.touches[0].clientX
    }
  }

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      touchEndX.current = e.touches[0].clientX
    }
  }

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const diff = touchStartX.current - touchEndX.current
    const swipeThreshold = 45

    if (diff > swipeThreshold) {
      handleNext()
    } else if (diff < -swipeThreshold) {
      handlePrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  // Find index of current image in imageMediaList for lightbox
  const currentImageLightboxIndex = useMemo(() => {
    if (!currentItem || currentItem.type !== 'image') return 0
    const idx = imageMediaList.findIndex((m) => m.id === currentItem.id)
    return idx !== -1 ? idx : 0
  }, [currentItem, imageMediaList])

  // Lightbox navigation syncs back to carousel
  const handleLightboxNavigate = useCallback(
    (newImgIdx) => {
      const targetImg = imageMediaList[newImgIdx]
      if (targetImg) {
        const globalIdx = sortedMedia.findIndex((m) => m.id === targetImg.id)
        if (globalIdx !== -1) {
          setCurrentIndex(globalIdx)
        }
      }
    },
    [imageMediaList, sortedMedia]
  )

  const isCoverItem = currentItem && currentItem.id === (event?.coverMediaId || sortedMedia[0]?.id)

  const modalContent = (
    <div
      className="royal-album-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLightboxOpen) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="royal-album-title"
    >
      <div className="royal-album-window" ref={modalWindowRef}>
        {/* ===================================================
            1. COMPACT TOP HEADER & NAVIGATION
        =================================================== */}
        <div className="royal-album-top-bar">
          <button
            type="button"
            ref={backBtnRef}
            className="royal-album-back-btn"
            onClick={onClose}
            aria-label="Return to relationship map"
          >
            <span aria-hidden="true">←</span>
            <span>Return to Map</span>
          </button>

          <button
            type="button"
            className="royal-album-close-btn"
            onClick={onClose}
            aria-label="Close event album (Esc)"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* ===================================================
            2. COMPACT EVENT DETAILS HEADER
        =================================================== */}
        <header className="royal-album-compact-header">
          <div className="royal-album-kicker">
            <span className="royal-kicker-date">{event?.date}</span>
            {event?.location && (
              <span className="royal-kicker-location">
                <MapPinIcon size={12} />
                <span>{event.location}</span>
              </span>
            )}
            <span className="royal-kicker-pill">{mediaCountText}</span>
          </div>

          <h1 id="royal-album-title" className="royal-album-compact-title">
            {event?.title}
          </h1>

          {/* Compact Story / Description (Omitted cleanly if empty) */}
          {event?.description && event.description.trim().length > 0 && (
            <div className="royal-album-compact-desc">
              <p>{event.description}</p>
            </div>
          )}
        </header>

        {/* ===================================================
            3. SINGLE MAIN CAROUSEL VIEWER
        =================================================== */}
        {total > 0 && currentItem ? (
          <div className="royal-carousel-section">
            <div
              className="royal-carousel-stage"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Left Chevron Button */}
              {total > 1 && (
                <button
                  type="button"
                  className="royal-carousel-nav-btn prev"
                  onClick={handlePrev}
                  aria-label="Previous media item (Arrow Left)"
                  title="Previous (←)"
                >
                  ‹
                </button>
              )}

              {/* Central Media Viewer Frame */}
              <div className="royal-carousel-viewer-frame">
                {/* Photo Viewer */}
                {currentItem.type === 'image' && (
                  <div
                    className="royal-carousel-photo-container"
                    onClick={() => setIsLightboxOpen(true)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setIsLightboxOpen(true)
                      }
                    }}
                    aria-label={`View full-size photo ${currentIndex + 1}: ${currentItem.caption || event?.title}`}
                  >
                    <img
                      src={currentItem.url}
                      alt={currentItem.altText || currentItem.caption || `${event?.title} media ${currentIndex + 1}`}
                      className="royal-carousel-photo"
                      loading="eager"
                    />
                    <div className="royal-carousel-zoom-pill">
                      <span aria-hidden="true">🔍</span>
                      <span>Enlarge</span>
                    </div>
                  </div>
                )}

                {/* Video Viewer (Keyed by ID to stop previous video on navigation) */}
                {currentItem.type === 'video' && (
                  <div className="royal-carousel-video-container">
                    <RoyalVideoPlayer
                      key={currentItem.id}
                      src={currentItem.url}
                      poster={currentItem.thumbnailUrl}
                      caption={currentItem.caption}
                      title={`${event?.title} video ${currentIndex + 1}`}
                    />
                  </div>
                )}
              </div>

              {/* Right Chevron Button */}
              {total > 1 && (
                <button
                  type="button"
                  className="royal-carousel-nav-btn next"
                  onClick={handleNext}
                  aria-label="Next media item (Arrow Right)"
                  title="Next (→)"
                >
                  ›
                </button>
              )}
            </div>

            {/* Media Meta Info & Counter */}
            <div className="royal-carousel-meta-bar">
              <div className="royal-carousel-counter-badge">
                <span className="counter-current">{currentIndex + 1}</span>
                <span className="counter-sep">/</span>
                <span className="counter-total">{total}</span>
                {isCoverItem && <span className="counter-cover-tag">★ Cover</span>}
              </div>

              {currentItem.type === 'image' && (
                <button
                  type="button"
                  className="royal-enlarge-text-btn"
                  onClick={() => setIsLightboxOpen(true)}
                  aria-label="Open full-screen photo viewer"
                >
                  <span>Full View</span>
                </button>
              )}
            </div>

            {/* Caption Display (if present) */}
            {currentItem.caption && (
              <div className="royal-carousel-caption-box">
                <p>{currentItem.caption}</p>
              </div>
            )}

            {/* ===================================================
                4. COMPACT HORIZONTAL THUMBNAIL STRIP
            =================================================== */}
            {total > 1 && (
              <div
                className="royal-thumb-strip-wrapper"
                ref={thumbStripRef}
                role="tablist"
                aria-label="Album media thumbnails"
              >
                {sortedMedia.map((item, idx) => {
                  const isActive = idx === currentIndex
                  return (
                    <button
                      key={item.id || idx}
                      ref={isActive ? activeThumbRef : null}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`royal-thumb-item ${isActive ? 'is-active' : ''} ${item.type === 'video' ? 'is-video' : ''}`}
                      onClick={() => handleSelectIndex(idx)}
                      aria-label={`${item.type === 'video' ? 'Video' : 'Photograph'} ${idx + 1}`}
                      title={`${item.type === 'video' ? 'Video' : 'Photograph'} ${idx + 1}`}
                    >
                      <img
                        src={item.type === 'video' ? item.thumbnailUrl || item.url : item.url}
                        alt=""
                        className="royal-thumb-img"
                        loading="lazy"
                      />
                      {item.type === 'video' && (
                        <div className="royal-thumb-video-icon">
                          <VideoPlayIcon size={12} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          /* Graceful Empty State for Milestone without Media */
          <div className="royal-album-empty-state">
            <CameraPlaceholderIcon size={40} />
            <span className="royal-empty-title">No Media Uploaded Yet</span>
            <p className="royal-empty-text">
              Real photographs and videos assigned to this milestone will be presented here once published.
            </p>
          </div>
        )}
      </div>

      {/* ===================================================
          5. FULL-SCREEN LIGHTBOX FOR DETAILED PHOTO INSPECTION
      =================================================== */}
      {isLightboxOpen && imageMediaList.length > 0 && (
        <AlbumLightbox
          images={imageMediaList}
          currentIndex={currentImageLightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onNavigate={handleLightboxNavigate}
          eventTitle={event?.title || ''}
        />
      )}
    </div>
  )

  // Use createPortal to mount outside parent z-index and transform contexts
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return modalContent
}
