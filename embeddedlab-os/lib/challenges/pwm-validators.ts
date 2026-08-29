/**
 * EmbeddedLab OS — lib/challenges/pwm-validators.ts
 * Pure deterministic validation functions for PWM challenges.
 * Validates actual microcontroller simulator state — never UI clicks.
 */
import type { MicrocontrollerState, ValidationResult } from "@/types/simulator";
import { calculatePWMDerivedValues } from "@/lib/simulator/pwm";

/**
 * Challenge 1: Configure TIM1_CH1 (Channel ID 0) to 1,000 Hz and 75% duty cycle, enabled.
 */
export function validatePWMChallenge1(state: MicrocontrollerState): ValidationResult {
  const ch = state.pwm.channels[0];
  if (!ch) {
    return {
      passed: false,
      score: 0,
      feedback: "PWM channel TIM1_CH1 not found.",
      conditions: [{ label: "Channel Exists", passed: false }],
    };
  }

  const isFreqCorrect = ch.frequencyHz === 1000;
  const isDutyCorrect = ch.dutyCyclePercent === 75;
  const isEnabled = ch.enabled;
  const passed = isFreqCorrect && isDutyCorrect && isEnabled;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Challenge Passed! TIM1_CH1 configured to 1,000 Hz (1.0 ms period) at 75% duty cycle."
      : "Challenge Failed. Set TIM1_CH1 frequency to 1,000 Hz and duty cycle to 75%, then enable channel.",
    conditions: [
      {
        label: "Frequency set to 1,000 Hz (1 kHz)",
        passed: isFreqCorrect,
        detail: `Current: ${ch.frequencyHz} Hz`,
      },
      {
        label: "Duty cycle set to 75%",
        passed: isDutyCorrect,
        detail: `Current: ${ch.dutyCyclePercent}%`,
      },
      {
        label: "PWM Channel Enabled",
        passed: isEnabled,
        detail: `Current: ${ch.enabled ? "Enabled" : "Disabled"}`,
      },
    ],
  };
}

/**
 * Challenge 2: Configure frequency to produce a period of exactly 2.0 ms (500 Hz) with 50% duty cycle.
 */
export function validatePWMChallenge2(state: MicrocontrollerState): ValidationResult {
  const ch = state.pwm.channels[0];
  if (!ch) {
    return {
      passed: false,
      score: 0,
      feedback: "PWM channel TIM1_CH1 not found.",
      conditions: [{ label: "Channel Exists", passed: false }],
    };
  }

  const derived = calculatePWMDerivedValues(ch.frequencyHz, ch.dutyCyclePercent);
  const isPeriod2ms = Math.abs(derived.periodMs - 2.0) < 0.001;
  const isDuty50 = ch.dutyCyclePercent === 50;
  const isEnabled = ch.enabled;
  const passed = isPeriod2ms && isDuty50 && isEnabled;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Challenge Passed! Target 2.0 ms period (500 Hz) achieved with 50% duty cycle."
      : "Challenge Failed. Configure frequency for 2.0 ms period (500 Hz) and 50% duty cycle.",
    conditions: [
      {
        label: "Calculated period equals 2.0 ms (Frequency = 500 Hz)",
        passed: isPeriod2ms,
        detail: `Current period: ${derived.periodMs.toFixed(2)} ms (${ch.frequencyHz} Hz)`,
      },
      {
        label: "Duty cycle set to 50%",
        passed: isDuty50,
        detail: `Current: ${ch.dutyCyclePercent}%`,
      },
      {
        label: "PWM Channel Enabled",
        passed: isEnabled,
        detail: `Current: ${ch.enabled ? "Enabled" : "Disabled"}`,
      },
    ],
  };
}

/**
 * Challenge 3: Diagnose incorrect PWM configuration (reconfigure disabled/0% channel to 2000 Hz, 30% duty cycle).
 */
export function validatePWMChallenge3(state: MicrocontrollerState): ValidationResult {
  const ch = state.pwm.channels[0];

  const isFreq2000 = ch?.frequencyHz === 2000;
  const isDuty30 = ch?.dutyCyclePercent === 30;
  const isEnabled = ch?.enabled === true;
  const passed = isFreq2000 && isDuty30 && isEnabled;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Diagnosis Complete! TIM1_CH1 enabled and reconfigured to 2,000 Hz at 30% duty cycle."
      : "Challenge Failed. Enable the channel and set frequency to 2,000 Hz and duty cycle to 30%.",
    conditions: [
      {
        label: "Channel Enabled",
        passed: isEnabled,
        detail: `Current: ${ch?.enabled ? "Enabled" : "Disabled"}`,
      },
      {
        label: "Frequency set to 2,000 Hz",
        passed: isFreq2000,
        detail: `Current: ${ch?.frequencyHz} Hz`,
      },
      {
        label: "Duty cycle set to 30%",
        passed: isDuty30,
        detail: `Current: ${ch?.dutyCyclePercent}%`,
      },
    ],
  };
}
