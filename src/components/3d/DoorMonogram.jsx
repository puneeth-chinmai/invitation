import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * Procedurally generates a high-resolution canvas texture for the serif monogram ('P' or 'C').
 * Generates both diffuse (color) and bump (relief) maps for realistic metallic embossing.
 */
function createMonogramTextures(letter) {
  const size = 1024
  const half = size / 2

  // 1. Diffuse (Color) Canvas
  const colorCanvas = document.createElement('canvas')
  colorCanvas.width = size
  colorCanvas.height = size
  const ctx = colorCanvas.getContext('2d')

  // Background radial tone (dark aged bronze plate)
  const bgGrad = ctx.createRadialGradient(half, half, 40, half, half, half)
  bgGrad.addColorStop(0, '#2e190c')
  bgGrad.addColorStop(0.5, '#221208')
  bgGrad.addColorStop(0.85, '#170b05')
  bgGrad.addColorStop(1, '#0e0603')
  ctx.fillStyle = bgGrad
  ctx.beginPath()
  ctx.arc(half, half, half - 4, 0, Math.PI * 2)
  ctx.fill()

  // Fine concentric lathe rings for machined temple bronze feel
  ctx.strokeStyle = 'rgba(212, 160, 85, 0.08)'
  ctx.lineWidth = 1.5
  for (let r = 80; r < half - 20; r += 24) {
    ctx.beginPath()
    ctx.arc(half, half, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  // Inner decorative ring
  ctx.strokeStyle = '#9c6b30'
  ctx.lineWidth = 6
  ctx.beginPath()
  ctx.arc(half, half, half - 70, 0, Math.PI * 2)
  ctx.stroke()

  ctx.strokeStyle = '#e6b567'
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.arc(half, half, half - 80, 0, Math.PI * 2)
  ctx.stroke()

  // Beaded pearls along inner perimeter
  const beadCount = 36
  const beadRadius = half - 75
  for (let i = 0; i < beadCount; i++) {
    const angle = (i / beadCount) * Math.PI * 2
    const bx = half + Math.cos(angle) * beadRadius
    const by = half + Math.sin(angle) * beadRadius
    ctx.fillStyle = '#d99e4b'
    ctx.beginPath()
    ctx.arc(bx, by, 4.5, 0, Math.PI * 2)
    ctx.fill()
  }

  // Letter styling (Classical Roman serif font)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 500px "Cinzel", "Georgia", "Times New Roman", serif'

  // Letter drop shadow / dark bevel recess
  ctx.fillStyle = 'rgba(10, 4, 2, 0.7)'
  ctx.fillText(letter, half + 4, half + 6)

  // Letter metallic gold gradient fill
  const letterGrad = ctx.createLinearGradient(half - 180, half - 250, half + 180, half + 250)
  letterGrad.addColorStop(0, '#f9dc8f')
  letterGrad.addColorStop(0.25, '#dfa851')
  letterGrad.addColorStop(0.55, '#c5822e')
  letterGrad.addColorStop(0.85, '#e4b665')
  letterGrad.addColorStop(1, '#9e621f')
  ctx.fillStyle = letterGrad
  ctx.fillText(letter, half, half)

  // Fine inner specular highlight stroke
  ctx.strokeStyle = 'rgba(255, 238, 175, 0.45)'
  ctx.lineWidth = 3
  ctx.strokeText(letter, half, half)

  // 2. Bump / Height Canvas for 3D embossing
  const bumpCanvas = document.createElement('canvas')
  bumpCanvas.width = size
  bumpCanvas.height = size
  const bCtx = bumpCanvas.getContext('2d')

  bCtx.fillStyle = '#000000'
  bCtx.fillRect(0, 0, size, size)

  // Rings bump
  bCtx.strokeStyle = '#666666'
  bCtx.lineWidth = 6
  bCtx.beginPath()
  bCtx.arc(half, half, half - 70, 0, Math.PI * 2)
  bCtx.stroke()

  for (let i = 0; i < beadCount; i++) {
    const angle = (i / beadCount) * Math.PI * 2
    const bx = half + Math.cos(angle) * beadRadius
    const by = half + Math.sin(angle) * beadRadius
    bCtx.fillStyle = '#aaaaaa'
    bCtx.beginPath()
    bCtx.arc(bx, by, 5, 0, Math.PI * 2)
    bCtx.fill()
  }

  // Embossed letter bump
  bCtx.textAlign = 'center'
  bCtx.textBaseline = 'middle'
  bCtx.font = 'bold 500px "Cinzel", "Georgia", "Times New Roman", serif'
  bCtx.fillStyle = '#ffffff'
  bCtx.fillText(letter, half, half)

  const colorTexture = new THREE.CanvasTexture(colorCanvas)
  colorTexture.generateMipmaps = true
  colorTexture.minFilter = THREE.LinearMipmapLinearFilter

  const bumpTexture = new THREE.CanvasTexture(bumpCanvas)
  bumpTexture.generateMipmaps = true
  bumpTexture.minFilter = THREE.LinearMipmapLinearFilter

  return { colorTexture, bumpTexture }
}

/**
 * DoorMonogram
 * Renders an ornate South Indian bronze-gold lotus medallion containing
 * an embossed classical serif letter ('P' or 'C') matching the reference image.
 */
export default function DoorMonogram({
  letter = 'P',
  position = [0, 0, 0],
  scale = 1,
  brass,
  darkBrass,
}) {
  const { colorTexture, bumpTexture } = useMemo(
    () => createMonogramTextures(letter),
    [letter]
  )

  const faceMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: colorTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.04,
        metalness: 0.88,
        roughness: 0.28,
        clearcoat: 0.35,
        clearcoatRoughness: 0.25,
        transparent: true,
        opacity: 1,
      }),
    [colorTexture, bumpTexture]
  )

  const defaultBrass = useMemo(
    () =>
      brass ||
      new THREE.MeshPhysicalMaterial({
        color: '#c99042',
        metalness: 0.92,
        roughness: 0.24,
        clearcoat: 0.4,
        transparent: true,
        opacity: 1,
      }),
    [brass]
  )

  const defaultDarkBrass = useMemo(
    () =>
      darkBrass ||
      new THREE.MeshPhysicalMaterial({
        color: '#6e431f',
        metalness: 0.88,
        roughness: 0.32,
        clearcoat: 0.25,
        transparent: true,
        opacity: 1,
      }),
    [darkBrass]
  )

  // 12 Outer lotus petals radiating around the medallion
  const petalCount = 12
  const petalRadius = 0.46

  return (
    <group position={position} scale={scale}>
      {/* Outer base bevel disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={defaultDarkBrass}>
        <cylinderGeometry args={[0.49, 0.52, 0.05, 36]} />
      </mesh>

      {/* Raised outer fluted frame ring */}
      <mesh position={[0, 0, 0.025]} material={defaultBrass}>
        <torusGeometry args={[0.47, 0.038, 16, 40]} />
      </mesh>

      {/* Radiating sculpted lotus petals */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i / petalCount) * Math.PI * 2
        return (
          <group
            key={i}
            position={[
              Math.cos(angle) * petalRadius,
              Math.sin(angle) * petalRadius,
              0.02,
            ]}
            rotation={[0, 0, angle - Math.PI / 2]}
          >
            {/* Scalloped pointed lotus petal */}
            <mesh material={defaultBrass} scale={[0.13, 0.17, 0.03]}>
              <coneGeometry args={[1, 1.2, 4]} />
            </mesh>
            {/* Inner petal bead */}
            <mesh
              position={[0, -0.06, 0.015]}
              material={defaultBrass}
              scale={0.022}
            >
              <sphereGeometry args={[1, 10, 10]} />
            </mesh>
          </group>
        )
      })}

      {/* Secondary interleaved smaller lotus tips */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = ((i + 0.5) / petalCount) * Math.PI * 2
        return (
          <mesh
            key={`sub-${i}`}
            position={[
              Math.cos(angle) * (petalRadius * 0.94),
              Math.sin(angle) * (petalRadius * 0.94),
              0.016,
            ]}
            rotation={[0, 0, angle - Math.PI / 2]}
            material={defaultDarkBrass}
            scale={[0.08, 0.11, 0.024]}
          >
            <coneGeometry args={[1, 1, 4]} />
          </mesh>
        )
      })}

      {/* Inner stepped bezel ring */}
      <mesh position={[0, 0, 0.035]} material={defaultDarkBrass}>
        <torusGeometry args={[0.39, 0.022, 14, 36]} />
      </mesh>

      {/* Monogram face disc with embossed letter 'P' / 'C' */}
      <mesh
        position={[0, 0, 0.038]}
        rotation={[Math.PI / 2, 0, 0]}
        material={faceMaterial}
      >
        <cylinderGeometry args={[0.38, 0.38, 0.02, 36]} />
      </mesh>
    </group>
  )
}
