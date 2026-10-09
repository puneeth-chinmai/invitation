/**
 * @file journeyTestFixtures.js
 * Isolated development fixtures for verifying event-to-media integrity,
 * multi-photo and video playback, explicit display ordering, and empty-state placeholders.
 *
 * All image items use clear, neutral SVG placeholders (NO fake couple photos or stock faces).
 * The video item uses the local test clip (/test-fixtures/test-event-video.mp4).
 */

const makeNeutralSvg = (label, details, color = '#b88628', bg = '#FAF4E8') =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <defs>
    <radialGradient id="grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${bg}" />
      <stop offset="100%" stop-color="#EEDFC6" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grad)" />
  <rect x="24" y="24" width="752" height="552" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="6,4" opacity="0.6" />
  <circle cx="400" cy="220" r="54" fill="none" stroke="${color}" stroke-width="2" />
  <path d="M375 220 L425 220 M400 195 L400 245" stroke="${color}" stroke-width="2" />
  <text x="400" y="340" font-family="Cinzel, serif" font-size="28" font-weight="600" fill="#6d1620" text-anchor="middle">${label}</text>
  <text x="400" y="385" font-family="Cormorant Garamond, serif" font-size="20" font-style="italic" fill="#6a441e" text-anchor="middle">${details}</text>
  <text x="400" y="440" font-family="sans-serif" font-size="12" letter-spacing="2" fill="#8c6527" text-anchor="middle">OFFICIAL TEST FIXTURE • NEUTRAL PLACEHOLDER</text>
</svg>
`)}`

export const TEST_FIXTURE_EVENTS = [
  {
    id: 'test-event-alpha',
    date: '10 January 2024',
    isoDate: '2024-01-10',
    title: 'Test Event Alpha (Multi-Media)',
    location: 'Bengaluru Test Location',
    description:
      'Verification fixture containing 3 photographs and 1 playable video in a strictly specified display sequence.',
    coverMediaId: 'fixture-alpha-01',
    published: true,
    media: [
      {
        id: 'fixture-alpha-01',
        type: 'image',
        url: makeNeutralSvg('Alpha — Photo 1 (Cover)', 'Order: 1 • Selected as Cover Photo'),
        caption: 'Alpha Photo 1 — Sunset view from venue garden',
        altText: 'Neutral test photograph 1 for Alpha event',
        order: 1,
        aspectRatio: '4/3',
      },
      {
        id: 'fixture-alpha-02',
        type: 'image',
        url: makeNeutralSvg('Alpha — Photo 2', 'Order: 2 • Second Photograph'),
        caption: 'Alpha Photo 2 — Traditional floral arrangement',
        altText: 'Neutral test photograph 2 for Alpha event',
        order: 2,
        aspectRatio: '4/3',
      },
      {
        id: 'fixture-alpha-03',
        type: 'video',
        url: '/test-fixtures/test-event-video.mp4',
        thumbnailUrl: makeNeutralSvg('Alpha — Video Poster', 'Order: 3 • Playable Video Clip'),
        caption: 'Alpha Video 1 — Celebration moments clip with native player',
        altText: 'Playable test video clip for Alpha event',
        order: 3,
        aspectRatio: '16/9',
      },
      {
        id: 'fixture-alpha-04',
        type: 'image',
        url: makeNeutralSvg('Alpha — Photo 3', 'Order: 4 • Fourth Media Item'),
        caption: 'Alpha Photo 3 — Handcrafted invitation card design',
        altText: 'Neutral test photograph 3 for Alpha event',
        order: 4,
        aspectRatio: '4/3',
      },
    ],
  },
  {
    id: 'test-event-beta',
    date: '25 June 2024',
    isoDate: '2024-06-25',
    title: 'Test Event Beta (Distinct Media)',
    location: 'Chikkamagaluru Test Venue',
    description:
      'Isolated second event verifying that media from Alpha never leaks or mixes into Beta.',
    coverMediaId: 'fixture-beta-01',
    published: true,
    media: [
      {
        id: 'fixture-beta-01',
        type: 'image',
        url: makeNeutralSvg('Beta — Photo 1 (Cover)', 'Order: 1 • Belongs Exclusively to Beta', '#4A6B53'),
        caption: 'Beta Photo 1 — Coffee estate morning mist',
        altText: 'Neutral test photograph 1 for Beta event',
        order: 1,
        aspectRatio: '4/3',
      },
      {
        id: 'fixture-beta-02',
        type: 'image',
        url: makeNeutralSvg('Beta — Photo 2', 'Order: 2 • Belongs Exclusively to Beta', '#4A6B53'),
        caption: 'Beta Photo 2 — Mountain trail view',
        altText: 'Neutral test photograph 2 for Beta event',
        order: 2,
        aspectRatio: '4/3',
      },
    ],
  },
  {
    id: 'test-event-gamma',
    date: '15 October 2024',
    isoDate: '2024-10-15',
    title: 'Test Event Gamma (Empty Placeholder)',
    location: 'Upcoming Destination',
    description:
      'Testing empty event state where no media has been uploaded yet. Must display a refined, theme-matched placeholder.',
    coverMediaId: null,
    published: true,
    media: [],
  },
]
