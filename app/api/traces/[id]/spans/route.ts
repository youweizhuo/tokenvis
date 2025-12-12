import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { spans, traces } from "@/db/schema";
import {
  errorSchema,
  spansListSchema,
  traceIdParamSchema,
} from "@/lib/trace-schemas";

type RouteContext = {
  params: unknown;
};

export async function GET(_request: Request, context: RouteContext) {
  const paramsResult = traceIdParamSchema.safeParse(context.params);
  if (!paramsResult.success) {
    const body = errorSchema.parse({ error: "Invalid trace id" });
    return NextResponse.json(body, { status: 400 });
  }

  const traceId = paramsResult.data.id;

  try {
    const trace = await db
      .select({ id: traces.id })
      .from(traces)
      .where(eq(traces.id, traceId))
      .limit(1);

    if (trace.length === 0) {
      const body = errorSchema.parse({ error: "Trace not found" });
      return NextResponse.json(body, { status: 404 });
    }

    const rows = await db
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
      .where(eq(spans.traceId, traceId))
      .orderBy(spans.startTime);

    const parsed = spansListSchema.parse(rows);
    return NextResponse.json(parsed, { status: 200 });
  } catch {
    const body = errorSchema.parse({ error: "Failed to fetch spans" });
    return NextResponse.json(body, { status: 500 });
  }
}
