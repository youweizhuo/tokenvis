import { spans, traces } from "@/db/schema";
import { db } from "@/db";

export async function loadKitchenSinkTrace() {
  try {
    const trace = await db
      .select()
      .from(traces)
      .where(traces.id.eq("kitchen-sink"));

    if (trace.length === 0) {
      return { trace: null, spans: [], error: null };
    }

    const spanRows = await db
      .select({
        id: spans.id,
        trace_id: spans.traceId,
        agent_id: spans.agentId,
        location_id: spans.locationId,
        start_time: spans.startTime,
        end_time: spans.endTime,
        data: spans.data,
      })
      .from(spans)
      .where(spans.traceId.eq("kitchen-sink"))
      .orderBy(spans.startTime);

    return { trace: trace[0], spans: spanRows, error: null };
  } catch (error) {
    console.error("Failed to load trace", error);
    return { trace: null, spans: [], error: "Failed to load trace data" };
  }
}
