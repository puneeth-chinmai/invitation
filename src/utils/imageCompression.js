/**
 * @file imageCompression.js
 * High-performance, zero-dependency client-side image compression and resizing utility.
 *
 * Designed for the Puneeth & Chinmai Wedding Admin Portal.
 * - Accepts images up to 50MB (source limit).
 * - Automatically resizes high-resolution photos down to 2560px max dimension.
 * - Compresses with configurable visual quality (default 0.85) preserving aspect ratio.
 * - Skips recompression for small images (<= 1.5MB) to avoid degradation.
 * - Guarantees cleanup of temporary Object URLs, Bitmaps, and Canvas memory buffers.
 */

// Limits
export const MAX_IMAGE_SOURCE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB source image limit
export const MAX_DESTINATION_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB Supabase upload limit
export const DEFAULT_MAX_DIMENSION = 2560 // 2.5K max width/height
export const DEFAULT_COMPRESSION_QUALITY = 0.85 // High quality, visually lossless for web/mobile
export const SKIP_COMPRESSION_THRESHOLD_BYTES = 1.5 * 1024 * 1024 // 1.5MB threshold

/**
 * Standard supported image MIME types
 */
export const SUPPORTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
]

/**
 * Calculate target dimensions maintaining aspect ratio.
 *
 * @param {number} width - Source image width
 * @param {number} height - Source image height
 * @param {number} maxDim - Maximum allowed dimension for either width or height
 * @returns {{ width: number, height: number }}
 */
export function calculateTargetDimensions(width, height, maxDim = DEFAULT_MAX_DIMENSION) {
  if (!width || !height || width <= 0 || height <= 0) {
    return { width: maxDim, height: maxDim }
  }

  if (width <= maxDim && height <= maxDim) {
    return { width, height }
  }

  if (width >= height) {
    const targetWidth = maxDim
    const targetHeight = Math.max(1, Math.round((height * maxDim) / width))
    return { width: targetWidth, height: targetHeight }
  }

  const targetHeight = maxDim
  const targetWidth = Math.max(1, Math.round((width * maxDim) / height))
  return { width: targetWidth, height: targetHeight }
}

/**
 * Helper to determine output file name and extension when converting types.
 *
 * @param {string} originalName - Original file name
 * @param {string} outputMime - Target MIME type (e.g. 'image/jpeg')
 * @returns {string}
 */
export function getOptimizedFileName(originalName, outputMime) {
  const baseName = originalName.replace(/\.[^/.]+$/, '')
  if (outputMime === 'image/webp') return `${baseName}.webp`
  if (outputMime === 'image/png') return `${baseName}.png`
  return `${baseName}.jpg`
}

/**
 * Decode an image file using either createImageBitmap (with EXIF orientation)
 * or fallback HTMLImageElement.
 *
 * @param {File|Blob} file
 * @returns {Promise<{ width: number, height: number, draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, cleanup: () => void }>}
 */
async function decodeImage(file) {
  // 1. Try modern createImageBitmap with automatic EXIF orientation
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
      return {
        width: bitmap.width,
        height: bitmap.height,
        draw: (ctx, w, h) => ctx.drawImage(bitmap, 0, 0, w, h),
        cleanup: () => {
          if (typeof bitmap.close === 'function') {
            bitmap.close()
          }
        },
      }
    } catch {
      // Fall through to Image element fallback if createImageBitmap throws on this format
    }
  }

  // 2. Fallback to HTMLImageElement
  return new Promise((resolve, reject) => {
    let objectUrl = null
    try {
      objectUrl = URL.createObjectURL(file)
    } catch (err) {
      return reject(new Error(`Unable to read image file "${file.name}": ${err.message}`))
    }

    const img = new Image()

    const cleanUpUrl = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
        objectUrl = null
      }
    }

    img.onload = () => {
      const naturalWidth = img.naturalWidth || img.width
      const naturalHeight = img.naturalHeight || img.height

      if (!naturalWidth || !naturalHeight) {
        cleanUpUrl()
        return reject(new Error(`Invalid image dimensions for "${file.name}".`))
      }

      resolve({
        width: naturalWidth,
        height: naturalHeight,
        draw: (ctx, w, h) => ctx.drawImage(img, 0, 0, w, h),
        cleanup: cleanUpUrl,
      })
    }

    img.onerror = () => {
      cleanUpUrl()
      reject(
        new Error(
          `Failed to decode image "${file.name}". The file may be corrupt or in an unsupported format.`
        )
      )
    }

    img.src = objectUrl
  })
}

/**
 * Optimizes an image File using in-browser canvas resizing and compression.
 *
 * @param {File} file - Input image file
 * @param {Object} [options]
 * @param {number} [options.maxDimension=2560] - Maximum width or height
 * @param {number} [options.quality=0.85] - Compression quality (0 to 1)
 * @param {number} [options.skipThresholdBytes=1572864] - Skip threshold (1.5MB)
 * @param {number} [options.maxSourceSizeBytes=52428800] - Max allowed input (50MB)
 * @param {number} [options.maxDestinationSizeBytes=52428800] - Max allowed output (50MB)
 * @returns {Promise<{ file: File, wasCompressed: boolean, originalSize: number, compressedSize: number }>}
 */
export async function compressImageIfNeeded(file, options = {}) {
  const {
    maxDimension = DEFAULT_MAX_DIMENSION,
    quality = DEFAULT_COMPRESSION_QUALITY,
    skipThresholdBytes = SKIP_COMPRESSION_THRESHOLD_BYTES,
    maxSourceSizeBytes = MAX_IMAGE_SOURCE_SIZE_BYTES,
    maxDestinationSizeBytes = MAX_DESTINATION_FILE_SIZE_BYTES,
  } = options

  if (!file) {
    throw new Error('No image file provided for compression.')
  }

  // 1. Verify source file size ceiling
  if (file.size > maxSourceSizeBytes) {
    const maxMb = Math.round(maxSourceSizeBytes / (1024 * 1024))
    const fileMb = (file.size / (1024 * 1024)).toFixed(1)
    throw new Error(
      `Image "${file.name}" is too large (${fileMb}MB). Maximum allowed source size is ${maxMb}MB.`
    )
  }

  // 2. Decode image to inspect actual pixel dimensions
  let decoded = null
  try {
    decoded = await decodeImage(file)
  } catch (decodeErr) {
    // If decoding fails but the original file already fits the destination limit,
    // we allow it through or throw if it's completely unreadable.
    if (file.size <= maxDestinationSizeBytes) {
      console.warn(
        `[imageCompression] Could not decode "${file.name}" for client compression (${decodeErr.message}). Using original file.`
      )
      return {
        file,
        wasCompressed: false,
        originalSize: file.size,
        compressedSize: file.size,
      }
    }
    throw decodeErr
  }

  try {
    const { width: srcWidth, height: srcHeight } = decoded

    // 3. Check if compression should be skipped:
    // If image is already smaller than skip threshold AND dimensions are within maxDimension
    const dimensionsWithinBounds = srcWidth <= maxDimension && srcHeight <= maxDimension
    if (file.size <= skipThresholdBytes && dimensionsWithinBounds) {
      return {
        file,
        wasCompressed: false,
        originalSize: file.size,
        compressedSize: file.size,
      }
    }

    // 4. Calculate target dimensions preserving aspect ratio
    const { width: targetWidth, height: targetHeight } = calculateTargetDimensions(
      srcWidth,
      srcHeight,
      maxDimension
    )

    // 5. Determine output format
    // WebP inputs remain WebP; JPEG, PNG, AVIF, HEIC output as JPEG for universal compatibility
    const outputMime = file.type === 'image/webp' ? 'image/webp' : 'image/jpeg'

    // 6. Set up canvas with high-quality rendering
    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to acquire 2D canvas context for image compression.')
    }

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Fill white background for JPEG in case source has transparent regions
    if (outputMime === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, targetWidth, targetHeight)
    }

    // Draw resized image
    decoded.draw(ctx, targetWidth, targetHeight)

    // 7. Export compressed Blob
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b)
          else reject(new Error(`Canvas compression failed for "${file.name}".`))
        },
        outputMime,
        quality
      )
    })

    // Clean up canvas buffer to release GPU memory immediately
    canvas.width = 0
    canvas.height = 0

    // 8. If compression somehow resulted in a larger file (rare on already-optimized images)
    // and original is within destination limit, use original
    if (blob.size >= file.size && file.size <= maxDestinationSizeBytes) {
      return {
        file,
        wasCompressed: false,
        originalSize: file.size,
        compressedSize: file.size,
      }
    }

    // 9. Build replacement File object
    const outputFileName = getOptimizedFileName(file.name, outputMime)
    const compressedFile = new File([blob], outputFileName, {
      type: outputMime,
      lastModified: Date.now(),
    })

    // 10. Verify resulting file fits under destination limit
    if (compressedFile.size > maxDestinationSizeBytes) {
      const maxMb = Math.round(maxDestinationSizeBytes / (1024 * 1024))
      const resMb = (compressedFile.size / (1024 * 1024)).toFixed(1)
      throw new Error(
        `Optimized image "${file.name}" is ${resMb}MB, which exceeds the destination limit of ${maxMb}MB.`
      )
    }

    return {
      file: compressedFile,
      wasCompressed: true,
      originalSize: file.size,
      compressedSize: compressedFile.size,
    }
  } finally {
    if (decoded && typeof decoded.cleanup === 'function') {
      decoded.cleanup()
    }
  }
}
