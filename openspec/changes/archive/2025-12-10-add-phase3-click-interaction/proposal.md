# Change: Phase 3 Click Interaction

## Why
Phase 3 of the README roadmap requires users to click an event block to inspect its details with a focused view. The current build renders worldlines and causal threads but lacks selection, detail presentation, and optimized context retrieval. We need to add these interactions to meet the MVP plan.

## What Changes
- Ensure event APIs return full `internal_state` data and keep an indexed lookup so context requests stay fast at scale.
- Add event selection on block click and a `DetailPanel` UI that surfaces event metadata, content, internal state, and causal neighbors.
- Apply a focus mode that highlights the selected event and dims other blocks/threads until the selection is cleared.

## Impact
- Affected specs: visualization
- Affected code: backend `main.py`/`data.py` (context lookup, payload completeness); frontend `App.tsx` plus new detail panel component/state store and canvas styling for focus mode.
