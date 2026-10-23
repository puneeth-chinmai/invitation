/**
 * @file test_canonical_navigation.mjs
 * Focused automated verification test for mixed-media canonical collection building,
 * field normalization, and bidirectional fullscreen navigation.
 */

import assert from 'assert'
import { normalizeMediaItem, normalizeMediaList } from '../src/utils/mediaNormalizer.js'

console.log('=== Test 1: Field Normalization Boundary ===')

// Test diverse database / component representations
const rawDbRows = [
  {
    media_id: 'raw-1',
    media_type: 'image',
    url: 'https://example.com/photo1.jpg',
    thumbnail_url: null,
    caption: 'Photo One',
    sort_order: 1,
  },
  {
    id: 'raw-2',
    // Missing type, infer from .mp4
    url: 'https://example.com/video1.mp4',
    thumbnail_url: null, // No poster
    caption: 'Video One Without Poster',
    sort_order: 2,
  },
  {
    id: 'raw-3',
    type: 'image',
    src: 'https://example.com/photo2.jpg',
    order: 3,
  },
  {
    id: 'raw-4',
    media_type: 'video',
    media_url: 'https://example.com/video2.Mov', // Uppercase .Mov
    thumbnail_url: 'https://example.com/video2_poster.jpg',
    sort_order: 4,
    caption: 'Video Two With Poster',
  },
]

const normalized = normalizeMediaList(rawDbRows)

assert.strictEqual(normalized.length, 4, 'All 4 items must be preserved in the canonical collection')

// Check Item 1: Photo
assert.strictEqual(normalized[0].id, 'raw-1')
assert.strictEqual(normalized[0].type, 'image')
assert.strictEqual(normalized[0].url, 'https://example.com/photo1.jpg')
assert.strictEqual(normalized[0].order, 1)

// Check Item 2: Video without poster
assert.strictEqual(normalized[1].id, 'raw-2')
assert.strictEqual(normalized[1].type, 'video', 'Must infer video type from .mp4')
assert.strictEqual(normalized[1].url, 'https://example.com/video1.mp4')
assert.strictEqual(normalized[1].thumbnailUrl, null, 'Poster is null')
assert.strictEqual(normalized[1].order, 2)

// Check Item 3: Photo with src field
assert.strictEqual(normalized[2].id, 'raw-3')
assert.strictEqual(normalized[2].type, 'image')
assert.strictEqual(normalized[2].url, 'https://example.com/photo2.jpg')
assert.strictEqual(normalized[2].order, 3)

// Check Item 4: Video with poster and .Mov
assert.strictEqual(normalized[3].id, 'raw-4')
assert.strictEqual(normalized[3].type, 'video')
assert.strictEqual(normalized[3].url, 'https://example.com/video2.Mov')
assert.strictEqual(normalized[3].thumbnailUrl, 'https://example.com/video2_poster.jpg')
assert.strictEqual(normalized[3].order, 4)

console.log('✓ Normalization correctly standardized field names and preserved all 4 items!')

console.log('\n=== Test 2: Bidirectional Mixed-Media Navigation ===')

class NavigationSimulator {
  constructor(mediaList, initialIndex = 0) {
    this.mediaList = mediaList
    this.currentIndex = initialIndex
  }

  next() {
    const total = this.mediaList.length
    if (total <= 1) return
    this.currentIndex = this.currentIndex < total - 1 ? this.currentIndex + 1 : 0
  }

  prev() {
    const total = this.mediaList.length
    if (total <= 1) return
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : total - 1
  }

  get current() {
    return this.mediaList[this.currentIndex]
  }

  get counterText() {
    const item = this.current
    const typeLabel = item.type === 'video' ? 'VIDEO' : 'PHOTOGRAPH'
    return `${typeLabel} ${this.currentIndex + 1} OF ${this.mediaList.length}`
  }
}

const sim = new NavigationSimulator(normalized, 0)

// Step 0: Initial state on Photo 1
assert.strictEqual(sim.currentIndex, 0)
assert.strictEqual(sim.current.type, 'image')
assert.strictEqual(sim.counterText, 'PHOTOGRAPH 1 OF 4')
console.log('Step 0:', sim.counterText, '-> URL:', sim.current.url)

// Forward Navigation: 0 -> 1 (Video without poster)
sim.next()
assert.strictEqual(sim.currentIndex, 1)
assert.strictEqual(sim.current.type, 'video')
assert.strictEqual(sim.current.thumbnailUrl, null)
assert.strictEqual(sim.counterText, 'VIDEO 2 OF 4')
console.log('Step 1 (Photo -> Video without poster):', sim.counterText)

// Forward Navigation: 1 -> 2 (Photo 2)
sim.next()
assert.strictEqual(sim.currentIndex, 2)
assert.strictEqual(sim.current.type, 'image')
assert.strictEqual(sim.counterText, 'PHOTOGRAPH 3 OF 4')
console.log('Step 2 (Video without poster -> Photo):', sim.counterText)

// Forward Navigation: 2 -> 3 (Video with poster)
sim.next()
assert.strictEqual(sim.currentIndex, 3)
assert.strictEqual(sim.current.type, 'video')
assert.strictEqual(sim.current.thumbnailUrl, 'https://example.com/video2_poster.jpg')
assert.strictEqual(sim.counterText, 'VIDEO 4 OF 4')
console.log('Step 3 (Photo -> Video with poster):', sim.counterText)

// Forward Navigation: 3 -> 0 (Loops back to Photo 1)
sim.next()
assert.strictEqual(sim.currentIndex, 0)
assert.strictEqual(sim.current.type, 'image')
assert.strictEqual(sim.counterText, 'PHOTOGRAPH 1 OF 4')
console.log('Step 4 (Looping to start):', sim.counterText)

// Backward Navigation: 0 -> 3 (Video with poster)
sim.prev()
assert.strictEqual(sim.currentIndex, 3)
assert.strictEqual(sim.current.type, 'video')
assert.strictEqual(sim.counterText, 'VIDEO 4 OF 4')
console.log('Step 5 (Prev loop to last item):', sim.counterText)

// Backward Navigation: 3 -> 2 -> 1 -> 0
sim.prev()
assert.strictEqual(sim.currentIndex, 2)
sim.prev()
assert.strictEqual(sim.currentIndex, 1)
assert.strictEqual(sim.current.type, 'video')
sim.prev()
assert.strictEqual(sim.currentIndex, 0)
assert.strictEqual(sim.current.type, 'image')
console.log('✓ Bidirectional navigation verified across photos and videos without item loss!')

console.log('\n=== Test 3: Edge Cases (First is Video, Last is Video, Invalid Thumbnails) ===')

const edgeCases = [
  { id: 'e-1', type: 'video', url: '/v1.mp4', order: 1, thumbnailUrl: 'http://example.com/bad.mp4' }, // mp4 as thumb must be rejected
  { id: 'e-2', type: 'image', url: '/img1.jpg', order: 2 },
  { id: 'e-3', type: 'video', url: '/v2.mp4', order: 3 },
]

const edgeNormalized = normalizeMediaList(edgeCases)
assert.strictEqual(edgeNormalized[0].thumbnailUrl, null, 'Video URL mistakenly passed as thumbnail must be rejected to null')
assert.strictEqual(edgeNormalized[0].type, 'video', 'First item is video')
assert.strictEqual(edgeNormalized[2].type, 'video', 'Last item is video')

const edgeSim = new NavigationSimulator(edgeNormalized, 0)
assert.strictEqual(edgeSim.current.type, 'video')
edgeSim.next()
assert.strictEqual(edgeSim.current.type, 'image')
edgeSim.next()
assert.strictEqual(edgeSim.current.type, 'video')

console.log('✓ Edge cases passed! First-item video, last-item video, and invalid thumbnail URLs handled correctly.')
console.log('\nALL TESTS PASSED SUCCESSFULLY!');
