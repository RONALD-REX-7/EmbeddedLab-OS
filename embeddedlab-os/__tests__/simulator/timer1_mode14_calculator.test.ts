import { describe, it, expect } from "vitest";
import { calculateIcr1Top, calculatePwmFrequency, calculateOcr1aDuty } from "@/lib/simulator/timer1_mode14_calculator";

describe("Timer1 Mode 14 Calculator", () => {
  it("calculates ICR1 = 639 for 25kHz PWM at 16MHz (prescaler 1)", () => {
    expect(calculateIcr1Top(16_000_000, 1, 25_000)).toBe(639);
  });
  it("calculates accurate frequency from ICR1", () => {
    expect(calculatePwmFrequency(16_000_000, 1, 639)).toBe(25_000);
  });
  it("computes 50% duty cycle register value", () => {
    expect(calculateOcr1aDuty(639, 50)).toBe(320);
  });
});
