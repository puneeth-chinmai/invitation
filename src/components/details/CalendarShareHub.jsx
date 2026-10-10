import { useState, useCallback, useRef, useEffect } from 'react'
import {
  WEDDING_EVENTS,
  getGoogleCalendarUrl,
  getAppleCalendarDataUri,
} from '../../utils/calendarUtils'
import {
  CalendarLineIcon,
  ShareLineIcon,
  WhatsAppLineIcon,
  CopyLineIcon,
  CheckLineIcon,
  ExternalArrowLineIcon,
  DelicateDivider,
} from './DetailsIcons'

/**
 * CalendarShareHub
 *
 * Streamlined calendar and sharing suite:
 *   1. Add to Calendar (Google Calendar & Apple Calendar with event selector; NO manual file downloads)
 *   2. Share Invitation (Web Share API with WhatsApp and Copy Link fallbacks)
 *   3. Zero emojis; monochrome line icons only.
 */
export default function CalendarShareHub() {
  const [calendarChooserOpen, setCalendarChooserOpen] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const copyTimerRef = useRef(null)

  // Clean canonical site URL
  const getCanonicalUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return window.location.origin + window.location.pathname
  }, [])

  // Close modals on Escape key
  useEffect(() => {
    if (!shareModalOpen && !calendarChooserOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShareModalOpen(false)
        setCalendarChooserOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shareModalOpen, calendarChooserOpen])

  // Handle Apple Calendar click
  const handleAppleCalendarClick = (event) => {
    // Generates calendar data URI that directly opens native Calendar prompt on iOS / macOS
    const uri = getAppleCalendarDataUri(event)
    const link = document.createElement('a')
    link.href = uri
    link.setAttribute('download', `${event.id}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Share Invitation
  const handleShareClick = async () => {
    const url = getCanonicalUrl()
    const shareData = {
      title: 'Puneeth & Chinmai — Wedding Invitation',
      text: 'You are cordially invited to celebrate the wedding of Puneeth & Chinmai on 28th & 29th November 2026 at Gayathri Devi Kalyana Mantapa, Chikkamagaluru.',
      url: url,
    }

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch (err) {
        if (err.name === 'AbortError') {
          return // User dismissed native share sheet
        }
        setShareModalOpen(true)
      }
    } else {
      setShareModalOpen(true)
    }
  }

  // Handle Copy Link
  const handleCopyLink = async () => {
    const url = getCanonicalUrl()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url)
        setCopySuccess(true)
        if (copyTimerRef.current) clearTimeout(copyTimerRef.current)
        copyTimerRef.current = setTimeout(() => setCopySuccess(false), 2500)
      } catch {
        setCopySuccess(false)
      }
    }
  }

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    'You are cordially invited to celebrate the wedding of Puneeth & Chinmai on 28th & 29th November 2026 at Gayathri Devi Kalyana Mantapa, Chikkamagaluru.\n\n' +
    getCanonicalUrl()
  )}`

  return (
    <section className="calendar-share-section" aria-label="Add to Calendar and Share Invitation">
      {/* =========================================
          1. ELEGANT WEDDING DATE KEEPSAKE
      ========================================= */}
      <div className="calendar-card-container">
        <div className="section-title-block">
          <span className="section-eyebrow">SAVE THE DATE</span>
          <h3 className="section-heading">Two Days. One Beautiful Beginning.</h3>
          <DelicateDivider />
          <p className="calendar-intro-subnote">
            Save our wedding celebrations to your personal calendar.
          </p>
        </div>

        {/* Both Events Presented Once as Refined Date Cards */}
        <div className="calendar-events-display">
          {/* Event 1: Reception */}
          <div className="calendar-event-keystrip">
            <div className="calendar-event-datebox">
              <span className="cal-datebox-month">NOV</span>
              <span className="cal-datebox-day">28</span>
              <span className="cal-datebox-dayname">SAT</span>
            </div>
            <div className="calendar-event-meta">
              <div className="cal-meta-header">
                <span className="cal-meta-title">Reception</span>
              </div>
              <span className="cal-meta-date">Saturday, 28 November 2026</span>
              <span className="cal-meta-time">7:30 PM onwards</span>
            </div>
          </div>

          {/* Event 2: Muhurtam */}
          <div className="calendar-event-keystrip">
            <div className="calendar-event-datebox auspicious">
              <span className="cal-datebox-month">NOV</span>
              <span className="cal-datebox-day">29</span>
              <span className="cal-datebox-dayname">SUN</span>
            </div>
            <div className="calendar-event-meta">
              <div className="cal-meta-header">
                <span className="cal-meta-title">Muhurtam</span>
              </div>
              <span className="cal-meta-date">Sunday, 29 November 2026</span>
              <span className="cal-meta-time">8:00 AM – 9:30 AM</span>
            </div>
          </div>
        </div>

        {/* One Primary Calendar Action Button */}
        <div className="calendar-action-center">
          <button
            type="button"
            className="calendar-primary-trigger-btn"
            onClick={() => setCalendarChooserOpen(true)}
            aria-expanded={calendarChooserOpen}
            aria-haspopup="dialog"
            aria-label="Add Wedding Events to Calendar"
          >
            <CalendarLineIcon size={16} color="#FFF8E7" />
            <span>Add to Calendar</span>
          </button>
        </div>
      </div>

      {/* =========================================
          CALENDAR CHOOSER DIALOG (POPUP)
      ========================================= */}
      {calendarChooserOpen && (
        <div
          className="calendar-chooser-backdrop"
          onClick={() => setCalendarChooserOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Choose Calendar to Add"
        >
          <div
            className="calendar-chooser-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div className="chooser-header-titles">
                <span className="chooser-eyebrow">SAVE TO CALENDAR</span>
                <h4 className="modal-title">Select Event</h4>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setCalendarChooserOpen(false)}
                aria-label="Close calendar options"
              >
                ✕
              </button>
            </div>

            <p className="modal-lead-text">
              Choose an event to add to your Google Calendar or Apple Calendar:
            </p>

            <div className="chooser-event-options">
              {/* Event 1: Muhurtam */}
              <div className="chooser-event-group">
                <div className="chooser-group-header">
                  <span className="chooser-group-name">Muhurtam</span>
                  <span className="chooser-group-time">Sun, 29 Nov · 8:00 AM – 9:30 AM</span>
                </div>
                <div className="chooser-buttons-row">
                  <a
                    href={getGoogleCalendarUrl(WEDDING_EVENTS.muhurtam)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chooser-service-btn google"
                    onClick={() => setCalendarChooserOpen(false)}
                    aria-label="Add Muhurtam to Google Calendar (opens in new tab)"
                  >
                    <span>Google Calendar</span>
                    <ExternalArrowLineIcon size={12} color="#FFF8E7" />
                  </a>
                  <button
                    type="button"
                    className="chooser-service-btn apple"
                    onClick={() => {
                      handleAppleCalendarClick(WEDDING_EVENTS.muhurtam)
                      setCalendarChooserOpen(false)
                    }}
                    aria-label="Add Muhurtam to Apple Calendar"
                  >
                    <span>Apple Calendar</span>
                  </button>
                </div>
              </div>

              {/* Event 2: Reception */}
              <div className="chooser-event-group">
                <div className="chooser-group-header">
                  <span className="chooser-group-name">Reception</span>
                  <span className="chooser-group-time">Sat, 28 Nov · 7:30 PM onwards</span>
                </div>
                <div className="chooser-buttons-row">
                  <a
                    href={getGoogleCalendarUrl(WEDDING_EVENTS.reception)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="chooser-service-btn google"
                    onClick={() => setCalendarChooserOpen(false)}
                    aria-label="Add Reception to Google Calendar (opens in new tab)"
                  >
                    <span>Google Calendar</span>
                    <ExternalArrowLineIcon size={12} color="#FFF8E7" />
                  </a>
                  <button
                    type="button"
                    className="chooser-service-btn apple"
                    onClick={() => {
                      handleAppleCalendarClick(WEDDING_EVENTS.reception)
                      setCalendarChooserOpen(false)
                    }}
                    aria-label="Add Reception to Apple Calendar"
                  >
                    <span>Apple Calendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================
          2. SHARE INVITATION SECTION
      ========================================= */}
      <div className="share-section-container">
        <button
          type="button"
          className="share-main-action-btn"
          onClick={handleShareClick}
          aria-label="Share Wedding Invitation"
        >
          <ShareLineIcon size={16} color="#6d1620" />
          <span>Share Invitation</span>
        </button>
      </div>

      {/* =========================================
          SHARE MODAL (DESKTOP / FALLBACK)
      ========================================= */}
      {shareModalOpen && (
        <div
          className="share-modal-backdrop"
          onClick={() => setShareModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Share Wedding Invitation"
        >
          <div
            className="share-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h4 className="modal-title">Share Invitation</h4>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShareModalOpen(false)}
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <p className="modal-lead-text">
              Invite your cherished family and friends to celebrate the wedding of Puneeth &amp; Chinmai.
            </p>

            <div className="modal-actions-list">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-share-item whatsapp"
                onClick={() => setShareModalOpen(false)}
              >
                <WhatsAppLineIcon size={18} color="#6d1620" />
                <div className="modal-item-info">
                  <span className="modal-item-title">Share via WhatsApp</span>
                  <span className="modal-item-subtitle">Send invitation link</span>
                </div>
                <ExternalArrowLineIcon size={13} color="#8c5d1e" />
              </a>

              <button
                type="button"
                className="modal-share-item copy-link"
                onClick={handleCopyLink}
              >
                <CopyLineIcon size={18} color="#6d1620" />
                <div className="modal-item-info">
                  <span className="modal-item-title">Copy Invitation Link</span>
                  <span className="modal-item-subtitle">Copy URL to clipboard</span>
                </div>
              </button>
            </div>

            {copySuccess && (
              <div className="modal-feedback-pill" role="status">
                <CheckLineIcon size={14} color="#6d1620" />
                <span>Invitation link copied.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
