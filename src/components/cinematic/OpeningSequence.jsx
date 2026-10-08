import { useState, useEffect, useCallback } from 'react'
import { SEQUENCE_STATES, TIMING } from '../../constants/cinematic'

/**
 * OpeningSequence
 *
 * Manages the high-level state machine for the opening experience.
 * Renders children as a render-prop / function, passing current state
 * and action handlers.
 *
 * States:
 *   INTRO → REVEAL → DOOR_READY → DOOR_OPENING → ENTERED
 *
 * @param {function} children - Render prop: ({ state, onDoorOpen }) => JSX
 */
export default function OpeningSequence({ children }) {
  const [state, setState] = useState(SEQUENCE_STATES.INTRO)

  // Auto-advance INTRO → REVEAL → DOOR_READY
  useEffect(() => {
    if (state === SEQUENCE_STATES.INTRO) {
      const t = setTimeout(() => setState(SEQUENCE_STATES.REVEAL), TIMING.INTRO_DURATION * 1000)
      return () => clearTimeout(t)
    }
    if (state === SEQUENCE_STATES.REVEAL) {
      const t = setTimeout(() => setState(SEQUENCE_STATES.DOOR_READY), TIMING.REVEAL_DURATION * 1000)
      return () => clearTimeout(t)
    }
  }, [state])

  // Called by TempleDoor when the open animation completes
  const handleDoorOpen = useCallback(() => {
    setState(SEQUENCE_STATES.DOOR_OPENING)
    // After doors are fully open, transition to ENTERED
    const t = setTimeout(() => setState(SEQUENCE_STATES.ENTERED), TIMING.DOOR_OPEN_DURATION * 1000)
    return () => clearTimeout(t)
  }, [])

  return children({ state, onDoorOpen: handleDoorOpen })
}
