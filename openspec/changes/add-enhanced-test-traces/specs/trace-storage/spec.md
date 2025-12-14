# trace-storage Delta Specification

## MODIFIED Requirements

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

## ADDED Requirements

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
