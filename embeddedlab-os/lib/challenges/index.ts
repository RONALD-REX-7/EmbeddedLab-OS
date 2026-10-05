/**
 * EmbeddedLab OS — lib/challenges/index.ts
 *
 * Central challenge registry and unified validator dispatcher.
 */
import type {
  ChallengeDefinition,
  LabId,
  MicrocontrollerState,
  ValidationResult,
} from "@/types/simulator";

import { GPIO_CHALLENGES } from "./gpio-challenges";
import {
  validateGPIOChallenge1,
  validateGPIOChallenge2,
  validateGPIOChallenge3,
} from "./gpio-validators";

import { PWM_CHALLENGES } from "./pwm-challenges";
import {
  validatePWMChallenge1,
  validatePWMChallenge2,
  validatePWMChallenge3,
} from "./pwm-validators";

import { ADC_CHALLENGES } from "./adc-challenges";
import {
  validateADCChallenge1,
  validateADCChallenge2,
  validateADCChallenge3,
} from "./adc-validators";

import { UART_CHALLENGES } from "./uart-challenges";
import {
  validateUARTChallenge1,
  validateUARTChallenge2,
  validateUARTChallenge3,
} from "./uart-validators";

/** Map of labId to challenge definitions */
export const LAB_CHALLENGES: Record<LabId, ChallengeDefinition[]> = {
  gpio: GPIO_CHALLENGES,
  pwm: PWM_CHALLENGES,
  adc: ADC_CHALLENGES,
  uart: UART_CHALLENGES,
};

/** Number of challenges per lab (strictly 3 in canonical curriculum) */
export const CHALLENGES_PER_LAB_COUNT = 3;

/** Total challenges across all laboratories (strictly 12 in canonical curriculum) */
export const TOTAL_CHALLENGES_COUNT = Object.values(LAB_CHALLENGES).reduce(
  (acc, list) => acc + list.length,
  0
);

/** Helper to retrieve challenges for a given lab ID */
export function getChallengesForLab(labId: LabId): ChallengeDefinition[] {
  return LAB_CHALLENGES[labId] ?? [];
}

/** Validator function registry */
const VALIDATOR_MAP: Record<string, (state: MicrocontrollerState) => ValidationResult> = {
  validateGPIOChallenge1,
  validateGPIOChallenge2,
  validateGPIOChallenge3,
  validatePWMChallenge1,
  validatePWMChallenge2,
  validatePWMChallenge3,
  validateADCChallenge1,
  validateADCChallenge2,
  validateADCChallenge3,
  validateUARTChallenge1,
  validateUARTChallenge2,
  validateUARTChallenge3,
};

/** Dispatcher to run validator function by validatorKey against actual state */
export function runChallengeValidator(
  validatorKey: string,
  state: MicrocontrollerState
): ValidationResult {
  const validator = VALIDATOR_MAP[validatorKey];
  if (!validator) {
    return {
      passed: false,
      score: 0,
      feedback: `Validator "${validatorKey}" not registered.`,
      conditions: [{ label: "Validator Registered", passed: false }],
    };
  }
  return validator(state);
}
