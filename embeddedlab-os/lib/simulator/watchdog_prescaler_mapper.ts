/**
 * Watchdog Timer Prescaler Timeout Model
 */
export const WDT_TIMEOUT_MS: Record<number, number> = {
  0: 16,
  1: 32,
  2: 64,
  3: 128,
  4: 250,
  5: 500,
  6: 1000,
  7: 2000,
  8: 4000,
  9: 8000,
};

export function getWdtTimeoutMs(prescalerCode: number): number {
  const timeout = WDT_TIMEOUT_MS[prescalerCode];
  if (timeout === undefined) throw new Error(`Invalid WDT prescaler code: ${prescalerCode}`);
  return timeout;
}
