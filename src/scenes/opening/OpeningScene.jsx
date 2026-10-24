import { useRef, useState, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import ganeshaSymbolUrl from '../../assets/images/ganesha_symbol.png'
import royalLotusSealUrl from '../../assets/images/royal_lotus_seal.png'

/* =====================================================
   FLOATING PETALS & LIGHT PARTICLES (LIGHTWEIGHT CANVAS)
===================================================== */

function FloatingIvoryPetals() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const particles = Array.from({ length: 14 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.45 + 0.25,
      speedX: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015,
      isPetal: Math.random() > 0.45,
      opacity: Math.random() * 0.35 + 0.15,
    }))

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.y += p.speedY
          p.x += Math.sin(p.angle) * 0.4 + p.speedX
          p.angle += p.spin

          if (p.y > h + 15) {
            p.y = -15
            p.x = Math.random() * w
          }
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        if (p.isPetal) {
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 1.2, 0, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(230, 160, 175, ${p.opacity * 0.6})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(214, 165, 82, ${p.opacity})`
          ctx.shadowColor = 'rgba(214, 165, 82, 0.4)'
          ctx.shadowBlur = 6
          ctx.fill()
        }

        ctx.restore()
      })

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}

const cornerMotifStyles = {
  tl: { position: 'absolute', top: 'clamp(10px, 2.5vw, 20px)', left: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
  tr: { position: 'absolute', top: 'clamp(10px, 2.5vw, 20px)', right: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
  bl: { position: 'absolute', bottom: 'clamp(10px, 2.5vw, 20px)', left: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
  br: { position: 'absolute', bottom: 'clamp(10px, 2.5vw, 20px)', right: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
}

/* =====================================================
   APPROVED IVORY GANESHA OPENING SCENE
   Starts directly with Lord Ganesha's blessing,
   followed by the royal wedding announcement.
===================================================== */

export default function OpeningScene({ onComplete }) {
  const [isReady, setIsReady] = useState(false)
  // Starts directly at the approved Ganesha reveal milestone (offset by 4.4s)
  const [sinceStart, setSinceStart] = useState(4.4)
  const startTimeRef = useRef(null)
  const completedCalledRef = useRef(false)

  // Preload and decode assets (Ganesha & Royal Lotus Seal) and ensure essential typography is ready
  useEffect(() => {
    let cancelled = false
    const gImg = new Image()
    gImg.src = ganeshaSymbolUrl

    const sImg = new Image()
    sImg.src = royalLotusSealUrl

    const fontPromise =
      typeof document !== 'undefined' && document.fonts
        ? document.fonts.ready
        : Promise.resolve()

    const decodeImg = (img) =>
      new Promise((resolve) => {
        if (img.complete && img.naturalWidth > 0) {
          if (img.decode) {
            img.decode().then(resolve).catch(resolve)
          } else {
            resolve()
          }
        } else {
          img.onload = () => {
            if (img.decode) {
              img.decode().then(resolve).catch(resolve)
            } else {
              resolve()
            }
          }
          img.onerror = resolve
        }
      })

    Promise.all([fontPromise, decodeImg(gImg), decodeImg(sImg)]).then(() => {
      if (!cancelled) {
        setIsReady(true)
      }
    })

    return () => {
      cancelled = true
    }
  }, [])

  const handleProceed = useCallback(() => {
    if (completedCalledRef.current) return
    completedCalledRef.current = true
    if (onComplete) {
      onComplete()
    }
  }, [onComplete])

  useEffect(() => {
    if (!isReady) return
    let animId
    const start = performance.now() / 1000
    startTimeRef.current = start

    const update = () => {
      const now = performance.now() / 1000
      const elapsed = now - start
      // Base timeline starts immediately at the approved Ganesha reveal (4.4s mark)
      const currentMilestone = 4.4 + elapsed
      setSinceStart(currentMilestone)

      // Announcement finishes revealing at 19.3s
      // Hold completed composition for ~3.5s (until 22.8s) so guest appreciates it
      if (currentMilestone >= 22.8 && !completedCalledRef.current) {
        completedCalledRef.current = true
        if (onComplete) {
          onComplete()
        }
      } else {
        animId = requestAnimationFrame(update)
      }
    }

    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [isReady, onComplete])

  /* ---------------------------------------------------
     STAGE D: GANESHA SYMBOL (4.4s to 9.7s)
     Fade in 1.4s, hold 2.5s, fade out 1.4s
  --------------------------------------------------- */
  let ganeshaOpacity = 0
  let ganeshaTransform = 'scale(0.97) translateY(4px)'
  const showGanesha = isReady && sinceStart >= 4.4 && sinceStart < 9.7
  if (showGanesha) {
    if (sinceStart < 5.8) {
      // Fade in 1.4s (4.4 to 5.8)
      const p = (sinceStart - 4.4) / 1.4
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      ganeshaOpacity = eased
      ganeshaTransform = `scale(${0.97 + eased * 0.03}) translateY(${(1 - eased) * 4}px)`
    } else if (sinceStart < 8.3) {
      // Hold fully visible 2.5s (5.8 to 8.3)
      ganeshaOpacity = 1
      ganeshaTransform = 'scale(1) translateY(0)'
    } else {
      // Fade out 1.4s (8.3 to 9.7)
      const p = (sinceStart - 8.3) / 1.4
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      ganeshaOpacity = 1 - eased
      ganeshaTransform = `scale(${1 + eased * 0.02}) translateY(${-eased * 4}px)`
    }
  }

  /* ---------------------------------------------------
     STAGE E: BLESSING TEXT (10.0s to 14.5s)
     “With the blessings of Lord Ganesha”
     Fade in + rise 1.0s, hold 2.5s, fade out 1.0s
  --------------------------------------------------- */
  let blessingOpacity = 0
  let blessingTransform = 'translateY(10px)'
  const showBlessing = isReady && sinceStart >= 10.0 && sinceStart < 14.5
  if (showBlessing) {
    if (sinceStart < 11.0) {
      // Fade in + subtle rise 1.0s (10.0 to 11.0)
      const p = (sinceStart - 10.0) / 1.0
      const eased = 1 - Math.pow(1 - p, 3)
      blessingOpacity = eased
      blessingTransform = `translateY(${(1 - eased) * 10}px)`
    } else if (sinceStart < 13.5) {
      // Hold fully visible 2.5s (11.0 to 13.5)
      blessingOpacity = 1
      blessingTransform = 'translateY(0)'
    } else {
      // Fade out 1.0s (13.5 to 14.5)
      const p = (sinceStart - 13.5) / 1.0
      const eased = p * p
      blessingOpacity = 1 - eased
      blessingTransform = `translateY(${-eased * 6}px)`
    }
  }

  /* ---------------------------------------------------
     STAGES F, G, H, I: COUPLE'S NAMES & ARE GETTING MARRIED
     Sequential entrance, then holds indefinitely
  --------------------------------------------------- */
  const showNames = isReady && sinceStart >= 14.9

  // F: Puneeth (14.9s to 15.8s, 0.9s)
  const puneethP = THREE.MathUtils.clamp((sinceStart - 14.9) / 0.9, 0, 1)
  const puneethEase = 1 - Math.pow(1 - puneethP, 3)

  // G: & (16.2s to 16.8s, 0.6s)
  const ampersandP = THREE.MathUtils.clamp((sinceStart - 16.2) / 0.6, 0, 1)
  const ampersandEase = 1 - Math.pow(1 - ampersandP, 3)

  // H: Chinmai (17.2s to 18.1s, 0.9s)
  const chinmaiP = THREE.MathUtils.clamp((sinceStart - 17.2) / 0.9, 0, 1)
  const chinmaiEase = 1 - Math.pow(1 - chinmaiP, 3)

  // I: ARE GETTING MARRIED (18.5s to 19.3s, 0.8s)
  const marriedP = THREE.MathUtils.clamp((sinceStart - 18.5) / 0.8, 0, 1)
  const marriedEase = 1 - Math.pow(1 - marriedP, 3)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        minHeight: '100dvh',
        backgroundColor: '#FAF5E8',
        backgroundImage: `
          radial-gradient(ellipse 90% 75% at 50% 38%, #FFFDF8 0%, #FAF4E6 42%, #F3E7D0 78%, #E8D7BA 100%),
          repeating-linear-gradient(115deg, transparent 0px, transparent 32px, rgba(184, 134, 40, 0.015) 32.5px, transparent 33px, transparent 64px),
          repeating-linear-gradient(25deg, transparent 0px, transparent 40px, rgba(184, 134, 40, 0.012) 40.5px, transparent 41px, transparent 80px)
        `,
        overflow: 'hidden',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding:
          'max(24px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* Skip / Continue Pill Button */}
      <button
        type="button"
        onClick={handleProceed}
        style={{
          position: 'absolute',
          top: 'clamp(14px, 2.8vh, 24px)',
          right: 'clamp(14px, 3.5vw, 24px)',
          zIndex: 30,
          background: 'rgba(255, 253, 249, 0.85)',
          border: '1px solid rgba(196, 150, 76, 0.35)',
          borderRadius: '20px',
          padding: '6px 14px',
          fontFamily: "'Cinzel', serif",
          fontSize: 'clamp(11px, 2.4vw, 13px)',
          fontWeight: 500,
          letterSpacing: '0.1em',
          color: '#8a5e24',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          transition: 'all 0.25s ease',
        }}
      >
        Skip &rarr;
      </button>

      {/* 1. Subtle warm ambient light bloom */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(92vw, 560px)',
          height: 'min(92vw, 560px)',
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(245, 222, 179, 0.25) 0%, rgba(245, 222, 179, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 2. Thin gold inset frame and corner motifs */}
      <div
        style={{
          position: 'absolute',
          inset: 'clamp(12px, 3vw, 24px)',
          border: '1px solid rgba(184, 134, 40, 0.28)',
          boxShadow: 'inset 0 0 0 3px rgba(255, 253, 248, 0.6), inset 0 0 0 4px rgba(184, 134, 40, 0.12)',
          borderRadius: '6px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div style={cornerMotifStyles.tl}>❖</div>
      <div style={cornerMotifStyles.tr}>❖</div>
      <div style={cornerMotifStyles.bl}>❖</div>
      <div style={cornerMotifStyles.br}>❖</div>

      {/* 3. Approved Royal Lotus Seal */}
      <svg
        viewBox="0 0 953 1024"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(325px, 88vw, 545px)',
          height: 'clamp(350px, 94.5vw, 585px)',
          maxWidth: '92vw',
          maxHeight: '86vh',
          pointerEvents: 'none',
          opacity: 0.85,
          zIndex: 1,
        }}
      >
        <image
          href={royalLotusSealUrl}
          x="0"
          y="0"
          width="953"
          height="1024"
          preserveAspectRatio="xMidYMid meet"
        />
      </svg>

      {/* 4. Softly drifting petals & gold motes */}
      <FloatingIvoryPetals />

      {/* ---------------------------------------------------
          STAGE D: GANESHA SYMBOL
          Fade in 1.4s, hold 2.5s, fade out 1.4s
      --------------------------------------------------- */}
      {showGanesha && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ganeshaOpacity,
            transform: ganeshaTransform,
            willChange: 'opacity, transform',
            filter: 'drop-shadow(0 2px 10px rgba(138, 94, 36, 0.22))',
          }}
        >
          <img
            src={ganeshaSymbolUrl}
            alt=""
            aria-hidden="true"
            loading="eager"
            decoding="async"
            style={{
              width: 'clamp(210px, 56vw, 290px)',
              height: 'auto',
              aspectRatio: '1024 / 1002',
              maxHeight: '48vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* ---------------------------------------------------
          STAGE E: BLESSING TEXT
          “With the blessings of Lord Ganesha”
          Fade in + rise 1.0s, hold 2.5s, fade out 1.0s
      --------------------------------------------------- */}
      {showBlessing && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '600px',
            textAlign: 'center',
            padding: '20px',
            opacity: blessingOpacity,
            transform: blessingTransform,
            willChange: 'opacity, transform',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: 'clamp(22px, 5.5vw, 34px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#4a301a',
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              textShadow: '0 1px 12px rgba(212, 160, 68, 0.12)',
            }}
          >
            “With the blessings of Lord Ganesha”
          </p>
        </div>
      )}

      {/* ---------------------------------------------------
          STAGES F, G, H, I: COUPLE'S NAMES & ARE GETTING MARRIED
          Sequential entrance, then holds indefinitely!
      --------------------------------------------------- */}
      {showNames && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '16px',
            maxWidth: '92vw',
          }}
        >
          {/* 1. “Puneeth” (0.9s rise) */}
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(38px, 9.2vw, 64px)',
              fontWeight: 500,
              color: '#3d2514',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              opacity: puneethEase,
              transform: `translateY(${(1 - puneethEase) * 16}px)`,
              willChange: 'opacity, transform',
            }}
          >
            Puneeth
          </div>

          {/* 2. “&” (0.6s fade) */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', 'Great Vibes', serif",
              fontSize: 'clamp(26px, 6vw, 40px)',
              color: '#b88628',
              fontStyle: 'italic',
              margin: 'clamp(4px, 1.2vh, 10px) 0',
              opacity: ampersandEase,
              transform: `translateY(${(1 - ampersandEase) * 10}px)`,
              willChange: 'opacity, transform',
            }}
          >
            &amp;
          </div>

          {/* 3. “Chinmai” (0.9s rise) */}
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(38px, 9.2vw, 64px)',
              fontWeight: 500,
              color: '#3d2514',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              opacity: chinmaiEase,
              transform: `translateY(${(1 - chinmaiEase) * 16}px)`,
              willChange: 'opacity, transform',
            }}
          >
            Chinmai
          </div>

          {/* 4. “ARE GETTING MARRIED” (0.8s fade) */}
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(13px, 3.2vw, 18px)',
              fontWeight: 500,
              color: '#9c6b30',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginTop: 'clamp(22px, 4vh, 34px)',
              opacity: marriedEase,
              transform: `translateY(${(1 - marriedEase) * 12}px)`,
              willChange: 'opacity, transform',
            }}
          >
            ARE GETTING MARRIED
          </div>
        </div>
      )}
    </div>
  )
}