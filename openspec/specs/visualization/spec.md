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
The timeline bar SHALL remain fixed at the top while its ticks scale with the current zoom so labels stay aligned to span positions.

#### Scenario: Zoomed timeline
- **WHEN** the user zooms in or out
- **THEN** the timeline ticks shift/scale to remain aligned with nodes while the bar itself stays fixed.

### Requirement: Duration-proportional nodes under zoom
Node widths SHALL stay proportional to span durations at any zoom level (no squashing/stretching artifacts).

#### Scenario: Proportional width
- **WHEN** zoom changes
- **THEN** node widths still reflect `(end_time - start_time)` at the scaled pixel-per-microsecond ratio.

### Requirement: Lanes stay bound to spans
Swimlane bands SHALL translate/scale with canvas zoom/pan so spans remain within their location lanes.

#### Scenario: Lane alignment on pan/zoom
- **WHEN** the user pans or zooms
- **THEN** lane backgrounds move/scale with nodes and spans never leave their lanes.

