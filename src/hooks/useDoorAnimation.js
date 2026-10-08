import { useRef, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'

/**
 * useDoorAnimation
 *
 * Manages the door opening animation using GSAP.
 * Returns refs for left/right door groups and a triggerOpen() function.
 *
 * @param {function} onOpen - Called when door animation completes
 */
export function useDoorAnimation(onOpen) {
  const leftDoorRef = useRef()
  const rightDoorRef = useRef()
  const isOpenedRef = useRef(false)

  const triggerOpen = useCallback(() => {
    if (isOpenedRef.current) return
    isOpenedRef.current = true

    const leftDoor = leftDoorRef.current
    const rightDoor = rightDoorRef.current

    if (!leftDoor || !rightDoor) return

    // Doors rotate around their hinge edge (pivot at x=+/-doorHalfWidth)
    gsap.to(leftDoor.rotation, {
      y: -Math.PI * 0.75,
      duration: 1.6,
      ease: 'power2.inOut',
      onComplete: () => onOpen?.(),
    })

    gsap.to(rightDoor.rotation, {
      y: Math.PI * 0.75,
      duration: 1.6,
      ease: 'power2.inOut',
    })
  }, [onOpen])

  return { leftDoorRef, rightDoorRef, triggerOpen }
}
