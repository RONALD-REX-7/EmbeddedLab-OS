import { describe, it, expect } from "vitest";
import { calculateUbrr, calculateActualBaudRate, calculateBaudErrorPercent } from "@/lib/simulator/uart_baud_rate_calculator";

describe("UART Baud Rate Calculator", () => {
  it("calculates UBRR = 103 for 9600 baud at 16MHz", () => {
    expect(calculateUbrr(16_000_000, 9600, false)).toBe(103);
  });
  it("computes error percent within 0.2% for 9600 baud", () => {
    const error = calculateBaudErrorPercent(16_000_000, 9600, false);
    expect(Math.abs(error)).toBeLessThan(0.2);
  });
});
