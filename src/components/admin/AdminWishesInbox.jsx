import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  adminFetchWishes,
  adminGetWishesStats,
  adminUpdateWishStatus,
  adminDeleteWish,
  formatToIST,
} from '../../services/wishesService'
import './AdminWishesInbox.css'

const ITEMS_PER_PAGE = 15

/**
 * AdminWishesInbox
 *
 * Dedicated private inbox component for Puneeth & Chinmai to review,
 * read, and cherish all blessings and prayers submitted by guests.
 *
 * Designed mobile-first with touch-friendly cards and an elegant reading modal.
 */
export default function AdminWishesInbox() {
  const [wishes, setWishes] = useState([])
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 })
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'unread' | 'read'
  const [sortBy, setSortBy] = useState('newest') // 'newest' | 'oldest'

  // Selected wish for reading sheet modal
  const [selectedWish, setSelectedWish] = useState(null)
  const [actionLoadingId, setActionLoadingId] = useState(null)

  // Pagination
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE)

  const loadData = useCallback(async () => {
    try {
      const [fetchedWishes, fetchedStats] = await Promise.all([
        adminFetchWishes({
          statusFilter,
          searchQuery,
          sortBy,
        }),
        adminGetWishesStats(),
      ])

      setWishes(fetchedWishes)
      setStats(fetchedStats)
    } catch (err) {
      console.error('Failed to load blessings inbox:', err)
      setErrorMsg(err.message || 'Failed to fetch wishes from database.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, searchQuery, sortBy])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Quick toggle status (read <-> unread)
  const handleToggleStatus = async (wish, e) => {
    if (e) e.stopPropagation()
    const nextStatus = wish.status === 'unread' ? 'read' : 'unread'
    setActionLoadingId(wish.id)

    try {
      await adminUpdateWishStatus(wish.id, nextStatus)

      setWishes((prev) =>
        prev.map((w) =>
          w.id === wish.id
            ? { ...w, status: nextStatus, read_at: nextStatus === 'read' ? new Date().toISOString() : null }
            : w
        )
      )

      setStats((prev) => {
        const isNowRead = nextStatus === 'read'
        return {
          ...prev,
          unread: isNowRead ? Math.max(0, prev.unread - 1) : prev.unread + 1,
          read: isNowRead ? prev.read + 1 : Math.max(0, prev.read - 1),
        }
      })

      if (selectedWish?.id === wish.id) {
        setSelectedWish((prev) => ({
          ...prev,
          status: nextStatus,
          read_at: nextStatus === 'read' ? new Date().toISOString() : null,
        }))
      }
    } catch (err) {
      alert('Could not update status: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Delete wish
  const handleDeleteWish = async (wish, e) => {
    if (e) e.stopPropagation()
    if (!window.confirm(`Permanently delete the blessing from "${wish.guest_name}"?`)) {
      return
    }

    setActionLoadingId(wish.id)
    try {
      await adminDeleteWish(wish.id)

      setWishes((prev) => prev.filter((w) => w.id !== wish.id))
      setStats((prev) => {
        const wasUnread = wish.status === 'unread'
        return {
          total: Math.max(0, prev.total - 1),
          unread: wasUnread ? Math.max(0, prev.unread - 1) : prev.unread,
          read: !wasUnread ? Math.max(0, prev.read - 1) : prev.read,
        }
      })

      if (selectedWish?.id === wish.id) {
        setSelectedWish(null)
      }
    } catch (err) {
      alert('Failed to delete wish: ' + err.message)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Open reading view modal & auto-mark as read if unread
  const handleOpenReadingView = (wish) => {
    setSelectedWish(wish)
    if (wish.status === 'unread') {
      adminUpdateWishStatus(wish.id, 'read')
        .then(() => {
          setWishes((prev) =>
            prev.map((w) =>
              w.id === wish.id
                ? { ...w, status: 'read', read_at: new Date().toISOString() }
                : w
            )
          )
          setStats((prev) => ({
            ...prev,
            unread: Math.max(0, prev.unread - 1),
            read: prev.read + 1,
          }))
        })
        .catch(() => {})
    }
  }

  const paginatedWishes = useMemo(() => {
    return wishes.slice(0, visibleCount)
  }, [wishes, visibleCount])

  return (
    <div className="admin-content-wrap">
      {/* 1. Overview Metric Counters */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-label">Total Blessings</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Unread Messages</span>
          <span className="stat-value" style={{ color: '#6d1620' }}>
            {stats.unread}
          </span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Read Messages</span>
          <span className="stat-value" style={{ color: '#137333' }}>
            {stats.read}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="admin-notice error">
          <span>{errorMsg}</span>
          <button
            type="button"
            className="admin-btn secondary"
            style={{ marginLeft: '12px', padding: '4px 8px', fontSize: '10px' }}
            onClick={loadData}
          >
            ↻ Retry
          </button>
        </div>
      )}

      {/* 2. Main Inbox Card */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Blessings &amp; Wishes Inbox</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6a441e' }}>
              Private prayers and messages sent by wedding guests. Only visible to you.
            </p>
          </div>

          <button
            type="button"
            className="admin-btn secondary"
            onClick={loadData}
            title="Refresh inbox"
          >
            ↻ Refresh
          </button>
        </div>

        {/* 3. Toolbar: Search, Status Filter Pills, Sort */}
        <div className="admin-inbox-toolbar">
          <div className="admin-search-wrap">
            <span className="admin-search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by name or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search blessings"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div className="admin-filter-pills" role="tablist" aria-label="Filter status">
              <button
                type="button"
                className={`admin-filter-pill ${statusFilter === 'all' ? 'is-active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                All ({stats.total})
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${statusFilter === 'unread' ? 'is-active' : ''}`}
                onClick={() => setStatusFilter('unread')}
              >
                Unread ({stats.unread})
              </button>
              <button
                type="button"
                className={`admin-filter-pill ${statusFilter === 'read' ? 'is-active' : ''}`}
                onClick={() => setStatusFilter('read')}
              >
                Read ({stats.read})
              </button>
            </div>

            <select
              className="admin-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort order"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* 4. Messages List / Loading / Empty */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8c6527' }}>
            Loading blessings from database...
          </div>
        ) : wishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#6a441e' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✉</div>
            <p style={{ fontFamily: 'Cinzel', fontSize: '15px', color: '#6d1620', margin: '0 0 4px' }}>
              No Blessings Found
            </p>
            <p style={{ fontSize: '13px', margin: 0, opacity: 0.85 }}>
              {searchQuery
                ? 'No messages match your search. Try clearing the filter.'
                : 'When guests send their prayers and blessings, they will appear here privately.'}
            </p>
          </div>
        ) : (
          <div className="admin-wishes-list">
            {paginatedWishes.map((wish) => {
              const isUnread = wish.status === 'unread'
              const isLoadingThis = actionLoadingId === wish.id

              return (
                <article
                  key={wish.id}
                  className={`admin-wish-card ${isUnread ? 'is-unread' : ''}`}
                  onClick={() => handleOpenReadingView(wish)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleOpenReadingView(wish)
                    }
                  }}
                  aria-label={`Blessing from ${wish.guest_name}, ${wish.status}`}
                >
                  <div className="admin-wish-card-header">
                    <div className="admin-wish-sender">
                      {isUnread && <span className="admin-wish-unread-dot" title="Unread" />}
                      <span>{wish.guest_name}</span>
                    </div>

                    <div className="admin-wish-meta-badges">
                      <span className="admin-badge-lang">
                        {wish.language === 'kannada' ? 'ಕನ್ನಡ' : 'English'}
                      </span>
                      <span className={`admin-badge-status ${wish.status}`}>
                        {wish.status}
                      </span>
                    </div>
                  </div>

                  <span className="admin-wish-time">
                    {formatToIST(wish.created_at)}
                  </span>

                  <p className="admin-wish-snippet">
                    {wish.message}
                  </p>

                  <div className="admin-wish-card-footer">
                    <span style={{ fontSize: '11px', color: '#8c6527', fontFamily: 'Cinzel', fontWeight: 600 }}>
                      Click to read full letter →
                    </span>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '4px 8px', fontSize: '10px' }}
                        onClick={(e) => handleToggleStatus(wish, e)}
                        disabled={isLoadingThis}
                        title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                      >
                        {isUnread ? '✓ Mark Read' : '↺ Unread'}
                      </button>

                      <button
                        type="button"
                        className="admin-btn danger"
                        style={{ padding: '4px 8px', fontSize: '10px' }}
                        onClick={(e) => handleDeleteWish(wish, e)}
                        disabled={isLoadingThis}
                        title="Delete Wish"
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}

            {/* Pagination / Load More */}
            {wishes.length > visibleCount && (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                >
                  Load More ({wishes.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ===================================================
          5. READING VIEW MODAL (COMFORTABLE READING DIALOG)
      =================================================== */}
      {selectedWish && (
        <div
          className="admin-modal-overlay"
          onClick={() => setSelectedWish(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reading-wish-sender"
        >
          <div
            className="admin-modal-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="admin-modal-header">
              <div>
                <h3 id="reading-wish-sender" className="admin-modal-title">
                  {selectedWish.guest_name}
                </h3>
                <div className="admin-modal-meta">
                  <span>{formatToIST(selectedWish.created_at)}</span>
                  <span style={{ margin: '0 6px' }}>·</span>
                  <span className="admin-badge-lang">
                    {selectedWish.language === 'kannada' ? 'ಕನ್ನಡ' : 'English'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="admin-btn secondary"
                style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
                onClick={() => setSelectedWish(null)}
                aria-label="Close message"
              >
                ✕
              </button>
            </div>

            {/* Modal Body: Full Message */}
            <div className="admin-modal-body">
              <div className="admin-modal-message-box">
                {selectedWish.message}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="admin-modal-footer">
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="admin-btn secondary"
                  onClick={(e) => handleToggleStatus(selectedWish, e)}
                  disabled={actionLoadingId === selectedWish.id}
                >
                  {selectedWish.status === 'unread' ? '✓ Mark as Read' : '↺ Mark as Unread'}
                </button>

                <button
                  type="button"
                  className="admin-btn danger"
                  onClick={(e) => handleDeleteWish(selectedWish, e)}
                  disabled={actionLoadingId === selectedWish.id}
                >
                  Delete
                </button>
              </div>

              <button
                type="button"
                className="admin-btn primary"
                onClick={() => setSelectedWish(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
