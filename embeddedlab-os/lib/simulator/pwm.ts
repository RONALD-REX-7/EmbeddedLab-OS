/**
 * EmbeddedLab OS — lib/simulator/pwm.ts
 *
 * PWM simulation logic. Pure TypeScript — no React, no UI dependencies.
 * All derived values are calculated from the canonical formula; nothing is hard-coded.
 */
import type {
  PWMChannel,
  PWMDerivedValues,
  PWMState,
  SimulationEvent,
} from "@/types/simulator";
import { clamp, generateEventId } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const PWM_FREQUENCY_MIN_HZ = 1;
export const PWM_FREQUENCY_MAX_HZ = 1_000_000; // 1 MHz
export const PWM_DUTY_CYCLE_MIN = 0;
export const PWM_DUTY_CYCLE_MAX = 100;
export const PWM_CHANNEL_COUNT = 4;

// ---------------------------------------------------------------------------
// Default state factory
// ---------------------------------------------------------------------------

const CHANNEL_LABELS = ["TIM1_CH1", "TIM1_CH2", "TIM2_CH1", "TIM2_CH2"];

export function createDefaultPWMState(): PWMState {
  const channels: PWMChannel[] = Array.from(
    { length: PWM_CHANNEL_COUNT },
    (_, i) => ({
      id: i,
      label: CHANNEL_LABELS[i] ?? `CH${i}`,
      frequencyHz: 1000, // 1 kHz default
      dutyCyclePercent: 50, // 50% default
      enabled: false,
    })
  );
  return { channels };
}

// ---------------------------------------------------------------------------
// Derived value calculation (the core formula)
// ---------------------------------------------------------------------------

/**
 * Calculate all derived PWM values from frequency and duty cycle.
 *
 * period = 1 / frequency
 * high_time = period × (duty_cycle / 100)
 * low_time = period − high_time
 */
export function calculatePWMDerivedValues(
  frequencyHz: number,
  dutyCyclePercent: number
): PWMDerivedValues {
  if (frequencyHz <= 0) {
    throw new Error("PWM: frequencyHz must be greater than zero");
  }
  const periodMs = (1 / frequencyHz) * 1000;
  const highTimeMs = periodMs * (dutyCyclePercent / 100);
  const lowTimeMs = periodMs - highTimeMs;
  return { periodMs, highTimeMs, lowTimeMs };
}

// ---------------------------------------------------------------------------
// State transitions
// ---------------------------------------------------------------------------

export function setChannelFrequency(
  state: PWMState,
  channelId: number,
  frequencyHz: number
): { state: PWMState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`PWM: Invalid channel id ${channelId}`);

  const clamped = clamp(frequencyHz, PWM_FREQUENCY_MIN_HZ, PWM_FREQUENCY_MAX_HZ);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId ? { ...ch, frequencyHz: clamped } : ch
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "pwm",
    type: "pwm_frequency_changed",
    message: `${channel.label}: frequency set to ${clamped} Hz`,
    payload: { channelId, frequencyHz: clamped },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function setChannelDutyCycle(
  state: PWMState,
  channelId: number,
  dutyCyclePercent: number
): { state: PWMState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`PWM: Invalid channel id ${channelId}`);

  const clamped = clamp(dutyCyclePercent, PWM_DUTY_CYCLE_MIN, PWM_DUTY_CYCLE_MAX);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId ? { ...ch, dutyCyclePercent: clamped } : ch
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "pwm",
    type: "pwm_duty_cycle_changed",
    message: `${channel.label}: duty cycle set to ${clamped}%`,
    payload: { channelId, dutyCyclePercent: clamped },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function setChannelEnabled(
  state: PWMState,
  channelId: number,
  enabled: boolean
): { state: PWMState; event: SimulationEvent } {
  const channel = state.channels[channelId];
  if (!channel) throw new Error(`PWM: Invalid channel id ${channelId}`);

  const newChannels = state.channels.map((ch) =>
    ch.id === channelId ? { ...ch, enabled } : ch
  );

  const event: SimulationEvent = {
    id: generateEventId(),
    timestamp: Date.now(),
    severity: "INFO",
    labId: "pwm",
    type: "pwm_channel_toggled",
    message: `${channel.label}: ${enabled ? "enabled" : "disabled"}`,
    payload: { channelId, enabled },
  };

  return { state: { ...state, channels: newChannels }, event };
}

export function resetPWMState(): PWMState {
  return createDefaultPWMState();
}
