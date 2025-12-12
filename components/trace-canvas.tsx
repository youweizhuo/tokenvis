"use client";

import React, { useMemo } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ViewportPortal,
  useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AgentEdge } from "@/components/agent-edge";
import { SpanNode } from "@/components/span-node";
import { Button } from "@/components/ui/button";
import { SpanInput } from "@/lib/layout";
import { useTraceLayout } from "@/lib/use-trace-layout";
import { ChevronRight } from "lucide-react";

type Props = {
  spans: SpanInput[];
  pixelsPerMicrosecond?: number;
  laneHeight?: number;
  onNodeSelect?: (id: string | null, span: SpanInput | null) => void;
  leftOpen?: boolean;
  onLeftToggle?: () => void;
};

type TimelineTick = { x: number; label: string };

function buildTimeline(rangeUs: number, ppu: number, desiredTicks = 6): TimelineTick[] {
  if (rangeUs <= 0) return [];
  const step = Math.max(Math.floor(rangeUs / desiredTicks), 1);
  const ticks: TimelineTick[] = [];
  for (let t = 0; t <= rangeUs + step; t += step) {
    const ms = t / 1000;
    ticks.push({ x: t * ppu, label: `${ms.toFixed(0)} ms` });
  }
  return ticks;
}

function TraceCanvasInner({
  spans,
  pixelsPerMicrosecond = 0.0001,
  laneHeight = 80,
  onNodeSelect,
  leftOpen = true,
  onLeftToggle,
}: Props) {
  const { nodes, edges, bands, minStart, maxEnd } = useTraceLayout(spans, {
    pixelsPerMicrosecond,
    laneHeight,
  });

  const viewport = useViewport();
  const headerOffset = 40;

  const traceDurationUs = Math.max(maxEnd - minStart, 1);
  const worldWidth = Math.max(traceDurationUs * pixelsPerMicrosecond, 400);
  const horizontalPadding = 200;
  const verticalPadding = 80;
  const extentMin = { x: -horizontalPadding, y: -verticalPadding };

  const maxLaneIndex =
    bands.length === 0
      ? 0
      : Math.max(...bands.map((band) => band.startLane + band.laneCount));
  const totalHeight = Math.max(maxLaneIndex * laneHeight, laneHeight);
  const extentMax = {
    x: worldWidth + horizontalPadding,
    y: totalHeight + verticalPadding + headerOffset,
  };

  const timelineTicks = useMemo(() => {
    return buildTimeline(traceDurationUs, pixelsPerMicrosecond, 7);
  }, [traceDurationUs, pixelsPerMicrosecond]);

  const shiftedNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        position: { x: n.position.x, y: n.position.y + headerOffset },
      })),
    [nodes, headerOffset],
  );

  const nodeTypes = useMemo(() => ({ spanNode: SpanNode }), []);
  const edgeTypes = useMemo(() => ({ agentEdge: AgentEdge }), []);

  return (
    <div className="relative h-full min-h-[640px] w-full overflow-hidden border border-slate-200 bg-white shadow-sm">
      <div className="absolute inset-x-0 top-0 z-20 h-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm px-6 pointer-events-none">
        <div className="relative h-full">
          {timelineTicks.map((tick, idx) => {
            const left = tick.x * viewport.zoom + viewport.x;
            return (
              <div
                key={`tick-${tick.x}-${idx}`}
                className="absolute top-0 flex flex-col items-center text-[11px] text-slate-500"
                style={{ left: `${left}px` }}
              >
                <div className="h-2 w-[1px] bg-slate-300" />
                <span className="mt-1 whitespace-nowrap">{tick.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <ReactFlow
        nodes={shiftedNodes}
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
        minZoom={0.25}
        maxZoom={2.5}
        translateExtent={[
          [extentMin.x, extentMin.y],
          [extentMax.x, extentMax.y],
        ]}
        proOptions={{ hideAttribution: true }}
        className="pt-12"
        onNodeClick={(_, node) => {
          const span = (node.data as { span?: SpanInput })?.span;
          onNodeSelect?.(node.id, span ?? null);
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <MiniMap pannable zoomable />
        <Controls showInteractive={false} />

        <ViewportPortal>
          <div className="pointer-events-none absolute left-0 top-0 -z-10">
            {bands.map((band, idx) => (
              <div
                key={band.locationId}
                className="absolute flex items-center"
                style={{
                  top: band.startLane * laneHeight + headerOffset,
                  height: band.laneCount * laneHeight,
                  width: worldWidth,
                  backgroundColor: idx % 2 === 0 ? "#f8fafc" : "#eef2ff",
                  borderTop: "1px solid #e2e8f0",
                  borderBottom: "1px solid #e2e8f0",
                }}
                aria-hidden
              >
                <span
                  className="ml-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-200"
                  style={{
                    transform: `translate(8px, 8px) scale(${1 / viewport.zoom})`,
                    transformOrigin: "0 0",
                  }}
                >
                  {band.locationId}
                </span>
              </div>
            ))}
          </div>
        </ViewportPortal>
      </ReactFlow>

      {!leftOpen && onLeftToggle && (
        <div className="absolute left-3 top-14 z-30">
          <Button
            variant="outline"
            size="sm"
            onClick={onLeftToggle}
            className="shadow-md bg-white hover:bg-slate-50"
            aria-label="Show filters"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function TraceCanvas(props: Props) {
  return (
    <ReactFlowProvider>
      <TraceCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
