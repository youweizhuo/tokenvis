"use client";

import { Handle, Position, NodeProps } from "@xyflow/react";
import React from "react";

import { agentColor } from "@/lib/palette";

export function SpanNode({ data }: NodeProps) {
  const { span, lane } = data;
  const colors = agentColor(span.agent_id);

  const durationUs = span.end_time - span.start_time;
  const durationMs = Math.max(durationUs / 1000, 0);

  return (
    <div
      className="group rounded-full border bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200 transition-transform duration-150 hover:shadow-md"
      style={{ borderColor: colors.base }}
    >
      <div className="flex items-center gap-2">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: colors.base }}
        />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-slate-800">
            {span.agent_id} · {span.location_id}
          </span>
          <span className="text-xs text-slate-500">
            {durationMs.toFixed(1)} ms · lane {lane + 1}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-transparent" />
      <Handle type="target" position={Position.Left} className="!bg-transparent" />
    </div>
  );
}
