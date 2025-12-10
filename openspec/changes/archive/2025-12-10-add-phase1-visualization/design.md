## Context
Phase 1 targets the minimal ChronoMesh experience: static visualization of a seeded simulation with navigation. No live ingestion or causal threads yet.

## Goals / Non-Goals
- Goals: serve agents/events over REST; render worldlines + event blocks; enable zoom/pan; adhere to color/size rules from README.
- Non-Goals: causal threads, detail panel, focus mode, production DB hardening, WebGL rendering.

## Decisions
- **Backend shape:** FastAPI with two read endpoints; SQLite or in-memory store seeded from `example_trace.json` keeps setup light.
- **Ordering:** Events returned sorted by `timestamp` ascending to avoid frontend sorting complexity.
- **Rendering:** Use Konva on a single canvas layer; fixed column spacing (≈200px) and width (≈140px) per README to keep layout deterministic.
- **Navigation:** Wheel-based zoom centered on cursor and drag pan stored in viewport state; avoids global scroll coupling.

## Risks / Trade-offs
- Canvas performance: seed data is small, so a single layer is fine; may need layer splitting later.
- Time scaling: using duration→height heuristic (ms/50px, clamped) could distort very long events; acceptable for MVP.

## Open Questions
- Do we need CORS/config toggles for local dev vs. deployed backend? (Assume yes for now.)
- Should the API support pagination before live data? (Deferring; not needed for seed.)
