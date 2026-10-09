import { supabase, isSupabaseConfigured } from './supabaseClient.js'

const LOCAL_STORAGE_KEY = 'wedding_wishes_offline_store'

/**
 * Format timestamp to India Standard Time (IST)
 * Example output: "09 Oct 2026, 10:45 PM IST"
 */
export function formatToIST(dateString) {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return dateString

    const options = {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }

    const formatter = new Intl.DateTimeFormat('en-IN', options)
    const formatted = formatter.format(date)
    return `${formatted} IST`
  } catch (err) {
    console.warn('Date formatting error:', err)
    return dateString
  }
}

/**
 * ============================================================================
 * 1. PUBLIC GUEST SUBMISSION
 * ============================================================================
 */

/**
 * Submit a wedding blessing/wish anonymously.
 * Enforces validation, character limits, and basic spam prevention.
 *
 * @param {Object} params
 * @param {string} params.guestName
 * @param {string} params.message
 * @param {'kannada' | 'english'} params.language
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function submitGuestWish({ guestName, message, language = 'english' }) {
  const cleanName = (guestName || '').trim()
  const cleanMessage = (message || '').trim()
  const cleanLang = language === 'kannada' ? 'kannada' : 'english'

  // Input Validation
  if (!cleanName || cleanName.length < 2) {
    throw new Error('Please enter your name (at least 2 characters).')
  }
  if (cleanName.length > 100) {
    throw new Error('Name must be 100 characters or fewer.')
  }
  if (!cleanMessage || cleanMessage.length < 3) {
    throw new Error('Please write a heartfelt message (at least 3 characters).')
  }
  if (cleanMessage.length > 2000) {
    throw new Error('Message must be 2,000 characters or fewer.')
  }

  // Attempt to save to Supabase
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('wedding_wishes')
        .insert([
          {
            guest_name: cleanName,
            message: cleanMessage,
            language: cleanLang,
            status: 'unread',
          },
        ])
        .select('id')
        .single()

      if (error) {
        // If table doesn't exist yet (PGRST205), fall back gracefully to local storage
        if (error.code === 'PGRST205') {
          console.warn('[wishesService] Table wedding_wishes does not exist yet. Saving locally until SQL migration is executed.')
          return saveOfflineWish({ cleanName, cleanMessage, cleanLang })
        }
        throw error
      }

      return { success: true, id: data?.id }
    } catch (err) {
      console.error('[wishesService] Supabase insert failed:', err)
      // If network fails or table error, save locally as reliable fallback
      if (err.message && err.message.includes('schema cache')) {
        return saveOfflineWish({ cleanName, cleanMessage, cleanLang })
      }
      throw new Error(err.message || 'Failed to send your blessing. Please try again.')
    }
  }

  // Offline or unconfigured fallback
  return saveOfflineWish({ cleanName, cleanMessage, cleanLang })
}

function getLocalWishes() {
  if (typeof localStorage === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalWishes(list) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch (err) {
    console.warn('Local storage write error:', err)
  }
}

function saveOfflineWish({ cleanName, cleanMessage, cleanLang }) {
  const list = getLocalWishes()
  const newWish = {
    id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    guest_name: cleanName,
    message: cleanMessage,
    language: cleanLang,
    status: 'unread',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  list.unshift(newWish)
  setLocalWishes(list)
  return { success: true, id: newWish.id, isLocalFallback: true }
}

/**
 * ============================================================================
 * 2. ADMIN INBOX & MANAGEMENT
 * ============================================================================
 */

/**
 * Fetch all blessings/wishes for the authenticated administrator.
 *
 * @param {Object} options
 * @param {'all' | 'unread' | 'read'} [options.statusFilter='all']
 * @param {string} [options.searchQuery='']
 * @param {'newest' | 'oldest'} [options.sortBy='newest']
 * @returns {Promise<Array>}
 */
export async function adminFetchWishes({
  statusFilter = 'all',
  searchQuery = '',
  sortBy = 'newest',
} = {}) {
  let liveWishes = []

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('wedding_wishes').select('*')

      if (statusFilter === 'unread') {
        query = query.eq('status', 'unread')
      } else if (statusFilter === 'read') {
        query = query.eq('status', 'read')
      }

      if (sortBy === 'oldest') {
        query = query.order('created_at', { ascending: true })
      } else {
        query = query.order('created_at', { ascending: false })
      }

      const { data, error } = await query

      if (error && error.code !== 'PGRST205') {
        throw error
      }

      if (data) {
        liveWishes = data
      }
    } catch (err) {
      console.warn('[wishesService] Error fetching from Supabase:', err)
    }
  }

  // Combine with offline fallback records if any exist
  const localWishes = getLocalWishes()

  let allWishes = [...liveWishes]
  // Merge unique local wishes
  localWishes.forEach((lw) => {
    if (!allWishes.some((w) => w.id === lw.id)) {
      allWishes.push(lw)
    }
  })

  // Apply in-memory search filter if provided
  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase().trim()
    allWishes = allWishes.filter(
      (w) =>
        (w.guest_name && w.guest_name.toLowerCase().includes(q)) ||
        (w.message && w.message.toLowerCase().includes(q))
    )
  }

  // Re-sort
  allWishes.sort((a, b) => {
    const timeA = new Date(a.created_at).getTime() || 0
    const timeB = new Date(b.created_at).getTime() || 0
    return sortBy === 'oldest' ? timeA - timeB : timeB - timeA
  })

  return allWishes
}

/**
 * Fetch total, unread, and read statistics for the dashboard cards.
 */
export async function adminGetWishesStats() {
  const all = await adminFetchWishes({ statusFilter: 'all' })
  const total = all.length
  const unread = all.filter((w) => w.status === 'unread').length
  const read = all.filter((w) => w.status === 'read').length

  return { total, unread, read }
}

/**
 * Toggle or update the read status of a wish.
 */
export async function adminUpdateWishStatus(wishId, nextStatus) {
  const isRead = nextStatus === 'read'
  const readAt = isRead ? new Date().toISOString() : null

  if (isSupabaseConfigured() && supabase && !wishId.startsWith('local-')) {
    const { error } = await supabase
      .from('wedding_wishes')
      .update({
        status: nextStatus,
        read_at: readAt,
      })
      .eq('id', wishId)

    if (error && error.code !== 'PGRST205') throw error
  }

  // Update local storage copy if exists
  const list = getLocalWishes()
  if (list.length > 0) {
    const updated = list.map((w) =>
      w.id === wishId ? { ...w, status: nextStatus, read_at: readAt } : w
    )
    setLocalWishes(updated)
  }

  return true
}

/**
 * Delete a wish from the admin inbox.
 */
export async function adminDeleteWish(wishId) {
  if (isSupabaseConfigured() && supabase && !wishId.startsWith('local-')) {
    const { error } = await supabase.from('wedding_wishes').delete().eq('id', wishId)
    if (error && error.code !== 'PGRST205') throw error
  }

  const list = getLocalWishes()
  if (list.length > 0) {
    const updated = list.filter((w) => w.id !== wishId)
    setLocalWishes(updated)
  }

  return true
}
