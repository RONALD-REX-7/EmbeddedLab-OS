import { describe, it, expect, beforeEach } from "vitest";
import { useSimulatorStore } from "@/store/simulator-store";

describe("useSimulatorStore — State Management Integration", () => {
  beforeEach(() => {
    // Reset global store before each test
    useSimulatorStore.getState().reset();
  });

  it("should initialize with correct default microcontroller state", () => {
    const { mcuState, events } = useSimulatorStore.getState();

    // Initial GPIO state
    expect(mcuState.gpio.pins).toHaveLength(16);
    expect(mcuState.gpio.pins[0].mode).toBe("INPUT");
    expect(mcuState.gpio.pins[0].level).toBe("FLOATING");

    // Initial PWM state
    expect(mcuState.pwm.channels).toHaveLength(4);

    // Initial ADC state
    expect(mcuState.adc.channels).toHaveLength(4);

    // Initial UART state
    expect(mcuState.uart.compatible).toBe(true);

    // Initial System Clock
    expect(mcuState.clock.frequencyHz).toBe(16_000_000);

    // Initial Event Log
    expect(events).toEqual([]);
  });

  it("should handle digital state changes and generate event log entries", () => {
    const store = useSimulatorStore.getState();

    // Change PA0 to OUTPUT
    store.gpioSetPinMode(0, "OUTPUT");

    let state = useSimulatorStore.getState();
    expect(state.mcuState.gpio.pins[0].mode).toBe("OUTPUT");
    expect(state.mcuState.gpio.pins[0].level).toBe("LOW");
    expect(state.events).toHaveLength(1);
    expect(state.events[0].type).toBe("pin_mode_changed");
    expect(state.events[0].labId).toBe("gpio");

    // Drive PA0 HIGH
    store.gpioSetPinLevel(0, "HIGH");

    state = useSimulatorStore.getState();
    expect(state.mcuState.gpio.pins[0].level).toBe("HIGH");
    expect(state.events).toHaveLength(2);
    expect(state.events[0].type).toBe("pin_level_changed");

    // Toggle PA0
    store.gpioTogglePin(0);

    state = useSimulatorStore.getState();
    expect(state.mcuState.gpio.pins[0].level).toBe("LOW");
    expect(state.events).toHaveLength(3);
  });

  it("should prevent invalid digital state transitions", () => {
    const store = useSimulatorStore.getState();

    // PA0 is in INPUT mode by default — driving level directly should throw
    expect(() => store.gpioSetPinLevel(0, "HIGH")).toThrowError(
      /Cannot drive pin PA0 — it is configured as INPUT, not OUTPUT/
    );

    // Pin level should remain FLOATING
    const state = useSimulatorStore.getState();
    expect(state.mcuState.gpio.pins[0].level).toBe("FLOATING");
  });

  it("should handle PWM state changes", () => {
    const store = useSimulatorStore.getState();

    store.pwmSetFrequency(0, 5000);
    store.pwmSetDutyCycle(0, 50);

    const state = useSimulatorStore.getState();
    expect(state.mcuState.pwm.channels[0].frequencyHz).toBe(5000);
    expect(state.mcuState.pwm.channels[0].dutyCyclePercent).toBe(50);
    expect(state.events.length).toBeGreaterThanOrEqual(2);
  });

  it("should handle ADC state changes", () => {
    const store = useSimulatorStore.getState();

    store.adcSetInputVoltage(0, 1.65);
    store.adcSetResolution(0, 10);

    const state = useSimulatorStore.getState();
    expect(state.mcuState.adc.channels[0].inputVoltage).toBe(1.65);
    expect(state.mcuState.adc.channels[0].resolution).toBe(10);
  });

  it("should handle UART config changes and detect incompatibilities", () => {
    const store = useSimulatorStore.getState();

    store.uartSetTransmitterConfig({ baudRate: 9600 });
    store.uartSetReceiverConfig({ baudRate: 115200 });

    const state = useSimulatorStore.getState();
    expect(state.mcuState.uart.compatible).toBe(false);
    expect(state.mcuState.uart.compatibilityNote).toContain("Baud rate mismatch");
  });

  it("should reset lab state cleanly", () => {
    const store = useSimulatorStore.getState();

    store.gpioSetPinMode(0, "OUTPUT");
    store.gpioSetPinLevel(0, "HIGH");
    expect(useSimulatorStore.getState().mcuState.gpio.pins[0].level).toBe("HIGH");

    // Perform reset for GPIO lab
    useSimulatorStore.getState().reset("gpio");

    const state = useSimulatorStore.getState();
    expect(state.mcuState.gpio.pins[0].mode).toBe("INPUT");
    expect(state.mcuState.gpio.pins[0].level).toBe("FLOATING");
  });

  it("should handle external input stimulus on INPUT pin without error", () => {
    const store = useSimulatorStore.getState();

    // Default pin 0 is INPUT
    store.gpioSetInputLevel(0, "HIGH");

    const state = useSimulatorStore.getState();
    expect(state.mcuState.gpio.pins[0].level).toBe("HIGH");
    expect(state.events[0].type).toBe("pin_input_changed");
  });

  it("should handle UART message transmission", () => {
    const store = useSimulatorStore.getState();

    store.uartTransmit("TEST TRANSMISSION");

    const state = useSimulatorStore.getState();
    expect(state.mcuState.uart.txBuffer).toEqual(["TEST TRANSMISSION"]);
    expect(state.mcuState.uart.rxBuffer).toEqual(["TEST TRANSMISSION"]);
  });

  it("should export full SimulationState snapshot", () => {
    const store = useSimulatorStore.getState();
    const simState = store.getSimulationState();

    expect(simState.digitalPins).toHaveLength(16);
    expect(simState.analogChannels).toHaveLength(4);
    expect(simState.pwmChannels).toHaveLength(4);
    expect(simState.uart).toBeDefined();
    expect(simState.clock.frequencyHz).toBe(16_000_000);
    expect(simState.eventLog).toBeDefined();
  });
});
