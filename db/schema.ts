import { integer, sqliteTable, text, index } from "drizzle-orm/sqlite-core";

export const traces = sqliteTable("traces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const spans = sqliteTable(
  "spans",
  {
    id: text("id").primaryKey(),
    traceId: text("trace_id")
      .notNull()
      .references(() => traces.id),
    agentId: text("agent_id").notNull(),
    locationId: text("location_id").notNull(),
    startTime: integer("start_time").notNull(),
    endTime: integer("end_time").notNull(),
    data: text("data", { mode: "json" }).$type<unknown | null>(),
  },
  (table) => ({
    traceStartIdx: index("spans_trace_start_idx").on(
      table.traceId,
      table.startTime,
    ),
  }),
);
