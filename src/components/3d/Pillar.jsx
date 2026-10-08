import * as THREE from 'three'
import { COLORS, TEMPLE } from '../../constants/cinematic'

const pillarMat = new THREE.MeshStandardMaterial({
  color: COLORS.STONE_MID,
  roughness: 0.85,
  metalness: 0.05,
})
const capMat = new THREE.MeshStandardMaterial({
  color: COLORS.STONE_LIGHT,
  roughness: 0.7,
  metalness: 0.1,
})
const bandMat = new THREE.MeshStandardMaterial({
  color: COLORS.GOLD,
  roughness: 0.4,
  metalness: 0.6,
})

const pillarGeom = new THREE.CylinderGeometry(
  TEMPLE.PILLAR_RADIUS * 0.82,
  TEMPLE.PILLAR_RADIUS,
  TEMPLE.PILLAR_HEIGHT,
  14,
)
const capGeom = new THREE.BoxGeometry(
  TEMPLE.PILLAR_RADIUS * 2.6,
  TEMPLE.PILLAR_RADIUS * 0.6,
  TEMPLE.PILLAR_RADIUS * 2.6,
)
const baseGeom = new THREE.BoxGeometry(
  TEMPLE.PILLAR_RADIUS * 2.8,
  TEMPLE.PILLAR_RADIUS * 0.5,
  TEMPLE.PILLAR_RADIUS * 2.8,
)
const bandGeom = new THREE.TorusGeometry(TEMPLE.PILLAR_RADIUS * 0.9, 0.03, 8, 20)

/**
 * Pillar
 * A single stone pillar with a capital, base, and decorative gold ring bands.
 */
export default function Pillar({ position = [0, 0, 0] }) {
  const midY = TEMPLE.PILLAR_HEIGHT / 2

  return (
    <group position={position}>
      {/* Shaft */}
      <mesh geometry={pillarGeom} material={pillarMat} position={[0, midY, 0]} />
      {/* Capital (top cap) */}
      <mesh geometry={capGeom} material={capMat} position={[0, TEMPLE.PILLAR_HEIGHT + 0.28, 0]} />
      {/* Base */}
      <mesh geometry={baseGeom} material={capMat} position={[0, 0.22, 0]} />
      {/* Decorative gold bands */}
      <mesh geometry={bandGeom} material={bandMat}
        position={[0, TEMPLE.PILLAR_HEIGHT * 0.25, 0]}
        rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={bandGeom} material={bandMat}
        position={[0, TEMPLE.PILLAR_HEIGHT * 0.55, 0]}
        rotation={[Math.PI / 2, 0, 0]} />
      <mesh geometry={bandGeom} material={bandMat}
        position={[0, TEMPLE.PILLAR_HEIGHT * 0.82, 0]}
        rotation={[Math.PI / 2, 0, 0]} />
    </group>
  )
}
