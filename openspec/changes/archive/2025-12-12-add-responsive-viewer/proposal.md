# Change: Responsive three-panel trace viewer layout

## Why
We need an interactive, responsive layout with a foldable left config panel, the canvas centered, and a foldable right details panel for node inspection. This organizes filters, trace info, and details without obscuring the canvas.

## What Changes
- Add a left panel (collapsible) for trace info, agent filters, style presets, time range controls, and TokenVis branding/config.
- Keep the middle panel dedicated to the React Flow canvas.
- Add a collapsible right panel that shows node details when a node is selected.
- Responsive behavior: panels stack or slide on small screens, with quick toggles.

## Impact
- Affected specs: visualization
- Affected code: page layout, panel components, selection handling.
