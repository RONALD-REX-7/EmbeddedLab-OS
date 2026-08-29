/**
 * EmbeddedLab OS — lib/simulator/uart.ts
 *
 * UART simulation logic. Pure TypeScript — no React, no UI dependencies.
 *
 * Validates configuration compatibility between a transmitter and receiver.
 * Calculates frame timing from baud rate and frame structure.
 */
import type {
  UARTConfig,
  UARTDerivedValues,
  UARTState,
  SimulationEvent,
} from "@/types/simulator";
import { generateEventId } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Valid baud rates (standard values)
// ---------------------------------------------------------------------------

export const STANDARD_BAUD_RATES = [
  300, 600, 1200, 2400, 4800, 9600, 14400, 19200, 38400,
  57600, 115200, 230400, 460800, 921600, 1000000,
] as const;

export type StandardBaudRate = (typeof STANDARD_BAUD_RATES)[number];

// ---------------------------------------------------------------------------
// Default state factory
// ---------------------------------------------------------------------------

const DEFAULT_UART_CONFIG: UARTConfig = {
  baudRate: 9600,
  dataBits: 8,
  parity: "NONE",
  stopBits: 1,
  flowControl: false,
};

export function createDefaultUARTState(): UARTState {
  return {
    transmitter: { ...DEFAULT_UART_CONFIG },
    receiver: { ...DEFAULT_UART_CONFIG },
    compatible: true,
    compatibilityNote: "Transmitter and receiver configurations match.",
    txBuffer: [],
    rxBuffer: [],
  };
}

// ---------------------------------------------------------------------------
// Derived value calculation
// ---------------------------------------------------------------------------

/**
 * Calculate UART frame timing from configuration.
 *
 * Frame structure:
 *   1 start bit + N data bits + P parity bit + S stop bits
 *
 * Bit duration = 1 / baud_rate (seconds)
 */
export function calculateUARTDerivedValues(config: UARTConfig): UARTDerivedValues {
  const parityBits = config.parity === "NONE" ? 0 : 1;
  const bitsPerFrame = 1 + config.dataBits + parityBits + config.stopBits;
  const bitDurationMicros = (1 / config.baudRate) * 1_000_000;
  const frameDurationMicros = bitsPerFrame * bitDurationMicros;
  // Throughput: only the data bits carry useful payload
  const maxBytesPerSecond =
    config.baudRate / (1 + config.dataBits + parityBits + config.stopBits);

  return {
    bitsPerFrame,
    bitDurationMicros,
    frameDurationMicros,
    maxBytesPerSecond,
  };
}

// ---------------------------------------------------------------------------
// Compatibility validation
// ---------------------------------------------------------------------------

/**
 * Determine whether a transmitter and receiver config are compatible.
 * Returns a human-readable explanation of any mismatch.
 */
export function checkUARTCompatibility(
  tx: UARTConfig,
  rx: UARTConfig
): { compatible: boolean; note: string } {
  const issues: string[] = [];

  if (tx.baudRate !== rx.baudRate) {
    issues.push(`Baud rate mismatch: TX=${tx.baudRate}, RX=${rx.baudRate}`);
  }
  if (tx.dataBits !== rx.dataBits) {
    issues.push(`Data bits mismatch: TX=${tx.dataBits}, RX=${rx.dataBits}`);
  }
  if (tx.parity !== rx.parity) {
    issues.push(`Parity mismatch: TX=${tx.parity}, RX=${rx.parity}`);
  }
  if (tx.stopBits !== rx.stopBits) {
    issues.push(`Stop bits mismatch: TX=${tx.stopBits}, RX=${rx.stopBits}`);
  }

  if (issues.length === 0) {
    return {
      compatible: true,
      note: "Transmitter and receiver configurations match.",
    };
  }
  return {
    compatible: false,
    note: issues.join(" | "),
  };
}

// ---------------------------------------------------------------------------
// State transitions
// ---------------------------------------------------------------------------

export function setTransmitterConfig(
  state: UARTState,
  config: Partial<UARTConfig>
): { state: UARTState; event: SimulationEvent } {
  const newTx: UARTConfig = { ...state.transmitter, ...config };
  const { compatible, note } = checkUARTCompatibility(newTx, state.receiver);

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: compatible ? "INFO" : "WARNING",
    labId: "uart",
    type: "uart_tx_config_changed",
    message: compatible
      ? `TX config updated: ${newTx.baudRate} baud, ${newTx.dataBits}N${newTx.stopBits}`
      : `TX config updated — incompatibility detected: ${note}`,
    payload: { config: newTx, compatible, note },
  };

  return {
    state: { ...state, transmitter: newTx, compatible, compatibilityNote: note },
    event,
  };
}

export function setReceiverConfig(
  state: UARTState,
  config: Partial<UARTConfig>
): { state: UARTState; event: SimulationEvent } {
  const newRx: UARTConfig = { ...state.receiver, ...config };
  const { compatible, note } = checkUARTCompatibility(state.transmitter, newRx);

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: compatible ? "INFO" : "WARNING",
    labId: "uart",
    type: "uart_rx_config_changed",
    message: compatible
      ? `RX config updated: ${newRx.baudRate} baud, ${newRx.dataBits}N${newRx.stopBits}`
      : `RX config updated — incompatibility detected: ${note}`,
    payload: { config: newRx, compatible, note },
  };

  return {
    state: { ...state, receiver: newRx, compatible, compatibilityNote: note },
    event,
  };
}

export function resetUARTState(): UARTState {
  return createDefaultUARTState();
}

export function uartTransmit(
  state: UARTState,
  message: string
): { state: UARTState; event: SimulationEvent } {
  const isCompatible = state.compatible;
  const newTxBuffer = [...(state.txBuffer || []), message];
  const rxMsg = isCompatible
    ? message
    : `[FRAMING/BAUD ERROR: ${state.compatibilityNote}]`;
  const newRxBuffer = [...(state.rxBuffer || []), rxMsg];

  const newState: UARTState = {
    ...state,
    txBuffer: newTxBuffer,
    rxBuffer: newRxBuffer,
  };

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: isCompatible ? "SUCCESS" : "ERROR",
    labId: "uart",
    type: isCompatible ? "uart_tx_success" : "uart_tx_framing_mismatch",
    message: isCompatible
      ? `UART TX Sent: "${message}" → RX Received successfully.`
      : `UART TX Transmission failed: ${state.compatibilityNote}`,
    payload: { message, compatible: isCompatible },
  };

  return { state: newState, event };
}
