import { useState, useCallback, useRef } from 'react'
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
  const [selectedEventKey, setSelectedEventKey] = useState('muhurtam') // 'reception' | 'muhurtam'
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const copyTimerRef = useRef(null)

  const selectedEvent = WEDDING_EVENTS[selectedEventKey]

  // Clean canonical site URL
  const getCanonicalUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''
    return window.location.origin + window.location.pathname
  }, [])

  // Handle Apple Calendar click
  const handleAppleCalendarClick = (e) => {
    // Generates calendar data URI that directly opens the native event sheet on iOS / macOS
    const uri = getAppleCalendarDataUri(selectedEvent)
    const link = document.createElement('a')
    link.href = uri
    link.setAttribute('download', `${selectedEvent.id}.ics`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle Share Invitation
  const handleShareClick = async () => {
    const url = getCanonicalUrl()
    const shareData = {
      title: 'Puneeth & Chinmai — Wedding Invitation',
      text: 'You are cordially invited to celebrate the wedding of Puneeth & Chinmai on 28th & 29th November 2026 at Gayatri Kalyana Mantapa, Chikkamagaluru.',
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
    'You are cordially invited to celebrate the wedding of Puneeth & Chinmai on 28th & 29th November 2026 at Gayatri Kalyana Mantapa, Chikkamagaluru.\n\n' +
      getCanonicalUrl()
  )}`

  return (
    <section className="calendar-share-section" aria-label="Add to Calendar and Share Invitation">
      {/* =========================================
          1. ADD TO CALENDAR SECTION
      ========================================= */}
      <div className="calendar-card-container">
        <div className="section-title-block">
          <span className="section-eyebrow">SAVE THE DATE</span>
          <h3 className="section-heading">Add to Calendar</h3>
          <DelicateDivider />
        </div>

        {/* Event Selector Toggle Pills */}
        <div className="event-picker-tabs" role="tablist" aria-label="Select Wedding Event">
          <button
            type="button"
            role="tab"
            aria-selected={selectedEventKey === 'reception'}
            className={`event-picker-tab ${selectedEventKey === 'reception' ? 'active' : ''}`}
            onClick={() => setSelectedEventKey('reception')}
          >
            <span className="picker-tab-name">Reception</span>
            <span className="picker-tab-time">28 Nov · 7:00 PM</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedEventKey === 'muhurtam'}
            className={`event-picker-tab ${selectedEventKey === 'muhurtam' ? 'active' : ''}`}
            onClick={() => setSelectedEventKey('muhurtam')}
          >
            <span className="picker-tab-name">Muhurtam</span>
            <span className="picker-tab-time">29 Nov · 9:00 AM</span>
          </button>
        </div>

        {/* Calendar Action Buttons */}
        <div className="calendar-actions-grid">
          {/* Google Calendar */}
          <a
            href={getGoogleCalendarUrl(selectedEvent)}
            target="_blank"
            rel="noopener noreferrer"
            className="calendar-btn google"
            aria-label={`Add ${selectedEvent.name} to Google Calendar (opens in new tab)`}
          >
            <CalendarLineIcon size={15} color="#FFF8E7" />
            <span>Google Calendar</span>
            <ExternalArrowLineIcon size={12} color="#f7d286" />
          </a>

          {/* Apple Calendar / iOS */}
          <button
            type="button"
            className="calendar-btn apple"
            onClick={handleAppleCalendarClick}
            aria-label={`Add ${selectedEvent.name} to Apple Calendar`}
          >
            <CalendarLineIcon size={15} color="#6d1620" />
            <span>Apple Calendar</span>
          </button>
        </div>

        <p className="calendar-note-text">
          Adds {selectedEvent.name} ({selectedEvent.displayDate} at {selectedEvent.displayTime}) to your personal calendar.
        </p>
      </div>

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
