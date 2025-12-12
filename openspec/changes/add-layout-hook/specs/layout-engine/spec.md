## ADDED Requirements
### Requirement: Layout hook for React Flow
The system SHALL provide a hook/utility that converts validated spans into React Flow `nodes` and `edges`, using the deterministic layout algorithm and stable IDs.

#### Scenario: Hook returns memoized layout
- **WHEN** a component calls the layout hook with the same spans input
- **THEN** the returned `nodes` and `edges` references remain stable and match the deterministic layout.

### Requirement: Configurable layout parameters
The hook SHALL accept optional layout parameters (pixels-per-microsecond, lane height) with defaults matching the canvas design.

#### Scenario: Custom scaling
- **WHEN** a caller provides custom layout parameters
- **THEN** node positions reflect those parameters while preserving deterministic ordering and IDs.
