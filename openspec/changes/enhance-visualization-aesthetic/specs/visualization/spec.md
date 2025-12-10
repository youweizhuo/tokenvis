## ADDED Requirements
### Requirement: Modern Canvas Theme
The visualization SHALL render on a dark gradient background with a subtle dotted grid that remains aligned when panning and zooming, keeping dots beneath worldlines and blocks.

#### Scenario: Gradient grid background visible on load
- **WHEN** the user opens the visualization at default zoom
- **THEN** a dark gradient background with a low-contrast dotted grid is visible across the canvas without obscuring blocks or threads.

#### Scenario: Grid stays anchored during navigation
- **GIVEN** the user pans or zooms the canvas
- **WHEN** the viewport moves or scales
- **THEN** the dotted grid and gradient stay consistent (no stretching or drifting relative to canvas space) while worldlines and blocks reposition normally.

### Requirement: Card-Styled Worldlines and Events
The frontend SHALL render worldlines and event blocks as rounded card elements with soft shadows, agent-colored accent borders, and legible text or icon labels inside each event.

#### Scenario: Event block card appearance
- **WHEN** events are displayed
- **THEN** each block has rounded corners, a subtle shadow, an accent border using the owning agent color, and internal label text that contrasts with the block surface.

#### Scenario: Worldline rail styling
- **WHEN** worldlines are drawn
- **THEN** each worldline appears as an elevated rail with the agent's color and a soft glow to separate columns on the dark background.

### Requirement: Enhanced Causal Connector Styling
The frontend SHALL render causal threads with gradient strokes, arrowheads indicating direction, and small markers at branch points to mirror the modern diagram style.

#### Scenario: Direction indicated on connectors
- **GIVEN** an event influences another
- **WHEN** the causal thread is drawn
- **THEN** the stroke uses a gradient between source and target colors and includes an arrowhead pointing to the target event.

#### Scenario: Branch markers for multiple outlinks
- **GIVEN** an event influences two or more targets
- **WHEN** the threads fan out from the source
- **THEN** each thread includes a small marker or label at the split to distinguish the multiple paths without obscuring blocks.
