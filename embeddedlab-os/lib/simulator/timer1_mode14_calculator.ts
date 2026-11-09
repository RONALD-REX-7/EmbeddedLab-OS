/**
 * 16-Bit Timer1 Mode 14 Fast PWM Calculator
 */
export function calculateIcr1Top(fCpuHz: number, prescaler: number, targetFreqHz: number): number {
  if (fCpuHz <= 0 || targetFreqHz <= 0 || prescaler <= 0) throw new Error("Parameters must be positive");
  const top = Math.round(fCpuHz / (prescaler * targetFreqHz)) - 1;
  if (top < 1 || top > 65535) throw new Error(`ICR1 out of 16-bit range: ${top}`);
  return top;
}

export function calculatePwmFrequency(fCpuHz: number, prescaler: number, icr1Top: number): number {
  return fCpuHz / (prescaler * (icr1Top + 1));
}

export function calculateOcr1aDuty(icr1Top: number, dutyPercent: number): number {
  const clamped = Math.max(0, Math.min(100, dutyPercent));
  return Math.round((clamped / 100) * icr1Top);
}
