/**
 * calendarUtils.js
 *
 * Calendar integration for Puneeth & Chinmai's wedding events.
 * Targets Indian Standard Time (IST, UTC+05:30).
 *
 * Provides:
 * - Direct Google Calendar prefilled event links
 * - Apple Calendar (iOS / macOS native event sheet URI)
 */

export const WEDDING_EVENTS = {
  reception: {
    id: 'reception',
    name: 'Reception',
    title: 'Puneeth & Chinmai — Wedding Reception',
    // 28 November 2026, 7:00 PM IST = 13:30:00 UTC
    startUtc: '20261128T133000Z',
    displayDate: 'Saturday, 28 November 2026',
    displayTime: '7:00 PM onwards',
    location: 'Gayatri Kalyana Mantapa, Chikkamagaluru, Karnataka, India',
    description:
      'Wedding Reception of Puneeth & Chinmai. Join us with family and friends for an evening of joy, blessings, and celebrations.',
  },
  muhurtam: {
    id: 'muhurtam',
    name: 'Muhurtam',
    title: 'Puneeth & Chinmai — Wedding Muhurtam',
    // 29 November 2026, 9:00 AM IST = 03:30:00 UTC
    startUtc: '20261129T033000Z',
    displayDate: 'Sunday, 29 November 2026',
    displayTime: '9:00 AM',
    location: 'Gayatri Kalyana Mantapa, Chikkamagaluru, Karnataka, India',
    description:
      'Sacred Wedding Muhurtam of Puneeth & Chinmai. Your auspicious presence and blessings are cordially requested.',
  },
}

function formatUtcDate(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    'T' +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    'Z'
  )
}

function escapeIcsText(str) {
  if (!str) return ''
  return str
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

/**
 * Generate a prefilled Google Calendar event URL
 */
export function getGoogleCalendarUrl(event) {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const params = new URLSearchParams({
    text: event.title,
    dates: `${event.startUtc}/${event.startUtc}`,
    details: event.description,
    location: event.location,
  })
  return `${base}&${params.toString()}`
}

/**
 * Generate Apple Calendar data URI that directly opens native Calendar prompt on iOS / macOS
 */
export function getAppleCalendarDataUri(event) {
  const nowUtc = formatUtcDate(new Date())
  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Puneeth & Chinmai Wedding//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${event.id}-${Date.now()}@puneeth-chinmai-wedding`,
    `DTSTAMP:${nowUtc}`,
    `DTSTART:${event.startUtc}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsLines)}`
}
