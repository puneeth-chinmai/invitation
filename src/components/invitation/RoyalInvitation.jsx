import { useState, useRef, useEffect, useCallback } from 'react'
import ganeshaSymbolUrl from '../../assets/images/ganesha_symbol.png'
import {
  ScrollFinial,
  OrnamentalBand,
  RollerCenterFiligree,
  EmbossedRoyalSeal,
  LotusCornerFiligree,
} from './ScrollCraftsmanship'
import './RoyalInvitation.css'

/**
 * RoyalInvitation
 *
 * An independent, self-contained royal wedding invitation component.
 * Features:
 *   - Ancient royal parchment with organic deckled edges and natural tonal aging.
 *   - Heavy cylindrical lacquered rosewood & antique-brass scroll rollers.
 *   - Hanging royal pull tag that dynamically lengthens during drag without clipping or detaching.
 *   - Smooth 2.0s physical vertical unrolling animation with progressive content reveal.
 *   - Real selectable HTML text with exact wedding dates, reception, muhurtam, and venue.
 *   - Mobile-first responsive layout with smooth vertical scrolling.
 */
export default function RoyalInvitation({ onComplete }) {
  // Scroll states: 'closed' | 'opening' | 'opened'
  const [scrollState, setScrollState] = useState('closed')
  const [unrollProgress, setUnrollProgress] = useState(0) // 0 to 1

  // Pull interaction state
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [tagDetached, setTagDetached] = useState(false)

  const dragStartYRef = useRef(0)
  const currentDragYRef = useRef(0)
  const isTriggeredRef = useRef(false)
  const animFrameRef = useRef(null)

  // Trigger opening sequence
  const triggerUnroll = useCallback(() => {
    if (isTriggeredRef.current || scrollState !== 'closed') return
    isTriggeredRef.current = true

    // 1. Subtle haptic vibration where supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40)
      } catch {
        // Silent fallback
      }
    }

    // 2. Tag detaches with gentle drop & fade
    setTagDetached(true)

    // 3. Begin physical vertical unrolling
    setTimeout(() => {
      setScrollState('opening')
      const startTime = performance.now()
      const duration = 2000 // 2.0 seconds physical unrolling

      const animate = (now) => {
        const elapsed = now - startTime
        const rawProgress = Math.min(1, elapsed / duration)

        // Smooth cubic-bezier deceleration
        const eased = 1 - Math.pow(1 - rawProgress, 3)
        setUnrollProgress(eased)

        if (rawProgress < 1) {
          animFrameRef.current = requestAnimationFrame(animate)
        } else {
          setScrollState('opened')
          setUnrollProgress(1)
          if (onComplete) onComplete()
        }
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }, 240)
  }, [scrollState, onComplete])

  // =====================================================
  // POINTER EVENTS: DRAG-TO-EXTEND PULL TAG
  // =====================================================

  const handlePointerDown = (e) => {
    if (scrollState !== 'closed' || isTriggeredRef.current) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Fallback
    }
    setIsDragging(true)
    dragStartYRef.current = e.clientY
    currentDragYRef.current = 0
  }

  const handlePointerMove = (e) => {
    if (!isDragging || isTriggeredRef.current) return
    const deltaY = e.clientY - dragStartYRef.current

    // Only allow downward pulling, clamped to 75px max
    if (deltaY > 0) {
      const clamped = Math.min(deltaY, 75)
      currentDragYRef.current = clamped
      setDragY(clamped)
    } else {
      currentDragYRef.current = 0
      setDragY(0)
    }
  }

  const handlePointerUp = (e) => {
    if (!isDragging) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Fallback
    }
    setIsDragging(false)

    // Pull threshold: 46px
    if (currentDragYRef.current >= 46) {
      triggerUnroll()
    } else {
      // Spring smoothly back to resting position
      setDragY(0)
      currentDragYRef.current = 0
    }
  }

  const handlePointerCancel = (e) => {
    if (!isDragging) return
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Fallback
    }
    setIsDragging(false)
    setDragY(0)
    currentDragYRef.current = 0
  }

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [])

  // Content fade-in calculation during unrolling
  const contentOpacity =
    scrollState === 'opened'
      ? 1
      : scrollState === 'opening'
        ? Math.max(0, (unrollProgress - 0.38) / 0.62)
        : 0

  const contentTranslateY =
    scrollState === 'opened' ? 0 : (1 - contentOpacity) * 16

  const parchmentMaxHeight =
    scrollState === 'opened'
      ? 'calc(100dvh - 105px)'
      : scrollState === 'opening'
        ? `${unrollProgress * 590}px`
        : '0px'

  // Dynamic cord length: base 36px + downward drag distance
  const cordHeight = 36 + dragY

  return (
    <div className="royal-invitation-stage">
      {/* 1. Viewport Filigree Frame & Corner Flourishes */}
      <div className="stage-filigree-frame" />
      <div className="stage-corner-motif tl">❖</div>
      <div className="stage-corner-motif tr">❖</div>
      <div className="stage-corner-motif bl">❖</div>
      <div className="stage-corner-motif br">❖</div>

      {/* 2. Soft Ambient Light Pool */}
      <div className="stage-light-glow" />

      {/* ===================================================
         CLOSED SCROLL WITH EXTENDING HANGING ROYAL PULL TAG
      =================================================== */}
      {scrollState === 'closed' ? (
        <div className="closed-scroll-wrapper">
          {/* Horizontal Cylindrical Scroll Roll */}
          <div className="closed-scroll-unit">
            {/* Left Handcrafted Turned Finial */}
            <ScrollFinial side="left" className="closed-roller-finial" />

            {/* Cylindrical Parchment Core Wrapped around Rosewood Rod */}
            <div className="closed-parchment-cylinder">
              {/* Exposed Rosewood Rod Ends inside cylinder */}
              <div className="cylinder-wood-core-edge left" />
              <div className="cylinder-wood-core-edge right" />

              {/* Realistic Wrapped Parchment Seam & Overlap */}
              <div className="parchment-wrap-seam" />

              {/* Symmetrical Carved Indian Ornamental Bands */}
              <OrnamentalBand className="closed-band left" />
              <OrnamentalBand className="closed-band right" />
            </div>

            {/* Right Handcrafted Turned Finial */}
            <ScrollFinial side="right" className="closed-roller-finial" />

            {/* Central Embossed Royal Ganesha Seal */}
            <EmbossedRoyalSeal className="closed-scroll-seal" />

            {/* FIXED ATTACHMENT ANCHOR & EXTENDING PULL TAG */}
            <div className="tag-attachment-anchor">
              {/* Mounting Grommet anchored to the scroll */}
              <div className="tag-mounting-grommet" />

              {/* Braided Silk Cord — Length dynamically extends with drag */}
              <div
                className="hanging-braided-cord"
                style={{
                  height: `${cordHeight}px`,
                  transition: isDragging
                    ? 'none'
                    : 'height 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
              />

              {/* Movable Tag Assembly attached to the bottom of the extending cord */}
              <div
                className={`hanging-tag-movable ${!isDragging && !tagDetached ? 'swaying' : ''} ${isDragging ? 'dragging' : ''}`}
                style={{
                  top: `${cordHeight}px`,
                  transform: tagDetached
                    ? 'translateX(-50%) translateY(40px) scale(0.92)'
                    : 'translateX(-50%)',
                  opacity: tagDetached ? 0 : 1,
                  transition: tagDetached
                    ? 'transform 0.4s ease, opacity 0.35s ease'
                    : isDragging
                      ? 'none'
                      : 'top 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
                onClick={triggerUnroll}
                role="button"
                tabIndex={0}
                aria-label="Pull down or tap to reveal wedding invitation"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    triggerUnroll()
                  }
                }}
              >
                {/* The Hanging Royal Tag Card */}
                <div className="hanging-tag-card">
                  <div className="tag-eyelet" />
                  <div className="tag-arrow-indicator">▼</div>
                  <h4 className="tag-main-instruction">PULL TO REVEAL</h4>
                  <p className="tag-sub-instruction">Your invitation awaits</p>
                </div>

                {/* Ornamental Bottom Tassel */}
                <div className="tag-bottom-tassel">
                  <div className="tassel-brass-cap" />
                  <div className="tassel-silk-fringe" />
                </div>
              </div>
            </div>
          </div>

          {/* Ground Shadow under the scroll */}
          <div className="closed-scroll-shadow" />
        </div>
      ) : (
        /* ===================================================
           OPENED ROYAL INVITATION SCROLL (ANTIQUE ARTIFACT)
        =================================================== */
        <div className="opened-invitation-assembly">
          {/* Top Antique Royal Lacquered Rosewood Roller Bar */}
          <div className="physical-roller-bar top">
            <ScrollFinial side="left" className="bar-finial" />
            <div className="roller-body-core">
              <div className="roller-wood-grain-overlay" />
              <OrnamentalBand className="bar-band left" />
              <RollerCenterFiligree className="bar-centerpiece" />
              <OrnamentalBand className="bar-band right" />
            </div>
            <ScrollFinial side="right" className="bar-finial" />
          </div>

          {/* Handcrafted Deckled Parchment Document Sheet */}
          <div
            className="physical-parchment-sheet"
            style={{
              maxHeight: parchmentMaxHeight,
              height: scrollState === 'opening' ? parchmentMaxHeight : 'auto',
            }}
          >
            {/* Inner paper curling shadows where paper rolls into the rods */}
            <div className="parchment-inner-curl-top" />

            {/* Framed Royal Card Area */}
            <div className="parchment-ornamental-border">
              {/* Corner Filigree Flourishes (Traditional Indian Lotus Vines) */}
              <LotusCornerFiligree className="tl" />
              <LotusCornerFiligree className="tr" />
              <LotusCornerFiligree className="bl" />
              <LotusCornerFiligree className="br" />

              {/* Real Selectable HTML Content */}
              <div
                className="invitation-text-content"
                style={{
                  opacity: contentOpacity,
                  transform: `translateY(${contentTranslateY}px)`,
                  transition:
                    scrollState === 'opened' ? 'opacity 0.4s ease' : 'none',
                }}
              >
                {/* 1. Top Blessing */}
                <div className="invitation-blessing-block">
                  <img
                    src={ganeshaSymbolUrl}
                    alt="Lord Ganesha"
                    className="invitation-ganesha-emblem"
                  />
                  <h3 className="invitation-blessing-text">
                    WITH THE BLESSINGS OF Our Family and Elders
                  </h3>
                </div>

                {/* 2. Heading Section */}
                <div className="invitation-heading-block">
                  <h2 className="invitation-main-heading">
                    WEDDING INVITATION
                  </h2>
                  <p className="invitation-celebrating-intro">
                    With immense joy, we invite you to join us in celebrating the wedding of
                  </p>
                </div>

                {/* 3. Centerpiece Couple Names */}
                <div className="invitation-names-block">
                  <h1 className="invitation-groom-name">PUNEETH</h1>
                  <span className="invitation-name-ampersand">&amp;</span>
                  <h1 className="invitation-bride-name">CHINMAI</h1>
                  <p className="invitation-blessing-closing-note">
                    Your presence and blessings will make our celebration truly special.
                  </p>
                </div>

                {/* Ornamental Filigree Divider */}
                <div className="invitation-filigree-divider">
                  <div className="invitation-divider-line" />
                  <span>✦ ── ❖ ── ✦</span>
                  <div className="invitation-divider-line" />
                </div>

                {/* 4. Reception Details */}
                <div className="invitation-event-block">
                  <h3 className="invitation-event-title">RECEPTION</h3>
                  <p className="invitation-event-date">28 NOVEMBER 2026</p>
                  <p className="invitation-event-time">7:00 PM ONWARDS</p>
                </div>

                {/* Small Ornamental Separator */}
                <div
                  className="invitation-filigree-divider"
                  style={{ margin: '8px auto' }}
                >
                  <div
                    className="invitation-divider-line"
                    style={{ maxWidth: '38px' }}
                  />
                  <span>❖</span>
                  <div
                    className="invitation-divider-line"
                    style={{ maxWidth: '38px' }}
                  />
                </div>

                {/* 5. Muhurtam Details */}
                <div className="invitation-event-block">
                  <h3 className="invitation-event-title">MUHURTAM</h3>
                  <p className="invitation-event-date">29 NOVEMBER 2026</p>
                  <p className="invitation-event-time">9:00 AM</p>
                </div>

                {/* Small Ornamental Separator */}
                <div
                  className="invitation-filigree-divider"
                  style={{ margin: '8px auto' }}
                >
                  <div
                    className="invitation-divider-line"
                    style={{ maxWidth: '38px' }}
                  />
                  <span>❖</span>
                  <div
                    className="invitation-divider-line"
                    style={{ maxWidth: '38px' }}
                  />
                </div>

                {/* 6. Venue Details */}
                <div className="invitation-venue-block">
                  <h3 className="invitation-venue-title">VENUE</h3>
                  <p className="invitation-venue-name">
                    GAYATRI KALYANA MANTAPA
                  </p>
                  <p className="invitation-venue-city">
                    CHIKKAMAGALURU
                  </p>
                </div>

                {/* Bottom Auspicious Lotus Emblem */}
                <div className="invitation-base-lotus">
                  ❖ ─── 𑁍 ─── ❖
                </div>
              </div>
            </div>

            {/* Bottom Inner Curling Shadow */}
            <div className="parchment-inner-curl-bottom" />
          </div>

          {/* Bottom Antique Royal Lacquered Rosewood Roller Bar */}
          <div className="physical-roller-bar bottom">
            <ScrollFinial side="left" className="bar-finial" />
            <div className="roller-body-core">
              <div className="roller-wood-grain-overlay" />
              <OrnamentalBand className="bar-band left" />
              <RollerCenterFiligree className="bar-centerpiece" />
              <OrnamentalBand className="bar-band right" />
            </div>
            <ScrollFinial side="right" className="bar-finial" />
          </div>
        </div>
      )}
    </div>
  )
}
