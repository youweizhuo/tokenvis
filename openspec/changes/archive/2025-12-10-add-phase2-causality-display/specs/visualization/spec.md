## ADDED Requirements
### Requirement: Compute Causal Links for Events
The system SHALL compute causal links for each simulation on load so every event includes upstream `caused_by` and downstream `influences` references.

#### Scenario: Link previous same-agent event
- **GIVEN** a simulation with at least two events for the same agent ordered by timestamp
- **WHEN** the simulation is loaded
- **THEN** each event after the first for that agent has its immediate predecessor's `event_id` in `caused_by` and the predecessor lists the later event in `influences`.

#### Scenario: Link recent cross-agent interaction
- **GIVEN** an event whose `content.target_agent_id` matches another agent and there is a prior event from that target agent within a 5 second window
- **WHEN** causal links are built
- **THEN** the target agent's prior event is added to the current event's `caused_by`, and the current event's `event_id` is added to that prior event's `influences`.

### Requirement: Provide Event Context Endpoint
The backend SHALL expose `GET /events/{event_id}/context` that returns causal context for a single event.

#### Scenario: Fetch event context successfully
- **WHEN** a client calls `GET /events/{event_id}/context` for an existing event
- **THEN** it returns HTTP 200 with the event object including populated `caused_by` and `influences`, plus resolved neighbor summaries (at least `event_id`, `agent_id`, `timestamp`, `event_type`) for each referenced event.

#### Scenario: Event context not found
- **WHEN** a client calls `GET /events/{event_id}/context` for a missing event
- **THEN** it returns HTTP 404.

### Requirement: Render Causal Threads Between Events
The frontend SHALL render visible causal threads between event blocks using Bezier curves and color gradients while adapting opacity to zoom level.

#### Scenario: Draw gradient threads for causal links
- **GIVEN** events on the canvas where one event's `influences` contains another's `event_id`
- **WHEN** the visualization renders
- **THEN** a Bezier curve connects the source and target block anchors with a gradient from the source agent color to the target agent color.

#### Scenario: Thread opacity scales with zoom
- **WHEN** the user zooms out below the default zoom level
- **THEN** thread opacity is reduced to minimize clutter, and when the user zooms back in to default or closer, thread opacity increases so connections remain legible.
