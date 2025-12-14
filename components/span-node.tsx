"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import React from "react";

import { agentColor, agentGradient } from "@/lib/palette";
import type { SpanInput } from "@/lib/layout";

type SpanNodeData = {
  span: SpanInput;
  lane: number;
};

export function SpanNode({ data }: NodeProps) {
  const { span, lane } = data as SpanNodeData;
  const colors = agentColor(span.agent_id);
  const gradient = agentGradient(span.agent_id);

  const durationUs = span.end_time - span.start_time;
  const durationMs = Math.max(durationUs / 1000, 0);

  return (
    <div
      className="group h-full w-full overflow-hidden rounded-sm border px-3 py-1.5 shadow-sm transition-transform duration-150 hover:shadow-md"
      style={{
        borderColor: colors.base,
        background: gradient,
      }}
    >
      <div className="flex h-full w-full items-center gap-2 overflow-hidden">
        <span
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: colors.dark }}
        />
        <div className="min-w-0 flex-1 overflow-hidden">
          <div className="truncate text-sm font-semibold text-slate-800">
            {span.agent_id} · {span.location_id}
          </div>
          <div className="truncate text-xs text-slate-600">
            {durationMs.toFixed(1)} ms · lane {lane + 1}
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-transparent" />
      <Handle type="target" position={Position.Left} className="!bg-transparent" />
    </div>
  );
}
