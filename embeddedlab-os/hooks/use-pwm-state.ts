/**
 * EmbeddedLab OS — hooks/use-pwm-state.ts
 * React hook exposing PWM channel state and actions.
 */
import { useSimulatorStore } from "@/store/simulator-store";
import { calculatePWMDerivedValues } from "@/lib/simulator/pwm";

export function usePWMState(channelId = 0) {
  const pwmState = useSimulatorStore((state) => state.mcuState.pwm);
  const setFrequency = useSimulatorStore((state) => state.pwmSetFrequency);
  const setDutyCycle = useSimulatorStore((state) => state.pwmSetDutyCycle);
  const setEnabled = useSimulatorStore((state) => state.pwmSetChannelEnabled);

  const channel = pwmState.channels[channelId] || pwmState.channels[0];
  const derived = channel
    ? calculatePWMDerivedValues(channel.frequencyHz, channel.dutyCyclePercent)
    : null;

  return {
    channels: pwmState.channels,
    channel,
    derived,
    setFrequency: (freq: number) => setFrequency(channelId, freq),
    setDutyCycle: (duty: number) => setDutyCycle(channelId, duty),
    setEnabled: (enabled: boolean) => setEnabled(channelId, enabled),
  };
}
