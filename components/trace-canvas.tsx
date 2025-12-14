"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Panel,
  ViewportPortal,
  useReactFlow,
  PanOnScrollMode,
  type Viewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { AgentEdge } from "@/components/agent-edge";
import { SpanNode } from "@/components/span-node";
import { Button } from "@/components/ui/button";
import { SpanInput } from "@/lib/layout";
import { useTraceLayout } from "@/lib/use-trace-layout";
import { defaultCanvasConfig } from "@/lib/canvas-config";
import { ChevronRight, Maximize, Minus, Plus, RotateCcw } from "lucide-react";

type Props = {
  spans: SpanInput[];
  pixelsPerMicrosecond?: number;
  laneHeight?: number;
  onNodeSelect?: (id: string | null, span: SpanInput | null) => void;
  leftOpen?: boolean;
  onLeftToggle?: () => void;
  onTimeScaleChange?: (ppu: number) => void;
};

type TimelineTick = { x: number; label: string };

const { layout, zoom: zoomConfig, extent, timeline, background } = defaultCanvasConfig;

function buildTimeline(rangeUs: number, ppu: number, desiredTicks = timeline.desiredTimelineTicks): TimelineTick[] {
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
  pixelsPerMicrosecond: initialPpu = layout.pixelsPerMicrosecond,
  laneHeight = layout.laneHeight,
  onNodeSelect,
  leftOpen = true,
  onLeftToggle,
  onTimeScaleChange,
}: Props) {
  // Time scale state for horizontal-only zoom (like DevTools/Perfetto)
  const [timeScale, setTimeScale] = useState(initialPpu);
  const containerRef = useRef<HTMLDivElement>(null);

  // Controlled viewport to prevent auto-centering
  // Start with x offset to show swimlane labels in gutter
  const [viewport, setViewport] = useState<Viewport>({ x: layout.gutterWidth, y: 0, zoom: 1 });
  const hasInitialized = useRef(false);

  // Handle viewport changes from user panning
  // Lock Y at 0 and zoom at 1 - only allow horizontal (X) panning
  const handleViewportChange = useCallback((newViewport: Viewport) => {
    setViewport({ x: newViewport.x, y: 0, zoom: 1 });
  }, []);

  // Force viewport to show gutter after React Flow initializes
  const handleInit = useCallback(() => {
    // Small delay to let React Flow finish its internal setup
    setTimeout(() => {
      setViewport({ x: layout.gutterWidth, y: 0, zoom: 1 });
      hasInitialized.current = true;
    }, 50);
  }, []);

  // Zoom bounds for time scale
  const minTimeScale = initialPpu * zoomConfig.minZoom;
  const maxTimeScale = initialPpu * zoomConfig.maxZoom;

  const { nodes, edges, bands, minStart, maxEnd } = useTraceLayout(spans, {
    pixelsPerMicrosecond: timeScale,
    laneHeight,
  });

  const reactFlow = useReactFlow();
  const headerOffset = layout.headerOffset;
  const gutterWidth = layout.gutterWidth;

  const traceDurationUs = Math.max(maxEnd - minStart, 1);
  const worldWidth = Math.max(
    traceDurationUs * timeScale * extent.worldWidthMultiplier,
    extent.minWorldWidth
  );
  const extentMin = { x: -gutterWidth, y: 0 };

  const maxLaneIndex =
    bands.length === 0
      ? 0
      : Math.max(...bands.map((band) => band.startLane + band.laneCount));
  const totalHeight = Math.max(maxLaneIndex * laneHeight, laneHeight);
  const extentMax = {
    x: worldWidth,
    y: totalHeight + headerOffset,
  };

  const timelineTicks = useMemo(() => {
    return buildTimeline(traceDurationUs, timeScale);
  }, [traceDurationUs, timeScale]);

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

  // Horizontal-only zoom: change time scale, keep lane heights fixed
  const handleHorizontalZoom = useCallback((delta: number, clientX?: number) => {
    setTimeScale((prev) => {
      const factor = delta > 0 ? 1.15 : 0.87; // ~15% zoom per step
      const newScale = Math.min(maxTimeScale, Math.max(minTimeScale, prev * factor));

      // Adjust viewport.x to zoom toward mouse position
      if (clientX !== undefined && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseXInContainer = clientX - rect.left;
        const worldXAtMouse = (mouseXInContainer - viewport.x) / prev;
        const newWorldX = worldXAtMouse * newScale;
        const newViewportX = mouseXInContainer - newWorldX;

        setViewport((v) => ({ ...v, x: newViewportX }));
      }

      onTimeScaleChange?.(newScale);
      return newScale;
    });
  }, [maxTimeScale, minTimeScale, viewport.x, onTimeScaleChange]);

  // Custom wheel handler for horizontal zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    // Only horizontal zoom on Ctrl/Cmd + scroll, otherwise let React Flow pan
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      event.stopPropagation();
      handleHorizontalZoom(-event.deltaY, event.clientX);
    }
  }, [handleHorizontalZoom]);

  // Zoom controls
  const handleFitToTrace = useCallback(() => {
    // Reset time scale and viewport to show gutter
    setTimeScale(initialPpu);
    onTimeScaleChange?.(initialPpu);
    setViewport({ x: gutterWidth, y: 0, zoom: 1 });
  }, [initialPpu, onTimeScaleChange, gutterWidth]);

  const handleFitToSelection = useCallback(() => {
    const selectedNodes = reactFlow.getNodes().filter((n) => n.selected);
    if (selectedNodes.length > 0) {
      // Calculate X position to center selection horizontally, keep Y at 0
      const bounds = selectedNodes.reduce(
        (acc, node) => ({
          minX: Math.min(acc.minX, node.position.x),
          maxX: Math.max(acc.maxX, node.position.x + (node.measured?.width ?? 100)),
        }),
        { minX: Infinity, maxX: -Infinity }
      );
      const centerX = (bounds.minX + bounds.maxX) / 2;
      const containerWidth = containerRef.current?.getBoundingClientRect().width ?? 800;
      setViewport({ x: containerWidth / 2 - centerX, y: 0, zoom: 1 });
    }
  }, []);

  const handleZoomIn = useCallback(() => {
    handleHorizontalZoom(1);
  }, [handleHorizontalZoom]);

  const handleZoomOut = useCallback(() => {
    handleHorizontalZoom(-1);
  }, [handleHorizontalZoom]);

  const handleResetZoom = useCallback(() => {
    setTimeScale(initialPpu);
    onTimeScaleChange?.(initialPpu);
    setViewport({ x: gutterWidth, y: 0, zoom: 1 });
  }, [initialPpu, onTimeScaleChange, gutterWidth]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case "0":
          handleFitToTrace();
          break;
        case "=":
        case "+":
          handleZoomIn();
          break;
        case "-":
          handleZoomOut();
          break;
        case "f":
          if (!e.metaKey && !e.ctrlKey) {
            handleFitToSelection();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFitToTrace, handleFitToSelection, handleZoomIn, handleZoomOut]);

  // Calculate zoom percentage based on time scale
  const zoomPercentage = Math.round((timeScale / initialPpu) * 100);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[640px] w-full overflow-hidden border border-slate-200 bg-white shadow-sm"
      onWheel={handleWheel}
    >
      <div className="absolute inset-x-0 top-0 z-20 h-10 border-b border-slate-200 bg-white/90 backdrop-blur-sm pointer-events-none">
        <div className="relative h-full">
          {timelineTicks.map((tick, idx) => {
            // Align tick with React Flow coordinate system: tick.x is world position, viewport.x is pan offset
            const left = tick.x + viewport.x;
            return (
              <div
                key={`tick-${tick.x}-${idx}`}
                className="absolute top-0 flex flex-col items-start text-[11px] text-slate-500"
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
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnDrag
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Free}
        viewport={viewport}
        onViewportChange={handleViewportChange}
        onInit={handleInit}
        minZoom={1}
        maxZoom={1}
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
        <Background variant={BackgroundVariant.Dots} gap={background.backgroundGap} size={1} />

        {/* Horizontal zoom controls (DevTools/Perfetto style) */}
        <Panel position="bottom-left" className="flex items-center gap-1 rounded-md bg-white/95 p-1 shadow-md ring-1 ring-slate-200 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="h-7 w-7 p-0"
            title="Zoom out time axis (-)"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-[3.5rem] text-center text-xs font-medium text-slate-600" title="Time scale (Ctrl/Cmd + scroll to adjust)">
            {zoomPercentage}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="h-7 w-7 p-0"
            title="Zoom in time axis (+)"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <div className="mx-1 h-4 w-px bg-slate-200" />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="h-7 w-7 p-0"
            title="Reset zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFitToTrace}
            className="h-7 w-7 p-0"
            title="Fit to trace (0)"
          >
            <Maximize className="h-3.5 w-3.5" />
          </Button>
        </Panel>

        <ViewportPortal>
          <div className="pointer-events-none absolute left-0 top-0 -z-10">
            {/* Time zero reference line */}
            <div
              className="absolute bg-slate-400"
              style={{
                left: 0,
                top: headerOffset,
                width: "1px",
                height: totalHeight,
              }}
              aria-hidden
            />

            {bands.map((band, idx) => (
              <div key={band.locationId}>
                {/* Swimlane background extending infinitely */}
                <div
                  className="absolute"
                  style={{
                    left: -gutterWidth,
                    top: band.startLane * laneHeight + headerOffset,
                    height: band.laneCount * laneHeight,
                    width: worldWidth + gutterWidth,
                    backgroundColor: idx % 2 === 0 ? "#f8fafc" : "#eef2ff",
                    borderTop: "1px solid #e2e8f0",
                    borderBottom: "1px solid #e2e8f0",
                  }}
                  aria-hidden
                />

                {/* Location label in gutter */}
                <div
                  className="absolute flex items-center justify-end"
                  style={{
                    left: -gutterWidth,
                    top: band.startLane * laneHeight + headerOffset,
                    height: band.laneCount * laneHeight,
                    width: gutterWidth - 8,
                  }}
                  aria-hidden
                >
                  <span
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200"
                  >
                    {band.locationId}
                  </span>
                </div>
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
