/**
 * EmbeddedLab OS — GPIO Simulator Unit Tests
 */
import { describe, it, expect } from "vitest";
import {
  createDefaultGPIOState,
  setPinMode,
  setPinLevel,
  setInputPinLevel,
  togglePin,
} from "@/lib/simulator/gpio";

describe("GPIO state transitions", () => {
  describe("setPinMode", () => {
    it("sets mode to OUTPUT and defaults level to LOW", () => {
      const state = createDefaultGPIOState();
      const { state: newState } = setPinMode(state, 0, "OUTPUT");
      expect(newState.pins[0]!.mode).toBe("OUTPUT");
      expect(newState.pins[0]!.level).toBe("LOW");
    });

    it("sets mode to INPUT_PULLUP and defaults level to HIGH", () => {
      const state = createDefaultGPIOState();
      const { state: newState } = setPinMode(state, 0, "INPUT_PULLUP");
      expect(newState.pins[0]!.mode).toBe("INPUT_PULLUP");
      expect(newState.pins[0]!.level).toBe("HIGH");
    });

    it("sets mode to INPUT_PULLDOWN and defaults level to LOW", () => {
      const state = createDefaultGPIOState();
      const { state: newState } = setPinMode(state, 0, "INPUT_PULLDOWN");
      expect(newState.pins[0]!.mode).toBe("INPUT_PULLDOWN");
      expect(newState.pins[0]!.level).toBe("LOW");
    });

    it("sets mode to INPUT and defaults level to FLOATING", () => {
      const state = createDefaultGPIOState();
      const { state: newState } = setPinMode(state, 0, "INPUT");
      expect(newState.pins[0]!.mode).toBe("INPUT");
      expect(newState.pins[0]!.level).toBe("FLOATING");
    });

    it("only modifies the targeted pin", () => {
      const state = createDefaultGPIOState();
      const { state: newState } = setPinMode(state, 3, "OUTPUT");
      // Pin 0 should be unchanged
      expect(newState.pins[0]!.mode).toBe("INPUT");
      expect(newState.pins[3]!.mode).toBe("OUTPUT");
    });

    it("throws on invalid pin id", () => {
      const state = createDefaultGPIOState();
      expect(() => setPinMode(state, 999, "OUTPUT")).toThrow(/Invalid pin id/);
    });

    it("produces event with correct type and labId", () => {
      const state = createDefaultGPIOState();
      const { event } = setPinMode(state, 0, "OUTPUT");
      expect(event.type).toBe("pin_mode_changed");
      expect(event.labId).toBe("gpio");
    });
  });

  describe("setPinLevel", () => {
    it("sets an OUTPUT pin to HIGH", () => {
      let state = createDefaultGPIOState();
      ({ state } = setPinMode(state, 0, "OUTPUT"));
      const { state: newState } = setPinLevel(state, 0, "HIGH");
      expect(newState.pins[0]!.level).toBe("HIGH");
    });

    it("sets an OUTPUT pin to LOW", () => {
      let state = createDefaultGPIOState();
      ({ state } = setPinMode(state, 0, "OUTPUT"));
      ({ state } = setPinLevel(state, 0, "HIGH"));
      const { state: newState } = setPinLevel(state, 0, "LOW");
      expect(newState.pins[0]!.level).toBe("LOW");
    });

    it("throws when trying to drive an INPUT pin", () => {
      const state = createDefaultGPIOState(); // all pins default to INPUT
      expect(() => setPinLevel(state, 0, "HIGH")).toThrow(/not OUTPUT/);
    });

    it("throws when setting FLOATING on an OUTPUT pin", () => {
      let state = createDefaultGPIOState();
      ({ state } = setPinMode(state, 0, "OUTPUT"));
      expect(() => setPinLevel(state, 0, "FLOATING")).toThrow(/cannot be set to FLOATING/);
    });
  });

  describe("togglePin", () => {
    it("toggles from LOW to HIGH", () => {
      let state = createDefaultGPIOState();
      ({ state } = setPinMode(state, 0, "OUTPUT")); // starts at LOW
      const { state: newState } = togglePin(state, 0);
      expect(newState.pins[0]!.level).toBe("HIGH");
    });

    it("toggles from HIGH to LOW", () => {
      let state = createDefaultGPIOState();
      ({ state } = setPinMode(state, 0, "OUTPUT"));
      ({ state } = setPinLevel(state, 0, "HIGH"));
      const { state: newState } = togglePin(state, 0);
      expect(newState.pins[0]!.level).toBe("LOW");
    });

    it("throws when toggling an INPUT pin", () => {
      const state = createDefaultGPIOState();
      expect(() => togglePin(state, 0)).toThrow(/not in OUTPUT mode/);
    });
  });

  describe("setInputPinLevel", () => {
    it("simulates input stimulus on an INPUT_PULLUP pin (e.g. button pressed -> LOW)", () => {
      let state = createDefaultGPIOState();
      ({ state } = setPinMode(state, 0, "INPUT_PULLUP"));
      expect(state.pins[0]!.level).toBe("HIGH");

      const { state: pressedState, event } = setInputPinLevel(state, 0, "LOW");
      expect(pressedState.pins[0]!.level).toBe("LOW");
      expect(event.type).toBe("pin_input_changed");
      expect(event.severity).toBe("INFO");
    });

    it("throws on invalid pin id", () => {
      const state = createDefaultGPIOState();
      expect(() => setInputPinLevel(state, 100, "LOW")).toThrow(/Invalid pin id/);
    });
  });

  describe("default state", () => {
    it("has 16 pins", () => {
      const state = createDefaultGPIOState();
      expect(state.pins).toHaveLength(16);
    });

    it("all pins default to INPUT mode", () => {
      const state = createDefaultGPIOState();
      state.pins.forEach((pin) => expect(pin.mode).toBe("INPUT"));
    });

    it("all pins default to FLOATING level", () => {
      const state = createDefaultGPIOState();
      state.pins.forEach((pin) => expect(pin.level).toBe("FLOATING"));
    });
  });
});
