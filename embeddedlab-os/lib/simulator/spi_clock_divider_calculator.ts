/**
 * SPI Clock Divider & Prescaler Model
 */
export type SpiDivider = 2 | 4 | 8 | 16 | 32 | 64 | 128;

export function calculateSpiClock(fCpuHz: number, divider: SpiDivider): number {
  if (fCpuHz <= 0) throw new Error("Invalid CPU clock");
  return fCpuHz / divider;
}

export function getSpiRegisterBits(divider: SpiDivider): { spr0: number; spr1: number; spi2x: number } {
  switch (divider) {
    case 2: return { spr0: 0, spr1: 0, spi2x: 1 };
    case 4: return { spr0: 0, spr1: 0, spi2x: 0 };
    case 8: return { spr0: 1, spr1: 0, spi2x: 1 };
    case 16: return { spr0: 1, spr1: 0, spi2x: 0 };
    case 32: return { spr0: 0, spr1: 1, spi2x: 1 };
    case 64: return { spr0: 0, spr1: 1, spi2x: 0 };
    case 128: return { spr0: 1, spr1: 1, spi2x: 0 };
  }
}
