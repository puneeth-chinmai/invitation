import { motion, AnimatePresence } from 'framer-motion'
import { SEQUENCE_STATES } from '../../constants/cinematic'

/**
 * SceneTransition
 *
 * Overlay fade used when transitioning between major scene states.
 * Renders a full-screen dark fade when the sequence state changes.
 */
export default function SceneTransition({ state }) {
  const isEntering = state === SEQUENCE_STATES.ENTERED

  return (
    <AnimatePresence>
      {isEntering && (
        <motion.div
          key="scene-fade"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'radial-gradient(ellipse at center, #1a0d00 0%, #0d0805 100%)',
            pointerEvents: 'none',
            zIndex: 50,
          }}
        />
      )}
    </AnimatePresence>
  )
}
