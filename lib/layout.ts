import { z } from "zod";

export const spanInputSchema = z.object({
  id: z.string().min(1),
  trace_id: z.string().min(1),
  agent_id: z.string().min(1),
  location_id: z.string().min(1),
  start_time: z.number().int(),
  end_time: z.number().int(),
  data: z.any().optional(),
});

export type SpanInput = z.infer<typeof spanInputSchema>;

const sortKey = (span: SpanInput) => [
  span.start_time,
  span.end_time,
  span.agent_id,
  span.id,
];

type PositionedSpan = SpanInput & { lane: number };

export type LayoutResult = {
  spans: PositionedSpan[];
};

/**
 * Deterministic greedy sweep-line lane assignment by location.
 */
export function computeDeterministicLayout(input: SpanInput[]): LayoutResult {
  const validSpans = input.map((span) => spanInputSchema.parse(span));

  const byLocation = new Map<string, SpanInput[]>();
  for (const span of validSpans) {
    const list = byLocation.get(span.location_id) ?? [];
    list.push(span);
    byLocation.set(span.location_id, list);
  }

  const positioned: PositionedSpan[] = [];

  const sortedLocations = Array.from(byLocation.keys()).sort();

  for (const locationId of sortedLocations) {
    const spans = byLocation.get(locationId)!;
    spans.sort((a, b) => {
      const ak = sortKey(a);
      const bk = sortKey(b);
      for (let i = 0; i < ak.length; i += 1) {
        const diff = ak[i] - bk[i];
        if (diff !== 0) return diff;
      }
      return 0;
    });

    const laneEndTimes: number[] = [];

    for (const span of spans) {
      let lane = laneEndTimes.findIndex((end) => end <= span.start_time);
      if (lane === -1) {
        lane = laneEndTimes.length;
        laneEndTimes.push(span.end_time);
      } else {
        laneEndTimes[lane] = span.end_time;
      }

      positioned.push({ ...span, lane });
    }
  }

  return { spans: positioned };
}

export type FlowNode = {
  id: string;
  position: { x: number; y: number };
  data: {
    span: SpanInput;
    lane: number;
    duration: number;
  };
  type?: string;
};

export type FlowEdge = {
  id: string;
  source: string;
  target: string;
  type?: string;
};

type FlowOptions = {
  pixelsPerMicrosecond?: number;
  laneHeight?: number;
};

/**
 * Convert spans to React Flow nodes/edges with stable IDs.
 */
export function layoutToFlow(
  spans: SpanInput[],
  options: FlowOptions = {},
): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const { spans: positioned } = computeDeterministicLayout(spans);
  const ppu = options.pixelsPerMicrosecond ?? 0.0001;
  const laneHeight = options.laneHeight ?? 80;

  const nodes: FlowNode[] = positioned.map((span) => {
    return {
      id: `span-${span.id}`,
      position: {
        x: span.start_time * ppu,
        y: span.lane * laneHeight,
      },
      data: {
        span,
        lane: span.lane,
        duration: span.end_time - span.start_time,
      },
      type: "default",
    };
  });

  const edges: FlowEdge[] = [];

  const byAgent = new Map<string, PositionedSpan[]>();
  for (const span of positioned) {
    const list = byAgent.get(span.agent_id) ?? [];
    list.push(span);
    byAgent.set(span.agent_id, list);
  }

  for (const [, agentSpans] of byAgent) {
    agentSpans.sort((a, b) => {
      const ak = sortKey(a);
      const bk = sortKey(b);
      for (let i = 0; i < ak.length; i += 1) {
        const diff = ak[i] - bk[i];
        if (diff !== 0) return diff;
      }
      return 0;
    });

    for (let i = 0; i < agentSpans.length - 1; i += 1) {
      const source = agentSpans[i];
      const target = agentSpans[i + 1];
      edges.push({
        id: `edge-${source.id}-${target.id}`,
        source: `span-${source.id}`,
        target: `span-${target.id}`,
        type: "smoothstep",
      });
    }
  }

  return { nodes, edges };
}
