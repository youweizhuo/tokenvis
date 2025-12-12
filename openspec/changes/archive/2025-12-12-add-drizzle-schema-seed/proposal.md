# Change: Seed kitchen-sink trace and Drizzle SQLite schema

## Why
TokenVis needs a reproducible database baseline so the default page can render the kitchen-sink trace while using the agreed SQLite + Drizzle stack.

## What Changes
- Configure SQLite (better-sqlite3) with WAL enabled and a shared Drizzle `db` helper.
- Define Drizzle schema for `traces` and `spans` matching the project context, including indexes.
- Add a deterministic seed script that builds the kitchen-sink trace (Alice & Bob overlap in “Kitchen”; Charlie moves Kitchen → Office; includes a zero-duration span).
- Wire npm scripts for seeding and Drizzle CLI (e.g., `drizzle-kit generate`/`migrate`) so `npm run seed` and schema tooling target `sqlite.db` consistently.

## Impact
- Affected specs: trace-storage
- Affected code: drizzle config, schema definitions, DB helper, seed script, package scripts.
