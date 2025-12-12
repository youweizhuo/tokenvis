## 1. Implementation
- [x] 1.1 Add Drizzle config pointing to `sqlite.db` with better-sqlite3 driver.
- [x] 1.2 Create a DB helper that enables WAL and exports a Drizzle client.
- [x] 1.3 Define Drizzle schemas for `traces` and `spans` tables with required columns and indexes (including `spans (trace_id, start_time)`).
- [x] 1.4 Implement a deterministic seed script to populate the kitchen-sink trace (Alice & Bob overlap in “Kitchen”; Charlie moves Kitchen → Office; include a zero-duration span).
- [x] 1.5 Wire npm scripts (`seed`, Drizzle CLI commands like generate/migrate) to run the seed end-to-end and target `sqlite.db`.

## 2. Validation
- [x] 2.1 Run `npm run lint`.
- [x] 2.2 Run `npm run seed` twice to confirm idempotent, deterministic data load.
- [x] 2.3 Run `openspec validate add-drizzle-schema-seed --strict`.
