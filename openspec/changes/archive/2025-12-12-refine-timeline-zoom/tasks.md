## 1. Implementation
- [x] 1.1 Make timeline bar fixed-position but scale its tick spacing with current zoom so labels stay aligned to spans.
- [x] 1.2 Ensure node widths remain proportional to duration under zoom (reuse layout scale, disable unintended auto-fit).
- [x] 1.3 Bind swimlane band transforms to canvas zoom/pan so bands move and scale with nodes, keeping spans in their lanes.
- [x] 1.4 Add a quick zoom/pan smoke test and visual check for alignment.

## 2. Validation
- [x] 2.1 Run lint/tests.
- [x] 2.2 Manual verify: zoom in/out and pan; timeline ticks, nodes, and lane bands stay aligned and spans remain in correct lanes.
- [x] 2.3 Run `openspec validate refine-timeline-zoom --strict`.
