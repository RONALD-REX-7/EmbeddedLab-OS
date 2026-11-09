import { describe, it, expect } from "vitest";
import { calculatePwmResolutionBits, calculateDiscreteVoltageStep } from "@/lib/simulator/pwm_resolution_analyzer";

describe("PWM Resolution Analyzer", () => {
  it("calculates 8-bit resolution for TOP=255", () => {
    expect(calculatePwmResolutionBits(255)).toBe(8);
  });
  it("calculates discrete step in millivolts", () => {
    const step = calculateDiscreteVoltageStep(5.0, 999);
    expect(step).toBe(0.005); // 5mV
  });
});
