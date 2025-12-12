# Change: Layout hook for React Flow nodes/edges

## Why
We already compute deterministic lane assignments; the UI now needs a hook to convert packed spans into React Flow nodes/edges with stable IDs and memoization so the canvas can render consistently.

## What Changes
- Provide a hook/utility (`useTraceLayout`) that accepts validated spans, runs the deterministic layout, and returns memoized `{nodes, edges}` ready for React Flow.
- Ensure nodes/edges carry stable IDs, span metadata, and layout dimensions (lane height, pixels-per-microsecond).
- Add lightweight verification (unit test or story) to assert stability across renders and preserve performance.

## Impact
- Affected specs: layout-engine
- Affected code: new layout hook utility, tests.
