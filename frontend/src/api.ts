import axios from "axios";
import { Agent, AgentEvent } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const SIM_ID = import.meta.env.VITE_SIMULATION_ID ?? "sim_coffee_shop_001";

export const fetchAgents = async (): Promise<Agent[]> => {
  const res = await axios.get<Agent[]>(`${API_URL}/simulations/${SIM_ID}/agents`);
  return res.data;
};

export const fetchEvents = async (): Promise<AgentEvent[]> => {
  const res = await axios.get<AgentEvent[]>(`${API_URL}/simulations/${SIM_ID}/events`);
  return res.data;
};
