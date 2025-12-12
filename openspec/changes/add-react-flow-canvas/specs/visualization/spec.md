## ADDED Requirements
### Requirement: React Flow canvas rendering
The system SHALL render spans as React Flow nodes and edges using the deterministic layout output, with pan/zoom enabled by default.

#### Scenario: Canvas renders seeded trace
- **WHEN** the default page loads with the kitchen-sink trace
- **THEN** nodes and edges appear on the canvas with the correct positions and connections.

### Requirement: Swimlane backgrounds
The canvas SHALL display lane-level backgrounds grouped by location so spans within the same location share a visible horizontal band.

#### Scenario: Lane tinting
- **WHEN** multiple locations exist
- **THEN** each location’s lanes share a consistent background tint/stripe that remains stable while panning/zooming.

### Requirement: Readable node labels
Rendered nodes SHALL show concise labels (e.g., agent and location) so users can identify spans without hovering.

#### Scenario: Label visibility
- **WHEN** a node is visible on the canvas
- **THEN** its label is readable against the lane background in both light and dark themes.
