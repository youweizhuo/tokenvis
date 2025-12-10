# Project Context

## Purpose
TokenVis is a spacetime visualization tool for multi-agent LLM systems. It maps agent activity onto worldlines with event blocks and causal threads so developers can see "what caused what" across time, quickly debug agent behavior, and explore reasoning traces.

## Tech Stack
- **Frontend:** React 18 + TypeScript, Konva.js (canvas rendering), Zustand (state), Tailwind CSS (styling), Axios + React Query (data fetching/cache).
- **Backend:** Python 3.11+, FastAPI, SQLAlchemy; SQLite for MVP.
- **Data:** AgentEvent JSON schema with causal links; optional example trace at `example_trace.json` (see README).

## Project Conventions

### Code Style
- TypeScript: strict types, functional React components, hooks for shared logic, Tailwind utility classes for styling.
- Python: Pydantic models for request/response validation, type hints everywhere, FastAPI routers split by domain (events, simulations).
- Naming: kebab-case for files in frontend; snake_case for Python modules; PascalCase for React components and TypeScript interfaces.

### Architecture Patterns
- Visualization metaphor: Minkowski-style worldlines (vertical time), event blocks (agent thoughts/actions), causal threads (curved Beziers) showing influence direction.
- Frontend layout: `MainCanvas` renders worldlines/blocks/threads; `DetailPanel` slides in for selected event context; `TopBar` hosts timeline controls. Fixed column spacing; zoom/pan on canvas.
- Backend pattern: RESTful APIs (`/simulations`, `/events`, `/events/{id}/context`), ingestion endpoint builds causal graph; causal-link builder always links previous same-agent event and recent cross-agent interactions.
- Data model: `AgentEvent` includes timing, type (perception/cognition/action/error), spatial info, internal state traces, and `caused_by`/`influences` edges.

### Testing Strategy
- Backend: Pytest for FastAPI routes and causal-link algorithm (unit + integration against SQLite test DB). Use seed example trace to assert expected links.
- Frontend: React Testing Library for component logic; lightweight Konva canvas rendering checks; end-to-end interaction smoke tests (e.g., Playwright) for selecting events and seeing focus mode.
- CI gate: run backend + frontend test suites and linting before merging (tools not yet configured—set up when CI is added).

### Git Workflow
- Use feature branches off `main`; open PRs for review before merge.
- Prefer Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`) for history clarity.
- Keep changes aligned with OpenSpec: update specs/changes before implementation when behavior shifts.

## Domain Context
- Goal is to reveal causality in multi-agent conversations/simulations. Vertical axis = time; diagonal threads = information flow; opacity highlights causal focus mode when selecting an event.
- Event types mapped to colors: perception (blue), cognition (purple), action (green), error (red). Column width ~150px; height proportional to `duration_ms` (min 16px, max 200px).
- Causal linking heuristics: previous event same agent; recent cross-agent actions (look back ~5s) for perceptions; memory-access provenance when available.

## Important Constraints
- MVP prioritizes simplicity/performance: fixed column spacing, no thread bundling/light-cone visuals, and 2D canvas (no WebGL) for now.
- Progressive disclosure: far/medium/close zoom should reveal more detail without clutter; maintain 60fps rendering target.
- Color palette defined in README; keep accessibility in mind (contrast on dark slate background).

## External Dependencies
- None required beyond listed libraries; backend exposes REST APIs consumed by frontend via Axios/React Query.
- Optional database services: SQLite for local/MVP, PostgreSQL for production.
