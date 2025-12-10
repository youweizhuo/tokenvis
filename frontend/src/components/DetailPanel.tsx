import { Agent, EventContext } from "../types";

type DetailPanelProps = {
  context?: EventContext;
  agents: Agent[];
  onClose: () => void;
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

export function DetailPanel({ context, agents, onClose }: DetailPanelProps) {
  if (!context) return null;
  const agentLookup = agents.reduce<Record<string, string>>((acc, a) => {
    acc[a.agent_id] = a.name;
    return acc;
  }, {});

  const { event, caused_by_events, influence_events } = context;
  const agentName = agentLookup[event.agent_id] ?? event.agent_id;

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div>
          <div className="detail-title">{agentName}</div>
          <div className="detail-sub">
            {event.event_type} · {formatTime(event.timestamp)} · {event.duration_ms} ms
          </div>
        </div>
        <button className="detail-close" onClick={onClose} aria-label="Close detail panel">
          ×
        </button>
      </div>

      <div className="detail-section">
        <div className="detail-label">Content</div>
        <div className="detail-body">{event.content.text}</div>
      </div>

      <div className="detail-section">
        <div className="detail-label">Reasoning Trace</div>
        <ul className="detail-list">
          {event.internal_state.reasoning_trace.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>

      <div className="detail-grid">
        <div>
          <div className="detail-label">Memories Accessed</div>
          <ul className="detail-list">
            {event.internal_state.memories_accessed.length ? (
              event.internal_state.memories_accessed.map((mem) => <li key={mem}>{mem}</li>)
            ) : (
              <li className="detail-muted">None</li>
            )}
          </ul>
        </div>
        <div>
          <div className="detail-label">Emotion</div>
          <div className="detail-body">{event.internal_state.emotion ?? "neutral"}</div>
        </div>
      </div>

      <div className="detail-section">
        <div className="detail-label">Caused By</div>
        {caused_by_events.length ? (
          <ul className="detail-list">
            {caused_by_events.map((c) => (
              <li key={c.event_id}>
                <span className="detail-pill">{c.event_type}</span> {agentLookup[c.agent_id] ?? c.agent_id} · {formatTime(c.timestamp)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="detail-muted">None</div>
        )}
      </div>

      <div className="detail-section">
        <div className="detail-label">Influences</div>
        {influence_events.length ? (
          <ul className="detail-list">
            {influence_events.map((c) => (
              <li key={c.event_id}>
                <span className="detail-pill">{c.event_type}</span> {agentLookup[c.agent_id] ?? c.agent_id} · {formatTime(c.timestamp)}
              </li>
            ))}
          </ul>
        ) : (
          <div className="detail-muted">None</div>
        )}
      </div>
    </div>
  );
}
