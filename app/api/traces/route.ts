import { NextResponse } from "next/server";

import { db } from "@/db";
import { traces } from "@/db/schema";
import { errorSchema, tracesListSchema } from "@/lib/trace-schemas";

export async function GET() {
  try {
    const rows = await db
      .select({ id: traces.id, name: traces.name })
      .from(traces)
      .orderBy(traces.id);

    const parsed = tracesListSchema.parse(rows);
    return NextResponse.json(parsed, { status: 200 });
  } catch {
    const body = errorSchema.parse({
      error: "Failed to list traces",
    });
    return NextResponse.json(body, { status: 500 });
  }
}
