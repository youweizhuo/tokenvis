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

type PositionedSpan = SpanInput & {
  /** Global lane index (includes location offset). */
  lane: number;
  /** Lane index within its location group. */
  laneLocal: number;
  locationOffset: number;
};

export type LocationBand = {
  locationId: string;
  startLane: number;
  laneCount: number;
};

export type LayoutResult = {
  spans: PositionedSpan[];
  bands: LocationBand[];
  minStart: number;
  maxEnd: number;
};

/**
 * Deterministic greedy sweep-line lane assignment by location.
 */
export function computeDeterministicLayout(input: SpanInput[]): LayoutResult {
  const validSpans = input.map((span) => spanInputSchema.parse(span));
  const minStart = Math.min(...validSpans.map((s) => s.start_time));
  const maxEnd = Math.max(...validSpans.map((s) => s.end_time));

  const byLocation = new Map<string, SpanInput[]>();
  for (const span of validSpans) {
    const list = byLocation.get(span.location_id) ?? [];
    list.push(span);
    byLocation.set(span.location_id, list);
  }

  const positioned: PositionedSpan[] = [];
  const bands: LocationBand[] = [];

  const sortedLocations = Array.from(byLocation.keys()).sort();
  let baseLane = 0;

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
    let maxLocalLane = -1;

    for (const span of spans) {
      const start = span.start_time - minStart;
      const end = span.end_time - minStart;

      let lane = laneEndTimes.findIndex((laneEnd) => laneEnd <= start);
      if (lane === -1) {
        lane = laneEndTimes.length;
        laneEndTimes.push(end);
      } else {
        laneEndTimes[lane] = end;
      }
      maxLocalLane = Math.max(maxLocalLane, lane);

      positioned.push({
        ...span,
        lane: baseLane + lane,
        laneLocal: lane,
        locationOffset: baseLane,
        start_time: start,
        end_time: end,
      });
    }

    bands.push({
      locationId,
      startLane: baseLane,
      laneCount: maxLocalLane + 1,
    });

    baseLane += maxLocalLane + 1;
  }

  return { spans: positioned, bands, minStart, maxEnd };
}

export type FlowNode = {
  id: string;
  position: { x: number; y: number };
  style?: React.CSSProperties;
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
): {
  nodes: FlowNode[];
  edges: FlowEdge[];
  bands: LocationBand[];
  minStart: number;
  maxEnd: number;
} {
  const { spans: positioned, bands, minStart, maxEnd } =
    computeDeterministicLayout(spans);
  const ppu = options.pixelsPerMicrosecond ?? 0.0001;
  const laneHeight = options.laneHeight ?? 80;

  const nodes: FlowNode[] = positioned.map((span) => {
    const width = Math.max((span.end_time - span.start_time) * ppu, 12);
    return {
      id: `span-${span.id}`,
      position: {
        x: span.start_time * ppu,
        y: span.lane * laneHeight,
      },
      style: {
        width,
        height: Math.max(laneHeight * 0.72, 36),
      },
      data: {
        span,
        lane: span.lane,
        duration: span.end_time - span.start_time,
      },
      type: "spanNode",
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
        data: { agent_id: source.agent_id },
      });
    }
  }

  return { nodes, edges, bands, minStart, maxEnd };
}
