# visualization Specification

## Purpose
TBD - created by archiving change add-visual-polish. Update Purpose after archive.
## Requirements
### Requirement: Custom span node visuals

The system SHALL render spans with a custom node design that includes:

- **Gradient fill**: OKLCH-based gradient from the agent's border color to a lighter tint, replacing the previous white fill
- **Rectangular shape**: Subtle rounded corners (`rounded-sm`) instead of pill-shaped (`rounded-full`) for a timeline bar appearance
- **Fixed height**: Node height remains constant regardless of content length or zoom level
- **Text truncation**: Long text SHALL be truncated with ellipsis (`...`) using `text-overflow: ellipsis` and `overflow: hidden` instead of wrapping to multiple lines
- **Readable labels**: Agent ID, location, and duration displayed in a single line
- **Clear hover/focus states**: Visual feedback on interaction

#### Scenario: Node readability

- **WHEN** a span node is displayed
- **THEN** its label and color contrast meet accessibility and agent coloring is consistent across canvas elements.

#### Scenario: Text overflow on narrow nodes

- **WHEN** a span node's width is smaller than its text content (due to zoom or short duration)
- **THEN** the text truncates with ellipsis and the node height remains unchanged.

#### Scenario: Gradient fill rendering

- **WHEN** a span node renders
- **THEN** its background shows a gradient from the agent's OKLCH border color to a lighter tint, creating depth while maintaining the agent color identity.

### Requirement: Swimlane styling

The canvas SHALL show location-labeled swimlanes with alternating backgrounds and separators aligned to lane height. Swimlane backgrounds SHALL extend infinitely to the right, rendering only the visible portion, and location labels SHALL be positioned in a fixed-width gutter to the left of time x=0.

#### Scenario: Location bands

- **WHEN** multiple locations are present
- **THEN** each location band displays its name in a gutter left of x=0 and a distinct background tint that stays aligned while panning/zooming and extends beyond the visible trace duration.

#### Scenario: Infinite horizontal extent

- **WHEN** the user pans or scrolls horizontally
- **THEN** swimlanes continue to render smoothly without a hard right boundary, allowing exploration of future time or whitespace as needed.

### Requirement: Agent-colored animated edges
Edges SHALL inherit the agent color and may include subtle movement animation to indicate flow between spans without hindering performance.

#### Scenario: Edge animation
- **WHEN** edges render for a given agent
- **THEN** their stroke color matches the agent color and animation is smooth without frame drops on 1k spans.

### Requirement: Timeline ruler

The viewer SHALL display a timeline bar with ticks/labels synchronized to the pixel scale (pixels-per-microsecond) used by the layout. The "0 ms" tick SHALL align with x=0 where span positioning begins, and the first swimlane SHALL start immediately below the timeline header with no blank vertical space.

#### Scenario: Time alignment

- **WHEN** the user views the canvas at default scale
- **THEN** timeline ticks align with span positions within acceptable rounding (≤0.5px drift).

#### Scenario: Zero millisecond alignment

- **WHEN** a span starts at time 0 (or minStart)
- **THEN** the span's left edge aligns with the "0 ms" timeline tick at x=0.

#### Scenario: No gap between timeline and lanes

- **WHEN** the canvas renders with swimlanes
- **THEN** the first swimlane starts at y=0 (or timeline header height) with no additional vertical padding or blank space between the timeline ruler and the first lane.

### Requirement: Timeline aligned with zoom

The timeline bar SHALL remain fixed at the top while its ticks are positioned by projecting world time coordinates through the current horizontal zoom transform so they stay aligned with span start/end positions.

#### Scenario: Zoomed timeline

- **WHEN** the user zooms horizontally or pans the canvas
- **THEN** timeline ticks stay aligned to span nodes within ≤0.5px drift because tick positions use the time scale transform, and the ruler origin remains at time 0.

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

### Requirement: Three-panel responsive layout
The viewer SHALL present a three-panel layout: left controls panel (collapsible), center canvas, and right details panel (collapsible).

#### Scenario: Desktop layout
- **WHEN** viewed on desktop width
- **THEN** the left and right panels are visible by default and can be collapsed to maximize canvas space.

### Requirement: Left panel contents

The left panel SHALL include TokenVis name, active trace name, **trace selector**, and agent filters. The trace selector allows users to switch between available traces in the database.

#### Scenario: Controls accessible

- **WHEN** the left panel is open
- **THEN** the TokenVis name, trace selector, trace name, and agent filter checkboxes are visible and usable without overlapping the canvas.

#### Scenario: No placeholder controls

- **WHEN** the left panel renders
- **THEN** there are no placeholder sliders, disabled buttons, or minimap toggles visible.

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

### Requirement: Time zero reference line

The canvas SHALL render a vertical reference line at x=0 (time zero) to clearly mark the start of the timeline, and all location labels SHALL be positioned to the left of this line in a dedicated gutter.

#### Scenario: Time zero marker

- **WHEN** the canvas is displayed
- **THEN** a vertical line at x=0 is visible, styled subtly (e.g., dashed or light solid), and transforms correctly with zoom/pan so it stays aligned with time zero across all zoom levels.

#### Scenario: Location label gutter

- **WHEN** swimlanes are rendered
- **THEN** location labels appear in a fixed-width gutter (e.g., 120px) to the left of x=0, vertically centered in their respective swimlanes, and remain readable without zoom scaling.

### Requirement: Canvas scroll bars

The canvas SHALL provide horizontal and vertical scroll bars (or pan-based scrolling via ReactFlow) to navigate traces that extend beyond the visible viewport, supporting effectively infinite horizontal exploration.

#### Scenario: Horizontal scrolling

- **WHEN** the trace or canvas width exceeds the viewport
- **THEN** the user can scroll or pan horizontally to view spans at any time, including times far beyond the last span's end.

#### Scenario: Vertical scrolling

- **WHEN** the number of lanes exceeds the viewport height
- **THEN** the user can scroll or pan vertically to view all swimlanes without vertical extent constraints beyond the last lane.

### Requirement: Bounded canvas extent (updated)

The viewport SHALL clamp vertical panning to the total lane height and allow horizontal panning from a fixed left gutter (at negative x for location labels) to effectively infinite positive x, with no hard right boundary. The timeline and swimlanes SHALL extend indefinitely to the right, rendering only the visible portion.

#### Scenario: Clamp vertical panning

- **WHEN** the user pans vertically
- **THEN** the viewport cannot move above the timeline or below the last swimlane, ensuring all lanes remain accessible.

#### Scenario: Infinite horizontal panning

- **WHEN** the user pans horizontally to the right
- **THEN** the canvas allows exploration far beyond the last span without a hard cutoff, and swimlane backgrounds continue to render dynamically.

#### Scenario: Fixed left gutter

- **WHEN** the user pans horizontally to the left
- **THEN** the viewport stops at the left gutter boundary (e.g., x=-120) to keep location labels visible, and panning cannot move further left than this gutter.

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

### Requirement: Trace selector in left panel

The left panel SHALL include a trace selector component that:

- Displays a list or dropdown of available traces fetched from `/api/traces`
- Shows trace names with their IDs
- Allows selecting a trace to load its spans into the canvas
- Defaults to "kitchen-sink" trace on initial load for backward compatibility
- Handles loading and error states gracefully

#### Scenario: Trace list displayed

- **WHEN** the left panel opens and traces are available in the database
- **THEN** the trace selector shows all available trace names fetched from the API.

#### Scenario: Trace selection updates canvas

- **WHEN** the user selects a different trace from the selector
- **THEN** the canvas loads and displays the spans for the selected trace without requiring a page reload.

#### Scenario: Default trace selection

- **WHEN** the viewer loads without a specific trace selection
- **THEN** the "kitchen-sink" trace is selected and displayed by default.

#### Scenario: Empty trace list

- **WHEN** no traces exist in the database
- **THEN** the selector displays an appropriate empty state message (e.g., "No traces available. Run npm run seed.").

#### Scenario: API error handling

- **WHEN** the `/api/traces` request fails
- **THEN** the selector displays an error state and allows retry.

### Requirement: Dynamic trace loading

The viewer SHALL support loading any trace by ID, not just the hardcoded "kitchen-sink" trace.

#### Scenario: Load trace by ID

- **WHEN** a trace ID is provided (via selector, URL, or state)
- **THEN** the system fetches spans for that trace ID and renders them on the canvas.

#### Scenario: Invalid trace ID

- **WHEN** a non-existent trace ID is requested
- **THEN** an appropriate error message is displayed and the canvas shows an empty state.

### Requirement: Trace name in header

The viewer header SHALL display the name of the currently selected trace.

#### Scenario: Header shows trace name

- **WHEN** a trace is loaded
- **THEN** the header displays "Trace: {trace_name}" with the selected trace's name.

#### Scenario: Header updates on selection change

- **WHEN** the user switches to a different trace
- **THEN** the header updates to show the newly selected trace's name.

