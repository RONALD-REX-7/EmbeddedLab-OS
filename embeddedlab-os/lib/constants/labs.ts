/**
 * EmbeddedLab OS — lib/constants/labs.ts
 *
 * Static metadata for the four MVP labs.
 * Used by navigation, lab selection grid, dashboard, and placeholder pages.
 * No simulator logic here — this is purely descriptive metadata.
 */

import type { LabId } from "@/types/simulator";

export interface LabDefinition {
  id: LabId;
  title: string;
  /** Short label shown in badges and nav */
  shortTitle: string;
  /** One-sentence description for cards */
  description: string;
  /** What students will learn — shown on lab selection and placeholders */
  objectives: string[];
  /** Lucide icon name */
  icon: string;
  route: string;
  /** Number of challenges planned for this lab */
  challengeCount: number;
}

export const LABS: LabDefinition[] = [
  {
    id: "gpio",
    title: "GPIO — General Purpose Input/Output",
    shortTitle: "GPIO",
    description:
      "Configure virtual digital pins, drive outputs, read inputs, and interact with a simulated LED and push button.",
    objectives: [
      "Configure pins as INPUT or OUTPUT",
      "Drive output pins HIGH and LOW",
      "Read input pin states with pull resistors",
      "Control a virtual LED from an output pin",
      "Use a virtual button as a digital input",
      "Complete three guided challenges",
    ],
    icon: "Zap",
    route: "/labs/gpio",
    challengeCount: 3,
  },
  {
    id: "pwm",
    title: "PWM — Pulse Width Modulation",
    shortTitle: "PWM",
    description:
      "Set frequency and duty cycle on virtual PWM channels, observe the waveform, and control LED brightness through duty cycle.",
    objectives: [
      "Set PWM frequency in Hz",
      "Adjust duty cycle from 0% to 100%",
      "Observe period, high time, and low time",
      "See how duty cycle maps to LED brightness",
      "Read a live oscilloscope-style waveform",
      "Complete three guided challenges",
    ],
    icon: "Activity",
    route: "/labs/pwm",
    challengeCount: 3,
  },
  {
    id: "adc",
    title: "ADC — Analog-to-Digital Converter",
    shortTitle: "ADC",
    description:
      "Adjust a virtual input voltage and observe the digital conversion using the real ADC formula across multiple resolutions.",
    objectives: [
      "Understand the ADC formula: ADC = (Vin / Vref) × (2^N − 1)",
      "Adjust input voltage with a virtual potentiometer",
      "Change ADC resolution (8, 10, 12, 16-bit)",
      "Read digital output in decimal, hex, and binary",
      "Observe quantization error and LSB size",
      "Complete three guided challenges",
    ],
    icon: "BarChart2",
    route: "/labs/adc",
    challengeCount: 3,
  },
  {
    id: "uart",
    title: "UART — Universal Asynchronous Receiver-Transmitter",
    shortTitle: "UART",
    description:
      "Configure TX and RX independently, observe frame structure, and see what happens when configurations are incompatible.",
    objectives: [
      "Configure baud rate, data bits, parity, and stop bits",
      "Understand the UART frame structure",
      "Simulate successful and failed transmissions",
      "Diagnose TX/RX configuration mismatches",
      "Read frame timing calculations",
      "Complete three guided challenges",
    ],
    icon: "Radio",
    route: "/labs/uart",
    challengeCount: 3,
  },
];

/** Look up a lab definition by its ID. Returns undefined if not found. */
export function getLabById(id: LabId): LabDefinition | undefined {
  return LABS.find((lab) => lab.id === id);
}
