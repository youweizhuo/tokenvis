## 1. Implementation
- [x] 1.1 Create custom span node renderer with agent color, label hierarchy (agent/location/time) and readable contrast.
- [x] 1.2 Style swimlanes with labeled bands (location name), alternating backgrounds, and lane separators aligned to layout metrics.
- [x] 1.3 Style edges with agent color and light movement animation; ensure stable IDs and performant rendering.
- [x] 1.4 Add a timeline ruler/bar with tick labels (microsecond scale) synced to the layout scale.
- [x] 1.5 Polish page chrome (spacing, controls, legend) to explain colors and interactions.

## 2. Validation
- [x] 2.1 Run lint/tests and visual smoke test in dev server.
- [x] 2.2 Confirm timeline labels align with span positions at default scale.
- [x] 2.3 Run `openspec validate add-visual-polish --strict`.
