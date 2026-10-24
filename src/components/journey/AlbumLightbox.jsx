import React, { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from 'lucide-react'
import RoyalVideoPlayer from './RoyalVideoPlayer'
import { normalizeMediaItem } from '../../utils/mediaNormalizer'

// Session-wide image load cache so previously viewed/preloaded images render with zero flicker
const globalLoadedImageUrls = new Set()

/**
 * AlbumLightbox
 *
 * Immersive, royal full-screen viewer for Puneeth & Chinmai's wedding album:
 *   - Fast instantaneous image navigation with background preloading of adjacent images.
 *   - High-priority loading for the active media item.
 *   - Robust error resilience: failed images never lock navigation.
 *   - Touch swipe gestures for mobile photographs.
 *   - Keyboard navigation (ArrowLeft, ArrowRight, Escape, F).
 *   - Fullscreen API toggle with graceful vendor fallbacks.
 *   - Automatically synchronized and scrolling thumbnail filmstrip.
 *   - Renders RoyalVideoPlayer with custom timeline scrubber for videos.
 *   - Clean audio teardown and scroll unlock when closing.
 */
export default function AlbumLightbox({
  media = [],
  images, // Backward-compatible prop alias
  currentIndex = 0,
  onClose,
  onNavigate,
  eventTitle = '',
}) {
  const closeBtnRef = useRef(null)
  const lightboxStageRef = useRef(null)
  const thumbsContainerRef = useRef(null)
  const activeThumbRef = useRef(null)

  // Touch swipe coordinates
  const touchStartRef = useRef({ x: 0, y: 0 })
  const touchEndRef = useRef({ x: 0, y: 0 })

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Loaded and Error URLs tracking
  const [loadedUrls, setLoadedUrls] = useState(() => new Set(globalLoadedImageUrls))
  const [errorUrls, setErrorUrls] = useState(() => new Set())

  // Support both media and legacy images prop
  const rawList = media && media.length > 0 ? media : (images || [])
  const mediaList = rawList.map((item, idx) => normalizeMediaItem(item, idx))
  const total = mediaList.length
  const currentItem = mediaList[currentIndex] || null

  // Mark image as loaded
  const handleImageLoad = useCallback((url) => {
    if (!url) return
    globalLoadedImageUrls.add(url)
    setLoadedUrls((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
  }, [])

  // Mark image as errored
  const handleImageError = useCallback((url) => {
    if (!url) return
    setErrorUrls((prev) => {
      if (prev.has(url)) return prev
      const next = new Set(prev)
      next.add(url)
      return next
    })
  }, [])

  // Navigation handlers
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

  // Preload adjacent images in background
  useEffect(() => {
    if (!mediaList || mediaList.length <= 1) return

    // Preload next item
    const nextIdx = (currentIndex + 1) % total
    const nextItem = mediaList[nextIdx]
    if (nextItem && nextItem.type === 'image' && nextItem.url && !globalLoadedImageUrls.has(nextItem.url)) {
      const imgNext = new Image()
      imgNext.fetchPriority = 'low'
      imgNext.src = nextItem.url
      imgNext.onload = () => handleImageLoad(nextItem.url)
      imgNext.onerror = () => handleImageError(nextItem.url)
    }

    // Preload previous item
    const prevIdx = (currentIndex - 1 + total) % total
    const prevItem = mediaList[prevIdx]
    if (prevItem && prevItem.type === 'image' && prevItem.url && !globalLoadedImageUrls.has(prevItem.url)) {
      const imgPrev = new Image()
      imgPrev.fetchPriority = 'low'
      imgPrev.src = prevItem.url
      imgPrev.onload = () => handleImageLoad(prevItem.url)
      imgPrev.onerror = () => handleImageError(prevItem.url)
    }
  }, [currentIndex, mediaList, total, handleImageLoad, handleImageError])

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (activeThumbRef.current && thumbsContainerRef.current) {
      activeThumbRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [currentIndex])

  // Browser Fullscreen API Toggle
  const toggleFullscreen = useCallback(() => {
    const isFs = Boolean(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    )

    if (!isFs) {
      const target = document.documentElement
      if (target.requestFullscreen) {
        target.requestFullscreen().catch(() => {})
      } else if (target.webkitRequestFullscreen) {
        target.webkitRequestFullscreen()
      } else if (target.mozRequestFullScreen) {
        target.mozRequestFullScreen()
      } else if (target.msRequestFullscreen) {
        target.msRequestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {})
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    }
  }, [])

  // Listen to Fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      )
      setIsFullscreen(isFs)
    }

    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    document.addEventListener('mozfullscreenchange', handleFsChange)
    document.addEventListener('MSFullscreenChange', handleFsChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
      document.removeEventListener('mozfullscreenchange', handleFsChange)
      document.removeEventListener('MSFullscreenChange', handleFsChange)
    }
  }, [])

  // Focus close button on mount
  useEffect(() => {
    closeBtnRef.current?.focus()
  }, [])

  // Keyboard navigation & Esc handling
  useEffect(() => {
    const handleKeyDown = (e) => {
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
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handlePrev, handleNext, toggleFullscreen])

  // Touch Swipe Handlers for Photos (deliberate horizontal gestures only)
  const handleTouchStart = (e) => {
    if (currentItem?.type === 'video') return
    const touch = e.touches[0]
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() }
    touchEndRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchMove = (e) => {
    if (currentItem?.type === 'video') return
    const touch = e.touches[0]
    touchEndRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = () => {
    if (currentItem?.type === 'video') return
    const dx = touchStartRef.current.x - touchEndRef.current.x
    const dy = touchStartRef.current.y - touchEndRef.current.y
    const elapsed = Date.now() - (touchStartRef.current.time || 0)

    // Ensure deliberate horizontal swipe intent:
    // 1. Min swipe distance: 36px
    // 2. Clear horizontal orientation: horizontal delta is at least 1.4x vertical delta
    // 3. Reasonable duration: completed within 600ms (avoids accidental triggers from slow scrolling)
    if (Math.abs(dx) >= 36 && Math.abs(dx) > Math.abs(dy) * 1.4 && elapsed < 600) {
      if (dx > 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  if (!currentItem) return null

  const isVideo = currentItem.type === 'video'
  const isImageLoaded = !isVideo && (globalLoadedImageUrls.has(currentItem.url) || loadedUrls.has(currentItem.url))
  const isImageError = !isVideo && errorUrls.has(currentItem.url)

  return (
    <div
      className="album-lightbox-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Expanded media viewer: ${currentItem.caption || eventTitle}`}
    >
      {/* 1. Header Bar: Counter, Type, Fullscreen Toggle & Close Button */}
      <div className="album-lightbox-header">
        <div className="album-lightbox-meta">
          <span className="album-lightbox-counter">
            {isVideo ? 'VIDEO' : 'PHOTOGRAPH'} {currentIndex + 1} OF {total}
          </span>
        </div>
        

        <div className="album-lightbox-header-actions">
          <button
            type="button"
            className="lightbox-tool-btn fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen (F)' : 'Enter fullscreen (F)'}
            title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
          >
            {isFullscreen ? <Minimize2 size={16} strokeWidth={2.2} /> : <Maximize2 size={16} strokeWidth={2.2} />}
          </button>

          <button
            type="button"
            ref={closeBtnRef}
            className="album-lightbox-close-btn"
            onClick={onClose}
            aria-label="Close enlarged media viewer (Esc)"
            title="Close (Esc)"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* 2. Main Stage: Media Element and Left/Right Navigation */}
      <div className="album-lightbox-stage" ref={lightboxStageRef}>
        {total > 1 && (
          <button
            type="button"
            className="album-lightbox-arrow prev"
            onClick={handlePrev}
            aria-label="Previous item (Arrow Left)"
            title="Previous (←)"
          >
            <ChevronLeft size={24} strokeWidth={2.2} />
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
            <div
              className="album-lightbox-photo-wrap"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Subtle Loading Indicator (only shown while image is loading for first time) */}
              {!isImageLoaded && !isImageError && (
                <div className="album-lightbox-loader" aria-live="polite">
                  <div className="album-lightbox-spinner" />
                </div>
              )}

              {/* Error Fallback (Navigation remains fully functional) */}
              {isImageError ? (
                <div className="album-lightbox-error-fallback">
                  <span className="error-gem" aria-hidden="true">❖</span>
                  <p className="error-title">Photograph temporarily unavailable</p>
                  <p className="error-sub">Use arrows or thumbnails to continue browsing</p>
                </div>
              ) : (
                <img
                  key={currentItem.url}
                  src={currentItem.url}
                  alt={currentItem.altText || currentItem.caption || `${eventTitle} photograph ${currentIndex + 1}`}
                  className={`album-lightbox-image ${isImageLoaded ? 'is-loaded' : 'is-loading'}`}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  draggable={false}
                  onLoad={() => handleImageLoad(currentItem.url)}
                  onError={() => handleImageError(currentItem.url)}
                />
              )}
            </div>
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
            <ChevronRight size={24} strokeWidth={2.2} />
          </button>
        )}
      </div>

      {/* 3. Mobile Navigation Row (Option 1: Below Photograph, Above Thumbnails) */}
      {total > 1 && (
        <div className="album-lightbox-mobile-nav" role="navigation" aria-label="Media navigation">
          <button
            type="button"
            className="album-lightbox-mobile-nav-btn prev"
            onClick={handlePrev}
            aria-label="Previous item"
            title="Previous"
          >
            <ChevronLeft size={18} strokeWidth={2.4} />
          </button>

          <span className="album-lightbox-mobile-counter" aria-live="polite" aria-atomic="true">
            {currentIndex + 1} / {total}
          </span>

          <button
            type="button"
            className="album-lightbox-mobile-nav-btn next"
            onClick={handleNext}
            aria-label="Next item"
            title="Next"
          >
            <ChevronRight size={18} strokeWidth={2.4} />
          </button>
        </div>
      )}

      {/* 4. Thumbnail Strip for quick memory selection */}
      {total > 1 && (
        <div
          ref={thumbsContainerRef}
          className="album-lightbox-thumbs-bar"
          role="tablist"
          aria-label="Lightbox media thumbnails"
        >
          {mediaList.map((item, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={item.id || idx}
                ref={isActive ? activeThumbRef : null}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`album-lightbox-thumb-btn ${isActive ? 'is-active' : ''}`}
                onClick={() => onNavigate(idx)}
                aria-label={`${item.type === 'video' ? 'Film' : 'Photograph'} ${idx + 1}`}
                title={`${item.type === 'video' ? 'Film' : 'Photograph'} ${idx + 1}`}
              >
                <img
                  src={item.type === 'video' ? item.thumbnailUrl || item.url : item.url}
                  alt=""
                  className="album-lightbox-thumb-img"
                  loading="lazy"
                  decoding="async"
                />
                {item.type === 'video' && (
                  <span className="album-lightbox-thumb-video-icon">▶</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* 4. Footer Bar: Caption if supplied */}
      {currentItem.caption && (
        <div className="album-lightbox-footer">
          <p className="album-lightbox-caption">{currentItem.caption}</p>
        </div>
      )}
    </div>
  )
}
