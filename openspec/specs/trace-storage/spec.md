# trace-storage Specification

## Purpose
TBD - created by archiving change add-drizzle-schema-seed. Update Purpose after archive.
## Requirements
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

The system SHALL provide a seed script invoked by `npm run seed` that populates `sqlite.db` deterministically with multiple test traces covering required visualization cases:

- **kitchen-sink trace** (existing): A minimal trace with overlapping spans for Alice and Bob in "Kitchen"; Charlie moving from "Kitchen" to "Office"; at least one zero-duration span.
- **multi-agent-workflow trace** (new): A larger trace demonstrating complex multi-agent patterns:
    - 6 agents: Planner, Researcher, Coder-A, Coder-B, Reviewer, Deployer
    - 5 locations: Planning Room, Research Lab, Code Studio, Review Bay, Deploy Zone
    - 40 spans over 60 seconds of simulated time
    - Patterns: parallel work, sequential handoffs, location revisits, varied durations

Seed is idempotent: rerunning replaces or upserts data without duplicates.

#### Scenario: Seed produces expected kitchen-sink spans

- **WHEN** `npm run seed` is executed
- **THEN** the database contains the "kitchen-sink" trace with overlapping, cross-location, and zero-duration spans present once each.

#### Scenario: Seed produces multi-agent-workflow trace

- **WHEN** `npm run seed` is executed
- **THEN** the database contains the "multi-agent-workflow" trace with 6 distinct agents, 5 locations, and approximately 40 spans spanning 60 seconds.

#### Scenario: Idempotent seeding

- **WHEN** `npm run seed` is executed twice consecutively
- **THEN** no duplicate traces or spans exist; each trace appears exactly once with its expected span count.

### Requirement: Trace format documentation

The system SHALL include a `docs/trace-format.md` file documenting:

- The `traces` table schema (`id`, `name` fields with types)
- The `spans` table schema (all fields with types, constraints, and foreign key relationships)
- Timestamp convention (microseconds as integers)
- The `data` JSON field purpose and common usage patterns
- Instructions for running `npm run seed` and verifying data
- A note that the format is subject to change during development

#### Scenario: Documentation accuracy

- **WHEN** a developer reads `docs/trace-format.md`
- **THEN** they can understand the schema, run the seed script, and verify data exists using the provided instructions.

#### Scenario: Example payloads

- **WHEN** `docs/trace-format.md` is reviewed
- **THEN** it includes at least one complete example span JSON payload.

