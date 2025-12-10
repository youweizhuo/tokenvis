import json
from datetime import datetime
from pathlib import Path
from typing import Dict, List

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
    simulation = Simulation(
        simulation_id=raw["simulation_id"],
        start_time=_parse_timestamp(raw["start_time"]),
        agents=agents,
        locations=raw.get("locations", []),
        events=events,
    )
    return {simulation.simulation_id: simulation}
