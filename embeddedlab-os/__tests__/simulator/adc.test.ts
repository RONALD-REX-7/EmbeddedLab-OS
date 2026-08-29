/**
 * EmbeddedLab OS — ADC Simulator Unit Tests
 *
 * Tests the canonical ADC formula and all boundary conditions.
 * These tests must pass before any UI is considered correct.
 */
import { describe, it, expect } from "vitest";
import {
  calculateADCDerivedValues,
  createDefaultADCState,
  setChannelInputVoltage,
  setChannelResolution,
  setChannelReferenceVoltage,
} from "@/lib/simulator/adc";

describe("calculateADCDerivedValues", () => {
  describe("core formula: ADC = floor((Vin / Vref) × (2^N - 1))", () => {
    it("produces 0 when Vin = 0V", () => {
      const result = calculateADCDerivedValues(0, 3.3, 12);
      expect(result.digitalValue).toBe(0);
    });

    it("produces max value when Vin = Vref", () => {
      const result = calculateADCDerivedValues(3.3, 3.3, 12);
      expect(result.digitalValue).toBe(4095); // 2^12 - 1
    });

    it("calculates correctly at midpoint (1.65V, Vref=3.3V, 12-bit)", () => {
      // (1.65 / 3.3) × 4095 = 0.5 × 4095 = 2047.5 → round = 2048
      const result = calculateADCDerivedValues(1.65, 3.3, 12);
      expect(result.digitalValue).toBe(2048);
    });

    it("calculates correctly at midpoint (2.5V, Vref=5V, 10-bit)", () => {
      // (2.5 / 5.0) × 1023 = 0.5 × 1023 = 511.5 → round = 512
      const result = calculateADCDerivedValues(2.5, 5.0, 10);
      expect(result.digitalValue).toBe(512);
    });

    it("returns correct maxDigitalValue for 8-bit (255)", () => {
      const result = calculateADCDerivedValues(0, 3.3, 8);
      expect(result.maxDigitalValue).toBe(255);
    });

    it("returns correct maxDigitalValue for 10-bit (1023)", () => {
      const result = calculateADCDerivedValues(0, 3.3, 10);
      expect(result.maxDigitalValue).toBe(1023);
    });

    it("returns correct maxDigitalValue for 12-bit (4095)", () => {
      const result = calculateADCDerivedValues(0, 3.3, 12);
      expect(result.maxDigitalValue).toBe(4095);
    });

    it("returns correct maxDigitalValue for 16-bit (65535)", () => {
      const result = calculateADCDerivedValues(0, 3.3, 16);
      expect(result.maxDigitalValue).toBe(65535);
    });
  });

  describe("LSB millivolt calculation", () => {
    it("calculates correct LSB for 12-bit, 3.3V reference", () => {
      // LSB = (3.3 / 4095) × 1000 ≈ 0.8058 mV
      const result = calculateADCDerivedValues(0, 3.3, 12);
      expect(result.lsbMillivolts).toBeCloseTo(0.8058, 2);
    });

    it("calculates correct LSB for 8-bit, 5V reference", () => {
      // LSB = (5 / 255) × 1000 ≈ 19.608 mV
      const result = calculateADCDerivedValues(0, 5.0, 8);
      expect(result.lsbMillivolts).toBeCloseTo(19.608, 2);
    });
  });

  describe("boundary validation", () => {
    it("clamps Vin when Vin > Vref", () => {
      const result = calculateADCDerivedValues(3.4, 3.3, 12);
      expect(result.digitalValue).toBe(4095);
    });

    it("clamps Vin when Vin is negative", () => {
      const result = calculateADCDerivedValues(-0.1, 3.3, 12);
      expect(result.digitalValue).toBe(0);
    });

    it("throws when Vref is zero", () => {
      expect(() => calculateADCDerivedValues(0, 0, 12)).toThrow(
        /greater than zero/
      );
    });

    it("throws when Vref is negative", () => {
      expect(() => calculateADCDerivedValues(0, -1, 12)).toThrow(
        /greater than zero/
      );
    });

    it("accepts Vin exactly equal to Vref (max reading)", () => {
      expect(() => calculateADCDerivedValues(5.0, 5.0, 12)).not.toThrow();
    });
  });
});

describe("ADC state transitions", () => {
  it("setChannelInputVoltage clamps Vin to Vref", () => {
    const state = createDefaultADCState(); // Vref = 3.3V
    const { state: newState } = setChannelInputVoltage(state, 0, 99);
    expect(newState.channels[0]!.inputVoltage).toBe(3.3);
  });

  it("setChannelInputVoltage clamps Vin to 0 for negative input", () => {
    const state = createDefaultADCState();
    const { state: newState } = setChannelInputVoltage(state, 0, -5);
    expect(newState.channels[0]!.inputVoltage).toBe(0);
  });

  it("setChannelResolution updates the resolution without altering Vin", () => {
    let state = createDefaultADCState();
    ({ state } = setChannelInputVoltage(state, 0, 1.5));
    const { state: newState } = setChannelResolution(state, 0, 8);
    expect(newState.channels[0]!.resolution).toBe(8);
    expect(newState.channels[0]!.inputVoltage).toBe(1.5);
  });

  it("setChannelReferenceVoltage clamps Vin if it now exceeds new Vref", () => {
    let state = createDefaultADCState();
    ({ state } = setChannelInputVoltage(state, 0, 3.0));
    // Lower Vref below current Vin
    const { state: newState } = setChannelReferenceVoltage(state, 0, 2.5);
    expect(newState.channels[0]!.inputVoltage).toBe(2.5);
    expect(newState.channels[0]!.referenceVoltage).toBe(2.5);
  });

  it("produces the correct event type on voltage change", () => {
    const state = createDefaultADCState();
    const { event } = setChannelInputVoltage(state, 0, 1.0);
    expect(event.type).toBe("adc_voltage_changed");
    expect(event.labId).toBe("adc");
    expect(event.severity).toBe("INFO");
  });
});
