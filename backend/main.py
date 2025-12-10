from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .data import load_simulations
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
