import { describe, it, expect } from "vitest";
import { parsePrrRegister } from "@/lib/simulator/power_reduction_register_helper";

describe("Power Reduction Register Helper", () => {
  it("parses all peripherals enabled when PRR = 0", () => {
    const state = parsePrrRegister(0x00);
    expect(state.adcDisabled).toBe(false);
    expect(state.timer1Disabled).toBe(false);
  });
  it("detects disabled ADC when bit 0 is set", () => {
    expect(parsePrrRegister(0x01).adcDisabled).toBe(true);
  });
});
