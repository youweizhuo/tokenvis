## Context
Phase 3 adds interactive inspection of events. Backend already serves events and context but does linear scans per request. Frontend renders canvas without selection or details.

## Goals / Non-Goals
- Goals: fast context lookup; clickable blocks; detail panel with event + causal neighbor data; focus-mode dimming.
- Non-Goals: new persistence layer, pagination, or live updates; accessibility beyond basic keyboard focus is out of scope for this phase.

## Decisions
- Build an in-memory index `{event_id -> (simulation_id, event)}` when loading simulations so `/events/{event_id}/context` can retrieve the event and neighbors without scanning lists.
- Reuse existing endpoints; ensure both `/simulations/{id}/events` and context responses include full `internal_state` fields.
- Add a small Zustand store for selection (`selectedEventId`, setters); fetch context via React Query keyed by `selectedEventId`; keep data cached while selected.
- Render a `DetailPanel` docked to the right; clicking a block sets selection, clicking empty space or a close button clears it.
- Apply focus mode by lowering opacity of non-selected blocks/worldlines/threads and boosting the selected block/connected threads.

## Risks / Trade-offs
- Large simulations could still have heavy context payloads; mitigate by reusing cached data and keeping lookups indexed.
- Canvas opacity changes might impact performance if many nodes; we will minimize re-renders by deriving opacity in memoized selectors.

## Migration Plan
- Add index build during simulation load; wire context endpoint to the map.
- Introduce selection store and detail panel; adjust canvas rendering for focus mode.
- Validate with existing example trace and automated tests.

## Open Questions
- Should we debounce repeated clicks on the same event to avoid extra fetches? (Default: rely on React Query caching.)
