import { describe, it, expect } from "vitest";
import { calculateOversampleFactor, decimateSamples } from "@/lib/simulator/analog_oversampling_engine";

describe("Analog Oversampling Engine", () => {
  it("calculates factor 16 for 2 extra bits (10-bit to 12-bit)", () => {
    expect(calculateOversampleFactor(2)).toBe(16);
  });
  it("decimates 16 samples correctly", () => {
    const sum = 512 * 16;
    expect(decimateSamples(sum, 2)).toBe(2048);
  });
});
