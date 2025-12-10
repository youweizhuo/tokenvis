## Context
Phase 2 adds causal visibility: the backend must populate causal edges for events and expose them via a context endpoint; the frontend must draw threads with readable styling. Seed data currently lacks computed links and the API only serves events/agents.

## Goals / Non-Goals
- Goals: compute simple causal links, expose event context, render threads with zoom-aware readability.
- Non-Goals: live ingestion, probabilistic causality, thread bundling, focus-mode dimming (Phase 3).

## Decisions
- Causal heuristic: link each event to (a) the previous event from the same agent and (b) cross-agent events within a short lookback window (default 5 seconds) when they include a direct interaction (e.g., `content.target_agent_id`).
- Data shape: keep `caused_by` and `influences` as arrays of `event_id` on `AgentEvent`; context endpoint returns the focal event plus resolved neighbor summaries to avoid extra client lookups.
- Rendering: use cubic Bezier curves anchored at block centers; apply a gradient from source agent color to target agent color; set thread opacity proportional to zoom with a floor to avoid invisibility.

## Risks / Trade-offs
- Heuristic may mis-link in dense traces; mitigated by small window and deterministic ordering.
- Added context endpoint could duplicate data; mitigated by returning only minimal neighbor info (id, agent_id, timestamp, type).
- Canvas performance: thread count could grow; start with straightforward rendering and profile before optimizing.

## Open Questions
- Exact lookback duration for cross-agent interactions (starting with 5s from project notes; adjust if tests show better results).
- Whether to include reverse edges in context response or only the focal event; initial plan returns both incoming and outgoing neighbor summaries.
