import { useState, useEffect } from 'react'
import { DelicateDivider } from './DetailsIcons'

/**
 * WeddingCountdown
 *
 * Bespoke royal wedding countdown to the sacred Muhurtam ceremony:
 * Target: 29 November 2026 at 9:00 AM IST (Asia/Kolkata, UTC+05:30).
 *
 * Features:
 *   - Elegant deep-maroon serif typography
 *   - High-contrast serif numerals floating with delicate antique-gold hairline separators
 *   - No emojis or dashboard-style boxes
 *   - Isolated 1-second update cycle preventing full-page re-renders
 */

// Target timestamp: 29 Nov 2026, 09:00:00 AM IST (UTC+05:30)
const MUHURTAM_TIMESTAMP = new Date('2026-11-29T09:00:00+05:30').getTime()

function calculateTimeLeft() {
  const now = Date.now()
  const difference = MUHURTAM_TIMESTAMP - now

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: true,
    }
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    isCompleted: false,
  }
}

export default function WeddingCountdown() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatUnit = (num) => String(num).padStart(2, '0')

  return (
    <section className="wedding-countdown-section" aria-label="Wedding Countdown">
      <div className="countdown-header-block">
        <span className="countdown-eyebrow">COUNTDOWN TO MUHURTAM</span>
        <h3 className="countdown-main-heading">Until Our Forever Begins</h3>
        <p className="countdown-couple-names">Puneeth &amp; Chinmai</p>
      </div>

      <DelicateDivider className="countdown-divider" />

      {timeLeft.isCompleted ? (
        <div className="countdown-completed-state">
          <h4 className="completed-title">The Sacred Muhurtam Has Begun</h4>
          <p className="completed-subtext">Celebrating the holy union of Puneeth &amp; Chinmai</p>
        </div>
      ) : (
        <div className="countdown-unified-display" role="timer" aria-live="off">
          {/* Days */}
          <div className="countdown-unit-column">
            <span className="countdown-serif-numeral">{formatUnit(timeLeft.days)}</span>
            <span className="countdown-unit-label">DAYS</span>
          </div>

          <div className="countdown-unit-divider" aria-hidden="true" />

          {/* Hours */}
          <div className="countdown-unit-column">
            <span className="countdown-serif-numeral">{formatUnit(timeLeft.hours)}</span>
            <span className="countdown-unit-label">HOURS</span>
          </div>

          <div className="countdown-unit-divider" aria-hidden="true" />

          {/* Minutes */}
          <div className="countdown-unit-column">
            <span className="countdown-serif-numeral">{formatUnit(timeLeft.minutes)}</span>
            <span className="countdown-unit-label">MINUTES</span>
          </div>

          <div className="countdown-unit-divider" aria-hidden="true" />

          {/* Seconds */}
          <div className="countdown-unit-column">
            <span className="countdown-serif-numeral">{formatUnit(timeLeft.seconds)}</span>
            <span className="countdown-unit-label">SECONDS</span>
          </div>
        </div>
      )}

      <div className="countdown-target-footer">
        <span className="target-schedule-text">
          Auspicious Muhurtam · Sunday, 29 November 2026 · 9:00 AM IST
        </span>
      </div>
    </section>
  )
}
