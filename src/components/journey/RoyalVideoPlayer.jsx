import React, { useState, useRef, useEffect, useCallback } from 'react'
import { VideoPlayIcon } from './JourneyOrnaments'
import './RoyalVideoPlayer.css'

/**
 * Format seconds into mm:ss or hh:mm:ss
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds === null || seconds < 0) return '00:00'
  const s = Math.floor(seconds)
  const hrs = Math.floor(s / 3600)
  const mins = Math.floor((s % 3600) / 60)
  const secs = s % 60

  const mStr = String(mins).padStart(2, '0')
  const sStr = String(secs).padStart(2, '0')

  if (hrs > 0) {
    return `${hrs}:${mStr}:${sStr}`
  }
  return `${mStr}:${sStr}`
}

/**
 * RoyalVideoPlayer
 *
 * Bespoke, luxury antique-gold video player component for the royal album.
 * Features:
 *   - Custom timeline scrubber with click and drag seeking
 *   - Current time and duration display
 *   - Play / Pause, Skip -10s, Skip +10s
 *   - Volume slider & Mute toggle
 *   - Playback speed switcher (0.75x, 1x, 1.25x, 1.5x)
 *   - Fullscreen toggle
 *   - Buffering spinner and error recovery
 *   - Multi-video lock (pauses other videos when playing)
 *   - Strictly NO autoplay with sound
 */
export default function RoyalVideoPlayer({
  src,
  poster,
  caption,
  title,
  className = '',
}) {
  const videoRef = useRef(null)
  const containerRef = useRef(null)
  const scrubberRef = useRef(null)
  const [playerId] = useState(() => `royal-video-${Math.random().toString(36).substring(2, 9)}`)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [isBuffering, setIsBuffering] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [isScrubbing, setIsScrubbing] = useState(false)

  const hideControlsTimer = useRef(null)

  // Pause when other video starts playing
  useEffect(() => {
    const handleOtherPlay = (e) => {
      if (e.detail?.id !== playerId && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause()
      }
    }

    window.addEventListener('royal-video-play', handleOtherPlay)
    return () => {
      window.removeEventListener('royal-video-play', handleOtherPlay)
    }
  }, [playerId])

  // Auto-hide controls when playing after 3 seconds of inactivity
  const triggerControlsVisibility = useCallback(() => {
    setControlsVisible(true)
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current)
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setControlsVisible(false)
      }, 3500)
    }
  }, [isPlaying])

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return

    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true)
          window.dispatchEvent(
            new CustomEvent('royal-video-play', { detail: { id: playerId } })
          )
        })
        .catch((err) => {
          console.warn('Playback request error:', err)
        })
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }, [playerId])

  // Skip time forward or backward
  const skipTime = useCallback((delta) => {
    if (!videoRef.current) return
    const cur = videoRef.current.currentTime || 0
    const dur = videoRef.current.duration || 0
    const nextTime = Math.max(0, Math.min(dur || 999999, cur + delta))
    videoRef.current.currentTime = nextTime
    setCurrentTime(nextTime)
  }, [])

  // Scrubber Seeking Calculations
  const handleSeekToClientX = useCallback(
    (clientX) => {
      if (!scrubberRef.current || !videoRef.current) return
      const rect = scrubberRef.current.getBoundingClientRect()
      const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const dur = videoRef.current.duration || duration || 0
      const targetTime = percent * dur
      videoRef.current.currentTime = targetTime
      setCurrentTime(targetTime)
    },
    [duration]
  )

  const handleScrubberMouseDown = (e) => {
    setIsScrubbing(true)
    handleSeekToClientX(e.clientX)

    const handleMouseMove = (moveEvent) => {
      handleSeekToClientX(moveEvent.clientX)
    }

    const handleMouseUp = () => {
      setIsScrubbing(false)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  const handleScrubberTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      setIsScrubbing(true)
      handleSeekToClientX(e.touches[0].clientX)

      const handleTouchMove = (moveEvent) => {
        if (moveEvent.touches && moveEvent.touches[0]) {
          handleSeekToClientX(moveEvent.touches[0].clientX)
        }
      }

      const handleTouchEnd = () => {
        setIsScrubbing(false)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
      }

      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }
  }

  // Volume & Mute
  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value)
    if (!videoRef.current) return
    videoRef.current.volume = val
    setVolume(val)
    if (val === 0) {
      videoRef.current.muted = true
      setIsMuted(true)
    } else if (isMuted) {
      videoRef.current.muted = false
      setIsMuted(false)
    }
  }

  // Speed Cycle (0.75x -> 1x -> 1.25x -> 1.5x)
  const cycleSpeed = () => {
    if (!videoRef.current) return
    const speeds = [1, 1.25, 1.5, 0.75]
    const curIdx = speeds.indexOf(playbackRate)
    const nextSpeed = speeds[(curIdx + 1) % speeds.length]
    videoRef.current.playbackRate = nextSpeed
    setPlaybackRate(nextSpeed)
  }

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }
    document.addEventListener('fullscreenchange', handleFsChange)
    return () => document.removeEventListener('fullscreenchange', handleFsChange)
  }, [])

  // Clean unmount
  useEffect(() => {
    const el = videoRef.current
    return () => {
      if (el) {
        el.pause()
      }
    }
  }, [])

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={`royal-video-container ${className} ${isFullscreen ? 'is-fullscreen' : ''}`}
      onMouseMove={triggerControlsVisibility}
      onTouchStart={triggerControlsVisibility}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        className="royal-video-screen"
        onClick={togglePlay}
        onTimeUpdate={() => {
          if (!isScrubbing && videoRef.current) {
            setCurrentTime(videoRef.current.currentTime)
          }
        }}
        onLoadedMetadata={() => {
          if (videoRef.current) {
            setDuration(videoRef.current.duration)
            setHasError(false)
          }
        }}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false)
          setIsPlaying(true)
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false)
          setControlsVisible(true)
        }}
        onError={() => {
          setHasError(true)
          setIsBuffering(false)
        }}
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="royal-video-spinner-overlay" aria-live="polite">
          <div className="royal-spinner" />
          <span>Loading video...</span>
        </div>
      )}

      {/* Error Overlay with Retry */}
      {hasError && (
        <div className="royal-video-error-overlay">
          <span>Unable to load video stream</span>
          <button
            type="button"
            className="royal-btn-retry"
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.load()
                setHasError(false)
              }
            }}
          >
            ↻ Retry
          </button>
        </div>
      )}

      {/* Central Big Play Button when paused and controls visible */}
      {!isPlaying && !isBuffering && !hasError && (
        <button
          type="button"
          className="royal-video-hero-play"
          onClick={togglePlay}
          aria-label={title ? `Play ${title}` : 'Play video'}
        >
          <div className="hero-play-circle">
            <VideoPlayIcon size={26} />
          </div>
        </button>
      )}

      {/* Video Controls Bar */}
      <div
        className={`royal-video-controls-bar ${controlsVisible || !isPlaying ? 'visible' : 'hidden'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- 1. Custom Interactive Timeline Scrubber --- */}
        <div
          ref={scrubberRef}
          className="royal-scrubber-track"
          onMouseDown={handleScrubberMouseDown}
          onTouchStart={handleScrubberTouchStart}
          role="slider"
          aria-label="Video timeline scrubber"
          aria-valuemin="0"
          aria-valuemax={duration || 100}
          aria-valuenow={currentTime}
          aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') skipTime(-5)
            if (e.key === 'ArrowRight') skipTime(5)
            if (e.key === ' ') {
              e.preventDefault()
              togglePlay()
            }
          }}
        >
          <div className="scrubber-bar-bg">
            <div
              className="scrubber-bar-fill"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="scrubber-playhead-thumb"
              style={{ left: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* --- 2. Action Controls Row --- */}
        <div className="royal-controls-row">
          {/* Left Group: Play/Pause, Skips, Time */}
          <div className="royal-controls-left">
            <button
              type="button"
              className="royal-ctrl-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <VideoPlayIcon size={18} />
              )}
            </button>

            {/* Skip Backward 10s */}
            <button
              type="button"
              className="royal-ctrl-btn skip-btn"
              onClick={() => skipTime(-10)}
              aria-label="Skip backward 10 seconds"
              title="Skip -10s"
            >
              <span className="skip-symbol">↺</span>
              <span className="skip-num">10s</span>
            </button>

            {/* Skip Forward 10s */}
            <button
              type="button"
              className="royal-ctrl-btn skip-btn"
              onClick={() => skipTime(10)}
              aria-label="Skip forward 10 seconds"
              title="Skip +10s"
            >
              <span className="skip-symbol">↻</span>
              <span className="skip-num">10s</span>
            </button>

            {/* Time Display */}
            <div className="royal-time-display">
              <span className="time-current">{formatTime(currentTime)}</span>
              <span className="time-sep">/</span>
              <span className="time-total">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Group: Volume, Speed, Fullscreen */}
          <div className="royal-controls-right">
            {/* Volume & Mute */}
            <div className="royal-volume-group">
              <button
                type="button"
                className="royal-ctrl-btn"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="royal-volume-slider"
                aria-label="Volume slider"
              />
            </div>

            {/* Speed Selector */}
            <button
              type="button"
              className="royal-ctrl-btn speed-btn"
              onClick={cycleSpeed}
              aria-label={`Playback speed: ${playbackRate}x`}
              title="Change Speed"
            >
              {playbackRate}x
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              className="royal-ctrl-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6m-1 1L14 4M9 21H3v-6m1-1l6 6M21 9v6h-6m1 1l-6-6M3 15v-6h6m-1-1l6 6" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Caption if provided */}
      {caption && (
        <div className="royal-video-caption-bar">
          <p>{caption}</p>
        </div>
      )}
    </div>
  )
}
