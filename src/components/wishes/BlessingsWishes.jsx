import React, { useState, useRef } from 'react'
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
    setGuestName('')
    setMessage('')
    setErrorMessage(null)
    setUiState('writing')
    if (viewportRef.current) {
      viewportRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setTimeout(() => {
      nameInputRef.current?.focus({ preventScroll: true })
    }, 120)
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
                fontFamily: 'Noto Sans Kannada',
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
            STATE C: SEALED CONFIRMATION
        =================================================== */}
        {uiState === 'sealed' && (
          <div className="wishes-sealed-card" role="status" aria-live="polite">
            <span className="letter-corner tl" aria-hidden="true">❖</span>
            <span className="letter-corner tr" aria-hidden="true">❖</span>
            <span className="letter-corner bl" aria-hidden="true">❖</span>
            <span className="letter-corner br" aria-hidden="true">❖</span>

            {/* Stamped Wax Seal */}
            <div className="wishes-wax-seal">
              <span className="wishes-seal-emblem">✓</span>
            </div>

            <span className="wishes-sealed-badge">
              Sealed with Warmth
            </span>

            <h2 className="wishes-sealed-heading">
              ಧನ್ಯವಾದಗಳು · Thank You
            </h2>

            <p className="wishes-sealed-message">
              Your heartfelt prayers and warm wishes have been sealed privately for Puneeth &amp; Chinmai.
            </p>

            <p className="wishes-kannada-quote" lang="kn">
              “ಆಶೀರ್ವಾದವೇ ಅತ್ಯಂತ ಶ್ರೇಷ್ಠ ಉಡುಗೊರೆ”
            </p>

            <AntiqueDivider />

            <button
              type="button"
              className="wishes-btn-secondary"
              onClick={handleResetForAnother}
            >
              <span>Write Another Blessing</span>
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
