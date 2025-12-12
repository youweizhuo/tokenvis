import { TraceViewer } from "@/components/trace-viewer";
import { loadKitchenSinkTrace } from "./trace-loader";

export default async function Home() {
  const { trace, spans, error } = await loadKitchenSinkTrace();

  return <TraceViewer traceName={trace?.name ?? null} spans={spans} error={error} />;
}
