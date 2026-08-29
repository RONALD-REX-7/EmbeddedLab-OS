import { describe, it, expect, beforeEach } from "vitest";
import { SimulationEngine } from "@/lib/simulator/engine";
import {
  validateGPIOChallenge1,
  validateGPIOChallenge2,
  validateGPIOChallenge3,
} from "@/lib/challenges/gpio-validators";

describe("GPIO Challenge Validators", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
  });

  it("validateGPIOChallenge1 — should fail when PA5 is default (INPUT FLOATING)", () => {
    const result = validateGPIOChallenge1(engine.state);
    expect(result.passed).toBe(false);
    expect(result.score).toBe(0);
    expect(result.conditions[0].passed).toBe(false);
    expect(result.conditions[1].passed).toBe(false);
  });

  it("validateGPIOChallenge1 — should pass when PA5 is OUTPUT HIGH", () => {
    engine.gpioSetPinMode(5, "OUTPUT");
    engine.gpioSetPinLevel(5, "HIGH");

    const result = validateGPIOChallenge1(engine.state);
    expect(result.passed).toBe(true);
    expect(result.score).toBe(100);
    expect(result.conditions[0].passed).toBe(true);
    expect(result.conditions[1].passed).toBe(true);
  });

  it("validateGPIOChallenge2 — should validate PA0 pullup and PA5 output high", () => {
    // Failing state
    let result = validateGPIOChallenge2(engine.state);
    expect(result.passed).toBe(false);

    // Partial state
    engine.gpioSetPinMode(0, "INPUT_PULLUP");
    result = validateGPIOChallenge2(engine.state);
    expect(result.passed).toBe(false);

    // Passing state
    engine.gpioSetPinMode(5, "OUTPUT");
    engine.gpioSetPinLevel(5, "HIGH");
    result = validateGPIOChallenge2(engine.state);
    expect(result.passed).toBe(true);
  });

  it("validateGPIOChallenge3 — should validate diagnosis and fix of PA3", () => {
    engine.gpioSetPinMode(3, "INPUT");
    let result = validateGPIOChallenge3(engine.state);
    expect(result.passed).toBe(false);

    // Reconfigure PA3 to OUTPUT HIGH
    engine.gpioSetPinMode(3, "OUTPUT");
    engine.gpioSetPinLevel(3, "HIGH");
    result = validateGPIOChallenge3(engine.state);
    expect(result.passed).toBe(true);
  });
});
