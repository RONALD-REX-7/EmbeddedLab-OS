/**
 * ADC Prescaler Divisor Calculator
 * Pure TypeScript — calculates ADC clock frequencies and optimal bandwidth for ATmega328P.
 */
export type Prescaler = 2 | 4 | 8 | 16 | 32 | 64 | 128;

export function calculateAdcClock(cpuFreqHz: number, prescaler: Prescaler): number {
  if (cpuFreqHz <= 0) throw new Error("CPU frequency must be positive");
  return cpuFreqHz / prescaler;
}

export function isAdcClockOptimal(clockHz: number): boolean {
  return clockHz >= 50_000 && clockHz <= 200_000;
}

export function selectOptimalPrescaler(cpuFreqHz: number): Prescaler {
  const prescalers: Prescaler[] = [2, 4, 8, 16, 32, 64, 128];
  for (const p of prescalers) {
    const clock = calculateAdcClock(cpuFreqHz, p);
    if (isAdcClockOptimal(clock)) return p;
  }
  return 128; // safe fallback
}
