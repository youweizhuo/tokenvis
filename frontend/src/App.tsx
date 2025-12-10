import { useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layer, Rect, Stage, Text, Arrow, Label, Tag, Group } from "react-konva";
import { fetchAgents, fetchEvents, fetchEventContext } from "./api";
import { Agent, AgentEvent } from "./types";
import { useViewport } from "./store/useViewport";
import { useSelection } from "./store/useSelection";
import {
  EVENT_COLORS,
  WORLDLINE_SPACING,
  BLOCK_WIDTH,
  BLOCK_GAP,
  BLOCK_HEIGHT_MIN,
  BLOCK_HEIGHT_MAX,
  WORLDLINE_WIDTH,
  GRID_SIZE,
  GRID_DOT_SIZE,
  CANVAS_MARGIN,
} from "./constants";
import { threadOpacity } from "./threads";
import { DetailPanel } from "./components/DetailPanel";
import { blockOpacity, worldlineOpacity, threadOpacityFocused, buildHighlightIds } from "./focus";

type PositionedEvent = {
  event: AgentEvent;
  x: number;
  y: number;
  height: number;
};

type PositionedEventMap = Record<string, PositionedEvent>;

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  const bigint = parseInt(normalized.length === 3 ? normalized.repeat(2) : normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

const withAlpha = (hex: string, alpha: number) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const lighten = (hex: string, amount: number) => {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v: number) => Math.min(255, Math.max(0, v));
  return `rgb(${clamp(r + amount)}, ${clamp(g + amount)}, ${clamp(b + amount)})`;
};

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
  const { selectedEventId, setSelectedEventId, clearSelection } = useSelection();

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
  const backgroundX = -CANVAS_MARGIN;
  const backgroundY = -CANVAS_MARGIN;
  const backgroundWidth = contentWidth + CANVAS_MARGIN * 2;
  const backgroundHeight = contentHeight + CANVAS_MARGIN * 2;

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

  const {
    data: eventContext,
    isFetching: contextLoading,
  } = useQuery({
    queryKey: ["event-context", selectedEventId],
    queryFn: () => fetchEventContext(selectedEventId as string),
    enabled: !!selectedEventId,
  });

  const { threads, branchCounts } = useMemo(() => {
    const lines: { from: PositionedEvent; to: PositionedEvent }[] = [];
    const counts: Record<string, number> = {};
    events.forEach((evt) => {
      const from = positionedById[evt.event_id];
      if (!from) return;
      if (evt.influences.length > 1) counts[evt.event_id] = evt.influences.length;
      evt.influences.forEach((targetId) => {
        const to = positionedById[targetId];
        if (to) {
          lines.push({ from, to });
        }
      });
    });
    return { threads: lines, branchCounts: counts };
  }, [events, positionedById]);

  const focus = useMemo(
    () => buildHighlightIds(selectedEventId, eventContext),
    [selectedEventId, eventContext]
  );

  const selectedEvent = selectedEventId ? positionedById[selectedEventId]?.event : undefined;

  const handleStageClick = useCallback(
    (e: any) => {
      const stage = e.target.getStage();
      if (e.target === stage) {
        clearSelection();
      }
    },
    [clearSelection]
  );

  return (
    <div>
      <div className="topbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background:
                "radial-gradient(circle at 30% 30%, #38bdf8 0%, #2563eb 45%, #0f172a 100%)",
              boxShadow: "0 0 12px rgba(56, 189, 248, 0.6)",
            }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontWeight: 800, color: "#E2E8F0", fontSize: 16 }}>
              ChronoMesh
            </span>
            <span style={{ color: "#94A3B8", fontSize: 12 }}>
              Multi-agent spacetime traces
            </span>
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span className="badge">Canvas · v1</span>
          <span className="badge">Zoom & Pan</span>
        </div>
      </div>
      <div className="canvas-container">
        {loading ? (
          <div style={{ padding: 16 }}>Loading...</div>
        ) : (
          <>
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
              onMouseDown={handleStageClick}
              style={{ background: "transparent" }}
            >
              <Layer listening={false}>
                <Rect
                  x={backgroundX}
                  y={backgroundY}
                  width={backgroundWidth}
                  height={backgroundHeight}
                  perfectDrawEnabled={false}
                  sceneFunc={(ctx, shape) => {
                    const w = shape.width();
                    const h = shape.height();
                    ctx.save();
                    const gradient = ctx.createLinearGradient(0, 0, 0, h);
                    gradient.addColorStop(0, "#0f182c");
                    gradient.addColorStop(1, "#0b1224");
                    ctx.fillStyle = gradient;
                    ctx.fillRect(0, 0, w, h);
                    ctx.beginPath();
                    for (let gx = 0; gx <= w; gx += GRID_SIZE) {
                      for (let gy = 0; gy <= h; gy += GRID_SIZE) {
                        ctx.rect(
                          gx - GRID_DOT_SIZE / 2,
                          gy - GRID_DOT_SIZE / 2,
                          GRID_DOT_SIZE,
                          GRID_DOT_SIZE
                        );
                      }
                    }
                    ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
                    ctx.fill();
                    ctx.restore();
                  }}
                />
              </Layer>

              <Layer>
                {agents.map((agent, idx) => {
                  const color = agentColorById[agent.agent_id] ?? "#38bdf8";
                  const railCenter = 120 + idx * WORLDLINE_SPACING + BLOCK_WIDTH / 2;
                  const railOpacity = worldlineOpacity(
                    agent.agent_id,
                    selectedEvent?.agent_id ?? null
                  );
                  return (
                    <Group key={agent.agent_id}>
                      <Rect
                        x={railCenter - WORLDLINE_WIDTH / 2}
                        y={-40}
                        width={WORLDLINE_WIDTH}
                        height={contentHeight + 60}
                        cornerRadius={WORLDLINE_WIDTH}
                        fill={withAlpha(color, 0.15)}
                        stroke={withAlpha(color, 0.7)}
                        strokeWidth={2}
                        shadowColor={withAlpha(color, 0.5)}
                        shadowBlur={18}
                        shadowOpacity={0.6}
                        opacity={railOpacity}
                      />
                      <Label x={railCenter - 40} y={-34} listening={false}>
                        <Tag
                          fill={withAlpha(color, 0.2)}
                          stroke={withAlpha(color, 0.6)}
                          strokeWidth={1}
                          cornerRadius={12}
                        />
                        <Text
                          text={agent.name}
                          fontSize={12}
                          fontStyle="700"
                          fill="#E2E8F0"
                          padding={8}
                        />
                      </Label>
                    </Group>
                  );
                })}

                {positioned.map((p) => {
                  const baseColor =
                    agentColorById[p.event.agent_id] ??
                    EVENT_COLORS[p.event.event_type] ??
                    "#3B82F6";
                  const isSelected = p.event.event_id === selectedEventId;
                  const blockAlpha = blockOpacity(p.event.event_id, focus);
                  return (
                    <Group
                      key={p.event.event_id}
                      onClick={() => setSelectedEventId(p.event.event_id)}
                      listening
                    >
                      <Rect
                        x={p.x}
                        y={p.y}
                        width={BLOCK_WIDTH}
                        height={p.height}
                        cornerRadius={12}
                        fillLinearGradientStartPoint={{ x: p.x, y: p.y }}
                        fillLinearGradientEndPoint={{ x: p.x, y: p.y + p.height }}
                        fillLinearGradientColorStops={[
                          0,
                          withAlpha(baseColor, 0.28),
                          1,
                          withAlpha(baseColor, 0.12),
                        ]}
                        stroke={lighten(baseColor, 30)}
                        strokeWidth={2}
                        shadowColor={withAlpha(baseColor, 0.45)}
                        shadowBlur={14}
                        shadowOpacity={0.7}
                        opacity={blockAlpha}
                      />
                      <Text
                        x={p.x + 12}
                        y={p.y + 10}
                        text={p.event.content.text.slice(0, 26)}
                        fontSize={13}
                        fontStyle="600"
                        fill="#F8FAFC"
                        width={BLOCK_WIDTH - 24}
                        listening={false}
                        opacity={blockAlpha}
                      />
                      {isSelected ? (
                        <Rect
                          x={p.x - 6}
                          y={p.y - 6}
                          width={BLOCK_WIDTH + 12}
                          height={p.height + 12}
                          cornerRadius={14}
                          stroke={withAlpha(baseColor, 0.8)}
                          strokeWidth={2}
                          opacity={0.9}
                          listening={false}
                        />
                      ) : null}
                    </Group>
                  );
                })}

                {threads.map(({ from, to }) => {
                  const startX = from.x + BLOCK_WIDTH;
                  const startY = from.y + from.height / 2;
                  const endX = to.x;
                  const endY = to.y + to.height / 2;
                  const midX = (startX + endX) / 2;
                  const sourceColor =
                    agentColorById[from.event.agent_id] ??
                    EVENT_COLORS[from.event.event_type] ??
                    "#3B82F6";
                  const targetColor =
                    agentColorById[to.event.agent_id] ??
                    EVENT_COLORS[to.event.event_type] ??
                    "#A855F7";
                  const opacity = threadOpacityFocused(
                    from.event.event_id,
                    to.event.event_id,
                    focus,
                    threadOpacity(scale)
                  );

                  return (
                    <Group key={`${from.event.event_id}->${to.event.event_id}`}>
                      {branchCounts[from.event.event_id] ? (
                        <Rect
                          x={startX - 6}
                          y={startY - 6}
                          width={12}
                          height={12}
                          cornerRadius={6}
                          fill={withAlpha(sourceColor, 0.95)}
                          shadowColor={withAlpha(sourceColor, 0.6)}
                          shadowBlur={10}
                        />
                      ) : null}
                      <Arrow
                        points={[startX, startY, midX, startY, midX, endY, endX - 6, endY]}
                        bezier
                        strokeLinearGradientColorStops={[0, sourceColor, 1, targetColor]}
                        strokeLinearGradientStartPoint={{ x: startX, y: startY }}
                        strokeLinearGradientEndPoint={{ x: endX, y: endY }}
                        strokeWidth={2.6}
                        opacity={opacity}
                        lineCap="round"
                        lineJoin="round"
                        pointerLength={10}
                        pointerWidth={10}
                        fill={withAlpha(targetColor, 0.9)}
                      />
                    </Group>
                  );
                })}
              </Layer>
            </Stage>
            <DetailPanel
              context={eventContext}
              agents={agents}
              onClose={clearSelection}
            />
            {contextLoading && selectedEventId ? (
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  right: 370,
                  color: "#cbd5e1",
                  fontSize: 12,
                  background: "rgba(0,0,0,0.35)",
                  padding: "6px 8px",
                  borderRadius: 8,
                }}
              >
                Loading context...
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
