/**
 * EmbeddedLab OS — lib/challenges/adc-validators.ts
 * Pure deterministic validation functions for ADC challenges.
 * Validates actual microcontroller simulator state — never UI clicks.
 */
import type { MicrocontrollerState, ValidationResult } from "@/types/simulator";
import { calculateADCDerivedValues } from "@/lib/simulator/adc";

/**
 * Challenge 1: Reach a target raw ADC value of 2048 (±10 counts) on Channel 0 (12-bit, Vref = 3.3V).
 */
export function validateADCChallenge1(state: MicrocontrollerState): ValidationResult {
  const ch = state.adc.channels[0];
  if (!ch) {
    return {
      passed: false,
      score: 0,
      feedback: "ADC Channel 0 not found.",
      conditions: [{ label: "Channel Exists", passed: false }],
    };
  }

  const derived = calculateADCDerivedValues(ch.inputVoltage, ch.referenceVoltage, ch.resolution);
  const is12Bit = ch.resolution === 12;
  const isVref33 = Math.abs(ch.referenceVoltage - 3.3) < 0.01;
  const targetADC = 2048;
  const isAdcTargetReached = Math.abs(derived.digitalValue - targetADC) <= 10;
  const passed = is12Bit && isVref33 && isAdcTargetReached;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? `Challenge Passed! Raw ADC value ${derived.digitalValue} reached target mid-scale (2048) on 12-bit resolution.`
      : `Challenge Failed. Adjust Vin to ~1.65V to produce raw ADC count ~2048 (Current: ${derived.digitalValue}).`,
    conditions: [
      {
        label: "Resolution set to 12-bit",
        passed: is12Bit,
        detail: `Current: ${ch.resolution}-bit`,
      },
      {
        label: "Vref set to 3.3V",
        passed: isVref33,
        detail: `Current: ${ch.referenceVoltage}V`,
      },
      {
        label: "Raw ADC Value equals 2048 (±10 counts)",
        passed: isAdcTargetReached,
        detail: `Current raw count: ${derived.digitalValue} / 4095`,
      },
    ],
  };
}

/**
 * Challenge 2: Reach a target input voltage of 2.50V (±0.05V) on Channel 0 (12-bit, Vref = 3.3V).
 */
export function validateADCChallenge2(state: MicrocontrollerState): ValidationResult {
  const ch = state.adc.channels[0];
  if (!ch) {
    return {
      passed: false,
      score: 0,
      feedback: "ADC Channel 0 not found.",
      conditions: [{ label: "Channel Exists", passed: false }],
    };
  }

  const targetVin = 2.50;
  const isVinCorrect = Math.abs(ch.inputVoltage - targetVin) <= 0.05;
  const is12Bit = ch.resolution === 12;
  const isVref33 = Math.abs(ch.referenceVoltage - 3.3) < 0.01;
  const passed = isVinCorrect && is12Bit && isVref33;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? `Challenge Passed! Input voltage ${ch.inputVoltage.toFixed(2)}V correctly set within ±0.05V of 2.50V.`
      : `Challenge Failed. Adjust potentiometer input voltage Vin to 2.50V (Current: ${ch.inputVoltage.toFixed(2)}V).`,
    conditions: [
      {
        label: "Input voltage Vin set to 2.50V (±0.05V)",
        passed: isVinCorrect,
        detail: `Current: ${ch.inputVoltage.toFixed(2)}V`,
      },
      {
        label: "Resolution set to 12-bit",
        passed: is12Bit,
        detail: `Current: ${ch.resolution}-bit`,
      },
      {
        label: "Vref set to 3.3V",
        passed: isVref33,
        detail: `Current: ${ch.referenceVoltage}V`,
      },
    ],
  };
}

/**
 * Challenge 3: Diagnose incorrect Vref/resolution condition (reconfigure from 8-bit/1.8V to 12-bit/3.3V and set Vin = 1.65V).
 */
export function validateADCChallenge3(state: MicrocontrollerState): ValidationResult {
  const ch = state.adc.channels[0];

  const is12Bit = ch?.resolution === 12;
  const isVref33 = Math.abs((ch?.referenceVoltage || 0) - 3.3) < 0.01;
  const isVinMid = Math.abs((ch?.inputVoltage || 0) - 1.65) <= 0.05;
  const passed = is12Bit && isVref33 && isVinMid;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Diagnosis Complete! ADC reconfigured to 12-bit, 3.3V reference, and Vin = 1.65V."
      : "Challenge Failed. Set resolution to 12-bit, Vref to 3.3V, and Vin to 1.65V.",
    conditions: [
      {
        label: "Resolution reconfigured to 12-bit",
        passed: is12Bit,
        detail: `Current: ${ch?.resolution}-bit`,
      },
      {
        label: "Reference Voltage set to 3.3V",
        passed: isVref33,
        detail: `Current: ${ch?.referenceVoltage}V`,
      },
      {
        label: "Input Voltage Vin set to 1.65V",
        passed: isVinMid,
        detail: `Current: ${ch?.inputVoltage.toFixed(2)}V`,
      },
    ],
  };
}
