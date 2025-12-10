## 1. Backend (FastAPI)
- [x] 1.1 Scaffold FastAPI app with `/simulations/{id}/agents` and `/simulations/{id}/events` (chronological order).
- [x] 1.2 Add in-memory/SQLite seed using `example_trace.json` for `sim_coffee_shop_001`.
- [x] 1.3 Write pytest coverage for the two endpoints (status 200, sorted timestamps, expected agent list).

## 2. Frontend (React + Konva)
- [x] 2.1 Set up React 18 + TypeScript project with Konva and Zustand store.
- [x] 2.2 Fetch agents/events from backend and store in state.
- [x] 2.3 Render fixed-spacing agent columns (worldlines) and event blocks colored by type with duration-derived heights.
- [x] 2.4 Implement mouse-wheel zoom and drag-to-pan on the canvas.

## 3. Validation
- [x] 3.1 Smoke-test rendering of the seed simulation: see 3 agent columns with blocks and working zoom/pan.
- [x] 3.2 Run backend + frontend test suites and linting (when configured).
