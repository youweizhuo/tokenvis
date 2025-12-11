# visualization Specification

## Purpose
TBD - created by archiving change add-phase1-visualization. Update Purpose after archive.
## Requirements
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

### Requirement: Modern Canvas Theme
The visualization SHALL render on a dark gradient background with a subtle dotted grid that remains aligned when panning and zooming, keeping dots beneath worldlines and blocks.

#### Scenario: Gradient grid background visible on load
- **WHEN** the user opens the visualization at default zoom
- **THEN** a dark gradient background with a low-contrast dotted grid is visible across the canvas without obscuring blocks or threads.

#### Scenario: Grid stays anchored during navigation
- **GIVEN** the user pans or zooms the canvas
- **WHEN** the viewport moves or scales
- **THEN** the dotted grid and gradient stay consistent (no stretching or drifting relative to canvas space) while worldlines and blocks reposition normally.

### Requirement: Card-Styled Worldlines and Events
The frontend SHALL render worldlines and event blocks as rounded card elements with soft shadows, agent-colored accent borders, and legible text or icon labels inside each event.

#### Scenario: Event block card appearance
- **WHEN** events are displayed
- **THEN** each block has rounded corners, a subtle shadow, an accent border using the owning agent color, and internal label text that contrasts with the block surface.

#### Scenario: Worldline rail styling
- **WHEN** worldlines are drawn
- **THEN** each worldline appears as an elevated rail with the agent's color and a soft glow to separate columns on the dark background.

### Requirement: Enhanced Causal Connector Styling
The frontend SHALL render causal threads with gradient strokes, arrowheads indicating direction, and small markers at branch points to mirror the modern diagram style.

#### Scenario: Direction indicated on connectors
- **GIVEN** an event influences another
- **WHEN** the causal thread is drawn
- **THEN** the stroke uses a gradient between source and target colors and includes an arrowhead pointing to the target event.

#### Scenario: Branch markers for multiple outlinks
- **GIVEN** an event influences two or more targets
- **WHEN** the threads fan out from the source
- **THEN** each thread includes a small marker or label at the split to distinguish the multiple paths without obscuring blocks.

### Requirement: Expose Full Event Internal State
The backend SHALL return complete `internal_state` data for each event and maintain an indexed lookup so context queries do not rescan entire simulations.

#### Scenario: Events endpoint includes internal state
- **WHEN** a client calls `GET /simulations/{id}/events`
- **THEN** every event object in the response includes `internal_state.reasoning_trace`, `internal_state.memories_accessed`, and `internal_state.emotion` populated from stored data.

#### Scenario: Context lookup uses indexed retrieval
- **WHEN** a client calls `GET /events/{event_id}/context`
- **THEN** the handler resolves the event and its causal neighbors via a precomputed map keyed by `event_id` (no full-list scan) and returns HTTP 200 when found or 404 when missing.

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

### Requirement: Focus Mode Dimming
The frontend SHALL provide a focus mode that visually emphasizes the selected event and de-emphasizes other canvas elements.

#### Scenario: Non-selected elements dimmed
- **WHEN** an event is selected
- **THEN** non-selected event blocks, worldlines, and causal threads render at reduced opacity while the selected block and its connected threads remain at full opacity or highlighted.

#### Scenario: Focus mode resets after clearing
- **WHEN** the selection is cleared
- **THEN** all blocks, worldlines, and threads return to normal opacity and styling.

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

