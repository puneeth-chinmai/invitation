import React from 'react'
import { getEventCoverMedia } from '../../data/journeyEvents'
import {
  MapPinIcon,
  CameraPlaceholderIcon,
  PhotoStackIcon,
  VideoPlayIcon,
} from './JourneyOrnaments'

/**
 * EventMarkerNode
 *
 * Compact, map-integrated event milestone marker.
 * Replaces bulky rectangular cards with a refined circular/rounded photo bezel
 * and an attached, compact typographic label.
 *
 * Designed to keep the winding route visible at all times.
 * Entire marker (photo bezel + text label) is comfortably clickable/tappable.
 */
export default function EventMarkerNode({
  event,
  index,
  isLeftAligned = true,
  onSelect,
}) {
  const coverMedia = getEventCoverMedia(event)
  const totalMedia = event.media?.length || 0


  const isEngagement =
    event.id === 'event-engagement' ||
    event.title?.toLowerCase().includes('engagement')

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(event.id)
    }
  }

  return (
    <div
      className={`map-event-marker ${isLeftAligned ? 'align-left' : 'align-right'} ${isEngagement ? 'is-milestone-highlight' : ''}`}
      onClick={() => onSelect(event.id)}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Milestone ${index + 1}: ${event.title}, ${event.date}. Click to view all ${totalMedia} media items.`}
    >
      {/* ===================================================
          1. COMPACT PHOTO BEZEL (WAYPOINT ANCHOR)
      =================================================== */}
      <div className="marker-bezel-container">
        {/* Subtle Halo Glow */}
        <div className="marker-bezel-glow" aria-hidden="true" />

        <div className="marker-photo-bezel">
          {/* Bezel Corner Filigree Notches */}
          <span className="bezel-notch n" aria-hidden="true" />
          <span className="bezel-notch s" aria-hidden="true" />
          <span className="bezel-notch e" aria-hidden="true" />
          <span className="bezel-notch w" aria-hidden="true" />

          {coverMedia ? (
            coverMedia.type === 'image' ? (
              <img
                src={coverMedia.url}
                alt={coverMedia.altText || event.title}
                className="marker-thumbnail-img"
                loading="lazy"
              />
            ) : (
              <div className="marker-video-thumb">
                {coverMedia.thumbnailUrl ? (
                  <img
                    src={coverMedia.thumbnailUrl}
                    alt={coverMedia.altText || `${event.title} video`}
                    className="marker-thumbnail-img"
                    loading="lazy"
                  />
                ) : (
                  <div className="marker-empty-frame">
                    <VideoPlayIcon size={20} />
                  </div>
                )}
                <span className="marker-video-badge" aria-hidden="true">
                  <VideoPlayIcon size={12} />
                </span>
              </div>
            )
          ) : (
            /* Tasteful Theme Placeholder (No fake photos) */
            <div className="marker-empty-frame" title="No photographs uploaded yet">
              <CameraPlaceholderIcon size={24} />
            </div>
          )}

          {/* Stop Number Badge */}
          <div className="marker-step-pill">
            <span>{index + 1}</span>
          </div>

          {/* Multi-Media Count Pill */}
          {totalMedia > 1 && (
            <div className="marker-media-badge" title={`${totalMedia} media items in this event`}>
              <PhotoStackIcon size={10} />
              <span>{totalMedia}</span>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================
          2. COMPACT TYPOGRAPHIC PLAQUE (LABEL)
      =================================================== */}
      <div className="marker-plaque">
        <div className="marker-plaque-category">
          <span>{event.category || `MILESTONE 0${index + 1}`}</span>
        </div>

        <div className="marker-plaque-date">
          <span className="plaque-gem">❖</span>
          <span>{event.date}</span>
        </div>

        <h3 className="marker-plaque-title">{event.title}</h3>

        {event.location && (
          <div className="marker-plaque-location">
            <MapPinIcon size={11} />
            <span>{event.location}</span>
          </div>
        )}

        <div className="marker-action-prompt">
          <span>{totalMedia > 0 ? 'View Album' : 'Event Details'}</span>
          <span className="prompt-arrow">→</span>
        </div>
      </div>
    </div>
  )
}
