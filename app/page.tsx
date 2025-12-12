import { TraceCanvas } from "@/components/trace-canvas";
import { loadKitchenSinkTrace } from "./trace-loader";

export default async function Home() {
  const { trace, spans } = await loadKitchenSinkTrace();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-slate-50 px-6 py-12 text-slate-900">
      <div className="w-full max-w-6xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">TokenVis</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Spatial Timeline</h1>
            <p className="text-sm text-slate-600">
              Seeded trace: {trace?.name ?? "(none seeded)"}
            </p>
          </div>
        </div>

        {spans.length > 0 ? (
          <TraceCanvas spans={spans} />
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-500">
            No spans found. Run <code className="font-mono">npm run seed</code> to load the kitchen-sink trace.
          </div>
        )}
      </div>
    </main>
  );
}
