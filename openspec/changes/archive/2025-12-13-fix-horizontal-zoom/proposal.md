# Change: Semantic zoom behavior and extract hardcoded constants

## Why

The current canvas has two issues that hurt usability:

1. **Uniform zoom changes swimlane heights unexpectedly**: When zooming, both horizontal (time) and vertical (swimlane) dimensions scale together. While this is standard React Flow behavior, it can feel disorienting for timeline visualization where users primarily want to zoom into time ranges. Professional tools like Chrome DevTools and Perfetto solve this with semantic zoom patterns.

2. **Hardcoded magic numbers scattered throughout**: The canvas code contains numerous hardcoded values (e.g., `headerOffset = 40`, `gutterWidth = 120`, `laneHeight = 80`, `minZoom = 0.25`, `maxZoom = 2.5`, `worldWidth` multiplier `10`, etc.) that make the code hard to maintain and customize.

## What Changes

### Horizontal-only zoom behavior (DevTools/Perfetto style)

Implement true horizontal-only zoom where scrolling zooms the time axis while keeping lane heights fixed:

- **Disable React Flow's built-in zoom** (`zoomOnScroll={false}`, viewport zoom locked at 1.0)
- **Use `pixelsPerMicrosecond` as the zoom control** - changing time scale re-renders nodes at new positions/widths
- **Ctrl/Cmd+scroll for horizontal zoom** - zooms toward mouse position on the time axis
- **Pan with scroll/drag** - panning works normally without modifier keys
- **Add "Fit to Trace" button** using `fitView()` to reset to full trace view
- **Add "Fit to Selection" capability** to zoom to selected spans' time range

This approach follows industry patterns:

- **Chrome DevTools Performance**: Horizontal zoom on time axis, fixed lane heights
- **Perfetto**: Horizontal zoom + WASD navigation + selection-based zoom
- **Jaeger**: Click timeline to zoom to span, breadcrumb navigation

### Extract hardcoded constants

Create a centralized configuration object for canvas layout constants:

| Constant | Current Value | Location |
|----------|---------------|----------|
| `headerOffset` | 40 | trace-canvas.tsx |
| `gutterWidth` | 120 | trace-canvas.tsx |
| `laneHeight` | 80 (default) | trace-canvas.tsx, layout.ts |
| `pixelsPerMicrosecond` | 0.0001 (default) | trace-canvas.tsx, layout.ts |
| `minZoom` | 0.25 | trace-canvas.tsx |
| `maxZoom` | 2.5 | trace-canvas.tsx |
| `worldWidthMultiplier` | 10 | trace-canvas.tsx |
| `minWorldWidth` | 4000 | trace-canvas.tsx |
| `fitViewPadding` | 0.2 | trace-canvas.tsx |
| `nodeMinWidth` | 12 | layout.ts |
| `laneTopMargin` | 4 | layout.ts |
| `nodeHeightRatio` | 0.8 | layout.ts |
| `nodeMinHeight` | 40 | layout.ts |
| `desiredTimelineTicks` | 7 | trace-canvas.tsx |
| `backgroundGap` | 16 | trace-canvas.tsx |

## Impact

- Affected specs: visualization
- Affected code: trace-canvas.tsx, layout.ts, lib/canvas-config.ts (new)
- User experience: Industry-standard zoom behavior matching DevTools/Perfetto patterns, easier configuration
- Preserves React Flow's built-in zoom mechanics for reliability and accessibility
