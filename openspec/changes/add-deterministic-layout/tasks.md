## 1. Implementation
- [x] 1.1 Add layout utility/hook that consumes spans (with location_id, start_time, end_time) and returns lane indices per location using deterministic greedy sweep-line.
- [x] 1.2 Define explicit tie-breakers (start_time, end_time, agent_id, span id) to guarantee stable ordering across renders and zero-duration spans.
- [x] 1.3 Generate React Flow nodes/edges from layout output with stable IDs and memoization.
- [x] 1.4 Add lightweight benchmark/test covering 1k spans to assert runtime (<50ms target) and deterministic results on repeated runs.

## 2. Validation
- [x] 2.1 Run lint/tests.
- [x] 2.2 Verify deterministic ordering with duplicate runs over the same dataset.
- [x] 2.3 Run `openspec validate add-deterministic-layout --strict`.
