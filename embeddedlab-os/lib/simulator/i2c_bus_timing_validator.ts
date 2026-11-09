/**
 * I2C TWBR Bit Rate Register Generator
 */
export function calculateTwbr(fCpuHz: number, fSclHz: number, twpsPrescaler: 1 | 4 | 16 | 64 = 1): number {
  if (fCpuHz <= 0 || fSclHz <= 0) throw new Error("Invalid parameters");
  const twbr = Math.round(((fCpuHz / fSclHz) - 16) / (2 * twpsPrescaler));
  if (twbr < 0 || twbr > 255) throw new Error(`TWBR out of 8-bit range: ${twbr}`);
  return twbr;
}

export function calculateActualScl(fCpuHz: number, twbr: number, twpsPrescaler: number = 1): number {
  return fCpuHz / (16 + (2 * twbr * twpsPrescaler));
}
