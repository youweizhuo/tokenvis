import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DetailPanel } from "./DetailPanel";
import { Agent, EventContext } from "../types";

const agents: Agent[] = [
  { agent_id: "agent_a", name: "Alice", color: "#3B82F6" },
  { agent_id: "agent_b", name: "Bob", color: "#10B981" },
];

const ctx: EventContext = {
  event: {
    event_id: "evt_1",
    agent_id: "agent_a",
    timestamp: "2024-01-01T00:00:00Z",
    duration_ms: 1200,
    event_type: "action",
    location: { room_id: "r", x: 0, y: 0 },
    content: { action_verb: "say", text: "Hello world", target_agent_id: null },
    internal_state: { reasoning_trace: ["thought"], memories_accessed: ["mem1"], emotion: "calm" },
    caused_by: [],
    influences: [],
  },
  caused_by_events: [],
  influence_events: [
    {
      event_id: "evt_2",
      agent_id: "agent_b",
      timestamp: "2024-01-01T00:00:05Z",
      duration_ms: 800,
      event_type: "perception",
      location: { room_id: "r", x: 0, y: 0 },
      content: { action_verb: "hear", text: "Heard it", target_agent_id: null },
      internal_state: { reasoning_trace: [], memories_accessed: [], emotion: null },
      caused_by: [],
      influences: [],
    },
  ],
};

describe("DetailPanel", () => {
  it("renders event info and neighbors", () => {
    const { container } = render(
      <DetailPanel
        event={ctx.event}
        context={ctx}
        agents={agents}
        loading={false}
        error={undefined}
        onRetryContext={() => {}}
        onClose={() => {}}
      />
    );
    const panel = container.querySelector(".detail-panel");
    expect(panel).toBeTruthy();
    expect(screen.getByText("Alice")).toBeTruthy();
    expect(screen.getByText(/Hello world/)).toBeTruthy();
    expect(screen.getByText(/mem1/)).toBeTruthy();
    expect(screen.getByText(/perception/)).toBeTruthy();
    expect(screen.getByText(/Bob/)).toBeTruthy();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <DetailPanel
        event={ctx.event}
        context={ctx}
        agents={agents}
        loading={false}
        error={undefined}
        onRetryContext={() => {}}
        onClose={onClose}
      />
    );
    const panel = container.querySelector(".detail-panel") as HTMLElement;
    const close = panel.querySelector("button") as HTMLButtonElement;
    fireEvent.click(close);
    expect(onClose).toHaveBeenCalled();
  });
});
