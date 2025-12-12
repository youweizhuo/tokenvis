"use client";

import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import React from "react";

import { TraceCanvas } from "@/components/trace-canvas";
import { SpanInput } from "@/lib/layout";

type Props = {
  traceName: string | null;
  spans: SpanInput[];
  error: string | null;
};

export function TraceViewerShell({ traceName, spans, error }: Props) {
  const router = useRouter();

  const hasData = spans.length > 0;

  return (
    <div className="w-full max-w-6xl space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">TokenVis</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Spatial Timeline
          </h1>
          <p className="text-sm text-slate-600">
            {traceName ? `Trace: ${traceName}` : "Trace: (not found)"}
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.refresh()}
          className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh data
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : hasData ? (
        <TraceCanvas spans={spans} />
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
          No spans found. Run{" "}
          <code className="font-mono text-slate-800">npm run seed</code> and
          refresh to load the kitchen-sink trace.
        </div>
      )}
    </div>
  );
}

