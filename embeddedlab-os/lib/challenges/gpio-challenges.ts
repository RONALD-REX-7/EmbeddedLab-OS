/**
 * EmbeddedLab OS — lib/challenges/gpio-challenges.ts
 * Challenge definitions for the GPIO Lab.
 */
import type { ChallengeDefinition } from "@/types/simulator";

export const GPIO_CHALLENGES: ChallengeDefinition[] = [
  {
    id: "gpio-ch-1",
    labId: "gpio",
    title: "Challenge 1: Configure PA5 for LED Output",
    description:
      "Configure pin PA5 mode as OUTPUT and set its logic level to HIGH (3.3V) to illuminate the virtual LED.",
    difficulty: "BEGINNER",
    objectives: [
      "Select Pin PA5 in the Pin Inspector",
      "Change PA5 mode to OUTPUT",
      "Drive PA5 logic level to HIGH (3.3V)",
    ],
    hints: [
      { order: 1, text: "Click on pin PA5 in the Pin Grid to open its Inspector." },
      { order: 2, text: "Select OUTPUT in the Mode Configuration section." },
      { order: 3, text: "Click HIGH (3.3V) under Output Drive Level." },
    ],
    successMessage: "Great job! PA5 is configured as OUTPUT and driving HIGH to illuminate the virtual LED.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateGPIOChallenge1",
  },
  {
    id: "gpio-ch-2",
    labId: "gpio",
    title: "Challenge 2: Push-Button Input with Pull-Up",
    description:
      "Configure pin PA0 as INPUT with internal PULLUP resistor to interface with the virtual push-button and PA5 as OUTPUT HIGH.",
    difficulty: "INTERMEDIATE",
    objectives: [
      "Select Pin PA0 in the Pin Inspector and set mode to INPUT_PULLUP",
      "Select Pin PA5 and configure as OUTPUT mode",
      "Drive PA5 logic level to HIGH",
    ],
    hints: [
      { order: 1, text: "Click pin PA0 in the Pin Grid." },
      { order: 2, text: "Set PA0 Mode to INPUT_PULLUP so the button idle state is defined." },
      { order: 3, text: "Configure PA5 as OUTPUT and drive HIGH." },
    ],
    successMessage: "Excellent! PA0 is configured with Pull-Up resistor and PA5 is driving the LED.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateGPIOChallenge2",
  },
  {
    id: "gpio-ch-3",
    labId: "gpio",
    title: "Challenge 3: GPIO Misconfiguration Diagnosis",
    description:
      "Diagnose an erroneously configured input pin on PA3, switch its mode to OUTPUT, and drive it HIGH to illuminate the status indicator.",
    difficulty: "ADVANCED",
    objectives: [
      "Select Pin PA3 in the Pin Inspector",
      "Change PA3 mode from INPUT to OUTPUT",
      "Drive PA3 logic level to HIGH (3.3V)",
    ],
    hints: [
      { order: 1, text: "Pin PA3 was incorrectly configured in INPUT mode." },
      { order: 2, text: "Select PA3 and change Mode to OUTPUT." },
      { order: 3, text: "Set PA3 output drive level to HIGH (3.3V)." },
    ],
    successMessage: "Diagnosis Complete! PA3 was successfully reconfigured to OUTPUT HIGH.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateGPIOChallenge3",
  },
];
