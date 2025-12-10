## ADDED Requirements

### Requirement: Serve Simulation Agents and Events
The system SHALL provide REST endpoints to retrieve agents and events for a simulation, ordered by time for deterministic rendering.

#### Scenario: Fetch agents for a simulation
- **WHEN** a client calls `GET /simulations/{id}/agents`
- **THEN** it returns HTTP 200 with an array of agents containing `agent_id`, `name`, and `color`.

#### Scenario: Fetch events ordered by timestamp
- **WHEN** a client calls `GET /simulations/{id}/events`
- **THEN** it returns HTTP 200 with events sorted ascending by `timestamp` and including `duration_ms`, `event_type`, `location`, `content`, and causal fields if present.

### Requirement: Render Agent Worldlines and Event Blocks
The frontend SHALL display each agent as a vertical worldline with events drawn as blocks positioned by time and sized by duration.

#### Scenario: Show three agents with blocks
- **GIVEN** the seeded `sim_coffee_shop_001` data
- **WHEN** the user loads the visualization
- **THEN** three agent columns appear, each showing colored event blocks aligned to its worldline.

#### Scenario: Block sizing by duration
- **WHEN** events are rendered
- **THEN** each block's height is proportional to `duration_ms` with a minimum of 16px and maximum of 200px.

### Requirement: Color Encoding by Event Type
The frontend SHALL color event blocks according to type: perception (blue `#3B82F6`), cognition (purple `#A855F7`), action (green `#10B981`), error (red `#EF4444`).

#### Scenario: Event colors match type
- **WHEN** events are displayed
- **THEN** each block uses the palette above based on its `event_type`.

### Requirement: Canvas Navigation (Zoom and Pan)
The visualization SHALL support mouse-wheel zoom and drag-to-pan to explore the timeline.

#### Scenario: Zoom with mouse wheel
- **WHEN** the user scrolls the mouse wheel over the canvas
- **THEN** the canvas zooms in/out centered on the cursor position while maintaining event placement relative to worldlines.

#### Scenario: Pan with drag
- **WHEN** the user click-drags the canvas background
- **THEN** the viewport pans without changing zoom, keeping event geometry intact.
