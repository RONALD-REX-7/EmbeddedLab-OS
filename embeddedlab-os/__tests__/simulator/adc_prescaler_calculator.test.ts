import { describe, it, expect } from "vitest";
import { calculateAdcClock, isAdcClockOptimal, selectOptimalPrescaler } from "@/lib/simulator/adc_prescaler_calculator";

describe("ADC Prescaler Divisor Calculator", () => {
  it("calculates 125 kHz for 16MHz clock with 128 prescaler", () => {
    expect(calculateAdcClock(16_000_000, 128)).toBe(125_000);
  });
  it("identifies 125 kHz as optimal", () => {
    expect(isAdcClockOptimal(125_000)).toBe(true);
  });
  it("selects 128 for 16MHz CPU", () => {
    expect(selectOptimalPrescaler(16_000_000)).toBe(128);
  });
  it("throws on invalid CPU frequency", () => {
    expect(() => calculateAdcClock(0, 128)).toThrow();
  });
});
