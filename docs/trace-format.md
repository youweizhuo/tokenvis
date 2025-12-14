# Trace Format Documentation

> **Note:** This format is subject to change during development.

TokenVis visualizes execution traces from multi-agent systems as a spatial timeline. This document describes the data format and how to seed test data.

## Database Schema

TokenVis uses SQLite with two tables: `traces` and `spans`.

### Traces Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier for the trace (e.g., `"kitchen-sink"`) |
| `name` | TEXT | NOT NULL | Human-readable name (e.g., `"Kitchen Sink Trace"`) |

### Spans Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique identifier for the span |
| `trace_id` | TEXT | NOT NULL, FK → traces.id | Parent trace |
| `agent_id` | TEXT | NOT NULL | Identifier of the agent performing this span |
| `location_id` | TEXT | NOT NULL | Location/region where the span occurs |
| `start_time` | INTEGER | NOT NULL | Start timestamp in **microseconds** |
| `end_time` | INTEGER | NOT NULL | End timestamp in **microseconds** |
| `data` | TEXT (JSON) | nullable | Optional JSON metadata |

**Index:** `spans(trace_id, start_time)` for efficient sweep-line ordering.

## Timestamp Convention

All timestamps are stored as **integers representing microseconds** (μs).

| Value | Duration |
|-------|----------|
| `1_000` | 1 millisecond |
| `1_000_000` | 1 second |
| `60_000_000` | 1 minute |

Example: A span from 2.5s to 7s would have:

- `start_time`: `2_500_000`
- `end_time`: `7_000_000`

### Zero-Duration Spans

Spans where `start_time === end_time` represent instantaneous checkpoints or events. These are valid and will render as minimal-width nodes.

## The `data` Field

The `data` field stores optional JSON metadata about the span. Common patterns:

```json
{
  "label": "Human-readable description",
  "phase": "planning|coding|review|deploy",
  "module": "frontend|backend",
  "pr": "PR-101",
  "env": "staging|production",
  "checkpoint": true
}
```

The visualization currently uses the `label` field for display. Other fields are shown in the details panel when a span is selected.

## Example Span

```json
{
  "id": "wf-coder-a-1",
  "trace_id": "multi-agent-workflow",
  "agent_id": "coder-a",
  "location_id": "code-studio",
  "start_time": 10000000,
  "end_time": 18000000,
  "data": {
    "label": "Frontend scaffolding",
    "phase": "coding",
    "module": "frontend"
  }
}
```

This span represents agent `coder-a` working in `code-studio` from 10s to 18s (8 second duration).

## Seeding Test Data

### Prerequisites

1. Node.js (LTS recommended)
2. Dependencies installed: `npm install`

### Running the Seed Script

```bash
npm run seed
```

This will:

1. Create the SQLite database (`sqlite.db`) if it doesn't exist
2. Enable WAL mode for concurrent access
3. Insert test traces (idempotent - safe to run multiple times)

Expected output:

```text
Seed complete. Database: sqlite.db
Traces seeded:
  - kitchen-sink (Kitchen Sink Trace): 5 spans
  - multi-agent-workflow (Multi-Agent Workflow): 32 spans
```

### Verifying Data

#### Via API

Start the dev server and fetch traces:

```bash
npm run dev
# In another terminal:
curl http://localhost:3000/api/traces
```

Expected response:

```json
[
  {"id": "kitchen-sink", "name": "Kitchen Sink Trace"},
  {"id": "multi-agent-workflow", "name": "Multi-Agent Workflow"}
]
```

Fetch spans for a specific trace:

```bash
curl http://localhost:3000/api/traces/kitchen-sink/spans
```

#### Via SQLite CLI

```bash
sqlite3 sqlite.db "SELECT id, name FROM traces;"
sqlite3 sqlite.db "SELECT COUNT(*) FROM spans WHERE trace_id = 'kitchen-sink';"
```

## Test Traces

### Kitchen Sink Trace (`kitchen-sink`)

A minimal trace for quick sanity checks:

- **Agents:** Alice, Bob, Charlie
- **Locations:** Kitchen, Office
- **Spans:** 5
- **Duration:** ~8ms

Tests: overlapping spans, cross-location movement, zero-duration spans.

### Multi-Agent Workflow (`multi-agent-workflow`)

A larger trace demonstrating realistic patterns:

- **Agents:** Planner, Researcher, Coder-A, Coder-B, Reviewer, Deployer
- **Locations:** Planning Room, Research Lab, Code Studio, Review Bay, Deploy Zone
- **Spans:** ~32
- **Duration:** 60 seconds

Tests: parallel work, sequential handoffs, location revisits, varied durations, checkpoints.

## Troubleshooting

### "database is locked"

SQLite is configured with WAL mode, but if you still see lock errors:

1. Stop any running dev server
2. Run seed again
3. Restart the dev server

### "no such table: traces"

The seed script auto-creates tables. Run `npm run seed` before starting the app.

### Duplicate spans

The seed script is idempotent—it deletes existing test data before inserting. If you see duplicates, check for manual insertions or multiple trace IDs.

## Creating Custom Traces

When adding new test traces:

1. Choose a unique `trace_id` (kebab-case recommended)
2. Add to the `ALL_TRACES` array in `scripts/seed.ts`
3. Create spans with unique IDs (prefix with trace ID recommended)
4. Ensure all spans reference valid `location_id` values
5. Use microsecond timestamps consistently
