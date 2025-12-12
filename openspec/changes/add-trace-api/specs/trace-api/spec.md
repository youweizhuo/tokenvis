## ADDED Requirements
### Requirement: List traces API
The system SHALL provide a GET `/api/traces` endpoint that returns all traces ordered deterministically with each item containing `id` (text) and `name` (text).

#### Scenario: Successful list
- **WHEN** a client calls `GET /api/traces`
- **THEN** the response is HTTP 200 with JSON matching the validated schema and includes every trace in the database sorted by `id`.

### Requirement: Trace spans API
The system SHALL provide a GET `/api/traces/{traceId}/spans` endpoint that returns spans for the given trace, each with `id`, `agent_id`, `location_id`, `start_time`, `end_time`, and `data` fields; timestamps are integers in microseconds.

#### Scenario: Successful fetch
- **WHEN** a client calls `GET /api/traces/{traceId}/spans` for an existing trace
- **THEN** the response is HTTP 200 with JSON validated by `zod`, containing spans for that trace ordered by `start_time`.

#### Scenario: Trace not found
- **WHEN** a client calls `GET /api/traces/{traceId}/spans` for a missing trace
- **THEN** the response is HTTP 404 with a JSON error payload validated by `zod`.

### Requirement: Input/output validation
All API routes SHALL validate inputs (route params) and outputs using `zod`, returning HTTP 400 on invalid input and ensuring responses conform to the published schemas.

#### Scenario: Invalid trace ID
- **WHEN** a client calls `GET /api/traces/{traceId}/spans` with an invalid traceId (e.g., empty string or malformed)
- **THEN** the handler returns HTTP 400 with a validated error payload and does not query the database.
