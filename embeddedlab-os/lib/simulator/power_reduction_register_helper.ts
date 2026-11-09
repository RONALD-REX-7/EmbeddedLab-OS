/**
 * Power Reduction Register (PRR) Peripheral State Model
 */
export interface PeripheralPowerState {
  adcDisabled: boolean;
  usart0Disabled: boolean;
  spiDisabled: boolean;
  timer1Disabled: boolean;
  timer0Disabled: boolean;
  timer2Disabled: boolean;
  twiDisabled: boolean;
}

export function parsePrrRegister(prrByte: number): PeripheralPowerState {
  return {
    adcDisabled: (prrByte & (1 << 0)) !== 0,
    usart0Disabled: (prrByte & (1 << 1)) !== 0,
    spiDisabled: (prrByte & (1 << 2)) !== 0,
    timer1Disabled: (prrByte & (1 << 3)) !== 0,
    timer0Disabled: (prrByte & (1 << 5)) !== 0,
    timer2Disabled: (prrByte & (1 << 6)) !== 0,
    twiDisabled: (prrByte & (1 << 7)) !== 0,
  };
}
