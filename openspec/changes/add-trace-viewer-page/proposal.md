# Change: Build trace viewer page at root route

## Why
The project now has data, layout, and canvas pieces; we need a cohesive root-page experience that loads example data, renders the viewer, and can be validated by running the service.

## What Changes
- Compose the trace viewer at `/` using the React Flow canvas and seeded kitchen-sink trace.
- Add UI chrome (header, controls) to show the active trace, basic instructions, and load status/error states.
- Provide a simple “example load” path so running the dev server immediately shows the seeded trace.

## Impact
- Affected specs: visualization
- Affected code: root page composition, data loading glue, light UI for statuses.
