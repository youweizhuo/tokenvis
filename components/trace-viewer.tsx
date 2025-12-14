"use client";

import { useMemo, useState, useEffect, useCallback } from "react";

import { TraceCanvas } from "@/components/trace-canvas";
import { TraceSelector } from "@/components/trace-selector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpanInput } from "@/lib/layout";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  initialTraceId: string | null;
  initialTraceName: string | null;
  initialSpans: SpanInput[];
  initialError: string | null;
};

export function TraceViewer({
  initialTraceId,
  initialTraceName,
  initialSpans,
  initialError,
}: Props) {
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedSpan, setSelectedSpan] = useState<SpanInput | null>(null);

  // Trace state
  const [traceId, setTraceId] = useState<string | null>(initialTraceId);
  const [traceName, setTraceName] = useState<string | null>(initialTraceName);
  const [spans, setSpans] = useState<SpanInput[]>(initialSpans);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState(false);

  const loadTrace = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    setSelectedNodeId(null);
    setSelectedSpan(null);

    try {
      // Fetch trace info
      const tracesRes = await fetch("/api/traces");
      if (!tracesRes.ok) throw new Error("Failed to fetch traces");
      const tracesData = await tracesRes.json();
      const trace = tracesData.find((t: { id: string }) => t.id === id);

      if (!trace) {
        setError(`Trace "${id}" not found`);
        setSpans([]);
        setTraceName(null);
        return;
      }

      // Fetch spans
      const spansRes = await fetch(`/api/traces/${id}/spans`);
      if (!spansRes.ok) throw new Error("Failed to fetch spans");
      const spansData = await spansRes.json();

      setTraceId(id);
      setTraceName(trace.name);
      setSpans(spansData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load trace");
      setSpans([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTraceSelect = useCallback(
    (id: string) => {
      if (id !== traceId) {
        loadTrace(id);
      }
    },
    [traceId, loadTrace]
  );

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
                    {traceName ?? "No trace selected"}
                  </h2>
                  {loading && (
                    <Badge className="bg-blue-100 text-blue-700">Loading...</Badge>
                  )}
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
              {/* Trace selector */}
              <TraceSelector
                selectedTraceId={traceId}
                onTraceSelect={handleTraceSelect}
              />

              {/* Agent filters */}
              <div className="space-y-2 text-sm text-slate-600">
                <div className="text-xs font-semibold uppercase text-slate-500">
                  Agents
                </div>
                {agentIds.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No agents in trace</p>
                ) : (
                  agentIds.map((id) => (
                    <label
                      key={id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 px-2 py-1 rounded"
                    >
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
                  ))
                )}
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
