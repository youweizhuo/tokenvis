export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 py-12 text-slate-900">
      <div className="rounded-xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <p className="text-sm font-medium text-slate-500">TokenVis</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Spatial Timeline</h1>
        <p className="mt-3 max-w-xl text-base text-slate-600">
          Bootstrap in progress. This placeholder confirms the Next.js App Router
          scaffold is running with Tailwind and TypeScript.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-700">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          Dev server ready at <code className="font-mono">http://localhost:3000</code>
        </div>
      </div>
    </main>
  );
}
