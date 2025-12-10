# Change: Implement Phase 1 Core Visualization

## Why
Developers need a minimal, working ChronoMesh view to see agent timelines and debug causality. Phase 1 of the README outlines the MVP: render agent worldlines with event blocks and support basic canvas navigation.

## What Changes
- Deliver backend endpoints to serve simulation agents and events in chronological order.
- Render worldlines and event blocks on a canvas with correct positioning and coloring.
- Add zoom and pan so users can explore the timeline.

## Impact
- Affected specs: `visualization`
- Affected code: frontend canvas renderer, backend simulation/events API
