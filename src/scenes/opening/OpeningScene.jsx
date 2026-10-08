import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber'

import {
  Suspense,
  useRef,
  useState,
} from 'react'

import * as THREE from 'three'

import Diya from '../../components/3d/Diya'
import Particles from '../../components/3d/Particles'
import TempleDoor from '../../components/3d/TempleDoor'


/* =====================================================
   CAMERA
===================================================== */
function CinematicCamera() {
  const { camera, size } = useThree()

  const startTime = useRef(null)

  const isMobile = size.width < size.height

  useFrame((state) => {
    if (startTime.current === null) {
      startTime.current =
        state.clock.getElapsedTime()
    }

    const elapsed =
      state.clock.getElapsedTime() -
      startTime.current

    /*
      Same cinematic timing.
    */

    const progress =
      THREE.MathUtils.smoothstep(
        elapsed,
        0,
        13
      )

    /*
      SAME CAMERA PATH AS LAPTOP.
    */

    const start = new THREE.Vector3(
      1.78,
      1.80,
      5.36
    )

    const p1 = new THREE.Vector3(
      1.65,
      1.82,
      3.4
    )

    const p2 = new THREE.Vector3(
      0.9,
      1.85,
      1.8
    )

    const p3 = new THREE.Vector3(
      0.35,
      2.05,
      0.6
    )

    /*
      Final position.

      Desktop remains exactly the same.

      Mobile is only slightly higher and
      slightly farther from the doorway.
      This prevents the camera from feeling
      glued to the door.
    */

    const end = isMobile
      ? new THREE.Vector3(
        0,
        2.45,
        1.75
      )
      : new THREE.Vector3(
        0,
        2.25,
        1.65
      )

    const points = [
      start,
      p1,
      p2,
      p3,
      end,
    ]

    const curve =
      new THREE.CatmullRomCurve3(
        points
      )

    const position =
      curve.getPointAt(progress)

    camera.position.copy(position)

    /*
      IMPORTANT:

      Lower vertical FOV prevents the huge
      empty space above the temple and also
      prevents the floor/diya from dominating
      the bottom of the mobile screen.
    */

    camera.fov = isMobile
      ? 55
      : 41

    camera.updateProjectionMatrix()

    /*
      Keep the camera aimed at the entrance.

      DO NOT lower this target on mobile.
      That was causing the floor/diya to appear.
    */

    const target = new THREE.Vector3(
      0,
      THREE.MathUtils.lerp(
        0.95,
        2.45,
        progress
      ),
      THREE.MathUtils.lerp(
        -1.0,
        -5.8,
        progress
      )
    )

    camera.lookAt(target)
  })

  return null
}

/* =====================================================
   CINEMATIC LIGHTING
===================================================== */

function CinematicLighting() {
  const ambient = useRef()
  const hemisphere = useRef()
  const architecture = useRef()
  const warm = useRef()
  const doorLight = useRef()

  useFrame((state) => {
    const t =
      state.clock.getElapsedTime()

    /*
      --------------------------------
      PHASE 1
      DIYA
      --------------------------------
    */

    const diyaPhase =
      THREE.MathUtils.smoothstep(
        t,
        0.5,
        4
      )

    /*
      --------------------------------
      PHASE 2
      PILLARS
      --------------------------------
    */

    const pillarPhase =
      THREE.MathUtils.smoothstep(
        t,
        2.8,
        7.0
      )

    /*
      --------------------------------
      PHASE 3
      DOOR
      --------------------------------
    */

    const doorPhase =
      THREE.MathUtils.smoothstep(
        t,
        7,
        11
      )

    /*
      --------------------------------
      FINAL BRIGHTNESS
      --------------------------------
    */

    const finalPhase =
      THREE.MathUtils.smoothstep(
        t,
        9,
        13
      )


    /*
      BASE AMBIENT

      Starts very dark and continuously
      becomes lighter.
    */

    if (ambient.current) {
      ambient.current.intensity =
        THREE.MathUtils.lerp(
          0.025,
          0.30,
          diyaPhase
        )
    }


    /*
      ENVIRONMENT

      Becomes much more visible as
      pillars emerge.
    */

    if (hemisphere.current) {
      hemisphere.current.intensity =
        THREE.MathUtils.lerp(
          0.06,
          0.65,
          pillarPhase
        )
    }


    /*
      ARCHITECTURE LIGHT

      Stronger as the temple appears.
    */

    if (architecture.current) {
      architecture.current.intensity =
        THREE.MathUtils.lerp(
          0.04,
          2.2,
          pillarPhase
        )
    }


    /*
      WARM TEMPLE LIGHT
    */

    if (warm.current) {
      warm.current.intensity =
        THREE.MathUtils.lerp(
          0.05,
          1.35,
          doorPhase
        )
    }


    /*
      EXTRA LIGHT WHEN THE DOOR
      BECOMES THE HERO.

      This is intentionally stronger
      than the previous version.
    */

    if (doorLight.current) {
      doorLight.current.intensity =
        THREE.MathUtils.lerp(
          0,
          1.5,
          finalPhase
        )
    }
  })

  return (
    <>
      {/* Deep initial darkness */}
      <ambientLight
        ref={ambient}
        color="#3b2618"
        intensity={0.025}
      />

      {/* Warm environmental light */}
      <hemisphereLight
        ref={hemisphere}
        color="#8a5932"
        groundColor="#100905"
        intensity={0.04}
      />

      {/* Architectural reveal */}
      <directionalLight
        ref={architecture}
        position={[-4, 6, 4]}
        color="#d7a06a"
        intensity={0.02}
        castShadow
      />

      {/* General temple warmth */}
      <pointLight
        ref={warm}
        position={[0, 3, -3]}
        color="#e28b3d"
        distance={12}
        decay={1.6}
        intensity={0.05}
      />

      {/* Final hero-door illumination */}
      <pointLight
        ref={doorLight}
        position={[0, 3.8, -4.5]}
        color="#f0ad65"
        distance={9}
        decay={1.5}
        intensity={0}
      />
    </>
  )
}


/* =====================================================
   FLOOR
===================================================== */

function TempleFloor() {
  return (
    <mesh
      rotation={[
        -Math.PI / 2,
        0,
        0,
      ]}
      receiveShadow
    >
      <planeGeometry
        args={[14, 18]}
      />

      <meshStandardMaterial
        color="#30271f"
        roughness={0.88}
        metalness={0.04}
      />
    </mesh>
  )
}


/* =====================================================
   PILLAR
===================================================== */

function TemplePillar({
  position,
  scale = 1,
}) {
  const pillarRef = useRef()

  useFrame((state) => {
    const t =
      state.clock.getElapsedTime()

    /*
      Pillars reveal AFTER the diya.
    */

    const reveal =
      THREE.MathUtils.smoothstep(
        t,
        3.5,
        7
      )

    if (pillarRef.current) {
      pillarRef.current.traverse(
        (child) => {
          if (!child.material) return

          const materials =
            Array.isArray(
              child.material
            )
              ? child.material
              : [child.material]

          materials.forEach(
            (material) => {
              material.transparent = true
              material.opacity = reveal
            }
          )
        }
      )
    }
  })

  return (
    <group
      ref={pillarRef}
      position={position}
      scale={scale}
    >

      {/* Main shaft */}
      <mesh
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[
            0.75,
            4.2,
            0.75,
          ]}
        />

        <meshStandardMaterial
          color="#514238"
          roughness={0.82}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Base */}
      <mesh
        position={[
          0,
          -2.05,
          0,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            1.15,
            0.35,
            1.15,
          ]}
        />

        <meshStandardMaterial
          color="#5c4a3b"
          roughness={0.8}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Capital */}
      <mesh
        position={[
          0,
          2.1,
          0,
        ]}
        castShadow
      >
        <boxGeometry
          args={[
            1.15,
            0.35,
            1.15,
          ]}
        />

        <meshStandardMaterial
          color="#594737"
          roughness={0.8}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Vertical carving */}
      <mesh
        position={[
          0,
          0,
          0.39,
        ]}
      >
        <boxGeometry
          args={[
            0.18,
            3.5,
            0.045,
          ]}
        />

        <meshStandardMaterial
          color="#705b48"
          roughness={0.7}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Upper band */}
      <mesh
        position={[
          0,
          1.45,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.88,
            0.12,
            0.88,
          ]}
        />

        <meshStandardMaterial
          color="#695441"
          roughness={0.75}
          transparent
          opacity={0}
        />
      </mesh>

      {/* Lower band */}
      <mesh
        position={[
          0,
          -1.45,
          0,
        ]}
      >
        <boxGeometry
          args={[
            0.88,
            0.12,
            0.88,
          ]}
        />

        <meshStandardMaterial
          color="#695441"
          roughness={0.75}
          transparent
          opacity={0}
        />
      </mesh>

    </group>
  )
}


/* =====================================================
   TEMPLE STRUCTURE
===================================================== */

function TempleStructure() {
  return (
    <group>

      {/* FRONT LEFT */}
      <TemplePillar
        position={[
          -2.15,
          2.1,
          -1.8,
        ]}
      />

      {/* FRONT RIGHT */}
      <TemplePillar
        position={[
          2.15,
          2.1,
          -1.8,
        ]}
      />

      {/* REAR LEFT */}
      <TemplePillar
        position={[
          -2.55,
          2.0,
          -4.5,
        ]}
        scale={0.82}
      />

      {/* REAR RIGHT */}
      <TemplePillar
        position={[
          2.55,
          2.0,
          -4.5,
        ]}
        scale={0.82}
      />

    </group>
  )
}

function TempleUpperArchitecture() {
  const { size } = useThree()

  const isMobile = size.width < size.height

  if (!isMobile) {
    return null
  }

  return (
    <group position={[0, 0, -5.8]}>

      {/* =========================================
          LARGE UPPER TEMPLE BEAM
          ========================================= */}

      <mesh
        position={[0, 5.55, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[7.8, 0.45, 0.65]}
        />

        <meshStandardMaterial
          color="#4a2b1b"
          roughness={0.78}
          metalness={0.05}
        />
      </mesh>

      {/* =========================================
          STEPPED TEMPLE BANDS
          ========================================= */}

      <mesh
        position={[0, 5.95, 0]}
        castShadow
      >
        <boxGeometry
          args={[7.2, 0.16, 0.58]}
        />

        <meshStandardMaterial
          color="#68402a"
          roughness={0.72}
        />
      </mesh>

      <mesh
        position={[0, 6.18, 0]}
        castShadow
      >
        <boxGeometry
          args={[6.6, 0.14, 0.52]}
        />

        <meshStandardMaterial
          color="#5a3622"
          roughness={0.74}
        />
      </mesh>

      <mesh
        position={[0, 6.38, 0]}
        castShadow
      >
        <boxGeometry
          args={[5.9, 0.13, 0.48]}
        />

        <meshStandardMaterial
          color="#71472d"
          roughness={0.7}
        />
      </mesh>

      {/* =========================================
          CENTRAL TEMPLE PEDIMENT
          ========================================= */}

      <mesh
        position={[0, 6.65, 0]}
        rotation={[0, 0, 0]}
        castShadow
      >
        <coneGeometry
          args={[2.5, 1.15, 4]}
        />

        <meshStandardMaterial
          color="#432719"
          roughness={0.8}
        />
      </mesh>

      {/* =========================================
          CENTRAL DECORATIVE PANEL
          ========================================= */}

      <mesh
        position={[0, 6.55, -0.36]}
        castShadow
      >
        <boxGeometry
          args={[1.35, 0.75, 0.12]}
        />

        <meshStandardMaterial
          color="#70462d"
          roughness={0.68}
        />
      </mesh>

      {/* =========================================
          SMALL CENTRAL TEMPLE FINIAL
          ========================================= */}

      <mesh
        position={[0, 7.35, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.16, 0.24, 0.45, 16]}
        />

        <meshStandardMaterial
          color="#8a5a2f"
          metalness={0.45}
          roughness={0.4}
        />
      </mesh>

      <mesh
        position={[0, 7.68, 0]}
        castShadow
      >
        <sphereGeometry
          args={[0.18, 20, 20]}
        />

        <meshStandardMaterial
          color="#a56b35"
          metalness={0.65}
          roughness={0.3}
        />
      </mesh>

      {/* =========================================
          SIDE ARCHITECTURAL BLOCKS
          ========================================= */}

      <mesh
        position={[-3.65, 5.85, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.65, 1.8, 0.62]}
        />

        <meshStandardMaterial
          color="#4c2d1c"
          roughness={0.8}
        />
      </mesh>

      <mesh
        position={[3.65, 5.85, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.65, 1.8, 0.62]}
        />

        <meshStandardMaterial
          color="#4c2d1c"
          roughness={0.8}
        />
      </mesh>

      {/* =========================================
          SMALL SIDE CAPS
          ========================================= */}

      <mesh
        position={[-3.65, 6.82, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.9, 0.22, 0.7]}
        />

        <meshStandardMaterial
          color="#69412a"
          roughness={0.72}
        />
      </mesh>

      <mesh
        position={[3.65, 6.82, 0]}
        castShadow
      >
        <boxGeometry
          args={[0.9, 0.22, 0.7]}
        />

        <meshStandardMaterial
          color="#69412a"
          roughness={0.72}
        />
      </mesh>

    </group>
  )
}
/* =====================================================
   TEXT
===================================================== */

function TapInstruction({
  visible,
}) {
  return (
    <div
      style={{
        position: 'absolute',

        left: '50%',

        bottom: '9%',

        transform:
          'translateX(-50%)',

        color: '#f3dfbd',

        fontFamily:
          'Georgia, "Times New Roman", serif',

        fontSize:
          'clamp(14px, 2vw, 21px)',

        letterSpacing:
          '0.16em',

        textTransform:
          'uppercase',

        whiteSpace:
          'nowrap',

        textShadow:
          '0 2px 18px rgba(0,0,0,0.95)',

        opacity:
          visible ? 1 : 0,

        transition:
          'opacity 1.4s ease',

        pointerEvents:
          'none',

        zIndex: 20,
      }}
    >
      Tap the door to open
    </div>
  )
}


/* =====================================================
   TEXT TIMER
===================================================== */

function InstructionController({
  onComplete,
}) {
  const called =
    useRef(false)

  useFrame((state) => {
    if (
      state.clock.getElapsedTime() >=
      13 &&
      !called.current
    ) {
      called.current = true

      onComplete()
    }
  })

  return null
}


/* =====================================================
   MAIN SCENE
===================================================== */

export default function OpeningScene() {
  const [
    showInstruction,
    setShowInstruction,
  ] = useState(false)

  return (
    <div className="opening-scene">

      <Canvas
        shadows

        camera={{
          position: [
            1.78,
            1.80,
            5.36,
          ],

          fov: 41,

          near: 0.1,

          far: 30,
        }}

        gl={{
          antialias: true,

          powerPreference:
            'high-performance',
        }}

        dpr={[1, 1.5]}
      >

        <Suspense fallback={null}>

          <CinematicCamera />

          <CinematicLighting />

          <TempleFloor />

          <TempleStructure />

          <TempleUpperArchitecture />

          <TempleDoor />

          <Diya />

          <Particles />

          <InstructionController
            onComplete={() =>
              setShowInstruction(true)
            }
          />

        </Suspense>

      </Canvas>

      <TapInstruction
        visible={showInstruction}
      />

    </div>
  )
}