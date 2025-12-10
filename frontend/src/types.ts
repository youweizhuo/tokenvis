export type Agent = {
  agent_id: string;
  name: string;
  color: string;
};

export type AgentEvent = {
  event_id: string;
  agent_id: string;
  timestamp: string;
  duration_ms: number;
  event_type: "perception" | "cognition" | "action" | "error";
  location: {
    room_id: string;
    x: number;
    y: number;
  };
  content: {
    action_verb: string;
    text: string;
    target_agent_id?: string | null;
  };
  internal_state: {
    reasoning_trace: string[];
    memories_accessed: string[];
    emotion?: string | null;
  };
  caused_by: string[];
  influences: string[];
};
