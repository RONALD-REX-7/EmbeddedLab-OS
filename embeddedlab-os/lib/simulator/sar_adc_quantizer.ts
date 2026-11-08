/**
 * EmbeddedLab OS — lib/simulator/sar_adc_quantizer.ts
 *
 * Successive Approximation Register (SAR) ADC Quantizer & Step Simulation Engine.
 * Pure TypeScript — zero UI dependencies, deterministic execution.
 *
 * Models the binary-search DAC feedback comparator topology typical of microcontrollers
 * including ATmega328P (10-bit), STM32 (12-bit), and ESP32-S3 (12-bit SAR ADC).
 *
 * Core ATmega328P Datasheet Mapping:
 * - Conversion formula: ADC = floor((Vin * 2^N) / Vref)
 * - Clock prescaler options: 2, 4, 8, 16, 32, 64, 128 (optimal ADC clock 50kHz - 200kHz)
 * - Conversion cycles: Normal = 13 ADC clock cycles; First conversion = 25 cycles
 * - Reference Multiplexer (ADMUX REFS1:REFS0):
 *     00: External AREF
 *     01: AVCC with external capacitor at AREF pin
 *     10: Reserved
 *     11: Internal 1.1V Bandgap Reference
 */

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export type VoltageReferenceSource = "AREF" | "AVCC" | "INTERNAL_1V1" | "INTERNAL_2V56";

export type ADCPrescaler = 2 | 4 | 8 | 16 | 32 | 64 | 128;

export interface SARBitTrial {
  bit: number;
  trialValue: number;
  dacVoltage: number;
  comparatorOutput: boolean;
  accumulatedValue: number;
}

export interface SARQuantizerConfig {
  resolutionBits: number;
  referenceSource: VoltageReferenceSource;
  arefExternalVolts: number;
  avccVolts: number;
  cpuFrequencyHz: number;
  prescaler: ADCPrescaler;
  isFirstConversion: boolean;
}

export interface SARConversionResult {
  rawCode: number;
  maxCode: number;
  reconstructedVoltage: number;
  quantizationErrorVolts: number;
  quantizationErrorLsb: number;
  lsbVoltage: number;
  effectiveVref: number;
  trials: SARBitTrial[];
  conversionTimeUs: number;
  clockCycles: number;
  adcClockHz: number;
  isClockOptimal: boolean;
}

export interface NonLinearityMetrics {
  dnl: number[];
  inl: number[];
  maxDnl: number;
  maxInl: number;
}

// ---------------------------------------------------------------------------
// Default Configuration Constants
// ---------------------------------------------------------------------------

export const DEFAULT_SAR_CONFIG: Readonly<SARQuantizerConfig> = Object.freeze({
  resolutionBits: 10,
  referenceSource: "AVCC",
  arefExternalVolts: 5.0,
  avccVolts: 5.0,
  cpuFrequencyHz: 16_000_000, // 16 MHz standard Arduino Uno / Nano crystal
  prescaler: 128,              // 16MHz / 128 = 125 kHz
  isFirstConversion: false,
});

export const OPTIMAL_ADC_CLOCK_MIN_HZ = 50_000;  // 50 kHz
export const OPTIMAL_ADC_CLOCK_MAX_HZ = 200_000; // 200 kHz

// ---------------------------------------------------------------------------
// Helper & Calculation Functions
// ---------------------------------------------------------------------------

/**
 * Resolves the effective reference voltage based on the configured source.
 * Throws an Error if the resulting reference voltage is <= 0.
 */
export function resolveEffectiveVref(
  config: Pick<SARQuantizerConfig, "referenceSource" | "arefExternalVolts" | "avccVolts">
): number {
  let vref: number;

  switch (config.referenceSource) {
    case "AREF":
      vref = config.arefExternalVolts;
      break;
    case "AVCC":
      vref = config.avccVolts;
      break;
    case "INTERNAL_1V1":
      vref = 1.1;
      break;
    case "INTERNAL_2V56":
      vref = 2.56;
      break;
    default: {
      const exhaustiveCheck: never = config.referenceSource;
      throw new Error(`Unhandled reference source: ${exhaustiveCheck}`);
    }
  }

  if (vref <= 0 || !Number.isFinite(vref)) {
    throw new Error(`Effective reference voltage must be positive and finite. Received: ${vref}V`);
  }

  return vref;
}

/**
 * Calculates ADC clock frequency given CPU frequency and ADC prescaler divisor.
 */
export function calculateAdcClockFrequency(cpuFreqHz: number, prescaler: ADCPrescaler): number {
  if (cpuFreqHz <= 0 || !Number.isFinite(cpuFreqHz)) {
    throw new Error(`CPU frequency must be positive and finite. Received: ${cpuFreqHz}Hz`);
  }
  return cpuFreqHz / prescaler;
}

/**
 * Checks whether the ADC clock frequency is within the recommended 50kHz - 200kHz range.
 */
export function isAdcClockWithinOptimalRange(clockHz: number): boolean {
  return clockHz >= OPTIMAL_ADC_CLOCK_MIN_HZ && clockHz <= OPTIMAL_ADC_CLOCK_MAX_HZ;
}

/**
 * Calculates conversion duration in microseconds based on clock cycles and ADC clock.
 */
export function calculateConversionTimeUs(clockCycles: number, adcClockHz: number): number {
  if (adcClockHz <= 0) {
    throw new Error("ADC clock frequency must be greater than zero");
  }
  return (clockCycles / adcClockHz) * 1_000_000;
}

// ---------------------------------------------------------------------------
// Main SAR Conversion Simulator
// ---------------------------------------------------------------------------

/**
 * Simulates a hardware Successive Approximation Register (SAR) binary-search trial sequence.
 *
 * @param vin The analog input voltage in volts. Clamped to [0, effectiveVref].
 * @param userConfig Partial configuration overrides.
 * @returns Complete SAR conversion trace, bit trials, timing, and error metrics.
 */
export function simulateSARConversion(
  vin: number,
  userConfig?: Partial<SARQuantizerConfig>
): SARConversionResult {
  const config: SARQuantizerConfig = {
    ...DEFAULT_SAR_CONFIG,
    ...userConfig,
  };

  if (config.resolutionBits < 1 || config.resolutionBits > 16 || !Number.isInteger(config.resolutionBits)) {
    throw new Error(`Resolution bits must be an integer between 1 and 16. Received: ${config.resolutionBits}`);
  }

  const effectiveVref = resolveEffectiveVref(config);
  const clampedVin = Math.min(Math.max(vin, 0), effectiveVref);

  const totalSteps = Math.pow(2, config.resolutionBits);
  const maxCode = totalSteps - 1;
  const lsbVoltage = effectiveVref / totalSteps;

  const trials: SARBitTrial[] = [];
  let accumulatedValue = 0;

  // Step-by-step binary search from MSB down to LSB
  for (let bit = config.resolutionBits - 1; bit >= 0; bit--) {
    const trialValue = accumulatedValue | (1 << bit);
    const dacVoltage = (trialValue / totalSteps) * effectiveVref;
    const comparatorOutput = clampedVin >= dacVoltage;

    if (comparatorOutput) {
      accumulatedValue = trialValue;
    }

    trials.push({
      bit,
      trialValue,
      dacVoltage,
      comparatorOutput,
      accumulatedValue,
    });
  }

  const rawCode = Math.min(accumulatedValue, maxCode);
  const reconstructedVoltage = (rawCode / totalSteps) * effectiveVref;
  const quantizationErrorVolts = clampedVin - reconstructedVoltage;
  const quantizationErrorLsb = lsbVoltage > 0 ? quantizationErrorVolts / lsbVoltage : 0;

  const adcClockHz = calculateAdcClockFrequency(config.cpuFrequencyHz, config.prescaler);
  const clockCycles = config.isFirstConversion ? 25 : 13;
  const conversionTimeUs = calculateConversionTimeUs(clockCycles, adcClockHz);
  const isClockOptimal = isAdcClockWithinOptimalRange(adcClockHz);

  return {
    rawCode,
    maxCode,
    reconstructedVoltage,
    quantizationErrorVolts,
    quantizationErrorLsb,
    lsbVoltage,
    effectiveVref,
    trials,
    conversionTimeUs,
    clockCycles,
    adcClockHz,
    isClockOptimal,
  };
}

// ---------------------------------------------------------------------------
// Non-Linearity Analysis (DNL / INL)
// ---------------------------------------------------------------------------

/**
 * Computes Differential Non-Linearity (DNL) and Integral Non-Linearity (INL) in LSB units.
 * Useful for validating ADC linearity against synthetic transfer curves.
 */
export function calculateNonLinearity(
  idealCodes: number[],
  measuredCodes: number[]
): NonLinearityMetrics {
  if (idealCodes.length !== measuredCodes.length) {
    throw new Error("Ideal and measured code arrays must have identical length");
  }
  if (idealCodes.length < 2) {
    return { dnl: [], inl: [], maxDnl: 0, maxInl: 0 };
  }

  const dnl: number[] = [];
  const inl: number[] = [];

  let accumulatedInl = 0;
  let maxDnl = 0;
  let maxInl = 0;

  for (let i = 1; i < idealCodes.length; i++) {
    const idealStep = idealCodes[i] - idealCodes[i - 1];
    const measuredStep = measuredCodes[i] - measuredCodes[i - 1];
    const stepDnl = idealStep !== 0 ? (measuredStep - idealStep) / idealStep : 0;

    accumulatedInl += stepDnl;

    dnl.push(stepDnl);
    inl.push(accumulatedInl);

    if (Math.abs(stepDnl) > maxDnl) maxDnl = Math.abs(stepDnl);
    if (Math.abs(accumulatedInl) > maxInl) maxInl = Math.abs(accumulatedInl);
  }

  return { dnl, inl, maxDnl, maxInl };
}
