# Change: Fix canvas layout spacing and scrolling

## Why

The current canvas has layout issues that reduce usability:

1. The first swimlane doesn't start immediately below the timeline—there's unwanted blank space between them
2. Time 0 is not clearly marked with a vertical reference line, and location labels are not consistently positioned to the left of this axis
3. Swimlanes have a fixed width instead of extending infinitely to the right, and there are no scroll bars for navigating large traces

These issues make it harder to read the timeline, understand spatial relationships, and navigate large traces efficiently.

## What Changes

- Remove vertical padding between the timeline ruler and the first swimlane (lane starts at y=0 after timeline header offset)
- Add a vertical reference line at time x=0 and position all location labels to the left of this line (in a fixed-width gutter)
- Make swimlanes extend infinitely to the right (render visible portions only) and add horizontal/vertical scroll bars to the canvas
- Update the viewport extent and rendering logic to support infinite horizontal scroll while maintaining vertical bounds
- Adjust the ViewportPortal lane backgrounds to render dynamically based on visible viewport

## Impact

- Affected specs: visualization
- Affected code: trace-canvas.tsx (layout, extent, timeline rendering), possibly layout.ts if coordinate system changes
- User experience: Improved readability, clearer time=0 reference, better navigation for wide traces
