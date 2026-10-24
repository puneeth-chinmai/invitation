import React, { useRef, useState, useEffect, useId } from 'react'
import royalSigImage from '../../assets/images/royal_signature_s.png'
import './RoyalSignatureCredit.css'

/**
 * RoyalSignatureCredit
 *
 * Distinctive, royal creator signature for Shreyas G Shetty.
 * Restores and preserves the original, authentic gold calligraphic S artwork asset,
 * maintaining its exact silhouette, proportions, looping curves, and finishing flourish.
 *
 * Real Handwritten Reveal Architecture:
 *   - Line 1: Understated credit: "Designed & developed by" on a single line.
 *   - Line 2: Animated signature link directly underneath.
 *   - Exactly ONE capital S (no duplicate S, domain begins with "hreyasgshetty.in").
 *   - Authentic gold calligraphic S artwork revealed progressively along its actual
 *     pen stroke path via matched SVG mask (no fading all at once, no morphing).
 *   - Immediately after S completes, "hreyasgshetty.in" writes smoothly from left to right.
 *   - Baseline of domain text aligns naturally with the flourish tip (strictly NO underline).
 *   - Complete signature is held for ~2.7s for clear reading and clicking.
 *   - Domain smoothly retracts right to left, leaving compact S, then S smoothly recedes
 *     back to origin with a calm pause before the next cycle.
 *   - Layout space is fully reserved so content never jumps or shifts.
 *   - Triggered once on viewport entry (no restart on minor scroll).
 *   - Strictly NO boxed containers, pills, badges, or separate backgrounds.
 *   - Links to https://www.shreyasgshetty.in/
 */
export default function RoyalSignatureCredit({ className = '' }) {
  const containerRef = useRef(null)
  const rawId = useId()
  const maskId = `royalSigMask_${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  const [isInView, setIsInView] = useState(() => {
    return typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined'
  })

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry && entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -20px 0px',
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`royal-signature-area ${isInView ? 'is-in-view' : ''} ${className}`}
    >
      {/* Line 1: Understated credit wording on a single line */}
      <span className="royal-sig-credit-line">
        Designed &amp; developed by
      </span>

      {/* Line 2: Cohesive distinctive signature reading "Shreyasgshetty.in" */}
      <a
        href="https://www.shreyasgshetty.in/"
        target="_blank"
        rel="noopener noreferrer"
        className="royal-sig-brand-link"
        aria-label="Designed & developed by Shreyas G Shetty - visit portfolio (opens in a new tab)"
        title="Shreyas G Shetty — Portfolio"
      >
        {/* Authentic gold calligraphic S artwork with genuine pen-stroke SVG mask reveal */}
        <span className="royal-sig-s-wrapper" aria-hidden="true">
          <svg
            className="royal-sig-s-svg"
            viewBox="0 0 876 590"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="876"
                height="590"
              >
                <rect width="876" height="590" fill="black" />
                {/* Stroke Path A: Entry loop, upper oval, spine down, and lower loop */}
                <path
                  className="royal-sig-mask-path-a"
                  d="M 380,190 C 424,175 504,115 544,60 C 559,35 534,5 443,5 C 334,5 224,100 179,185 C 159,225 214,250 314,275 C 394,295 434,340 409,415 C 384,490 314,530 234,555 C 154,580 74,583 29,540 C -6,505 -1,430 54,375 C 99,330 154,325 197,339"
                  fill="none"
                  stroke="white"
                  strokeWidth="92"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Stroke Path B: Terminal flourish extending rightward along baseline */}
                <path
                  className="royal-sig-mask-path-b"
                  d="M 264,525 C 344,515 474,505 614,488 C 714,475 804,475 870,509"
                  fill="none"
                  stroke="white"
                  strokeWidth="72"
                  strokeLinecap="round"
                />
              </mask>
            </defs>
            <image
              href={royalSigImage}
              x="0"
              y="0"
              width="876"
              height="590"
              mask={`url(#${maskId})`}
            />
          </svg>
        </span>

        {/* Revealed domain continuation: begins with "hreyasgshetty.in" beside the flourish */}
        <span className="royal-sig-domain-track">
          <span className="royal-sig-domain-text">hreyasgshetty.in</span>
        </span>
      </a>
    </div>
  )
}
