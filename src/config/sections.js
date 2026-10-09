/**
 * Central Section Registry
 * Single source of truth for all wedding website sections.
 *
 * To add a future section (e.g. 'our-journey', 'memories-archive'):
 * 1. Add an entry to SECTIONS with its id, label, and icon.
 * 2. Associate its component in App.jsx.
 * The navigation (RoyalNav) will dynamically render all registered sections!
 */

export const SECTIONS = [
  {
    id: 'invitation',
    label: 'Invitation',
    icon: '📜',
    ariaLabel: 'Royal Wedding Invitation Scroll',
  },
  {
    id: 'wedding-details',
    label: 'Wedding Details',
    icon: '𑁍',
    ariaLabel: 'Wedding Details and Schedule',
  },
  // Ready for upcoming sections:
  // {
  //   id: 'our-journey',
  //   label: 'Our Journey',
  //   icon: '❦',
  //   ariaLabel: 'Our Story and Journey',
  // },
]

export const DEFAULT_SECTION_ID = 'invitation'
export const DETAILS_SECTION_ID = 'wedding-details'
