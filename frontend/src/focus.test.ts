import { describe, it, expect } from "vitest";
import { blockOpacity, buildHighlightIds, threadOpacityFocused, worldlineOpacity } from "./focus";
import { AgentEvent } from "./types";

const makeEvent = (id: string): AgentEvent => ({
  event_id: id,
  agent_id: "agent_a",
  timestamp: "2024-01-01T00:00:00Z",
  duration_ms: 1000,
  event_type: "action",
  location: { room_id: "r", x: 0, y: 0 },
  content: { action_verb: "say", text: "hi", target_agent_id: null },
  internal_state: { reasoning_trace: [], memories_accessed: [], emotion: null },
  caused_by: [],
  influences: [],
});

describe("focus helpers", () => {
  it("buildHighlightIds includes selected and neighbors", () => {
    const ctx = {
      caused_by_events: [makeEvent("c1")],
      influence_events: [makeEvent("i1"), makeEvent("i2")],
      event: makeEvent("sel"),
    };
    const focus = buildHighlightIds("sel", ctx);
    expect(focus.highlightIds.has("sel")).toBe(true);
    expect(focus.highlightIds.has("c1")).toBe(true);
    expect(focus.highlightIds.has("i1")).toBe(true);
  });

  it("blockOpacity dims non-highlighted blocks", () => {
    const focus = buildHighlightIds("sel", { caused_by_events: [], influence_events: [], event: makeEvent("sel") });
    expect(blockOpacity("sel", focus)).toBe(1);
    expect(blockOpacity("other", focus)).toBe(0.2);
  });

  it("worldlineOpacity favors selected agent", () => {
    expect(worldlineOpacity("a", "a")).toBeCloseTo(0.85);
    expect(worldlineOpacity("b", "a")).toBeCloseTo(0.35);
    expect(worldlineOpacity("a", null)).toBe(1);
  });

  it("threadOpacityFocused highlights threads connected to selection", () => {
    const focus = buildHighlightIds("sel", { caused_by_events: [], influence_events: [], event: makeEvent("sel") });
    const highlighted = threadOpacityFocused("sel", "other", focus, 0.4);
    expect(highlighted).toBeGreaterThan(0.8);
    const dimmed = threadOpacityFocused("a", "b", focus, 0.4);
    expect(dimmed).toBeCloseTo(0.15);
  });
});
