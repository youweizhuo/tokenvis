## 1. Backend
- [x] 1.1 Ensure `/simulations/{id}/events` and `/events/{event_id}/context` return full `internal_state` fields and expose an in-memory event index for O(1) lookup.
- [x] 1.2 Add or update backend tests covering internal_state in responses and context lookup performance assumptions (indexed access, not linear scan).

## 2. Frontend
- [x] 2.1 Add event selection state and block click handling on the canvas.
- [x] 2.2 Create a `DetailPanel` that fetches context for the selected event and displays metadata, content, internal state, and causal neighbors with a close/clear action.
- [x] 2.3 Implement focus mode: highlight the selected block/thread and dim unselected blocks/threads/background; clear dimming when selection is cleared.

## 3. Validation
- [x] 3.1 Add frontend tests (React Testing Library/Konva-friendly) to assert selection toggles, detail data render, and dimming classes/opacity.
- [x] 3.2 Add backend tests for event responses including internal_state and for fast context lookup using the index.
- [x] 3.3 Manual acceptance: click a block in the UI shows detail panel and focus mode matches README Phase 3 acceptance criteria.
