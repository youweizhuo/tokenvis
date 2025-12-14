import { eq, inArray } from "drizzle-orm";

import { db, sqlite } from "../db";
import { spans, traces } from "../db/schema";

type SpanInput = typeof spans.$inferInsert;

// =============================================================================
// Trace 1: Kitchen Sink (minimal test trace)
// =============================================================================
const KITCHEN_SINK_ID = "kitchen-sink";

const kitchenSinkSpans: SpanInput[] = [
  {
    id: "alice-kitchen-1",
    traceId: KITCHEN_SINK_ID,
    agentId: "alice",
    locationId: "kitchen",
    startTime: 0,
    endTime: 5_000_000,
    data: { label: "Alice preps" },
  },
  {
    id: "bob-kitchen-1",
    traceId: KITCHEN_SINK_ID,
    agentId: "bob",
    locationId: "kitchen",
    startTime: 2_000_000,
    endTime: 7_000_000,
    data: { label: "Bob cooking" },
  },
  {
    id: "charlie-kitchen",
    traceId: KITCHEN_SINK_ID,
    agentId: "charlie",
    locationId: "kitchen",
    startTime: 1_000_000,
    endTime: 3_000_000,
    data: { label: "Charlie chats" },
  },
  {
    id: "charlie-office",
    traceId: KITCHEN_SINK_ID,
    agentId: "charlie",
    locationId: "office",
    startTime: 3_500_000,
    endTime: 6_000_000,
    data: { label: "Charlie emails" },
  },
  {
    id: "bob-zero",
    traceId: KITCHEN_SINK_ID,
    agentId: "bob",
    locationId: "kitchen",
    startTime: 8_000_000,
    endTime: 8_000_000,
    data: { label: "Zero-duration check" },
  },
];

// =============================================================================
// Trace 2: Multi-Agent Workflow (complex test trace)
// =============================================================================
const WORKFLOW_ID = "multi-agent-workflow";

// Agents: Planner, Researcher, Coder-A, Coder-B, Reviewer, Deployer
// Locations: Planning Room, Research Lab, Code Studio, Review Bay, Deploy Zone
// Duration: 60 seconds (60_000_000 microseconds)
// Pattern: Planner kicks off → Researcher gathers info → Coders implement in parallel
//          → Reviewer checks → Deployer ships, with revisits and handoffs

const workflowSpans: SpanInput[] = [
  // === Phase 1: Planning (0-8s) ===
  {
    id: "wf-planner-1",
    traceId: WORKFLOW_ID,
    agentId: "planner",
    locationId: "planning-room",
    startTime: 0,
    endTime: 5_000_000,
    data: { label: "Initial project scoping", phase: "planning" },
  },
  {
    id: "wf-planner-2",
    traceId: WORKFLOW_ID,
    agentId: "planner",
    locationId: "planning-room",
    startTime: 5_500_000,
    endTime: 8_000_000,
    data: { label: "Task breakdown", phase: "planning" },
  },

  // === Phase 2: Research (3-15s, overlaps with late planning) ===
  {
    id: "wf-researcher-1",
    traceId: WORKFLOW_ID,
    agentId: "researcher",
    locationId: "research-lab",
    startTime: 3_000_000,
    endTime: 9_000_000,
    data: { label: "API documentation review", phase: "research" },
  },
  {
    id: "wf-researcher-2",
    traceId: WORKFLOW_ID,
    agentId: "researcher",
    locationId: "research-lab",
    startTime: 9_500_000,
    endTime: 15_000_000,
    data: { label: "Competitor analysis", phase: "research" },
  },
  // Researcher visits planning room briefly
  {
    id: "wf-researcher-3",
    traceId: WORKFLOW_ID,
    agentId: "researcher",
    locationId: "planning-room",
    startTime: 7_000_000,
    endTime: 8_500_000,
    data: { label: "Sync with planner", phase: "research" },
  },

  // === Phase 3: Parallel Coding (10-35s) ===
  // Coder-A works on frontend
  {
    id: "wf-coder-a-1",
    traceId: WORKFLOW_ID,
    agentId: "coder-a",
    locationId: "code-studio",
    startTime: 10_000_000,
    endTime: 18_000_000,
    data: { label: "Frontend scaffolding", phase: "coding", module: "frontend" },
  },
  {
    id: "wf-coder-a-2",
    traceId: WORKFLOW_ID,
    agentId: "coder-a",
    locationId: "code-studio",
    startTime: 18_500_000,
    endTime: 25_000_000,
    data: { label: "Component implementation", phase: "coding", module: "frontend" },
  },
  {
    id: "wf-coder-a-3",
    traceId: WORKFLOW_ID,
    agentId: "coder-a",
    locationId: "code-studio",
    startTime: 26_000_000,
    endTime: 32_000_000,
    data: { label: "UI polish", phase: "coding", module: "frontend" },
  },

  // Coder-B works on backend (parallel with Coder-A)
  {
    id: "wf-coder-b-1",
    traceId: WORKFLOW_ID,
    agentId: "coder-b",
    locationId: "code-studio",
    startTime: 11_000_000,
    endTime: 20_000_000,
    data: { label: "API endpoints", phase: "coding", module: "backend" },
  },
  {
    id: "wf-coder-b-2",
    traceId: WORKFLOW_ID,
    agentId: "coder-b",
    locationId: "code-studio",
    startTime: 20_500_000,
    endTime: 28_000_000,
    data: { label: "Database integration", phase: "coding", module: "backend" },
  },
  {
    id: "wf-coder-b-3",
    traceId: WORKFLOW_ID,
    agentId: "coder-b",
    locationId: "code-studio",
    startTime: 29_000_000,
    endTime: 35_000_000,
    data: { label: "Error handling", phase: "coding", module: "backend" },
  },

  // Coder-A briefly visits research lab
  {
    id: "wf-coder-a-research",
    traceId: WORKFLOW_ID,
    agentId: "coder-a",
    locationId: "research-lab",
    startTime: 25_200_000,
    endTime: 25_800_000,
    data: { label: "Quick API lookup", phase: "coding" },
  },

  // === Phase 4: Code Review (28-45s, overlaps with late coding) ===
  {
    id: "wf-reviewer-1",
    traceId: WORKFLOW_ID,
    agentId: "reviewer",
    locationId: "review-bay",
    startTime: 28_000_000,
    endTime: 34_000_000,
    data: { label: "Frontend code review", phase: "review", pr: "PR-101" },
  },
  {
    id: "wf-reviewer-2",
    traceId: WORKFLOW_ID,
    agentId: "reviewer",
    locationId: "review-bay",
    startTime: 34_500_000,
    endTime: 40_000_000,
    data: { label: "Backend code review", phase: "review", pr: "PR-102" },
  },
  // Reviewer visits code studio to discuss with coders
  {
    id: "wf-reviewer-code-visit",
    traceId: WORKFLOW_ID,
    agentId: "reviewer",
    locationId: "code-studio",
    startTime: 36_000_000,
    endTime: 38_000_000,
    data: { label: "Review discussion with coders", phase: "review" },
  },
  {
    id: "wf-reviewer-3",
    traceId: WORKFLOW_ID,
    agentId: "reviewer",
    locationId: "review-bay",
    startTime: 41_000_000,
    endTime: 45_000_000,
    data: { label: "Integration review", phase: "review", pr: "PR-103" },
  },

  // === Phase 5: Fixes after review (38-48s) ===
  {
    id: "wf-coder-a-fix",
    traceId: WORKFLOW_ID,
    agentId: "coder-a",
    locationId: "code-studio",
    startTime: 38_000_000,
    endTime: 42_000_000,
    data: { label: "Address review comments", phase: "fixes" },
  },
  {
    id: "wf-coder-b-fix",
    traceId: WORKFLOW_ID,
    agentId: "coder-b",
    locationId: "code-studio",
    startTime: 40_000_000,
    endTime: 46_000_000,
    data: { label: "Fix edge cases", phase: "fixes" },
  },

  // === Phase 6: Deployment (44-58s) ===
  {
    id: "wf-deployer-1",
    traceId: WORKFLOW_ID,
    agentId: "deployer",
    locationId: "deploy-zone",
    startTime: 44_000_000,
    endTime: 48_000_000,
    data: { label: "Staging deployment", phase: "deploy", env: "staging" },
  },
  // Zero-duration checkpoint
  {
    id: "wf-deployer-checkpoint",
    traceId: WORKFLOW_ID,
    agentId: "deployer",
    locationId: "deploy-zone",
    startTime: 48_500_000,
    endTime: 48_500_000,
    data: { label: "Staging verified", phase: "deploy", checkpoint: true },
  },
  {
    id: "wf-deployer-2",
    traceId: WORKFLOW_ID,
    agentId: "deployer",
    locationId: "deploy-zone",
    startTime: 49_000_000,
    endTime: 54_000_000,
    data: { label: "Production deployment", phase: "deploy", env: "production" },
  },
  {
    id: "wf-deployer-3",
    traceId: WORKFLOW_ID,
    agentId: "deployer",
    locationId: "deploy-zone",
    startTime: 54_500_000,
    endTime: 58_000_000,
    data: { label: "Post-deploy monitoring", phase: "deploy" },
  },

  // === Cross-cutting: Planner check-ins throughout ===
  {
    id: "wf-planner-checkin-1",
    traceId: WORKFLOW_ID,
    agentId: "planner",
    locationId: "code-studio",
    startTime: 15_000_000,
    endTime: 16_500_000,
    data: { label: "Progress check with coders", phase: "monitoring" },
  },
  {
    id: "wf-planner-checkin-2",
    traceId: WORKFLOW_ID,
    agentId: "planner",
    locationId: "review-bay",
    startTime: 32_000_000,
    endTime: 33_500_000,
    data: { label: "Review progress check", phase: "monitoring" },
  },
  {
    id: "wf-planner-checkin-3",
    traceId: WORKFLOW_ID,
    agentId: "planner",
    locationId: "deploy-zone",
    startTime: 50_000_000,
    endTime: 52_000_000,
    data: { label: "Deployment oversight", phase: "monitoring" },
  },

  // === Researcher support during coding ===
  {
    id: "wf-researcher-support-1",
    traceId: WORKFLOW_ID,
    agentId: "researcher",
    locationId: "code-studio",
    startTime: 16_000_000,
    endTime: 17_500_000,
    data: { label: "Help coders with API questions", phase: "support" },
  },
  {
    id: "wf-researcher-support-2",
    traceId: WORKFLOW_ID,
    agentId: "researcher",
    locationId: "research-lab",
    startTime: 22_000_000,
    endTime: 24_000_000,
    data: { label: "Additional research for edge case", phase: "support" },
  },

  // === Final wrap-up ===
  {
    id: "wf-planner-final",
    traceId: WORKFLOW_ID,
    agentId: "planner",
    locationId: "planning-room",
    startTime: 56_000_000,
    endTime: 60_000_000,
    data: { label: "Project retrospective", phase: "wrap-up" },
  },
  {
    id: "wf-reviewer-final",
    traceId: WORKFLOW_ID,
    agentId: "reviewer",
    locationId: "planning-room",
    startTime: 57_000_000,
    endTime: 60_000_000,
    data: { label: "Review retrospective notes", phase: "wrap-up" },
  },
];

// =============================================================================
// All Traces
// =============================================================================
const ALL_TRACES = [
  { id: KITCHEN_SINK_ID, name: "Kitchen Sink Trace" },
  { id: WORKFLOW_ID, name: "Multi-Agent Workflow" },
];

const ALL_SPANS = [...kitchenSinkSpans, ...workflowSpans];

function ensureSchema() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS traces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS spans (
      id TEXT PRIMARY KEY,
      trace_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      location_id TEXT NOT NULL,
      start_time INTEGER NOT NULL,
      end_time INTEGER NOT NULL,
      data TEXT,
      FOREIGN KEY (trace_id) REFERENCES traces(id)
    );
    CREATE INDEX IF NOT EXISTS spans_trace_start_idx ON spans(trace_id, start_time);
  `);
}

function seed() {
  ensureSchema();

  const traceIds = ALL_TRACES.map((t) => t.id);

  db.transaction((tx) => {
    // Delete existing spans and traces for idempotent seeding
    tx.delete(spans).where(inArray(spans.traceId, traceIds)).run();
    tx.delete(traces).where(inArray(traces.id, traceIds)).run();

    // Insert all traces
    tx.insert(traces).values(ALL_TRACES).run();
    // Insert all spans
    tx.insert(spans).values(ALL_SPANS).run();
  });

  // Log summary
  console.log("Seed complete. Database:", sqlite.name);
  console.log("Traces seeded:");
  for (const t of ALL_TRACES) {
    const count = ALL_SPANS.filter((s) => s.traceId === t.id).length;
    console.log(`  - ${t.id} (${t.name}): ${count} spans`);
  }
}

try {
  seed();
} catch (error) {
  console.error("Seed failed:", error);
  process.exitCode = 1;
}
