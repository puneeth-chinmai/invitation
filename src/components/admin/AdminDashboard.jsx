import React, { useState, useEffect, useCallback } from 'react'
import {
  adminFetchAllEvents,
  adminDeleteEvent,
  adminToggleEventPublish,
} from '../../services/journeyService'
import AdminEventEditor from './AdminEventEditor'
import EventGalleryModal from '../journey/EventGalleryModal'
import AdminWishesInbox from './AdminWishesInbox'
import { adminGetWishesStats } from '../../services/wishesService'

/**
 * AdminDashboard
 *
 * Primary content management overview for Puneeth & Chinmai's relationship milestones.
 * Displays:
 *   - Overview metric counters (Total, Published, Drafts, Media)
 *   - Chronological table of all milestone events
 *   - Publication controls (Publish / Unpublish)
 *   - Direct access to event creation and media management
 */
export default function AdminDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState(null)
  const [editingEvent, setEditingEvent] = useState(null)
  const [isCreatingNew, setIsCreatingNew] = useState(false)
  const [previewEvent, setPreviewEvent] = useState(null)

  // Sub-Navigation: 'milestones' | 'wishes'
  const [activeTab, setActiveTab] = useState('milestones')
  const [unreadWishesCount, setUnreadWishesCount] = useState(0)

  useEffect(() => {
    adminGetWishesStats()
      .then((s) => setUnreadWishesCount(s.unread || 0))
      .catch(() => {})
  }, [activeTab])

  const loadEvents = useCallback(async () => {
    setLoading(true)
    setErrorMsg(null)
    try {
      const data = await adminFetchAllEvents()
      setEvents(data)
    } catch (err) {
      setErrorMsg(err.message || 'Failed to fetch events from database.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    async function init() {
      setLoading(true)
      try {
        const data = await adminFetchAllEvents()
        if (active) setEvents(data)
      } catch (err) {
        if (active) setErrorMsg(err.message || 'Failed to fetch events from database.')
      } finally {
        if (active) setLoading(false)
      }
    }
    init()
    return () => {
      active = false
    }
  }, [])


  // Toggle publication status
  const handleTogglePublish = async (event) => {
    const nextStatus = !event.published
    try {
      await adminToggleEventPublish(event.id, nextStatus)
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, published: nextStatus } : e))
      )
    } catch (err) {
      alert('Could not update publication status: ' + err.message)
    }
  }

  // Delete event with confirmation
  const handleDeleteEvent = async (eventId, title) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete "${title}" and all its uploaded media?`
      )
    ) {
      return
    }

    try {
      await adminDeleteEvent(eventId)
      setEvents((prev) => prev.filter((e) => e.id !== eventId))
    } catch (err) {
      alert('Failed to delete event: ' + err.message)
    }
  }

  // Calculate statistics
  const totalEvents = events.length
  const publishedCount = events.filter((e) => e.published).length
  const draftCount = totalEvents - publishedCount
  const totalMedia = events.reduce((sum, e) => sum + (e.media?.length || 0), 0)

  // If currently editing or creating an event, show the editor view
  if (editingEvent || isCreatingNew) {
    return (
      <div className="admin-content-wrap">
        <AdminEventEditor
          event={editingEvent}
          isNew={isCreatingNew}
          onSaveSuccess={() => {
            setEditingEvent(null)
            setIsCreatingNew(false)
            loadEvents()
          }}
          onCancel={() => {
            setEditingEvent(null)
            setIsCreatingNew(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="admin-content-wrap">
      {/* Sub-Navigation: Milestones vs Blessings & Wishes */}
      <nav className="admin-tab-nav" role="tablist" aria-label="Admin Sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'milestones'}
          className={`admin-tab-btn ${activeTab === 'milestones' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('milestones')}
        >
          <span aria-hidden="true">❦</span>
          <span>Relationship Milestones</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'wishes'}
          className={`admin-tab-btn ${activeTab === 'wishes' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('wishes')}
        >
          <span aria-hidden="true">✉</span>
          <span>Blessings &amp; Wishes</span>
          {unreadWishesCount > 0 && (
            <span className="admin-tab-badge" title={`${unreadWishesCount} unread blessings`}>
              {unreadWishesCount}
            </span>
          )}
        </button>
      </nav>

      {activeTab === 'wishes' ? (
        <AdminWishesInbox />
      ) : (
        <>
          {/* Overview Stat Counters */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="stat-label">Total Milestones</span>
              <span className="stat-value">{totalEvents}</span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Published</span>
              <span className="stat-value" style={{ color: '#137333' }}>
                {publishedCount}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Drafts</span>
              <span className="stat-value" style={{ color: '#b06000' }}>
                {draftCount}
              </span>
            </div>
            <div className="admin-stat-card">
              <span className="stat-label">Total Media Items</span>
              <span className="stat-value">{totalMedia}</span>
            </div>
          </div>

          {errorMsg && <div className="admin-notice error">{errorMsg}</div>}

          {/* Main Events List Card */}
          <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h2 className="admin-card-title">Relationship Milestones</h2>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#6a441e' }}>
              Events are sorted chronologically by date. The Wedding Day remains fixed at the end.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="admin-btn secondary"
              onClick={loadEvents}
              title="Refresh"
            >
              ↻ Refresh
            </button>
            <button
              type="button"
              className="admin-btn primary"
              onClick={() => setIsCreatingNew(true)}
            >
              + Add Milestone
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8c6527' }}>
            Loading relationship milestones from database...
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6a441e' }}>
            No events found in the database. Click "+ Add Milestone" to create the first milestone.
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th style={{ width: '48px' }}>Cover</th>
                  <th>Date</th>
                  <th>Title &amp; Category</th>
                  <th>Status</th>
                  <th>Media Count</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const coverItem =
                    event.media?.find((m) => m.id === event.coverMediaId) ||
                    event.media?.[0]

                  return (
                    <tr key={event.id}>
                      <td>
                        {coverItem ? (
                          <img
                            src={coverItem.url}
                            alt=""
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                              border: '1.5px solid #b88628',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: '#FAF4E8',
                              border: '1px dashed #b88628',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                            }}
                          >
                            📷
                          </div>
                        )}
                      </td>

                      <td style={{ whiteSpace: 'nowrap' }}>
                        <strong style={{ color: '#6d1620', fontFamily: 'Cinzel' }}>
                          {event.date}
                        </strong>
                        <div style={{ fontSize: '11px', color: '#8c6527' }}>
                          {event.isoDate}
                        </div>
                      </td>

                      <td>
                        <strong style={{ color: '#3b1509' }}>{event.title}</strong>
                        {event.category && (
                          <div style={{ fontSize: '11px', color: '#8c6527' }}>
                            {event.category}
                          </div>
                        )}
                        {event.location && (
                          <div style={{ fontSize: '11px', color: '#6a441e', fontStyle: 'italic' }}>
                            📍 {event.location}
                          </div>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status-pill ${event.published ? 'published' : 'draft'}`}
                        >
                          {event.published ? '● Published' : '○ Draft'}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600 }}>
                          {event.media?.length || 0}
                        </span>{' '}
                        items
                      </td>

                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="admin-btn secondary"
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            onClick={() => setPreviewEvent(event)}
                            title="Preview Public Gallery"
                          >
                            👁 Preview
                          </button>

                          <button
                            type="button"
                            className="admin-btn secondary"
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            onClick={() => handleTogglePublish(event)}
                          >
                            {event.published ? 'Unpublish' : 'Publish'}
                          </button>

                          <button
                            type="button"
                            className="admin-btn primary"
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            onClick={() => setEditingEvent(event)}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-btn danger"
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            onClick={() => handleDeleteEvent(event.id, event.title)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Gallery Modal */}
      {previewEvent && (
        <EventGalleryModal
          event={previewEvent}
          onClose={() => setPreviewEvent(null)}
        />
      )}
        </>
      )}
    </div>
  )
}
