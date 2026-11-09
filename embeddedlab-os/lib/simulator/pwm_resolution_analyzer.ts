/**
 * PWM Discrete Resolution Analyzer
 */
export function calculatePwmResolutionBits(icr1Top: number): number {
  if (icr1Top <= 0) throw new Error("TOP must be positive");
  return Math.log2(icr1Top + 1);
}

export function calculateDiscreteVoltageStep(vccVolts: number, icr1Top: number): number {
  if (icr1Top <= 0 || vccVolts <= 0) throw new Error("Invalid parameters");
  return vccVolts / (icr1Top + 1);
}
