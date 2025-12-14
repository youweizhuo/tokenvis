# Tasks: Semantic zoom behavior and extract hardcoded constants

## Implementation Checklist

- [x] Create centralized canvas configuration
    - [x] Create `lib/canvas-config.ts` with typed configuration object
    - [x] Define all layout constants with descriptive names and JSDoc comments
    - [x] Export default configuration and type definitions
    - [x] Add optional override mechanism via props or context

- [x] Update layout.ts to use centralized config
    - [x] Import canvas config and remove hardcoded values
    - [x] Use `nodeMinWidth`, `laneTopMargin`, `nodeHeightRatio`, `nodeMinHeight` from config
    - [x] Ensure `pixelsPerMicrosecond` and `laneHeight` can be overridden via options

- [x] Update trace-canvas.tsx to use centralized config
    - [x] Import canvas config and remove all hardcoded magic numbers
    - [x] Use config values for `headerOffset`, `gutterWidth`, `minZoom`, `maxZoom`, etc.
    - [x] Use config for `worldWidthMultiplier`, `minWorldWidth`, `fitViewPadding`
    - [x] Use config for `desiredTimelineTicks`, `backgroundGap`

- [x] Implement semantic zoom controls (DevTools/Perfetto style)
    - [x] Disable React Flow's built-in zoom (`zoomOnScroll={false}`, `zoomOnPinch={false}`)
    - [x] Add "Fit to Trace" button using `fitView()` to reset view
    - [x] Add "Fit to Selection" that zooms to selected nodes' bounding box via `fitBounds()`
    - [x] Add time scale state (`pixelsPerMicrosecond`) as controllable via UI or keyboard
    - [x] Implement Ctrl/Cmd+scroll for horizontal-only zoom (changes time scale, not viewport zoom)

- [x] Add zoom control UI
    - [x] Add Panel with zoom controls (zoom in/out buttons, fit-to-trace button)
    - [x] Display current zoom level percentage
    - [x] Add keyboard shortcuts (e.g., `0` to reset view, `+`/`-` for zoom)
    - [x] Style controls to match existing UI (shadcn/tailwind)

- [x] Verify node and swimlane rendering
    - [x] Node widths scale with time zoom, heights remain fixed (horizontal-only zoom)
    - [x] Swimlane heights remain fixed regardless of zoom
    - [x] Verify span node visual appearance at various zoom levels
    - [x] Location labels stay readable at all zoom levels

- [x] Verify timeline rendering
    - [x] Timeline tick positions scale with viewport zoom
    - [x] Verify tick alignment with span nodes at various zoom levels
    - [x] Ensure timeline header scales appropriately

- [x] Test and verify
    - [x] Verify uniform zoom works as expected (built-in React Flow behavior)
    - [x] Verify "Fit to Trace" resets view correctly
    - [x] Verify "Fit to Selection" zooms to selected spans
    - [x] Verify zoom controls are accessible and intuitive
    - [x] Test zoom bounds (min/max) work correctly
    - [x] Verify no regressions in pan behavior
    - [x] Test keyboard shortcuts work correctly
