# Tasks: Add enhanced test traces with documentation and UI selector

## Implementation Checklist

### Phase 1: Enhanced Test Traces

- [x] **1.1** Define "multi-agent-workflow" trace constants in `scripts/seed.ts`
    - Create 6 agents: Planner, Researcher, Coder-A, Coder-B, Reviewer, Deployer
    - Create 5 locations: Planning Room, Research Lab, Code Studio, Review Bay, Deploy Zone
    - Design 40 spans over 60 seconds showing realistic workflow patterns

- [x] **1.2** Implement span generation for complex patterns
    - Overlapping parallel work (e.g., Coder-A and Coder-B in Code Studio simultaneously)
    - Sequential handoffs (Planner → Researcher → Coder → Reviewer)
    - Agent location revisits (Reviewer returns to Code Studio for follow-up)
    - Mix of short and long spans (100ms to 10s)
    - Include at least one zero-duration checkpoint span

- [x] **1.3** Update seed script to insert both traces
    - Ensure idempotent behavior (delete and re-insert)
    - Validate no duplicate trace IDs
    - Log summary of seeded data

### Phase 2: Documentation

- [x] **2.1** Create `docs/trace-format.md` with schema documentation
    - Document `traces` table: `id`, `name` fields
    - Document `spans` table: all fields with types and constraints
    - Explain microsecond timestamp convention
    - Describe `data` JSON field usage and common patterns

- [x] **2.2** Add seeding instructions to documentation
    - Prerequisites (Node.js, dependencies installed)
    - Running `npm run seed`
    - Verifying data with SQLite CLI or API
    - Troubleshooting common issues

- [x] **2.3** Add example payloads and trace design guidance
    - Sample span JSON
    - Guidelines for creating test traces
    - Note about format being subject to change

### Phase 3: Trace Selector UI

- [x] **3.1** Create trace selector component
    - Dropdown or list showing available traces
    - Fetch traces from `/api/traces` endpoint
    - Handle loading and error states
    - Style consistently with existing left panel

- [x] **3.2** Integrate selector into left panel
    - Add below TokenVis header / above agent filters
    - Wire selection to load new trace data
    - Maintain selected trace state across panel toggle

- [x] **3.3** Update page routing/loading for arbitrary traces
    - Generalize `loadKitchenSinkTrace` to `loadTraceById(id)`
    - Support URL parameter or state-based trace selection
    - Default to "kitchen-sink" when no selection

- [x] **3.4** Update header to show selected trace name
    - Display trace name in viewer header
    - Update when trace selection changes

### Phase 4: Verification

- [x] **4.1** Manual testing
    - Seed database and verify both traces appear in selector
    - Switch between traces and confirm canvas updates
    - Test edge cases: empty trace, missing trace ID

- [x] **4.2** Documentation review
    - Verify `docs/trace-format.md` accuracy
    - Test seed instructions from scratch
