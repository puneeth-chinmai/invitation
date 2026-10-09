import React from 'react'
import { SECTIONS } from '../../config/sections'
import './RoyalNav.css'

/**
 * RoyalNav
 *
 * Responsive, scalable royal navigation controller for Puneeth & Chinmai's wedding website.
 *
 * Responsive behavior:
 * - Desktop: displays all 4 section icons and full labels with refined gold separators.
 * - Mobile: compact icon-based navigation fitting completely within the mobile viewport
 *   without horizontal scrolling. The currently active section expands to show its icon
 *   and full section name; the three inactive sections collapse to comfortable, tappable icons.
 */
export default function RoyalNav({
  sections = SECTIONS,
  activeSectionId = 'invitation',
  onSelectSection,
}) {
  return (
    <nav className="royal-nav-container" aria-label="Wedding Sections Navigation">
      <div className="royal-nav-pill" role="tablist">
        {sections.map((section, index) => {
          const isActive = activeSectionId === section.id
          return (
            <React.Fragment key={section.id}>
              {index > 0 && <div className="royal-nav-divider" aria-hidden="true" />}
              <button
                type="button"
                className={`royal-nav-btn ${isActive ? 'active' : ''}`}
                onClick={() => onSelectSection(section.id)}
                aria-label={section.ariaLabel || section.label}
                title={section.label}
                aria-current={isActive ? 'page' : undefined}
                role="tab"
                aria-selected={isActive}
              >
                <span className="royal-nav-icon" aria-hidden="true">
                  {section.icon}
                </span>
                <span className="royal-nav-text">{section.label}</span>
              </button>
            </React.Fragment>
          )
        })}
      </div>
    </nav>
  )
}
