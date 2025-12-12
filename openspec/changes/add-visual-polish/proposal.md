# Change: Visual polish for trace viewer (nodes, swimlanes, edges, timeline bar)

## Why
The viewer renders data but lacks intentional visual design. We need custom span nodes, clearer swimlane styling, agent-colored animated edges, and timeline labels to make the experience legible and production-ready.

## What Changes
- Design custom span node styles (shape, color, label hierarchy) and agent-based coloring.
- Enhance swimlane backgrounds (location labels, alternating tints, separators) and add a timeline bar with time labels.
- Style edges with agent color and optional movement animation; ensure accessibility and performance.
- Refine overall layout spacing/controls for a polished UX.

## Impact
- Affected specs: visualization
- Affected code: node/edge renderers, canvas styling, timeline overlay, theme tokens.
