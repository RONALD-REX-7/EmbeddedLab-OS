/**
 * UART Baud Rate & UBRR0 Register Estimator
 */
export function calculateUbrr(fCpuHz: number, baudRate: number, doubleSpeed: boolean = false): number {
  if (fCpuHz <= 0 || baudRate <= 0) throw new Error("Invalid parameters");
  const divisor = doubleSpeed ? 8 : 16;
  return Math.round(fCpuHz / (divisor * baudRate)) - 1;
}

export function calculateActualBaudRate(fCpuHz: number, ubrr: number, doubleSpeed: boolean = false): number {
  const divisor = doubleSpeed ? 8 : 16;
  return fCpuHz / (divisor * (ubrr + 1));
}

export function calculateBaudErrorPercent(fCpuHz: number, targetBaud: number, doubleSpeed: boolean = false): number {
  const ubrr = calculateUbrr(fCpuHz, targetBaud, doubleSpeed);
  const actual = calculateActualBaudRate(fCpuHz, ubrr, doubleSpeed);
  return ((actual - targetBaud) / targetBaud) * 100;
}
