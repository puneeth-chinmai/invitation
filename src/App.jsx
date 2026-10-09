import { useState, useCallback } from 'react'
import OpeningScene from './scenes/opening/OpeningScene'
import RoyalInvitation from './components/invitation/RoyalInvitation'
import WeddingAwaits from './components/details/WeddingAwaits'
import RoyalNav from './components/navigation/RoyalNav'
import { SECTIONS, DEFAULT_SECTION_ID, DETAILS_SECTION_ID } from './config/sections'

/**
 * App
 *
 * Central coordinator managing multi-section transitions:
 * OpeningScene → RoyalInvitation → Wedding Details (The Wedding Awaits)
 * Features dynamic, scalable navigation driven by the central section registry (SECTIONS).
 */
export default function App() {
  const isDirectInvitation =
    typeof window !== 'undefined' &&
    (window.location.search.includes('invitation') ||
      window.location.hash.includes('invitation'))

  const isDirectDetails =
    typeof window !== 'undefined' &&
    (window.location.search.includes('details') ||
      window.location.hash.includes('details'))

  const initialSection = isDirectDetails
    ? DETAILS_SECTION_ID
    : isDirectInvitation
      ? DEFAULT_SECTION_ID
      : 'opening'

  const [activeSectionId, setActiveSectionId] = useState(initialSection)
  const [showOpening, setShowOpening] = useState(initialSection === 'opening')
  const [openingFadingOut, setOpeningFadingOut] = useState(false)
  const [invitationInitialState, setInvitationInitialState] = useState('closed')

  // Handle completion of opening cinematic sequence
  const handleOpeningComplete = useCallback(() => {
    setActiveSectionId(DEFAULT_SECTION_ID)
    setInvitationInitialState('closed')
    setOpeningFadingOut(true)

    // Once crossfade finishes (900ms), cleanly unmount OpeningScene to free WebGL 3D resources
    setTimeout(() => {
      setShowOpening(false)
    }, 950)
  }, [])

  // Handle closing of Royal Invitation
  const handleInvitationClose = useCallback(() => {
    // Transition smoothly into Wedding Details section after scroll finishes closing
    setActiveSectionId(DETAILS_SECTION_ID)
  }, [])

  // Navigation tab selection (works whether invitation is open, closed, or transitioning)
  const handleSelectSection = useCallback((sectionId) => {
    if (sectionId === DEFAULT_SECTION_ID) {
      // Reopening invitation always brings it into view in its closed state, ready for pull tag
      setInvitationInitialState('closed')
      setActiveSectionId(DEFAULT_SECTION_ID)
    } else {
      setActiveSectionId(sectionId)
    }
  }, [])

  const showNav = activeSectionId !== 'opening'

  return (
    <main
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: '#FAF5E8',
        overflow: 'hidden',
      }}
    >
      {/* 1. Cinematic Opening Scene */}
      {showOpening && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: openingFadingOut ? 0 : 1,
            transition: 'opacity 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: openingFadingOut ? 'none' : 'auto',
            zIndex: 10,
          }}
        >
          <OpeningScene onComplete={handleOpeningComplete} />
        </div>
      )}

      {/* 2. Royal Invitation Scroll */}
      {activeSectionId === DEFAULT_SECTION_ID && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            animation: 'invitationFadeIn 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          }}
        >
          <RoyalInvitation
            initialState={invitationInitialState}
            onClose={handleInvitationClose}
          />
        </div>
      )}

      {/* 3. The Wedding Awaits (Countdown, Venue, Events, Calendar, Sharing) */}
      {activeSectionId === DETAILS_SECTION_ID && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            animation: 'detailsFadeIn 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          }}
        >
          <WeddingAwaits />
        </div>
      )}

      {/* 4. Scalable Top Navigation Pill (Driven by SECTIONS registry) */}
      {showNav && (
        <RoyalNav
          sections={SECTIONS}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
        />
      )}

      <style>{`
        @keyframes invitationFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes detailsFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
