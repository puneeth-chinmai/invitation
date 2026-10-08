import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'


/* =========================================================
   MATERIAL HELPERS
========================================================= */

function createWoodMaterial(color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.05,
    roughness: 0.58,
    clearcoat: 0.28,
    clearcoatRoughness: 0.3,
    transparent: true,
    opacity: 1,
  })
}

function createDarkWoodMaterial(color = '#120804') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.03,
    roughness: 0.7,
    clearcoat: 0.16,
    transparent: true,
    opacity: 1,
  })
}

function createStoneMaterial(color = '#514238') {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.04,
    transparent: true,
    opacity: 1,
  })
}

function createBrassMaterial(color = '#a86d32') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.92,
    roughness: 0.24,
    clearcoat: 0.38,
    clearcoatRoughness: 0.18,
    transparent: true,
    opacity: 1,
  })
}

function createDarkBrassMaterial(color = '#68401d') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.88,
    roughness: 0.3,
    clearcoat: 0.25,
    transparent: true,
    opacity: 1,
  })
}


/* =========================================================
   LOTUS MEDALLION
========================================================= */

function LotusMedallion({
  position,
  scale = 1,
}) {
  const brass = useMemo(
    () => createBrassMaterial('#b87932'),
    []
  )

  const darkBrass = useMemo(
    () => createDarkBrassMaterial('#70421d'),
    []
  )

  return (
    <group
      position={position}
      scale={scale}
    >
      {/* Back plate */}
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        material={darkBrass}
      >
        <cylinderGeometry
          args={[0.32, 0.32, 0.07, 32]}
        />
      </mesh>

      {/* Central lotus disc */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        material={brass}
      >
        <cylinderGeometry
          args={[0.14, 0.14, 0.06, 24]}
        />
      </mesh>

      {/* Lotus petals */}
      {Array.from({ length: 8 }).map((_, index) => {
        const angle =
          (index / 8) * Math.PI * 2

        const radius = 0.34

        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius,
              0.06,
              Math.sin(angle) * radius,
            ]}
            rotation={[
              Math.PI / 2,
              0,
              angle,
            ]}
            material={brass}
          >
            <sphereGeometry
              args={[0.12, 12, 8]}
            />
          </mesh>
        )
      })}
    </group>
  )
}


/* =========================================================
   TEMPLE BELL
========================================================= */

function TempleBell({
  position,
  scale = 1,
}) {
  const brass = useMemo(
    () => createBrassMaterial('#b87932'),
    []
  )

  const darkBrass = useMemo(
    () => createDarkBrassMaterial('#68401d'),
    []
  )

  return (
    <group
      position={position}
      scale={scale}
    >
      {/* Hanging stem */}
      <mesh
        material={darkBrass}
      >
        <cylinderGeometry
          args={[0.045, 0.055, 0.35, 12]}
        />
      </mesh>

      {/* Crown */}
      <mesh
        position={[0, -0.12, 0]}
        material={brass}
      >
        <cylinderGeometry
          args={[0.09, 0.12, 0.16, 16]}
        />
      </mesh>

      {/* Bell */}
      <mesh
        position={[0, -0.35, 0]}
        material={brass}
      >
        <coneGeometry
          args={[0.29, 0.42, 24]}
        />
      </mesh>

      {/* Bell rim */}
      <mesh
        position={[0, -0.55, 0]}
        material={darkBrass}
      >
        <torusGeometry
          args={[0.25, 0.045, 10, 24]}
        />
      </mesh>

      {/* Clapper */}
      <mesh
        position={[0, -0.62, 0]}
        material={darkBrass}
      >
        <sphereGeometry
          args={[0.06, 12, 12]}
        />
      </mesh>
    </group>
  )
}


/* =========================================================
   TEMPLE BRACKET
========================================================= */

function TempleBracket({
  position,
  flip = false,
}) {
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
      scale={[
        flip ? -1 : 1,
        1,
        1,
      ]}
    >
      {/* Upper block */}
      <mesh material={stone}>
        <boxGeometry
          args={[0.72, 0.18, 0.7]}
        />
      </mesh>

      {/* Main bracket */}
      <mesh
        position={[0, -0.3, 0]}
        material={stone}
      >
        <boxGeometry
          args={[0.5, 0.55, 0.52]}
        />
      </mesh>

      {/* Diagonal support */}
      <mesh
        position={[0, -0.58, 0]}
        rotation={[0, 0, Math.PI / 4]}
        material={darkStone}
      >
        <boxGeometry
          args={[0.65, 0.13, 0.46]}
        />
      </mesh>

      {/* Small decorative cap */}
      <mesh
        position={[0, -0.76, 0]}
        material={stone}
      >
        <boxGeometry
          args={[0.72, 0.13, 0.6]}
        />
      </mesh>
    </group>
  )
}


/* =========================================================
   TEMPLE PILASTER
========================================================= */

function TemplePilaster({
  position,
}) {
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

      {/* Main shaft */}
      <mesh material={stone}>
        <boxGeometry
          args={[0.55, 4.85, 0.68]}
        />
      </mesh>

      {/* Recessed vertical carving */}
      <mesh
        position={[0, 0, 0.36]}
        material={darkStone}
      >
        <boxGeometry
          args={[0.27, 4.15, 0.045]}
        />
      </mesh>

      {/* Central ornamental strip */}
      <mesh
        position={[0, 0, 0.39]}
        material={brass}
      >
        <boxGeometry
          args={[0.055, 3.8, 0.035]}
        />
      </mesh>

      {/* Lower capital */}
      <mesh
        position={[0, -2.5, 0]}
        material={stone}
      >
        <boxGeometry
          args={[0.9, 0.28, 0.9]}
        />
      </mesh>

      <mesh
        position={[0, -2.72, 0]}
        material={darkStone}
      >
        <boxGeometry
          args={[1.08, 0.16, 1.0]}
        />
      </mesh>

      {/* Upper capital */}
      <mesh
        position={[0, 2.5, 0]}
        material={stone}
      >
        <boxGeometry
          args={[0.9, 0.28, 0.9]}
        />
      </mesh>

      <mesh
        position={[0, 2.72, 0]}
        material={darkStone}
      >
        <boxGeometry
          args={[1.08, 0.16, 1.0]}
        />
      </mesh>
    </group>
  )
}


/* =========================================================
   DOOR PANEL
========================================================= */

function DoorPanel({
  y,
  wood,
  brass,
}) {
  return (
    <group
      position={[0, y, 0.2]}
    >
      {/* Deep inset */}
      <mesh
        material={createDarkWoodMaterial('#160905')}
      >
        <boxGeometry
          args={[1.72, 1.25, 0.07]}
        />
      </mesh>

      {/* Inner wood panel */}
      <mesh
        position={[0, 0, 0.055]}
        material={wood}
      >
        <boxGeometry
          args={[1.54, 1.07, 0.055]}
        />
      </mesh>

      {/* Left moulding */}
      <mesh
        position={[-0.84, 0, 0.105]}
        material={brass}
      >
        <boxGeometry
          args={[0.055, 1.34, 0.05]}
        />
      </mesh>

      {/* Right moulding */}
      <mesh
        position={[0.84, 0, 0.105]}
        material={brass}
      >
        <boxGeometry
          args={[0.055, 1.34, 0.05]}
        />
      </mesh>

      {/* Top moulding */}
      <mesh
        position={[0, 0.66, 0.105]}
        material={brass}
      >
        <boxGeometry
          args={[1.72, 0.055, 0.05]}
        />
      </mesh>

      {/* Bottom moulding */}
      <mesh
        position={[0, -0.66, 0.105]}
        material={brass}
      >
        <boxGeometry
          args={[1.72, 0.055, 0.05]}
        />
      </mesh>
    </group>
  )
}


/* =========================================================
   DOOR STUDS
========================================================= */

function DoorStuds({
  brass,
}) {
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
          <sphereGeometry
            args={[0.075, 16, 16]}
          />
        </mesh>
      ))}
    </>
  )
}


/* =========================================================
   DOOR HINGES
========================================================= */

function DoorHinges({
  brass,
  darkBrass,
}) {
  const positions = [
    [-2.05, 3.9],
    [-2.05, 2.25],
    [-2.05, 0.6],
    [2.05, 3.9],
    [2.05, 2.25],
    [2.05, 0.6],
  ]

  return (
    <>
      {positions.map(([x, y], index) => (
        <group
          key={index}
          position={[x, y, 0.2]}
        >
          <mesh material={darkBrass}>
            <boxGeometry
              args={[0.11, 0.42, 0.08]}
            />
          </mesh>

          <mesh
            position={[0, 0.19, 0.06]}
            material={brass}
          >
            <sphereGeometry
              args={[0.07, 12, 12]}
            />
          </mesh>
        </group>
      ))}
    </>
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
  return (
    <group>

      {/* Main lintel */}
      <mesh
        position={[0, 5.18, 0]}
        material={stone}
      >
        <boxGeometry
          args={[6.55, 0.42, 0.82]}
        />
      </mesh>

      {/* Lower step */}
      <mesh
        position={[0, 4.91, 0.02]}
        material={darkStone}
      >
        <boxGeometry
          args={[5.95, 0.16, 0.9]}
        />
      </mesh>

      {/* Upper step */}
      <mesh
        position={[0, 5.55, 0]}
        material={stoneLight}
      >
        <boxGeometry
          args={[6.9, 0.2, 0.88]}
        />
      </mesh>

      {/* Second upper step */}
      <mesh
        position={[0, 5.77, 0]}
        material={darkStone}
      >
        <boxGeometry
          args={[6.6, 0.16, 0.8]}
        />
      </mesh>

      {/* Final crown */}
      <mesh
        position={[0, 5.96, 0]}
        material={stone}
      >
        <boxGeometry
          args={[6.25, 0.2, 0.72]}
        />
      </mesh>

      {/* Brass decorative bands */}
      <mesh
        position={[0, 5.4, 0.46]}
        material={createDarkBrassMaterial('#70451f')}
      >
        <boxGeometry
          args={[5.8, 0.07, 0.045]}
        />
      </mesh>

      <mesh
        position={[0, 5.68, 0.46]}
        material={createBrassMaterial('#a86d32')}
      >
        <boxGeometry
          args={[5.45, 0.045, 0.04]}
        />
      </mesh>
    </group>
  )
}


/* =========================================================
   MAIN TEMPLE DOOR
========================================================= */

export default function TempleDoor() {
  const doorRef = useRef(null)
  const innerLightRef = useRef(null)

  /*
    Materials are created once.
    They start visible and are controlled
    by the reveal animation.
  */

  const stone = useMemo(
    () => createStoneMaterial('#514238'),
    []
  )

  const darkStone = useMemo(
    () => createStoneMaterial('#392b23'),
    []
  )

  const stoneLight = useMemo(
    () => createStoneMaterial('#675344'),
    []
  )

  const wood = useMemo(
    () => createWoodMaterial('#321a0d'),
    []
  )

  const darkWood = useMemo(
    () => createDarkWoodMaterial('#120704'),
    []
  )

  const brass = useMemo(
    () => createBrassMaterial('#a86d32'),
    []
  )

  const darkBrass = useMemo(
    () => createDarkBrassMaterial('#68401d'),
    []
  )


  /* =======================================================
     CINEMATIC REVEAL
  ======================================================= */

  useFrame((state) => {
    if (!doorRef.current) return

    const elapsed =
      state.clock.getElapsedTime()

    /*
      Door begins becoming visible
      as the camera approaches it.
    */

    const reveal =
      THREE.MathUtils.smoothstep(
        elapsed,
        6.8,
        10.2
      )

    doorRef.current.traverse((child) => {
      if (!child.material) return

      const materials = Array.isArray(
        child.material
      )
        ? child.material
        : [child.material]

      materials.forEach((material) => {
        material.transparent = true
        material.opacity = reveal
        material.needsUpdate = true
      })
    })

    /*
      Warm interior glow.
    */

    if (innerLightRef.current) {
      const lightReveal =
        THREE.MathUtils.smoothstep(
          elapsed,
          7.4,
          10.8
        )

      innerLightRef.current.intensity =
        lightReveal * 2.6
    }
  })


  return (
    <group
      ref={doorRef}
      position={[0, 0, -5.8]}
    >

      {/* ===================================================
          DEEP RECESS
          
          IMPORTANT:
          This is BEHIND the door.
          The previous version had this too far forward,
          which physically hid the door.
      =================================================== */}

      <mesh
        position={[0, 2.5, -0.65]}
        material={darkStone}
      >
        <boxGeometry
          args={[6.0, 5.75, 0.35]}
        />
      </mesh>


      {/* ===================================================
          INNER STONE FRAME
      =================================================== */}

      <mesh
        position={[-2.55, 2.45, -0.2]}
        material={stone}
      >
        <boxGeometry
          args={[0.38, 5.15, 0.72]}
        />
      </mesh>

      <mesh
        position={[2.55, 2.45, -0.2]}
        material={stone}
      >
        <boxGeometry
          args={[0.38, 5.15, 0.72]}
        />
      </mesh>


      {/* ===================================================
          SIDE PILASTERS
      =================================================== */}

      <TemplePilaster
        position={[-2.92, 2.45, 0]}
      />

      <TemplePilaster
        position={[2.92, 2.45, 0]}
      />


      {/* ===================================================
          OUTER STEPPED STONE FRAME
      =================================================== */}

      <mesh
        position={[-3.28, 2.5, -0.05]}
        material={darkStone}
      >
        <boxGeometry
          args={[0.2, 5.8, 0.82]}
        />
      </mesh>

      <mesh
        position={[3.28, 2.5, -0.05]}
        material={darkStone}
      >
        <boxGeometry
          args={[0.2, 5.8, 0.82]}
        />
      </mesh>

      <mesh
        position={[-3.42, 2.5, -0.12]}
        material={stone}
      >
        <boxGeometry
          args={[0.12, 5.55, 0.9]}
        />
      </mesh>

      <mesh
        position={[3.42, 2.5, -0.12]}
        material={stone}
      >
        <boxGeometry
          args={[0.12, 5.55, 0.9]}
        />
      </mesh>


      {/* ===================================================
          CORNICE
      =================================================== */}

      <TempleCornice
        stone={stone}
        darkStone={darkStone}
        stoneLight={stoneLight}
      />


      {/* ===================================================
          CENTRAL LOTUS CREST
      =================================================== */}

      <LotusMedallion
        position={[0, 5.56, 0.52]}
        scale={1.25}
      />


      {/* ===================================================
          TEMPLE BRACKETS
      =================================================== */}

      <TempleBracket
        position={[-2.3, 4.85, 0.15]}
      />

      <TempleBracket
        position={[2.3, 4.85, 0.15]}
        flip
      />

      <TempleBracket
        position={[-2.85, 5.0, 0.05]}
      />

      <TempleBracket
        position={[2.85, 5.0, 0.05]}
        flip
      />


      {/* ===================================================
          TEMPLE BELLS
      =================================================== */}

      <TempleBell
        position={[-2.55, 4.38, 0.5]}
        scale={0.7}
      />

      <TempleBell
        position={[2.55, 4.38, 0.5]}
        scale={0.7}
      />


      {/* ===================================================
          ARCHITECTURAL SIDE LOTUS
      =================================================== */}

      <LotusMedallion
        position={[-2.58, 3.75, 0.48]}
        scale={0.45}
      />

      <LotusMedallion
        position={[2.58, 3.75, 0.48]}
        scale={0.45}
      />


      {/* ===================================================
          DOOR BACKING
          
          BEHIND the wooden leaves.
      =================================================== */}

      <mesh
        position={[0, 2.45, -0.28]}
        material={darkWood}
      >
        <boxGeometry
          args={[4.35, 5.05, 0.3]}
        />
      </mesh>


      {/* ===================================================
          LEFT DOOR
      =================================================== */}

      <group
        position={[-1.08, 2.45, 0]}
      >

        {/* Main leaf */}
        <mesh material={wood}>
          <boxGeometry
            args={[2.05, 4.85, 0.34]}
          />
        </mesh>

        {/* Outer dark frame */}
        <mesh
          position={[0, 0, 0.2]}
          material={darkWood}
        >
          <boxGeometry
            args={[1.9, 4.7, 0.055]}
          />
        </mesh>

        {/* Panels */}
        <DoorPanel
          y={1.55}
          wood={wood}
          brass={brass}
        />

        <DoorPanel
          y={0.05}
          wood={wood}
          brass={brass}
        />

        <DoorPanel
          y={-1.45}
          wood={wood}
          brass={brass}
        />

        {/* Lotus ornaments */}
        <LotusMedallion
          position={[0, 1.55, 0.31]}
          scale={0.58}
        />

        <LotusMedallion
          position={[0, -1.45, 0.31]}
          scale={0.58}
        />

        {/* Studs */}
        <DoorStuds
          brass={brass}
        />
      </group>


      {/* ===================================================
          RIGHT DOOR
      =================================================== */}

      <group
        position={[1.08, 2.45, 0]}
      >

        {/* Main leaf */}
        <mesh material={wood}>
          <boxGeometry
            args={[2.05, 4.85, 0.34]}
          />
        </mesh>

        {/* Outer dark frame */}
        <mesh
          position={[0, 0, 0.2]}
          material={darkWood}
        >
          <boxGeometry
            args={[1.9, 4.7, 0.055]}
          />
        </mesh>

        {/* Panels */}
        <DoorPanel
          y={1.55}
          wood={wood}
          brass={brass}
        />

        <DoorPanel
          y={0.05}
          wood={wood}
          brass={brass}
        />

        <DoorPanel
          y={-1.45}
          wood={wood}
          brass={brass}
        />

        {/* Lotus ornaments */}
        <LotusMedallion
          position={[0, 1.55, 0.31]}
          scale={0.58}
        />

        <LotusMedallion
          position={[0, -1.45, 0.31]}
          scale={0.58}
        />

        {/* Studs */}
        <DoorStuds
          brass={brass}
        />
      </group>


      {/* ===================================================
          CENTRAL SEAM
      =================================================== */}

      <mesh
        position={[0, 2.45, 0.25]}
        material={darkBrass}
      >
        <boxGeometry
          args={[0.09, 4.85, 0.07]}
        />
      </mesh>


      {/* ===================================================
          HANDLES
      =================================================== */}

      <mesh
        position={[-0.32, 2.45, 0.34]}
        rotation={[Math.PI / 2, 0, 0]}
        material={brass}
      >
        <torusGeometry
          args={[0.17, 0.045, 12, 28]}
        />
      </mesh>

      <mesh
        position={[0.32, 2.45, 0.34]}
        rotation={[Math.PI / 2, 0, 0]}
        material={brass}
      >
        <torusGeometry
          args={[0.17, 0.045, 12, 28]}
        />
      </mesh>


      {/* Handle backplates */}

      <mesh
        position={[-0.32, 2.45, 0.31]}
        rotation={[Math.PI / 2, 0, 0]}
        material={darkBrass}
      >
        <cylinderGeometry
          args={[0.23, 0.23, 0.055, 24]}
        />
      </mesh>

      <mesh
        position={[0.32, 2.45, 0.31]}
        rotation={[Math.PI / 2, 0, 0]}
        material={darkBrass}
      >
        <cylinderGeometry
          args={[0.23, 0.23, 0.055, 24]}
        />
      </mesh>


      {/* ===================================================
          HINGES
      =================================================== */}

      <DoorHinges
        brass={brass}
        darkBrass={darkBrass}
      />


      {/* ===================================================
          THRESHOLD
      =================================================== */}

      <mesh
        position={[0, -0.16, -0.12]}
        material={stone}
      >
        <boxGeometry
          args={[5.45, 0.32, 0.85]}
        />
      </mesh>

      <mesh
        position={[0, 0.04, 0.32]}
        material={brass}
      >
        <boxGeometry
          args={[4.85, 0.08, 0.07]}
        />
      </mesh>


      {/* ===================================================
          INNER WARM LIGHT
      =================================================== */}

      <pointLight
        ref={innerLightRef}
        position={[0, 2.7, 0.55]}
        color="#e89043"
        distance={9}
        decay={1.5}
        intensity={0}
      />

    </group>
  )
}