# Change: Fix canvas zoom sync for timeline and swimlanes

## Why
Timeline ticks and swimlane backgrounds drift when zooming or panning because they reapply the zoom factor and do not share the React Flow viewport transform. The canvas also behaves as if it were infinite even though traces start at time 0 and end at the last span, so the ruler and region lanes run past the content.

## What Changes
- Drive overlay positioning from the React Flow viewport (shared x/y/zoom) instead of duplicating zoom math, eliminating double-scaling.
- Render swimlane bands inside the flow viewport (or apply the same transform on both axes) and size them from the trace duration, not the current zoom.
- Project timeline ticks from world time → screen using the viewport transform so the ruler stays aligned with spans while the bar stays fixed.
- Bound panning/zooming to the trace extents (time ≥ 0 through last span + padding and total lane height) with sensible zoom limits instead of an infinite canvas.
- Update the visualization spec and add validation steps to guard against future zoom drift.

## Impact
- Affected specs: visualization
- Affected code: `components/trace-canvas.tsx`, `lib/layout.ts` (ppu + extents), UI overlays (timeline, swimlane labels)
