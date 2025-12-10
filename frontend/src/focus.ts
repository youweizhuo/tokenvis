import { AgentEvent } from "./types";

export type FocusSets = {
  highlightIds: Set<string>;
  selectedId: string | null;
};

export const buildHighlightIds = (selectedId: string | null, context?: { caused_by_events: AgentEvent[]; influence_events: AgentEvent[] }) => {
  if (!selectedId) return { highlightIds: new Set<string>(), selectedId: null };
  const ids = new Set<string>();
  ids.add(selectedId);
  if (context) {
    context.caused_by_events.forEach((e) => ids.add(e.event_id));
    context.influence_events.forEach((e) => ids.add(e.event_id));
  }
  return { highlightIds: ids, selectedId };
};

export const blockOpacity = (eventId: string, focus: FocusSets) => {
  if (!focus.selectedId) return 1;
  if (eventId === focus.selectedId) return 1;
  if (focus.highlightIds.has(eventId)) return 0.7;
  return 0.2;
};

export const worldlineOpacity = (agentId: string, selectedEventAgentId?: string | null) => {
  if (!selectedEventAgentId) return 1;
  return agentId === selectedEventAgentId ? 0.85 : 0.35;
};

export const threadOpacityFocused = (fromId: string, toId: string, focus: FocusSets, baseOpacity: number) => {
  if (!focus.selectedId) return baseOpacity;
  if (fromId === focus.selectedId || toId === focus.selectedId) {
    return Math.max(baseOpacity, 0.9);
  }
  if (focus.highlightIds.has(fromId) && focus.highlightIds.has(toId)) {
    return Math.max(baseOpacity, 0.6);
  }
  return 0.15;
};
