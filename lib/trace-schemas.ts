import { z } from "zod";

export const traceSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const tracesListSchema = z.array(traceSchema);

export const spanSchema = z.object({
  id: z.string().min(1),
  trace_id: z.string().min(1),
  agent_id: z.string().min(1),
  location_id: z.string().min(1),
  start_time: z.number().int(),
  end_time: z.number().int(),
  data: z.any().nullable(),
});

export const spansListSchema = z.array(spanSchema);

export const errorSchema = z.object({
  error: z.string(),
});

export const traceIdParamSchema = z.object({
  id: z.string().min(1),
});
