/**
 * Central Section Registry
 * Single source of truth for all wedding website sections.
 *
 * Four primary public sections:
 * 1. Invitation (Royal Wedding Invitation Scroll)
 * 2. Wedding Details (Schedule, Muhurtam, Venue, Calendar)
 * 3. Our Journey (Relationship Map & Milestones)
 * 4. Blessings & Wishes (Ceremonial Guest Blessings Desk)
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
  {
    id: 'our-journey',
    label: 'Our Journey',
    icon: '❦',
    ariaLabel: 'Our Journey: From Then to Forever',
  },
  {
    id: 'blessings-wishes',
    label: 'Blessings & Wishes',
    icon: '✉',
    ariaLabel: 'Blessings & Wishes for Puneeth and Chinmai',
  },
]

export const DEFAULT_SECTION_ID = 'invitation'
export const DETAILS_SECTION_ID = 'wedding-details'
export const JOURNEY_SECTION_ID = 'our-journey'
export const WISHES_SECTION_ID = 'blessings-wishes'
