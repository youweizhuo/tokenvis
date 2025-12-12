import { eq } from "drizzle-orm";

import { db, sqlite } from "../db";
import { spans, traces } from "../db/schema";

type SpanInput = typeof spans.$inferInsert;

const TRACE_ID = "kitchen-sink";

const seedSpans: SpanInput[] = [
  {
    id: "alice-kitchen-1",
    traceId: TRACE_ID,
    agentId: "alice",
    locationId: "kitchen",
    startTime: 0,
    endTime: 5_000_000,
    data: { label: "Alice preps" },
  },
  {
    id: "bob-kitchen-1",
    traceId: TRACE_ID,
    agentId: "bob",
    locationId: "kitchen",
    startTime: 2_000_000,
    endTime: 7_000_000,
    data: { label: "Bob cooking" },
  },
  {
    id: "charlie-kitchen",
    traceId: TRACE_ID,
    agentId: "charlie",
    locationId: "kitchen",
    startTime: 1_000_000,
    endTime: 3_000_000,
    data: { label: "Charlie chats" },
  },
  {
    id: "charlie-office",
    traceId: TRACE_ID,
    agentId: "charlie",
    locationId: "office",
    startTime: 3_500_000,
    endTime: 6_000_000,
    data: { label: "Charlie emails" },
  },
  {
    id: "bob-zero",
    traceId: TRACE_ID,
    agentId: "bob",
    locationId: "kitchen",
    startTime: 8_000_000,
    endTime: 8_000_000,
    data: { label: "Zero-duration check" },
  },
];

function ensureSchema() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS traces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS spans (
      id TEXT PRIMARY KEY,
      trace_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      data TEXT,
      FOREIGN KEY (trace_id) REFERENCES traces(id)
    );
    CREATE INDEX IF NOT EXISTS spans_trace_start_idx ON spans(trace_id, start_time);
  `);
}

function seed() {
  ensureSchema();

  db.transaction((tx) => {
    tx.delete(spans).where(eq(spans.traceId, TRACE_ID)).run();
    tx.delete(traces).where(eq(traces.id, TRACE_ID)).run();

    tx.insert(traces).values({ id: TRACE_ID, name: "Kitchen Sink Trace" }).run();
    tx.insert(spans).values(seedSpans).run();
  });
}

try {
  seed();
  console.log("Seed complete. Database:", sqlite.name);
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
}
