/**
 * @file imageUrl.js
 * Media URL Resolver for Our Journey
 *
 * Guaranteed non-destructive image handling:
 * Preserves the exact, unaltered original client-uploaded photo URL everywhere.
 * Completely eliminates any server-side or client-side cropping (no resize=cover,
 * no aspect-ratio distortion, no lossy recompression).
 */

/**
 * Returns the exact original image or thumbnail URL without destructive transformations.
 *
 * @param {string} url - Original uploaded image URL
 * @returns {string} - The intact original URL
 */
export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return url || ''
  }
  // Return the original uploaded image URL unaltered
  return url
}

/**
 * Responsive srcset generator.
 * Disabled to prevent browser selection of cropped or downscaled images.
 * Returns undefined so browsers display the full natural original image.
 *
 * @returns {undefined}
 */
export function getResponsiveImageSrcSet() {
  return undefined
}
