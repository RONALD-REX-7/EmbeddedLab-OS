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
    title: "Challenge 2: High-Frequency Carrier Generation",
    description:
      "Configure the PWM timer to generate a 5000 Hz carrier frequency with a 50% duty cycle.",
    difficulty: "INTERMEDIATE",
    objectives: [
      "Set PWM Frequency slider to 5000 Hz",
      "Adjust Duty Cycle slider to 50%",
      "Verify carrier wave period T = 0.20 ms",
    ],
    hints: [
      { order: 1, text: "In the Inspector panel, move Frequency to 5000 Hz." },
      { order: 2, text: "Set Duty Cycle to 50%." },
      { order: 3, text: "Notice the oscilloscope waveform density increase." },
    ],
    successMessage: "Carrier generated! 5000 Hz pulse train producing 0.20 ms period.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validatePWMChallenge2",
  },
  {
    id: "pwm-ch-3",
    labId: "pwm",
    title: "Challenge 3: Diagnose Disabled PWM Output",
    description:
      "The PWM generator is configured for 2500 Hz / 40% duty cycle but no signal appears on the scope. Find and fix the configuration issue.",
    difficulty: "ADVANCED",
    objectives: [
      "Inspect PWM channel output state",
      "Click 'Enable PWM Output' in the Inspector panel",
      "Verify active waveform appears on oscilloscope",
    ],
    hints: [
      { order: 1, text: "Check the Inspector panel: is Output State ENABLED or DISABLED?" },
      { order: 2, text: "Click the 'Enable PWM Output' button at the bottom of the Inspector." },
      { order: 3, text: "Verify active waveform pulses appear on the oscilloscope." },
    ],
    successMessage: "Diagnosis Complete! PWM channel re-enabled.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validatePWMChallenge3",
  },
];
