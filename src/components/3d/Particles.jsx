import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS } from '../../constants/cinematic'

/**
 * Particles
 *
 * Subtle atmospheric floating dust / glowing motes.
 * GPU-friendly: single BufferGeometry + Points, no per-particle objects.
 */
export default function Particles({ count = 180 }) {
  const meshRef = useRef()

  // Build positions + random phase offsets once
  const [positions, phases] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 18   // x spread
      pos[i * 3 + 1] = Math.random() * 8 + 0.2       // y: floor to ceiling
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10    // z depth
      ph[i] = Math.random() * Math.PI * 2             // random phase
    }
    return [pos, ph]
  }, [count])

  // Gentle drift animation — no React state, purely GPU-side transform
  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.getElapsedTime()
    const posAttr = meshRef.current.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      const base = i * 3
      posAttr.array[base + 1] = positions[i * 3 + 1] + Math.sin(t * 0.3 + phases[i]) * 0.25
      posAttr.array[base + 0] = positions[i * 3 + 0] + Math.sin(t * 0.15 + phases[i] * 1.3) * 0.12
    }
    posAttr.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.GOLD_LIGHT}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
