import { performance } from "node:perf_hooks";

import { computeDeterministicLayout } from "../lib/layout";

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSpans(count: number) {
  const rand = mulberry32(42);
  const spans = [];
  const locations = ["kitchen", "office", "lab", "hall", "roof"];
  const agents = ["alice", "bob", "charlie"];

  for (let i = 0; i < count; i += 1) {
    const start = Math.floor(rand() * 10_000_000);
    const duration = Math.max(0, Math.floor(rand() * 2_000_000) - 200_000);
    const end = start + duration;
    spans.push({
      id: `s-${i}`,
      trace_id: "bench-trace",
      agent_id: agents[i % agents.length],
      location_id: locations[i % locations.length],
      start_time: start,
      end_time: end,
      data: null,
    });
  }

  // include a guaranteed zero-duration span
  spans[0].end_time = spans[0].start_time;

  return spans;
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function main() {
  const spans = buildSpans(1_000);

  const t1 = performance.now();
  const run1 = computeDeterministicLayout(spans);
  const t2 = performance.now();

  const run2 = computeDeterministicLayout(spans);

  const durationMs = t2 - t1;

  assert(
    durationMs < 50,
    `Layout exceeded 50ms target: ${durationMs.toFixed(2)}ms`,
  );

  assert(
    JSON.stringify(run1) === JSON.stringify(run2),
    "Layout output not deterministic between runs",
  );

  console.log(
    `Layout ok: ${run1.spans.length} spans, ${durationMs.toFixed(2)}ms, deterministic`,
  );
}

main();
