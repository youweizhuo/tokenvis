from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class Location(BaseModel):
    room_id: str
    name: str | None = None
    x: float | None = None
    y: float | None = None


class Content(BaseModel):
    action_verb: str
    text: str
    target_agent_id: Optional[str] = None


class InternalState(BaseModel):
    reasoning_trace: List[str] = Field(default_factory=list)
    memories_accessed: List[str] = Field(default_factory=list)
    emotion: Optional[str] = None


class Agent(BaseModel):
    agent_id: str
    name: str
    color: str


class AgentEvent(BaseModel):
    event_id: str
    agent_id: str
    timestamp: datetime
    duration_ms: int
    event_type: str
    location: Location
    content: Content
    internal_state: InternalState
    caused_by: List[str] = Field(default_factory=list)
    influences: List[str] = Field(default_factory=list)


class Simulation(BaseModel):
    simulation_id: str
    start_time: datetime
    agents: List[Agent]
    locations: List[Location]
    events: List[AgentEvent]
