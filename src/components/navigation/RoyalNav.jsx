import React from 'react'
import { SECTIONS } from '../../config/sections'
import './RoyalNav.css'

/**
 * RoyalNav
 *
 * Scalable, persistent navigation controller for switching between
 * all registered wedding website sections. Dynamically renders from the
 * central section registry so future sections can be added effortlessly.
 */
export default function RoyalNav({
  sections = SECTIONS,
  activeSectionId = 'invitation',
  onSelectSection,
}) {
  return (
    <nav className="royal-nav-container" aria-label="Wedding Sections Navigation">
      <div className="royal-nav-pill">
        {sections.map((section, index) => {
          const isActive = activeSectionId === section.id
          return (
            <React.Fragment key={section.id}>
              {index > 0 && <div className="royal-nav-divider" />}
              <button
                type="button"
                className={`royal-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSection(section.id)}
                aria-label={section.ariaLabel || section.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="royal-nav-icon">{section.icon}</span>
                <span className="royal-nav-text">{section.label}</span>
              </button>
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
