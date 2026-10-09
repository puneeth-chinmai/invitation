import React, { useEffect, useCallback, useRef } from 'react'

/**
 * AlbumLightbox
 *
 * Immersive, royal full-screen photograph viewer for Puneeth & Chinmai's wedding album:
 *   - Constrained strictly to photographs (never includes videos in photo navigation)
 *   - Respects exact database media order
 *   - Touch swipe gestures for mobile
 *   - Keyboard navigation (ArrowLeft, ArrowRight, Escape)
 *   - Preserves original image aspect ratio
 *   - Elegant antique-gold and deep-maroon styling with accessible controls
 */
export default function AlbumLightbox({
  images = [],
  currentIndex = 0,
  onClose,
  onNavigate,
  eventTitle = '',
}) {
  const touchStartX = useRef(null)
  const touchEndX = useRef(null)
  const closeBtnRef = useRef(null)

  const currentImage = images[currentIndex] || null
  const total = images.length

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
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
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

  if (!currentImage) return null

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
      aria-label={`Expanded photograph viewer: ${currentImage.caption || eventTitle}`}
    >
      {/* 1. Header Bar: Counter & Close Button */}
      <div className="album-lightbox-header">
        <div className="album-lightbox-meta">
          <span className="album-lightbox-counter">
            PHOTOGRAPH {currentIndex + 1} OF {total}
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
          aria-label="Close enlarged photograph"
          title="Close (Esc)"
        >
          ✕
        </button>
      </div>

      {/* 2. Main Stage: Image and Left/Right Navigation */}
      <div className="album-lightbox-stage">
        {total > 1 && (
          <button
            type="button"
            className="album-lightbox-arrow prev"
            onClick={handlePrev}
            aria-label="Previous photograph (Arrow Left)"
            title="Previous (←)"
          >
            ‹
          </button>
        )}

        <div className="album-lightbox-img-frame">
          <img
            src={currentImage.url}
            alt={currentImage.altText || currentImage.caption || `${eventTitle} photograph ${currentIndex + 1}`}
            className="album-lightbox-image"
          />
        </div>

        {total > 1 && (
          <button
            type="button"
            className="album-lightbox-arrow next"
            onClick={handleNext}
            aria-label="Next photograph (Arrow Right)"
            title="Next (→)"
          >
            ›
          </button>
        )}
      </div>

      {/* 3. Footer Bar: Caption if supplied */}
      {currentImage.caption && (
        <div className="album-lightbox-footer">
          <p className="album-lightbox-caption">{currentImage.caption}</p>
        </div>
      )}
    </div>
  )
}
