import { TraceViewer } from "@/components/trace-viewer";
import { loadKitchenSinkTrace } from "./trace-loader";

export default async function Home() {
  const { trace, spans, error } = await loadKitchenSinkTrace();

  return (
    <main className="flex min-h-screen flex-col items-center bg-slate-50 px-6 py-12 text-slate-900">
      <TraceViewer traceName={trace?.name ?? null} spans={spans} error={error} />
    </main>
  );
}
