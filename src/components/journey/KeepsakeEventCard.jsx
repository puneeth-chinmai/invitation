import React, { useMemo } from 'react'
import { getEventCoverMedia } from '../../data/journeyEvents'
import { normalizeMediaList, normalizeMediaItem } from '../../utils/mediaNormalizer'
import { MapPinIcon, PhotoStackIcon, VideoPlayIcon } from './JourneyOrnaments'
import './KeepsakeCard.css'

/**
 * KeepsakeEventCard
 *
 * Universal outer event card for all journey milestones along the timeline.
 * Combines:
 *   1. Royal Indian wedding aesthetic: warm ivory, deep burgundy, antique gold.
 *   2. Editorial hierarchy: Photo Collage -> Date & Location -> Event Title -> Media Count & "View Event".
 *   3. Adaptive photo collage matching media availability:
 *      - 3+ photos: Approved 3-photo scrapbook collage (central frame + left/right overlapping).
 *      - 2 photos: Balanced 2-photo scrapbook duet (prominent + overlapping).
 *      - 1 photo: Beautiful single framed cover photo centered.
 *      - 0 photos: Elegant theme-matched fallback (no broken images or fake photos).
 *   4. Clean content: strictly NO Kannada translations and NO descriptive captions/quotes.
 *   5. Seamless connection to the winding timeline route.
 */
export default function KeepsakeEventCard({
  event,
  index = 0,
  isLeftAligned = true,
  onSelect,
}) {
  const rawCoverMedia = getEventCoverMedia(event)
  const coverMedia = rawCoverMedia ? normalizeMediaItem(rawCoverMedia, index) : null

  const rawMedia = event?.media
  // Canonical normalized media collection, sorted by explicit order
  const sortedMedia = useMemo(() => {
    return normalizeMediaList(rawMedia || [])
  }, [rawMedia])

  const totalMedia = sortedMedia.length
  const photoCount = useMemo(() => sortedMedia.filter((m) => m.type === 'image').length, [sortedMedia])
  const videoCount = useMemo(() => sortedMedia.filter((m) => m.type === 'video').length, [sortedMedia])

  // Primary photo/media item
  const primaryMedia = coverMedia || sortedMedia[0] || null

  // Secondary photo (for 2+ photos)
  const secondaryMedia = useMemo(() => {
    if (!sortedMedia || sortedMedia.length < 2) return null
    return (
      sortedMedia.find((m) => m.id !== primaryMedia?.id && m.type === 'image') ||
      sortedMedia.find((m) => m.id !== primaryMedia?.id) ||
      sortedMedia[1] ||
      null
    )
  }, [sortedMedia, primaryMedia])

  // Tertiary photo/media (for 3+ photos)
  const tertiaryMedia = useMemo(() => {
    if (!sortedMedia || sortedMedia.length < 3) return null
    return (
      sortedMedia.find(
        (m) => m.type === 'video' && m.id !== primaryMedia?.id && m.id !== secondaryMedia?.id
      ) ||
      sortedMedia.find((m) => m.id !== primaryMedia?.id && m.id !== secondaryMedia?.id) ||
      sortedMedia[2] ||
      null
    )
  }, [sortedMedia, primaryMedia, secondaryMedia])

  const [imgError, setImgError] = React.useState(false)

  const handleCardClick = () => {
    onSelect(event.id)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(event.id)
    }
  }

  // Media summary text for the footer
  const mediaSummaryText = useMemo(() => {
    if (totalMedia === 0) return 'No Media Uploaded'
    const parts = []
    if (photoCount > 0) parts.push(`${photoCount} ${photoCount === 1 ? 'PHOTO' : 'PHOTOS'}`)
    if (videoCount > 0) parts.push(`${videoCount} ${videoCount === 1 ? 'FILM' : 'FILMS'}`)
    return parts.join(' · ')
  }, [totalMedia, photoCount, videoCount])

  return (
    <div
      className={`keepsake-card-wrapper ${isLeftAligned ? 'align-left' : 'align-right'}`}
    >
      {/* ===================================================
          KEEPSAKE SCRAPBOOK ALBUM CARD (THE MILESTONE ITSELF)
      =================================================== */}
      <article
        className="keepsake-album-card"
        data-card-anchor="true"
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${event.title}, ${event.date}. ${totalMedia} moments available.`}
      >
        {/* Subtle Ornamental Corner Motifs */}
        <span className="keepsake-card-corner tl" aria-hidden="true">❖</span>
        <span className="keepsake-card-corner tr" aria-hidden="true">❖</span>
        <span className="keepsake-card-corner bl" aria-hidden="true">❖</span>
        <span className="keepsake-card-corner br" aria-hidden="true">❖</span>

        {/* ===================================================
            3. ADAPTIVE SCRAPBOOK PHOTO COLLAGE
        =================================================== */}
        {totalMedia >= 3 ? (
          /* --- A) Three or More Photos: 3-Photo Scrapbook Collage --- */
          <div className="keepsake-album-cover-stage layout-three-photos">
            {/* Secondary Photo Frame (Right, Behind with Washi Tape) */}
            {secondaryMedia && (
              <div
                className="keepsake-frame-secondary"
                onClick={handleCardClick}
                role="button"
                tabIndex={-1}
                aria-hidden="true"
                title="Secondary keepsake photo"
              >
                <span className="keepsake-washi-tape" aria-hidden="true" />
                <div className="keepsake-secondary-inner">
                  <img
                    src={
                      secondaryMedia.type === 'video'
                        ? secondaryMedia.thumbnailUrl || secondaryMedia.url
                        : secondaryMedia.url
                    }
                    alt=""
                    className="keepsake-photo-img"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
            )}

            {/* Primary Main Photo Frame (Central Anchor with Antique-Gold Frame) */}
            <div
              className="keepsake-frame-primary"
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              aria-label={`View ${event.title} photo`}
            >
              <span className="keepsake-filigree tl" aria-hidden="true" />
              <span className="keepsake-filigree tr" aria-hidden="true" />
              <span className="keepsake-filigree bl" aria-hidden="true" />
              <span className="keepsake-filigree br" aria-hidden="true" />

              <div className="keepsake-primary-inner">
                {primaryMedia && !imgError ? (
                  <>
                    <img
                      src={
                        primaryMedia.type === 'video'
                          ? primaryMedia.thumbnailUrl || primaryMedia.url
                          : primaryMedia.url
                      }
                      alt={primaryMedia.altText || event.title}
                      className="keepsake-photo-img"
                      loading="eager"
                      decoding="async"
                      onError={() => setImgError(true)}
                    />
                    {primaryMedia.type === 'video' && (
                      <span className="keepsake-video-overlay-pill">
                        <VideoPlayIcon size={9} />
                        <span>Film</span>
                      </span>
                    )}
                  </>
                ) : (
                  <div className="keepsake-fallback-inner">
                    <span className="keepsake-fallback-gem" aria-hidden="true">❖</span>
                    <span className="keepsake-fallback-title">Keepsake Album</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tertiary Photo / Film Frame (Left, In Front with Pill Badge) */}
            {tertiaryMedia && (
              <div
                className="keepsake-frame-tertiary"
                onClick={handleCardClick}
                role="button"
                tabIndex={-1}
                aria-hidden="true"
                title="Keepsake highlight"
              >
                <div className="keepsake-tertiary-inner">
                  <img
                    src={
                      tertiaryMedia.type === 'video'
                        ? tertiaryMedia.thumbnailUrl || tertiaryMedia.url
                        : tertiaryMedia.url
                    }
                    alt=""
                    className="keepsake-photo-img"
                    loading="eager"
                    decoding="async"
                  />
                  {tertiaryMedia.type === 'video' ? (
                    <span className="keepsake-film-badge">
                      <VideoPlayIcon size={9} />
                      <span>FILM</span>
                    </span>
                  ) : (
                    <span className="keepsake-film-badge">
                      <PhotoStackIcon size={9} />
                      <span>MOMENT</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Moments Count Badge on Outer Collage (Lower-Right) */}
            <div
              className="keepsake-moments-badge"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(event.id)
              }}
              role="button"
              tabIndex={-1}
              aria-label={`View ${event.title} (${totalMedia} moments)`}
              title={`View ${event.title} (${totalMedia} moments)`}
            >
              <PhotoStackIcon size={12} />
              <span>{totalMedia} MOMENTS</span>
            </div>
          </div>
        ) : totalMedia === 2 ? (
          /* --- B) Exactly Two Photos: Balanced 2-Photo Composition --- */
          <div className="keepsake-album-cover-stage layout-two-photos">
            {/* Secondary Photo (Overlapping to the right, Washi Tape) */}
            {secondaryMedia && (
              <div
                className="keepsake-frame-secondary two-photo-secondary"
                onClick={handleCardClick}
                role="button"
                tabIndex={-1}
                aria-hidden="true"
                title="Second keepsake photo"
              >
                <span className="keepsake-washi-tape" aria-hidden="true" />
                <div className="keepsake-secondary-inner">
                  <img
                    src={
                      secondaryMedia.type === 'video'
                        ? secondaryMedia.thumbnailUrl || secondaryMedia.url
                        : secondaryMedia.url
                    }
                    alt=""
                    className="keepsake-photo-img"
                    loading="eager"
                    decoding="async"
                  />
                  {secondaryMedia.type === 'video' && (
                    <span className="keepsake-film-badge">
                      <VideoPlayIcon size={9} />
                      <span>FILM</span>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Primary Main Photo (Prominent, Left-of-Center Anchor) */}
            <div
              className="keepsake-frame-primary two-photo-main"
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              aria-label={`View ${event.title} photo`}
            >
              <span className="keepsake-filigree tl" aria-hidden="true" />
              <span className="keepsake-filigree tr" aria-hidden="true" />
              <span className="keepsake-filigree bl" aria-hidden="true" />
              <span className="keepsake-filigree br" aria-hidden="true" />

              <div className="keepsake-primary-inner">
                {primaryMedia && !imgError ? (
                  <>
                    <img
                      src={
                        primaryMedia.type === 'video'
                          ? primaryMedia.thumbnailUrl || primaryMedia.url
                          : primaryMedia.url
                      }
                      alt={primaryMedia.altText || event.title}
                      className="keepsake-photo-img"
                      loading="eager"
                      decoding="async"
                      onError={() => setImgError(true)}
                    />
                    {primaryMedia.type === 'video' && (
                      <span className="keepsake-video-overlay-pill">
                        <VideoPlayIcon size={9} />
                        <span>Film</span>
                      </span>
                    )}
                  </>
                ) : (
                  <div className="keepsake-fallback-inner">
                    <span className="keepsake-fallback-gem" aria-hidden="true">❖</span>
                    <span className="keepsake-fallback-title">Keepsake Album</span>
                  </div>
                )}
              </div>
            </div>

            {/* Moments Count Badge */}
            <div
              className="keepsake-moments-badge"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(event.id)
              }}
              role="button"
              tabIndex={-1}
              aria-label={`View ${event.title} (2 moments)`}
              title={`View ${event.title} (2 moments)`}
            >
              <PhotoStackIcon size={12} />
              <span>2 MOMENTS</span>
            </div>
          </div>
        ) : totalMedia === 1 ? (
          /* --- C) Exactly One Photo: Single Beautifully Framed Cover Photo Centered --- */
          <div className="keepsake-album-cover-stage layout-one-photo">
            <div
              className="keepsake-frame-primary one-photo-single"
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              aria-label={`View ${event.title} photo`}
            >
              <span className="keepsake-filigree tl" aria-hidden="true" />
              <span className="keepsake-filigree tr" aria-hidden="true" />
              <span className="keepsake-filigree bl" aria-hidden="true" />
              <span className="keepsake-filigree br" aria-hidden="true" />

              <div className="keepsake-primary-inner">
                {primaryMedia && !imgError ? (
                  <>
                    <img
                      src={
                        primaryMedia.type === 'video'
                          ? primaryMedia.thumbnailUrl || primaryMedia.url
                          : primaryMedia.url
                      }
                      alt={primaryMedia.altText || event.title}
                      className="keepsake-photo-img"
                      loading="eager"
                      decoding="async"
                      onError={() => setImgError(true)}
                    />
                    {primaryMedia.type === 'video' && (
                      <span className="keepsake-video-overlay-pill">
                        <VideoPlayIcon size={9} />
                        <span>Film</span>
                      </span>
                    )}
                  </>
                ) : (
                  <div className="keepsake-fallback-inner">
                    <span className="keepsake-fallback-gem" aria-hidden="true">❖</span>
                    <span className="keepsake-fallback-title">Keepsake Album</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* --- D) Zero Photos: Tasteful Theme-Matched Fallback --- */
          <div className="keepsake-album-cover-stage layout-empty">
            <div
              className="keepsake-frame-fallback"
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              aria-label={`View ${event.title} details`}
            >
              <span className="keepsake-filigree tl" aria-hidden="true" />
              <span className="keepsake-filigree tr" aria-hidden="true" />
              <span className="keepsake-filigree bl" aria-hidden="true" />
              <span className="keepsake-filigree br" aria-hidden="true" />

              <div className="keepsake-fallback-inner">
                <span className="keepsake-fallback-gem" aria-hidden="true">❖</span>
                <span className="keepsake-fallback-title">Moments to be cherished</span>
                <span className="keepsake-fallback-sub">Memories will be added soon</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================
            ZONE A — EVENT METADATA (Date & Location)
        =================================================== */}
        <div className="keepsake-zone-metadata keepsake-kicker-bar">
          <span className="keepsake-date-seal">
            <span className="seal-motif" aria-hidden="true">❖</span>
            <span className="seal-date-text">{event.date}</span>
          </span>

          {event.location && (
            <span className="keepsake-location-tag">
              <MapPinIcon size={12} />
              <span>{event.location}</span>
            </span>
          )}
        </div>

        {/* ===================================================
            ZONE B — EVENT TITLE
        =================================================== */}
        <div className="keepsake-zone-title keepsake-info-section">
          <h3 className="keepsake-event-title">{event.title}</h3>
        </div>

        {/* Subtle Ornamental Hairline Divider */}
        <div className="keepsake-zone-divider" aria-hidden="true" />

        {/* ===================================================
            ZONE C — ACTION & MEDIA SUMMARY
        =================================================== */}
        <div className="keepsake-zone-footer keepsake-cta-footer">
          <button
            type="button"
            className="keepsake-open-btn"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(event.id)
            }}
            aria-label={`View ${event.title} event`}
          >
            <span>View Event</span>
            <span className="btn-arrow" aria-hidden="true">→</span>
          </button>

          <span className="keepsake-media-summary">{mediaSummaryText}</span>
        </div>
      </article>
    </div>
  )
}
