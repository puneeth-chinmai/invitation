import React, { useEffect, useCallback, useRef } from 'react'
import RoyalVideoPlayer from './RoyalVideoPlayer'
import { normalizeMediaItem } from '../../utils/mediaNormalizer'

/**
 * AlbumLightbox
 *
 * Immersive, royal full-screen viewer for Puneeth & Chinmai's wedding album:
 *   - Unified canonical navigation across BOTH photographs and videos.
 *   - Respects exact chronological/database media order.
 *   - Touch swipe gestures for mobile devices.
 *   - Keyboard navigation (ArrowLeft, ArrowRight, Escape).
 *   - Renders RoyalVideoPlayer with custom timeline scrubber for videos.
 *   - Renders enlarged photo viewer for images.
 *   - Clean audio teardown when advancing between videos and photos.
 *   - Accessible, theme-matched antique gold and royal maroon styling.
 */
export default function AlbumLightbox({
  media = [],
  images, // Backward-compatible prop alias
  currentIndex = 0,
  onClose,
  onNavigate,
  eventTitle = '',
}) {
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)
  const closeBtnRef = useRef(null)

  // Support both media and legacy images prop
  const rawList = media && media.length > 0 ? media : (images || [])
  const mediaList = rawList.map((item, idx) => normalizeMediaItem(item, idx))
  const total = mediaList.length
  const currentItem = mediaList[currentIndex] || null

  const handlePrev = useCallback(() => {
    if (total <= 1) return
    const nextIdx = currentIndex > 0 ? currentIndex - 1 : total - 1
    onNavigate(nextIdx)
  }, [currentIndex, total, onNavigate])

  const handleNext = useCallback(() => {
    if (total <= 1) return
    const nextIdx = currentIndex < total - 1 ? currentIndex + 1 : 0
    onNavigate(nextIdx)
  }, [currentIndex, total, onNavigate])

  // Focus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  // Keyboard navigation & Esc handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Do not intercept arrow keys if video scrubber or input control has focus
      if (
        e.target &&
        (e.target.tagName === 'INPUT' ||
          e.target.tagName === 'TEXTAREA' ||
          e.target.getAttribute?.('role') === 'slider')
      ) {
        return
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePrev, handleNext])

  // Touch swipe support for mobile
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
    const swipeThreshold = 45 // min px to trigger swipe

    if (diff > swipeThreshold) {
      // Swiped left -> next
      handleNext()
    } else if (diff < -swipeThreshold) {
      // Swiped right -> prev
      handlePrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (!currentItem) return null

  const isVideo = currentItem.type === 'video'

  return (
    <div
      className="album-lightbox-overlay"
      onClick={(e) => {
        // Clicking backdrop closes lightbox
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded media viewer: ${currentItem.caption || eventTitle}`}
    >
      {/* 1. Header Bar: Counter, Type & Close Button */}
      <div className="album-lightbox-header">
        <div className="album-lightbox-meta">
          <span className="album-lightbox-counter">
            {isVideo ? 'VIDEO' : 'PHOTOGRAPH'} {currentIndex + 1} OF {total}
          </span>
          {eventTitle && (
            <span className="album-lightbox-event-name">
              · {eventTitle}
            </span>
          )}
        </div>

        <button
          type="button"
          ref={closeBtnRef}
          className="album-lightbox-close-btn"
          onClick={onClose}
          aria-label="Close enlarged media viewer (Esc)"
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      {/* 2. Main Stage: Media Element and Left/Right Navigation */}
      <div className="album-lightbox-stage">
        {total > 1 && (
          <button
            type="button"
            className="album-lightbox-arrow prev"
            onClick={handlePrev}
            aria-label="Previous item (Arrow Left)"
            title="Previous (←)"
          >
            ‹
          </button>
        )}

        <div className="album-lightbox-img-frame">
          {isVideo ? (
            <div className="album-lightbox-video-wrap">
              <RoyalVideoPlayer
                key={currentItem.id || currentItem.url || `lightbox-vid-${currentIndex}`}
                src={currentItem.url}
                poster={currentItem.thumbnailUrl || undefined}
                caption={currentItem.caption}
                title={`${eventTitle} video ${currentIndex + 1}`}
                className="lightbox-video-player"
              />
            </div>
          ) : (
            <img
              src={currentItem.url}
              alt={currentItem.altText || currentItem.caption || `${eventTitle} photograph ${currentIndex + 1}`}
              className="album-lightbox-image"
              decoding="async"
            />
          )}
        </div>

        {total > 1 && (
          <button
            type="button"
            className="album-lightbox-arrow next"
            onClick={handleNext}
            aria-label="Next item (Arrow Right)"
            title="Next (→)"
          >
            ›
          </button>
        )}
      </div>

      {/* 3. Footer Bar: Caption if supplied */}
      {currentItem.caption && (
        <div className="album-lightbox-footer">
          <p className="album-lightbox-caption">{currentItem.caption}</p>
        </div>
      )}
    </div>
  )
}
