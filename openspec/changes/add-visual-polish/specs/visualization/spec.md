## ADDED Requirements
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
