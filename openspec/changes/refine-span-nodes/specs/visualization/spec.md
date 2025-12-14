# visualization Specification (Delta)

## MODIFIED Requirements

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

### Requirement: Left panel contents

The left panel SHALL include TokenVis name, active trace name, and agent filters. Placeholder controls (time range slider, style presets) and minimap toggle SHALL be removed until implemented.

#### Scenario: Controls accessible

- **WHEN** the left panel is open
- **THEN** the TokenVis name, trace name, and agent filter checkboxes are visible and usable without overlapping the canvas.

#### Scenario: No placeholder controls

- **WHEN** the left panel renders
- **THEN** there are no placeholder sliders, disabled buttons, or minimap toggles visible.

## REMOVED Requirements

### Requirement: Minimap toggle in left panel

**Reason**: Minimap feature was removed in a previous change; the toggle control is no longer needed.

**Migration**: Remove the `showMinimap` state and checkbox from the left panel.
