import { useMemo } from 'react'
import * as THREE from 'three'

/**
 * CarvedWoodPanel
 * Multi-tiered traditional Dravidian bolection molding and carved panel field.
 */
export function CarvedWoodPanel({
  y = 0,
  height = 1.62,
  width = 1.74,
  wood,
  darkWood,
  brass,
  darkBrass,
  isUpper = false,
}) {
  return (
    <group position={[0, y, 0.2]}>
      {/* Outer stepped dark rosewood frame */}
      <mesh material={darkWood}>
        <boxGeometry args={[width, height, 0.07]} />
      </mesh>

      {/* Recessed carved wood panel field */}
      <mesh position={[0, 0, 0.04]} material={wood}>
        <boxGeometry args={[width - 0.14, height - 0.14, 0.05]} />
      </mesh>

      {/* Outer antique bronze fillet border */}
      <mesh position={[0, 0, 0.066]} material={darkBrass}>
        <boxGeometry args={[width - 0.08, height - 0.08, 0.02]} />
      </mesh>

      {/* Inner thin golden bead / molding strip */}
      <mesh position={[0, 0, 0.072]} material={brass}>
        <boxGeometry args={[width - 0.18, height - 0.18, 0.018]} />
      </mesh>

      {/* Corner floral arabesque carvings (4 corners) */}
      {[
        [-1, 1],
        [1, 1],
        [-1, -1],
        [1, -1],
      ].map(([cx, cy], i) => {
        const posX = cx * (width / 2 - 0.22)
        const posY = cy * (height / 2 - 0.22)
        return (
          <group key={i} position={[posX, posY, 0.075]}>
            <mesh
              rotation={[0, 0, (cx * cy > 0 ? 0 : Math.PI / 2) + (cy < 0 ? Math.PI : 0)]}
              material={darkBrass}
            >
              <torusGeometry args={[0.09, 0.018, 8, 16, Math.PI]} />
            </mesh>
            <mesh position={[0, 0, 0.01]} material={brass}>
              <sphereGeometry args={[0.024, 8, 8]} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

/**
 * CarvedLotusMotif
 * Rich South Indian blooming lotus (padma) carving with layered relief petals,
 * central bud, and ornamental curling foliate scrolls.
 */
export function CarvedLotusMotif({
  position = [0, 0, 0],
  scale = 1,
  brass,
  darkBrass,
  wood,
}) {
  // Petal geometries for the blooming lotus blossom
  const petalGeom = useMemo(() => new THREE.ConeGeometry(0.12, 0.44, 4), [])
  const smallPetalGeom = useMemo(() => new THREE.ConeGeometry(0.09, 0.32, 4), [])

  return (
    <group position={position} scale={scale}>
      {/* Base lotus pedestal / calyx bracket */}
      <mesh position={[0, -0.32, 0.04]} material={darkBrass}>
        <cylinderGeometry args={[0.28, 0.18, 0.06, 20]} />
      </mesh>

      <mesh position={[0, -0.34, 0.06]} material={brass}>
        <torusGeometry args={[0.26, 0.024, 10, 24]} />
      </mesh>

      {/* Curled foliate scrollwork leaves flanking the base */}
      {[-1, 1].map((dir, i) => (
        <group key={i} position={[dir * 0.28, -0.3, 0.05]}>
          <mesh
            rotation={[0, 0, dir * 0.6]}
            scale={[0.18, 0.08, 0.03]}
            material={darkBrass}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
          <mesh
            position={[dir * 0.12, 0.06, 0.01]}
            rotation={[0, 0, dir * 1.1]}
            scale={[0.12, 0.06, 0.025]}
            material={brass}
          >
            <boxGeometry args={[1, 1, 1]} />
          </mesh>
        </group>
      ))}

      {/* Central Upright Lotus Bud & Core Petal */}
      <group position={[0, 0.02, 0.065]}>
        <mesh
          rotation={[0, 0, 0]}
          scale={[1, 1.25, 0.5]}
          material={brass}
          geometry={petalGeom}
        />
        <mesh
          position={[0, 0.08, 0.02]}
          scale={[0.04, 0.1, 0.04]}
          material={darkBrass}
        >
          <sphereGeometry args={[1, 10, 10]} />
        </mesh>
      </group>

      {/* Inner Tier Petals (angles: -18, +18 deg) */}
      {[-18, 18].map((angle, i) => (
        <mesh
          key={`in-${i}`}
          position={[Math.sin((angle * Math.PI) / 180) * 0.11, -0.02, 0.06]}
          rotation={[0, 0, -(angle * Math.PI) / 180]}
          scale={[0.9, 1.05, 0.45]}
          material={brass}
          geometry={petalGeom}
        />
      ))}

      {/* Middle Tier Petals (angles: -38, +38 deg) */}
      {[-38, 38].map((angle, i) => (
        <mesh
          key={`mid-${i}`}
          position={[Math.sin((angle * Math.PI) / 180) * 0.22, -0.1, 0.052]}
          rotation={[0, 0, -(angle * Math.PI) / 180]}
          scale={[0.85, 0.95, 0.4]}
          material={darkBrass}
          geometry={petalGeom}
        />
      ))}

      {/* Outer Spreading Petals (angles: -62, +62 deg) */}
      {[-62, 62].map((angle, i) => (
        <mesh
          key={`out-${i}`}
          position={[Math.sin((angle * Math.PI) / 180) * 0.32, -0.19, 0.045]}
          rotation={[0, 0, -(angle * Math.PI) / 180]}
          scale={[0.8, 0.85, 0.35]}
          material={brass}
          geometry={smallPetalGeom}
        />
      ))}

      {/* Center lotus seedpod / receptacle boss */}
      <mesh
        position={[0, -0.16, 0.07]}
        rotation={[Math.PI / 2, 0, 0]}
        material={brass}
      >
        <cylinderGeometry args={[0.1, 0.12, 0.03, 16]} />
      </mesh>
    </group>
  )
}

/**
 * LionKnocker
 * Traditional South Indian lion/yali mask knocker with antique bronze ring pull.
 */
export function LionKnocker({
  position = [0, 0, 0],
  brass,
  darkBrass,
}) {
  return (
    <group position={position}>
      {/* Outer circular boss plate */}
      <mesh
        position={[0, 0, 0.02]}
        rotation={[Math.PI / 2, 0, 0]}
        material={darkBrass}
      >
        <cylinderGeometry args={[0.21, 0.23, 0.04, 28]} />
      </mesh>

      {/* Beaded boss rim */}
      <mesh position={[0, 0, 0.04]} material={brass}>
        <torusGeometry args={[0.2, 0.022, 12, 28]} />
      </mesh>

      {/* Radiating lion mane ridges */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * 0.15,
              Math.sin(angle) * 0.15,
              0.045,
            ]}
            rotation={[0, 0, angle]}
            material={brass}
            scale={[0.04, 0.07, 0.02]}
          >
            <coneGeometry args={[1, 1, 4]} />
          </mesh>
        )
      })}

      {/* Sculpted Lion / Yali Mask Boss */}
      <group position={[0, 0.03, 0.06]}>
        {/* Forehead dome */}
        <mesh material={brass} scale={[0.09, 0.08, 0.06]}>
          <sphereGeometry args={[1, 16, 16]} />
        </mesh>
        {/* Snout boss */}
        <mesh position={[0, -0.05, 0.02]} material={darkBrass} scale={[0.06, 0.05, 0.04]}>
          <sphereGeometry args={[1, 12, 12]} />
        </mesh>
        {/* Eyes */}
        {[-0.038, 0.038].map((ex, i) => (
          <mesh key={i} position={[ex, 0.015, 0.055]} material={darkBrass}>
            <sphereGeometry args={[0.012, 8, 8]} />
          </mesh>
        ))}
      </group>

      {/* Antique Bronze Hanging Knocker Ring */}
      <mesh
        position={[0, -0.15, 0.085]}
        rotation={[0.12, 0, 0]}
        material={brass}
      >
        <torusGeometry args={[0.15, 0.036, 16, 32]} />
      </mesh>

      {/* Knocker Anvil Stud below */}
      <mesh position={[0, -0.28, 0.05]} material={darkBrass}>
        <sphereGeometry args={[0.042, 14, 14]} />
      </mesh>
    </group>
  )
}

/**
 * DoorBossStuds
 * Rows of traditional brass boss rivets/studs with circular washer backplates
 * matching the authentic temple door reference.
 */
export function DoorBossStuds({ brass, darkBrass, knockerSide = 'left' }) {
  // Stud coordinates across rails and stiles
  const studPositions = useMemo(() => {
    const list = []

    // 1. Top rail row (y = 2.16)
    ;[-0.66, -0.22, 0.22, 0.66].forEach((x) => list.push([x, 2.16]))

    // 2. Upper rail row (y = 0.44)
    ;[-0.66, -0.22, 0.22, 0.66].forEach((x) => list.push([x, 0.44]))

    // 3. Middle rail row (y = -0.15) — studs flanking the knocker
    const midX = knockerSide === 'left' ? [-0.66, -0.22, 0.8] : [-0.8, 0.22, 0.66]
    midX.forEach((x) => list.push([x, -0.15]))

    // 4. Lower rail row (y = -0.58)
    ;[-0.66, -0.22, 0.22, 0.66].forEach((x) => list.push([x, -0.58]))

    // 5. Bottom rail row (y = -2.22)
    ;[-0.66, -0.22, 0.22, 0.66].forEach((x) => list.push([x, -2.22]))

    // 6. Outer vertical stile column (x = ±0.82)
    ;[1.7, 1.2, 0.8, -1.0, -1.4, -1.8].forEach((y) => {
      list.push([-0.82, y])
      list.push([0.82, y])
    })

    return list
  }, [knockerSide])

  return (
    <>
      {studPositions.map(([x, y], idx) => (
        <group key={idx} position={[x, y, 0.27]}>
          {/* Circular dark washer plate */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={darkBrass}>
            <cylinderGeometry args={[0.052, 0.056, 0.016, 14]} />
          </mesh>
          {/* Polished hemispherical brass dome */}
          <mesh position={[0, 0, 0.015]} material={brass}>
            <sphereGeometry args={[0.046, 14, 14]} />
          </mesh>
        </group>
      ))}
    </>
  )
}
