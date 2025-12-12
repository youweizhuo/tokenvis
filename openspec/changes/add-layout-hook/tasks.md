## 1. Implementation
- [x] 1.1 Add `useTraceLayout` (or similar) that takes spans and returns memoized React Flow `nodes`/`edges` using the deterministic layout.
- [x] 1.2 Ensure stable IDs and include lane/duration metadata on nodes; edges connect consecutive spans per agent.
- [x] 1.3 Allow configurable layout params (pixels-per-microsecond, lane height) with sensible defaults.
- [x] 1.4 Add a lightweight test/fixture to assert determinism across reruns and that memoization avoids recompute when inputs are unchanged.

## 2. Validation
- [x] 2.1 Run lint/tests.
- [x] 2.2 Run `openspec validate add-layout-hook --strict`.
