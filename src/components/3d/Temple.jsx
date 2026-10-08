import * as THREE from 'three'
import { COLORS, TEMPLE } from '../../constants/cinematic'
import Pillar from './Pillar'

// ─── Shared materials ─────────────────────────────────────────────────────────
const stoneDarkMat = new THREE.MeshStandardMaterial({
  color: COLORS.STONE_DARK,
  roughness: 0.9,
  metalness: 0.0,
})
const stoneMidMat = new THREE.MeshStandardMaterial({
  color: COLORS.STONE_MID,
  roughness: 0.85,
  metalness: 0.02,
})
const stoneLightMat = new THREE.MeshStandardMaterial({
  color: COLORS.STONE_LIGHT,
  roughness: 0.75,
  metalness: 0.05,
})
const goldTrimMat = new THREE.MeshStandardMaterial({
  color: COLORS.GOLD,
  roughness: 0.4,
  metalness: 0.7,
  emissive: COLORS.GOLD,
  emissiveIntensity: 0.06,
})

// ─── Shared geometry ──────────────────────────────────────────────────────────
// Ground platform
const platformGeom = new THREE.BoxGeometry(14, 0.3, 8)
// Step
const stepGeom = new THREE.BoxGeometry(10, 0.18, 1.2)
// Lintel (horizontal beam over door)
const lintelGeom = new THREE.BoxGeometry(TEMPLE.DOOR_WIDTH * 2 + 0.3, 0.5, TEMPLE.DOOR_DEPTH * 3)
// Arch frame sides
const archSideGeom = new THREE.BoxGeometry(0.4, TEMPLE.DOOR_HEIGHT + 0.5, 0.4)
// Arch top curve approximated as a flat arc piece
const archTopGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.4, 20, 1, false, 0, Math.PI)
// Wide cornice above pillars
const corniceGeom = new THREE.BoxGeometry(13, 0.6, 1.4)
// Shikhara base blocks (stepped tower)
const shikharaBase0 = new THREE.BoxGeometry(5.5, 0.7, 2.0)
const shikharaBase1 = new THREE.BoxGeometry(4.2, 0.8, 1.6)
const shikharaBase2 = new THREE.BoxGeometry(3.0, 0.9, 1.2)
const shikharaBase3 = new THREE.BoxGeometry(2.0, 1.0, 0.9)
const shikharaTip = new THREE.ConeGeometry(0.6, 1.8, 8)
const kalashaGeom = new THREE.SphereGeometry(0.3, 10, 10)
// Gold trim strip
const trimStripGeom = new THREE.BoxGeometry(13.2, 0.12, 0.18)
// Floor inside
const innerFloorGeom = new THREE.BoxGeometry(14, 0.1, 20)

const pillarPositions = [
  [-4.5, 0, 0],
  [-2.8, 0, 0],
  [2.8, 0, 0],
  [4.5, 0, 0],
]

/**
 * Temple
 * Stylized traditional South Indian gopura-inspired entrance prototype.
 * Uses only Three.js primitives for Phase 1.
 */
export default function Temple() {
  const pillarTopY = TEMPLE.PILLAR_HEIGHT + 0.28 + 0.3  // pillar height + cap

  return (
    <group>
      {/* ── Ground platform ─────────────────────────────── */}
      <mesh geometry={platformGeom} material={stoneDarkMat} position={[0, -0.15, -1]} />
      {/* Step up to entrance */}
      <mesh geometry={stepGeom} material={stoneMidMat} position={[0, 0.04, 1.6]} />

      {/* ── Inner floor ──────────────────────────────────── */}
      <mesh geometry={innerFloorGeom} material={stoneDarkMat} position={[0, -0.05, -6]} />

      {/* ── Pillars ──────────────────────────────────────── */}
      {pillarPositions.map((pos, i) => (
        <Pillar key={i} position={pos} />
      ))}

      {/* ── Door arch frame sides ────────────────────────── */}
      <mesh geometry={archSideGeom} material={stoneMidMat}
        position={[-TEMPLE.DOOR_WIDTH - 0.2, TEMPLE.DOOR_HEIGHT / 2 + 0.25, 0]} />
      <mesh geometry={archSideGeom} material={stoneMidMat}
        position={[TEMPLE.DOOR_WIDTH + 0.2, TEMPLE.DOOR_HEIGHT / 2 + 0.25, 0]} />

      {/* ── Lintel over door ─────────────────────────────── */}
      <mesh geometry={lintelGeom} material={stoneLightMat}
        position={[0, TEMPLE.DOOR_HEIGHT + 0.25, 0]} />

      {/* ── Arch top (semicircle approximation) ─────────── */}
      <mesh
        geometry={archTopGeom}
        material={stoneMidMat}
        position={[0, TEMPLE.DOOR_HEIGHT + 0.55, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        scale={[1, 0.35, 1]}
      />

      {/* ── Cornice / top beam across all pillars ───────── */}
      <mesh geometry={corniceGeom} material={stoneLightMat} position={[0, pillarTopY, 0]} />

      {/* ── Gold trim strip on cornice ───────────────────── */}
      <mesh geometry={trimStripGeom} material={goldTrimMat}
        position={[0, pillarTopY + 0.36, 0.55]} />
      <mesh geometry={trimStripGeom} material={goldTrimMat}
        position={[0, pillarTopY - 0.36, 0.55]} />

      {/* ── Shikhara (stepped tower) ─────────────────────── */}
      {/* Tier 0 */}
      <mesh geometry={shikharaBase0} material={stoneMidMat}
        position={[0, pillarTopY + 0.65, -0.2]} />
      {/* Tier 1 */}
      <mesh geometry={shikharaBase1} material={stoneDarkMat}
        position={[0, pillarTopY + 1.5, -0.2]} />
      {/* Tier 2 */}
      <mesh geometry={shikharaBase2} material={stoneMidMat}
        position={[0, pillarTopY + 2.35, -0.2]} />
      {/* Tier 3 */}
      <mesh geometry={shikharaBase3} material={stoneLightMat}
        position={[0, pillarTopY + 3.25, -0.2]} />
      {/* Spire */}
      <mesh geometry={shikharaTip} material={stoneDarkMat}
        position={[0, pillarTopY + 4.75, -0.2]} />
      {/* Kalasha (finial) */}
      <mesh geometry={kalashaGeom} material={goldTrimMat}
        position={[0, pillarTopY + 5.95, -0.2]} />

      {/* ── Back wall ────────────────────────────────────── */}
      <mesh position={[0, TEMPLE.DOOR_HEIGHT / 2, -8]}>
        <boxGeometry args={[14, TEMPLE.DOOR_HEIGHT + 1.5, 0.5]} />
        <meshStandardMaterial color={COLORS.STONE_DARK} roughness={0.95} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-7, TEMPLE.DOOR_HEIGHT / 2, -4]}>
        <boxGeometry args={[0.5, TEMPLE.DOOR_HEIGHT + 1.5, 16]} />
        <meshStandardMaterial color={COLORS.STONE_DARK} roughness={0.95} />
      </mesh>
      <mesh position={[7, TEMPLE.DOOR_HEIGHT / 2, -4]}>
        <boxGeometry args={[0.5, TEMPLE.DOOR_HEIGHT + 1.5, 16]} />
        <meshStandardMaterial color={COLORS.STONE_DARK} roughness={0.95} />
      </mesh>
    </group>
  )
}
