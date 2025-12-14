# visualization Delta Specification

## MODIFIED Requirements

### Requirement: Left panel contents

The left panel SHALL include TokenVis name, active trace name, **trace selector**, and agent filters. The trace selector allows users to switch between available traces in the database.

#### Scenario: Controls accessible

- **WHEN** the left panel is open
- **THEN** the TokenVis name, trace selector, trace name, and agent filter checkboxes are visible and usable without overlapping the canvas.

#### Scenario: No placeholder controls

- **WHEN** the left panel renders
- **THEN** there are no placeholder sliders, disabled buttons, or minimap toggles visible.

## ADDED Requirements

### Requirement: Trace selector in left panel

The left panel SHALL include a trace selector component that:

- Displays a list or dropdown of available traces fetched from `/api/traces`
- Shows trace names with their IDs
- Allows selecting a trace to load its spans into the canvas
- Defaults to "kitchen-sink" trace on initial load for backward compatibility
- Handles loading and error states gracefully

#### Scenario: Trace list displayed

- **WHEN** the left panel opens and traces are available in the database
- **THEN** the trace selector shows all available trace names fetched from the API.

#### Scenario: Trace selection updates canvas

- **WHEN** the user selects a different trace from the selector
- **THEN** the canvas loads and displays the spans for the selected trace without requiring a page reload.

#### Scenario: Default trace selection

- **WHEN** the viewer loads without a specific trace selection
- **THEN** the "kitchen-sink" trace is selected and displayed by default.

#### Scenario: Empty trace list

- **WHEN** no traces exist in the database
- **THEN** the selector displays an appropriate empty state message (e.g., "No traces available. Run npm run seed.").

#### Scenario: API error handling

- **WHEN** the `/api/traces` request fails
- **THEN** the selector displays an error state and allows retry.

### Requirement: Dynamic trace loading

The viewer SHALL support loading any trace by ID, not just the hardcoded "kitchen-sink" trace.

#### Scenario: Load trace by ID

- **WHEN** a trace ID is provided (via selector, URL, or state)
- **THEN** the system fetches spans for that trace ID and renders them on the canvas.

#### Scenario: Invalid trace ID

- **WHEN** a non-existent trace ID is requested
- **THEN** an appropriate error message is displayed and the canvas shows an empty state.

### Requirement: Trace name in header

The viewer header SHALL display the name of the currently selected trace.

#### Scenario: Header shows trace name

- **WHEN** a trace is loaded
- **THEN** the header displays "Trace: {trace_name}" with the selected trace's name.

#### Scenario: Header updates on selection change

- **WHEN** the user switches to a different trace
- **THEN** the header updates to show the newly selected trace's name.
