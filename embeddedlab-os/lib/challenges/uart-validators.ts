/**
 * EmbeddedLab OS — lib/challenges/uart-validators.ts
 * Pure deterministic validation functions for UART challenges.
 * Validates actual microcontroller simulator state — never UI clicks.
 */
import type { MicrocontrollerState, ValidationResult } from "@/types/simulator";
import { checkUARTCompatibility } from "@/lib/simulator/uart";

/**
 * Challenge 1: Successfully transmit at least 1 message when TX and RX are compatible.
 */
export function validateUARTChallenge1(state: MicrocontrollerState): ValidationResult {
  const uart = state.uart;

  const compatibility = checkUARTCompatibility(uart.transmitter, uart.receiver);
  const isCompatible = compatibility.compatible;
  const hasTransmitted = uart.txBuffer.length > 0;
  const passed = isCompatible && hasTransmitted;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? `Challenge Passed! Message "${uart.txBuffer[uart.txBuffer.length - 1]}" successfully transmitted and received over UART.`
      : "Challenge Failed. Ensure TX and RX configurations match and click Send to transmit a message.",
    conditions: [
      {
        label: "TX and RX configurations compatible",
        passed: isCompatible,
        detail: compatibility.note || "Matching parameters",
      },
      {
        label: "At least 1 message transmitted",
        passed: hasTransmitted,
        detail: `Transmitted messages: ${uart.txBuffer.length}`,
      },
    ],
  };
}

/**
 * Challenge 2: Configure UART to target specification: 115200 Baud, 8 Data Bits, EVEN Parity, 1 Stop Bit.
 */
export function validateUARTChallenge2(state: MicrocontrollerState): ValidationResult {
  const { transmitter: tx, receiver: rx } = state.uart;

  const isTxMatch =
    tx.baudRate === 115200 && tx.dataBits === 8 && tx.parity === "EVEN" && tx.stopBits === 1;
  const isRxMatch =
    rx.baudRate === 115200 && rx.dataBits === 8 && rx.parity === "EVEN" && rx.stopBits === 1;

  const passed = isTxMatch && isRxMatch;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Challenge Passed! Both TX and RX correctly configured to 115200-8-E-1."
      : "Challenge Failed. Configure both TX and RX to Baud=115200, Data=8, Parity=EVEN, Stop=1.",
    conditions: [
      {
        label: "Transmitter configured to 115200-8-E-1",
        passed: isTxMatch,
        detail: `TX: ${tx.baudRate}-${tx.dataBits}-${tx.parity.charAt(0)}-${tx.stopBits}`,
      },
      {
        label: "Receiver configured to 115200-8-E-1",
        passed: isRxMatch,
        detail: `RX: ${rx.baudRate}-${rx.dataBits}-${rx.parity.charAt(0)}-${rx.stopBits}`,
      },
    ],
  };
}

/**
 * Challenge 3: Diagnose TX/RX baud rate mismatch (TX=9600 vs RX=115200) and resolve it.
 */
export function validateUARTChallenge3(state: MicrocontrollerState): ValidationResult {
  const uart = state.uart;
  const compatibility = checkUARTCompatibility(uart.transmitter, uart.receiver);

  const isCompatible = compatibility.compatible;
  const isBaud9600 = uart.transmitter.baudRate === 9600 && uart.receiver.baudRate === 9600;
  const passed = isCompatible && isBaud9600;

  return {
    passed,
    score: passed ? 100 : 0,
    feedback: passed
      ? "Diagnosis Complete! Mismatch resolved — both TX and RX are operating at 9600 Baud."
      : "Challenge Failed. Resolve the baud rate mismatch by matching RX baud rate to TX (9600 Baud).",
    conditions: [
      {
        label: "Baud rate mismatch resolved (TX = RX = 9600)",
        passed: isBaud9600,
        detail: `TX=${uart.transmitter.baudRate}, RX=${uart.receiver.baudRate}`,
      },
      {
        label: "All UART parameters compatible",
        passed: isCompatible,
        detail: compatibility.note || "Compatible",
      },
    ],
  };
}
