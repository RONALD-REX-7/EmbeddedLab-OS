/**
 * EmbeddedLab OS — lib/simulator/adc.ts
 *
 * ADC simulation logic. Pure TypeScript — no React, no UI dependencies.
 *
 * Core formula:
 *   digital_value = floor((Vin / Vref) × (2^N − 1))
 *
 * Where:
 *   Vin  = input voltage (volts)
 *   Vref = reference voltage (volts)
 *   N    = resolution in bits
 */
import type {
  ADCDerivedValues,
  ADCResolution,
  ADCState,
  AnalogChannel,
  SimulationEvent,
} from "@/types/simulator";
import { clamp, generateEventId } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const ADC_CHANNEL_COUNT = 4;
export const ADC_DEFAULT_VREF = 3.3; // volts
export const ADC_MIN_VOLTAGE = 0;    // volts

const CHANNEL_LABELS = ["ADC1_IN0", "ADC1_IN1", "ADC1_IN2", "ADC1_IN3"];

// ---------------------------------------------------------------------------
// Default state factory
// ---------------------------------------------------------------------------

export function createDefaultADCState(): ADCState {
  const channels: AnalogChannel[] = Array.from(
    { length: ADC_CHANNEL_COUNT },
    (_, i) => ({
      id: i,
      label: CHANNEL_LABELS[i] ?? `ADC_CH${i}`,
      inputVoltage: 0,
      referenceVoltage: ADC_DEFAULT_VREF,
      resolution: 12 as ADCResolution,
      enabled: false,
    })
  );
  return { channels };
}

// ---------------------------------------------------------------------------
// Core ADC formula (the only place this calculation lives)
// ---------------------------------------------------------------------------

/**
 * Calculate all ADC derived values from channel configuration.
 *
 * Throws if Vin > Vref (over-range input — would saturate the ADC).
 * Throws if Vref ≤ 0 (invalid reference voltage).
 */
export function calculateADCDerivedValues(
  inputVoltage: number,
  referenceVoltage: number,
  resolution: ADCResolution
): ADCDerivedValues {
  if (referenceVoltage <= 0) {
    throw new Error("ADC: Reference voltage must be greater than zero");
  }

  const clampedInput = Math.min(Math.max(inputVoltage, 0), referenceVoltage);
  const maxDigitalValue = Math.pow(2, resolution) - 1;
  const digitalValue = Math.round((clampedInput / referenceVoltage) * maxDigitalValue);
  const lsbMillivolts = (referenceVoltage / maxDigitalValue) * 1000;

  // Quantization error: the difference between reconstructed voltage and actual Vin,
  // as a percentage of Vref.
  const reconstructedVoltage = (digitalValue / maxDigitalValue) * referenceVoltage;
  const quantizationErrorPercent =
    (Math.abs(inputVoltage - reconstructedVoltage) / referenceVoltage) * 100;

  return {
    digitalValue,
    maxDigitalValue,
    lsbMillivolts,
    quantizationErrorPercent,
  };
}

// ---------------------------------------------------------------------------
// State transitions
// ---------------------------------------------------------------------------

export function setChannelInputVoltage(
  state: ADCState,
  channelId: number,
  inputVoltage: number
): { state: ADCState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`ADC: Invalid channel id ${channelId}`);

  const clamped = clamp(inputVoltage, ADC_MIN_VOLTAGE, channel.referenceVoltage);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId ? { ...ch, inputVoltage: clamped } : ch
  );

  const derived = calculateADCDerivedValues(
    clamped,
    channel.referenceVoltage,
    channel.resolution
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "adc",
    type: "adc_voltage_changed",
    message: `${channel.label}: Vin = ${clamped.toFixed(3)}V → digital = ${derived.digitalValue} (0x${derived.digitalValue.toString(16).toUpperCase()})`,
    payload: { channelId, inputVoltage: clamped, ...derived },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function setChannelResolution(
  state: ADCState,
  channelId: number,
  resolution: ADCResolution
): { state: ADCState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`ADC: Invalid channel id ${channelId}`);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId ? { ...ch, resolution } : ch
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "adc",
    type: "adc_resolution_changed",
    message: `${channel.label}: resolution set to ${resolution}-bit (max = ${Math.pow(2, resolution) - 1})`,
    payload: { channelId, resolution },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function setChannelReferenceVoltage(
  state: ADCState,
  channelId: number,
  referenceVoltage: number
): { state: ADCState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`ADC: Invalid channel id ${channelId}`);

  if (referenceVoltage <= 0) {
    throw new Error("ADC: Reference voltage must be greater than zero");
  }

  // Clamp Vin to new Vref if it would exceed it
  const newVin = Math.min(channel.inputVoltage, referenceVoltage);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId
      ? { ...ch, referenceVoltage, inputVoltage: newVin }
      : ch
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "adc",
    type: "adc_vref_changed",
    message: `${channel.label}: Vref set to ${referenceVoltage}V`,
    payload: { channelId, referenceVoltage, inputVoltage: newVin },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function setChannelEnabled(
  state: ADCState,
  channelId: number,
  enabled: boolean
): { state: ADCState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`ADC: Invalid channel id ${channelId}`);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId ? { ...ch, enabled } : ch
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "adc",
    type: "adc_channel_toggled",
    message: `${channel.label}: ${enabled ? "enabled" : "disabled"}`,
    payload: { channelId, enabled },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function resetADCState(): ADCState {
  return createDefaultADCState();
}
