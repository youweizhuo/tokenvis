"use client";

import { useEffect, useState } from "react";

type Trace = {
  id: string;
  name: string;
};

type Props = {
  selectedTraceId: string | null;
  onTraceSelect: (traceId: string) => void;
};

export function TraceSelector({ selectedTraceId, onTraceSelect }: Props) {
  const [traces, setTraces] = useState<Trace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTraces() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/traces");
        if (!res.ok) {
          throw new Error("Failed to fetch traces");
        }
        const data = await res.json();
        setTraces(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load traces");
      } finally {
        setLoading(false);
      }
    }

    fetchTraces();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase text-slate-500">
          Trace
        </div>
        <div className="h-9 animate-pulse rounded-md bg-slate-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase text-slate-500">
          Trace
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="text-xs text-slate-600 underline hover:text-slate-900"
        >
          Retry
        </button>
      </div>
    );
  }

  if (traces.length === 0) {
    return (
      <div className="space-y-2">
        <div className="text-xs font-semibold uppercase text-slate-500">
          Trace
        </div>
        <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          No traces available. Run{" "}
          <code className="rounded bg-slate-200 px-1 font-mono text-xs">
            npm run seed
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="trace-select"
        className="text-xs font-semibold uppercase text-slate-500"
      >
        Trace
      </label>
      <select
        id="trace-select"
        value={selectedTraceId ?? ""}
        onChange={(e) => onTraceSelect(e.target.value)}
        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition hover:border-slate-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        {traces.map((trace) => (
          <option key={trace.id} value={trace.id}>
            {trace.name}
          </option>
        ))}
      </select>
    </div>
  );
}
