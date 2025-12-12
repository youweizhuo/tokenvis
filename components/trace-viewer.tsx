"use client";

import { useMemo, useState } from "react";

import { TraceCanvas } from "@/components/trace-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpanInput } from "@/lib/layout";

type Props = {
  traceName: string | null;
  spans: SpanInput[];
  error: string | null;
};

type AgentFilter = {
  id: string;
  checked: boolean;
};

export function TraceViewer({ traceName, spans, error }: Props) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedSpan, setSelectedSpan] = useState<SpanInput | null>(null);

  const agentFilters = useMemo<AgentFilter[]>(() => {
    const ids = Array.from(new Set(spans.map((s) => s.agent_id)));
    return ids.map((id) => ({ id, checked: true }));
  }, [spans]);

  const [agentsState, setAgentsState] = useState<Record<string, boolean>>(() =>
    agentFilters.reduce((acc, f) => ({ ...acc, [f.id]: true }), {}),
  );
  const filteredSpans = useMemo(
    () => spans.filter((s) => agentsState[s.agent_id] !== false),
    [spans, agentsState],
  );

  const onNodeSelect = (nodeId: string | null, span: SpanInput | null) => {
    setSelectedNodeId(nodeId);
    setSelectedSpan(span);
    if (span && !rightOpen) setRightOpen(true);
  };

  return (
    <div className="flex min-h-[720px] flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="text-base font-semibold text-slate-900">TokenVis</span>
          <Badge variant="secondary">Trace: {traceName ?? "(none)"} </Badge>
          {error && <Badge className="bg-red-100 text-red-700">Error</Badge>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLeftOpen((v) => !v)}>
            {leftOpen ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setRightOpen((v) => !v)}>
            {rightOpen ? "Hide Details" : "Show Details"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3">
        {/* Left panel */}
        <div
          className={`hidden lg:block transition-all ${leftOpen ? "col-span-3" : "col-span-0 hidden"}`}
        >
          {leftOpen && (
            <Card>
              <CardHeader className="pb-0">
                <h3 className="text-sm font-semibold text-slate-800">Filters</h3>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    Agents
                  </div>
                  {agentFilters.map((agent) => (
                    <label key={agent.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300"
                        checked={agentsState[agent.id] !== false}
                        onChange={(e) =>
                          setAgentsState((prev) => ({
                            ...prev,
                            [agent.id]: e.target.checked,
                          }))
                        }
                      />
                      <span>{agent.id}</span>
                    </label>
                  ))}
                </div>

                <div className="space-y-1 text-sm text-slate-600">
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    Time Range
                  </div>
                  <p className="text-xs text-slate-500">
                    (Preset placeholder: future slider / inputs)
                  </p>
                </div>

                <div className="space-y-1 text-sm text-slate-600">
                  <div className="text-xs font-semibold uppercase text-slate-500">
                    Style Preset
                  </div>
                  <p className="text-xs text-slate-500">
                    (Placeholder toggle for light/pastel styles)
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle panel */}
        <div className={`${leftOpen && rightOpen ? "col-span-6" : leftOpen || rightOpen ? "col-span-8" : "col-span-12"} transition-all`}>
          <TraceCanvas
            spans={filteredSpans}
            onNodeSelect={onNodeSelect}
            selectedNodeId={selectedNodeId}
          />
        </div>

        {/* Right panel */}
        <div
          className={`transition-all ${rightOpen ? "col-span-3" : "col-span-0 hidden lg:block lg:col-span-1"}`}
        >
          {rightOpen && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm h-full">
              <h3 className="text-sm font-semibold text-slate-800">
                Node Details
              </h3>
              {selectedSpan ? (
                <div className="mt-3 space-y-2 text-sm text-slate-700">
                  <div>
                    <span className="font-semibold">Agent:</span>{" "}
                    {selectedSpan.agent_id}
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span>{" "}
                    {selectedSpan.location_id}
                  </div>
                  <div>
                    <span className="font-semibold">Start:</span>{" "}
                    {selectedSpan.start_time} μs
                  </div>
                  <div>
                    <span className="font-semibold">End:</span>{" "}
                    {selectedSpan.end_time} μs
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span>{" "}
                    {(selectedSpan.end_time - selectedSpan.start_time) / 1000}{" "}
                    ms
                  </div>
                  {selectedSpan.data && (
                    <pre className="rounded bg-slate-50 p-2 text-xs text-slate-600">
                      {JSON.stringify(selectedSpan.data, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">
                  Select a node to see details.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
