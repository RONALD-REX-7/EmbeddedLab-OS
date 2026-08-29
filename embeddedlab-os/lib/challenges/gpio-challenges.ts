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
      "Configure pin PA0 as INPUT with internal PULLUP resistor to interface with the virtual push-button.",
    difficulty: "INTERMEDIATE",
    objectives: [
      "Select Pin PA0 in the Pin Inspector",
      "Set PA0 mode to INPUT",
      "Enable internal PULLUP resistor",
    ],
    hints: [
      { order: 1, text: "Click pin PA0 in the Pin Grid." },
      { order: 2, text: "Set Mode to INPUT." },
      { order: 3, text: "Set Pull Setting to PULLUP so the idle pin reads HIGH." },
    ],
    successMessage: "Excellent! PA0 is configured with Pull-Up resistor for clean button logic.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateGPIOChallenge2",
  },
  {
    id: "gpio-ch-3",
    labId: "gpio",
    title: "Challenge 3: Multi-Pin High-Z Floating Diagnosis",
    description:
      "Diagnose and resolve floating input states on PA0 and PA1 by enabling proper pull-up/pull-down resistors.",
    difficulty: "ADVANCED",
    objectives: [
      "Set PA0 to INPUT with PULLUP resistor",
      "Set PA1 to INPUT with PULLDOWN resistor",
      "Ensure no input pins remain in floating High-Z mode",
    ],
    hints: [
      { order: 1, text: "Floating pins cause unpredictable logic readings." },
      { order: 2, text: "Configure PA0 as INPUT with PULLUP." },
      { order: 3, text: "Configure PA1 as INPUT with PULLDOWN." },
    ],
    successMessage: "Diagnosis Complete! All inputs have defined pull resistors to prevent floating High-Z errors.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateGPIOChallenge3",
  },
];
