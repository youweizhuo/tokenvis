## 1. Backend Causality
- [x] 1.1 Add a causal link builder that computes `caused_by` and `influences` for events on load/ingest (previous same-agent + recent cross-agent interactions heuristic).
- [x] 1.2 Ensure `GET /simulations/{id}/events` returns events with populated causal edges and stable ordering.
- [x] 1.3 Add `GET /events/{event_id}/context` returning the event plus its causal neighbors; return 404 for missing IDs.
- [x] 1.4 Add backend tests covering link generation and the context endpoint using the seeded simulation.

## 2. Frontend Threads
- [x] 2.1 Extend API client/store to fetch causal edges and context data.
- [x] 2.2 Render Bezier curves for each influence relation with gradient coloring from source to target agent colors.
- [x] 2.3 Apply zoom-based opacity scaling for threads to reduce clutter when zoomed out; add component tests/snapshots for thread rendering.

## 3. Validation
- [x] 3.1 Run backend + frontend test suites.
- [x] 3.2 Run `openspec validate add-phase2-causality-display --strict` and fix any issues.
