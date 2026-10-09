import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import OpeningScene from './scenes/opening/OpeningScene'
import RoyalInvitation from './components/invitation/RoyalInvitation'
import WeddingAwaits from './components/details/WeddingAwaits'
import OurJourney from './components/journey/OurJourney'
import BlessingsWishes from './components/wishes/BlessingsWishes'
import RoyalNav from './components/navigation/RoyalNav'
import {
  SECTIONS,
  DEFAULT_SECTION_ID,
  DETAILS_SECTION_ID,
  JOURNEY_SECTION_ID,
  WISHES_SECTION_ID,
} from './config/sections'

// Lazily load AdminApp so public guests do not load admin bundle
const AdminApp = lazy(() => import('./components/admin/AdminApp'))


/**
 * App
 *
 * Central coordinator managing multi-section transitions:
 * OpeningScene → RoyalInvitation → Wedding Details → Our Journey → Blessings & Wishes
 * Features dynamic, scalable navigation driven by the central section registry (SECTIONS),
 * and a secure, isolated /admin portal for private memories management.
 */
export default function App() {
  const checkIsAdmin = () =>
    typeof window !== 'undefined' &&
    (window.location.pathname.includes('/admin') ||
      window.location.search.includes('admin') ||
      window.location.hash.includes('admin'))

  const [isAdminMode, setIsAdminMode] = useState(checkIsAdmin)

  // Listen to hash / history changes to support /admin deep-linking
  useEffect(() => {
    const handleUrlChange = () => {
      setIsAdminMode(checkIsAdmin())
    }
    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('hashchange', handleUrlChange)
    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('hashchange', handleUrlChange)
    }
  }, [])

  const isDirectInvitation =
    typeof window !== 'undefined' &&
    (window.location.search.includes('invitation') ||
      window.location.hash.includes('invitation'))

  const isDirectDetails =
    typeof window !== 'undefined' &&
    (window.location.search.includes('details') ||
      window.location.hash.includes('details'))

  const isDirectJourney =
    typeof window !== 'undefined' &&
    (window.location.search.includes('journey') ||
      window.location.hash.includes('journey'))

  const isDirectWishes =
    typeof window !== 'undefined' &&
    (window.location.search.includes('wishes') ||
      window.location.search.includes('blessings') ||
      window.location.hash.includes('wishes') ||
      window.location.hash.includes('blessings'))

  const initialSection = isDirectWishes
    ? WISHES_SECTION_ID
    : isDirectJourney
      ? JOURNEY_SECTION_ID
      : isDirectDetails
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

  // Dedicated Private Admin Portal Mode
  if (isAdminMode) {
    return (
      <Suspense
        fallback={
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
              backgroundColor: '#FAF5E8',
              color: '#6d1620',
              fontFamily: 'Cinzel, serif',
            }}
          >
            Loading Administrator Portal...
          </div>
        }
      >
        <AdminApp
          onExitAdmin={() => {
            setIsAdminMode(false)
            if (window.location.pathname.includes('/admin')) {
              window.history.pushState({}, '', window.location.pathname.replace(/\/admin\/?/, '') || '/')
            } else if (window.location.hash.includes('admin')) {
              window.location.hash = ''
            } else if (window.location.search.includes('admin')) {
              window.history.pushState({}, '', window.location.pathname)
            }
          }}
        />
      </Suspense>
    )
  }


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
          <WeddingAwaits
            onNavigateToJourney={() => handleSelectSection(JOURNEY_SECTION_ID)}
          />
        </div>
      )}

      {/* 4. Our Journey: From Then to Forever (Interactive photo/video timeline) */}
      {activeSectionId === JOURNEY_SECTION_ID && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            animation: 'journeyFadeIn 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          }}
        >
          <OurJourney
            onNavigateToWishes={() => handleSelectSection(WISHES_SECTION_ID)}
          />
        </div>
      )}

      {/* 5. Blessings & Wishes (Ceremonial letter and guest blessing) */}
      {activeSectionId === WISHES_SECTION_ID && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            animation: 'wishesFadeIn 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards',
          }}
        >
          <BlessingsWishes />
        </div>
      )}

      {/* 6. Scalable Top Navigation Pill (Driven by SECTIONS registry) */}
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
        @keyframes journeyFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wishesFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </main>
  )
}
