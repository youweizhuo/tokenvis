from datetime import datetime

from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)
SIM_ID = "sim_coffee_shop_001"


def test_list_agents_returns_seeded_agents():
    resp = client.get(f"/simulations/{SIM_ID}/agents")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) == 3
    agent_ids = {a["agent_id"] for a in data}
    assert {"agent_alice", "agent_bob", "agent_carol"} == agent_ids


def test_list_events_sorted_by_timestamp():
    resp = client.get(f"/simulations/{SIM_ID}/events")
    assert resp.status_code == 200
    events = resp.json()
    assert len(events) > 0
    timestamps = [datetime.fromisoformat(e["timestamp"]) for e in events]
    assert timestamps == sorted(timestamps)
    assert events[0]["event_id"] == "evt_001"
    assert events[-1]["event_id"] == "evt_012"


def test_events_have_causal_links_built():
    resp = client.get(f"/simulations/{SIM_ID}/events")
    assert resp.status_code == 200
    events = resp.json()
    lookup = {e["event_id"]: e for e in events}
    # check chain for same-agent and cross-agent heuristic
    assert lookup["evt_002"]["caused_by"] == ["evt_001"]
    assert "evt_002" in lookup["evt_001"]["influences"]
    # cross-agent within 5s: evt_006 targets Bob, links to Bob's previous evt_005
    assert "evt_005" in lookup["evt_006"]["caused_by"]
    assert "evt_006" in lookup["evt_005"]["influences"]


def test_event_context_endpoint():
    resp = client.get("/events/evt_006/context")
    assert resp.status_code == 200
    data = resp.json()
    assert data["event"]["event_id"] == "evt_006"
    caused_ids = {e["event_id"] for e in data["caused_by_events"]}
    influence_ids = {e["event_id"] for e in data["influence_events"]}
    assert "evt_002" in caused_ids and "evt_005" in caused_ids
    assert "evt_007" in influence_ids


def test_event_context_not_found():
    resp = client.get("/events/evt_999/context")
    assert resp.status_code == 404
