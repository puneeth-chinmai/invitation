import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Diya() {
  const flameRef = useRef()
  const flameGlowRef = useRef()
  const lightRef = useRef()
  const wickRef = useRef()

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()

    /*
     * Shot 1 timeline
     *
     * 0.0 - 0.8  : complete darkness
     * 0.8 - 1.5  : diya gradually becomes visible
     * 1.5 - 3.5  : flame + warm light
     */

    const reveal = THREE.MathUtils.smoothstep(
      elapsed,
      0.7,
      1.55
    )

    // Flame flicker
    const flicker =
      Math.sin(elapsed * 17) * 0.035 +
      Math.sin(elapsed * 31) * 0.018 +
      Math.sin(elapsed * 47) * 0.012

    if (flameRef.current) {
      flameRef.current.scale.x = 0.72 + flicker
      flameRef.current.scale.y = 1 + flicker * 1.5
      flameRef.current.scale.z = 0.72 + flicker

      flameRef.current.position.x =
        Math.sin(elapsed * 11) * 0.006

      flameRef.current.position.z =
        Math.cos(elapsed * 13) * 0.004

      flameRef.current.material.opacity =
        reveal
    }

    if (flameGlowRef.current) {
      flameGlowRef.current.scale.setScalar(
        0.75 + reveal * 0.35 + flicker
      )

      flameGlowRef.current.material.opacity =
        reveal * 0.12
    }

    if (wickRef.current) {
      wickRef.current.material.emissiveIntensity =
        reveal * 0.6
    }

    if (lightRef.current) {
      const breathing =
        Math.sin(elapsed * 8) * 0.12 +
        Math.sin(elapsed * 19) * 0.06

      lightRef.current.intensity =
        reveal * (2.3 + breathing)
    }
  })

  return (
    <group position={[0, 0.16, 0]}>

      {/* Diya bowl */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <latheGeometry
          args={[
            [
              new THREE.Vector2(0.02, 0),
              new THREE.Vector2(0.12, 0.02),
              new THREE.Vector2(0.24, 0.07),
              new THREE.Vector2(0.38, 0.15),
              new THREE.Vector2(0.43, 0.23),
              new THREE.Vector2(0.38, 0.30),
              new THREE.Vector2(0.25, 0.34),
              new THREE.Vector2(0.08, 0.35),
            ],
            48,
          ]}
        />

        <meshStandardMaterial
          color="#7b4822"
          metalness={0.82}
          roughness={0.24}
        />
      </mesh>

      {/* Inner oil surface */}
      <mesh position={[0, 0.30, 0]}>
        <cylinderGeometry args={[0.25, 0.30, 0.025, 48]} />

        <meshStandardMaterial
          color="#24130a"
          metalness={0.15}
          roughness={0.7}
        />
      </mesh>

      {/* Wick */}
      <mesh
        ref={wickRef}
        position={[0.02, 0.39, 0]}
      >
        <cylinderGeometry
          args={[0.025, 0.035, 0.16, 10]}
        />

        <meshStandardMaterial
          color="#1c120d"
          emissive="#8d3d0b"
          emissiveIntensity={0}
          roughness={0.9}
        />
      </mesh>

      {/* Flame */}
      <mesh
        ref={flameRef}
        position={[0.02, 0.54, 0]}
      >
        <sphereGeometry args={[0.12, 20, 20]} />

        <meshBasicMaterial
          color="#ff9f25"
          transparent
          opacity={0}
        />
      </mesh>

      {/* Outer flame glow */}
      <mesh
        ref={flameGlowRef}
        position={[0.02, 0.54, 0]}
      >
        <sphereGeometry args={[0.30, 16, 16]} />

        <meshBasicMaterial
          color="#ff7a16"
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Flame light */}
      <pointLight
        ref={lightRef}
        position={[0.02, 0.58, 0]}
        color="#ff9b38"
        intensity={0}
        distance={4.5}
        decay={2}
      />
    </group>
  )
}

export default Diya