import { describe, it, expect } from "vitest";
import { setPinDirection, writePinOutput, readPinInput } from "@/lib/simulator/gpio_port_mask_manipulator";

describe("GPIO Port Mask Manipulator", () => {
  it("configures pin 5 as output", () => {
    expect(setPinDirection(0x00, 5, true)).toBe(0x20);
  });
  it("clears pin 5 to input", () => {
    expect(setPinDirection(0xFF, 5, false)).toBe(0xDF);
  });
  it("reads pin high correctly", () => {
    expect(readPinInput(0x20, 5)).toBe(true);
    expect(readPinInput(0x00, 5)).toBe(false);
  });
});
