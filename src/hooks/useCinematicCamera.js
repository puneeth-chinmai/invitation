import { useRef, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CAMERA_POSITIONS, CAMERA_TARGETS, TIMING } from '../constants/cinematic'

/**
 * useCinematicCamera
 *
 * Manages smooth camera interpolation between named positions.
 * Returns a `setTarget(name)` function that smoothly moves the camera.
 *
 * @param {string} initialTarget - Key from CAMERA_POSITIONS to start at
 */
export function useCinematicCamera(initialTarget = 'START') {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(...Object.values(CAMERA_POSITIONS[initialTarget])))
  const targetLook = useRef(new THREE.Vector3(...Object.values(CAMERA_TARGETS[initialTarget])))
  const currentLook = useRef(new THREE.Vector3(...Object.values(CAMERA_TARGETS[initialTarget])))
  const lerpFactor = useRef(TIMING.CAMERA_EASE_FACTOR)

  // Initialize camera position immediately
  const initPos = CAMERA_POSITIONS[initialTarget]
  camera.position.set(initPos.x, initPos.y, initPos.z)

  const setTarget = useCallback((positionKey, options = {}) => {
    const pos = CAMERA_POSITIONS[positionKey]
    const look = CAMERA_TARGETS[positionKey]
    if (!pos || !look) return

    targetPos.current.set(pos.x, pos.y, pos.z)
    targetLook.current.set(look.x, look.y, look.z)
    lerpFactor.current = options.speed ?? TIMING.CAMERA_EASE_FACTOR
  }, [])

  useFrame(() => {
    // Smoothly lerp position
    camera.position.lerp(targetPos.current, lerpFactor.current)

    // Smoothly lerp lookAt target
    currentLook.current.lerp(targetLook.current, lerpFactor.current)
    camera.lookAt(currentLook.current)
  })

  return { setTarget }
}
