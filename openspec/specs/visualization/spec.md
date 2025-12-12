# visualization Specification

## Purpose
TBD - created by archiving change add-visual-polish. Update Purpose after archive.
## Requirements
### Requirement: Custom span node visuals
The system SHALL render spans with a custom node design that includes agent-based color, readable labels (agent, location, time), and clear hover/focus states.

#### Scenario: Node readability
- **WHEN** a span node is displayed
- **THEN** its label and color contrast meet accessibility and agent coloring is consistent across canvas elements.

### Requirement: Swimlane styling
The canvas SHALL show location-labeled swimlanes with alternating backgrounds and separators aligned to lane height.

#### Scenario: Location bands
- **WHEN** multiple locations are present
- **THEN** each location band displays its name and a distinct background tint that stays aligned while panning/zooming.

### Requirement: Agent-colored animated edges
Edges SHALL inherit the agent color and may include subtle movement animation to indicate flow between spans without hindering performance.

#### Scenario: Edge animation
- **WHEN** edges render for a given agent
- **THEN** their stroke color matches the agent color and animation is smooth without frame drops on 1k spans.

### Requirement: Timeline ruler
The viewer SHALL display a timeline bar with ticks/labels synchronized to the pixel scale (pixels-per-microsecond) used by the layout.

#### Scenario: Time alignment
- **WHEN** the user views the canvas at default scale
- **THEN** timeline ticks align with span positions within acceptable rounding (≤0.5px drift).

### Requirement: Timeline aligned with zoom
The timeline bar SHALL remain fixed at the top while its ticks are positioned by projecting world time coordinates through the current viewport transform (x, y, zoom) so they stay aligned with span start/end positions without double scaling.

#### Scenario: Zoomed timeline
- **WHEN** the user zooms in or out or pans the canvas
- **THEN** timeline ticks stay aligned to span nodes within ≤0.5px drift because tick positions use the viewport transform, and the ruler origin remains at time 0 after fitView or translateExtent adjustments.

### Requirement: Duration-proportional nodes under zoom
Node widths SHALL stay proportional to span durations at any zoom level (no squashing/stretching artifacts).

#### Scenario: Proportional width
- **WHEN** zoom changes
- **THEN** node widths still reflect `(end_time - start_time)` at the scaled pixel-per-microsecond ratio.

### Requirement: Lanes stay bound to spans
Swimlane bands SHALL render in the same viewport as nodes (e.g., via `ViewportPortal`) and apply the full x/y zoom transform so spans and lane backgrounds move and scale together.

#### Scenario: Lane alignment on pan/zoom
- **WHEN** the user pans or zooms
- **THEN** each lane background translates and scales with nodes on both axes, and lane labels stay within their bands.

### Requirement: Three-panel responsive layout
The viewer SHALL present a three-panel layout: left controls panel (collapsible), center canvas, and right details panel (collapsible).

#### Scenario: Desktop layout
- **WHEN** viewed on desktop width
- **THEN** the left and right panels are visible by default and can be collapsed to maximize canvas space.

### Requirement: Left panel contents
The left panel SHALL include TokenVis name, active trace name, agent filters, style presets, and time range controls.

#### Scenario: Controls accessible
- **WHEN** the left panel is open
- **THEN** these controls are visible and usable without overlapping the canvas.

### Requirement: Right panel node details
The right panel SHALL display details of the currently selected node and can be closed to restore space.

#### Scenario: Node selection
- **WHEN** a user clicks a node
- **THEN** the right panel opens (or updates) with that node’s details; when closed, canvas space expands.

### Requirement: Responsive behavior
On narrow viewports, panels SHALL be toggleable/stacked so the canvas remains usable; panel state persists during navigation within the page.

#### Scenario: Mobile toggle
- **WHEN** the viewport is narrow
- **THEN** the panels hide behind toggles, and opening one does not permanently obscure the canvas.

### Requirement: Shadcn-based viewer UI
The viewer UI (left controls, right details, legends, toggles) SHALL be built with Shadcn components styled via Tailwind tokens.

#### Scenario: Unified components
- **WHEN** the viewer renders
- **THEN** panels, buttons, badges, inputs, and drawers use Shadcn primitives with consistent styling.

### Requirement: Responsive pane behavior (Shadcn sheets/drawers)
Side panels SHALL collapse on desktop and become Shadcn Sheet/Drawer on mobile, without covering the canvas when closed.

#### Scenario: Mobile sheet
- **WHEN** on a narrow viewport
- **THEN** opening the left or right panel presents a sheet/drawer; closing it restores full canvas width.

### Requirement: Canvas toolbar/legend with Shadcn tokens
Canvas-adjacent UI (legends, timeline badges, toolbar buttons) SHALL use Shadcn Button/Badge/Tooltip components and follow the shared pastel palette.

#### Scenario: Legend styling
- **WHEN** the legend renders
- **THEN** agent badges use Shadcn badge styles with the defined color tokens.

### Requirement: Bounded canvas extent
The viewport SHALL clamp panning and zooming to the trace bounds (time ≥ 0 through the last span end plus configurable padding) and total lane height so the timeline and swimlanes terminate with the data.

#### Scenario: Clamp panning to trace bounds
- **WHEN** the user pans or zooms the canvas
- **THEN** the viewport cannot move left of time 0 or past the trace end + padding, and lane backgrounds stop at the same boundary.

