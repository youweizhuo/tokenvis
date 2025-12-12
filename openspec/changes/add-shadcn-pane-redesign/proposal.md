# Change: Shadcn/Tailwind pane redesign for responsive viewer

## Why
The new three-panel layout works functionally but needs a cohesive Shadcn + Tailwind visual system and improved pane interactions to feel polished and consistent across breakpoints.

## What Changes
- Adopt Shadcn UI primitives (Sheet/Drawer, Card, Button, Badge, Tabs, Accordion, Slider, Input, Select, Tooltip) for **all** viewer UI surfaces (panes, controls, legends, detail cards).
- Redesign left/right panes with Shadcn components, better spacing/typography, and consistent Tailwind tokens; use Shadcn theming for buttons, toggles, filters, timelines, and badges.
- Improve mobile/desktop behavior: Sheets/Drawers on mobile, collapsible sidebars on desktop, keeping the canvas central.
- Add a small design token map (colors, radii) aligned with the current pastel visual language, implemented via Tailwind + Shadcn theme config.

## Impact
- Affected specs: visualization
- Affected code: pane layout, control components, detail panel UI, supporting styling/tokens.
