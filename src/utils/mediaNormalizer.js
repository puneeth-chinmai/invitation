/**
 * @file mediaNormalizer.js
 * Canonical normalization boundary for Journey Media items.
 *
 * Ensures all media records from the database, test fixtures, or user uploads
 * conform to a single, predictable runtime shape:
 *   - id: string
 *   - type: 'image' | 'video'
 *   - url: string
 *   - thumbnailUrl: string | null
 *   - caption: string | null
 *   - altText: string
 *   - order: number
 *   - storagePath: string | null
 *   - aspectRatio: string | null
 */

/**
 * Normalize a single raw media item from any source.
 *
 * @param {Object} rawItem - Raw database row or fixture object
 * @param {number} [fallbackIndex=0] - Fallback sequential index
 * @returns {Object|null} Normalized MediaItem or null if invalid
 */
export function normalizeMediaItem(rawItem, fallbackIndex = 0) {
  if (!rawItem || typeof rawItem !== 'object') return null

  const id = String(rawItem.id || rawItem.media_id || `media-${fallbackIndex}-${Date.now()}`)
  const url = String(rawItem.url || rawItem.media_url || rawItem.src || '').trim()

  // Determine media type with fallback based on file extension
  let type = rawItem.type || rawItem.media_type
  if (!type && url) {
    const isVideoExt = /\.(mp4|mov|webm|ogg|m4v|quicktime)($|\?)/i.test(url)
    type = isVideoExt ? 'video' : 'image'
  } else if (type) {
    const lower = String(type).toLowerCase().trim()
    if (lower.startsWith('video') || lower.includes('mp4') || lower.includes('quicktime')) {
      type = 'video'
    } else {
      type = 'image'
    }
  } else {
    type = 'image'
  }

  // Resolve thumbnail URL (never accept video URLs as thumbnails)
  let thumbnailUrl =
    rawItem.thumbnailUrl ||
    rawItem.thumbnail_url ||
    rawItem.posterUrl ||
    rawItem.poster_url ||
    null

  if (thumbnailUrl && /\.(mp4|mov|webm|ogg|quicktime)($|\?)/i.test(thumbnailUrl)) {
    thumbnailUrl = null // Reject invalid video URL stored as thumbnail
  }

  const caption = rawItem.caption ? String(rawItem.caption).trim() : null
  const altText = rawItem.altText || rawItem.alt_text || caption || `${type === 'video' ? 'Video' : 'Photograph'} ${fallbackIndex + 1}`

  const orderNum = Number(
    rawItem.order !== undefined && rawItem.order !== null
      ? rawItem.order
      : rawItem.sort_order !== undefined && rawItem.sort_order !== null
        ? rawItem.sort_order
        : fallbackIndex + 1
  )
  const order = Number.isFinite(orderNum) ? orderNum : fallbackIndex + 1

  const storagePath = rawItem.storagePath || rawItem.storage_path || null
  const aspectRatio = rawItem.aspectRatio || rawItem.aspect_ratio || null

  return {
    id,
    type,
    url,
    thumbnailUrl,
    caption,
    altText,
    order,
    storagePath,
    aspectRatio,
  }
}

/**
 * Normalize and sort a collection of media items strictly by their explicit order.
 *
 * @param {Array} list - Raw array of media items
 * @returns {Array} Sorted, normalized media items
 */
export function normalizeMediaList(list = []) {
  if (!Array.isArray(list)) return []
  return list
    .map((item, idx) => normalizeMediaItem(item, idx))
    .filter((item) => Boolean(item && item.url))
    .sort((a, b) => a.order - b.order)
}
