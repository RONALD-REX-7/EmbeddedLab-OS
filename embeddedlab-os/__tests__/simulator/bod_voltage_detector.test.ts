import { describe, it, expect } from "vitest";
import { getBodThresholdVolts, isBrownoutTriggered } from "@/lib/simulator/bod_voltage_detector";

describe("BOD Voltage Detector", () => {
  it("detects brownout when 4.3V threshold is active and VCC is 4.1V", () => {
    expect(isBrownoutTriggered(4.1, "4V3")).toBe(true);
  });
  it("does not trigger when VCC is healthy (5.0V)", () => {
    expect(isBrownoutTriggered(5.0, "4V3")).toBe(false);
  });
});
