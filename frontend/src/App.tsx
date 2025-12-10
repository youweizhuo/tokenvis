import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layer, Rect, Stage, Text, Line } from "react-konva";
import { fetchAgents, fetchEvents } from "./api";
import { Agent, AgentEvent } from "./types";
import { useViewport } from "./store/useViewport";
import {
  EVENT_COLORS,
  WORLDLINE_SPACING,
  BLOCK_WIDTH,
  BLOCK_GAP,
  BLOCK_HEIGHT_MIN,
  BLOCK_HEIGHT_MAX,
  WORLDLINE_WIDTH,
} from "./constants";
import { threadOpacity } from "./threads";

type PositionedEvent = {
  event: AgentEvent;
  x: number;
  y: number;
  height: number;
};

type PositionedEventMap = Record<string, PositionedEvent>;

const clampHeight = (durationMs: number) => {
  const h = durationMs / 50;
  return Math.max(BLOCK_HEIGHT_MIN, Math.min(BLOCK_HEIGHT_MAX, h));
};

function layoutEvents(agents: Agent[], events: AgentEvent[]): PositionedEvent[] {
  const positions: PositionedEvent[] = [];
  const byAgent: Record<string, AgentEvent[]> = {};
  agents.forEach((a) => (byAgent[a.agent_id] = []));
  events.forEach((e) => byAgent[e.agent_id]?.push(e));

  Object.entries(byAgent).forEach(([agentId, evts], idx) => {
    const sorted = [...evts].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    let y = 0;
    const x = 120 + idx * WORLDLINE_SPACING;
    sorted.forEach((e) => {
      const height = clampHeight(e.duration_ms);
      positions.push({ event: e, x, y, height });
      y += height + BLOCK_GAP;
    });
  });
  return positions;
}

function mapPositioned(positioned: PositionedEvent[]): PositionedEventMap {
  return positioned.reduce<PositionedEventMap>((acc, p) => {
    acc[p.event.event_id] = p;
    return acc;
  }, {});
}

function App() {
  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  const { scale, offset, setScale, setOffset } = useViewport();

  const positioned = useMemo(() => layoutEvents(agents, events), [agents, events]);
  const positionedById = useMemo(() => mapPositioned(positioned), [positioned]);
  const agentColorById = useMemo(
    () =>
      agents.reduce<Record<string, string>>((acc, a) => {
        acc[a.agent_id] = a.color;
        return acc;
      }, {}),
    [agents]
  );

  const contentHeight =
    positioned.reduce((acc, p) => Math.max(acc, p.y + p.height), 0) + 200;
  const contentWidth = agents.length * WORLDLINE_SPACING + 200;

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const oldScale = scale;
    const pointer = stage.getPointerPosition();
    const mousePointTo = {
      x: (pointer.x - offset.x) / oldScale,
      y: (pointer.y - offset.y) / oldScale,
    };
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const scaleBy = 1.05;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setScale(newScale);
    setOffset(newPos);
  };

  const handleDragEnd = (e: any) => {
    setOffset({ x: e.target.x(), y: e.target.y() });
  };

  const loading = agentsLoading || eventsLoading;

  const threads = useMemo(() => {
    const lines: { from: PositionedEvent; to: PositionedEvent }[] = [];
    events.forEach((evt) => {
      const from = positionedById[evt.event_id];
      if (!from) return;
      evt.influences.forEach((targetId) => {
        const to = positionedById[targetId];
        if (to) {
          lines.push({ from, to });
        }
      });
    });
    return lines;
  }, [events, positionedById]);

  return (
    <div>
      <div className="topbar">
        <strong style={{ marginRight: 8 }}>ChronoMesh</strong>
        <span style={{ color: "#94A3B8" }}>
          Phase 1 · worldlines + blocks · zoom/pan
        </span>
      </div>
      <div className="canvas-container">
        {loading ? (
          <div style={{ padding: 16 }}>Loading...</div>
        ) : (
          <Stage
            width={window.innerWidth}
            height={window.innerHeight - 48}
            x={offset.x}
            y={offset.y}
            scaleX={scale}
            scaleY={scale}
            draggable
            onDragEnd={handleDragEnd}
            onWheel={handleWheel}
            style={{ background: "#0F172A" }}
          >
            <Layer>
              {agents.map((agent, idx) => {
                const x = 120 + idx * WORLDLINE_SPACING + BLOCK_WIDTH / 2;
                return (
                  <Rect
                    key={agent.agent_id}
                    x={x}
                    y={0}
                    width={WORLDLINE_WIDTH}
                    height={contentHeight}
                    fill="#1E293B"
                  />
                );
              })}

              {positioned.map((p) => (
                <Rect
                  key={p.event.event_id}
                  x={p.x}
                  y={p.y}
                  width={BLOCK_WIDTH}
                  height={p.height}
                  fill={EVENT_COLORS[p.event.event_type] ?? "#3B82F6"}
                  cornerRadius={6}
                  opacity={0.9}
                />
              ))}

              {threads.map(({ from, to }) => {
                const startX = from.x + BLOCK_WIDTH;
                const startY = from.y + from.height / 2;
                const endX = to.x;
                const endY = to.y + to.height / 2;
                const midX = (startX + endX) / 2;

                const gradient = {
                  colorStops: [
                    0,
                    agentColorById[from.event.agent_id] ??
                      EVENT_COLORS[from.event.event_type] ??
                      "#3B82F6",
                    1,
                    agentColorById[to.event.agent_id] ??
                      EVENT_COLORS[to.event.event_type] ??
                      "#A855F7",
                  ],
                  startPoint: { x: startX, y: startY },
                  endPoint: { x: endX, y: endY },
                } as const;

                return (
                  <Line
                    key={`${from.event.event_id}->${to.event.event_id}`}
                    points={[startX, startY, midX, startY, midX, endY, endX, endY]}
                    bezier
                    strokeLinearGradientColorStops={gradient.colorStops}
                    strokeLinearGradientStartPoint={gradient.startPoint}
                    strokeLinearGradientEndPoint={gradient.endPoint}
                    strokeWidth={2}
                    opacity={threadOpacity(scale)}
                    lineCap="round"
                    lineJoin="round"
                  />
                );
              })}

              {positioned.map((p) => (
                <Text
                  key={`${p.event.event_id}-label`}
                  x={p.x + 8}
                  y={p.y + 8}
                  text={p.event.content.text.slice(0, 22)}
                  fontSize={12}
                  fill="#F8FAFC"
                  width={BLOCK_WIDTH - 16}
                  listening={false}
                />
              ))}
            </Layer>
          </Stage>
        )}
      </div>
    </div>
  );
}

export default App;
