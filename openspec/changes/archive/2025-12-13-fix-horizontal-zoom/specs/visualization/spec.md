# visualization Specification (Delta)

## MODIFIED Requirements

### Requirement: Duration-proportional nodes under zoom

Node widths SHALL scale proportionally with horizontal zoom (time scale), while node heights remain fixed at the configured lane height ratio regardless of zoom level.

#### Scenario: Horizontal zoom scaling

- **WHEN** horizontal time scale changes (via Ctrl/Cmd+scroll or zoom buttons)
- **THEN** node widths scale proportionally with the time scale, reflecting `(end_time - start_time)` at the current `pixelsPerMicrosecond` value.

#### Scenario: Fixed height under zoom

- **WHEN** horizontal zoom changes
- **THEN** node heights remain constant at their configured size (e.g., 80% of lane height), not scaling with zoom.

### Requirement: Lanes stay bound to spans

Swimlane bands SHALL render in the same viewport as nodes with fixed heights regardless of zoom, so spans scale horizontally with time while lane heights remain constant.

#### Scenario: Lane alignment on pan/zoom

- **WHEN** the user pans or zooms horizontally
- **THEN** each lane background extends horizontally with zoom but maintains fixed height, and lane labels stay within their bands at fixed vertical positions.

### Requirement: Timeline aligned with zoom

The timeline bar SHALL remain fixed at the top while its ticks are positioned by projecting world time coordinates through the current horizontal zoom transform so they stay aligned with span start/end positions.

#### Scenario: Zoomed timeline

- **WHEN** the user zooms horizontally or pans the canvas
- **THEN** timeline ticks stay aligned to span nodes within ≤0.5px drift because tick positions use the time scale transform, and the ruler origin remains at time 0.

## ADDED Requirements

### Requirement: Horizontal-only zoom (DevTools/Perfetto style)

The canvas SHALL zoom horizontally only by default (time axis), keeping swimlane heights fixed so users can focus on time-based exploration without vertical dimension changes.

#### Scenario: Ctrl/Cmd + mouse wheel zoom

- **WHEN** the user holds Ctrl/Cmd and scrolls the mouse wheel
- **THEN** only the horizontal (time) axis scales via `pixelsPerMicrosecond` change, swimlane heights remain constant, and span nodes widen or narrow proportionally.

#### Scenario: Zoom toward mouse position

- **WHEN** the user zooms with Ctrl/Cmd+scroll
- **THEN** the zoom is centered on the mouse position along the time axis, keeping the time under the cursor stationary.

#### Scenario: Regular scroll for panning

- **WHEN** the user scrolls without modifier keys
- **THEN** the canvas pans in the scroll direction, not zooming.

#### Scenario: Fit to Trace

- **WHEN** the user clicks the "Fit to Trace" button or presses `0`
- **THEN** the time scale resets to default and the viewport resets to show the entire trace.

#### Scenario: Fit to Selection

- **WHEN** the user selects one or more spans and presses `f`
- **THEN** the viewport zooms and pans to fit the selected nodes' bounding box.

#### Scenario: Zoom bounds

- **WHEN** the user zooms to the minimum or maximum level
- **THEN** the horizontal zoom is clamped to configured bounds (e.g., 0.25x to 2.5x of default time scale) and further input has no effect.

### Requirement: Centralized canvas configuration

All canvas layout constants SHALL be defined in a single configuration module with typed defaults and optional override capability, eliminating hardcoded magic numbers throughout the codebase.

#### Scenario: Default configuration

- **WHEN** the canvas renders without custom props
- **THEN** it uses sensible defaults from the centralized config (e.g., laneHeight=80, headerOffset=40, gutterWidth=120).

#### Scenario: Custom configuration

- **WHEN** custom layout values are passed via props
- **THEN** they override the corresponding defaults from the centralized config, and the canvas renders accordingly.

#### Scenario: Configuration consistency

- **WHEN** layout calculations occur in different modules (trace-canvas.tsx, layout.ts)
- **THEN** they all reference the same centralized config source, ensuring consistent values across the codebase.

### Requirement: Zoom control UI

The canvas SHALL provide visible zoom controls for explicit viewport manipulation, following accessibility and usability best practices.

#### Scenario: Zoom control panel

- **WHEN** the canvas renders
- **THEN** a control panel with zoom in/out buttons and fit-to-trace button is visible.

#### Scenario: Zoom level display

- **WHEN** the viewport zoom changes
- **THEN** the current zoom percentage is displayed in the control panel.

#### Scenario: Keyboard shortcuts

- **WHEN** the user presses zoom-related keyboard shortcuts (e.g., `0` to reset, `+`/`-` to zoom)
- **THEN** the viewport responds accordingly, matching the button behavior.
