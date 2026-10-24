import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react'
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
export function JourneyMapCanvas({
  events = [],
  destination,
  onSelectEvent,
}) {
  const containerRef = useRef(null)
  const waypointRefs = useRef([])
  const terminalRef = useRef(null)
  const startRef = useRef(null)
  const prevDimRef = useRef({ width: 0, height: 0 })
  const prevPathRef = useRef('')
  const rafIdRef = useRef(null)

  const [routePathD, setRoutePathD] = useState('')
  const [dimensions, setDimensions] = useState({ width: 800, height: 1200 })

  // Recalculate route path by measuring exact card positions
  const updateRouteGeometry = useCallback(() => {
    if (!containerRef.current) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const containerW = Math.round(containerRect.width)
    const containerH = Math.round(containerRect.height)

    if (containerW <= 0 || containerH <= 0) return

    // Avoid redundant state updates if dimensions have not significantly changed
    if (
      Math.abs(prevDimRef.current.width - containerW) >= 2 ||
      Math.abs(prevDimRef.current.height - containerH) >= 2
    ) {
      prevDimRef.current = { width: containerW, height: containerH }
      setDimensions({ width: containerW, height: containerH })
    }

    const points = []

    // 1. Origin Start Point
    if (startRef.current) {
      const startRect = startRef.current.getBoundingClientRect()
      points.push({
        x: startRect.left + startRect.width / 2 - containerRect.left,
        y: startRect.bottom - containerRect.top + 6,
      })
    } else {
      points.push({ x: containerW / 2, y: 40 })
    }

    // 2. Event Milestone Milestones (measuring card inner edges)
    const isMobile = containerW < 768

    waypointRefs.current.forEach((el, idx) => {
      if (el) {
        const cardEl = el.querySelector?.('.keepsake-album-card') || el
        const rect = cardEl.getBoundingClientRect()
        const cardLeft = rect.left - containerRect.left
        const cardRight = rect.right - containerRect.left
        const cardWidth = rect.width
        const cardTop = rect.top - containerRect.top
        const cardHeight = rect.height

        const isLeftAligned = idx % 2 === 0
        let ptX = 0
        const ptY = cardTop + cardHeight * 0.42

        if (!isMobile) {
          // Desktop: route tucks 14px beneath the card's inner edge (facing center of timeline)
          ptX = isLeftAligned ? cardRight - 14 : cardLeft + 14
        } else {
          // Mobile: route weaves gently behind the cards
          ptX = isLeftAligned
            ? cardLeft + cardWidth * 0.28
            : cardLeft + cardWidth * 0.72
        }

        points.push({
          x: ptX,
          y: ptY,
          index: idx,
        })
      }
    })

    // 3. Destination Terminal
    if (terminalRef.current) {
      const termRect = terminalRef.current.getBoundingClientRect()
      points.push({
        x: termRect.left + termRect.width / 2 - containerRect.left,
        y: termRect.top + 26 - containerRect.top,
      })
    } else {
      points.push({ x: containerW / 2, y: containerH - 60 })
    }

    // Generate smooth continuous cubic Bézier path connecting all points
    if (points.length >= 2) {
      const pathD = buildSmoothContinuousSpline(points)
      if (pathD !== prevPathRef.current) {
        prevPathRef.current = pathD
        setRoutePathD(pathD)
      }
    }
  }, [])

  // Recompute on mount, event changes, and window resize with RAF debouncing
  useEffect(() => {
    updateRouteGeometry()

    const scheduleUpdate = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = requestAnimationFrame(() => {
        updateRouteGeometry()
      })
    }

    const ro = new ResizeObserver(() => {
      scheduleUpdate()
    })

    if (containerRef.current) {
      ro.observe(containerRef.current)
    }

    window.addEventListener('resize', scheduleUpdate)
    const timer = setTimeout(updateRouteGeometry, 250)

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      window.removeEventListener('resize', scheduleUpdate)
      ro.disconnect()
      clearTimeout(timer)
    }
  }, [events, updateRouteGeometry])

  const contourCurves = useMemo(
    () => renderContourCurves(dimensions.width, dimensions.height),
    [dimensions.width, dimensions.height]
  )

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
        </defs>

        {/* --- Subtle Cartographic Contour Lines (No fantasy landscape) --- */}
        {contourCurves}

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
          <g className="map-continuous-route">
            {/* Layer 1: Ambient Route Soft Glow (thinner, more restrained) */}
            <path
              d={routePathD}
              fill="none"
              stroke="rgba(223, 182, 109, 0.22)"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Layer 2: Muted Darker Outline / Base Casing */}
            <path
              d={routePathD}
              fill="none"
              stroke="#6b461f"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.85"
            />

            {/* Layer 3: Radiant Antique-Gold Editorial Ribbon */}
            <path
              d={routePathD}
              fill="none"
              stroke="url(#mapGoldStroke)"
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Layer 4: Fine Delicate Center Dotted Guide */}
            <path
              d={routePathD}
              fill="none"
              stroke="#FFFDF9"
              strokeWidth="0.9"
              strokeDasharray="3 4"
              strokeLinecap="round"
              opacity="0.9"
            />
          </g>
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

export default React.memo(JourneyMapCanvas)

/**
 * Build a smooth cubic Bézier spline passing through all anchor points
 */
function buildSmoothContinuousSpline(points) {
  if (points.length < 2) return ''

  let d = `M ${points[0].x.toFixed(1)},${points[0].y.toFixed(1)}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]

    const dy = p1.y - p0.y
    const cpYOffset = dy * 0.52

    // Smooth vertical S-curve tangents
    const cp1x = p0.x
    const cp1y = p0.y + cpYOffset

    const cp2x = p1.x
    const cp2y = p1.y - cpYOffset

    d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`
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
