import React, { useState, useRef, useEffect } from 'react'
import { submitGuestWish } from '../../services/wishesService'
import { AntiqueDivider } from '../journey/JourneyOrnaments'
import './BlessingsWishes.css'

/**
 * BlessingsWishes
 *
 * Independent public section allowing guests to privately write and seal
 * their prayers and heartfelt blessings for Puneeth & Chinmai.
 *
 * Privacy Rule:
 * Strictly private. No public feed, wall, or message count is exposed.
 */
export default function BlessingsWishes() {
  // UI States: 'unopened' (State A) | 'writing' (State B) | 'sealed' (State C)
  const [uiState, setUiState] = useState('unopened')

  // Form State — English is default language
  const [guestName, setGuestName] = useState('')
  const [language, setLanguage] = useState('english') // 'english' | 'kannada'
  const [message, setMessage] = useState('')

  // Realistic post-submission envelope phase: 'closed' | 'opening' | 'opened' | 'closing'
  const [envelopePhase, setEnvelopePhase] = useState('closed')
  const [submittedLanguage, setSubmittedLanguage] = useState('english')
  const openTimerRef = useRef(null)
  const closeTimerRef = useRef(null)

  // Clear timers on unmount to prevent leaks
  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const viewportRef = useRef(null)
  const nameInputRef = useRef(null)

  const handleOpenLetter = () => {
    setErrorMessage(null)
    setUiState('writing')
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true })
    }, 120)
  }

  const handleCancelWriting = () => {
    setErrorMessage(null)
    setUiState('unopened')
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleResetForAnother = () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setGuestName('')
    setMessage('')
    setErrorMessage(null)
    setEnvelopePhase('closed')
    setUiState('writing')
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true })
    }, 120)
  }

  const handleOpenEnvelope = () => {
    if (envelopePhase !== 'closed') return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setEnvelopePhase('opened')
      return
    }

    setEnvelopePhase('opening')
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = setTimeout(() => {
      setEnvelopePhase('opened')
      if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 1800)
  }

  const handleCloseLetter = () => {
    if (envelopePhase !== 'opened') return

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setEnvelopePhase('closed')
      return
    }

    setEnvelopePhase('closing')
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setEnvelopePhase('closed')
      if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 1200)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage(null)

    const trimmedName = guestName.trim()
    const trimmedMessage = message.trim()

    if (!trimmedName || trimmedName.length < 2) {
      setErrorMessage(
        language === 'kannada'
          ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ ೨ ಅಕ್ಷರಗಳು).'
          : 'Please enter your name (at least 2 characters).'
      )
      return
    }

    if (!trimmedMessage || trimmedMessage.length < 3) {
      setErrorMessage(
        language === 'kannada'
          ? 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಶುಭ ಹಾರೈಕೆಯನ್ನು ಬರೆಯಿರಿ.'
          : 'Please write your message for the couple.'
      )
      return
    }

    setIsSubmitting(true)

    try {
      await submitGuestWish({
        guestName: trimmedName,
        message: trimmedMessage,
        language,
      })

      // Record the exact language used for the blessing
      setSubmittedLanguage(language)
      setEnvelopePhase('closed')

      // Transition to sealed confirmation state
      setUiState('sealed')
      if (viewportRef.current) {
        viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } catch (err) {
      setErrorMessage(err.message || 'Unable to submit your blessing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      ref={viewportRef}
      className="wishes-viewport"
      role="region"
      aria-label="Blessings and Wishes for Puneeth and Chinmai"
    >
      {/* Ambient Parchment & Filigree Frame */}
      <div className="wishes-parchment-texture" aria-hidden="true" />
      <div className="wishes-filigree-frame" aria-hidden="true" />

      <main className={`wishes-container wishes-state-${uiState}`}>
        {/* Section Header: Compact in writing mode to guarantee generous clearance beneath navbar */}
        {uiState === 'writing' ? (
          <header className="wishes-header wishes-header--compact">
            <span className="wishes-compact-kicker">
              BLESSINGS &amp; WISHES
            </span>
          </header>
        ) : (
          <header className="wishes-header">
            <span className="wishes-kannada-kicker" lang="kn">
              ಹೊಸ ಬಾಳಿಗೆ ಹಾರೈಸಿ
            </span>
            <h1 className="wishes-main-title">
              BLESSINGS &amp; WISHES
            </h1>
            <p className="wishes-subtitle">
              “A blessing for their new beginning, woven with love and cherished forever.”
            </p>
            <AntiqueDivider />
          </header>
        )}

        {/* ===================================================
            STATE A: UNOPENED CEREMONIAL LETTER
        =================================================== */}
        {uiState === 'unopened' && (
          <div className="wishes-letter-card">
            <span className="letter-corner tl" aria-hidden="true">❖</span>
            <span className="letter-corner tr" aria-hidden="true">❖</span>
            <span className="letter-corner bl" aria-hidden="true">❖</span>
            <span className="letter-corner br" aria-hidden="true">❖</span>

            {/* Royal Wax Seal Button */}
            <div
              className="wishes-wax-seal-wrapper"
              onClick={handleOpenLetter}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleOpenLetter()
                }
              }}
              aria-label="Open ceremonial letter to write your blessing"
              title="Click to write your blessing"
            >
              <div className="wishes-wax-seal">
                <span className="wishes-seal-emblem">P&amp;C</span>
              </div>
            </div>

            <p className="wishes-letter-intro">
              Every prayer and blessing becomes a cherished thread in the tapestry of their marriage.
              Pen your personal blessing for Puneeth &amp; Chinmai as they begin their sacred journey together.
            </p>

            <button
              type="button"
              className="wishes-btn-primary"
              onClick={handleOpenLetter}
            >
              <span>Write Your Blessing</span>
              <span style={{ fontSize: '12px' }}>❧</span>
            </button>

            <span
              style={{
                fontFamily: 'Noto Serif Kannada',
                fontSize: '13px',
                color: '#8c6527',
                marginTop: '-6px',
              }}
              lang="kn"
            >
              ನಿಮ್ಮ ಹಾರೈಕೆಯನ್ನು ಪ್ರೀತಿಯಿಂದ ತಿಳಿಸಿ
            </span>
          </div>
        )}

        {/* ===================================================
            STATE B: LETTER WRITING INTERFACE
        =================================================== */}
        {uiState === 'writing' && (
          <div className="wishes-writing-desk">
            <span className="letter-corner tl" aria-hidden="true">❖</span>
            <span className="letter-corner tr" aria-hidden="true">❖</span>
            <span className="letter-corner bl" aria-hidden="true">❖</span>
            <span className="letter-corner br" aria-hidden="true">❖</span>

            {/* Topbar with Back button and private status badge */}
            <div className="wishes-desk-topbar">
              <button
                type="button"
                className="wishes-desk-back-btn"
                onClick={handleCancelWriting}
                disabled={isSubmitting}
                aria-label={language === 'kannada' ? 'ಹಿಂದಿರುಗಿ' : 'Go back'}
              >
                <span aria-hidden="true">←</span>
                <span>{language === 'kannada' ? 'ಹಿಂದೆ' : 'Back'}</span>
              </button>
              <span className="wishes-desk-badge">
                {language === 'kannada' ? 'ಖಾಸಗಿ ಹಾರೈಕೆ' : 'Private Blessing'}
              </span>
            </div>

            <div className="wishes-desk-header">
              <h2 className="wishes-desk-title">
                {language === 'kannada' ? 'ಹಾರೈಕೆ ಬರೆಯಿರಿ' : 'Pen Your Blessing'}
              </h2>
              <p className="wishes-desk-subtitle">
                {language === 'kannada'
                  ? 'ದಂಪತಿಗಳಿಗೆ ನಿಮ್ಮ ಹೃತ್ಪೂರ್ವಕ ಆಶೀರ್ವಾದವನ್ನು ತಿಳಿಸಿ'
                  : 'Your words will be sealed privately for Puneeth & Chinmai'}
              </p>
            </div>

            <form className="wishes-form" onSubmit={handleSubmit} noValidate>
              {/* Language Selector: English (Default) | Kannada */}
              <div className="wishes-form-group">
                <label className="wishes-label">
                  <span>Language / ಭಾಷೆ</span>
                </label>
                <div className="wishes-lang-pills">
                  <button
                    type="button"
                    className={`wishes-lang-pill ${language === 'english' ? 'is-active' : ''}`}
                    onClick={() => setLanguage('english')}
                    disabled={isSubmitting}
                  >
                    <span>English</span>
                  </button>
                  <button
                    type="button"
                    className={`wishes-lang-pill ${language === 'kannada' ? 'is-active' : ''}`}
                    onClick={() => setLanguage('kannada')}
                    disabled={isSubmitting}
                  >
                    <span>ಕನ್ನಡ</span>
                  </button>
                </div>
              </div>

              {/* Guest Name */}
              <div className="wishes-form-group">
                <label htmlFor="wishes-guest-name" className="wishes-label">
                  <span>{language === 'kannada' ? 'ನಿಮ್ಮ ಹೆಸರು' : 'Your Name'}</span>
                  <span className="wishes-label-hint">
                    {language === 'kannada' ? 'ಅಗತ್ಯವಿದೆ' : 'Required'}
                  </span>
                </label>
                <input
                  id="wishes-guest-name"
                  ref={nameInputRef}
                  type="text"
                  className="wishes-input"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder={
                    language === 'kannada'
                      ? 'ಉದಾ: ರಮೇಶ್ ಮತ್ತು ಶೈಲಜಾ'
                      : 'E.g., Ramesh & Shylaja'
                  }
                  maxLength={100}
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Personal Message */}
              <div className="wishes-form-group">
                <label htmlFor="wishes-message" className="wishes-label">
                  <span>{language === 'kannada' ? 'ನಿಮ್ಮ ಸಂದೇಶ' : 'Your Blessing'}</span>
                  <span className="wishes-label-hint">
                    {language === 'kannada' ? 'ಪ್ರೀತಿಯ ನುಡಿಗಳು' : 'Heartfelt words'}
                  </span>
                </label>
                <textarea
                  id="wishes-message"
                  className="wishes-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    language === 'kannada'
                      ? 'ಹೊಸ ಜೀವನಕ್ಕೆ ಶುಭವಾಗಲಿ... ಮದುವೆಯ ಈ ಸುಸಂದರ್ಭದಲ್ಲಿ ನಮ್ಮ ಹೃತ್ಪೂರ್ವಕ ಆಶೀರ್ವಾದಗಳು...'
                      : 'May your lives be blessed with unending joy, love, laughter, and lifelong companionship...'
                  }
                  maxLength={2000}
                  disabled={isSubmitting}
                  rows={5}
                  required
                />
                <div className="wishes-counter-row">
                  <span>{message.length} / 2000</span>
                </div>
              </div>

              {/* Error Message Banner */}
              {errorMessage && (
                <div className="wishes-error-banner" role="alert">
                  <span aria-hidden="true">⚠</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Actions Row */}
              <div className="wishes-actions-row">
                <button
                  type="button"
                  className="wishes-btn-secondary"
                  onClick={handleCancelWriting}
                  disabled={isSubmitting}
                >
                  {language === 'kannada' ? 'ಹಿಂದಿರುಗಿ' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  className="wishes-btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Sealing Blessing...</span>
                  ) : (
                    <>
                      <span>
                        {language === 'kannada' ? 'ಹಾರೈಕೆ ಕಳುಹಿಸಿ' : 'Seal & Send'}
                      </span>
                      <span style={{ fontSize: '13px' }}>✉</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ===================================================
            STATE C: REDESIGNED POST-SUBMISSION ENVELOPE EXPERIENCE
        =================================================== */}
        {uiState === 'sealed' && (
          <div className={`wishes-sealed-stationery is-${envelopePhase}`} role="status" aria-live="polite">
            
            {/* 1. Small Eyebrow Text: "A BLESSING, SEALED WITH LOVE" */}
            <header className="stationery-eyebrow-wrap">
              <span className="stationery-eyebrow">
                {submittedLanguage === 'kannada'
                  ? 'ಪ್ರೀತಿಯ ಮುದ್ರೆ · A BLESSING, SEALED WITH LOVE'
                  : 'A BLESSING, SEALED WITH LOVE'}
              </span>
            </header>

            {/* 2. Unified Composition Container:
                   Letter is positioned above the envelope;
                   Envelope is anchored underneath the letter;
                   Single shared stacking context prevents clipping & layer drift. */}
            <div className={`stationery-composition is-${envelopePhase}`}>

              {/* Shared SVG Definitions */}
              <svg className="envelope-svg-defs" aria-hidden="true" width="0" height="0">
                <defs>
                  {/* Warm Ivory Paper Gradient */}
                  <linearGradient id="realIvoryPaperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFFDF9" />
                    <stop offset="35%" stopColor="#FAF4E8" />
                    <stop offset="80%" stopColor="#F5E8D2" />
                    <stop offset="100%" stopColor="#ECD8BA" />
                  </linearGradient>

                  {/* Flap Front Light Falloff Gradient */}
                  <linearGradient id="realFlapFrontGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#FFFDF9" />
                    <stop offset="55%" stopColor="#FAF3E3" />
                    <stop offset="100%" stopColor="#F1E2C8" />
                  </linearGradient>

                  {/* Side Flap Shading Gradient */}
                  <linearGradient id="realSideFlapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#F8EED9" />
                    <stop offset="100%" stopColor="#F2E3C7" />
                  </linearGradient>

                  {/* Antique Pressed Gold Foil Gradient */}
                  <linearGradient id="realGoldFoilGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C59B4B" />
                    <stop offset="25%" stopColor="#F4E2AB" />
                    <stop offset="50%" stopColor="#B88628" />
                    <stop offset="75%" stopColor="#FBE9BD" />
                    <stop offset="100%" stopColor="#C59B4B" />
                  </linearGradient>

                  {/* Royal Gold Floral Lattice Lining Pattern */}
                  <pattern id="royalLiningPattern" width="36" height="36" patternUnits="userSpaceOnUse">
                    <rect width="36" height="36" fill="#F4E8CF" />
                    <path d="M0 18 L18 0 L36 18 L18 36 Z" fill="none" stroke="#D4AF37" strokeWidth="0.8" opacity="0.65" />
                    <path d="M18 18 L0 0 M18 18 L36 0 M18 18 L0 36 M18 18 L36 36" fill="none" stroke="#C59B4B" strokeWidth="0.5" opacity="0.45" />
                    <circle cx="18" cy="18" r="3.2" fill="#B88628" opacity="0.85" />
                    <circle cx="18" cy="18" r="1.6" fill="#FAF4E8" />
                    <circle cx="0" cy="18" r="1.5" fill="#B88628" opacity="0.6" />
                    <circle cx="36" cy="18" r="1.5" fill="#B88628" opacity="0.6" />
                    <circle cx="18" cy="0" r="1.5" fill="#B88628" opacity="0.6" />
                    <circle cx="18" cy="36" r="1.5" fill="#B88628" opacity="0.6" />
                  </pattern>
                </defs>
              </svg>

              {/* Contact Ground Shadow */}
              <div className="envelope-ground-shadow" aria-hidden="true" />

              {/* Layer 1: Envelope Back Panel (Behind all elements, z-index: 1) */}
              <div className="envelope-layer-back" aria-hidden="true">
                <svg viewBox="0 0 420 230" className="envelope-svg-canvas" preserveAspectRatio="none">
                  <rect x="0" y="0" width="420" height="230" rx="8" fill="url(#realIvoryPaperGrad)" stroke="#C4964C" strokeWidth="1" />
                  {/* Interior Luxury Gold Lattice Lining */}
                  <rect x="8" y="8" width="404" height="214" rx="6" fill="url(#royalLiningPattern)" stroke="#B88628" strokeWidth="0.8" opacity="0.92" />
                </svg>
              </div>

              {/* Layer 2: Top Flap with 3D Hinge & Wax Seal
                  - Closed: folded down in front (z-index: 25)
                  - Opened: rotated 180° backward behind the letter (z-index: 2) */}
              <div
                className={`envelope-layer-topflap is-${envelopePhase}`}
                onClick={envelopePhase === 'closed' ? handleOpenEnvelope : undefined}
                role={envelopePhase === 'closed' ? 'button' : undefined}
                tabIndex={envelopePhase === 'closed' ? 0 : undefined}
                onKeyDown={
                  envelopePhase === 'closed'
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleOpenEnvelope()
                        }
                      }
                    : undefined
                }
                aria-label={
                  envelopePhase === 'closed'
                    ? (submittedLanguage === 'kannada'
                        ? 'ಪುನೀತ್ ಮತ್ತು ಚಿನ್ಮಯಿ ಅವರ ಕೃತಜ್ಞತೆಯ ಪತ್ರ ತೆರೆಯಲು ಒತ್ತಿರಿ'
                        : 'Click to open note from Puneeth and Chinmai')
                    : undefined
                }
              >
                {/* Front Face: Ivory paper with gold foil trim & dimensional wax seal */}
                <div className="topflap-face topflap-face-front">
                  <svg viewBox="0 0 420 138" className="envelope-svg-canvas" preserveAspectRatio="none">
                    <polygon points="0,0 210,132 420,0" fill="url(#realFlapFrontGrad)" />
                    <polyline points="0,0 210,132 420,0" fill="none" stroke="url(#realGoldFoilGrad)" strokeWidth="1.6" />
                    <polyline points="10,3 210,124 410,3" fill="none" stroke="#E0C078" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.65" />
                  </svg>

                  {/* Dimensional Maroon Wax Seal affixed to flap tip */}
                  <div className="topflap-wax-seal" aria-hidden="true">
                    <div className="wax-seal-body">
                      <div className="wax-seal-rim">
                        <span className="wax-seal-text">P&amp;C</span>
                      </div>
                    </div>
                    <div className="wax-seal-gleam" />
                  </div>
                </div>

                {/* Back Face: revealed when rotated 180° backward */}
                <div className="topflap-face topflap-face-back">
                  <svg viewBox="0 0 420 138" className="envelope-svg-canvas" preserveAspectRatio="none">
                    <polygon points="0,0 210,132 420,0" fill="url(#royalLiningPattern)" />
                    <polyline points="0,0 210,132 420,0" fill="none" stroke="url(#realGoldFoilGrad)" strokeWidth="1.6" />
                  </svg>
                </div>
              </div>

              {/* Layer 3: The Dedicated Thank-You Letter
                  - z-index: 15 (Between envelope back z-index 1 and envelope front pocket z-index 20)
                  - Emerges smoothly upward out of the envelope pocket
                  - Rests ABOVE the envelope in reading state */}
              <article
                className={`stationery-letter-sheet is-${envelopePhase}`}
                role="region"
                aria-label={
                  submittedLanguage === 'kannada'
                    ? 'ಪುನೀತ್ ಮತ್ತು ಚಿನ್ಮಯಿ ಅವರ ಕೃತಜ್ಞತೆಯ ಪತ್ರ'
                    : 'Thank you letter from Puneeth and Chinmai'
                }
              >
                <span className="letter-corner tl" aria-hidden="true">❖</span>
                <span className="letter-corner tr" aria-hidden="true">❖</span>
                <span className="letter-corner bl" aria-hidden="true">❖</span>
                <span className="letter-corner br" aria-hidden="true">❖</span>

                <header className="stationery-letter-header">
                  <span className="stationery-letter-kicker">
                    {submittedLanguage === 'kannada' ? 'ಕೃತಜ್ಞತೆಯ ನುಡಿಗಳು' : 'A NOTE OF GRATITUDE'}
                  </span>
                  <h3 className="stationery-letter-title">
                    {submittedLanguage === 'kannada' ? 'ಪ್ರೀತಿ ಮತ್ತು ಕೃತಜ್ಞತೆಯೊಂದಿಗೆ' : 'With Love & Gratitude'}
                  </h3>
                  <AntiqueDivider />
                </header>

                <div className="stationery-letter-content">
                  {submittedLanguage === 'kannada' ? (
                    <p className="stationery-letter-text stationery-letter-text--kannada" lang="kn">
                      ನಮ್ಮ ಜೀವನದ ಈ ಸುಂದರ ಹೊಸ ಅಧ್ಯಾಯದ ಆರಂಭದಲ್ಲಿ ನಿಮ್ಮ ಪ್ರೀತಿ, ಹಾರೈಕೆ ಮತ್ತು ಆಶೀರ್ವಾದಗಳನ್ನು ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕಾಗಿ ಹೃತ್ಪೂರ್ವಕ ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಶುಭ ಹಾರೈಕೆಗಳು ನಮಗೆ ಅಪಾರ ಸಂತೋಷವನ್ನು ನೀಡುತ್ತವೆ. ಪ್ರೀತಿ ಮತ್ತು ಕೃತಜ್ಞತೆಯೊಂದಿಗೆ, ಪುನೀತ್ ಮತ್ತು ಚಿನ್ಮಯಿ.
                    </p>
                  ) : (
                    <p className="stationery-letter-text stationery-letter-text--english">
                      Your blessings mean more to us than words can express. Thank you for taking a moment to share your love and good wishes as we begin this beautiful new chapter of our lives. With love and gratitude, Puneeth &amp; Chinmai.
                    </p>
                  )}
                </div>

                <footer className="stationery-letter-footer">
                  <AntiqueDivider />

                  <div className="stationery-signoff">
                    <span className="stationery-couple-names">
                      {submittedLanguage === 'kannada' ? 'ಪುನೀತ್ ಮತ್ತು ಚಿನ್ಮಯಿ' : 'Puneeth & Chinmai'}
                    </span>
                    <span className="stationery-wedding-date">
                      28–29 November 2026 · Chikkamagaluru
                    </span>
                  </div>

                  <div className="stationery-letter-actions">
                    <button
                      type="button"
                      className="wishes-btn-secondary"
                      onClick={handleCloseLetter}
                    >
                      <span aria-hidden="true">←</span>
                      <span>{submittedLanguage === 'kannada' ? 'ಪತ್ರ ಮಡಚಿ' : 'Close Letter'}</span>
                    </button>

                    <button
                      type="button"
                      className="wishes-btn-primary"
                      onClick={handleResetForAnother}
                    >
                      <span>{submittedLanguage === 'kannada' ? 'ಮತ್ತೊಂದು ಹಾರೈಕೆ ಬರೆಯಿರಿ' : 'Write Another Blessing'}</span>
                    </button>
                  </div>
                </footer>
              </article>

              {/* Layer 4: Envelope Front Pocket (Left, Right, Bottom triangular folds)
                  - z-index: 20 (Overlaps the bottom edge of the letter sheet as it rises!) */}
              <div
                className={`envelope-layer-pocket is-${envelopePhase}`}
                onClick={envelopePhase === 'closed' ? handleOpenEnvelope : undefined}
                role={envelopePhase === 'closed' ? 'button' : undefined}
                tabIndex={envelopePhase === 'closed' ? 0 : undefined}
                aria-hidden={envelopePhase !== 'closed'}
              >
                <svg viewBox="0 0 420 230" className="envelope-svg-canvas" preserveAspectRatio="none">
                  {/* Left Flap */}
                  <polygon points="0,0 185,115 0,230" fill="url(#realSideFlapGrad)" opacity="0.95" />
                  <line x1="0" y1="0" x2="185" y2="115" stroke="#DFB66D" strokeWidth="0.75" opacity="0.6" />

                  {/* Right Flap */}
                  <polygon points="420,0 235,115 420,230" fill="url(#realSideFlapGrad)" opacity="0.95" />
                  <line x1="420" y1="0" x2="235" y2="115" stroke="#DFB66D" strokeWidth="0.75" opacity="0.6" />

                  {/* Bottom Flap with pressed gold foil trim */}
                  <polygon points="0,230 210,108 420,230" fill="url(#realIvoryPaperGrad)" />
                  <polyline points="0,230 210,108 420,230" fill="none" stroke="url(#realGoldFoilGrad)" strokeWidth="1.4" />
                  <polyline points="14,228 210,114 406,228" fill="none" stroke="#E0C078" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.6" />
                </svg>
              </div>

            </div> {/* stationery-composition */}

            {/* 3 & 4. Closed State Meta: Short Instruction & Compact Confirmation Badge
                (Only displayed in closed state) */}
            {envelopePhase === 'closed' && (
              <div className="stationery-closed-meta">
                <p className="stationery-instruction">
                  {submittedLanguage === 'kannada'
                    ? 'ಪುನೀತ್ ಮತ್ತು ಚಿನ್ಮಯಿ ಅವರ ಕೃತಜ್ಞತೆಯ ಪತ್ರ ನಿಮ್ಮನ್ನು ಕಾಯುತ್ತಿದೆ.'
                    : 'A little note from Puneeth & Chinmai awaits you.'}
                </p>

                <div
                  className="stationery-tap-pill"
                  onClick={handleOpenEnvelope}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOpenEnvelope()
                    }
                  }}
                  aria-label="Tap envelope to open"
                >
                  <span className="tap-pill-icon" aria-hidden="true">✉</span>
                  <span>{submittedLanguage === 'kannada' ? 'ತೆರೆಯಲು ಒತ್ತಿರಿ' : 'Tap envelope to open'}</span>
                  <span className="tap-pill-arrow" aria-hidden="true">✦</span>
                </div>

                {/* Compact confirmation badge */}
                <div className="stationery-sealed-badge">
                  <span className="sealed-badge-check" aria-hidden="true">✓</span>
                  <span>
                    {submittedLanguage === 'kannada'
                      ? 'ನಿಮ್ಮ ಆಶೀರ್ವಾದವನ್ನು ಪ್ರೀತಿಯಿಂದ ಮುದ್ರಿಸಲಾಗಿದೆ.'
                      : 'Your blessing has been sealed.'}
                  </span>
                </div>

                {/* Secondary Option: Write another blessing */}
                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    className="wishes-btn-secondary"
                    style={{ fontSize: '11px', padding: '6px 16px' }}
                    onClick={handleResetForAnother}
                  >
                    <span>{submittedLanguage === 'kannada' ? 'ಮತ್ತೊಂದು ಹಾರೈಕೆ ಬರೆಯಿರಿ' : 'Write Another Blessing'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
