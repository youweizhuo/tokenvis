## ADDED Requirements
### Requirement: Timeline aligned with zoom
The timeline bar SHALL remain fixed at the top while its ticks scale with the current zoom so labels stay aligned to span positions.

#### Scenario: Zoomed timeline
- **WHEN** the user zooms in or out
- **THEN** the timeline ticks shift/scale to remain aligned with nodes while the bar itself stays fixed.

### Requirement: Duration-proportional nodes under zoom
Node widths SHALL stay proportional to span durations at any zoom level (no squashing/stretching artifacts).

#### Scenario: Proportional width
- **WHEN** zoom changes
- **THEN** node widths still reflect `(end_time - start_time)` at the scaled pixel-per-microsecond ratio.

### Requirement: Lanes stay bound to spans
Swimlane bands SHALL translate/scale with canvas zoom/pan so spans remain within their location lanes.

#### Scenario: Lane alignment on pan/zoom
- **WHEN** the user pans or zooms
- **THEN** lane backgrounds move/scale with nodes and spans never leave their lanes.
