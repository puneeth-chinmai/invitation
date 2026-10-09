import React, { useRef, useState, useEffect, useCallback } from 'react'
import EventMarkerNode from './EventMarkerNode'
import DestinationMedallion from './DestinationMedallion'
import { CompassRose, BotanicalSprig } from './JourneyOrnaments'

/**
 * JourneyMapCanvas
 *
 * The core relationship map component.
 * Features:
 *   - Continuous, double-layered antique-gold winding route with deliberate curvature
 *   - Subtle cartographic background contour lines and coordinate grid markings (no fantasy scenery)
 *   - Alternating compact event markers that leave the route visible
 *   - Responsive real-time anchor alignment on mobile and desktop
 *   - Prominent terminal destination medallion for 29 November 2026
 */
export default function JourneyMapCanvas({
  events = [],
  destination,
  onSelectEvent,
}) {
  const containerRef = useRef(null)
  const waypointRefs = useRef([])
  const terminalRef = useRef(null)
  const startRef = useRef(null)

  const [routePathD, setRoutePathD] = useState('')
  const [dimensions, setDimensions] = useState({ width: 800, height: 1200 })
  const [waypoints, setWaypoints] = useState([])

  // Recalculate route path by measuring exact waypoint positions
  const updateRouteGeometry = useCallback(() => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerW = containerRect.width
    const containerH = containerRect.height

    if (containerW <= 0 || containerH <= 0) return

    setDimensions({ width: containerW, height: containerH })

    const points = []

    // 1. Origin Start Point
    if (startRef.current) {
      const startRect = startRef.current.getBoundingClientRect()
      points.push({
        x: startRect.left + startRect.width / 2 - containerRect.left,
        y: startRect.top + startRect.height / 2 - containerRect.top,
      })
    } else {
      points.push({ x: containerW / 2, y: 35 })
    }

    // 2. Event Milestone Waypoints
    const measuredWaypoints = []
    waypointRefs.current.forEach((el, idx) => {
      if (el) {
        const rect = el.getBoundingClientRect()
        const pt = {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top,
          index: idx,
        }
        points.push(pt)
        measuredWaypoints.push(pt)
      }
    })
    setWaypoints(measuredWaypoints)

    // 3. Destination Terminal
    if (terminalRef.current) {
      const termRect = terminalRef.current.getBoundingClientRect()
      points.push({
        x: termRect.left + termRect.width / 2 - containerRect.left,
        y: termRect.top + 28 - containerRect.top,
      })
    } else {
      points.push({ x: containerW / 2, y: containerH - 60 })
    }

    // Generate smooth continuous cubic Bézier path connecting all points
    if (points.length >= 2) {
      const pathD = buildSmoothContinuousSpline(points)
      setRoutePathD(pathD)
    }
  }, [])

  // Recompute on mount, event changes, and window resize
  useEffect(() => {
    updateRouteGeometry()

    const handleResize = () => {
      updateRouteGeometry()
    }

    const ro = new ResizeObserver(() => {
      updateRouteGeometry()
    })

    if (containerRef.current) {
      ro.observe(containerRef.current)
    }

    window.addEventListener('resize', handleResize)
    // Small timeout to ensure font load and image render layout settle
    const timer = setTimeout(updateRouteGeometry, 250)

    return () => {
      window.removeEventListener('resize', handleResize)
      ro.disconnect()
      clearTimeout(timer)
    }
  }, [events, updateRouteGeometry])

  return (
    <div className="journey-relationship-map" ref={containerRef}>
      {/* ===================================================
          1. CARTOGRAPHIC BACKGROUND & CONTINUOUS ROUTE SVG
      =================================================== */}
      <svg
        className="map-svg-canvas"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        style={{ width: '100%', height: dimensions.height }}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          {/* Radiant Antique-Gold Linear Gradient */}
          <linearGradient id="mapGoldStroke" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c4964c" />
            <stop offset="25%" stopColor="#dfb66d" />
            <stop offset="55%" stopColor="#c4964c" />
            <stop offset="85%" stopColor="#b88628" />
            <stop offset="100%" stopColor="#6d1620" />
          </linearGradient>

          {/* Route Glow Filter */}
          <filter id="routeGlowFilter" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* --- Subtle Cartographic Contour Lines (No fantasy landscape) --- */}
        {renderContourCurves(dimensions.width, dimensions.height)}

        {/* --- Coordinate Meridian Lines --- */}
        <line
          x1="18"
          y1="40"
          x2="18"
          y2={dimensions.height - 40}
          stroke="rgba(196, 150, 76, 0.16)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />
        <line
          x1={dimensions.width - 18}
          y1="40"
          x2={dimensions.width - 18}
          y2={dimensions.height - 40}
          stroke="rgba(196, 150, 76, 0.16)"
          strokeWidth="1"
          strokeDasharray="4 6"
        />

        {/* --- The Continuous Winding Route --- */}
        {routePathD && (
          <>
            {/* Layer 1: Ambient Route Glow */}
            <path
              d={routePathD}
              fill="none"
              stroke="rgba(223, 182, 109, 0.35)"
              strokeWidth="10"
              strokeLinecap="round"
              filter="url(#routeGlowFilter)"
            />

            {/* Layer 2: Muted Darker Outline / Base Casing */}
            <path
              d={routePathD}
              fill="none"
              stroke="#5a3818"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />

            {/* Layer 3: Antique-Gold Outer Line */}
            <path
              d={routePathD}
              fill="none"
              stroke="#8c6527"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 4: Luminous Inner Gold Ribbon */}
            <path
              d={routePathD}
              fill="none"
              stroke="url(#mapGoldStroke)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 5: Fine Delicate Center Dotted Guide */}
            <path
              d={routePathD}
              fill="none"
              stroke="#FFF8E7"
              strokeWidth="1.2"
              strokeDasharray="4 5"
              strokeLinecap="round"
              opacity="0.85"
            />

            {/* Decorative Studs / Leaf Waypoints along Route */}
            {waypoints.map((pt) => (
              <g key={`waypoint-node-${pt.index}`}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="20"
                  fill="rgba(255, 253, 248, 0.95)"
                  stroke="#b88628"
                  strokeWidth="1.8"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="15"
                  fill="none"
                  stroke="rgba(196, 150, 76, 0.5)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
              </g>
            ))}
          </>
        )}
      </svg>

      {/* ===================================================
          2. ROUTE ORIGIN POINT (MAP START SEAL)
      =================================================== */}
      <div className="map-route-start" ref={startRef}>
        <div className="start-seal-inner">
          <CompassRose size={34} />
          <span className="start-seal-label">JOURNEY ORIGIN</span>
        </div>
      </div>

      {/* ===================================================
          3. REAL RELATIONSHIP MILESTONES (COMPACT PREVIEWS)
      =================================================== */}
      <div className="map-milestones-stream">
        {events.map((event, index) => {
          // Alternate left and right bends
          const isLeftAligned = index % 2 === 0
          return (
            <div
              key={event.id}
              className={`map-milestone-row ${isLeftAligned ? 'row-left' : 'row-right'}`}
            >
              {/* Waypoint Anchor ref target for SVG path alignment */}
              <div
                className="map-waypoint-anchor"
                ref={(el) => {
                  waypointRefs.current[index] = el
                }}
              >
                <EventMarkerNode
                  event={event}
                  index={index}
                  isLeftAligned={isLeftAligned}
                  onSelect={onSelectEvent}
                />
              </div>
            </div>
          )
        })}

        {/* Botanical sprig resting gently between stops */}
        <div className="map-midpoint-decor" aria-hidden="true">
          <BotanicalSprig width={30} height={18} />
        </div>

        {/* ===================================================
            4. WEDDING-DAY DESTINATION TERMINAL (ALWAYS LAST)
        =================================================== */}
        {destination && (
          <div className="map-destination-wrapper" ref={terminalRef}>
            <DestinationMedallion destination={destination} />
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Build a smooth cubic Bézier spline passing through all anchor points
 */
function buildSmoothContinuousSpline(points) {
  if (points.length < 2) return ''

  let d = `M ${points[0].x},${points[0].y}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]

    const dy = p1.y - p0.y
    const cpYOffset = dy * 0.55

    // Smooth vertical S-curve tangents
    const cp1x = p0.x
    const cp1y = p0.y + cpYOffset

    const cp2x = p1.x
    const cp2y = p1.y - cpYOffset

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p1.x},${p1.y}`
  }

  return d
}

/**
 * Render faint cartographic topography contour lines in the background
 */
function renderContourCurves(w, h) {
  if (w <= 0 || h <= 0) return null

  const paths = []
  const step = Math.max(h / 6, 160)

  for (let y = 100; y < h - 120; y += step) {
    const d = `M 0,${y} C ${w * 0.25},${y - 25} ${w * 0.75},${y + 25} ${w},${y}`
    paths.push(
      <path
        key={`contour-${y}`}
        d={d}
        fill="none"
        stroke="rgba(196, 150, 76, 0.08)"
        strokeWidth="1.2"
        strokeDasharray="6 6"
      />
    )
  }

  return <g className="map-contour-group">{paths}</g>
}
