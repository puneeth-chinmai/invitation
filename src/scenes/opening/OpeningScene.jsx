import {
  Canvas,
  useFrame,
  useThree,
} from '@react-three/fiber'

import {
  Suspense,
  useRef,
  useState,
  useMemo,
  useEffect
} from 'react'

import * as THREE from 'three'

import Diya from '../../components/3d/Diya'
import Particles from '../../components/3d/Particles'
import TempleDoor from '../../components/3d/TempleDoor'
import ganeshaSymbolUrl from '../../assets/images/ganesha_symbol.png'

/* =====================================================
   CAMERA
===================================================== */

function CinematicCamera({ doorOpening }) {
  const { camera, size } = useThree()

  const startTime = useRef(null)
  const doorTransitionStart = useRef(null)
  const transitionTriggered = useRef(false)

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
      ---------------------------------------------------
      NORMAL 13 SECOND INTRO
      ---------------------------------------------------
    */

    if (!doorOpening) {
      doorTransitionStart.current = null
      transitionTriggered.current = false

      const progress =
        THREE.MathUtils.smoothstep(
          elapsed,
          0,
          13
        )

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

      const curve =
        new THREE.CatmullRomCurve3([
          start,
          p1,
          p2,
          p3,
          end,
        ])

      const position =
        curve.getPointAt(progress)

      camera.position.copy(position)

      camera.fov = isMobile ? 55 : 41
      camera.updateProjectionMatrix()

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

      return
    }

    /*
      ---------------------------------------------------
      DOOR HAS BEEN TAPPED
      ---------------------------------------------------
    */

    if (doorTransitionStart.current === null) {
      doorTransitionStart.current =
        elapsed
    }

    const sinceDoorOpen =
      elapsed -
      doorTransitionStart.current

    /*
      First 1.5 seconds:
      camera remains almost completely still.

      This allows the guest to actually see
      the doors opening before the camera moves.
    */

    if (sinceDoorOpen < 1.40) {
      const holdPosition = isMobile
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

      camera.position.copy(holdPosition)

      camera.fov = isMobile ? 55 : 41
      camera.updateProjectionMatrix()

      camera.lookAt(
        new THREE.Vector3(
          0,
          2.4,
          -5.8
        )
      )

      return
    }

    /*
      ---------------------------------------------------
      CAMERA GLIDES FORWARD THROUGH THE OPEN DOORWAY
      Between open doors at z = -5.8, settles at z = -7.8
      ---------------------------------------------------
    */

    const travelProgress =
      THREE.MathUtils.smoothstep(
        sinceDoorOpen,
        1.40,
        4.20
      )

    const enterStart = isMobile
      ? new THREE.Vector3(0, 2.45, 1.75)
      : new THREE.Vector3(0, 2.25, 1.65)

    const enterEnd = isMobile
      ? new THREE.Vector3(0, 2.40, -7.6)
      : new THREE.Vector3(0, 2.35, -7.8)

    const position = enterStart.clone().lerp(enterEnd, travelProgress)
    camera.position.copy(position)

    camera.fov = isMobile ? 54 : 40
    camera.updateProjectionMatrix()

    const target = new THREE.Vector3(0, 2.38, -14.5)
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
  const doorFill = useRef()
  const plinthLight = useRef()

  const { gl } = useThree()

  useMemo(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping
    gl.toneMappingExposure = 1.26
  }, [gl])

  useFrame((state) => {
    const t =
      state.clock.getElapsedTime()

    /* --------------------------------
       DIYA
    -------------------------------- */

    const diyaPhase =
      THREE.MathUtils.smoothstep(
        t,
        0.5,
        4
      )

    /* --------------------------------
       PILLARS
    -------------------------------- */

    const pillarPhase =
      THREE.MathUtils.smoothstep(
        t,
        2.8,
        7.0
      )

    /* --------------------------------
       DOOR
    -------------------------------- */

    const doorPhase =
      THREE.MathUtils.smoothstep(
        t,
        6.5,
        11
      )

    /* --------------------------------
       FINAL BRIGHTNESS
    -------------------------------- */

    const finalPhase =
      THREE.MathUtils.smoothstep(
        t,
        8.5,
        13
      )

    if (ambient.current) {
      ambient.current.intensity =
        THREE.MathUtils.lerp(
          0.06,
          0.56,
          diyaPhase
        )
    }

    if (hemisphere.current) {
      hemisphere.current.intensity =
        THREE.MathUtils.lerp(
          0.08,
          0.88,
          pillarPhase
        )
    }

    if (architecture.current) {
      architecture.current.intensity =
        THREE.MathUtils.lerp(
          0.05,
          1.85,
          pillarPhase
        )
    }

    if (warm.current) {
      warm.current.intensity =
        THREE.MathUtils.lerp(
          0.06,
          1.65,
          doorPhase
        )
    }

    if (doorLight.current) {
      // Key warm amber light directly illuminating door face and medallions
      doorLight.current.intensity =
        THREE.MathUtils.lerp(
          0.1,
          2.75,
          finalPhase
        )
    }

    if (doorFill.current) {
      // Soft, broad frontal fill light to lift shadows and reveal carvings
      doorFill.current.intensity =
        THREE.MathUtils.lerp(
          0.05,
          1.45,
          doorPhase
        )
    }

    if (plinthLight.current) {
      // Floor uplight for lower door lotus carvings and brass studs
      plinthLight.current.intensity =
        THREE.MathUtils.lerp(
          0.05,
          1.65,
          doorPhase
        )
    }
  })

  return (
    <>
      <ambientLight
        ref={ambient}
        color="#5c3f2b"
        intensity={0.06}
      />

      <hemisphereLight
        ref={hemisphere}
        color="#a57248"
        groundColor="#28170e"
        intensity={0.08}
      />

      <directionalLight
        ref={architecture}
        position={[-3.5, 5.5, 3]}
        color="#e4b078"
        intensity={0.05}
        castShadow
      />

      <pointLight
        ref={warm}
        position={[0, 2.8, -2.2]}
        color="#e89846"
        distance={14}
        decay={1.4}
        intensity={0.06}
      />

      {/* Main warm key light directly illuminating the doors */}
      <pointLight
        ref={doorLight}
        position={[0, 2.5, -3.6]}
        color="#ffba68"
        distance={12}
        decay={1.25}
        intensity={0.1}
      />

      {/* Soft broad frontal fill light from camera angle */}
      <pointLight
        ref={doorFill}
        position={[0, 2.4, 0.6]}
        color="#f6be80"
        distance={16}
        decay={1.35}
        intensity={0.05}
      />

      {/* Diya uplight illuminating lower door panels and carved lotus */}
      <pointLight
        ref={plinthLight}
        position={[0, 0.45, -4.6]}
        color="#ffa03c"
        distance={6}
        decay={1.5}
        intensity={0.05}
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
      position={[0, 0, 2.0]}
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[14, 15.6]} />

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

    const reveal =
      THREE.MathUtils.smoothstep(
        t,
        3.5,
        7
      )

    if (!pillarRef.current) return

    pillarRef.current.traverse(
      (child) => {
        if (!child.material) return

        const materials =
          Array.isArray(child.material)
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
  })

  return (
    <group
      ref={pillarRef}
      position={position}
      scale={scale}
    >
      <mesh
        castShadow
        receiveShadow
      >
        <boxGeometry
          args={[0.75, 4.2, 0.75]}
        />

        <meshStandardMaterial
          color="#514238"
          roughness={0.82}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh
        position={[0, -2.05, 0]}
        castShadow
      >
        <boxGeometry
          args={[1.15, 0.35, 1.15]}
        />

        <meshStandardMaterial
          color="#5c4a3b"
          roughness={0.8}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh
        position={[0, 2.1, 0]}
        castShadow
      >
        <boxGeometry
          args={[1.15, 0.35, 1.15]}
        />

        <meshStandardMaterial
          color="#594737"
          roughness={0.8}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh
        position={[0, 0, 0.39]}
      >
        <boxGeometry
          args={[0.18, 3.5, 0.045]}
        />

        <meshStandardMaterial
          color="#705b48"
          roughness={0.7}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh
        position={[0, 1.45, 0]}
      >
        <boxGeometry
          args={[0.88, 0.12, 0.88]}
        />

        <meshStandardMaterial
          color="#695441"
          roughness={0.75}
          transparent
          opacity={0}
        />
      </mesh>

      <mesh
        position={[0, -1.45, 0]}
      >
        <boxGeometry
          args={[0.88, 0.12, 0.88]}
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
      <TemplePillar
        position={[-2.15, 2.1, -1.8]}
      />

      <TemplePillar
        position={[2.15, 2.1, -1.8]}
      />

      <TemplePillar
        position={[-2.55, 2.0, -4.5]}
        scale={0.82}
      />

      <TemplePillar
        position={[2.55, 2.0, -4.5]}
        scale={0.82}
      />
    </group>
  )
}

/* =====================================================
   MOBILE UPPER ARCHITECTURE
===================================================== */

function TempleUpperArchitecture() {
  const { size } = useThree()

  const isMobile =
    size.width < size.height

  if (!isMobile) {
    return null
  }

  return (
    <group position={[0, 0, -5.8]}>
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

      <mesh
        position={[0, 6.65, 0]}
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
   TAP INSTRUCTION
===================================================== */

function TapInstruction({ visible }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        bottom: '9%',
        transform: 'translateX(-50%)',

        color: '#f3dfbd',

        fontFamily:
          'Georgia, "Times New Roman", serif',

        fontSize:
          'clamp(14px, 2vw, 21px)',

        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',

        textShadow:
          '0 2px 18px rgba(0,0,0,0.95)',

        opacity: visible ? 1 : 0,

        transition:
          'opacity 0.8s ease',

        pointerEvents: 'none',
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
  const called = useRef(false)

  useFrame((state) => {
    if (
      state.clock.getElapsedTime() >= 13 &&
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

/* =====================================================
   SACRED IVORY SANCTUM (BEHIND TEMPLE DOORS)
===================================================== */

function SacredIvorySanctum({ doorOpening, sinceDoorOpen }) {
  const sanctumLightRef = useRef()
  const amberColor = useMemo(() => new THREE.Color('#f5a242'), [])
  const ivoryLightColor = useMemo(() => new THREE.Color('#fff7ec'), [])

  if (!doorOpening) return null

  const openProgress = THREE.MathUtils.smoothstep(
    sinceDoorOpen,
    0,
    1.6
  )

  const enterProgress = THREE.MathUtils.smoothstep(
    sinceDoorOpen,
    1.4,
    4.2
  )

  const colorProgress = THREE.MathUtils.smoothstep(
    sinceDoorOpen,
    0.6,
    2.5
  )
  const sanctumColor = amberColor.clone().lerp(ivoryLightColor, colorProgress)

  return (
    <group position={[0, 0, -5.8]}>
      {/* Sanctum Floor (Marble with soft champagne reflection) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, -6.02]}
        receiveShadow
      >
        <planeGeometry args={[16, 11]} />
        <meshStandardMaterial
          color="#FAF5EB"
          roughness={0.28}
          metalness={0.06}
        />
      </mesh>

      {/* Luminous Ivory Backdrop Wall */}
      <mesh position={[0, 3.8, -8.5]}>
        <planeGeometry args={[26, 16]} />
        <meshBasicMaterial
          color="#FAF2E4"
          transparent
          opacity={openProgress}
        />
      </mesh>

      {/* Radiant Sanctum Interior Light */}
      <pointLight
        ref={sanctumLightRef}
        position={[0, 3.2, -3.2]}
        color={sanctumColor}
        distance={22}
        decay={1.25}
        intensity={openProgress * 4.5 + enterProgress * 2.8}
      />
    </group>
  )
}

/* =====================================================
   CINEMATIC ATMOSPHERE (BACKGROUND & FOG BLEND)
===================================================== */

function CinematicAtmosphere({ doorOpening, sinceDoorOpen }) {
  const { scene } = useThree()
  const darkBg = useMemo(() => new THREE.Color('#020100'), [])
  const ivoryBg = useMemo(() => new THREE.Color('#F7F0E4'), [])

  useFrame(() => {
    // During 13s intro and first 1.4s of door swing: keep 100% dark temple background
    if (!doorOpening || sinceDoorOpen < 1.4) {
      if (!scene.background || !scene.background.equals(darkBg)) {
        scene.background = darkBg.clone()
      }
      if (scene.fog) {
        scene.fog.color.copy(darkBg)
        scene.fog.density = 0.04
      }
      return
    }

    // Only as camera glides forward through doorway (1.4s to 4.2s), blend gradually into ivory
    const blendProgress = THREE.MathUtils.smoothstep(
      sinceDoorOpen,
      1.4,
      4.2
    )

    scene.background.copy(darkBg).lerp(ivoryBg, blendProgress)

    if (scene.fog) {
      scene.fog.color.copy(scene.background)
      scene.fog.density = THREE.MathUtils.lerp(0.04, 0.01, blendProgress)
    }
  })

  return null
}

/* =====================================================
   FLOATING PETALS & LIGHT PARTICLES (LIGHTWEIGHT CANVAS)
===================================================== */

function FloatingIvoryPetals() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)

    const handleResize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const particles = Array.from({ length: 14 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 6 + 3,
      speedY: Math.random() * 0.45 + 0.25,
      speedX: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.015,
      isPetal: Math.random() > 0.45,
      opacity: Math.random() * 0.35 + 0.15,
    }))

    const render = () => {
      ctx.clearRect(0, 0, w, h)
      particles.forEach((p) => {
        if (!prefersReducedMotion) {
          p.y += p.speedY
          p.x += Math.sin(p.angle) * 0.4 + p.speedX
          p.angle += p.spin

          if (p.y > h + 15) {
            p.y = -15
            p.x = Math.random() * w
          }
        }

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.angle)

        if (p.isPetal) {
          ctx.beginPath()
          ctx.ellipse(0, 0, p.size * 0.6, p.size * 1.2, 0, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(230, 160, 175, ${p.opacity * 0.6})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(214, 165, 82, ${p.opacity})`
          ctx.shadowColor = 'rgba(214, 165, 82, 0.4)'
          ctx.shadowBlur = 6
          ctx.fill()
        }

        ctx.restore()
      })

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render)
      }
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    />
  )
}

const cornerMotifStyles = {
  tl: { position: 'absolute', top: 'clamp(10px, 2.5vw, 20px)', left: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
  tr: { position: 'absolute', top: 'clamp(10px, 2.5vw, 20px)', right: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
  bl: { position: 'absolute', bottom: 'clamp(10px, 2.5vw, 20px)', left: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
  br: { position: 'absolute', bottom: 'clamp(10px, 2.5vw, 20px)', right: 'clamp(10px, 2.5vw, 20px)', color: 'rgba(196, 150, 76, 0.45)', fontSize: '13px', pointerEvents: 'none', zIndex: 1 },
}

/* =====================================================
   IVORY ENVIRONMENT LAYER (MOBILE-FIRST FULL VIEWPORT)
   Covers 100dvh edge-to-edge, mounted from start,
   smoothly crossfades 1.4s -> 4.2s post-tap.
===================================================== */

function IvoryEnvironmentLayer({ doorOpening, sinceDoorOpen }) {
  // Layer opacity crossfade: 1.4s to 4.2s post-tap
  let layerOpacity = 0
  if (doorOpening) {
    if (sinceDoorOpen >= 4.2) {
      layerOpacity = 1
    } else if (sinceDoorOpen >= 1.4) {
      layerOpacity = THREE.MathUtils.smoothstep(sinceDoorOpen, 1.4, 4.2)
    }
  }

  // STAGE D: Ganesha Symbol (4.4s to 9.7s)
  let ganeshaOpacity = 0
  let ganeshaTransform = 'scale(0.95) translateY(6px)'
  const showGanesha = sinceDoorOpen >= 4.4 && sinceDoorOpen < 9.7
  if (showGanesha) {
    if (sinceDoorOpen < 5.8) {
      // Fade in 1.4s (4.4 to 5.8)
      const p = (sinceDoorOpen - 4.4) / 1.4
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      ganeshaOpacity = eased
      ganeshaTransform = `scale(${0.95 + eased * 0.05}) translateY(${(1 - eased) * 6}px)`
    } else if (sinceDoorOpen < 8.3) {
      // Hold fully visible 2.5s (5.8 to 8.3)
      ganeshaOpacity = 1
      ganeshaTransform = 'scale(1) translateY(0)'
    } else {
      // Fade out 1.4s (8.3 to 9.7)
      const p = (sinceDoorOpen - 8.3) / 1.4
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2
      ganeshaOpacity = 1 - eased
      ganeshaTransform = `scale(${1 + eased * 0.03}) translateY(${-eased * 6}px)`
    }
  }

  // STAGE E: Blessing Text (10.0s to 14.5s)
  let blessingOpacity = 0
  let blessingTransform = 'translateY(12px)'
  const showBlessing = sinceDoorOpen >= 10.0 && sinceDoorOpen < 14.5
  if (showBlessing) {
    if (sinceDoorOpen < 11.0) {
      // Fade in + subtle rise 1.0s (10.0 to 11.0)
      const p = (sinceDoorOpen - 10.0) / 1.0
      const eased = 1 - Math.pow(1 - p, 3)
      blessingOpacity = eased
      blessingTransform = `translateY(${(1 - eased) * 12}px)`
    } else if (sinceDoorOpen < 13.5) {
      // Hold fully visible 2.5s (11.0 to 13.5)
      blessingOpacity = 1
      blessingTransform = 'translateY(0)'
    } else {
      // Fade out 1.0s (13.5 to 14.5)
      const p = (sinceDoorOpen - 13.5) / 1.0
      const eased = p * p
      blessingOpacity = 1 - eased
      blessingTransform = `translateY(${-eased * 8}px)`
    }
  }

  // STAGES F, G, H, I: Couple's Names (starts at 14.9s)
  const showNames = sinceDoorOpen >= 14.9

  // F: Puneeth (14.9s to 15.8s, 0.9s)
  const puneethP = THREE.MathUtils.clamp((sinceDoorOpen - 14.9) / 0.9, 0, 1)
  const puneethEase = 1 - Math.pow(1 - puneethP, 3)

  // G: & (16.2s to 16.8s, 0.6s)
  const ampersandP = THREE.MathUtils.clamp((sinceDoorOpen - 16.2) / 0.6, 0, 1)
  const ampersandEase = 1 - Math.pow(1 - ampersandP, 3)

  // H: Chinmai (17.2s to 18.1s, 0.9s)
  const chinmaiP = THREE.MathUtils.clamp((sinceDoorOpen - 17.2) / 0.9, 0, 1)
  const chinmaiEase = 1 - Math.pow(1 - chinmaiP, 3)

  // I: ARE GETTING MARRIED (18.5s to 19.3s, 0.8s)
  const marriedP = THREE.MathUtils.clamp((sinceDoorOpen - 18.5) / 0.8, 0, 1)
  const marriedEase = 1 - Math.pow(1 - marriedP, 3)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        height: '100dvh',
        background: 'radial-gradient(ellipse at 50% 40%, #FFFDF9 0%, #FAF4E8 48%, #F5ECDD 100%)',
        opacity: layerOpacity,
        visibility: layerOpacity > 0 ? 'visible' : 'hidden',
        pointerEvents: layerOpacity > 0.95 ? 'auto' : 'none',
        overflow: 'hidden',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding:
          'max(24px, env(safe-area-inset-top, 0px)) max(20px, env(safe-area-inset-right, 0px)) max(24px, env(safe-area-inset-bottom, 0px)) max(20px, env(safe-area-inset-left, 0px))',
        boxSizing: 'border-box',
        userSelect: 'none',
      }}
    >
      {/* 1. Subtle central radial light glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(92vw, 560px)',
          height: 'min(92vw, 560px)',
          background: 'radial-gradient(circle, rgba(255, 238, 204, 0.5) 0%, rgba(255, 238, 204, 0) 65%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* 2. Thin gold inset frame and corner motifs */}
      <div
        style={{
          position: 'absolute',
          inset: 'clamp(12px, 3vw, 24px)',
          border: '1px solid rgba(196, 150, 76, 0.2)',
          borderRadius: '6px',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div style={cornerMotifStyles.tl}>❖</div>
      <div style={cornerMotifStyles.tr}>❖</div>
      <div style={cornerMotifStyles.bl}>❖</div>
      <div style={cornerMotifStyles.br}>❖</div>

      {/* 3. Subtle Lotus Mandala Watermark Outline */}
      <svg
        viewBox="0 0 200 200"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'clamp(280px, 75vw, 420px)',
          height: 'clamp(280px, 75vw, 420px)',
          pointerEvents: 'none',
          opacity: 0.12,
          zIndex: 1,
        }}
      >
        <circle cx="100" cy="100" r="92" fill="none" stroke="#b88628" strokeWidth="0.8" strokeDasharray="3 3" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#c4964c" strokeWidth="1" />
        <circle cx="100" cy="100" r="66" fill="none" stroke="#c4964c" strokeWidth="0.8" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180
          const x = 100 + Math.cos(angle) * 48
          const y = 100 + Math.sin(angle) * 48
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="22"
              ry="10"
              transform={`rotate(${i * 45 + 90} ${x} ${y})`}
              fill="none"
              stroke="#b88628"
              strokeWidth="0.9"
            />
          )
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = ((i * 45 + 22.5) * Math.PI) / 180
          const x = 100 + Math.cos(angle) * 32
          const y = 100 + Math.sin(angle) * 32
          return <circle key={`dot-${i}`} cx={x} cy={y} r="1.8" fill="#b88628" />
        })}
      </svg>

      {/* 4. Softly drifting petals & gold motes */}
      <FloatingIvoryPetals />

      {/* ---------------------------------------------------
          STAGE D: GANESHA SYMBOL
          Fade in 1.4s, hold 2.5s, fade out 1.4s
      --------------------------------------------------- */}
      {showGanesha && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: ganeshaOpacity,
            transform: ganeshaTransform,
            willChange: 'opacity, transform',
            filter:
              'drop-shadow(0 0 18px rgba(214, 160, 68, 0.38)) drop-shadow(0 4px 12px rgba(138, 94, 36, 0.16))',
          }}
        >
          <img
            src={ganeshaSymbolUrl}
            alt="Lord Ganesha Blessing"
            style={{
              width: 'clamp(210px, 56vw, 290px)',
              height: 'auto',
              maxHeight: '48vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* ---------------------------------------------------
          STAGE E: BLESSING TEXT
          “With the blessings of Lord Ganesha”
          Fade in + rise 1.0s, hold 2.5s, fade out 1.0s
      --------------------------------------------------- */}
      {showBlessing && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: '600px',
            textAlign: 'center',
            padding: '20px',
            opacity: blessingOpacity,
            transform: blessingTransform,
            willChange: 'opacity, transform',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              fontSize: 'clamp(22px, 5.5vw, 34px)',
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#4a301a',
              letterSpacing: '0.02em',
              lineHeight: 1.4,
              textShadow: '0 1px 12px rgba(212, 160, 68, 0.12)',
            }}
          >
            “With the blessings of Lord Ganesha”
          </p>
        </div>
      )}

      {/* ---------------------------------------------------
          STAGES F, G, H, I: COUPLE'S NAMES & ARE GETTING MARRIED
          Sequential entrance, then holds indefinitely!
      --------------------------------------------------- */}
      {showNames && (
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            padding: '16px',
            maxWidth: '92vw',
          }}
        >
          {/* 1. “Puneeth” (0.9s rise) */}
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(38px, 9.2vw, 64px)',
              fontWeight: 500,
              color: '#3d2514',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              opacity: puneethEase,
              transform: `translateY(${(1 - puneethEase) * 16}px)`,
              willChange: 'opacity, transform',
            }}
          >
            Puneeth
          </div>

          {/* 2. “&” (0.6s fade) */}
          <div
            style={{
              fontFamily: "'Cormorant Garamond', 'Great Vibes', serif",
              fontSize: 'clamp(26px, 6vw, 40px)',
              color: '#b88628',
              fontStyle: 'italic',
              margin: 'clamp(4px, 1.2vh, 10px) 0',
              opacity: ampersandEase,
              transform: `translateY(${(1 - ampersandEase) * 10}px)`,
              willChange: 'opacity, transform',
            }}
          >
            &amp;
          </div>

          {/* 3. “Chinmai” (0.9s rise) */}
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(38px, 9.2vw, 64px)',
              fontWeight: 500,
              color: '#3d2514',
              letterSpacing: '0.06em',
              lineHeight: 1.15,
              opacity: chinmaiEase,
              transform: `translateY(${(1 - chinmaiEase) * 16}px)`,
              willChange: 'opacity, transform',
            }}
          >
            Chinmai
          </div>

          {/* 4. “ARE GETTING MARRIED” (0.8s fade) */}
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 'clamp(13px, 3.2vw, 18px)',
              fontWeight: 500,
              color: '#9c6b30',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              marginTop: 'clamp(22px, 4vh, 34px)',
              opacity: marriedEase,
              transform: `translateY(${(1 - marriedEase) * 12}px)`,
              willChange: 'opacity, transform',
            }}
          >
            ARE GETTING MARRIED
          </div>
        </div>
      )}
    </div>
  )
}

/* =====================================================
   MAIN SCENE
===================================================== */

export default function OpeningScene() {
  const [
    showInstruction,
    setShowInstruction,
  ] = useState(false)

  const [
    doorOpening,
    setDoorOpening,
  ] = useState(false)

  const [
    doorOpenTimestamp,
    setDoorOpenTimestamp,
  ] = useState(null)

  const [
    sinceDoorOpen,
    setSinceDoorOpen,
  ] = useState(0)

  const handleDoorOpen = () => {
    setDoorOpening(true)
    setShowInstruction(false)
    setDoorOpenTimestamp(performance.now() / 1000)
  }

  useEffect(() => {
    if (!doorOpening || !doorOpenTimestamp) return
    let animId
    const update = () => {
      const now = performance.now() / 1000
      setSinceDoorOpen(now - doorOpenTimestamp)
      animId = requestAnimationFrame(update)
    }
    animId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(animId)
  }, [doorOpening, doorOpenTimestamp])

  return (
    <div className="opening-scene">
      <Canvas
        shadows
        camera={{
          position: [
            1.78,
            1.8,
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
          <CinematicCamera
            doorOpening={doorOpening}
          />

          <CinematicAtmosphere
            doorOpening={doorOpening}
            sinceDoorOpen={sinceDoorOpen}
          />

          <CinematicLighting />

          <TempleFloor />

          <TempleStructure />

          <TempleUpperArchitecture />

          <TempleDoor
            onOpen={handleDoorOpen}
          />

          <SacredIvorySanctum
            doorOpening={doorOpening}
            sinceDoorOpen={sinceDoorOpen}
          />

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

      <IvoryEnvironmentLayer
        doorOpening={doorOpening}
        sinceDoorOpen={sinceDoorOpen}
      />
    </div>
  )
}