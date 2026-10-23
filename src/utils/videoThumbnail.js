/**
 * @file videoThumbnail.js
 * Client-side video thumbnail / poster frame generator.
 *
 * Capabilities:
 *   1. Accepts a File/Blob (from file input) OR a remote video URL string.
 *   2. Buffers video frames using preload='auto' and crossOrigin='anonymous'.
 *   3. Waits for metadata and validates decodable dimensions.
 *   4. Samples multiple candidate timestamps ([1.0, 2.0, 0.5, 3.0, 0.0]) to bypass initial black fade-ins.
 *   5. Waits for decoder readiness (readyState >= HAVE_CURRENT_DATA) before drawing.
 *   6. Analyzes captured pixel data to detect black/blank frames and reject them.
 *   7. Exports compressed JPEG File or Blob.
 *   8. Cleans up all resources (canvas dimensions, video source, blob URLs) in a finally block.
 */

const DEFAULT_SEEK_TIMES = [1.0, 2.0, 0.5, 3.0, 0.0]
const THUMB_MAX_DIMENSION = 640
const THUMB_QUALITY = 0.82
const THUMB_MIME = 'image/jpeg'
const SEEK_TIMEOUT_MS = 6000
const METADATA_TIMEOUT_MS = 10000

/**
 * Inspect canvas pixels to check if a captured frame is predominantly black/blank.
 * Samples a grid of pixels and calculates luminance.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} width
 * @param {number} height
 * @returns {boolean} True if frame is deemed black/unrendered
 */
export function isFrameBlack(ctx, width, height) {
  try {
    const sampleCols = 16
    const sampleRows = 16
    const totalSamples = sampleCols * sampleRows
    const imgData = ctx.getImageData(0, 0, width, height).data

    let totalLuminance = 0
    let darkPixelCount = 0

    for (let r = 0; r < sampleRows; r++) {
      const y = Math.floor((r + 0.5) * (height / sampleRows))
      for (let c = 0; c < sampleCols; c++) {
        const x = Math.floor((c + 0.5) * (width / sampleCols))
        const idx = (y * width + x) * 4
        const red = imgData[idx]
        const green = imgData[idx + 1]
        const blue = imgData[idx + 2]
        const alpha = imgData[idx + 3]

        if (alpha < 50) {
          darkPixelCount++
          continue
        }

        // Standard perceived luminance formula (ITU-R BT.601)
        const lum = 0.299 * red + 0.587 * green + 0.114 * blue
        totalLuminance += lum
        if (lum < 15) {
          darkPixelCount++
        }
      }
    }

    const avgLuminance = totalLuminance / totalSamples
    const darkRatio = darkPixelCount / totalSamples

    // Black frame: average luminance < 12 and over 92% of sampled pixels are near pitch-black
    return avgLuminance < 12 && darkRatio > 0.92
  } catch (err) {
    // If getImageData fails due to cross-origin restriction, return false to let valid poster through
    console.warn('[videoThumbnail] Pixel inspection skipped:', err.message)
    return false
  }
}

/**
 * Capture a poster frame from a video File, Blob, or URL string.
 *
 * @param {File|Blob|string} source - The video file or public URL
 * @param {Object} [options]
 * @param {number[]} [options.seekTimes] - Candidate seek timestamps to evaluate
 * @param {number} [options.maxDimension=640] - Max output width/height
 * @param {number} [options.quality=0.82] - JPEG quality
 * @returns {Promise<File|null>} Compressed JPEG File or null if generation fails
 */
export async function generateVideoThumbnail(source, options = {}) {
  const {
    seekTimes = DEFAULT_SEEK_TIMES,
    maxDimension = THUMB_MAX_DIMENSION,
    quality = THUMB_QUALITY,
  } = options

  if (!source) return null
  if (typeof document === 'undefined') return null

  let objectUrl = null
  let videoUrl = null

  if (typeof source === 'string') {
    videoUrl = source.trim()
    if (!videoUrl) return null
  } else if (source instanceof Blob || (source && typeof source === 'object' && source.size)) {
    try {
      objectUrl = URL.createObjectURL(source)
      videoUrl = objectUrl
    } catch {
      return null
    }
  } else {
    return null
  }

  let video = null
  let canvas = null

  try {
    video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto' // Must be 'auto' to buffer decodable frames
    video.crossOrigin = 'anonymous'

    // 1. Wait for video metadata
    await loadVideoMetadata(video, videoUrl)

    const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0
    const naturalW = video.videoWidth
    const naturalH = video.videoHeight

    if (!naturalW || !naturalH) {
      console.warn('[videoThumbnail] Video has no decodable dimensions (naturalW: 0, naturalH: 0).')
      return null
    }

    // Determine target dimensions preserving aspect ratio
    let targetW = naturalW
    let targetH = naturalH
    if (naturalW > maxDimension || naturalH > maxDimension) {
      if (naturalW >= naturalH) {
        targetW = maxDimension
        targetH = Math.max(1, Math.round((naturalH * maxDimension) / naturalW))
      } else {
        targetH = maxDimension
        targetW = Math.max(1, Math.round((naturalW * maxDimension) / naturalH))
      }
    }

    canvas = document.createElement('canvas')
    canvas.width = targetW
    canvas.height = targetH
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return null

    // Determine candidate seek times
    const candidateTimes = []
    for (const t of seekTimes) {
      if (duration > 0) {
        if (t < duration) {
          candidateTimes.push(t)
        }
      } else {
        candidateTimes.push(0)
      }
    }
    if (duration > 0 && candidateTimes.length === 0) {
      candidateTimes.push(Math.max(0, Math.min(1.0, duration * 0.5)))
    }
    const uniqueTimes = [...new Set(candidateTimes)]

    let bestBlob = null
    let capturedNonBlack = false

    for (const timeS of uniqueTimes) {
      try {
        await seekAndDecodeFrame(video, timeS)

        // Clear canvas and draw frame
        ctx.clearRect(0, 0, targetW, targetH)
        ctx.drawImage(video, 0, 0, targetW, targetH)

        const black = isFrameBlack(ctx, targetW, targetH)
        const blob = await canvasToBlob(canvas, THUMB_MIME, quality)

        if (!blob || blob.size === 0) continue

        if (!black) {
          bestBlob = blob
          capturedNonBlack = true
          break // Found a valid, non-black frame!
        } else {
          // If frame is black, save as potential fallback only if no other frame is ever found
          if (!bestBlob) {
            bestBlob = blob
          }
        }
      } catch (seekErr) {
        console.warn(`[videoThumbnail] Seek to ${timeS}s failed:`, seekErr.message || seekErr)
      }
    }

    // Never return a black screenshot as a successful generated poster
    if (!capturedNonBlack && uniqueTimes.length > 1) {
      console.warn('[videoThumbnail] All candidate frames were completely black or unrendered.')
      return null
    }

    if (!bestBlob) return null

    let baseName = 'video_thumb'
    if (typeof source === 'string') {
      const parts = source.split('/')
      const last = parts[parts.length - 1] || 'video'
      baseName = last.split('?')[0].replace(/\.[^/.]+$/, '')
    } else if (source && source.name) {
      baseName = source.name.replace(/\.[^/.]+$/, '')
    }

    return new File([bestBlob], `${baseName}_thumb.jpg`, {
      type: THUMB_MIME,
      lastModified: Date.now(),
    })
  } catch (err) {
    console.warn('[videoThumbnail] Thumbnail generation failed:', err.message || err)
    return null
  } finally {
    if (canvas) {
      canvas.width = 0
      canvas.height = 0
      canvas = null
    }
    if (video) {
      video.pause()
      video.removeAttribute('src')
      video.load()
      video = null
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
      objectUrl = null
    }
  }
}

/**
 * Load video metadata with a bounded timeout.
 */
function loadVideoMetadata(video, url) {
  return new Promise((resolve, reject) => {
    let settled = false

    const cleanup = () => {
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('error', onError)
      clearTimeout(timeoutId)
    }

    const onMeta = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }

    const onError = () => {
      if (settled) return
      settled = true
      cleanup()
      const code = video.error?.code || 'unknown'
      const msg = video.error?.message || ''
      reject(new Error(`Video metadata load failed (code: ${code}, ${msg})`))
    }

    const timeoutId = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('Timed out waiting for video metadata'))
    }, METADATA_TIMEOUT_MS)

    video.addEventListener('loadedmetadata', onMeta)
    video.addEventListener('error', onError)

    video.src = url
    video.load()
  })
}

/**
 * Seek to a given timestamp and ensure frame data is decoded.
 */
function seekAndDecodeFrame(video, timeS) {
  return new Promise((resolve, reject) => {
    let settled = false

    const cleanup = () => {
      video.removeEventListener('seeked', onSeeked)
      video.removeEventListener('loadeddata', onReady)
      video.removeEventListener('canplay', onReady)
      video.removeEventListener('error', onError)
      clearTimeout(timeoutId)
    }

    const checkReady = () => {
      if (settled) return
      // readyState >= HAVE_CURRENT_DATA ensures the decoder has current frame data
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        settled = true
        cleanup()
        resolve()
      }
    }

    const onSeeked = () => {
      checkReady()
      if (!settled) {
        setTimeout(checkReady, 80)
      }
    }

    const onReady = () => checkReady()

    const onError = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('Video error during frame seek'))
    }

    const timeoutId = setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      resolve() // Non-fatal timeout: proceed with whatever state is available
    }, SEEK_TIMEOUT_MS)

    video.addEventListener('seeked', onSeeked)
    video.addEventListener('loadeddata', onReady)
    video.addEventListener('canplay', onReady)
    video.addEventListener('error', onError)

    // If already at the desired seek position and frame data is ready
    if (Math.abs(video.currentTime - timeS) < 0.05 && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      settled = true
      cleanup()
      return resolve()
    }

    try {
      video.currentTime = timeS
    } catch (e) {
      settled = true
      cleanup()
      reject(e)
    }
  })
}

/**
 * Convert canvas to Blob via Promise.
 */
function canvasToBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b && b.size > 0) resolve(b)
        else reject(new Error('Canvas toBlob returned empty blob'))
      },
      mimeType,
      quality
    )
  })
}
