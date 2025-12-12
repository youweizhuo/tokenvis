## ADDED Requirements
### Requirement: Bounded canvas extent
The viewport SHALL clamp panning and zooming to the trace bounds (time ≥ 0 through the last span end plus configurable padding) and total lane height so the timeline and swimlanes terminate with the data.

#### Scenario: Clamp panning to trace bounds
- **WHEN** the user pans or zooms the canvas
- **THEN** the viewport cannot move left of time 0 or past the trace end + padding, and lane backgrounds stop at the same boundary.

## MODIFIED Requirements
### Requirement: Timeline aligned with zoom
The timeline bar SHALL remain fixed at the top while its ticks are positioned by projecting world time coordinates through the current viewport transform (x, y, zoom) so they stay aligned with span start/end positions without double scaling.

#### Scenario: Zoomed timeline
- **WHEN** the user zooms in or out or pans the canvas
- **THEN** timeline ticks stay aligned to span nodes within ≤0.5px drift because tick positions use the viewport transform, and the ruler origin remains at time 0 after fitView or translateExtent adjustments.

### Requirement: Lanes stay bound to spans
Swimlane bands SHALL render in the same viewport as nodes (e.g., via `ViewportPortal`) and apply the full x/y zoom transform so spans and lane backgrounds move and scale together.

#### Scenario: Lane alignment on pan/zoom
- **WHEN** the user pans or zooms
- **THEN** each lane background translates and scales with nodes on both axes, and lane labels stay within their bands.
