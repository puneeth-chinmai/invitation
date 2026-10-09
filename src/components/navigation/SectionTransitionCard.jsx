import React from 'react'
import './SectionTransitionCard.css'

/**
 * SectionTransitionCard
 *
 * Contextual navigation card placed at the culmination of a section
 * to seamlessly guide the guest to the next chapter of the wedding celebration.
 *
 * Features:
 * - Royal ivory and antique gold parchment styling with corner flourishes
 * - Refined serif typography (Cinzel & Cormorant Garamond)
 * - Micro-interactive CTA button with subtle directional arrow glide
 * - Fully accessible keyboard and screen-reader support
 */
export default function SectionTransitionCard({
  kicker,
  title,
  description,
  ctaText,
  ctaIcon = '→',
  motifIcon,
  onNavigate,
}) {
  return (
    <div className="section-transition-card" role="region" aria-label={title}>
      {/* Antique Corner Flourishes */}
      <span className="transition-corner tl" aria-hidden="true">❖</span>
      <span className="transition-corner tr" aria-hidden="true">❖</span>
      <span className="transition-corner bl" aria-hidden="true">❖</span>
      <span className="transition-corner br" aria-hidden="true">❖</span>

      {/* Optional Top Motif */}
      {motifIcon && (
        <div className="transition-motif-badge" aria-hidden="true">
          <span className="transition-motif-glyph">{motifIcon}</span>
        </div>
      )}

      {kicker && <span className="transition-kicker">{kicker}</span>}
      <h3 className="transition-title">{title}</h3>
      <p className="transition-description">{description}</p>

      <button
        type="button"
        className="transition-cta-button"
        onClick={onNavigate}
        aria-label={`${ctaText} (${title})`}
      >
        <span className="transition-cta-label">{ctaText}</span>
        <span className="transition-cta-icon" aria-hidden="true">{ctaIcon}</span>
      </button>
    </div>
  )
}
