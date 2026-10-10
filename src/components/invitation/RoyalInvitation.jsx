import { useState, useRef, useEffect, useCallback } from 'react'
import ganeshaSymbolUrl from '../../assets/images/ganesha_symbol.png'
import templeBgUrl from '../../assets/images/temple_interior_bg.jpg'
import {
  ScrollFinial,
  OrnamentalBand,
  RollerCenterFiligree,
  EmbossedRoyalSeal,
  LotusCornerFiligree,
} from './ScrollCraftsmanship'
import './RoyalInvitation.css'

const SESSION_LANG_KEY = 'royal_invitation_lang'

function getSavedLanguage() {
  try {
    const saved = sessionStorage.getItem(SESSION_LANG_KEY)
    if (saved === 'kannada' || saved === 'english') {
      return saved
    }
  } catch {
    // sessionStorage might be restricted in some privacy modes
  }
  return 'english'
}

function saveLanguage(lang) {
  try {
    sessionStorage.setItem(SESSION_LANG_KEY, lang)
  } catch {
    // ignore
  }
}

const INVITATION_CONTENT = {
  english: {
    ganeshaBlessing: 'WITH THE BLESSINGS OF Our Family and Elders',
    ganeshaAlt: 'Lord Ganesha',
    mainHeading: 'WEDDING INVITATION',
    intro: 'With immense joy, we invite you to join us in celebrating the wedding of',
    groom: 'PUNEETH',
    ampersand: '&',
    bride: 'CHINMAI',
    closingNote: 'Your presence and blessings will make our celebration truly special.',
    receptionTitle: 'RECEPTION',
    receptionDate: '28 NOVEMBER 2026',
    receptionTime: '7:30 PM ONWARDS',
    muhurtamTitle: 'MUHURTAM',
    muhurtamDate: '29 NOVEMBER 2026',
    muhurtamTime: '8:00 AM',
    venueTitle: 'VENUE',
    venueName: 'GAYATHRI DEVI KALYANA MANTAPA',
    venueCity: 'CHIKKAMAGALURU',
    closeInstructionTitle: 'Until We Meet',
    closeInstructionText: 'Pull the lower roller up or the upper roller down to close the invitation and continue.',
    closeHint: 'Pull roller to close',
    topRollerCue: '▼ DRAG DOWN TO CLOSE ▼',
    bottomRollerCue: '▲ DRAG UP TO CLOSE ▲',
    topRollerAria: 'Pull top roller down to close invitation',
    bottomRollerAria: 'Pull bottom roller up to close invitation',
    closeBlockAria: 'Until We Meet: Pull lower roller up or upper roller down to close invitation and continue',
  },
  kannada: {
    ganeshaBlessing: 'ಗುರು-ಹಿರಿಯರ ಹಾಗೂ ಕುಟುಂಬದ ಆಶೀರ್ವಾದದೊಂದಿಗೆ',
    ganeshaAlt: 'ಶ್ರೀ ಮಹಾಗಣಪತಿ',
    mainHeading: 'ವಿವಾಹ ಮಹೋತ್ಸವದ ಆಮಂತ್ರಣ',
    intro: 'ಅಪಾರ ಸಂತಸ ಹಾಗೂ ಸಂಭ್ರಮದೊಂದಿಗೆ, ನಮ್ಮ ಶುಭ ವಿವಾಹ ಮಹೋತ್ಸವಕ್ಕೆ ತಮ್ಮನ್ನು ಪ್ರೀತಿಯಿಂದ ಆಹ್ವಾನಿಸುತ್ತಿದ್ದೇವೆ',
    groom: 'ಪುನೀತ್',
    ampersand: '&',
    bride: 'ಚಿನ್ಮಯಿ',
    closingNote: 'ತಮ್ಮ ಉಪಸ್ಥಿತಿ ಮತ್ತು ಶುಭ ಹಾರೈಕೆಗಳೇ ನಮ್ಮ ಈ ಸಂಭ್ರಮಕ್ಕೆ ನಿಜವಾದ ಶೋಭೆ.',
    receptionTitle: 'ಆರತಕ್ಷತೆ',
    receptionDate: '28 ನವೆಂಬರ್ 2026',
    receptionTime: 'ಸಂಜೆ 7:30 ರಿಂದ',
    muhurtamTitle: 'ಶುಭ ಮುಹೂರ್ತ',
    muhurtamDate: '29 ನವೆಂಬರ್ 2026',
    muhurtamTime: 'ಬೆಳಿಗ್ಗೆ 8:00 ಕ್ಕೆ',
    venueTitle: 'ಸ್ಥಳ',
    venueName: 'ಶ್ರೀ ಗಾಯತ್ರಿ ದೇವಿ ಕಲ್ಯಾಣ ಮಂಟಪ',
    venueCity: 'ಚಿಕ್ಕಮಗಳೂರು',
    closeInstructionTitle: 'ಮತ್ತೆ ಭೇಟಿಯಾಗುವವರೆಗೆ',
    closeInstructionText: 'ಆಮಂತ್ರಣವನ್ನು ಮಡಚಿ ಮುಂದುವರಿಯಲು ಕೆಳಗಿನ ಸುರುಳಿಯನ್ನು ಮೇಲಕ್ಕೆ ಅಥವಾ ಮೇಲಿನ ಸುರುಳಿಯನ್ನು ಕೆಳಕ್ಕೆ ಎಳೆಯಿರಿ.',
    closeHint: 'ಮಡಚಲು ಸುರುಳಿ ಎಳೆಯಿರಿ',
    topRollerCue: '▼ ಮಡಚಲು ಕೆಳಕ್ಕೆ ಎಳೆಯಿರಿ ▼',
    bottomRollerCue: '▲ ಮಡಚಲು ಮೇಲಕ್ಕೆ ಎಳೆಯಿರಿ ▲',
    topRollerAria: 'ಆಮಂತ್ರಣವನ್ನು ಮಡಚಲು ಮೇಲಿನ ಸುರುಳಿಯನ್ನು ಕೆಳಕ್ಕೆ ಎಳೆಯಿರಿ',
    bottomRollerAria: 'ಆಮಂತ್ರಣವನ್ನು ಮಡಚಲು ಕೆಳಗಿನ ಸುರುಳಿಯನ್ನು ಮೇಲಕ್ಕೆ ಎಳೆಯಿರಿ',
    closeBlockAria: 'ಮತ್ತೆ ಭೇಟಿಯಾಗುವವರೆಗೆ: ಆಮಂತ್ರಣವನ್ನು ಮಡಚಿ ಮುಂದುವರಿಯಲು ಕೆಳಗಿನ ಸುರುಳಿಯನ್ನು ಮೇಲಕ್ಕೆ ಅಥವಾ ಮೇಲಿನ ಸುರುಳಿಯನ್ನು ಕೆಳಕ್ಕೆ ಎಳೆಯಿರಿ',
  },
}

/**
 * RoyalInvitation
 *
 * An independent, self-contained royal wedding invitation component.
 * Features:
 *   - Ancient royal parchment with organic deckled edges and natural tonal aging.
 *   - Heavy cylindrical lacquered rosewood & antique-brass scroll rollers.
 *   - Hanging royal pull tag that dynamically lengthens during drag without clipping or detaching.
 *   - Smooth physical vertical unrolling animation with progressive content reveal.
 *   - Coordinated physical bidirectional closing interaction driven by shared animation progress:
 *       * Pulling lower roller UP or upper roller DOWN triggers the exact same coordinated closing.
 *       * Rollers converge toward one another monotonically; they never cross or separate.
 *       * Parchment progressively rolls inward, concealing text gracefully.
 *       * Settles smoothly into the compact closed-scroll composition with seal and pull tag.
 *   - Traditional "Until We Meet" closing instruction.
 *   - Real selectable HTML text with exact wedding dates, reception, muhurtam, and venue.
 *   - Bilingual English & Kannada language toggle with session persistence.
 *   - Mobile-first responsive layout with smooth vertical scrolling.
 */
export default function RoyalInvitation({ onComplete, onClose, initialState = 'closed' }) {
  // Language state: 'english' | 'kannada' (session-persisted)
  const [language, setLanguage] = useState(getSavedLanguage)

  const handleLanguageChange = useCallback((newLang) => {
    if (newLang === language) return
    setLanguage(newLang)
    saveLanguage(newLang)
  }, [language])

  const t = INVITATION_CONTENT[language] || INVITATION_CONTENT.english

  // Scroll states: 'closed' | 'opening' | 'opened' | 'closing'
  const [scrollState, setScrollState] = useState(initialState)
  const [isDraggingTag, setIsDraggingTag] = useState(false)
  const [tagDetached, setTagDetached] = useState(false)

  const scrollUnitRef = useRef(null)
  const assemblyRef = useRef(null)
  const dragStartYRef = useRef(0)
  const currentDragYRef = useRef(0)
  const isTriggeredRef = useRef(false)
  const isDraggingTagRef = useRef(false)

  const openTimeoutRef = useRef(null)
  const unrollTimerRef = useRef(null)
  const closeTimerRef = useRef(null)
  const settleTimerRef = useRef(null)

  // Top roller drag refs
  const topDragStartYRef = useRef(0)
  const currentTopDragYRef = useRef(0)
  const isTopDraggingRef = useRef(false)

  // Bottom roller drag refs
  const bottomDragStartYRef = useRef(0)
  const currentBottomDragYRef = useRef(0)
  const isBottomDraggingRef = useRef(false)

  // Sync initialState prop changes (e.g. when revisiting invitation via navigation)
  useEffect(() => {
    if (initialState) {
      // Clear any pending timers on external state change to prevent race conditions
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (unrollTimerRef.current) clearTimeout(unrollTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)

      setScrollState(initialState)
      if (initialState === 'closed') {
        isTriggeredRef.current = false
        setTagDetached(false)
        if (scrollUnitRef.current) {
          scrollUnitRef.current.style.setProperty('--drag-y', '0px')
        }
      }
    }
  }, [initialState])

  // =====================================================
  // UNROLL INVITATION SEQUENCE
  // =====================================================
  const triggerUnroll = useCallback(() => {
    if (isTriggeredRef.current || scrollState !== 'closed') return
    isTriggeredRef.current = true

    // Clear any pending closing/settle timers if unroll was triggered
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    if (settleTimerRef.current) clearTimeout(settleTimerRef.current)

    // Subtle haptic vibration where supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(40)
      } catch { }
    }

    // Tag detaches with gentle drop & fade
    setTagDetached(true)

    // Begin hardware-accelerated CSS unroll
    openTimeoutRef.current = setTimeout(() => {
      setScrollState('opening')

      // Commit opened state after 1.8s unroll animation completes
      unrollTimerRef.current = setTimeout(() => {
        setScrollState('opened')
        if (onComplete) onComplete()
      }, 1800)
    }, 220)
  }, [scrollState, onComplete])

  // =====================================================
  // COORDINATED PHYSICAL CLOSING SEQUENCE
  // Single shared closing mechanism regardless of which roller is pulled.
  // =====================================================
  const triggerClose = useCallback(() => {
    if (scrollState !== 'opened') return
    setScrollState('closing')

    // Clear any pending opening/unroll timers
    if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
    if (unrollTimerRef.current) clearTimeout(unrollTimerRef.current)

    // Subtle haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(35)
      } catch { }
    }

    // Clear inline drag offsets so unified CSS keyframes execute smoothly
    if (assemblyRef.current) {
      assemblyRef.current.style.setProperty('--roller-top-offset', '0px')
      assemblyRef.current.style.setProperty('--roller-bottom-offset', '0px')
      assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
      assemblyRef.current.style.setProperty('--roller-transition', 'none')
    }

    // Coordinated 1.4s closing animation where rollers converge and parchment contracts to 0.
    // At 1400ms, commit closed scroll state so it cleanly settles.
    closeTimerRef.current = setTimeout(() => {
      isTriggeredRef.current = false
      setTagDetached(false)
      setScrollState('closed')

      // Settle in closed state for 350ms, then invoke onClose to transition to next section
      settleTimerRef.current = setTimeout(() => {
        if (onClose) onClose()
      }, 350)
    }, 1400)
  }, [scrollState, onClose])

  // =====================================================
  // POINTER EVENTS: ZERO-LAG DRAG-TO-EXTEND PULL TAG
  // =====================================================
  const handleTagPointerDown = (e) => {
    if (scrollState !== 'closed' || isTriggeredRef.current) return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch { }
    isDraggingTagRef.current = true
    setIsDraggingTag(true)
    dragStartYRef.current = e.clientY
    currentDragYRef.current = 0
    if (scrollUnitRef.current) {
      scrollUnitRef.current.style.setProperty('--drag-cord-transition', 'none')
    }
  }

  const handleTagPointerMove = (e) => {
    if (!isDraggingTagRef.current || isTriggeredRef.current) return
    const deltaY = e.clientY - dragStartYRef.current

    // Only allow downward pulling, clamped to 75px max
    if (deltaY > 0) {
      const clamped = Math.min(deltaY, 75)
      currentDragYRef.current = clamped
      if (scrollUnitRef.current) {
        scrollUnitRef.current.style.setProperty('--drag-y', `${clamped}px`)
      }
    } else {
      currentDragYRef.current = 0
      if (scrollUnitRef.current) {
        scrollUnitRef.current.style.setProperty('--drag-y', '0px')
      }
    }
  }

  const handleTagPointerUp = (e) => {
    if (!isDraggingTagRef.current) return
    isDraggingTagRef.current = false
    setIsDraggingTag(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }

    // Pull threshold: 46px
    if (currentDragYRef.current >= 46) {
      triggerUnroll()
    } else {
      // Spring smoothly back to resting position
      currentDragYRef.current = 0
      if (scrollUnitRef.current) {
        scrollUnitRef.current.style.setProperty(
          '--drag-cord-transition',
          'height 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        )
        scrollUnitRef.current.style.setProperty('--drag-y', '0px')
      }
    }
  }

  const handleTagPointerCancel = (e) => {
    if (!isDraggingTagRef.current) return
    isDraggingTagRef.current = false
    setIsDraggingTag(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }
    currentDragYRef.current = 0
    if (scrollUnitRef.current) {
      scrollUnitRef.current.style.setProperty(
        '--drag-cord-transition',
        'height 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      )
      scrollUnitRef.current.style.setProperty('--drag-y', '0px')
    }
  }

  // =====================================================
  // POINTER EVENTS: TOP ROLLER DRAG DOWN TO CLOSE
  // =====================================================
  const handleTopPointerDown = (e) => {
    if (scrollState !== 'opened') return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch { }
    isTopDraggingRef.current = true
    topDragStartYRef.current = e.clientY
    currentTopDragYRef.current = 0
    if (assemblyRef.current) {
      assemblyRef.current.style.setProperty('--roller-transition', 'none')
    }
  }

  const handleTopPointerMove = (e) => {
    if (!isTopDraggingRef.current || scrollState !== 'opened') return
    const deltaY = e.clientY - topDragStartYRef.current

    // Only allow downward pulling for top roller
    if (deltaY > 0) {
      const clamped = Math.min(deltaY, 80)
      currentTopDragYRef.current = clamped
      if (assemblyRef.current) {
        assemblyRef.current.style.setProperty('--roller-top-offset', `${clamped}px`)
        assemblyRef.current.style.setProperty('--drag-contract-y', `${clamped}px`)
      }
    } else {
      currentTopDragYRef.current = 0
      if (assemblyRef.current) {
        assemblyRef.current.style.setProperty('--roller-top-offset', '0px')
        assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
      }
    }
  }

  const handleTopPointerUp = (e) => {
    if (!isTopDraggingRef.current) return
    isTopDraggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }

    // Closing threshold: 45px
    if (currentTopDragYRef.current >= 45) {
      triggerClose()
    } else {
      // Spring back to open position
      currentTopDragYRef.current = 0
      if (assemblyRef.current) {
        assemblyRef.current.style.setProperty(
          '--roller-transition',
          'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        )
        assemblyRef.current.style.setProperty('--roller-top-offset', '0px')
        assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
      }
    }
  }

  const handleTopPointerCancel = (e) => {
    if (!isTopDraggingRef.current) return
    isTopDraggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }
    currentTopDragYRef.current = 0
    if (assemblyRef.current) {
      assemblyRef.current.style.setProperty(
        '--roller-transition',
        'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      )
      assemblyRef.current.style.setProperty('--roller-top-offset', '0px')
      assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
    }
  }

  // =====================================================
  // POINTER EVENTS: BOTTOM ROLLER DRAG UP TO CLOSE
  // =====================================================
  const handleBottomPointerDown = (e) => {
    if (scrollState !== 'opened') return
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch { }
    isBottomDraggingRef.current = true
    bottomDragStartYRef.current = e.clientY
    currentBottomDragYRef.current = 0
    if (assemblyRef.current) {
      assemblyRef.current.style.setProperty('--roller-transition', 'none')
    }
  }

  const handleBottomPointerMove = (e) => {
    if (!isBottomDraggingRef.current || scrollState !== 'opened') return
    const deltaY = bottomDragStartYRef.current - e.clientY

    // Only allow upward pulling for bottom roller
    if (deltaY > 0) {
      const upwardDist = Math.min(deltaY, 80)
      currentBottomDragYRef.current = upwardDist
      if (assemblyRef.current) {
        assemblyRef.current.style.setProperty('--roller-bottom-offset', `-${upwardDist}px`)
        assemblyRef.current.style.setProperty('--drag-contract-y', `${upwardDist}px`)
      }
    } else {
      currentBottomDragYRef.current = 0
      if (assemblyRef.current) {
        assemblyRef.current.style.setProperty('--roller-bottom-offset', '0px')
        assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
      }
    }
  }

  const handleBottomPointerUp = (e) => {
    if (!isBottomDraggingRef.current) return
    isBottomDraggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }

    // Closing threshold: 45px
    if (currentBottomDragYRef.current >= 45) {
      triggerClose()
    } else {
      // Spring back to open position
      currentBottomDragYRef.current = 0
      if (assemblyRef.current) {
        assemblyRef.current.style.setProperty(
          '--roller-transition',
          'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        )
        assemblyRef.current.style.setProperty('--roller-bottom-offset', '0px')
        assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
      }
    }
  }

  const handleBottomPointerCancel = (e) => {
    if (!isBottomDraggingRef.current) return
    isBottomDraggingRef.current = false
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch { }
    currentBottomDragYRef.current = 0
    if (assemblyRef.current) {
      assemblyRef.current.style.setProperty(
        '--roller-transition',
        'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      )
      assemblyRef.current.style.setProperty('--roller-bottom-offset', '0px')
      assemblyRef.current.style.setProperty('--drag-contract-y', '0px')
    }
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current)
      if (unrollTimerRef.current) clearTimeout(unrollTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      if (settleTimerRef.current) clearTimeout(settleTimerRef.current)
    }
  }, [])

  return (
    <div className={`royal-invitation-stage state-${scrollState}`}>
      {/* 1. Viewport Filigree Frame & Corner Flourishes */}
      <div className="stage-filigree-frame" />
      <div className="stage-corner-motif tl">❖</div>
      <div className="stage-corner-motif tr">❖</div>
      <div className="stage-corner-motif bl">❖</div>
      <div className="stage-corner-motif br">❖</div>

      {/* 2. Realistic Defocused Temple Interior Environment (Pillared Hallway) */}
      <div className="stage-temple-environment" aria-hidden="true">
        <img
          src={templeBgUrl}
          alt=""
          className="temple-environment-image"
          loading="eager"
          decoding="async"
        />
        {/* Soft Radial & Linear Vignette Mask: Fades center to ivory, keeping flanks visible */}
        <div className="temple-environment-fade-mask" />
      </div>

      {/* 3. Soft Warm Central Illumination */}
      <div className="stage-light-glow" />

      {/* ===================================================
         CLOSED SCROLL WITH EXTENDING HANGING ROYAL PULL TAG
      =================================================== */}
      {scrollState === 'closed' ? (
        <div className="closed-scroll-wrapper">
          {/* Horizontal Cylindrical Scroll Roll */}
          <div className="closed-scroll-unit" ref={scrollUnitRef}>
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
              <div className="hanging-braided-cord" />

              {/* Movable Tag Assembly attached to the bottom of the extending cord */}
              <div
                className={`hanging-tag-movable ${!isDraggingTag && !tagDetached ? 'swaying' : ''} ${isDraggingTag ? 'dragging' : ''}`}
                style={{
                  transform: tagDetached
                    ? 'translateX(-50%) translateY(40px) scale(0.92)'
                    : 'translateX(-50%)',
                  opacity: tagDetached ? 0 : 1,
                  transition: tagDetached
                    ? 'transform 0.4s ease, opacity 0.35s ease'
                    : isDraggingTag
                      ? 'none'
                      : 'top 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
                onPointerDown={handleTagPointerDown}
                onPointerMove={handleTagPointerMove}
                onPointerUp={handleTagPointerUp}
                onPointerCancel={handleTagPointerCancel}
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
           OPENED & CLOSING ROYAL INVITATION SCROLL ASSEMBLY
        =================================================== */
        <div
          ref={assemblyRef}
          className={`opened-invitation-assembly ${language === 'kannada' ? 'is-kannada' : 'is-english'
            } ${scrollState === 'opening'
              ? 'is-opening'
              : scrollState === 'closing'
                ? 'is-closing'
                : 'is-opened'
            }`}
        >
          {/* Top Antique Royal Lacquered Rosewood Roller Bar (Pull down to close) */}
          <div
            className="physical-roller-bar top"
            onPointerDown={handleTopPointerDown}
            onPointerMove={handleTopPointerMove}
            onPointerUp={handleTopPointerUp}
            onPointerCancel={handleTopPointerCancel}
            onClick={triggerClose}
            role="button"
            tabIndex={0}
            aria-label={t.topRollerAria}
            title={t.topRollerAria}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                triggerClose()
              }
            }}
          >
            <ScrollFinial side="left" className="bar-finial" />
            <div className="roller-body-core">
              <div className="roller-wood-grain-overlay" />
              <div className="roller-drag-indicator top">
                <span>{t.topRollerCue}</span>
              </div>
              <OrnamentalBand className="bar-band left" />
              <RollerCenterFiligree className="bar-centerpiece" />
              <OrnamentalBand className="bar-band right" />
            </div>
            <ScrollFinial side="right" className="bar-finial" />
          </div>

          {/* Handcrafted Deckled Parchment Document Sheet */}
          <div className="physical-parchment-sheet">
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
              <div className={`invitation-text-content ${language === 'kannada' ? 'lang-kannada' : 'lang-english'}`}>
                {/* Compact Royal Language Switch: English | ಕನ್ನಡ (Subtle pill centred above Ganesha) */}
                <div
                  className="invitation-lang-switch-container"
                  role="region"
                  aria-label="Language selection / ಭಾಷೆ ಆಯ್ಕೆ"
                >
                  <div
                    className="invitation-lang-switch-pill"
                    role="group"
                    aria-label="Invitation language"
                  >
                    <button
                      type="button"
                      className={`lang-switch-btn ${language === 'english' ? 'is-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLanguageChange('english')
                      }}
                      aria-pressed={language === 'english'}
                      aria-label="View invitation in English"
                    >
                      English
                    </button>
                    <button
                      type="button"
                      className={`lang-switch-btn kannada-btn ${language === 'kannada' ? 'is-active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLanguageChange('kannada')
                      }}
                      aria-pressed={language === 'kannada'}
                      aria-label="ವಿವಾಹ ಆಮಂತ್ರಣವನ್ನು ಕನ್ನಡದಲ್ಲಿ ವೀಕ್ಷಿಸಿ"
                    >
                      ಕನ್ನಡ
                    </button>
                  </div>
                </div>

                {/* 1. Top Blessing */}
                <div className="invitation-blessing-block">
                  <img
                    src={ganeshaSymbolUrl}
                    alt={t.ganeshaAlt}
                    className="invitation-ganesha-emblem"
                  />
                  <h3 className="invitation-blessing-text">
                    {t.ganeshaBlessing}
                  </h3>
                </div>

                {/* 2. Heading Section */}
                <div className="invitation-heading-block">
                  <h2 className="invitation-main-heading">
                    {t.mainHeading}
                  </h2>
                  <p className="invitation-celebrating-intro">
                    {t.intro}
                  </p>
                </div>

                {/* 3. Centerpiece Couple Names */}
                <div className="invitation-names-block">
                  <h1 className="invitation-groom-name">{t.groom}</h1>
                  <span className="invitation-name-ampersand">{t.ampersand}</span>
                  <h1 className="invitation-bride-name">{t.bride}</h1>
                  <p className="invitation-blessing-closing-note">
                    {t.closingNote}
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
                  <h3 className="invitation-event-title">{t.receptionTitle}</h3>
                  <p className="invitation-event-date">{t.receptionDate}</p>
                  <p className="invitation-event-time">{t.receptionTime}</p>
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
                  <h3 className="invitation-event-title">{t.muhurtamTitle}</h3>
                  <p className="invitation-event-date">{t.muhurtamDate}</p>
                  <p className="invitation-event-time">{t.muhurtamTime}</p>
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
                  <h3 className="invitation-venue-title">{t.venueTitle}</h3>
                  <p className="invitation-venue-name">{t.venueName}</p>
                  <p className="invitation-venue-city">{t.venueCity}</p>
                </div>

                {/* Bottom Auspicious Lotus Emblem */}
                <div className="invitation-base-lotus">
                  ❖ ─── 𑁍 ─── ❖
                </div>

                {/* 7. Traditional Closing Instruction */}
                <div
                  className="invitation-closing-instruction-block"
                  onClick={(e) => {
                    e.stopPropagation()
                    triggerClose()
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={t.closeBlockAria}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      triggerClose()
                    }
                  }}
                >
                  <div className="closing-instruction-divider">
                    <div className="closing-divider-line" />
                    <span>❖</span>
                    <div className="closing-divider-line" />
                  </div>
                  <h4 className="closing-instruction-title">{t.closeInstructionTitle}</h4>
                  <p className="closing-instruction-text">
                    {t.closeInstructionText}
                  </p>
                  <div className="closing-roller-action-hint">
                    <span className="closing-hint-arrow">▲</span>
                    <span className="closing-hint-text">{t.closeHint}</span>
                    <span className="closing-hint-arrow">▲</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Inner Curling Shadow */}
            <div className="parchment-inner-curl-bottom" />
          </div>

          {/* Bottom Antique Royal Lacquered Rosewood Roller Bar (Pull up to close) */}
          <div
            className="physical-roller-bar bottom"
            onPointerDown={handleBottomPointerDown}
            onPointerMove={handleBottomPointerMove}
            onPointerUp={handleBottomPointerUp}
            onPointerCancel={handleBottomPointerCancel}
            onClick={triggerClose}
            role="button"
            tabIndex={0}
            aria-label={t.bottomRollerAria}
            title={t.bottomRollerAria}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                triggerClose()
              }
            }}
          >
            <ScrollFinial side="left" className="bar-finial" />
            <div className="roller-body-core">
              <div className="roller-wood-grain-overlay" />
              <div className="roller-drag-indicator bottom">
                <span>{t.bottomRollerCue}</span>
              </div>
              <OrnamentalBand className="bar-band left" />
              <RollerCenterFiligree className="bar-centerpiece" />
              <OrnamentalBand className="bar-band right" />
            </div>
            <ScrollFinial side="right" className="bar-finial" />
          </div>

          {/* Ground shadow that emerges as the scroll rolls closed */}
          <div className="closing-scroll-shadow" />

          {/* Settle Hardware: Royal seal and pull tag smoothly emerging at the center as rollers meet */}
          <div className="closing-settle-hardware">
            <EmbossedRoyalSeal className="closed-scroll-seal" />
            <div className="tag-attachment-anchor">
              <div className="tag-mounting-grommet" />
              <div className="hanging-braided-cord" />
              <div className="hanging-tag-movable swaying">
                <div className="hanging-tag-card">
                  <div className="tag-eyelet" />
                  <div className="tag-arrow-indicator">▼</div>
                  <h4 className="tag-main-instruction">PULL TO REVEAL</h4>
                  <p className="tag-sub-instruction">Your invitation awaits</p>
                </div>
                <div className="tag-bottom-tassel">
                  <div className="tassel-brass-cap" />
                  <div className="tassel-silk-fringe" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
