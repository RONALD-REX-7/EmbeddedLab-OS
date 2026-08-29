/**
 * EmbeddedLab OS — lib/simulator/gpio.ts
 *
 * GPIO simulation logic. Pure TypeScript — no React, no UI dependencies.
 * All functions are deterministic and referentially transparent.
 */
import type {
  DigitalPin,
  GPIOState,
  LogicLevel,
  PinMode,
  SimulationEvent,
} from "@/types/simulator";
import { generateEventId } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Default state factory
// ---------------------------------------------------------------------------

/** Number of virtual GPIO pins on the simulated MCU */
export const GPIO_PIN_COUNT = 16;

/** Pin labels matching a generic STM32-like naming convention */
const PIN_LABELS: string[] = [
  "PA0", "PA1", "PA2", "PA3", "PA4", "PA5", "PA6", "PA7",
  "PB0", "PB1", "PB2", "PB3", "PB4", "PB5", "PB6", "PB7",
];

export function createDefaultGPIOState(): GPIOState {
  const pins: DigitalPin[] = Array.from({ length: GPIO_PIN_COUNT }, (_, i) => ({
    id: i,
    label: PIN_LABELS[i] ?? `P${i}`,
    mode: "INPUT",
    level: "FLOATING",
    isActive: false,
  }));
  return { pins };
}

// ---------------------------------------------------------------------------
// State transitions
// ---------------------------------------------------------------------------

/**
 * Set the mode of a specific pin.
 * Returns the new state and an event describing the change.
 */
export function setPinMode(
  state: GPIOState,
  pinId: number,
  mode: PinMode
): { state: GPIOState; event: SimulationEvent } {
  const pin = state.pins[pinId];
  if (!pin) {
    throw new Error(`GPIO: Invalid pin id ${pinId}`);
  }

  // When switching to OUTPUT, default level to LOW.
  // When switching to INPUT, level becomes FLOATING unless pull resistors are set.
  const newLevel: LogicLevel =
    mode === "OUTPUT"
      ? "LOW"
      : mode === "INPUT_PULLUP"
      ? "HIGH"
      : mode === "INPUT_PULLDOWN"
      ? "LOW"
      : "FLOATING";

  const newPins = state.pins.map((p) =>
    p.id === pinId ? { ...p, mode, level: newLevel } : p
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "gpio",
    type: "pin_mode_changed",
    message: `${pin.label}: mode set to ${mode} (level → ${newLevel})`,
    payload: { pinId, mode, level: newLevel },
  };

  return { state: { ...state, pins: newPins }, event };
}

/**
 * Set the output level of a pin that is configured as OUTPUT.
 * Throws if the pin is not in OUTPUT mode (INPUT pins cannot be driven).
 */
export function setPinLevel(
  state: GPIOState,
  pinId: number,
  level: LogicLevel
): { state: GPIOState; event: SimulationEvent } {
  const pin = state.pins[pinId];
  if (!pin) {
    throw new Error(`GPIO: Invalid pin id ${pinId}`);
  }
  if (pin.mode !== "OUTPUT") {
    throw new Error(
      `GPIO: Cannot drive pin ${pin.label} — it is configured as ${pin.mode}, not OUTPUT`
    );
  }
  if (level === "FLOATING") {
    throw new Error(`GPIO: OUTPUT pin ${pin.label} cannot be set to FLOATING`);
  }

  const newPins = state.pins.map((p) =>
    p.id === pinId ? { ...p, level } : p
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "gpio",
    type: "pin_level_changed",
    message: `${pin.label}: output set to ${level}`,
    payload: { pinId, level },
  };

  return { state: { ...state, pins: newPins }, event };
}

/**
 * Toggle an OUTPUT pin between HIGH and LOW.
 */
export function togglePin(
  state: GPIOState,
  pinId: number
): { state: GPIOState; event: SimulationEvent } {
  const pin = state.pins[pinId];
  if (!pin) throw new Error(`GPIO: Invalid pin id ${pinId}`);
  if (pin.mode !== "OUTPUT") {
    throw new Error(`GPIO: Cannot toggle pin ${pin.label} — not in OUTPUT mode`);
  }
  const newLevel: LogicLevel = pin.level === "HIGH" ? "LOW" : "HIGH";
  return setPinLevel(state, pinId, newLevel);
}

/**
 * Reset all pins to their default (INPUT, FLOATING) state.
 */
export function resetGPIOState(): GPIOState {
  return createDefaultGPIOState();
}

// ---------------------------------------------------------------------------
// Read helpers (pure, no side effects)
// ---------------------------------------------------------------------------

export function getPin(state: GPIOState, pinId: number): DigitalPin {
  const pin = state.pins[pinId];
  if (!pin) throw new Error(`GPIO: Invalid pin id ${pinId}`);
  return pin;
}

export function getOutputPins(state: GPIOState): DigitalPin[] {
  return state.pins.filter((p) => p.mode === "OUTPUT");
}

export function getHighPins(state: GPIOState): DigitalPin[] {
  return state.pins.filter((p) => p.level === "HIGH");
}
