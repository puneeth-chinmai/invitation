import React from 'react'
import ganeshaSymbolUrl from '../../assets/images/ganesha_symbol.png'
import WeddingCountdown from './WeddingCountdown'
import WeddingEvents from './WeddingEvents'
import VenueSection from './VenueSection'
import CalendarShareHub from './CalendarShareHub'
import { DelicateDivider } from './DetailsIcons'
import './WeddingAwaits.css'

/**
 * WeddingAwaits
 *
 * Divine, minimal, and aesthetic Kannada wedding details section:
 *   - Authentic Kannada opening line: "ಶುಭ ವಿವಾಹ" with Noto Serif Kannada
 *   - Completely redesigned, bespoke royal countdown
 *   - Editorial event cards for Reception and Muhurtam
 *   - Understated venue guide with map preview and Google Maps directions
 *   - Streamlined Add to Calendar (Google Calendar & Apple Calendar)
 *   - Share Invitation suite (Web Share, WhatsApp, Copy Link)
 *   - Zero emojis; delicate monochrome SVG linework and antique-gold dividers
 */
export default function WeddingAwaits() {
  return (
    <div className="wedding-details-viewport">
      {/* Viewport Filigree Frame */}
      <div className="details-filigree-frame" />
      <div className="details-corner-motif tl">❖</div>
      <div className="details-corner-motif tr">❖</div>
      <div className="details-corner-motif bl">❖</div>
      <div className="details-corner-motif br">❖</div>

      {/* Ambient Warm Light Pool */}
      <div className="details-light-glow" />

      {/* Main Scrollable Content Container */}
      <div className="wedding-details-content-container">
        {/* =========================================
            1. SECTION INTRODUCTION
        ========================================= */}
        <header className="details-intro-header">
          <div className="details-ganesha-block">
            <img
              src={ganeshaSymbolUrl}
              alt="Lord Ganesha Emblem"
              className="details-ganesha-emblem"
            />
            {/* Authentic Kannada opening line: ಶುಭ ವಿವಾಹ */}
            <span className="details-kannada-blessing" lang="kn">
              ಶುಭ ವಿವಾಹ
            </span>
          </div>

          <h2 className="details-main-title">THE WEDDING AWAITS</h2>
          <DelicateDivider />

          <div className="details-couple-names">
            <h1 className="couple-name">PUNEETH</h1>
            <span className="couple-ampersand">&amp;</span>
            <h1 className="couple-name">CHINMAI</h1>
          </div>

          <p className="details-intro-blessing">
            With hearts full of gratitude, we look forward to celebrating our special day with your warm presence and blessings.
          </p>
        </header>

        {/* =========================================
            2. BESPOKE ROYAL WEDDING COUNTDOWN
        ========================================= */}
        <WeddingCountdown />

        {/* =========================================
            3. EDITORIAL RECEPTION & MUHURTAM CARDS
        ========================================= */}
        <WeddingEvents />

        {/* =========================================
            4. VENUE INFORMATION & DIRECTIONS
        ========================================= */}
        <VenueSection />

        {/* =========================================
            5. CALENDAR & SHARING ACTIONS HUB
        ========================================= */}
        <CalendarShareHub />

        {/* =========================================
            6. REFINED FOOTER SEAL
        ========================================= */}
        <footer className="details-page-footer">
          <DelicateDivider />
          <p className="footer-blessing-text">
            Chikkamagaluru, Karnataka · 28 &amp; 29 November 2026
          </p>
        </footer>
      </div>
    </div>
  )
}
