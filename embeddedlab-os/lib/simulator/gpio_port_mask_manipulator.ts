/**
 * GPIO Port Register Bitmask Engine
 */
export function setPinDirection(ddr: number, pin: number, isOutput: boolean): number {
  if (pin < 0 || pin > 7) throw new Error("Pin must be 0-7");
  return isOutput ? (ddr | (1 << pin)) : (ddr & ~(1 << pin));
}

export function writePinOutput(port: number, pin: number, isHigh: boolean): number {
  if (pin < 0 || pin > 7) throw new Error("Pin must be 0-7");
  return isHigh ? (port | (1 << pin)) : (port & ~(1 << pin));
}

export function readPinInput(pinReg: number, pin: number): boolean {
  if (pin < 0 || pin > 7) throw new Error("Pin must be 0-7");
  return (pinReg & (1 << pin)) !== 0;
}
