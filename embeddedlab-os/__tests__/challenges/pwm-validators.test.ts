import { describe, it, expect, beforeEach } from "vitest";
import { SimulationEngine } from "@/lib/simulator/engine";
import { calculatePWMDerivedValues } from "@/lib/simulator/pwm";
import {
  validatePWMChallenge1,
  validatePWMChallenge2,
  validatePWMChallenge3,
} from "@/lib/challenges/pwm-validators";

describe("PWM Math & Challenge Validation Invariants", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  it("should correctly compute PWM period and high/low times for given frequency and duty cycle", () => {
    // 1000 Hz, 50% -> Period 1.0 ms, High 0.5 ms, Low 0.5 ms
    let derived = calculatePWMDerivedValues(1000, 50);
    expect(derived.periodMs).toBeCloseTo(1.0, 4);
    expect(derived.highTimeMs).toBeCloseTo(0.5, 4);
    expect(derived.lowTimeMs).toBeCloseTo(0.5, 4);

    // 500 Hz, 75% -> Period 2.0 ms, High 1.5 ms, Low 0.5 ms
    derived = calculatePWMDerivedValues(500, 75);
    expect(derived.periodMs).toBeCloseTo(2.0, 4);
    expect(derived.highTimeMs).toBeCloseTo(1.5, 4);
    expect(derived.lowTimeMs).toBeCloseTo(0.5, 4);

    // 10,000 Hz, 10% -> Period 0.1 ms, High 0.01 ms, Low 0.09 ms
    derived = calculatePWMDerivedValues(10000, 10);
    expect(derived.periodMs).toBeCloseTo(0.1, 4);
    expect(derived.highTimeMs).toBeCloseTo(0.01, 4);
    expect(derived.lowTimeMs).toBeCloseTo(0.09, 4);
  });

  it("should clamp duty cycle to boundaries [0, 100]", () => {
    // 0% Duty Cycle -> High time = 0.0 ms
    let derived = calculatePWMDerivedValues(1000, 0);
    expect(derived.highTimeMs).toBe(0);
    expect(derived.lowTimeMs).toBeCloseTo(1.0, 4);

    // 100% Duty Cycle -> High time = Period ms
    derived = calculatePWMDerivedValues(1000, 100);
    expect(derived.highTimeMs).toBeCloseTo(1.0, 4);
    expect(derived.lowTimeMs).toBe(0);
  });

  it("should visibly change derived high/low times when frequency or duty cycle is modified", () => {
    const d1 = calculatePWMDerivedValues(1000, 20); // 20% at 1kHz
    const d2 = calculatePWMDerivedValues(1000, 80); // 80% at 1kHz
    const d3 = calculatePWMDerivedValues(5000, 20); // 20% at 5kHz

    // Changing duty cycle from 20% to 80% changes high time from 0.2ms to 0.8ms
    expect(d1.highTimeMs).not.toEqual(d2.highTimeMs);
    expect(d1.highTimeMs).toBeCloseTo(0.2, 4);
    expect(d2.highTimeMs).toBeCloseTo(0.8, 4);

    // Changing frequency from 1kHz to 5kHz changes period from 1.0ms to 0.2ms
    expect(d1.periodMs).not.toEqual(d3.periodMs);
    expect(d1.periodMs).toBeCloseTo(1.0, 4);
    expect(d3.periodMs).toBeCloseTo(0.2, 4);
  });

  it("validatePWMChallenge1 — should validate 1,000 Hz, 75% duty, enabled", () => {
    let result = validatePWMChallenge1(engine.state);
    expect(result.passed).toBe(false);

    engine.pwmSetFrequency(0, 1000);
    engine.pwmSetDutyCycle(0, 75);
    engine.pwmSetChannelEnabled(0, true);

    result = validatePWMChallenge1(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("validatePWMChallenge2 — should validate 2.0 ms period (500 Hz) at 50% duty", () => {
    let result = validatePWMChallenge2(engine.state);
    expect(result.passed).toBe(false);

    engine.pwmSetFrequency(0, 500);
    engine.pwmSetDutyCycle(0, 50);
    engine.pwmSetChannelEnabled(0, true);

    result = validatePWMChallenge2(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });

  it("validatePWMChallenge3 — should validate diagnosis and fix for TIM1_CH1", () => {
    engine.pwmSetChannelEnabled(0, false);
    let result = validatePWMChallenge3(engine.state);
    expect(result.passed).toBe(false);

    engine.pwmSetChannelEnabled(0, true);
    engine.pwmSetFrequency(0, 2000);
    engine.pwmSetDutyCycle(0, 30);

    result = validatePWMChallenge3(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
  });
});
