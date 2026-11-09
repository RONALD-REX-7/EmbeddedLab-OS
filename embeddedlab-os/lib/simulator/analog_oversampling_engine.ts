/**
 * ADC 4^n Oversampling & Decimation Engine
 */
export function calculateOversampleFactor(additionalBits: number): number {
  if (additionalBits < 0 || additionalBits > 6) throw new Error("Additional bits must be 0-6");
  return Math.pow(4, additionalBits);
}

export function decimateSamples(sampleSum: number, additionalBits: number): number {
  if (additionalBits < 0) throw new Error("Bits must be non-negative");
  return Math.floor(sampleSum / Math.pow(2, additionalBits));
}
