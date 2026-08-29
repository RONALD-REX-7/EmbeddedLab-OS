/**
 * EmbeddedLab OS — lib/challenges/pwm-challenges.ts
 * Challenge definitions for the PWM Lab.
 */
import type { ChallengeDefinition } from "@/types/simulator";

export const PWM_CHALLENGES: ChallengeDefinition[] = [
  {
    id: "pwm-ch-1",
    labId: "pwm",
    title: "Challenge 1: Target Duty Cycle Adjustment",
    description:
      "Adjust the PWM channel duty cycle to exactly 75% while keeping frequency at 1000 Hz and channel ENABLED.",
    difficulty: "BEGINNER",
    objectives: [
      "Set PWM Frequency to 1000 Hz",
      "Adjust Duty Cycle slider to 75%",
      "Ensure PWM output channel is ENABLED",
    ],
    hints: [
      { order: 1, text: "Open the PWM Channel Inspector on the right panel." },
      { order: 2, text: "Drag the Duty Cycle slider to 75%." },
      { order: 3, text: "Verify that Output State shows ENABLED." },
    ],
    successMessage: "Great job! PWM duty cycle set to 75% producing average output voltage of 2.48V.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validatePWMChallenge1",
  },
  {
    id: "pwm-ch-2",
    labId: "pwm",
    title: "Challenge 2: Period Matching & Frequency Tuning",
    description:
      "Derive and configure the timer frequency to produce an exact 2.00 ms carrier period (500 Hz) with a 50% duty cycle.",
    difficulty: "INTERMEDIATE",
    objectives: [
      "Set PWM Frequency to 500 Hz (T = 2.00 ms)",
      "Adjust Duty Cycle slider to 50%",
      "Ensure PWM output channel is ENABLED",
    ],
    hints: [
      { order: 1, text: "Period T = 1 / frequency. To get 2.0 ms (0.002 s), frequency must be 1 / 0.002 = 500 Hz." },
      { order: 2, text: "Set Frequency to 500 Hz in the Inspector." },
      { order: 3, text: "Set Duty Cycle to 50%." },
    ],
    successMessage: "Period matched! 500 Hz carrier generated producing an exact 2.00 ms period.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validatePWMChallenge2",
  },
  {
    id: "pwm-ch-3",
    labId: "pwm",
    title: "Challenge 3: Diagnose Disabled PWM Output",
    description:
      "Re-enable the disabled PWM timer output channel and configure it for a 2,000 Hz carrier with a 30% duty cycle.",
    difficulty: "ADVANCED",
    objectives: [
      "Enable TIM1_CH1 Output State in the Inspector",
      "Set Frequency to 2,000 Hz",
      "Set Duty Cycle to 30%",
    ],
    hints: [
      { order: 1, text: "Check the Output State switch in the Inspector panel." },
      { order: 2, text: "Toggle the channel state to ENABLED." },
      { order: 3, text: "Set Frequency to 2,000 Hz and Duty Cycle to 30%." },
    ],
    successMessage: "Diagnosis Complete! PWM channel re-enabled and operating at 2,000 Hz (30% duty).",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validatePWMChallenge3",
  },
];
