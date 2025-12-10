# Change: Enhance visualization aesthetic

## Why
Current UI is functional but flat; the request is to match the polished, diagram-like look from the reference (card-style nodes, dark grid background, glowing connectors) so the visualization feels modern and legible.

## What Changes
- Refresh the canvas theme with a dark gradient plus subtle dotted grid that stays aligned during pan/zoom.
- Restyle worldlines and event blocks as card-like capsules with soft corners, shadows, and accent borders keyed to agent colors.
- Update causal connectors with glow/arrow styling and small markers to clarify directionality and branching.
- Harmonize typography and badges in the top bar to match the new visual language.

## Impact
- Affected specs: visualization
- Affected code: frontend canvas styling (App.tsx, style.css, related constants/hooks)
