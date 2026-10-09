import { supabase, isSupabaseConfigured } from './supabaseClient'
import { JOURNEY_EVENTS } from '../data/journeyEvents'

const STORAGE_BUCKET = 'journey-media'

// Max file sizes
export const MAX_IMAGE_SIZE_BYTES = 15 * 1024 * 1024 // 15MB
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024 // 100MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
]

export const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
]

/**
 * ============================================================================
 * 1. PUBLIC VISITOR METHODS (Used by Our Journey map)
 * ============================================================================
 */

/**
 * Fetch all published events and their ordered media from Supabase.
 * Falls back to local initial events if Supabase is not yet configured.
 *
 * @returns {Promise<{ events: Array, isLiveBackend: boolean, error?: string }>}
 */
export async function fetchPublishedEvents() {
  if (!isSupabaseConfigured() || !supabase) {
    return {
      events: JOURNEY_EVENTS.filter((e) => e.published !== false),
      isLiveBackend: false,
    }
  }

  try {
    // 1. Fetch published events sorted chronologically by iso_date
    const { data: eventsData, error: eventsError } = await supabase
      .from('journey_events')
      .select('*')
      .eq('published', true)
      .order('iso_date', { ascending: true })

    if (eventsError) throw eventsError

    if (!eventsData || eventsData.length === 0) {
      return { events: [], isLiveBackend: true }
    }

    const eventIds = eventsData.map((e) => e.id)

    // 2. Fetch all media for these published events sorted by sort_order
    const { data: mediaData, error: mediaError } = await supabase
      .from('journey_media')
      .select('*')
      .in('event_id', eventIds)
      .order('sort_order', { ascending: true })

    if (mediaError) throw mediaError

    // Group media by event_id
    const mediaByEvent = {}
    eventIds.forEach((id) => {
      mediaByEvent[id] = []
    })

    if (mediaData) {
      mediaData.forEach((item) => {
        if (mediaByEvent[item.event_id]) {
          mediaByEvent[item.event_id].push({
            id: item.id,
            type: item.media_type,
            url: item.url,
            storagePath: item.storage_path,
            thumbnailUrl: item.thumbnail_url,
            caption: item.caption,
            altText: item.alt_text,
            order: item.sort_order,
          })
        }
      })
    }

    // Assemble into the frontend JourneyEvent schema
    const events = eventsData.map((row) => ({
      id: row.id,
      title: row.title,
      date: row.event_date,
      isoDate: row.iso_date,
      category: row.category,
      location: row.location,
      description: row.description,
      coverMediaId: row.cover_media_id,
      published: row.published,
      media: mediaByEvent[row.id] || [],
    }))

    return { events, isLiveBackend: true }
  } catch (err) {
    console.warn('[journeyService] Could not fetch live events from Supabase:', err.message)
    return {
      events: JOURNEY_EVENTS.filter((e) => e.published !== false),
      isLiveBackend: false,
      error: err.message,
    }
  }
}

/**
 * ============================================================================
 * 2. ADMIN AUTHENTICATION
 * ============================================================================
 */

export async function adminSignIn(email, password) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured. Please check your .env configuration.')
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function adminSignOut() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getAdminSession() {
  if (!isSupabaseConfigured() || !supabase) return null
  const { data } = await supabase.auth.getSession()
  return data?.session || null
}

export function onAdminAuthChange(callback) {
  if (!supabase) return () => {}
  const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return () => authListener?.subscription?.unsubscribe()
}

/**
 * ============================================================================
 * 3. ADMIN EVENT CRUD OPERATIONS
 * ============================================================================
 */

/**
 * Fetch all events (including drafts) for the admin dashboard.
 */
export async function adminFetchAllEvents() {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  // 1. Fetch all events sorted by iso_date
  const { data: eventsData, error: eventsError } = await supabase
    .from('journey_events')
    .select('*')
    .order('iso_date', { ascending: true })

  if (eventsError) throw eventsError

  // 2. Fetch all media
  const { data: mediaData, error: mediaError } = await supabase
    .from('journey_media')
    .select('*')
    .order('sort_order', { ascending: true })

  if (mediaError) throw mediaError

  const mediaByEvent = {}
  ;(eventsData || []).forEach((e) => {
    mediaByEvent[e.id] = []
  })

  ;(mediaData || []).forEach((item) => {
    if (mediaByEvent[item.event_id]) {
      mediaByEvent[item.event_id].push({
        id: item.id,
        type: item.media_type,
        url: item.url,
        storagePath: item.storage_path,
        thumbnailUrl: item.thumbnail_url,
        caption: item.caption,
        altText: item.alt_text,
        order: item.sort_order,
      })
    }
  })

  return (eventsData || []).map((row) => ({
    id: row.id,
    title: row.title,
    date: row.event_date,
    isoDate: row.iso_date,
    category: row.category,
    location: row.location,
    description: row.description,
    coverMediaId: row.cover_media_id,
    published: row.published,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    media: mediaByEvent[row.id] || [],
  }))
}

/**
 * Create or update an event.
 */
export async function adminSaveEvent(eventData, isNew = false) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  const payload = {
    id: eventData.id,
    title: eventData.title.trim(),
    event_date: eventData.date.trim(),
    iso_date: eventData.isoDate,
    category: eventData.category ? eventData.category.trim() : null,
    location: eventData.location ? eventData.location.trim() : null,
    description: eventData.description ? eventData.description.trim() : null,
    cover_media_id: eventData.coverMediaId || null,
    published: Boolean(eventData.published),
  }

  if (isNew) {
    const { data, error } = await supabase
      .from('journey_events')
      .insert(payload)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabase
      .from('journey_events')
      .update(payload)
      .eq('id', eventData.id)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

/**
 * Delete an event and all its uploaded storage files.
 */
export async function adminDeleteEvent(eventId) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  // 1. Fetch media for this event to delete their storage files
  const { data: mediaRows } = await supabase
    .from('journey_media')
    .select('storage_path')
    .eq('event_id', eventId)

  if (mediaRows && mediaRows.length > 0) {
    const paths = mediaRows.map((m) => m.storage_path).filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from(STORAGE_BUCKET).remove(paths)
    }
  }

  // 2. Delete event from DB (cascades to journey_media rows)
  const { error } = await supabase
    .from('journey_events')
    .delete()
    .eq('id', eventId)

  if (error) throw error
}

/**
 * Toggle publication status.
 */
export async function adminToggleEventPublish(eventId, published) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('journey_events')
    .update({ published })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * ============================================================================
 * 4. ADMIN MEDIA MANAGEMENT & STORAGE UPLOADS
 * ============================================================================
 */

/**
 * Validate a file before upload.
 */
export function validateUploadFile(file) {
  if (!file) throw new Error('No file provided')

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

  if (!isImage && !isVideo) {
    throw new Error(
      `Unsupported file type "${file.type}". Please upload JPEG, PNG, WEBP, AVIF images or MP4, WebM videos.`
    )
  }

  if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
    const maxMb = Math.round(MAX_IMAGE_SIZE_BYTES / (1024 * 1024))
    throw new Error(`Image is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum allowed is ${maxMb}MB.`)
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
    const maxMb = Math.round(MAX_VIDEO_SIZE_BYTES / (1024 * 1024))
    throw new Error(`Video is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum allowed is ${maxMb}MB.`)
  }

  return { isImage, isVideo, mediaType: isImage ? 'image' : 'video' }
}

/**
 * Upload a media file to Supabase Storage and register in journey_media.
 */
export async function adminUploadMedia(eventId, file, metadata = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { mediaType } = validateUploadFile(file)

  const mediaId = `m-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  const fileExt = file.name.split('.').pop() || (mediaType === 'image' ? 'jpg' : 'mp4')
  const storagePath = `events/${eventId}/${mediaId}.${fileExt}`

  // 1. Upload to storage bucket
  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (uploadError) throw uploadError

  // 2. Get Public URL
  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath)

  const publicUrl = urlData.publicUrl

  // 3. Compute next sort order
  const { data: existingMedia } = await supabase
    .from('journey_media')
    .select('sort_order')
    .eq('event_id', eventId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = existingMedia && existingMedia.length > 0 ? (existingMedia[0].sort_order || 0) + 1 : 1

  // 4. Insert row in journey_media
  const insertPayload = {
    id: mediaId,
    event_id: eventId,
    media_type: mediaType,
    storage_path: storagePath,
    url: publicUrl,
    thumbnail_url: metadata.thumbnailUrl || null,
    caption: metadata.caption || null,
    alt_text: metadata.altText || `${file.name}`,
    sort_order: nextOrder,
  }

  const { data: mediaRow, error: dbError } = await supabase
    .from('journey_media')
    .insert(insertPayload)
    .select()
    .single()

  if (dbError) {
    // Clean up uploaded file if DB record insertion fails
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
    throw dbError
  }

  // 5. If event currently has no cover_media_id, set this first image as cover automatically
  if (mediaType === 'image') {
    const { data: currentEvent } = await supabase
      .from('journey_events')
      .select('cover_media_id')
      .eq('id', eventId)
      .single()

    if (currentEvent && !currentEvent.cover_media_id) {
      await supabase
        .from('journey_events')
        .update({ cover_media_id: mediaId })
        .eq('id', eventId)
    }
  }

  return {
    id: mediaRow.id,
    type: mediaRow.media_type,
    url: mediaRow.url,
    storagePath: mediaRow.storage_path,
    thumbnailUrl: mediaRow.thumbnail_url,
    caption: mediaRow.caption,
    altText: mediaRow.alt_text,
    order: mediaRow.sort_order,
  }
}

/**
 * Delete a media item.
 */
export async function adminDeleteMedia(eventId, mediaId, storagePath) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  // 1. Remove from storage
  if (storagePath) {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
  }

  // 2. Delete from DB
  const { error } = await supabase
    .from('journey_media')
    .delete()
    .eq('id', mediaId)

  if (error) throw error

  // 3. If this was the cover media, reset cover_media_id to null or another image
  const { data: eventRow } = await supabase
    .from('journey_events')
    .select('cover_media_id')
    .eq('id', eventId)
    .single()

  if (eventRow?.cover_media_id === mediaId) {
    const { data: remainingImages } = await supabase
      .from('journey_media')
      .select('id')
      .eq('event_id', eventId)
      .eq('media_type', 'image')
      .order('sort_order', { ascending: true })
      .limit(1)

    const newCoverId = remainingImages && remainingImages.length > 0 ? remainingImages[0].id : null
    await supabase
      .from('journey_events')
      .update({ cover_media_id: newCoverId })
      .eq('id', eventId)
  }
}

/**
 * Set an event's cover media item.
 */
export async function adminSetCoverMedia(eventId, mediaId) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('journey_events')
    .update({ cover_media_id: mediaId })
    .eq('id', eventId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Persist explicit media order for an event.
 */
export async function adminReorderMedia(eventId, orderedMediaIds) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  // Update each item's sort_order sequentially or in parallel
  const updates = orderedMediaIds.map((id, index) =>
    supabase
      .from('journey_media')
      .update({ sort_order: index + 1 })
      .eq('id', id)
      .eq('event_id', eventId)
  )

  const results = await Promise.all(updates)
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}

/**
 * Update media caption and alt text.
 */
export async function adminUpdateMediaMeta(mediaId, { caption, altText }) {
  if (!isSupabaseConfigured() || !supabase) {
    throw new Error('Supabase is not configured.')
  }

  const { data, error } = await supabase
    .from('journey_media')
    .update({
      caption: caption !== undefined ? caption : null,
      alt_text: altText !== undefined ? altText : null,
    })
    .eq('id', mediaId)
    .select()
    .single()

  if (error) throw error
  return data
}
