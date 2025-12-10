## ADDED Requirements
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

### Requirement: Focus Mode Dimming
The frontend SHALL provide a focus mode that visually emphasizes the selected event and de-emphasizes other canvas elements.

#### Scenario: Non-selected elements dimmed
- **WHEN** an event is selected
- **THEN** non-selected event blocks, worldlines, and causal threads render at reduced opacity while the selected block and its connected threads remain at full opacity or highlighted.

#### Scenario: Focus mode resets after clearing
- **WHEN** the selection is cleared
- **THEN** all blocks, worldlines, and threads return to normal opacity and styling.
