# Change: Implement deterministic span layout algorithm

## Why
TokenVis needs a stable lane assignment so swimlane stacking never jitters between renders and can handle ~1,000 spans quickly. A deterministic greedy sweep-line will guarantee consistent ordering across sessions and tie-breaking for simultaneous spans.

## What Changes
- Implement a client-side greedy sweep-line layout that assigns vertical lane indices per location deterministically (stable sorting + fixed tie-breakers).
- Support edge cases: overlapping spans, zero-duration spans, and consistent ordering for equal start times.
- Expose a typed layout hook/helper that returns `{nodes, edges}` inputs for React Flow using the existing span data shape.
- Add lightweight tests/benchmarks to confirm stability and the 50ms target on 1k spans.

## Impact
- Affected specs: layout-engine
- Affected code: layout hook/utilities, React Flow mapping, tests/bench harness.
