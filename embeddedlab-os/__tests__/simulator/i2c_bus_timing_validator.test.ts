import { describe, it, expect } from "vitest";
import { calculateTwbr, calculateActualScl } from "@/lib/simulator/i2c_bus_timing_validator";

describe("I2C Bus Timing Validator", () => {
  it("calculates TWBR = 72 for 100 kHz SCL at 16 MHz with prescaler 1", () => {
    expect(calculateTwbr(16_000_000, 100_000, 1)).toBe(72);
  });
  it("calculates TWBR = 12 for 400 kHz fast mode", () => {
    expect(calculateTwbr(16_000_000, 400_000, 1)).toBe(12);
  });
});
