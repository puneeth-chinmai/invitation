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
    // 28 November 2026, 7:30 PM IST = 14:00:00 UTC (No confirmed end time provided)
    startUtc: '20261128T140000Z',
    endUtc: null,
    displayDate: 'Saturday, 28 November 2026',
    displayTime: '7:30 PM onwards',
    location: 'Gayathri Devi Kalyana Mantapa, Chikkamagaluru, Karnataka, India',
    description:
      'Wedding Reception of Puneeth & Chinmai. Join us with family and friends for an evening of joy, blessings, and celebrations.',
  },
  muhurtam: {
    id: 'muhurtam',
    name: 'Muhurtam',
    title: 'Puneeth & Chinmai — Wedding Muhurtam',
    // 29 November 2026, 8:00 AM IST (02:30:00 UTC) to 9:30 AM IST (04:00:00 UTC)
    startUtc: '20261129T023000Z',
    endUtc: '20261129T040000Z',
    displayDate: 'Sunday, 29 November 2026',
    displayTime: '8:00 AM – 9:30 AM',
    location: 'Gayathri Devi Kalyana Mantapa, Chikkamagaluru, Karnataka, India',
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
 * Generate a prefilled Google Calendar event URL.
 * When endUtc is present (Muhurtam 8:00-9:30 AM IST), provides START/END range.
 * When endUtc is not provided (Reception 7:30 PM onwards), preserves start-only representation
 * without silently inventing an artificial duration.
 */
export function getGoogleCalendarUrl(event) {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
  const dates = event.endUtc
    ? `${event.startUtc}/${event.endUtc}`
    : `${event.startUtc}/${event.startUtc}`

  const params = new URLSearchParams({
    text: event.title,
    dates,
    details: event.description,
    location: event.location,
  })
  return `${base}&${params.toString()}`
}

/**
 * Generate Apple Calendar data URI that directly opens native Calendar prompt on iOS / macOS.
 * Per RFC 5545, when endUtc is omitted (Reception), DTEND is omitted to accurately represent
 * an event with unspecified duration rather than an invented end time.
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
    ...(event.endUtc ? [`DTEND:${event.endUtc}`] : []),
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    `LOCATION:${escapeIcsText(event.location)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsLines)}`
}
