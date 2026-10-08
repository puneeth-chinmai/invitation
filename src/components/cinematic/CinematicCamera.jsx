import { useCinematicCamera } from '../../hooks/useCinematicCamera'

/**
 * CinematicCamera
 *
 * Renders nothing — just activates the camera hook which runs in useFrame.
 * The parent (OpeningSequence) controls which target is active via the
 * setTarget ref passed back through onReady.
 *
 * @param {string} target       - Current camera target key
 * @param {function} onReady    - Called with { setTarget } after mount
 */
export default function CinematicCamera({ target = 'START' }) {
  // Hook is self-contained; it reads `target` changes via its own closure
  useCinematicCamera(target)
  return null
}
