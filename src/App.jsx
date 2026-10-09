import { useState } from 'react'
import OpeningScene from './scenes/opening/OpeningScene'
import RoyalInvitation from './components/invitation/RoyalInvitation'

/**
 * App
 *
 * Top-level coordinator managing section transitions:
 * OpeningScene → RoyalInvitation → Future independent sections
 */
export default function App() {
  const isDirectInvitation =
    typeof window !== 'undefined' &&
    (window.location.search.includes('invitation') ||
      window.location.hash.includes('invitation'))

  const [showOpening, setShowOpening] = useState(!isDirectInvitation)
  const [showInvitation, setShowInvitation] = useState(isDirectInvitation)
  const [openingFadingOut, setOpeningFadingOut] = useState(false)
  const [invitationFadingIn, setInvitationFadingIn] = useState(isDirectInvitation)

  const handleOpeningComplete = () => {
    // 1. Mount RoyalInvitation (initial opacity 0)
    setShowInvitation(true)

    // 2. Start coordinated crossfade on next frame
    requestAnimationFrame(() => {
      setOpeningFadingOut(true)
      setInvitationFadingIn(true)
    })

    // 3. Once crossfade finishes (850ms), cleanly unmount OpeningScene to free all 3D WebGL resources
    setTimeout(() => {
      setShowOpening(false)
    }, 900)
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
      {showOpening && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: openingFadingOut ? 0 : 1,
            transition: 'opacity 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: openingFadingOut ? 'none' : 'auto',
          }}
        >
          <OpeningScene onComplete={handleOpeningComplete} />
        </div>
      )}

      {showInvitation && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: invitationFadingIn ? 1 : 0,
            transform: invitationFadingIn ? 'translateY(0)' : 'translateY(8px)',
            transition:
              'opacity 0.85s cubic-bezier(0.25, 1, 0.5, 1), transform 0.85s cubic-bezier(0.25, 1, 0.5, 1)',
            pointerEvents: invitationFadingIn ? 'auto' : 'none',
          }}
        >
          <RoyalInvitation />
        </div>
      )}
    </main>
  )
}

