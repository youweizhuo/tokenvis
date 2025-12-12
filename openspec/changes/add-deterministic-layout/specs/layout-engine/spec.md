## ADDED Requirements
### Requirement: Deterministic sweep-line lane assignment
The system SHALL assign lane indices per location using a deterministic greedy sweep-line that never changes ordering for the same input spans (including across renders and page reloads).

#### Scenario: Stable overlap ordering
- **WHEN** multiple spans overlap within the same location
- **THEN** lane assignment remains identical across repeated runs, using tie-breakers of `start_time`, then `end_time`, then `agent_id`, then `id`.

### Requirement: Zero-duration span handling
The layout algorithm SHALL place zero-duration spans without causing overlap instability or errors.

#### Scenario: Zero-duration span
- **WHEN** a span has `start_time == end_time`
- **THEN** it is assigned a lane consistently using the same deterministic tie-breakers.

### Requirement: Performance target
The layout algorithm SHALL process at least 1,000 spans in under 50 ms on the main thread for typical laptop hardware.

#### Scenario: 1k span run
- **WHEN** the layout runs on 1,000 spans
- **THEN** it completes within 50 ms measured in a simple benchmark harness.

### Requirement: React Flow node/edge stability
The system SHALL produce React Flow nodes and edges with stable IDs derived from span identities so rerenders do not reorder or recreate nodes unnecessarily.

#### Scenario: Stable node IDs
- **WHEN** the same spans are rendered twice
- **THEN** the generated React Flow node and edge IDs are identical between runs.
