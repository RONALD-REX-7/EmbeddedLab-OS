import { describe, it, expect } from "vitest";
import { parseSenseControl } from "@/lib/simulator/interrupt_sense_control_parser";

describe("Interrupt Sense Control Parser", () => {
  it("identifies falling edge trigger (ISC=2)", () => {
    expect(parseSenseControl(1, 0)).toBe("FALLING_EDGE");
  });
  it("identifies rising edge trigger (ISC=3)", () => {
    expect(parseSenseControl(1, 1)).toBe("RISING_EDGE");
  });
});
