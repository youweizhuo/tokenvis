## 1. Implementation
- [x] 1.1 Add shared zod schemas/types for trace and span API payloads (microsecond timestamps, data blob).
- [x] 1.2 Implement GET `/api/traces` to list available traces from Drizzle, using validation and stable ordering.
- [x] 1.3 Implement GET `/api/traces/[id]/spans` to fetch spans for a trace with validation and 404 on missing trace.
- [x] 1.4 Ensure handlers use the existing Drizzle client and return JSON matching schemas; include error handling for invalid input.

## 2. Validation
- [x] 2.1 Run `npm run lint`.
- [x] 2.2 Hit endpoints locally (or write a minimal integration check) to confirm JSON matches schema and 404/400 paths behave.
- [x] 2.3 Run `openspec validate add-trace-api --strict`.
