import { describe, it, expect } from "vitest";
import { threadOpacity } from "./threads";

describe("threadOpacity", () => {
  it("fades when zoomed out", () => {
    expect(threadOpacity(0.5)).toBeCloseTo(0.15, 2);
  });

  it("brightens when zoomed in", () => {
    expect(threadOpacity(2)).toBeCloseTo(0.9, 2);
  });

  it("interpolates mid zoom", () => {
    const mid = threadOpacity(1);
    expect(mid).toBeGreaterThan(0.15);
    expect(mid).toBeLessThan(0.9);
  });
});
