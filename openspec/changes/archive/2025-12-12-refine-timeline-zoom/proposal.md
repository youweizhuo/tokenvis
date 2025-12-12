# Change: Fix timeline + zoom sync for lanes and nodes

## Why
Current canvas shows timeline and swimlanes but they don’t stay perfectly aligned with zoom/pan; timeline should remain fixed while scaling with nodes, and lanes must keep nodes anchored when zooming.

## What Changes
- Keep the timeline bar fixed at the top while its ticks scale with zoom so labels stay aligned to node positions.
- Ensure node widths remain proportional to span duration at all zoom levels.
- Make swimlane bands scale/scroll with nodes so spans never leave their lanes during zoom/pan.

## Impact
- Affected specs: visualization
- Affected code: trace canvas rendering, zoom handling, timeline/lane overlays.
