## ADDED Requirements
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
