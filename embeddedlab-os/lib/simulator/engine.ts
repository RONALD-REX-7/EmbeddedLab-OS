/**
 * EmbeddedLab OS — lib/simulator/engine.ts
 *
 * Top-level simulation engine.
 * Aggregates the GPIO, PWM, ADC, and UART sub-simulators.
 * Manages the event log and exposes a unified interface to UI stores.
 *
 * This class is framework-agnostic. It does not import React, Next.js, or
 * any UI library. Zustand stores use this class internally.
 */
import type {
  ADCResolution,
  LabId,
  LogicLevel,
  MicrocontrollerState,
  PinMode,
  SimulationEvent,
  UARTConfig,
} from "@/types/simulator";
import {
  createDefaultGPIOState,
  resetGPIOState,
  setInputPinLevel,
  setPinLevel,
  setPinMode,
  togglePin,
} from "@/lib/simulator/gpio";
import {
  createDefaultPWMState,
  resetPWMState,
  setChannelDutyCycle,
  setChannelEnabled as setPWMChannelEnabled,
  setChannelFrequency,
} from "@/lib/simulator/pwm";
import {
  createDefaultADCState,
  resetADCState,
  setChannelEnabled as setADCChannelEnabled,
  setChannelInputVoltage,
  setChannelResolution,
  setChannelReferenceVoltage,
} from "@/lib/simulator/adc";
import {
  createDefaultUARTState,
  resetUARTState,
  setReceiverConfig,
  setTransmitterConfig,
  uartTransmit,
} from "@/lib/simulator/uart";

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export const MAX_EVENT_LOG_SIZE = 200;

export class SimulationEngine {
  private _state: MicrocontrollerState;
  private _events: SimulationEvent[] = [];

  constructor() {
    this._state = this._createDefaultState();
  }

  private _createDefaultState(): MicrocontrollerState {
    return {
      gpio: createDefaultGPIOState(),
      pwm: createDefaultPWMState(),
      adc: createDefaultADCState(),
      uart: createDefaultUARTState(),
      clock: {
        frequencyHz: 16_000_000,
        uptimeMs: 0,
      },
    };
  }

  // -------------------------------------------------------------------------
  // Read accessors (return immutable snapshots)
  // -------------------------------------------------------------------------

  get state(): Readonly<MicrocontrollerState> {
    return this._state;
  }

  get events(): ReadonlyArray<SimulationEvent> {
    return this._events;
  }

  toSimulationState() {
    return {
      digitalPins: this._state.gpio.pins,
      analogChannels: this._state.adc.channels,
      pwmChannels: this._state.pwm.channels,
      uart: this._state.uart,
      clock: this._state.clock,
      eventLog: this._events,
    };
  }

  // -------------------------------------------------------------------------
  // Reset
  // -------------------------------------------------------------------------

  reset(labId?: LabId): void {
    if (!labId) {
      this._state = this._createDefaultState();
      this._events = [];
      return;
    }
    switch (labId) {
      case "gpio":
        this._state = { ...this._state, gpio: resetGPIOState() };
        break;
      case "pwm":
        this._state = { ...this._state, pwm: resetPWMState() };
        break;
      case "adc":
        this._state = { ...this._state, adc: resetADCState() };
        break;
      case "uart":
        this._state = { ...this._state, uart: resetUARTState() };
        break;
    }
  }

  // -------------------------------------------------------------------------
  // GPIO commands
  // -------------------------------------------------------------------------

  gpioSetPinMode(pinId: number, mode: PinMode): void {
    const { state, event } = setPinMode(this._state.gpio, pinId, mode);
    this._state = { ...this._state, gpio: state };
    this._appendEvent(event);
  }

  gpioSetPinLevel(pinId: number, level: LogicLevel): void {
    const { state, event } = setPinLevel(this._state.gpio, pinId, level);
    this._state = { ...this._state, gpio: state };
    this._appendEvent(event);
  }

  gpioSetInputLevel(pinId: number, level: LogicLevel): void {
    const { state, event } = setInputPinLevel(this._state.gpio, pinId, level);
    this._state = { ...this._state, gpio: state };
    this._appendEvent(event);
  }

  gpioTogglePin(pinId: number): void {
    const { state, event } = togglePin(this._state.gpio, pinId);
    this._state = { ...this._state, gpio: state };
    this._appendEvent(event);
  }

  // -------------------------------------------------------------------------
  // PWM commands
  // -------------------------------------------------------------------------

  pwmSetFrequency(channelId: number, frequencyHz: number): void {
    const { state, event } = setChannelFrequency(this._state.pwm, channelId, frequencyHz);
    this._state = { ...this._state, pwm: state };
    this._appendEvent(event);
  }

  pwmSetDutyCycle(channelId: number, dutyCyclePercent: number): void {
    const { state, event } = setChannelDutyCycle(this._state.pwm, channelId, dutyCyclePercent);
    this._state = { ...this._state, pwm: state };
    this._appendEvent(event);
  }

  pwmSetChannelEnabled(channelId: number, enabled: boolean): void {
    const { state, event } = setPWMChannelEnabled(this._state.pwm, channelId, enabled);
    this._state = { ...this._state, pwm: state };
    this._appendEvent(event);
  }

  // -------------------------------------------------------------------------
  // ADC commands
  // -------------------------------------------------------------------------

  adcSetInputVoltage(channelId: number, voltageV: number): void {
    const { state, event } = setChannelInputVoltage(this._state.adc, channelId, voltageV);
    this._state = { ...this._state, adc: state };
    this._appendEvent(event);
  }

  adcSetResolution(channelId: number, resolution: ADCResolution): void {
    const { state, event } = setChannelResolution(this._state.adc, channelId, resolution);
    this._state = { ...this._state, adc: state };
    this._appendEvent(event);
  }

  adcSetReferenceVoltage(channelId: number, vref: number): void {
    const { state, event } = setChannelReferenceVoltage(this._state.adc, channelId, vref);
    this._state = { ...this._state, adc: state };
    this._appendEvent(event);
  }

  adcSetChannelEnabled(channelId: number, enabled: boolean): void {
    const { state, event } = setADCChannelEnabled(this._state.adc, channelId, enabled);
    this._state = { ...this._state, adc: state };
    this._appendEvent(event);
  }

  // -------------------------------------------------------------------------
  // UART commands
  // -------------------------------------------------------------------------

  uartSetTransmitterConfig(config: Partial<UARTConfig>): void {
    const { state, event } = setTransmitterConfig(this._state.uart, config);
    this._state = { ...this._state, uart: state };
    this._appendEvent(event);
  }

  uartSetReceiverConfig(config: Partial<UARTConfig>): void {
    const { state, event } = setReceiverConfig(this._state.uart, config);
    this._state = { ...this._state, uart: state };
    this._appendEvent(event);
  }

  uartTransmit(message: string): void {
    const { state, event } = uartTransmit(this._state.uart, message);
    this._state = { ...this._state, uart: state };
    this._appendEvent(event);
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private _appendEvent(event: SimulationEvent): void {
    this._events = [event, ...this._events].slice(0, MAX_EVENT_LOG_SIZE);
  }
}
