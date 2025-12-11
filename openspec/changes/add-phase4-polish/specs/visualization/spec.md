## ADDED Requirements
### Requirement: Timeline Scrubber Control
The frontend SHALL provide a timeline scrubber that lets users jump to a specific simulation time and aligns the canvas viewport to that moment.

#### Scenario: Scrub updates viewport
- **WHEN** the user drags or clicks the timeline scrubber handle
- **THEN** the main canvas pans to the corresponding timestamp so the selected moment is centered and the on-screen events update accordingly.

### Requirement: Data Loading States
The frontend SHALL display loading indicators while fetching agents/events data and while retrieving context for a selected event.

#### Scenario: Initial load shows spinner
- **WHEN** the visualization first requests agents and events
- **THEN** a non-blocking loading indicator is shown until data arrives and then it disappears automatically.

#### Scenario: Context fetch shows inline loader
- **WHEN** a user selects an event and the context request is in flight
- **THEN** the detail panel shows an inline spinner or skeleton for the context section until the data is returned.

### Requirement: API Error Handling with Retry
The frontend SHALL surface API failures with clear messaging and offer a retry action without requiring a full page reload.

#### Scenario: Events request fails
- **WHEN** `GET /simulations/{id}/events` returns a non-2xx response or network error
- **THEN** an error banner or toast appears with the failure message and a Retry control, and the user can trigger retry to re-fetch; successful retry clears the error state.

#### Scenario: Context request fails
- **WHEN** `GET /events/{event_id}/context` fails
- **THEN** the detail panel shows an inline error message with a retry button that re-issues the request; the panel remains open.

### Requirement: Visible-Only Rendering
The frontend SHALL virtualize canvas rendering so that only events and threads within the visible viewport (plus a small buffer) are drawn to maintain interactive performance on large simulations.

#### Scenario: Offscreen events not rendered
- **GIVEN** a simulation containing hundreds of events outside the current viewport
- **WHEN** the user pans or zooms the canvas
- **THEN** only events and threads within the visible region (and a buffer) are drawn, keeping interaction responsive without noticeable frame drops.

### Requirement: Demo Seed and Startup Command
The system SHALL provide a runnable demo configuration seeded with the example simulation so users can launch and explore the visualization quickly.

#### Scenario: Demo starts with sample data
- **WHEN** a developer runs the documented demo startup command
- **THEN** the app launches with the example simulation preloaded and accessible in the UI without additional setup.

## MODIFIED Requirements
### Requirement: Event Selection and Detail Panel
The frontend SHALL let users select an event block and reveal a detail panel showing its data and causal context.

#### Scenario: Click opens detail panel with event data
- **WHEN** the user clicks an event block on the canvas
- **THEN** the block becomes selected and a `DetailPanel` appears showing at least the event id, agent name, timestamp, event type, duration, `content.text`, and `internal_state` fields (reasoning trace list, memories accessed, emotion).

#### Scenario: Contextual neighbors displayed
- **WHEN** a selected event has `caused_by` or `influences`
- **THEN** the detail panel lists those neighbor events with their `event_id`, `agent_id`, `timestamp`, and `event_type` using data from the context endpoint.

#### Scenario: Clear selection hides detail panel
- **WHEN** the user clicks empty canvas area or a close/clear control
- **THEN** the selection is cleared and the detail panel disappears.

#### Scenario: Responsive layout adapts to viewport
- **WHEN** the viewport width is below the desktop breakpoint
- **THEN** the detail panel appears as a full-height overlay or bottom sheet, and when the viewport is at or above the breakpoint the panel renders as a right-hand sidebar without obscuring the canvas.
