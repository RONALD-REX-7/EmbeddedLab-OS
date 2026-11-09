import { describe, it, expect } from "vitest";
import { getWdtTimeoutMs } from "@/lib/simulator/watchdog_prescaler_mapper";

describe("Watchdog Prescaler Mapper", () => {
  it("returns 1000ms for code 6", () => {
    expect(getWdtTimeoutMs(6)).toBe(1000);
  });
  it("returns 8000ms for code 9", () => {
    expect(getWdtTimeoutMs(9)).toBe(8000);
  });
  it("throws on invalid code", () => {
    expect(() => getWdtTimeoutMs(10)).toThrow();
  });
});
