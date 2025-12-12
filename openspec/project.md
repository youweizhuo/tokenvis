# Project Context

## Purpose

Build **TokenVis**, a high-performance “Spatial Timeline” visualization tool for debugging Multi-Agent Systems. The viewer renders execution traces as a **Swimlane DAG** where:
- **Y-Axis = Space:** Horizontal lanes represent a Location/Room.
- **X-Axis = Time:** Linear mapping of time to pixels.
- **Packing Logic:** Spans within the same Location stack vertically to avoid overlap.
- **Movement:** Agents moving between Locations create cross-lane edges.

## Tech Stack

- **Framework:** Next.js (App Router).
- **Language:** TypeScript (strict).
- **Database:** SQLite via `better-sqlite3`.
- **ORM:** Drizzle ORM.
- **State/Data:** TanStack Query with long-lived caches (`staleTime: Infinity`).
- **UI:** Shadcn UI + Tailwind CSS.
- **Canvas/Graph:** React Flow (`@xyflow/react`).
- **Validation:** `zod` for API surface/schema validation.

## Architecture & Conventions

- **Component roles:** `useTraceLayout` computes `{nodes, edges}`; `TraceCanvas` is a dumb renderer that only consumes those props.
- **Packing algorithm:** Client-side `useMemo` using a **Greedy Sweep-Line**—sort spans by `start_time`, assign first free vertical sub-lane; target 1,000 spans in <50 ms on the main thread. Avoid Web Workers during the prototype.
- **Derived edges:** Not stored; computed at runtime by connecting each agent’s consecutive spans to show cross-lane movement.
- **Determinism:** Layout ordering must be stable across renders/refreshes so relative stacking of agents does not change.
- **Code style:** Functional components (`const Component = () => {}`); hooks use `useName`; components `PascalCase`; files kebab-case (e.g., `trace-viewer.tsx`). Use the `@/` alias for imports.
- **Type safety:** No `any`; prefer precise types. Validate inputs with `zod` when crossing boundaries.

## Data & Persistence

- **Schema authority:**
  - **traces:** `{ id: text, name: text }`
  - **spans:** `{ id: text, trace_id: text, agent_id: text, location_id: text, start_time: integer, end_time: integer, data: json }`
  - Timestamps are **microseconds** (integers); traces are immutable history.
- **SQLite config:** Must enable WAL to avoid “database locked” during concurrent ingest/view.
  ```typescript
  const sqlite = new Database("sqlite.db");
  sqlite.pragma("journal_mode = WAL");
  export const db = drizzle(sqlite);
  ```
- **Indexes:** Create `spans (trace_id, start_time)` to support sweep-line ordering efficiently.
- **No unknown locations:** Every span must reference a valid `location_id`.

## UI / UX Rules

- **Empty states:** If a trace has zero spans, render an “Empty Trace” Shadcn card (not a blank canvas).
- **Seed visualization:** `npm run seed` must generate the kitchen-sink trace and the default page (`http://localhost:3000/`) should render it immediately:
  - Alice & Bob overlap in “Kitchen” (tests stacking).
  - Charlie moves “Kitchen” → “Office” (tests cross-lane edges).
  - Include a zero-duration span (visibility edge case).
- **Visual stability:** Refreshing should keep lane stacking identical (no jitter from non-deterministic ordering).

## Performance Targets

- Lay out 1,000 spans in under 50 ms on the main thread.
- Keep React Flow node/edge IDs stable; memoize layout outputs to avoid unnecessary renders.
- Treat trace data as read-only; cache indefinitely via TanStack Query unless manually invalidated.

## External Dependencies

- **React Flow + Shadcn:** Use official Shadcn components (`npx shadcn@latest add ...`); add custom CSS only when needed for swimlane backgrounds.
- **better-sqlite3:** Exclude from Next.js build optimization via `serverComponentsExternalPackages` in `next.config.ts`.

## Development Workflow

- Prefer Node LTS. Use the lockfile-present package manager (default npm until specified).
- Align scripts with Next.js defaults (`npm run dev`, `npm run build`, `npm run seed`).
- Before writing specs or code, run `openspec list` / `openspec list --specs` to check active capabilities and avoid conflicts.
