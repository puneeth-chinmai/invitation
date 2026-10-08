// ─── Opening Sequence States ──────────────────────────────────────────────────
export const SEQUENCE_STATES = {
  INTRO: 'INTRO',       // Camera approaching, title fading in
  REVEAL: 'REVEAL',     // Temple fully revealed, ambient settled
  DOOR_READY: 'DOOR_READY',     // "Tap to enter" prompt visible
  DOOR_OPENING: 'DOOR_OPENING', // Doors opening animation
  ENTERED: 'ENTERED',           // Camera moves through doors
}

// ─── Camera Positions ─────────────────────────────────────────────────────────
export const CAMERA_POSITIONS = {
  START: { x: 0, y: 3.5, z: 28 },     // Far away, slightly elevated
  SETTLE: { x: 0, y: 2.0, z: 10 },    // Settled in front of doors
  ENTERED: { x: 0, y: 2.0, z: 1 },    // Through the doors
}

// ─── Camera Targets (lookAt) ──────────────────────────────────────────────────
export const CAMERA_TARGETS = {
  START: { x: 0, y: 1.5, z: 0 },
  SETTLE: { x: 0, y: 1.5, z: 0 },
  ENTERED: { x: 0, y: 1.5, z: -8 },
}

// ─── Timing (seconds) ─────────────────────────────────────────────────────────
export const TIMING = {
  INTRO_DURATION: 4.0,      // How long intro state lasts
  REVEAL_DURATION: 2.0,     // How long reveal state lasts
  CAMERA_EASE_FACTOR: 0.025, // Lerp factor for smooth camera movement
  DOOR_OPEN_DURATION: 1.6,  // Door opening animation duration
}

// ─── Temple Geometry ──────────────────────────────────────────────────────────
export const TEMPLE = {
  DOOR_WIDTH: 1.4,
  DOOR_HEIGHT: 3.2,
  DOOR_DEPTH: 0.12,
  PILLAR_RADIUS: 0.28,
  PILLAR_HEIGHT: 5.5,
}

// ─── Colors / Materials ───────────────────────────────────────────────────────
export const COLORS = {
  STONE_DARK: '#2a1f14',
  STONE_MID: '#3d2e1e',
  STONE_LIGHT: '#5c4433',
  WOOD_DARK: '#3b1f0a',
  WOOD_MID: '#5c2d0e',
  GOLD: '#c9943a',
  GOLD_LIGHT: '#e8c06a',
  AMBER: '#f5a623',
  FLAME_CORE: '#fff4aa',
  FLAME_MID: '#ff9a1f',
  FLAME_OUTER: '#ff4500',
  WARM_LIGHT: '#ff8c42',
  BG: '#0d0805',
}
