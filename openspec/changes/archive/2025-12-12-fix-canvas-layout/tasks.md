# Tasks: Fix canvas layout spacing and scrolling

## Implementation Checklist

- [x] Remove vertical padding between timeline and first swimlane
    - [x] Set first lane y-position to 0 (or timeline header height only)
    - [x] Update `extentMin.y` and swimlane rendering to eliminate gap
    - [x] Verify timeline ticks align with spans without vertical offset

- [x] Add vertical reference line at time x=0
    - [x] Render a vertical line at x=0 in the ViewportPortal or canvas background
    - [x] Style the line to be visible but not intrusive (e.g., dashed or subtle solid)
    - [x] Ensure the line transforms with zoom/pan correctly

- [x] Position location labels left of the time=0 line
    - [x] Create a fixed-width gutter area (e.g., 120px) to the left of x=0
    - [x] Render location labels in this gutter, aligned vertically with their respective swimlanes
    - [x] Update `extentMin.x` to accommodate the gutter (e.g., -120 instead of -200)
    - [x] Ensure labels stay visible and don't zoom-scale (inverse transform if needed)

- [x] Make swimlanes extend infinitely to the right
    - [x] Update `worldWidth` calculation to be much larger than trace duration (e.g., 10x or configurable)
    - [x] Set `extentMax.x` to a very large value or remove the right boundary constraint
    - [x] Ensure swimlane backgrounds extend beyond visible spans

- [x] Add horizontal and vertical scroll bars
    - [x] Verify ReactFlow's built-in panning provides scroll-like behavior
    - [x] If native scrollbars are needed, wrap ReactFlow in a scrollable container
    - [x] Test that scroll bars appear when content exceeds viewport

- [x] Update viewport extent and rendering logic
    - [x] Adjust `translateExtent` to support infinite horizontal scroll
    - [x] Keep vertical bounds to prevent scrolling above/below lanes
    - [x] Test fitView behavior to ensure it respects new extent

- [x] Test and refine
    - [x] Verify no blank space between timeline and first lane
    - [x] Confirm time=0 line is visible and labels are left-aligned
    - [x] Test horizontal scrolling with large traces
    - [x] Ensure performance is acceptable with infinite scroll
