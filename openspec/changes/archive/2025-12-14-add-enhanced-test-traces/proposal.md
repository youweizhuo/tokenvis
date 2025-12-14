# Change: Add enhanced test traces with documentation and UI selector

## Why

The current "kitchen-sink" trace is too simple for meaningful visualization testing:

- Only 3 agents (Alice, Bob, Charlie) with 5 spans
- Only 2 locations (Kitchen, Office)
- Total duration of 8ms is too short

Additionally, there is no documentation explaining the trace data format or how to seed the database. Users and developers need:

1. Larger, more realistic test traces that stress-test layout and rendering
2. Documentation describing the trace/span schema and seed process
3. A UI mechanism to switch between multiple test traces without re-seeding

## What Changes

### 1. Enhanced Test Traces (scripts/seed.ts)

- Keep existing "kitchen-sink" trace for quick sanity checks
- Add a larger "multi-agent-workflow" trace with:
    - 5-8 agents with distinct roles (e.g., Planner, Researcher, Coder, Reviewer, etc.)
    - 4-6 locations/regions (e.g., Planning Room, Research Lab, Code Studio, Review Bay, etc.)
    - 30-50 spans over a longer duration (e.g., 60 seconds in microseconds)
    - Complex patterns: overlapping work, sequential handoffs, agents revisiting locations, parallel work
- Ensure all traces have unique IDs and descriptive names

### 2. Trace Format Documentation (docs/trace-format.md)

- Document the `traces` and `spans` table schema
- Explain field meanings (especially `start_time`/`end_time` in microseconds)
- Describe the `data` JSON field and conventions
- Provide example span payloads
- Explain how to run `npm run seed` and verify data
- Note that trace format is subject to change during development

### 3. Trace Selector in Left Panel

- Add a trace selector dropdown/list to the left control panel
- Fetch available traces via the existing `/api/traces` endpoint
- Allow switching traces without page reload (client-side navigation or state update)
- Default to "kitchen-sink" if no trace is selected (backward compatible)
- Show trace name in the header when selected

## Impact

- **Affected specs:** trace-storage (seed data requirements), visualization (left panel controls)
- **Affected code:**
    - `scripts/seed.ts` – add new trace definitions
    - `docs/trace-format.md` – new documentation file
    - `components/trace-viewer-shell.tsx` or left panel component – add trace selector
    - `app/page.tsx` or routing – support loading arbitrary traces
    - Possibly `app/trace-loader.ts` – generalize to load any trace by ID

## Non-Goals

- Importing custom traces from external files (future work)
- Trace editing or deletion UI
- Real-time trace streaming
