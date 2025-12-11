## 🤖 Assistant

# ChronoMesh: Spacetime Visualization for Multi-Agent Systems
## Complete Design & Development Specification v1.0

---

## Part 1: Vision & Motivation

### The Problem
Current tools for understanding multi-agent LLM systems are inadequate:
- **Chat logs** are linear and fail to show parallel thinking
- **Flowcharts** are static and don't capture temporal evolution
- **Debug traces** are overwhelming text dumps without structure
- **Standard timelines** don't show causal relationships between agents

When debugging AI Town or similar multi-agent systems, developers need to answer:
- "Why did Agent A suddenly do X?"
- "What chain of events led to this conversation?"
- "Which agents influenced each other and when?"
- "What was the agent thinking internally vs. what they said?"

### The Opportunity
Physics uses **Minkowski diagrams** (spacetime graphs) to visualize causality in relativity:
- The **vertical axis** is time
- **Worldlines** show an object's journey through time
- **Light cones** show what can causally influence what
- The **slope of connections** shows information propagation

We can adapt this elegant formalism to visualize agent cognition.

### Core Metaphor
```
Agent existence = Worldline (vertical flow)
Agent thought/action = Event block on worldline
Communication = Diagonal thread connecting events
Causality = The geometry of thread connections
```

---

## Part 2: Design Principles

### Principle 1: **Causality First**
Every interaction should visually answer: "What caused what?"
- Direction flows top-to-bottom (past → future)
- Causal threads always point downward
- The visual tangle shows complexity

### Principle 2: **Data Density with Progressive Disclosure**
- **Far zoom (macro):** See patterns in colored bands
- **Medium zoom (meso):** See individual blocks with icons
- **Close zoom (micro):** See text labels and details
- **Click:** See full reasoning traces

### Principle 3: **Spatial Semantics**
- **Horizontal proximity** = Spatial closeness in simulation
- **Vertical proximity** = Temporal closeness
- **Thread density** = Interaction intensity
- **Color** = Event type (perception/cognition/action)

### Principle 4: **Simplicity First, Richness Later**
Core MVP needs only:
- Agent columns with event blocks
- Basic causal threads
- Click to expand detail

Advanced features (bundling, topic streams, mini-maps) come after.

---

## Part 3: Revised UI Design

### A. Core Canvas Architecture (Simplified)

```
┌─────────────────────────────────────────────────────────┐
│  [Timeline Scrubber: ████████░░░░░░░░░░   t=10:05:23]  │  ← Control Bar
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Agent_A    Agent_B    Agent_C                        │  ← Agent Headers
│     │          │          │                            │
│   ┌─┴─┐      ┌─┴─┐      │                            │
│   │🧠│      │👁│      │    ← Event Blocks            │
│   └─┬─┘      └─┬─┘      │                            │
│     │    ╭────╯│        │                            │  ← Causal Thread
│   ┌─┴─┐  │   ┌─┴─┐      │                            │
│   │💬│──╯   │🧠│      │                            │
│   └─┬─┘      └─┬─┘    ┌─┴─┐                          │
│     │          │   ╭──│👁│                          │
│     │          │   │  └─┬─┘                          │
│   ┌─┴─┐      ┌─┴─┐│  ┌─┴─┐                          │
│   │👁│      │💬├╯  │💬│                          │
│   └───┘      └───┘   └───┘                          │
│     ▼          ▼       ▼                             │
│                                                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### B. Revised Component Design

#### 1. **Agent Worldline (The Vertical Column)**

**Visual Design:**
```
- Width: 150px fixed (simplification: no dynamic width)
- Background: Semi-transparent vertical track (#1E293B, 30% opacity)
- Position: Evenly spaced, 200px apart
- Header: Agent name + avatar color indicator
```

**Simplification from original design:**
- Removed dynamic X-clustering (too complex for MVP)
- Removed location zones (can add later)
- Fixed column positions for simplicity

#### 2. **Event Block (The Atom of Action)**

**Visual Design:**
```
┌─────────────────┐
│  🧠             │  ← Icon (type indicator)
│  "Planning..."  │  ← Label (shows at zoom>2)
│  [2.3s]        │  ← Duration badge
└─────────────────┘
```

**Properties:**
- Width: 140px (fits in worldline with margin)
- Height: `duration_ms / 50` pixels (min 16px, max 200px)
- Border-radius: 6px
- Color by type:
 - 🔵 **Perception** (sees/hears): `#3B82F6`
 - 🟣 **Cognition** (thinks/plans): `#A855F7`
 - 🟢 **Action** (speaks/moves): `#10B981`
 - 🔴 **Error** (fails): `#EF4444`

**Interaction:**
- Hover: Brighten (+20% luminosity), scale(1.05)
- Click: Stroke outline (3px white), open detail panel

**Simplification from original design:**
- Removed "capsule" aesthetic (rectangles are simpler)
- Removed complex shadow effects (performance)
- Fixed width instead of variable width

#### 3. **Causal Thread (The Connection)**

**Visual Design:**
```
Event_A (t=10)
   │
   └─────╮         ← Cubic Bezier curve
         │         ← Gradient: Color_A → Color_B
         ▼         ← Arrow shows direction
      Event_B (t=12)
```

**Properties:**
- Start point: Bottom-center of source block
- End point: Top-center of target block
- Curve: Cubic Bezier with control points:
```
  P0 = source block bottom
  P1 = P0 + (0, height_between * 0.3)
  P2 = P3 - (0, height_between * 0.3)
  P3 = target block top
  ```
- Width: 2px base, 4px when highlighted
- Opacity: 0.4 base, 1.0 when highlighted
- Color: Gradient from source agent color to target agent color

**Simplification from original design:**
- Removed thread bundling (MVP doesn't need it)
- Removed complex "light cone" visualization (just highlight related threads)
- Simple gradient instead of volumetric rendering

#### 4. **Selection State: "Focus Mode"**

When user clicks an event block:

```
┌─────────────────────────────────────────────────────────┐
│ Everything dims to 20% opacity │
│ │
│ Agent_A Agent_B │
│ │ │ │
│ [dim] [dim] │
│ │ │ │
│ ┏━┷━┓ ◄──── Selected block (bright, outlined) │
│ ┃💬┃ │
│ ┗━┯━┛ │
│ ╰────► Threads connected to this (bright) │
│ │ │
│ [dim] │
│ │ │
└─────────────────────────────────────────────────────────┘
```

**Highlighting logic:**
```
1. Selected block: 100% opacity, white stroke
2. 1-hop connected blocks: 70% opacity
3. Connected threads: 100% opacity
4. Everything else: 20% opacity
```

**Simplification from original design:**
- Removed "past cone" vs "future cone" toggle (just show all connected)
- Removed cone shape visualization (too abstract)
- Simple graph traversal: show immediate neighbors only

---

### C. Detail Panel Design

**Layout (slides from right):**
```
┌───────────────────────────────────────┐
│ ✕ Close │
│ ┌─────────────────────────────────┐ │
│ │ HEADER │ │
│ │ "Agent A spoke" │ │
│ │ 📍 Coffee Shop | ⏱ 10:05:23 │ │
│ └─────────────────────────────────┘ │
│ │
│ OUTPUT │
│ ┌─────────────────────────────────┐ │
│ │ "Hey Bob, want coffee?" │ │
│ └─────────────────────────────────┘ │
│ │
│ REASONING TRACE │
│ ├─ Observed: Bob entered room │
│ ├─ Retrieved: Bob is my friend │
│ ├─ Emotion: Friendly │
│ └─ Decision: Greet him │
│ │
│ CONNECTIONS │
│ ← Caused by (2 events): │
│ • Saw Bob enter [evt_003] │
│ • Recalled friendship [evt_001] │
│ → Influences (1 event): │
│ • Bob heard greeting [evt_006] │
│ │
└───────────────────────────────────────┘
```

**Sections (vertically stacked):**
1. **Header** (always visible):
   - Event type + agent name
   - Location + timestamp
2. **Output** (the observable result):
   - What was said/done
3. **Reasoning Trace** (expandable tree):
   - Step-by-step internal thoughts
   - Can be folded/unfolded
4. **Connections** (causal context):
   - List of prior events that caused this
   - List of future events influenced by this
   - Each is a clickable link to jump to that event

**Simplification from original design:**
- Removed "cognitive stack" metaphor (too abstract)
- Linear list of sections instead of complex tabs
- Text-based instead of graphical visualizations

---

### D. Color Palette (Complete Specification)

```javascript
// Background
canvas_background: '#0F172A' // Deep slate
worldline_track: '#1E293B' // Lighter slate

// Event Types
perception: {
base: '#3B82F6', // Blue
hover: '#60A5FA',
selected: '#93C5FD'
}
cognition: {
base: '#A855F7', // Purple
hover: '#C084FC',
selected: '#E9D5FF'
}
action: {
base: '#10B981', // Green
hover: '#34D399',
selected: '#6EE7B7'
}
error: {
base: '#EF4444', // Red
hover: '#F87171',
selected: '#FCA5A5'
}

// UI Elements
text_primary: '#F8FAFC' // Almost white
text_secondary: '#94A3B8' // Gray
border: '#334155' // Medium slate
panel_bg: '#1E293B' // Same as track
```

---

## Part 4: Data Model

### Core Entities

#### 1. **AgentEvent** (The Atomic Unit)

```javascript
AgentEvent {
// Identity
event_id: string (UUID)
agent_id: string

// Timing
timestamp: ISO8601 datetime
duration_ms: integer

// Classification
event_type: "perception" | "cognition" | "action" | "error"

// Spatial context
location: {
 room_id: string
 x: float
 y: float
}

// Observable content
content: {
 action_verb: string // "speak", "move", "observe", "think"
 text: string // What was said/observed
 target_agent_id: string | null
}

// Internal (hidden) state
internal_state: {
 reasoning_trace: [string] // Array of thought steps
 memories_accessed: [string]
 emotion: string
}

// Causality (computed by backend)
caused_by: [string] // Array of event_ids
influences: [string] // Array of event_ids
}
```

#### 2. **SimulationMetadata**

```javascript
Simulation {
simulation_id: string
start_time: ISO8601
agents: [{
 agent_id: string
 name: string
 color: string // Hex color for this agent's worldline
}]
locations: [{
 room_id: string
 name: string
}]
}
```

---

## Part 5: Backend Specification (Simplified)

### Architecture

```
Input: Stream of AgentEvents
↓
Process: Build causal graph (which events caused which)
↓
Store: Save to database
↓
Serve: Provide query API to frontend
```

### Core Components

#### A. **Data Ingestion**
```
Endpoint: POST /api/simulations/{id}/events
Input: AgentEvent JSON
Process:
 1. Validate event schema
 2. Assign timestamp if not present
 3. Store in database
 4. Compute causal links (see algorithm below)
 5. Return success
```

#### B. **Causal Link Algorithm (Simplified)**

```
For each new event E:

 1. If E is a "perception" event:
 - Look back 5 seconds
 - Find the most recent "action" from the target_agent
 - Create link: action -> perception

 2. If E has memories_accessed:
 - Find events that created those memories
 - Create links: memory_events -> E

 3. Always link to previous event from same agent:
 - Find most recent event from E.agent_id
 - Create link: prev_event -> E

Result: E.caused_by = [list of event IDs]
 For each parent, add E.event_id to parent.influences
```

**Example:**
```
Event A: Alice speaks "Hello" (t=10s)
Event B: Bob perceives Alice speaking (t=10.2s, target=Alice)

Algorithm:
 1. B is perception, target=Alice
 2. Look back 5s for Alice's actions
 3. Find Event A
 4. Link: A.influences += [B]
 B.caused_by += [A]
```

#### C. **Query API**

```
GET /api/simulations/{id}/events?start=...&end=...
→ Returns list of events in time range

GET /api/simulations/{id}/events/{event_id}
→ Returns single event with full details

GET /api/simulations/{id}/events/{event_id}/context
→ Returns {
 caused_by: [events],
 influences: [events]
}

GET /api/simulations/{id}/agents
→ Returns list of agents with colors
```

### Backend Stack (Recommendation)
```
Language: Python 3.11+
Framework: FastAPI
Database: PostgreSQL (for events) or SQLite (for MVP)
Schema:
 - events table (all fields)
 - simulations table (metadata)
 - causal_links table (event_from, event_to)
```

### Simplified File Structure
```
backend/
├── main.py # FastAPI app setup
├── models.py # Pydantic models for Event, Simulation
├── database.py # SQLAlchemy setup
├── causal_builder.py # Algorithm to compute links
├── api_events.py # Event CRUD endpoints
└── api_simulations.py # Simulation endpoints
```

---

## Part 6: Frontend Specification (Simplified)

### Architecture

```
Components:
MainCanvas (renders worldlines + blocks + threads)
DetailPanel (shows event details)
TopBar (timeline scrubber, controls)

State:
 - events: array of AgentEvents
 - agents: array of {id, name, color}
 - selectedEventId: string | null
 - viewport: {zoom, offsetX, offsetY}

Rendering:
 - Use Canvas (2D context) or Konva.js
 - Not WebGL for MVP (too complex)
```

### Core Rendering Logic

#### A. **Layout Computation**

```
Given: List of events for an agent
Output: List of {event_id, x, y, width, height}

Algorithm:
 1. Sort events by timestamp
 2. Start at y=0
 3. For each event:
 - x = agent column position (fixed: 200 * agent_index)
 - y = current_y
 - width = 140px
 - height = max(16, event.duration_ms / 50)
 - current_y += height + 4px (gap)
 4. Return block positions
```

#### B. **Thread Drawing**

```
Given: Event A (source), Event B (target)
Output: Draw curved line

Algorithm:
 1. Get center-bottom of Block A: (x_a, y_a)
 2. Get center-top of Block B: (x_b, y_b)
 3. Compute control points:
 - h = (y_b - y_a) / 3
 - P1 = (x_a, y_a + h)
 - P2 = (x_b, y_b - h)
 4. Draw cubic bezier: (x_a,y_a) → P1 → P2 → (x_b,y_b)
 5. Add gradient from color_a to color_b
```

#### C. **Click Handler**

```
On click at (mouse_x, mouse_y):
 1. Check if click is inside any event block
 2. If yes:
 - Set selectedEventId = block.event_id
 - Trigger re-render (highlight mode)
 - Load detail panel data via API
 3. If no:
 - Clear selection
```

#### D. **Highlight Mode Rendering**

```
When selectedEventId is set:
 1. Fetch context: GET /api/events/{id}/context
 2. Get set of related IDs:
 - related = caused_by + influences + [selectedEventId]
 3. Render loop:
 - For each block:
 - If id in related: opacity = 1.0
 - Else: opacity = 0.2
 - For each thread:
 - If source or target in related: opacity = 1.0
 - Else: opacity = 0.1
```

### Frontend Stack (Recommendation)
```
Framework: React 18 + TypeScript
Canvas: Konva.js (React wrapper for canvas)
State: Zustand (simpler than Redux)
Styling: Tailwind CSS
API: Axios + React Query
```

### Simplified File Structure
```
frontend/
├── src/
│ ├── App.tsx # Root component
│ ├── components/
│ │ ├── MainCanvas.tsx # Canvas renderer
│ │ ├── Worldline.tsx # Agent column
│ │ ├── EventBlock.tsx # Single block
│ │ ├── CausalThread.tsx # Bezier curve
│ │ ├── DetailPanel.tsx # Right sidebar
│ │ └── TopBar.tsx # Controls
│ ├── store/
│ │ └── useSimulation.ts # Zustand store
│ ├── api/
│ │ └── client.ts # API calls
│ └── types.ts # TypeScript interfaces
└── package.json
```

---

## Part 7: Development Roadmap (MVP First)

### Phase 1: Core Visualization (Week 1-2)
**Goal:** Display static events on worldlines

**Backend:**
- [ ] Set up FastAPI project
- [ ] Create Event and Simulation models
- [ ] Implement SQLite database
- [ ] Create endpoints:
  - `GET /simulations/{id}/agents`
  - `GET /simulations/{id}/events`
- [ ] Seed with example data (provided below)

**Frontend:**
- [ ] Set up React + Konva project
- [ ] Implement MainCanvas component
- [ ] Render agent columns (vertical lines)
- [ ] Render event blocks at correct Y positions
- [ ] Implement zoom (scroll wheel) and pan (drag)

**Acceptance:** Can see 3 agents with colored blocks on screen, can zoom and pan.

---

### Phase 2: Causality Display (Week 3)
**Goal:** Show threads connecting events

**Backend:**
- [ ] Implement causal link builder
- [ ] Add `GET /events/{id}/context` endpoint
- [ ] Compute and store causal links for seed data

**Frontend:**
- [ ] Render bezier curves between connected blocks
- [ ] Color threads with gradients
- [ ] Implement opacity based on zoom level

**Acceptance:** See curved lines connecting cause→effect events.

---

### Phase 3: Click Interaction (Week 4)
**Goal:** Click block to see details

**Backend:**
- [ ] Enhance event endpoint to return full internal_state
- [ ] Optimize context query performance

**Frontend:**
- [ ] Implement click detection on blocks
- [ ] Create DetailPanel component
- [ ] Show event details when clicked
- [ ] Implement "focus mode" dimming

**Acceptance:** Click a block, see detail panel, see dimming effect.

---

### Phase 4: Polish & Deploy (Week 5)
- [x] Add timeline scrubber
- [x] Add loading states
- [x] Responsive design for detail panel
- [x] Error handling
- [x] Performance optimization (only render visible events)
- [x] Deploy demo with example simulation

---

### Demo: Run with Seeded Example
1) Backend (terminal 1): `make backend` — starts FastAPI with the bundled `example_trace.json` simulation on `http://localhost:8000`.
2) Frontend (terminal 2): `make frontend` — runs Vite dev server on `http://localhost:5173` pointing at the backend by default.
3) Open the frontend URL and use the timeline scrubber to jump around the seeded conversation.

---

### Future Enhancements (Post-MVP)
- **Thread bundling** (for dense interactions)
- **Topic streams** (show conversation themes)
- **Mini-map** (spatial view of agent positions)
- **Live mode** (WebSocket for real-time events)
- **Search/filter** (find events by keyword)
- **Export** (save visualization as image/video)

---

## Part 8: Example Agent JSON Trace

```json
{
"simulation_id": "sim_coffee_shop_001",
"start_time": "2024-06-15T10:00:00Z",
"agents": [
 {
 "agent_id": "agent_alice",
 "name": "Alice",
 "color": "#3B82F6"
 },
 {
 "agent_id": "agent_bob",
 "name": "Bob",
 "color": "#10B981"
 },
 {
 "agent_id": "agent_carol",
 "name": "Carol",
 "color": "#A855F7"
 }
],
"locations": [
 {
 "room_id": "coffee_shop",
 "name": "Coffee Shop"
 }
],
"events": [
 {
 "event_id": "evt_001",
 "agent_id": "agent_alice",
 "timestamp": "2024-06-15T10:00:00Z",
 "duration_ms": 1500,
 "event_type": "cognition",
 "location": {
 "room_id": "coffee_shop",
 "x": 10.5,
 "y": 8.2
 },
 "content": {
 "action_verb": "think",
 "text": "I should order coffee",
 "target_agent_id": null
 },
 "internal_state": {
 "reasoning_trace": [
 "I just entered the coffee shop",
 "I need caffeine to start working",
 "I'll approach the counter"
 ],
 "memories_accessed": [],
 "emotion": "neutral"
 },
 "caused_by": [],
 "influences": ["evt_002"]
 },
 {
 "event_id": "evt_002",
 "agent_id": "agent_alice",
 "timestamp": "2024-06-15T10:00:02Z",
 "duration_ms": 2000,
 "event_type": "action",
 "location": {
 "room_id": "coffee_shop",
 "x": 10.5,
 "y": 8.2
 },
 "content": {
 "action_verb": "speak",
 "text": "Hi, I'd like a large cappuccino please.",
 "target_agent_id": null
 },
 "internal_state": {
 "reasoning_trace": [
 "I decided to order",
 "I prefer cappuccino",
 "I'll speak politely to the barista"
 ],
 "memories_accessed": ["mem_alice_coffee_preference"],
 "emotion": "content"
 },
 "caused_by": ["evt_001"],
 "influences": ["evt_003"]
 },
 {
 "event_id": "evt_003",
 "agent_id": "agent_bob",
 "timestamp": "2024-06-15T10:00:03Z",
 "duration_ms": 1200,
 "event_type": "perception",
 "location": {
 "room_id": "coffee_shop",
 "x": 12.0,
 "y": 8.5
 },
 "content": {
 "action_verb": "observe",
 "text": "I heard Alice ordering cappuccino",
 "target_agent_id": "agent_alice"
 },
 "internal_state": {
 "reasoning_trace": [
 "I heard a female voice",
 "That's Alice",
 "She's ordering coffee"
 ],
 "memories_accessed": [],
 "emotion": "neutral"
 },
 "caused_by": ["evt_002"],
 "influences": ["evt_004"]
 },
 {
 "event_id": "evt_004",
 "agent_id": "agent_bob",
 "timestamp": "2024-06-15T10:00:05Z",
 "duration_ms": 2500,
 "event_type": "cognition",
 "location": {
 "room_id": "coffee_shop",
 "x": 12.0,
 "y": 8.5
 },
 "content": {
 "action_verb": "think",
 "text": "Should I say hi to Alice?",
 "target_agent_id": null
 },
 "internal_state": {
 "reasoning_trace": [
 "I noticed Alice is here",
 "We worked together last month",
 "It would be friendly to greet her",
 "I'll walk over and say hello"
 ],
 "memories_accessed": ["mem_bob_alice_project"],
 "emotion": "friendly"
 },
 "caused_by": ["evt_003"],
 "influences": ["evt_005"]
 },
 {
 "event_id": "evt_005",
 "agent_id": "agent_bob",
 "timestamp": "2024-06-15T10:00:08Z",
 "duration_ms": 1800,
 "event_type": "action",
 "location": {
 "room_id": "coffee_shop",
 "x": 11.0,
 "y": 8.3
 },
 "content": {
 "action_verb": "speak",
 "text": "Hey Alice! Good to see you.",
 "target_agent_id": "agent_alice"
 },
 "internal_state": {
 "reasoning_trace": [
 "I'll use a casual greeting",
 "I'll express genuine happiness to see her"
 ],
 "memories_accessed": [],
 "emotion": "friendly"
 },
 "caused_by": ["evt_004"],
 "influences": ["evt_006"]
 },
 {
 "event_id": "evt_006",
 "agent_id": "agent_alice",
 "timestamp": "2024-06-15T10:00:09Z",
 "duration_ms": 1000,
 "event_type": "perception",
 "location": {
 "room_id": "coffee_shop",
 "x": 10.5,
 "y": 8.2
 },
 "content": {
 "action_verb": "observe",
 "text": "I heard Bob greeting me",
 "target_agent_id": "agent_bob"
 },
 "internal_state": {
 "reasoning_trace": [
 "I heard my name",
 "That's Bob's voice",
 "He sounds friendly"
 ],
 "memories_accessed": [],
 "emotion": "surprised-positive"
 },
 "caused_by": ["evt_005"],
 "influences": ["evt_007"]
 },
 {
 "event_id": "evt_007",
 "agent_id": "agent_alice",
 "timestamp": "2024-06-15T10:00:11Z",
 "duration_ms": 2200,
 "event_type": "cognition",
 "location": {
 "room_id": "coffee_shop",
 "x": 10.5,
 "y": 8.2
 },
 "content": {
 "action_verb": "think",
 "text": "How should I respond to Bob?",
 "target_agent_id": null
 },
 "internal_state": {
 "reasoning_trace": [
 "Bob is greeting me warmly",
 "We had a good working relationship",
 "I should reciprocate the warmth",
 "Maybe ask about his current project"
 ],
 "memories_accessed": ["mem_alice_bob_collaboration"],
 "emotion": "pleased"
 },
 "caused_by": ["evt_006"],
 "influences": ["evt_008"]
 },
 {
 "event_id": "evt_008",
 "agent_id": "agent_alice",
 "timestamp": "2024-06-15T10:00:14Z",
 "duration_ms": 2100,
 "event_type": "action",
 "location": {
 "room_id": "coffee_shop",
 "x": 10.5,
 "y": 8.2
 },
 "content": {
 "action_verb": "speak",
 "text": "Bob! Hi! How's the new dashboard feature coming along?",
 "target_agent_id": "agent_bob"
 },
 "internal_state": {
 "reasoning_trace": [
 "I'll greet him back warmly",
 "Show interest in his work",
 "Reference something specific I remember"
 ],
 "memories_accessed": ["mem_bob_dashboard_project"],
 "emotion": "friendly"
 },
 "caused_by": ["evt_007"],
 "influences": ["evt_009"]
 },
 {
 "event_id": "evt_009",
 "agent_id": "agent_carol",
 "timestamp": "2024-06-15T10:00:15Z",
 "duration_ms": 1400,
 "event_type": "perception",
 "location": {
 "room_id": "coffee_shop",
 "x": 8.0,
 "y": 10.0
 },
 "content": {
 "action_verb": "observe",
 "text": "I noticed Alice and Bob talking",
 "target_agent_id": null
 },
 "internal_state": {
 "reasoning_trace": [
 "I hear conversation nearby",
 "That's Alice and Bob",
 "They seem to know each other"
 ],
 "memories_accessed": [],
 "emotion": "curious"
 },
 "caused_by": ["evt_008"],
 "influences": ["evt_010"]
 },
 {
 "event_id": "evt_010",
 "agent_id": "agent_carol",
 "timestamp": "2024-06-15T10:00:17Z",
 "duration_ms": 2600,
 "event_type": "cognition",
 "location": {
 "room_id": "coffee_shop",
 "x": 8.0,
 "y": 10.0
 },
 "content": {
 "action_verb": "think",
 "text": "Should I join their conversation?",
 "target_agent_id": null
 },
 "internal_state": {
 "reasoning_trace": [
 "Alice and Bob are chatting",
 "I'm new here and don't know them well",
 "It might be awkward to interrupt",
 "I'll keep to myself for now",
 "Maybe I'll introduce myself later"
 ],
 "memories_accessed": [],
 "emotion": "slightly-anxious"
 },
 "caused_by": ["evt_009"],
 "influences": []
 },
 {
 "event_id": "evt_011",
 "agent_id": "agent_bob",
 "timestamp": "2024-06-15T10:00:16Z",
 "duration_ms": 1100,
 "event_type": "perception",
 "location": {
 "room_id": "coffee_shop",
 "x": 11.0,
 "y": 8.3
 },
 "content": {
 "action_verb": "observe",
 "text": "Alice asked about my dashboard project",
 "target_agent_id": "agent_alice"
 },
 "internal_state": {
 "reasoning_trace": [
 "Alice remembers my project",
 "She's interested in my work",
 "That's thoughtful of her"
 ],
 "memories_accessed": [],
 "emotion": "appreciated"
 },
 "caused_by": ["evt_008"],
 "influences": ["evt_012"]
 },
 {
 "event_id": "evt_012",
 "agent_id": "agent_bob",
 "timestamp": "2024-06-15T10:00:19Z",
 "duration_ms": 3200,
 "event_type": "action",
 "location": {
 "room_id": "coffee_shop",
 "x": 11.0,
 "y": 8.3
 },
 "content": {
 "action_verb": "speak",
 "text": "It's going well! We just shipped the analytics panel. How about your authentication refactor?",
 "target_agent_id": "agent_alice"
 },
 "internal_state": {
 "reasoning_trace": [
 "I'll share an update on my work",
 "I'll also ask about her project",
 "Show mutual interest"
 ],
 "memories_accessed": ["mem_alice_auth_project"],
 "emotion": "engaged"
 },
 "caused_by": ["evt_011"],
 "influences": []
 }
]
}
```

---

## Part 9: Implementation Guide

### Step-by-Step Setup

#### Backend Setup (30 minutes)

```bash
# 1. Create project
mkdir chronomesh-backend
cd chronomesh-backend
python -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install fastapi uvicorn sqlalchemy

# 3. Create files (see simplified structure above)
# 4. Run
uvicorn main:app --reload

# 5. Load example data
curl -X POST http://localhost:8000/simulations \
-H "Content-Type: application/json" \
-d @example_trace.json
```

#### Frontend Setup (30 minutes)

```bash
# 1. Create project
npx create-react-app chronomesh-frontend --template typescript
cd chronomesh-frontend

# 2. Install dependencies
npm install konva react-konva zustand axios

# 3. Create components (see simplified structure above)
# 4. Run
npm start
```

---

## Part 10: Success Criteria

### MVP is complete when:
- [ ] Can load example_trace.json into backend
- [ ] Frontend shows 3 agent columns with colored blocks
- [ ] Blocks are positioned by timestamp (top = older, bottom = newer)
- [ ] Curved threads connect related events
- [ ] Clicking a block opens detail panel showing reasoning trace
- [ ] Clicking a block dims unrelated events
- [ ] Can zoom in/out with mouse wheel
- [ ] Can pan by dragging canvas

### Visual Quality Checklist:
- [ ] Color palette follows specification
- [ ] Bezier curves are smooth
- [ ] Text is readable at all zoom levels
- [ ] Animations are smooth (60fps)
- [ ] Detail panel slides in/out smoothly
- [ ] No visual glitches when selecting events

---

## Conclusion

This specification provides a **complete yet simplified** path to building ChronoMesh. The key philosophy is:

1. **Start with the core**: Worldlines + blocks + threads
2. **Add interaction**: Click to see details
3. **Refine aesthetics**: Colors, curves, spacing
4. **Then expand**: Bundling, topics, live mode

The Minkowski diagram metaphor gives us a powerful visual language for causality. By keeping the MVP simple, we can validate the core idea before investing in advanced features.
