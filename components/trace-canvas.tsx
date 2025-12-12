"use client";

import React, { useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { agentColor } from "@/lib/palette";
import { AgentEdge } from "@/components/agent-edge";
import { SpanNode } from "@/components/span-node";
import { useTraceLayout } from "@/lib/use-trace-layout";

type Props = {
  spans: SpanInput[];
  pixelsPerMicrosecond?: number;
  laneHeight?: number;
};

type TimelineTick = { x: number; label: string };

function buildTimeline(spans: SpanInput[], ppu: number): TimelineTick[] {
  if (spans.length === 0) return [];
  const min = Math.min(...spans.map((s) => s.start_time));
  const max = Math.max(...spans.map((s) => s.end_time));
  const range = Math.max(max - min, 1);
  const step = Math.max(Math.floor(range / 6), 1);
  const ticks: TimelineTick[] = [];
  for (let t = min; t <= max + step; t += step) {
    const ms = (t - min) / 1000;
    ticks.push({ x: (t - min) * ppu, label: `${ms.toFixed(0)} ms` });
  }
  return ticks;
}

export function TraceCanvas({
  spans,
  pixelsPerMicrosecond = 0.0001,
  laneHeight = 80,
}: Props) {
  const { nodes, edges, bands, minStart, maxEnd } = useTraceLayout(spans, {
    pixelsPerMicrosecond,
    laneHeight,
  });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const contentWidth =
    (maxEnd - minStart) * pixelsPerMicrosecond * Math.max(zoom, 1) + 400;

  const timelineTicks = useMemo(() => {
    return buildTimeline(spans, pixelsPerMicrosecond * zoom);
  }, [spans, pixelsPerMicrosecond, zoom]);

  const nodeTypes = useMemo(() => ({ spanNode: SpanNode }), []);
  const edgeTypes = useMemo(() => ({ agentEdge: AgentEdge }), []);

  return (
    <div className="relative h-[640px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="pointer-events-none absolute inset-x-6 top-2 z-30 flex items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          {["alice", "bob", "charlie"].map((a) => (
            <span key={a} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: agentColor(a).base }}
              />
              {a}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-0 top-10 z-20 h-10 border-b border-slate-200 bg-white/85 backdrop-blur-sm px-6 pointer-events-none">
        <div className="relative h-full">
          {timelineTicks.map((tick, idx) => (
            <div
              key={`${tick.label}-${idx}`}
            className="absolute top-0 flex flex-col items-center text-[11px] text-slate-500"
            style={{ left: `${tick.x * zoom + pan.x}px` }}
          >
            <div className="h-2 w-[1px] bg-slate-300" />
            <span className="mt-1 whitespace-nowrap">{tick.label}</span>
          </div>
        ))}
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={{ type: "agentEdge" }}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll
        panOnDrag
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
        className="pt-16"
        onMoveEnd={(_, vp) => {
          setZoom(vp.zoom);
          setPan({ x: vp.x, y: vp.y });
        }}
        onMove={(_, vp) => {
          setZoom(vp.zoom);
          setPan({ x: vp.x, y: vp.y });
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap pannable zoomable />
        <Controls showInteractive={false} />

        <div className="pointer-events-none absolute left-0 top-16">
          {bands.map((band, idx) => (
            <div
              key={band.locationId}
              className="absolute left-0 right-0 flex items-center"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom},1)`,
                transformOrigin: "0 0",
                top: band.startLane * laneHeight,
                height: band.laneCount * laneHeight,
                backgroundColor: idx % 2 === 0 ? "#f8fafc" : "#eef2ff",
                borderTop: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
                width: `${contentWidth}px`,
              }}
              aria-hidden
            >
              <span className="ml-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
                {band.locationId}
              </span>
            </div>
          ))}
        </div>
      </ReactFlow>
    </div>
  );
}
