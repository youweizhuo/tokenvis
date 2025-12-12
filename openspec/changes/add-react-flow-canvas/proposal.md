# Change: React Flow canvas with swimlane backgrounds

## Why
With layout utilities in place, TokenVis needs an actual canvas that renders nodes/edges using React Flow, shows swimlane backgrounds per location, and anchors the default page experience.

## What Changes
- Add a canvas component using React Flow that consumes `useTraceLayout` output, renders nodes/edges, and applies swimlane lane backgrounds keyed by location.
- Provide basic node/edge styles (labels, colors) and pan/zoom controls appropriate for the spatial timeline.
- Integrate the kitchen-sink trace on the default page to visualize seeded data.

## Impact
- Affected specs: visualization
- Affected code: new canvas component, page wiring, styling assets.
