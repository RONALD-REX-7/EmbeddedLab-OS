/**
 * EmbeddedLab OS — lib/challenges/adc-challenges.ts
 * Challenge definitions for the ADC Lab.
 */
import type { ChallengeDefinition } from "@/types/simulator";

export const ADC_CHALLENGES: ChallengeDefinition[] = [
  {
    id: "adc-ch-1",
    labId: "adc",
    title: "Challenge 1: Target Raw ADC Conversion Count",
    description:
      "Adjust the potentiometer input voltage Vin to reach a raw digital ADC count of 2048 (±10 counts) on 12-bit resolution with Vref = 3.3V.",
    difficulty: "BEGINNER",
    objectives: [
      "Set ADC Resolution to 12-bit (0–4095 scale)",
      "Set Reference Voltage Vref to 3.3V",
      "Adjust Potentiometer input voltage Vin to ~1.65V to reach 2048 counts",
    ],
    hints: [
      { order: 1, text: "Ensure Resolution is set to 12-bit (0–4095 scale) and Vref = 3.3V." },
      { order: 2, text: "Mid-scale count 2048 corresponds to half of Vref: Vin = 3.3V / 2 = 1.65V." },
      { order: 3, text: "Adjust the Potentiometer slider until Vin is approximately 1.65V." },
    ],
    successMessage: "Great job! Raw digital ADC count reached 2048 at mid-scale input voltage 1.65V.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateADCChallenge1",
  },
  {
    id: "adc-ch-2",
    labId: "adc",
    title: "Challenge 2: Target Analog Input Voltage",
    description:
      "Use the virtual potentiometer to set the input voltage Vin to exactly 2.50V (±0.05V) on Channel 0.",
    difficulty: "INTERMEDIATE",
    objectives: [
      "Check Vref = 3.3V and Resolution = 12-bit",
      "Drag Potentiometer slider to 2.50V",
      "Confirm raw ADC output equals ~3102 counts",
    ],
    hints: [
      { order: 1, text: "Check Vref = 3.3V and Resolution = 12-bit." },
      { order: 2, text: "Drag the Potentiometer slider to 2.50V." },
      { order: 3, text: "At 2.50V with 3.3V reference, raw ADC count will equal ~3102." },
    ],
    successMessage: "Input voltage successfully set to 2.50V within ±0.05V tolerance.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateADCChallenge2",
  },
  {
    id: "adc-ch-3",
    labId: "adc",
    title: "Challenge 3: Diagnose Mismatched Reference & Resolution",
    description:
      "The ADC is currently misconfigured with an incorrect reference voltage (1.8V) and low resolution (8-bit). Reconfigure to 12-bit resolution, Vref = 3.3V, and set Vin = 1.65V.",
    difficulty: "ADVANCED",
    objectives: [
      "Reconfigure ADC Resolution selector from 8-bit to 12-bit",
      "Reconfigure Vref selector from 1.8V to 3.3V",
      "Adjust Potentiometer Vin to 1.65V",
    ],
    hints: [
      { order: 1, text: "Change Resolution selector from 8-bit to 12-bit." },
      { order: 2, text: "Change Vref selector from 1.8V to 3.3V." },
      { order: 3, text: "Set Potentiometer input voltage Vin to 1.65V." },
    ],
    successMessage: "Diagnosis Complete! ADC reconfigured to 12-bit, 3.3V reference, and Vin = 1.65V.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateADCChallenge3",
  },
];
