import { describe, it, expect, beforeEach } from "vitest";
import { SimulationEngine } from "@/lib/simulator/engine";
import { calculateADCDerivedValues } from "@/lib/simulator/adc";
import {
  validateADCChallenge1,
  validateADCChallenge2,
  validateADCChallenge3,
} from "@/lib/challenges/adc-validators";

describe("ADC Formula & Challenge Validation Invariants", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  it("should calculate ADC raw digital count correctly for 0V, mid-scale, and full-scale", () => {
    // 0V input -> 0 count
    let derived = calculateADCDerivedValues(0.0, 3.3, 12);
    expect(derived.digitalValue).toBe(0);
    expect(derived.maxDigitalValue).toBe(4095);

    // Full scale input (3.3V) -> 4095 count
    derived = calculateADCDerivedValues(3.3, 3.3, 12);
    expect(derived.digitalValue).toBe(4095);

    // Mid scale input (1.65V) -> 2048 count
    derived = calculateADCDerivedValues(1.65, 3.3, 12);
    expect(derived.digitalValue).toBe(2048);
  });

  it("should calculate correct LSB step size for different resolutions", () => {
    // 8-bit: MAX = 255. LSB = 3300mV / 255 = 12.94 mV
    let derived = calculateADCDerivedValues(1.65, 3.3, 8);
    expect(derived.maxDigitalValue).toBe(255);
    expect(derived.digitalValue).toBe(128); // 127.5 rounded = 128
    expect(derived.lsbMillivolts).toBeCloseTo(12.941, 2);

    // 10-bit: MAX = 1023. LSB = 3300mV / 1023 = 3.226 mV
    derived = calculateADCDerivedValues(1.65, 3.3, 10);
    expect(derived.maxDigitalValue).toBe(1023);
    expect(derived.digitalValue).toBe(512);

    // 16-bit: MAX = 65535
    derived = calculateADCDerivedValues(3.3, 3.3, 16);
    expect(derived.maxDigitalValue).toBe(65535);
    expect(derived.digitalValue).toBe(65535);
  });

  it("should clamp input voltage to [0, Vref]", () => {
    // Input higher than Vref should clamp to max count
    let derived = calculateADCDerivedValues(5.0, 3.3, 12);
    expect(derived.digitalValue).toBe(4095);

    // Negative input should clamp to 0
    derived = calculateADCDerivedValues(-1.0, 3.3, 12);
    expect(derived.digitalValue).toBe(0);
  });

  it("validateADCChallenge1 — should validate 2048 raw count at 12-bit, 3.3V", () => {
    let result = validateADCChallenge1(engine.state);
    expect(result.passed).toBe(false);

    engine.adcSetReferenceVoltage(0, 3.3);
    engine.adcSetResolution(0, 12);
    engine.adcSetInputVoltage(0, 1.65);

    result = validateADCChallenge1(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("validateADCChallenge1 — should accept small rounding differences in raw ADC count", () => {
    engine.adcSetReferenceVoltage(0, 3.3);
    engine.adcSetResolution(0, 12);
    // 1.655V yields 2055 counts (within ±10 threshold of 2048)
    engine.adcSetInputVoltage(0, 1.655);

    const result = validateADCChallenge1(engine.state);
    expect(result.passed).toBe(true);
  });

  it("validateADCChallenge2 — should validate 2.50V input voltage", () => {
    let result = validateADCChallenge2(engine.state);
    expect(result.passed).toBe(false);

    engine.adcSetReferenceVoltage(0, 3.3);
    engine.adcSetResolution(0, 12);
    engine.adcSetInputVoltage(0, 2.50);

    result = validateADCChallenge2(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("validateADCChallenge3 — should validate diagnosis of 8-bit/1.8V to 12-bit/3.3V and Vin=1.65V", () => {
    engine.adcSetResolution(0, 8);
    engine.adcSetReferenceVoltage(0, 1.8);

    let result = validateADCChallenge3(engine.state);
    expect(result.passed).toBe(false);

    engine.adcSetResolution(0, 12);
    engine.adcSetReferenceVoltage(0, 3.3);
    engine.adcSetInputVoltage(0, 1.65);

    result = validateADCChallenge3(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });
});
