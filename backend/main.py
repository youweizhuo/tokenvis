from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from .data import load_simulations, build_event_index
from .models import Agent, AgentEvent

app = FastAPI(title="ChronoMesh Backend", version="0.1.0")

# Allow local dev origins; adjust as needed for deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SIMULATIONS = load_simulations()
EVENT_INDEX = build_event_index(SIMULATIONS)
EVENTS_BY_SIM = {
    sim_id: {evt.event_id: evt for evt in sim.events} for sim_id, sim in SIMULATIONS.items()
}


class EventContext(BaseModel):
    event: AgentEvent
    caused_by_events: list[AgentEvent]
    influence_events: list[AgentEvent]


def _get_sim(sim_id: str):
    sim = SIMULATIONS.get(sim_id)
    if not sim:
        raise HTTPException(status_code=404, detail="Simulation not found")
    return sim


@app.get("/simulations/{sim_id}/agents", response_model=list[Agent])
def list_agents(sim_id: str):
    sim = _get_sim(sim_id)
    return sim.agents


@app.get("/simulations/{sim_id}/events", response_model=list[AgentEvent])
def list_events(sim_id: str):
    sim = _get_sim(sim_id)
    sorted_events = sorted(sim.events, key=lambda e: e.timestamp)
    return sorted_events


@app.get("/events/{event_id}/context", response_model=EventContext)
def get_event_context(event_id: str):
    indexed = EVENT_INDEX.get(event_id)
    if not indexed:
        raise HTTPException(status_code=404, detail="Event not found")

    sim_id, evt = indexed
    by_id = EVENTS_BY_SIM.get(sim_id, {})
    caused = [by_id[cid] for cid in evt.caused_by if cid in by_id]
    influences = [by_id[iid] for iid in evt.influences if iid in by_id]
    return EventContext(event=evt, caused_by_events=caused, influence_events=influences)
