# Change: Phase 2 Causality Display

## Why
Phase 1 renders static timelines, but the roadmap calls for showing how events influence each other so developers can trace "what caused what" and debug agent behaviors. We need causal data and UI threads to meet the Phase 2 acceptance criteria in README.

## What Changes
- Build a causal link builder that populates `caused_by` and `influences` for each event and use it to seed stored simulations.
- Add a `GET /events/{id}/context` endpoint that returns an event with its causal neighbors for focused inspection.
- Update the frontend canvas to draw Bezier causal threads with gradient coloring and zoom-based opacity so connections stay legible.

## Impact
- Affected specs: visualization
- Affected code: `backend/data.py` (ingestion + links), `backend/main.py` (context endpoint), backend tests; `frontend/src/components/MainCanvas` + thread rendering, API client/store.
