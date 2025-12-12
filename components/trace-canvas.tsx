"use client";

import React, { useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { layoutToFlow, SpanInput } from "@/lib/layout";
import { useTraceLayout } from "@/lib/use-trace-layout";

type LaneBand = {
  locationId: string;
  y: number;
};

type Props = {
  spans: SpanInput[];
  pixelsPerMicrosecond?: number;
  laneHeight?: number;
};

function computeLaneBands(
  spans: SpanInput[],
  laneHeight: number,
): LaneBand[] {
  const { spans: positioned } = layoutToFlow(spans);

  const byLocation = new Map<string, number>();
  for (const span of positioned) {
    byLocation.set(span.location_id, Math.max(byLocation.get(span.location_id) ?? -1, span.lane));
  }

  const bands: LaneBand[] = [];
  for (const [locationId, maxLane] of byLocation) {
    bands.push({ locationId, y: (maxLane + 1) * laneHeight });
  }
  return bands.sort((a, b) => a.y - b.y);
}

export function TraceCanvas({
  spans,
  pixelsPerMicrosecond = 0.0001,
  laneHeight = 80,
}: Props) {
  const { nodes, edges } = useTraceLayout(spans, {
    pixelsPerMicrosecond,
    laneHeight,
  });

  const bands = useMemo(
    () => computeLaneBands(spans, laneHeight),
    [spans, laneHeight],
  );

  return (
    <div className="h-[600px] w-full rounded-xl border border-slate-200 bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll
        panOnDrag
        fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap pannable zoomable />
        <Controls showInteractive={false} />

        {bands.map((band, idx) => (
          <div
            key={band.locationId}
            className="pointer-events-none absolute left-0 right-0"
            style={{
              top: band.y - laneHeight,
              height: laneHeight,
              backgroundColor: idx % 2 === 0 ? "#f8fafc" : "#eef2ff",
              borderTop: "1px solid #e2e8f0",
              borderBottom: "1px solid #e2e8f0",
            }}
            aria-hidden
          />
        ))}
      </ReactFlow>
    </div>
  );
}

