import { motion } from 'framer-motion'
import { SEQUENCE_STATES } from '../../constants/cinematic'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.5, delayChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8 },
  },
}

const lineVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
  },
}

/**
 * IntroText
 *
 * Displays the couple's names and event type during INTRO/REVEAL states.
 * Fades out once DOOR_READY and the CTA takes over.
 */
export default function IntroText({ state }) {
  const isVisible =
    state === SEQUENCE_STATES.INTRO || state === SEQUENCE_STATES.REVEAL

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'exit'}
      style={{
        position: 'absolute',
        top: '12%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        width: '90vw',
        maxWidth: '480px',
      }}
    >
      {/* Decorative ornament line */}
      <motion.div variants={lineVariants} style={styles.ornament}>
        ✦ &nbsp;&nbsp; ✦ &nbsp;&nbsp; ✦
      </motion.div>

      {/* Names */}
      <motion.h1 variants={lineVariants} style={styles.names}>
        Puneeth &amp; Chinmai
      </motion.h1>

      {/* Divider */}
      <motion.div variants={lineVariants} style={styles.divider} />

      {/* Subtitle */}
      <motion.p variants={lineVariants} style={styles.subtitle}>
        Marriage Invitation
      </motion.p>
    </motion.div>
  )
}

const styles = {
  ornament: {
    color: '#c9943a',
    fontSize: 'clamp(10px, 2vw, 13px)',
    letterSpacing: '0.5em',
    marginBottom: '0.8rem',
    opacity: 0.7,
  },
  names: {
    margin: 0,
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    fontWeight: 400,
    fontSize: 'clamp(28px, 6vw, 54px)',
    color: '#e8c06a',
    letterSpacing: '0.06em',
    lineHeight: 1.15,
    textShadow: '0 0 40px rgba(201,148,58,0.35), 0 2px 12px rgba(0,0,0,0.8)',
  },
  divider: {
    width: '40px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c9943a, transparent)',
    margin: '1.2rem auto',
  },
  subtitle: {
    margin: 0,
    fontFamily: "'Cormorant Garamond', 'Georgia', serif",
    fontWeight: 300,
    fontSize: 'clamp(13px, 2.8vw, 18px)',
    color: '#b09060',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    textShadow: '0 1px 8px rgba(0,0,0,0.6)',
  },
}
