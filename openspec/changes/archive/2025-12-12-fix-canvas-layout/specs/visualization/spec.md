# visualization Specification (Delta)

## MODIFIED Requirements

### Requirement: Timeline ruler

The viewer SHALL display a timeline bar with ticks/labels synchronized to the pixel scale (pixels-per-microsecond) used by the layout, and the first swimlane SHALL start immediately below the timeline header with no blank vertical space.

#### Scenario: Time alignment

- **WHEN** the user views the canvas at default scale
- **THEN** timeline ticks align with span positions within acceptable rounding (≤0.5px drift).

#### Scenario: No gap between timeline and lanes

- **WHEN** the canvas renders with swimlanes
- **THEN** the first swimlane starts at y=0 (or timeline header height) with no additional vertical padding or blank space between the timeline ruler and the first lane.

### Requirement: Swimlane styling

The canvas SHALL show location-labeled swimlanes with alternating backgrounds and separators aligned to lane height. Swimlane backgrounds SHALL extend infinitely to the right, rendering only the visible portion, and location labels SHALL be positioned in a fixed-width gutter to the left of time x=0.

#### Scenario: Location bands

- **WHEN** multiple locations are present
- **THEN** each location band displays its name in a gutter left of x=0 and a distinct background tint that stays aligned while panning/zooming and extends beyond the visible trace duration.

#### Scenario: Infinite horizontal extent

- **WHEN** the user pans or scrolls horizontally
- **THEN** swimlanes continue to render smoothly without a hard right boundary, allowing exploration of future time or whitespace as needed.

## ADDED Requirements

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
