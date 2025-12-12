## ADDED Requirements
### Requirement: Shadcn-based viewer UI
The viewer UI (left controls, right details, legends, toggles) SHALL be built with Shadcn components styled via Tailwind tokens.

#### Scenario: Unified components
- **WHEN** the viewer renders
- **THEN** panels, buttons, badges, inputs, and drawers use Shadcn primitives with consistent styling.

### Requirement: Responsive pane behavior (Shadcn sheets/drawers)
Side panels SHALL collapse on desktop and become Shadcn Sheet/Drawer on mobile, without covering the canvas when closed.

#### Scenario: Mobile sheet
- **WHEN** on a narrow viewport
- **THEN** opening the left or right panel presents a sheet/drawer; closing it restores full canvas width.

### Requirement: Canvas toolbar/legend with Shadcn tokens
Canvas-adjacent UI (legends, timeline badges, toolbar buttons) SHALL use Shadcn Button/Badge/Tooltip components and follow the shared pastel palette.

#### Scenario: Legend styling
- **WHEN** the legend renders
- **THEN** agent badges use Shadcn badge styles with the defined color tokens.
