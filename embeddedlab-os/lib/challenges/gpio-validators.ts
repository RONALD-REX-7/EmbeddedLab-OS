/**
 * EmbeddedLab OS — lib/challenges/gpio-validators.ts
 * Pure deterministic validation functions for GPIO challenges.
 * Validates actual microcontroller simulator state — never UI clicks.
 */
import type { MicrocontrollerState, ValidationResult } from "@/types/simulator";

/**
 * Challenge 1: Configure PA5 (Pin ID 5) as OUTPUT and set level to HIGH.
 */
export function validateGPIOChallenge1(state: MicrocontrollerState): ValidationResult {
  const pin = state.gpio.pins[5]; // PA5
  if (!pin) {
    return {
      passed: false,
      score: 0,
      feedback: "Pin PA5 not found in microcontroller state.",
      conditions: [{ label: "PA5 Pin Exists", passed: false }],
    };
  }

  const isOutput = pin.mode === "OUTPUT";
  const isHigh = pin.level === "HIGH";
  const passed = isOutput && isHigh;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Challenge Passed! PA5 is configured as OUTPUT and driving HIGH (LED ON)."
      : "Challenge Failed. Ensure PA5 mode is set to OUTPUT and level is driven HIGH.",
    conditions: [
      {
        label: "PA5 Mode set to OUTPUT",
        passed: isOutput,
        detail: `Current mode: ${pin.mode}`,
      },
      {
        label: "PA5 Output Level driven HIGH",
        passed: isHigh,
        detail: `Current level: ${pin.level}`,
      },
    ],
  };
}

/**
 * Challenge 2: Configure PA0 (Pin ID 0) as INPUT_PULLUP and PA5 (Pin ID 5) as OUTPUT HIGH.
 */
export function validateGPIOChallenge2(state: MicrocontrollerState): ValidationResult {
  const pin0 = state.gpio.pins[0]; // PA0 (button)
  const pin5 = state.gpio.pins[5]; // PA5 (LED)

  const isPa0Pullup = pin0?.mode === "INPUT_PULLUP";
  const isPa5Output = pin5?.mode === "OUTPUT";
  const isPa5High = pin5?.level === "HIGH";

  const passed = isPa0Pullup && isPa5Output && isPa5High;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Challenge Passed! PA0 input pullup configured and PA5 output driving HIGH."
      : "Challenge Failed. Verify PA0 is INPUT_PULLUP and PA5 is OUTPUT HIGH.",
    conditions: [
      {
        label: "PA0 configured as INPUT_PULLUP",
        passed: isPa0Pullup,
        detail: `Current: ${pin0?.mode}`,
      },
      {
        label: "PA5 configured as OUTPUT",
        passed: isPa5Output,
        detail: `Current: ${pin5?.mode}`,
      },
      {
        label: "PA5 Output Level set to HIGH",
        passed: isPa5High,
        detail: `Current: ${pin5?.level}`,
      },
    ],
  };
}

/**
 * Challenge 3: Diagnose incorrect configuration on PA3 (Pin ID 3) and switch it to OUTPUT HIGH.
 */
export function validateGPIOChallenge3(state: MicrocontrollerState): ValidationResult {
  const pin3 = state.gpio.pins[3]; // PA3

  const isOutput = pin3?.mode === "OUTPUT";
  const isHigh = pin3?.level === "HIGH";
  const passed = isOutput && isHigh;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Diagnosis Complete! PA3 was reconfigured from INPUT to OUTPUT HIGH."
      : "Challenge Failed. Fix PA3 by changing its mode to OUTPUT and driving it HIGH.",
    conditions: [
      {
        label: "PA3 reconfigured to OUTPUT mode",
        passed: isOutput,
        detail: `Current mode: ${pin3?.mode}`,
      },
      {
        label: "PA3 Output Level driven HIGH",
        passed: isHigh,
        detail: `Current level: ${pin3?.level}`,
      },
    ],
  };
}
