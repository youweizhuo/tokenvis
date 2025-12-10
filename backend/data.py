import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List
from datetime import timedelta

from .models import Agent, AgentEvent, Simulation

DATA_PATH = Path(__file__).parent / "example_trace.json"


def _parse_timestamp(ts: str) -> datetime:
    # Support trailing Z for UTC
    return datetime.fromisoformat(ts.replace("Z", "+00:00"))


def load_simulations() -> Dict[str, Simulation]:
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Seed data not found at {DATA_PATH}")

    raw = json.loads(DATA_PATH.read_text())
    events: List[AgentEvent] = []
    for evt in raw.get("events", []):
        evt["timestamp"] = _parse_timestamp(evt["timestamp"])
        events.append(AgentEvent(**evt))

    agents = [Agent(**agent) for agent in raw.get("agents", [])]
    # Compute causal links on load so API responses always include edges
    build_causal_links(events)

    simulation = Simulation(
        simulation_id=raw["simulation_id"],
        start_time=_parse_timestamp(raw["start_time"]),
        agents=agents,
        locations=raw.get("locations", []),
        events=events,
    )
    return {simulation.simulation_id: simulation}


def build_causal_links(events: List[AgentEvent], lookback_seconds: float = 5.0) -> None:
    """Populate caused_by and influences using simple deterministic heuristics.

    Heuristics:
    - Link to previous event from the same agent (if any)
    - Link to most recent event from target agent within lookback window
    """

    if not events:
        return

    window = timedelta(seconds=lookback_seconds)

    # Reset any existing links to avoid duplicating when reloading
    for evt in events:
        evt.caused_by = []
        evt.influences = []

    # Same-agent chaining
    prev_by_agent: Dict[str, AgentEvent] = {}
    for evt in sorted(events, key=lambda e: e.timestamp):
        prev = prev_by_agent.get(evt.agent_id)
        if prev:
            evt.caused_by.append(prev.event_id)
            prev.influences.append(evt.event_id)
        prev_by_agent[evt.agent_id] = evt

    # Cross-agent interaction within lookback window
    prev_by_agent.clear()
    for evt in sorted(events, key=lambda e: e.timestamp):
        target_id = evt.content.target_agent_id
        if target_id:
            target_prev = prev_by_agent.get(target_id)
            if target_prev and evt.timestamp - target_prev.timestamp <= window:
                evt.caused_by.append(target_prev.event_id)
                target_prev.influences.append(evt.event_id)
        prev_by_agent[evt.agent_id] = evt
