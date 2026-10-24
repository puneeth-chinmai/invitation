import React from 'react'
import KeepsakeEventCard from './KeepsakeEventCard'

/**
 * EventMarkerNode
 *
 * Timeline milestone renderer.
 * Delegates ALL milestone stops to the redesigned KeepsakeEventCard
 * so every event along the journey shares the premium scrapbook keepsake aesthetic.
 */
export function EventMarkerNode({
  event,
  index,
  isLeftAligned = true,
  onSelect,
}) {
  return (
    <KeepsakeEventCard
      event={event}
      index={index}
      isLeftAligned={isLeftAligned}
      onSelect={onSelect}
    />
  )
}

export default React.memo(EventMarkerNode)
