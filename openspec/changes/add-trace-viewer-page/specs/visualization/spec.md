## ADDED Requirements
### Requirement: Root trace viewer page
The root route (`/`) SHALL render the trace viewer using the existing layout and canvas components, showing the active trace name and basic instructions.

#### Scenario: Default seeded load
- **WHEN** the app is started after running `npm run seed`
- **THEN** visiting `/` shows the kitchen-sink trace on the canvas with its name visible.

### Requirement: Status and error states
The viewer SHALL display clear states for loading, missing data, or errors and guide the user to seed data if empty.

#### Scenario: Empty database
- **WHEN** no trace data exists
- **THEN** the page shows a message telling the user to run `npm run seed` and does not crash.

### Requirement: Basic controls
The viewer SHALL provide minimal controls to refresh/reload data and identify the currently displayed trace.

#### Scenario: Refresh control
- **WHEN** the user triggers a refresh action
- **THEN** the viewer reloads data and updates the canvas without requiring a full page reload.
