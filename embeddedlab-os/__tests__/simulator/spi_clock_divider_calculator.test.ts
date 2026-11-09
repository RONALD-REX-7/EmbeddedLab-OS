import { describe, it, expect } from "vitest";
import { calculateSpiClock, getSpiRegisterBits } from "@/lib/simulator/spi_clock_divider_calculator";

describe("SPI Clock Divider Calculator", () => {
  it("calculates 4 MHz SPI clock for 16MHz CPU with divider 4", () => {
    expect(calculateSpiClock(16_000_000, 4)).toBe(4_000_000);
  });
  it("configures double-speed SPI2X for divider 2", () => {
    expect(getSpiRegisterBits(2).spi2x).toBe(1);
  });
});
