import React, { useState } from 'react'
import {
  adminSaveEvent,
  adminUploadMedia,
  adminDeleteMedia,
  adminSetCoverMedia,
  adminReorderMedia,
  adminUpdateMediaMeta,
} from '../../services/journeyService'
import EventGalleryModal from '../journey/EventGalleryModal'

/**
 * AdminEventEditor
 *
 * Dedicated editor for an individual event and its media collection.
 * Supports:
 *   - Metadata editing (date, ISO date, title, category, location, description, published)
 *   - Multiple photo & video uploads with progress indicators
 *   - Cover photograph selection
 *   - Media reordering (Move Up / Down)
 *   - Caption and alt text editing
 *   - Instant preview of the public gallery modal
 */
export default function AdminEventEditor({
  event: initialEvent,
  isNew = false,
  onSaveSuccess,
  onCancel,
}) {
  const [formData, setFormData] = useState(() => ({
    id: initialEvent?.id || `event-${Date.now()}`,
    title: initialEvent?.title || '',
    date: initialEvent?.date || '',
    isoDate: initialEvent?.isoDate || new Date().toISOString().split('T')[0],
    category: initialEvent?.category || '',
    location: initialEvent?.location || '',
    description: initialEvent?.description || '',
    published: initialEvent?.published !== undefined ? initialEvent.published : true,
    coverMediaId: initialEvent?.coverMediaId || null,
  }))


  const [mediaList, setMediaList] = useState(initialEvent?.media || [])
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState(null)
  const [uploadProgress, setUploadProgress] = useState([])
  const [previewOpen, setPreviewOpen] = useState(false)

  // Handle Form Input Changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Save Event Metadata
  const handleSaveEvent = async (e) => {
    e?.preventDefault()
    if (!formData.title || !formData.date || !formData.isoDate) {
      setStatusMsg({ type: 'error', text: 'Title, Date, and ISO Date are required.' })
      return
    }

    setSaving(true)
    setStatusMsg(null)
    try {
      await adminSaveEvent(formData, isNew)
      setStatusMsg({ type: 'success', text: 'Event saved successfully!' })
      if (onSaveSuccess) {
        onSaveSuccess({ ...formData, media: mediaList })
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save event.' })
    } finally {
      setSaving(false)
    }
  }

  // Multi-File Upload Handler
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setStatusMsg(null)
    const newProgressList = files.map((f, i) => ({
      name: f.name,
      status: 'uploading',
      id: `${f.name}-${i}`,
    }))
    setUploadProgress(newProgressList)

    const newlyUploaded = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const item = await adminUploadMedia(formData.id, file)
        newlyUploaded.push(item)

        setUploadProgress((prev) =>
          prev.map((p, idx) => (idx === i ? { ...p, status: 'success' } : p))
        )
      } catch (err) {
        setUploadProgress((prev) =>
          prev.map((p, idx) =>
            idx === i ? { ...p, status: 'error', error: err.message } : p
          )
        )
      }
    }

    // Refresh local media list
    const updatedMedia = [...mediaList, ...newlyUploaded]
    setMediaList(updatedMedia)

    // Automatically set cover if none was set
    if (!formData.coverMediaId && newlyUploaded.length > 0) {
      const firstImg = newlyUploaded.find((m) => m.type === 'image')
      if (firstImg) {
        setFormData((prev) => ({ ...prev, coverMediaId: firstImg.id }))
      }
    }

    e.target.value = ''
  }

  // Delete Media
  const handleDeleteMedia = async (mediaId, storagePath) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) return

    try {
      await adminDeleteMedia(formData.id, mediaId, storagePath)
      const updated = mediaList.filter((m) => m.id !== mediaId)
      setMediaList(updated)

      if (formData.coverMediaId === mediaId) {
        const nextImg = updated.find((m) => m.type === 'image')
        setFormData((prev) => ({ ...prev, coverMediaId: nextImg?.id || null }))
      }
      setStatusMsg({ type: 'success', text: 'Media item removed.' })
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to delete media.' })
    }
  }

  // Set Cover Media
  const handleSetCover = async (mediaId) => {
    try {
      await adminSetCoverMedia(formData.id, mediaId)
      setFormData((prev) => ({ ...prev, coverMediaId: mediaId }))
      setStatusMsg({ type: 'success', text: 'Cover photo updated.' })
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to set cover photo.' })
    }
  }

  // Move Media Item Up or Down
  const handleMoveMedia = async (index, direction) => {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= mediaList.length) return

    const reordered = [...mediaList]
    const temp = reordered[index]
    reordered[index] = reordered[targetIndex]
    reordered[targetIndex] = temp

    // Update order values
    reordered.forEach((m, idx) => {
      m.order = idx + 1
    })

    setMediaList(reordered)

    try {
      const orderedIds = reordered.map((m) => m.id)
      await adminReorderMedia(formData.id, orderedIds)
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to persist media ordering: ' + err.message })
    }
  }

  // Update Caption
  const handleUpdateCaption = async (mediaId, caption) => {
    try {
      await adminUpdateMediaMeta(mediaId, { caption })
      setMediaList((prev) =>
        prev.map((m) => (m.id === mediaId ? { ...m, caption } : m))
      )
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to update caption: ' + (err.message || 'Error') })
    }

  }

  return (
    <div className="admin-editor-wrap">
      {/* Action Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <button
            type="button"
            className="admin-btn secondary"
            onClick={onCancel}
            style={{ marginBottom: '8px' }}
          >
            ← Back to All Events
          </button>
          <h2 className="admin-card-title">
            {isNew ? 'Create New Milestone Event' : `Edit: ${formData.title}`}
          </h2>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="admin-btn secondary"
            onClick={() => setPreviewOpen(true)}
          >
            👁 Preview Public Gallery
          </button>

          <button
            type="button"
            className="admin-btn primary"
            onClick={handleSaveEvent}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`admin-notice ${statusMsg.type}`}>{statusMsg.text}</div>
      )}

      {/* ===================================================
          1. EVENT METADATA FORM
      =================================================== */}
      <div className="admin-card">
        <h3
          style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '14px',
            color: '#6d1620',
            marginBottom: '16px',
          }}
        >
          Event Details
        </h3>

        <form onSubmit={handleSaveEvent} className="admin-form-grid">
          <div className="admin-field">
            <label className="admin-label" htmlFor="title">
              Event Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className="admin-input"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. The Engagement Ceremony"
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="date">
              Display Date *
            </label>
            <input
              id="date"
              name="date"
              type="text"
              className="admin-input"
              value={formData.date}
              onChange={handleInputChange}
              placeholder="e.g. November 2024 or 10 Nov 2024"
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="isoDate">
              Chronological Date (YYYY-MM-DD) *
            </label>
            <input
              id="isoDate"
              name="isoDate"
              type="date"
              className="admin-input"
              value={formData.isoDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="category">
              Category / Milestone Tag
            </label>
            <input
              id="category"
              name="category"
              type="text"
              className="admin-input"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g. Sacred Milestone, Family Blessings"
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              className="admin-input"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. Chikkamagaluru, Karnataka"
            />
          </div>

          <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
            <label className="admin-label" htmlFor="description">
              Story / Description
            </label>
            <textarea
              id="description"
              name="description"
              className="admin-textarea"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="A few sentences describing the cherished moments of this occasion..."
            />
          </div>

          <div
            className="admin-field"
            style={{
              gridColumn: '1 / -1',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <input
              id="published"
              name="published"
              type="checkbox"
              checked={formData.published}
              onChange={handleInputChange}
              style={{ width: '18px', height: '18px', accentColor: '#6d1620' }}
            />
            <label
              htmlFor="published"
              className="admin-label"
              style={{ cursor: 'pointer', margin: 0 }}
            >
              Published on Public Relationship Map
            </label>
          </div>
        </form>
      </div>

      {/* ===================================================
          2. EVENT MEDIA MANAGER
      =================================================== */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div>
            <h3
              style={{
                fontFamily: 'Cinzel, serif',
                fontSize: '14px',
                color: '#6d1620',
                margin: 0,
              }}
            >
              Event Media Collection ({mediaList.length} Items)
            </h3>
            <p
              style={{
                fontSize: '12px',
                color: '#6a441e',
                margin: '4px 0 0',
              }}
            >
              Upload multiple photographs and videos. Drag or use the arrows to reorder.
            </p>
          </div>

          <label className="admin-btn primary" style={{ cursor: 'pointer' }}>
            <span>+ Upload Media</span>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        {/* Upload Progress List */}
        {uploadProgress.length > 0 && (
          <div style={{ marginBottom: '16px' }}>
            {uploadProgress.map((p) => (
              <div
                key={p.id}
                style={{
                  fontSize: '12px',
                  padding: '4px 8px',
                  marginBottom: '4px',
                  borderRadius: '4px',
                  background:
                    p.status === 'success'
                      ? '#e6f4ea'
                      : p.status === 'error'
                        ? '#fde8e8'
                        : '#e8f0fe',
                  color:
                    p.status === 'success'
                      ? '#137333'
                      : p.status === 'error'
                        ? '#9b1c1c'
                        : '#1a56db',
                }}
              >
                {p.name}: {p.status === 'uploading' ? 'Uploading...' : p.status}
                {p.error && ` (${p.error})`}
              </div>
            ))}
          </div>
        )}

        {/* Media Grid */}
        {mediaList.length > 0 ? (
          <div className="admin-media-grid">
            {mediaList.map((item, idx) => {
              const isCover = item.id === formData.coverMediaId
              return (
                <div
                  key={item.id}
                  className={`admin-media-card ${isCover ? 'is-cover' : ''}`}
                >
                  {/* Order & Type Badges */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Cinzel',
                        fontSize: '10px',
                        fontWeight: 700,
                        color: '#6d1620',
                      }}
                    >
                      #{idx + 1} {item.type === 'video' ? '🎬' : '📷'}
                    </span>

                    {isCover && (
                      <span
                        style={{
                          background: '#6d1620',
                          color: '#FFF8E7',
                          fontSize: '9px',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          fontFamily: 'Cinzel',
                        }}
                      >
                        Cover Photo
                      </span>
                    )}
                  </div>

                  {/* Thumbnail / Video */}
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.altText || 'Event media'}
                      className="admin-media-thumb"
                    />
                  ) : (
                    <div style={{ position: 'relative' }}>
                      <video
                        src={item.url}
                        className="admin-media-thumb"
                        style={{ background: '#000' }}
                        preload="metadata"
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '6px',
                          right: '6px',
                          background: 'rgba(0,0,0,0.7)',
                          color: '#fff',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        VIDEO
                      </span>
                    </div>
                  )}

                  {/* Caption Input */}
                  <input
                    type="text"
                    className="admin-input"
                    style={{ fontSize: '11px', padding: '4px 6px' }}
                    defaultValue={item.caption || ''}
                    placeholder="Add caption..."
                    onBlur={(e) => handleUpdateCaption(item.id, e.target.value)}
                  />

                  {/* Action Controls */}
                  <div className="admin-media-actions">
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '3px 7px', fontSize: '10px' }}
                        disabled={idx === 0}
                        onClick={() => handleMoveMedia(idx, -1)}
                        title="Move Earlier in Gallery"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '3px 7px', fontSize: '10px' }}
                        disabled={idx === mediaList.length - 1}
                        onClick={() => handleMoveMedia(idx, 1)}
                        title="Move Later in Gallery"
                      >
                        ↓
                      </button>
                    </div>

                    {item.type === 'image' && !isCover && (
                      <button
                        type="button"
                        className="admin-btn secondary"
                        style={{ padding: '3px 6px', fontSize: '9px' }}
                        onClick={() => handleSetCover(item.id)}
                      >
                        ★ Set Cover
                      </button>
                    )}

                    <button
                      type="button"
                      className="admin-btn danger"
                      style={{ padding: '3px 6px', fontSize: '10px' }}
                      onClick={() => handleDeleteMedia(item.id, item.storagePath)}
                      title="Delete Media Item"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            className="admin-dropzone"
            onClick={() => document.getElementById('media-upload-input')?.click()}
          >
            <input
              id="media-upload-input"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📷</div>
            <strong style={{ color: '#6d1620' }}>No Media Uploaded Yet</strong>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6a441e' }}>
              Click here to select and upload photographs and videos for this event.
            </p>
          </div>
        )}
      </div>

      {/* Public Gallery Preview Overlay */}
      {previewOpen && (
        <EventGalleryModal
          event={{
            ...formData,
            media: mediaList,
          }}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </div>
  )
}
