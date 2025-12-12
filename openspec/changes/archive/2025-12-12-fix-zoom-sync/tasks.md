## 1. Implementation
- [x] 1.1 Replace manual pan/zoom state in `components/trace-canvas.tsx` with `useViewport` / `useOnViewportChange` so overlays consume the same transform as nodes.
- [x] 1.2 Recompute timeline ticks in world time (pixels-per-microsecond) and project them via the viewport transform instead of multiplying zoom twice.
- [x] 1.3 Render swimlane bands in the flow viewport (e.g., `ViewportPortal`) or apply the full x/y transform; size bands from trace duration rather than current zoom; keep labels inside the band.
- [x] 1.4 Clamp canvas extents using `translateExtent` / `nodeExtent` and zoom bounds so panning starts at time 0 and ends at the last span + padding and total lane height.
- [x] 1.5 Manually verify zoom/pan: nodes stay in lanes, timeline ticks align at multiple zoom levels, and the canvas stops at the right edge.

## 2. Specs
- [x] 2.1 Run `openspec validate fix-zoom-sync --strict` and resolve any errors.
