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
