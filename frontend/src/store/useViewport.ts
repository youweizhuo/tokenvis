import { create } from "zustand";

type ViewportState = {
  scale: number;
  offset: { x: number; y: number };
  setScale: (scale: number) => void;
  setOffset: (offset: { x: number; y: number }) => void;
};

export const useViewport = create<ViewportState>((set) => ({
  scale: 1,
  offset: { x: 0, y: 0 },
  setScale: (scale) => set({ scale }),
  setOffset: (offset) => set({ offset }),
}));
