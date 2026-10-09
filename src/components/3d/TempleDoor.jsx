import { useFrame } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import doorLeftUrl from '../../assets/images/door_left.jpg'
import doorRightUrl from '../../assets/images/door_right.jpg'
import doorLeftNormUrl from '../../assets/images/door_left_norm.png'
import doorRightNormUrl from '../../assets/images/door_right_norm.png'
import templeFrameUrl from '../../assets/images/temple_frame.png'

/* =========================================================
   MATERIAL HELPERS
========================================================= */

function createWoodMaterial(color = '#2c170b') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.04,
    roughness: 0.52,
    clearcoat: 0.35,
    clearcoatRoughness: 0.25,
    transparent: true,
    opacity: 1,
  })
}

function createDarkWoodMaterial(color = '#150a05') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.03,
    roughness: 0.65,
    clearcoat: 0.22,
    transparent: true,
    opacity: 1,
  })
}

function createStoneMaterial(color = '#382b22') {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.04,
    transparent: false,
    opacity: 1,
  })
}

function createBrassMaterial(color = '#c88e38') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.94,
    roughness: 0.22,
    clearcoat: 0.42,
    clearcoatRoughness: 0.2,
    transparent: false,
    opacity: 1,
  })
}

function createDarkBrassMaterial(color = '#6d411b') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.88,
    roughness: 0.32,
    clearcoat: 0.25,
    transparent: true,
    opacity: 1,
  })
}

/* =========================================================
   LOTUS MEDALLION
========================================================= */

function LotusMedallion({ position, scale = 1 }) {
  const brass = useMemo(
    () => createBrassMaterial('#b87932'),
    []
  )

  const darkBrass = useMemo(
    () => createDarkBrassMaterial('#70421d'),
    []
  )

  return (
    <group position={position} scale={scale}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        material={darkBrass}
      >
        <cylinderGeometry args={[0.32, 0.32, 0.07, 32]} />
      </mesh>

      <mesh
        position={[0, 0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={brass}
      >
        <cylinderGeometry args={[0.14, 0.14, 0.06, 24]} />
      </mesh>

      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2
        const radius = 0.34

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              0.06,
              Math.sin(angle) * radius,
            ]}
            rotation={[Math.PI / 2, 0, angle]}
            material={brass}
          >
            <sphereGeometry args={[0.12, 12, 8]} />
          </mesh>
        )
      })}
    </group>
  )
}

/* =========================================================
   TEMPLE BELL
========================================================= */

function TempleBell({ position, scale = 1 }) {
  const brass = useMemo(
    () => createBrassMaterial('#b87932'),
    []
  )

  const darkBrass = useMemo(
    () => createDarkBrassMaterial('#68401d'),
    []
  )

  return (
    <group position={position} scale={scale}>
      <mesh material={darkBrass}>
        <cylinderGeometry args={[0.045, 0.055, 0.35, 12]} />
      </mesh>

      <mesh position={[0, -0.12, 0]} material={brass}>
        <cylinderGeometry args={[0.09, 0.12, 0.16, 16]} />
      </mesh>

      <mesh position={[0, -0.35, 0]} material={brass}>
        <coneGeometry args={[0.29, 0.42, 24]} />
      </mesh>

      <mesh position={[0, -0.55, 0]} material={darkBrass}>
        <torusGeometry args={[0.25, 0.045, 10, 24]} />
      </mesh>

      <mesh position={[0, -0.62, 0]} material={darkBrass}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>
    </group>
  )
}

/* =========================================================
   TEMPLE BRACKET
========================================================= */

function TempleBracket({ position, flip = false }) {
  const stone = useMemo(
    () => createStoneMaterial('#675344'),
    []
  )

  const darkStone = useMemo(
    () => createStoneMaterial('#403128'),
    []
  )

  return (
    <group
      position={position}
      scale={[flip ? -1 : 1, 1, 1]}
    >
      <mesh material={stone}>
        <boxGeometry args={[0.72, 0.18, 0.7]} />
      </mesh>

      <mesh position={[0, -0.3, 0]} material={stone}>
        <boxGeometry args={[0.5, 0.55, 0.52]} />
      </mesh>

      <mesh
        position={[0, -0.58, 0]}
        rotation={[0, 0, Math.PI / 4]}
        material={darkStone}
      >
        <boxGeometry args={[0.65, 0.13, 0.46]} />
      </mesh>

      <mesh position={[0, -0.76, 0]} material={stone}>
        <boxGeometry args={[0.72, 0.13, 0.6]} />
      </mesh>
    </group>
  )
}

/* =========================================================
   TEMPLE PILASTER
========================================================= */

function TemplePilaster({ position }) {
  const stone = useMemo(
    () => createStoneMaterial('#5c493b'),
    []
  )

  const darkStone = useMemo(
    () => createStoneMaterial('#3d3027'),
    []
  )

  const brass = useMemo(
    () => createDarkBrassMaterial('#70451f'),
    []
  )

  return (
    <group position={position}>
      <mesh material={stone}>
        <boxGeometry args={[0.55, 4.85, 0.68]} />
      </mesh>

      <mesh
        position={[0, 0, 0.36]}
        material={darkStone}
      >
        <boxGeometry args={[0.27, 4.15, 0.045]} />
      </mesh>

      <mesh
        position={[0, 0, 0.39]}
        material={brass}
      >
        <boxGeometry args={[0.055, 3.8, 0.035]} />
      </mesh>

      <mesh position={[0, -2.5, 0]} material={stone}>
        <boxGeometry args={[0.9, 0.28, 0.9]} />
      </mesh>

      <mesh position={[0, -2.72, 0]} material={darkStone}>
        <boxGeometry args={[1.08, 0.16, 1]} />
      </mesh>

      <mesh position={[0, 2.5, 0]} material={stone}>
        <boxGeometry args={[0.9, 0.28, 0.9]} />
      </mesh>

      <mesh position={[0, 2.72, 0]} material={darkStone}>
        <boxGeometry args={[1.08, 0.16, 1]} />
      </mesh>
    </group>
  )
}

/* =========================================================
   DOOR PANEL
========================================================= */

function DoorPanel({ y, wood, brass }) {
  const darkWood = useMemo(
    () => createDarkWoodMaterial('#160905'),
    []
  )

  return (
    <group position={[0, y, 0.2]}>
      <mesh material={darkWood}>
        <boxGeometry args={[1.72, 1.25, 0.07]} />
      </mesh>

      <mesh
        position={[0, 0, 0.055]}
        material={wood}
      >
        <boxGeometry args={[1.54, 1.07, 0.055]} />
      </mesh>

      <mesh
        position={[-0.84, 0, 0.105]}
        material={brass}
      >
        <boxGeometry args={[0.055, 1.34, 0.05]} />
      </mesh>

      <mesh
        position={[0.84, 0, 0.105]}
        material={brass}
      >
        <boxGeometry args={[0.055, 1.34, 0.05]} />
      </mesh>

      <mesh
        position={[0, 0.66, 0.105]}
        material={brass}
      >
        <boxGeometry args={[1.72, 0.055, 0.05]} />
      </mesh>

      <mesh
        position={[0, -0.66, 0.105]}
        material={brass}
      >
        <boxGeometry args={[1.72, 0.055, 0.05]} />
      </mesh>
    </group>
  )
}

/* =========================================================
   DOOR STUDS
========================================================= */

function DoorStuds({ brass }) {
  const positions = [
    [-0.82, 1.95],
    [0.82, 1.95],
    [-0.82, 0.5],
    [0.82, 0.5],
    [-0.82, -0.95],
    [0.82, -0.95],
    [-0.82, -2.15],
    [0.82, -2.15],
  ]

  return (
    <>
      {positions.map(([x, y], index) => (
        <mesh
          key={index}
          position={[x, y, 0.3]}
          material={brass}
        >
          <sphereGeometry args={[0.075, 16, 16]} />
        </mesh>
      ))}
    </>
  )
}

/* =========================================================
   DOOR HINGES
========================================================= */

function DoorHingeSet({ side, brass, darkBrass }) {
  const x = side === 'left' ? -0.98 : 0.98

  return (
    <>
      {[1.65, 0, -1.65].map((y, index) => (
        <group
          key={index}
          position={[x, y, 0.22]}
        >
          <mesh material={darkBrass}>
            <boxGeometry args={[0.11, 0.42, 0.08]} />
          </mesh>

          <mesh
            position={[0, 0.19, 0.06]}
            material={brass}
          >
            <sphereGeometry args={[0.07, 12, 12]} />
          </mesh>
        </group>
      ))}
    </>
  )
}

/* =========================================================
   DOOR HANDLE
========================================================= */

function DoorHandle({ position, brass, darkBrass }) {
  return (
    <group position={position}>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        material={darkBrass}
      >
        <cylinderGeometry args={[0.23, 0.23, 0.055, 24]} />
      </mesh>

      <mesh
        position={[0, 0, 0.055]}
        rotation={[Math.PI / 2, 0, 0]}
        material={brass}
      >
        <torusGeometry args={[0.17, 0.045, 12, 28]} />
      </mesh>
    </group>
  )
}

/* =========================================================
   TEMPLE CORNICE
========================================================= */

function TempleCornice({
  stone,
  darkStone,
  stoneLight,
}) {
  const darkBand = useMemo(
    () => createDarkBrassMaterial('#70451f'),
    []
  )

  const brassBand = useMemo(
    () => createBrassMaterial('#a86d32'),
    []
  )

  return (
    <group>
      <mesh
        position={[0, 5.18, 0]}
        material={stone}
      >
        <boxGeometry args={[6.55, 0.42, 0.82]} />
      </mesh>

      <mesh
        position={[0, 4.91, 0.02]}
        material={darkStone}
      >
        <boxGeometry args={[5.95, 0.16, 0.9]} />
      </mesh>

      <mesh
        position={[0, 5.55, 0]}
        material={stoneLight}
      >
        <boxGeometry args={[6.9, 0.2, 0.88]} />
      </mesh>

      <mesh
        position={[0, 5.77, 0]}
        material={darkStone}
      >
        <boxGeometry args={[6.6, 0.16, 0.8]} />
      </mesh>

      <mesh
        position={[0, 5.96, 0]}
        material={stone}
      >
        <boxGeometry args={[6.25, 0.2, 0.72]} />
      </mesh>

      <mesh
        position={[0, 5.4, 0.46]}
        material={darkBand}
      >
        <boxGeometry args={[5.8, 0.07, 0.045]} />
      </mesh>

      <mesh
        position={[0, 5.68, 0.46]}
        material={brassBand}
      >
        <boxGeometry args={[5.45, 0.045, 0.04]} />
      </mesh>
    </group>
  )
}

/* =========================================================
   MAIN TEMPLE DOOR
========================================================= */

export default function TempleDoor({ onOpen }) {
  const doorRef = useRef(null)

  const leftDoorRef = useRef(null)
  const rightDoorRef = useRef(null)

  const innerLightRef = useRef(null)
  const innerGlowRef = useRef(null)

  // NEW:
  // These two refs control geometry that must disappear
  // when the doors physically open.
  const doorBackingRef = useRef(null)
  const centralSeamRef = useRef(null)

  const openStartRef = useRef(null)
  const [opening, setOpening] = useState(false)

  const stone = useMemo(
    () => createStoneMaterial('#352920'),
    []
  )

  const darkStone = useMemo(
    () => createStoneMaterial('#231a14'),
    []
  )

  const stoneLight = useMemo(
    () => createStoneMaterial('#4a3a2d'),
    []
  )

  const wood = useMemo(
    () => createWoodMaterial('#2c170b'),
    []
  )

  const darkWood = useMemo(
    () => createDarkWoodMaterial('#150a05'),
    []
  )

  /*
    IMPORTANT:
    Separate materials for the fixed backing and seam.

    This prevents fading them from accidentally fading
    the door panels that use the normal darkWood/darkBrass
    materials.
  */
  const backingMaterial = useMemo(
    () => createDarkWoodMaterial('#100603'),
    []
  )

  const seamMaterial = useMemo(
    () => createDarkBrassMaterial('#6d411b'),
    []
  )

  const brass = useMemo(
    () => createBrassMaterial('#c88e38'),
    []
  )

  const darkBrass = useMemo(
    () => createDarkBrassMaterial('#6d411b'),
    []
  )

  const { doorLeftTex, doorRightTex, doorLeftNorm, doorRightNorm, frameTex } = useMemo(() => {
    const loader = new THREE.TextureLoader()
    const left = loader.load(doorLeftUrl)
    left.colorSpace = THREE.SRGBColorSpace
    const right = loader.load(doorRightUrl)
    right.colorSpace = THREE.SRGBColorSpace
    const leftNorm = loader.load(doorLeftNormUrl)
    const rightNorm = loader.load(doorRightNormUrl)
    const frame = loader.load(templeFrameUrl)
    frame.colorSpace = THREE.SRGBColorSpace
    return {
      doorLeftTex: left,
      doorRightTex: right,
      doorLeftNorm: leftNorm,
      doorRightNorm: rightNorm,
      frameTex: frame,
    }
  }, [])

  const doorLeftMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: doorLeftTex,
        normalMap: doorLeftNorm,
        normalScale: new THREE.Vector2(0.18, 0.18),
        metalness: 0.14,
        roughness: 0.38,
        clearcoat: 0.28,
        clearcoatRoughness: 0.22,
        transparent: true,
        opacity: 1,
      }),
    [doorLeftTex, doorLeftNorm]
  )

  const doorRightMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        map: doorRightTex,
        normalMap: doorRightNorm,
        normalScale: new THREE.Vector2(0.18, 0.18),
        metalness: 0.14,
        roughness: 0.38,
        clearcoat: 0.28,
        clearcoatRoughness: 0.22,
        transparent: true,
        opacity: 1,
      }),
    [doorRightTex, doorRightNorm]
  )

  const frameMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: frameTex,
        transparent: true,
        alphaTest: 0.05,
        roughness: 0.72,
        metalness: 0.04,
        opacity: 1,
      }),
    [frameTex]
  )

  const leftDoorMaterials = useMemo(
    () => [darkWood, darkWood, darkWood, darkWood, doorLeftMaterial, doorLeftMaterial],
    [darkWood, doorLeftMaterial]
  )

  const rightDoorMaterials = useMemo(
    () => [darkWood, darkWood, darkWood, darkWood, doorRightMaterial, doorRightMaterial],
    [darkWood, doorRightMaterial]
  )

  /* =======================================================
     HANDLE DOOR CLICK
  ======================================================= */

  const handleOpen = (event) => {
    event.stopPropagation()

    if (opening) return

    const sceneTime =
      window.__weddingSceneTime ?? 13

    // Door cannot be opened before the cinematic finishes.
    if (sceneTime < 13) return

    setOpening(true)
    openStartRef.current = sceneTime

    if (onOpen) {
      onOpen()
    }
  }

  /* =======================================================
     ANIMATION
  ======================================================= */

  useFrame((state) => {
    if (!doorRef.current) return

    const elapsed = state.clock.getElapsedTime()

    /*
      Store scene time globally so the click handler
      knows whether the 13-second cinematic has finished.
    */
    window.__weddingSceneTime = elapsed

    /* -----------------------------------------------
       DOOR REVEAL
    ----------------------------------------------- */

    const reveal = THREE.MathUtils.smoothstep(
      elapsed,
      6.8,
      10.2
    )

    doorRef.current.traverse((child) => {
      if (!child.material || child.userData?.isThreshold) return

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material]

      materials.forEach((material) => {
        material.transparent = true
        material.opacity = reveal
      })
    })

    /* -----------------------------------------------
       DOOR OPENING
    ----------------------------------------------- */

    let openProgress = 0

    if (
      opening &&
      openStartRef.current !== null
    ) {
      openProgress = THREE.MathUtils.smoothstep(
        elapsed,
        openStartRef.current,
        openStartRef.current + 1.6
      )
    }

    /* -----------------------------------------------
       LEFT & RIGHT DOORS SWING INWARD INTO CHAMBER
       Left rotates around +Y (swings inward into -Z)
       Right rotates around -Y (swings inward into -Z)
    ----------------------------------------------- */

    const swing = Math.sin(openProgress * Math.PI * 0.5) * (Math.PI * 0.40)

    if (leftDoorRef.current) {
      leftDoorRef.current.rotation.y = swing
    }

    if (rightDoorRef.current) {
      rightDoorRef.current.rotation.y = -swing
    }

    /* -----------------------------------------------
       INTERIOR LIGHT (AMBER TO CHAMPAGNE BLOOM)
    ----------------------------------------------- */

    if (innerLightRef.current) {
      const revealLight =
        THREE.MathUtils.smoothstep(
          elapsed,
          7.4,
          10.8
        )

      innerLightRef.current.intensity =
        revealLight * 1.5 + openProgress * 5.5

      // Light color shifts from warm amber to soft champagne-ivory
      const amber = new THREE.Color('#f59e38')
      const champagne = new THREE.Color('#fcf6ed')
      innerLightRef.current.color.copy(amber).lerp(champagne, openProgress)
    }

    /* -----------------------------------------------
       REMOVE FIXED BACKING ON OPEN
    ----------------------------------------------- */

    if (doorBackingRef.current) {
      const backingFade =
        Math.max(0, 1 - openProgress * 4.0)

      doorBackingRef.current.material.opacity =
        reveal * backingFade

      doorBackingRef.current.material.needsUpdate =
        true
    }
  })

  return (
    <group
      ref={doorRef}
      position={[0, 0, -5.8]}
    >
      {/* =================================================
          TEMPLE PORTAL FRAME (REFERENCE ARTWORK)
      ================================================= */}

      <mesh
        position={[0, 2.558, 0.005]}
        material={frameMaterial}
      >
        <planeGeometry args={[6.768, 7.412]} />
      </mesh>

      {/* =================================================
          THIN DOOR BACKING (FADES ON FIRST TOUCH)
      ================================================= */}

      <mesh
        ref={doorBackingRef}
        position={[0, 2.45, -0.05]}
        material={backingMaterial}
      >
        <boxGeometry
          args={[3.88, 4.85, 0.02]}
        />
      </mesh>

      {/* =================================================
          LEFT DOOR HINGE PIVOT (OUTER HINGE AXIS)
      ================================================= */}

      <group
        ref={leftDoorRef}
        position={[-1.93, 2.45, 0.04]}
        onPointerDown={handleOpen}
      >
        <group position={[0.965, 0, 0]}>
          <mesh material={leftDoorMaterials}>
            <boxGeometry
              args={[1.93, 4.85, 0.12]}
            />
          </mesh>
        </group>
      </group>

      {/* =================================================
          RIGHT DOOR HINGE PIVOT (OUTER HINGE AXIS)
      ================================================= */}

      <group
        ref={rightDoorRef}
        position={[1.93, 2.45, 0.04]}
        onPointerDown={handleOpen}
      >
        <group position={[-0.965, 0, 0]}>
          <mesh material={rightDoorMaterials}>
            <boxGeometry
              args={[1.93, 4.85, 0.12]}
            />
          </mesh>
        </group>
      </group>

      {/* Central seam reference (preserved for animation lifecycle) */}
      <group ref={centralSeamRef} />

      {/* =================================================
          THRESHOLD

          This intentionally remains after opening.
      ================================================= */}

      <mesh
        userData={{ isThreshold: true }}
        position={[0, -0.145, -0.12]}
        material={stone}
      >
        <boxGeometry
          args={[5.45, 0.32, 0.85]}
        />
      </mesh>

      <mesh
        userData={{ isThreshold: true }}
        position={[0, 0.055, 0.32]}
        material={brass}
      >
        <boxGeometry
          args={[4.85, 0.08, 0.07]}
        />
      </mesh>

      {/* =================================================
          INTERIOR LIGHT
      ================================================= */}

      <pointLight
        ref={innerLightRef}
        position={[0, 2.7, -0.9]}
        color="#e89043"
        distance={10}
        decay={1.4}
        intensity={0}
      />

    </group>
  )
}