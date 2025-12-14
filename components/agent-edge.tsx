"use client";

import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";

import { agentColor } from "@/lib/palette";

const dash = {
  animation: "edge-dash 1.4s linear infinite",
  strokeDasharray: "8 6",
};

export function AgentEdge(props: EdgeProps) {
  const [path, labelX, labelY] = getBezierPath(props);
  const { source, data } = props;
  const dataAgentId = typeof data?.agent_id === "string" ? data.agent_id : null;
  const agentId = dataAgentId ?? source.replace("span-", "").split("-")[0];
  const color = agentColor(agentId).base;

  return (
    <>
      <BaseEdge
        path={path}
        style={{
          stroke: color,
          strokeWidth: 2,
          ...dash,
        }}
      />
      <circle cx={labelX} cy={labelY} r={3} fill={color} opacity={0.8} />
    </>
  );
}

