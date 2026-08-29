/**
 * EmbeddedLab OS — PWM Simulator Unit Tests
 */
import { describe, it, expect } from "vitest";
import {
  calculatePWMDerivedValues,
  createDefaultPWMState,
  setChannelFrequency,
  setChannelDutyCycle,
  PWM_FREQUENCY_MAX_HZ,
  PWM_FREQUENCY_MIN_HZ,
} from "@/lib/simulator/pwm";

describe("calculatePWMDerivedValues", () => {
  it("1 kHz, 50% duty cycle → period = 1ms, high = 0.5ms, low = 0.5ms", () => {
    const result = calculatePWMDerivedValues(1000, 50);
    expect(result.periodMs).toBeCloseTo(1);
    expect(result.highTimeMs).toBeCloseTo(0.5);
    expect(result.lowTimeMs).toBeCloseTo(0.5);
  });

  it("10 kHz, 25% → period = 0.1ms, high = 0.025ms", () => {
    const result = calculatePWMDerivedValues(10_000, 25);
    expect(result.periodMs).toBeCloseTo(0.1);
    expect(result.highTimeMs).toBeCloseTo(0.025);
  });

  it("1 Hz, 100% duty cycle → high = period, low = 0", () => {
    const result = calculatePWMDerivedValues(1, 100);
    expect(result.periodMs).toBeCloseTo(1000);
    expect(result.highTimeMs).toBeCloseTo(1000);
    expect(result.lowTimeMs).toBeCloseTo(0);
  });

  it("1 Hz, 0% duty cycle → high = 0, low = period", () => {
    const result = calculatePWMDerivedValues(1, 0);
    expect(result.highTimeMs).toBeCloseTo(0);
    expect(result.lowTimeMs).toBeCloseTo(1000);
  });

  it("high + low always equals period", () => {
    const cases = [
      [1000, 50],
      [440, 73],
      [20000, 12.5],
      [100, 99.9],
    ] as [number, number][];
    for (const [freq, duty] of cases) {
      const { periodMs, highTimeMs, lowTimeMs } = calculatePWMDerivedValues(freq, duty);
      expect(highTimeMs + lowTimeMs).toBeCloseTo(periodMs, 10);
    }
  });

  it("throws when frequencyHz is zero", () => {
    expect(() => calculatePWMDerivedValues(0, 50)).toThrow(/greater than zero/);
  });

  it("throws when frequencyHz is negative", () => {
    expect(() => calculatePWMDerivedValues(-100, 50)).toThrow(/greater than zero/);
  });
});

describe("PWM state transitions", () => {
  it("setChannelFrequency clamps to minimum", () => {
    const state = createDefaultPWMState();
    const { state: newState } = setChannelFrequency(state, 0, 0);
    expect(newState.channels[0]!.frequencyHz).toBe(PWM_FREQUENCY_MIN_HZ);
  });

  it("setChannelFrequency clamps to maximum", () => {
    const state = createDefaultPWMState();
    const { state: newState } = setChannelFrequency(state, 0, 999_999_999);
    expect(newState.channels[0]!.frequencyHz).toBe(PWM_FREQUENCY_MAX_HZ);
  });

  it("setChannelDutyCycle clamps to 0", () => {
    const state = createDefaultPWMState();
    const { state: newState } = setChannelDutyCycle(state, 0, -10);
    expect(newState.channels[0]!.dutyCyclePercent).toBe(0);
  });

  it("setChannelDutyCycle clamps to 100", () => {
    const state = createDefaultPWMState();
    const { state: newState } = setChannelDutyCycle(state, 0, 200);
    expect(newState.channels[0]!.dutyCyclePercent).toBe(100);
  });

  it("only modifies the targeted channel", () => {
    const state = createDefaultPWMState();
    const { state: newState } = setChannelFrequency(state, 1, 440);
    expect(newState.channels[0]!.frequencyHz).toBe(1000); // unchanged
    expect(newState.channels[1]!.frequencyHz).toBe(440);
  });
});
