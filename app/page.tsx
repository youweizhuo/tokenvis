import { TraceViewer } from "@/components/trace-viewer";
import { loadTraceById } from "./trace-loader";

const DEFAULT_TRACE_ID = "kitchen-sink";

export default async function Home() {
  const { trace, spans, error } = await loadTraceById(DEFAULT_TRACE_ID);

  return (
    <TraceViewer
      initialTraceId={trace?.id ?? DEFAULT_TRACE_ID}
      initialTraceName={trace?.name ?? null}
      initialSpans={spans}
      initialError={error}
    />
  );
}
