# Change: Phase 4 Polish & Deploy

## Why
Phase 4 items in the README (timeline control, loading/error UX, responsive layout, performance, deployable demo) are not yet captured in specs, blocking a clean implementation and release-ready experience.

## What Changes
- Add a timeline scrubber control to navigate simulation time.
- Provide loading states for agents/events/context requests.
- Make the detail panel responsive (sidebar on desktop, overlay on narrow screens).
- Add visible error handling with retry for API failures.
- Render only visible events/threads to improve performance on large traces.
- Ship a demo configuration seeded with the example simulation.

## Impact
- Affected specs: visualization
- Affected code: frontend timeline/top bar, canvas rendering/virtualization, detail panel layout, API error/loading handling, demo seed data and start scripts.
