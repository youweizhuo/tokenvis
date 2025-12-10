import { create } from "zustand";

type SelectionState = {
  selectedEventId: string | null;
  setSelectedEventId: (eventId: string) => void;
  clearSelection: () => void;
};

export const useSelection = create<SelectionState>((set) => ({
  selectedEventId: null,
  setSelectedEventId: (eventId) => set({ selectedEventId: eventId }),
  clearSelection: () => set({ selectedEventId: null }),
}));
