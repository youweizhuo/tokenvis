import { THREAD_OPACITY_MIN, THREAD_OPACITY_MAX } from "./constants";

export function threadOpacity(scale: number): number {
  // Fade threads when zoomed far out; brighten when zoomed in
  const normalized = Math.min(Math.max(scale, 0.5), 2); // clamp
  const t = (normalized - 0.5) / (2 - 0.5);
  return THREAD_OPACITY_MIN + t * (THREAD_OPACITY_MAX - THREAD_OPACITY_MIN);
}
