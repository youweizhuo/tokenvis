# Change: Add type-safe trace API routes with validation

## Why
The UI needs reliable, typed endpoints to fetch traces and spans from SQLite/Drizzle with validation so downstream code can assume consistent shapes and error handling.

## What Changes
- Expose App Router API routes to list traces and fetch spans for a given trace using the existing Drizzle data layer.
- Validate route params and responses with `zod` to ensure type safety at the boundary.
- Return deterministic JSON payloads suitable for the TraceCanvas (IDs, names, spans with microsecond timestamps and data blob).
- Handle errors with proper HTTP codes (404 for missing trace, 400 for bad input).

## Impact
- Affected specs: trace-api
- Affected code: Next.js API route handlers, validation schemas, possible db helper reuse.
