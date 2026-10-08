import { motion, AnimatePresence } from 'framer-motion'
import { SEQUENCE_STATES } from '../../constants/cinematic'

/**
 * TapToEnter
 *
 * Cinematic "tap the doors to enter" prompt.
 * Only visible in DOOR_READY state.
 * Designed to feel integrated into the scene, not like a UI button.
 */
export default function TapToEnter({ state, onTap }) {
  const isVisible = state === SEQUENCE_STATES.DOOR_READY

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="tap-to-enter"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
          onClick={onTap}
          style={styles.wrapper}
          role="button"
          aria-label="Tap the doors to enter"
        >
          {/* Pulsing glow ring */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={styles.glow}
          />

          {/* Icon — small decorative chevron */}
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={styles.chevronWrapper}
          >
            <svg width="18" height="10" viewBox="0 0 18 10" fill="none">
              <path d="M1 1L9 9L17 1" stroke="#c9943a" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* Label */}
          <p style={styles.label}>Tap the doors to enter</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const styles = {
  wrapper: {
    position: 'absolute',
    bottom: '10%',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.6rem',
    cursor: 'pointer',
    zIndex: 10,
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  },
  glow: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '1px solid rgba(201, 148, 58, 0.3)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  chevronWrapper: {
    opacity: 0.85,
  },
  label: {
    margin: 0,
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    fontWeight: 300,
    fontSize: 'clamp(11px, 2.5vw, 14px)',
    color: '#9a7845',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    textShadow: '0 1px 6px rgba(0,0,0,0.8)',
    whiteSpace: 'nowrap',
  },
}
