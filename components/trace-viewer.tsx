"use client";

import { useMemo, useState, useEffect } from "react";

import { TraceCanvas } from "@/components/trace-canvas";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpanInput } from "@/lib/layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  traceName: string | null;
  spans: SpanInput[];
  error: string | null;
};

export function TraceViewer({ traceName, spans, error }: Props) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedSpan, setSelectedSpan] = useState<SpanInput | null>(null);

  const agentIds = useMemo(() => {
    return Array.from(new Set(spans.map((s) => s.agent_id)));
  }, [spans]);

  const [agentsState, setAgentsState] = useState<Record<string, boolean>>({});

  // Sync agentsState when agentIds change
  useEffect(() => {
    setAgentsState((prev) => {
      const newState: Record<string, boolean> = {};
      agentIds.forEach((id) => {
        newState[id] = prev[id] ?? true;
      });
      return newState;
    });
  }, [agentIds]);
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
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left panel */}
      {leftOpen && (
        <aside className="relative bg-white w-full lg:w-[300px] lg:flex-shrink-0 border-r border-slate-200 overflow-y-auto">
          <Card className="h-full rounded-none border-0 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    TokenVis
                  </p>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Trace: {traceName ?? "(none)"}
                  </h2>
                  {error && <Badge className="bg-red-100 text-red-700">Error</Badge>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLeftOpen(false)}
                  className="text-slate-600 h-8 w-8 p-0"
                  aria-label="Hide filters"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-slate-600">
                <div className="text-xs font-semibold uppercase text-slate-500">
                  Agents
                </div>
                {agentIds.map((id) => (
                  <label key={id} className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 cursor-pointer"
                      checked={agentsState[id] !== false}
                      onChange={(e) =>
                        setAgentsState((prev) => ({
                          ...prev,
                          [id]: e.target.checked,
                        }))
                      }
                    />
                    <span>{id}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      )}

      {/* Middle panel */}
      <main className="relative flex-1 min-h-screen h-screen">
        <TraceCanvas
          spans={filteredSpans}
          onNodeSelect={onNodeSelect}
          leftOpen={leftOpen}
          onLeftToggle={() => setLeftOpen(true)}
        />
      </main>

      {/* Right panel */}
      {rightOpen && (
        <aside className="relative bg-white w-full lg:w-[300px] lg:flex-shrink-0 border-l border-slate-200 overflow-y-auto">
          <Card className="h-full rounded-none border-0 shadow-none">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-800">
                  Node Details
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRightOpen(false)}
                  className="text-slate-600 h-8 w-8 p-0"
                  aria-label="Hide details"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-slate-700">
              {selectedSpan ? (
                <>
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
                    {(selectedSpan.end_time - selectedSpan.start_time) / 1000} ms
                  </div>
                  {selectedSpan.data && (
                    <pre className="rounded bg-slate-50 p-2 text-xs text-slate-600 overflow-x-auto max-h-96 overflow-y-auto">
                      {JSON.stringify(selectedSpan.data, null, 2)}
                    </pre>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">
                  Select a node to see details.
                </p>
              )}
            </CardContent>
          </Card>
        </aside>
      )}
    </div>
  );
}
