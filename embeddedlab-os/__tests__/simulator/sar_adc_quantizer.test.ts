/**
 * EmbeddedLab OS — SAR ADC Quantizer Unit Tests
 *
 * Verifies successive approximation binary-search trial mechanics,
 * ATmega328P ADMUX reference multiplexing, clock prescaler calculations,
 * and transfer curve non-linearity metrics.
 */

import { describe, it, expect } from "vitest";
import {
  resolveEffectiveVref,
  calculateAdcClockFrequency,
  isAdcClockWithinOptimalRange,
  calculateConversionTimeUs,
  simulateSARConversion,
  calculateNonLinearity,
} from "@/lib/simulator/sar_adc_quantizer";

describe("SAR ADC Quantizer Engine", () => {
  describe("resolveEffectiveVref", () => {
    it("returns avccVolts when referenceSource is AVCC", () => {
      const vref = resolveEffectiveVref({
        referenceSource: "AVCC",
        arefExternalVolts: 3.3,
        avccVolts: 5.0,
      });
      expect(vref).toBe(5.0);
    });

    it("returns arefExternalVolts when referenceSource is AREF", () => {
      const vref = resolveEffectiveVref({
        referenceSource: "AREF",
        arefExternalVolts: 3.3,
        avccVolts: 5.0,
      });
      expect(vref).toBe(3.3);
    });

    it("returns 1.1V when referenceSource is INTERNAL_1V1", () => {
      const vref = resolveEffectiveVref({
        referenceSource: "INTERNAL_1V1",
        arefExternalVolts: 5.0,
        avccVolts: 5.0,
      });
      expect(vref).toBe(1.1);
    });

    it("returns 2.56V when referenceSource is INTERNAL_2V56", () => {
      const vref = resolveEffectiveVref({
        referenceSource: "INTERNAL_2V56",
        arefExternalVolts: 5.0,
        avccVolts: 5.0,
      });
      expect(vref).toBe(2.56);
    });

    it("throws when effective reference voltage is zero or negative", () => {
      expect(() =>
        resolveEffectiveVref({
          referenceSource: "AREF",
          arefExternalVolts: 0,
          avccVolts: 5.0,
        })
      ).toThrow("Effective reference voltage must be positive");
    });
  });

  describe("ADC Clock & Prescaler Mechanics", () => {
    it("calculates 125 kHz ADC clock for 16 MHz CPU with 128 prescaler", () => {
      const clock = calculateAdcClockFrequency(16_000_000, 128);
      expect(clock).toBe(125_000);
      expect(isAdcClockWithinOptimalRange(clock)).toBe(true);
    });

    it("identifies out-of-range ADC clock speeds", () => {
      // 16 MHz / 16 = 1 MHz (> 200 kHz optimal max)
      const fastClock = calculateAdcClockFrequency(16_000_000, 16);
      expect(fastClock).toBe(1_000_000);
      expect(isAdcClockWithinOptimalRange(fastClock)).toBe(false);

      // 1 MHz / 128 ≈ 7812.5 Hz (< 50 kHz optimal min)
      const slowClock = calculateAdcClockFrequency(1_000_000, 128);
      expect(isAdcClockWithinOptimalRange(slowClock)).toBe(false);
    });

    it("throws on invalid CPU frequency", () => {
      expect(() => calculateAdcClockFrequency(0, 128)).toThrow("CPU frequency must be positive");
    });
  });

  describe("Conversion Timing", () => {
    it("calculates 104 µs for standard 13-cycle conversion at 125 kHz", () => {
      const timeUs = calculateConversionTimeUs(13, 125_000);
      expect(timeUs).toBeCloseTo(104.0, 1);
    });

    it("calculates 200 µs for first 25-cycle conversion at 125 kHz", () => {
      const timeUs = calculateConversionTimeUs(25, 125_000);
      expect(timeUs).toBe(200.0);
    });
  });

  describe("simulateSARConversion (Binary Search Execution)", () => {
    it("generates exactly 10 bit trials for 10-bit resolution", () => {
      const result = simulateSARConversion(2.5, { resolutionBits: 10, avccVolts: 5.0 });
      expect(result.trials).toHaveLength(10);
      expect(result.trials[0].bit).toBe(9); // MSB
      expect(result.trials[9].bit).toBe(0); // LSB
    });

    it("resolves Vin = 0V to code 0", () => {
      const result = simulateSARConversion(0, { resolutionBits: 10, avccVolts: 5.0 });
      expect(result.rawCode).toBe(0);
      expect(result.reconstructedVoltage).toBe(0);
      expect(result.trials.every((t) => !t.comparatorOutput)).toBe(true);
    });

    it("resolves Vin = Vref (5.0V) to code 1023 (max code)", () => {
      const result = simulateSARConversion(5.0, { resolutionBits: 10, avccVolts: 5.0 });
      expect(result.rawCode).toBe(1023);
      expect(result.maxCode).toBe(1023);
      // All bits trial true because clamped Vin (5.0V) >= dacVoltage at each step
      expect(result.trials.every((t) => t.comparatorOutput)).toBe(true);
    });

    it("resolves exact midpoint (2.5V, 5.0V Vref) to code 512 with single MSB match", () => {
      const result = simulateSARConversion(2.5, { resolutionBits: 10, avccVolts: 5.0 });
      expect(result.rawCode).toBe(512);
      expect(result.trials[0].bit).toBe(9);
      expect(result.trials[0].comparatorOutput).toBe(true); // 2.5V >= 2.5V -> true
      // Remaining trials test (512 + weight) which exceeds 2.5V -> all false
      for (let i = 1; i < 10; i++) {
        expect(result.trials[i].comparatorOutput).toBe(false);
      }
    });

    it("resolves quarter-scale (1.25V, 5.0V Vref) to code 256", () => {
      const result = simulateSARConversion(1.25, { resolutionBits: 10, avccVolts: 5.0 });
      expect(result.rawCode).toBe(256);
      expect(result.trials[0].comparatorOutput).toBe(false); // Bit 9 (2.5V) > 1.25V -> false
      expect(result.trials[1].comparatorOutput).toBe(true);  // Bit 8 (1.25V) <= 1.25V -> true
    });

    it("clamps negative input to 0V and over-range input to Vref", () => {
      const underRange = simulateSARConversion(-1.5, { resolutionBits: 10, avccVolts: 5.0 });
      expect(underRange.rawCode).toBe(0);

      const overRange = simulateSARConversion(10.0, { resolutionBits: 10, avccVolts: 5.0 });
      expect(overRange.rawCode).toBe(1023);
    });

    it("calculates accurate LSB voltage (5V / 1024 ≈ 4.8828 mV)", () => {
      const result = simulateSARConversion(2.5, { resolutionBits: 10, avccVolts: 5.0 });
      expect(result.lsbVoltage * 1000).toBeCloseTo(4.8828, 3);
    });

    it("supports 1.1V internal bandgap reference", () => {
      const result = simulateSARConversion(0.55, {
        resolutionBits: 10,
        referenceSource: "INTERNAL_1V1",
      });
      expect(result.effectiveVref).toBe(1.1);
      expect(result.rawCode).toBe(512); // 0.55V is exact half of 1.1V
    });

    it("throws on invalid resolution bits", () => {
      expect(() => simulateSARConversion(1.0, { resolutionBits: 0 })).toThrow();
      expect(() => simulateSARConversion(1.0, { resolutionBits: 17 })).toThrow();
    });
  });

  describe("calculateNonLinearity (DNL / INL)", () => {
    it("returns zero DNL and INL for perfectly linear transfer characteristics", () => {
      const ideal = [0, 1, 2, 3, 4];
      const measured = [0, 1, 2, 3, 4];
      const metrics = calculateNonLinearity(ideal, measured);
      expect(metrics.maxDnl).toBe(0);
      expect(metrics.maxInl).toBe(0);
      expect(metrics.dnl.every((d) => d === 0)).toBe(true);
    });

    it("detects step irregularities in DNL and INL", () => {
      const ideal = [0, 1, 2, 3, 4];
      const measured = [0, 1.5, 2, 3, 4];
      const metrics = calculateNonLinearity(ideal, measured);
      // Step from 0 to 1.5 has delta 1.5 instead of 1 -> DNL = +0.5
      expect(metrics.maxDnl).toBe(0.5);
      expect(metrics.inl.length).toBe(4);
    });

    it("throws when ideal and measured array lengths do not match", () => {
      expect(() => calculateNonLinearity([0, 1], [0, 1, 2])).toThrow("identical length");
    });
  });
});
