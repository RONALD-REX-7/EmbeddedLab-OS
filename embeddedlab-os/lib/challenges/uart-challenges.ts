/**
 * EmbeddedLab OS — lib/challenges/uart-challenges.ts
 * Challenge definitions for the UART Lab.
 */
import type { ChallengeDefinition } from "@/types/simulator";

export const UART_CHALLENGES: ChallengeDefinition[] = [
  {
    id: "uart-ch-1",
    labId: "uart",
    title: "Challenge 1: Successful Message Transmission",
    description:
      "Verify that TX and RX parameters match, enter a text message in the TX terminal, and click Send to transmit.",
    difficulty: "BEGINNER",
    objectives: [
      "Confirm TX and RX Baud Rate, Data Bits, Parity, and Stop Bits match",
      "Type a string message into the Transmit Serial Data input box",
      "Click Send to transmit ASCII data across serial link",
    ],
    hints: [
      { order: 1, text: "Check that TX and RX Baud Rate, Data Bits, Parity, and Stop Bits match." },
      { order: 2, text: "Type a message such as 'HELLO' in the Message Input box." },
      { order: 3, text: "Click the Send Message button to execute transmission." },
    ],
    successMessage: "Transmission Successful! Message sent over TX and received cleanly at RX terminal.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateUARTChallenge1",
  },
  {
    id: "uart-ch-2",
    labId: "uart",
    title: "Challenge 2: Target 115200-8-E-1 Protocol Specification",
    description:
      "Reconfigure both TX and RX interfaces to meet high-speed spec: 115200 Baud, 8 Data Bits, EVEN Parity, and 1 Stop Bit.",
    difficulty: "INTERMEDIATE",
    objectives: [
      "Change TX Baud Rate to 115200 and Parity to EVEN",
      "Change RX Baud Rate to 115200 and Parity to EVEN",
      "Verify framing spec displays 8-E-1 on both interfaces",
    ],
    hints: [
      { order: 1, text: "In the Inspector, change Transmitter Baud Rate to 115200 and Parity to EVEN." },
      { order: 2, text: "Change Receiver Baud Rate to 115200 and Parity to EVEN." },
      { order: 3, text: "Confirm both TX and RX Data Bits are set to 8 and Stop Bits to 1." },
    ],
    successMessage: "Protocol Configured! Both interfaces set to 115200-8-E-1.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateUARTChallenge2",
  },
  {
    id: "uart-ch-3",
    labId: "uart",
    title: "Challenge 3: Diagnose TX/RX Mismatch",
    description:
      "The communication link is broken because TX is sending at 9600 Baud while RX is listening at 115200 Baud. Reconfigure RX to match TX (9600 Baud).",
    difficulty: "ADVANCED",
    objectives: [
      "Observe UART COMMUNICATION LINK MISMATCH error banner",
      "Change Receiver RX Baud Rate from 115200 to 9600",
      "Verify warning banner clears and serial link is restored",
    ],
    hints: [
      { order: 1, text: "Observe the red warning banner in the workspace explaining the Baud Rate mismatch." },
      { order: 2, text: "Select Receiver RX in the Inspector." },
      { order: 3, text: "Change Receiver Baud Rate from 115200 to 9600 to restore compatibility." },
    ],
    successMessage: "Diagnosis Complete! Mismatch resolved — both TX and RX operating at 9600 Baud.",
    scoringRules: { baseScore: 100, hintPenalty: 10, attemptPenalty: 15, minScore: 10 },
    validatorKey: "validateUARTChallenge3",
  },
];
