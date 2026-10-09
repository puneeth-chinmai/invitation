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

  const handleOpeningComplete = () => {
    // Reveal RoyalInvitation, smoothly crossfading over the completed opening scene
    setShowInvitation(true)

    // After crossfade finishes, cleanly unmount OpeningScene to release 3D resources
    setTimeout(() => {
      setShowOpening(false)
    }, 1400)
  }

  return (
    <main style={{ width: '100%', height: '100%', position: 'relative' }}>
      {showOpening && (
        <OpeningScene onComplete={handleOpeningComplete} />
      )}

      {showInvitation && (
        <RoyalInvitation />
      )}
    </main>
  )
}
