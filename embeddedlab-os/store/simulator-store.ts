/**
 * EmbeddedLab OS — store/simulator-store.ts
 *
 * Central Zustand store wrapping the deterministic SimulationEngine.
 * Exposes commands, reset actions, and reactive state snapshots.
 *
 * UI components access this store strictly via custom hooks in `hooks/`.
 */
import { create } from "zustand";
import { SimulationEngine } from "@/lib/simulator/engine";
import type {
  ADCResolution,
  LabId,
  LogicLevel,
  MicrocontrollerState,
  PinMode,
  SimulationEvent,
  SimulationState,
  UARTConfig,
} from "@/types/simulator";

interface SimulatorStoreState {
  /** The single source of truth engine instance */
  engine: SimulationEngine;
  /** Reactive snapshot of current microcontroller state */
  mcuState: MicrocontrollerState;
  /** Reactive snapshot of current event log */
  events: SimulationEvent[];

  // -------------------------------------------------------------------------
  // Actions — GPIO
  // -------------------------------------------------------------------------
  gpioSetPinMode: (pinId: number, mode: PinMode) => void;
  gpioSetPinLevel: (pinId: number, level: LogicLevel) => void;
  gpioSetInputLevel: (pinId: number, level: LogicLevel) => void;
  gpioTogglePin: (pinId: number) => void;

  // -------------------------------------------------------------------------
  // Actions — PWM
  // -------------------------------------------------------------------------
  pwmSetFrequency: (channelId: number, frequencyHz: number) => void;
  pwmSetDutyCycle: (channelId: number, dutyCyclePercent: number) => void;
  pwmSetChannelEnabled: (channelId: number, enabled: boolean) => void;

  // -------------------------------------------------------------------------
  // Actions — ADC
  // -------------------------------------------------------------------------
  adcSetInputVoltage: (channelId: number, voltageV: number) => void;
  adcSetResolution: (channelId: number, resolution: ADCResolution) => void;
  adcSetReferenceVoltage: (channelId: number, vref: number) => void;
  adcSetChannelEnabled: (channelId: number, enabled: boolean) => void;

  // -------------------------------------------------------------------------
  // Actions — UART
  // -------------------------------------------------------------------------
  uartSetTransmitterConfig: (config: Partial<UARTConfig>) => void;
  uartSetReceiverConfig: (config: Partial<UARTConfig>) => void;
  uartTransmit: (message: string) => void;

  // -------------------------------------------------------------------------
  // Actions — Engine Reset & Snapshot
  // -------------------------------------------------------------------------
  reset: (labId?: LabId) => void;
  getSimulationState: () => SimulationState;
}

const initialEngine = new SimulationEngine();

export const useSimulatorStore = create<SimulatorStoreState>((set, get) => ({
  engine: initialEngine,
  mcuState: initialEngine.state,
  events: [...initialEngine.events],

  // -------------------------------------------------------------------------
  // GPIO Action Handlers
  // -------------------------------------------------------------------------
  gpioSetPinMode: (pinId, mode) => {
    const { engine } = get();
    engine.gpioSetPinMode(pinId, mode);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  gpioSetPinLevel: (pinId, level) => {
    const { engine } = get();
    engine.gpioSetPinLevel(pinId, level);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  gpioSetInputLevel: (pinId, level) => {
    const { engine } = get();
    engine.gpioSetInputLevel(pinId, level);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  gpioTogglePin: (pinId) => {
    const { engine } = get();
    engine.gpioTogglePin(pinId);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  // -------------------------------------------------------------------------
  // PWM Action Handlers
  // -------------------------------------------------------------------------
  pwmSetFrequency: (channelId, frequencyHz) => {
    const { engine } = get();
    engine.pwmSetFrequency(channelId, frequencyHz);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  pwmSetDutyCycle: (channelId, dutyCyclePercent) => {
    const { engine } = get();
    engine.pwmSetDutyCycle(channelId, dutyCyclePercent);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  pwmSetChannelEnabled: (channelId, enabled) => {
    const { engine } = get();
    engine.pwmSetChannelEnabled(channelId, enabled);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  // -------------------------------------------------------------------------
  // ADC Action Handlers
  // -------------------------------------------------------------------------
  adcSetInputVoltage: (channelId, voltageV) => {
    const { engine } = get();
    engine.adcSetInputVoltage(channelId, voltageV);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  adcSetResolution: (channelId, resolution) => {
    const { engine } = get();
    engine.adcSetResolution(channelId, resolution);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  adcSetReferenceVoltage: (channelId, vref) => {
    const { engine } = get();
    engine.adcSetReferenceVoltage(channelId, vref);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  adcSetChannelEnabled: (channelId, enabled) => {
    const { engine } = get();
    engine.adcSetChannelEnabled(channelId, enabled);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  // -------------------------------------------------------------------------
  // UART Action Handlers
  // -------------------------------------------------------------------------
  uartSetTransmitterConfig: (config) => {
    const { engine } = get();
    engine.uartSetTransmitterConfig(config);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  uartSetReceiverConfig: (config) => {
    const { engine } = get();
    engine.uartSetReceiverConfig(config);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  uartTransmit: (message) => {
    const { engine } = get();
    engine.uartTransmit(message);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  // -------------------------------------------------------------------------
  // Reset Action Handler
  // -------------------------------------------------------------------------
  reset: (labId) => {
    const { engine } = get();
    engine.reset(labId);
    set({ mcuState: engine.state, events: [...engine.events] });
  },

  getSimulationState: () => {
    return get().engine.toSimulationState();
  },
}));
