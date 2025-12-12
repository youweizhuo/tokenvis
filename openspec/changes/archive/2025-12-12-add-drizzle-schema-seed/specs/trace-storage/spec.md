## ADDED Requirements
### Requirement: SQLite setup for TokenVis
The system SHALL use a local `sqlite.db` database via `better-sqlite3`, enabling WAL mode on initialization.

#### Scenario: WAL enabled
- **WHEN** the database helper initializes the connection
- **THEN** it sets `journal_mode = WAL` and the database file `sqlite.db` is created if missing.

### Requirement: Drizzle schema for traces and spans
The system SHALL define Drizzle ORM models for `traces` and `spans` tables with the following columns and constraints:
- `traces`: `id` (text, primary key), `name` (text, not null).
- `spans`: `id` (text, primary key), `trace_id` (text, not null, references `traces.id`), `agent_id` (text, not null), `location_id` (text, not null), `start_time` (integer, microseconds), `end_time` (integer, microseconds), `data` (json, optional).
- Index on `spans (trace_id, start_time)` to support sweep-line ordering.

#### Scenario: Schema applies
- **WHEN** Drizzle connects using the schema
- **THEN** both tables exist with the defined columns and the `spans (trace_id, start_time)` index is present.

### Requirement: Deterministic kitchen-sink seed data
The system SHALL provide a seed script invoked by `npm run seed` that populates `sqlite.db` deterministically with a “kitchen-sink” trace covering required visualization cases:
- A single trace (e.g., `kitchen-sink`) with human-friendly name.
- Spans include: overlapping spans for Alice and Bob in “Kitchen”; Charlie moving from “Kitchen” to “Office” across consecutive spans; at least one zero-duration span.
- Seed is idempotent: rerunning replaces or upserts data without duplicates.

#### Scenario: Seed produces expected spans
- **WHEN** `npm run seed` is executed twice
- **THEN** the database contains exactly the deterministic kitchen-sink trace with the overlapping, cross-location, and zero-duration spans present once each, and no duplicate records are created.
