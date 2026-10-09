/**
 * @file journeyEvents.js
 * Central Data Model & Store for "Our Journey: From Then to Forever"
 *
 * Designed for user-provided real media (photographs and videos).
 * Each timeline stop represents ONE event.
 * Each event can have 1, 5, 10, or more media items, belonging exclusively to it.
 *
 * @typedef {Object} MediaItem
 * @property {string} id - Unique media identifier (e.g. 'm-eng-01')
 * @property {'image' | 'video'} type - Media type
 * @property {string} url - Direct URL or relative asset path
 * @property {string} [thumbnailUrl] - Poster image for videos or preview thumbnail
 * @property {string} [caption] - Optional caption supplied by the user
 * @property {string} [altText] - Accessible description
 * @property {number} order - Explicit display order sequence (1, 2, 3...)
 * @property {string} [aspectRatio] - Optional aspect ratio ('4/3', '16/9', '1/1', '3/4')
 *
 * @typedef {Object} JourneyEvent
 * @property {string} id - Unique event identifier (e.g. 'event-engagement')
 * @property {string} date - Human-readable display date (e.g. '15 October 2024')
 * @property {string} isoDate - ISO 8601 date string (YYYY-MM-DD) for chronological sorting
 * @property {string} title - Title of the event
 * @property {string} [description] - Short story or description of the occasion
 * @property {string} [location] - Optional location (e.g. 'Bengaluru', 'Chikkamagaluru')
 * @property {string} [coverMediaId] - ID of media item to display as cover on timeline
 * @property {boolean} [published] - Visibility flag (defaults to true)
 * @property {MediaItem[]} media - Collection of photos and videos belonging exclusively to this event
 */

/**
 * Fixed Wedding Day Destination Marker
 * Always positioned at the end of the journey, regardless of how many earlier events are added.
 * Destination marker, not a media event (does not require photos/videos).
 */
export const WEDDING_DESTINATION = Object.freeze({
  id: 'wedding-day-destination',
  date: '29 NOVEMBER 2026',
  isoDate: '2026-11-29',
  title: 'The Wedding Day',
  subtitle: 'And so, forever begins.',
  kannadaBlessing: 'ಮಾಂಗಲ್ಯ ಧಾರಣೆ',
  isDestination: true,
})

/**
 * Production-Facing Journey Events List
 *
 * Real relationship milestones for Puneeth & Chinmai:
 * 1. When the families met and the marriage was fixed.
 * 2. The groom's birthday.
 * 3. The bride's birthday celebration.
 * 4. Café dates.
 * 5. The engagement.
 * 6. The pre-wedding photoshoot (to be added when it happens).
 *
 * Real media items are attached here when the couple supplies their photographs and videos.
 * Empty events display a theme-matched antique parchment placeholder (no AI-generated fake photos).
 */
export const JOURNEY_EVENTS = [
  {
    id: 'event-families-meet',
    date: 'April 2024',
    isoDate: '2024-04-14',
    title: 'Families Met & Marriage Fixed',
    category: 'Family Blessings',
    location: 'Karnataka',
    description:
      'The auspicious day when both families met with warmth, shared blessings, and agreed upon the union of Puneeth & Chinmai.',
    coverMediaId: null,
    published: true,
    media: [],
  },
  {
    id: 'event-groom-birthday',
    date: 'May 2024',
    isoDate: '2024-05-18',
    title: "Groom's Birthday",
    category: 'Celebration',
    location: 'Bengaluru',
    description:
      "Celebrating Puneeth's birthday together with warmth, heartfelt wishes, and joyful moments.",
    coverMediaId: null,
    published: true,
    media: [],
  },
  {
    id: 'event-bride-birthday',
    date: 'August 2024',
    isoDate: '2024-08-22',
    title: "Bride's Birthday Celebration",
    category: 'Celebration',
    location: 'Bengaluru',
    description:
      "A cherished day celebrating Chinmai's birthday filled with sweet memories, smiles, and laughter.",
    coverMediaId: null,
    published: true,
    media: [],
  },
  {
    id: 'event-cafe-date',
    date: 'September 2024',
    isoDate: '2024-09-12',
    title: 'A Special Café Date',
    category: 'Cherished Moments',
    location: 'Bengaluru',
    description:
      'A quiet afternoon over artisanal coffee, heartfelt conversations, and the thousand little moments that deepened their bond.',
    coverMediaId: null,
    published: true,
    media: [],
  },
  {
    id: 'event-engagement',
    date: 'November 2024',
    isoDate: '2024-11-10',
    title: 'The Engagement Ceremony',
    category: 'Sacred Milestone',
    location: 'Chikkamagaluru, Karnataka',
    description:
      'Surrounded by elders, sacred chants, and loved ones, exchanging rings and officially marking the journey to forever.',
    coverMediaId: null,
    published: true,
    media: [],
  },
  {
    id: 'event-pre-wedding-shoot',
    date: 'Pre-Wedding',
    isoDate: '2026-10-15',
    title: 'Pre-Wedding Photoshoot',
    category: 'Upcoming Chapter',
    location: 'Chikkamagaluru, Karnataka',
    description:
      'Pre-wedding memories and photoshoot captures to be added as the wedding date approaches.',
    coverMediaId: null,
    published: false, // Set to true when actual pre-wedding media is uploaded
    media: [],
  },
]

/**
 * Get all published events sorted strictly chronologically.
 * Each event's media collection is sorted strictly by explicit order.
 *
 * @param {JourneyEvent[]} [eventsList] - Optional custom events array (used for testing or CMS data)
 * @returns {JourneyEvent[]} Chronologically sorted array of published events
 */
export function getPublishedEvents(eventsList = JOURNEY_EVENTS) {
  return eventsList
    .filter((event) => event.published !== false)
    .map((event) => ({
      ...event,
      // Ensure media is strictly sorted by explicit order
      media: [...(event.media || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }))
    .sort((a, b) => new Date(a.isoDate).getTime() - new Date(b.isoDate).getTime())
}

/**
 * Get the cover media item for a given event.
 * If coverMediaId is specified, searches the event's media for that ID.
 * Otherwise falls back to the first media item, or null if the event has no media.
 *
 * @param {JourneyEvent} event
 * @returns {MediaItem | null}
 */
export function getEventCoverMedia(event) {
  if (!event || !Array.isArray(event.media) || event.media.length === 0) {
    return null
  }

  if (event.coverMediaId) {
    const found = event.media.find((item) => item.id === event.coverMediaId)
    if (found) return found
  }

  // Fallback to first item by order
  const sorted = [...event.media].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted[0] || null
}

/**
 * Get the fixed wedding destination marker.
 * @returns {typeof WEDDING_DESTINATION}
 */
export function getWeddingDestination() {
  return WEDDING_DESTINATION
}
