/**
 * EmbeddedLab OS — hooks/use-adc-state.ts
 * React hook exposing ADC state and derived calculations.
 */
import { useSimulatorStore } from "@/store/simulator-store";
import { calculateADCDerivedValues } from "@/lib/simulator/adc";
import type { ADCResolution } from "@/types/simulator";

export function useADCState(channelId = 0) {
  const adcState = useSimulatorStore((state) => state.mcuState.adc);
  const setInputVoltage = useSimulatorStore((state) => state.adcSetInputVoltage);
  const setResolution = useSimulatorStore((state) => state.adcSetResolution);
  const setReferenceVoltage = useSimulatorStore((state) => state.adcSetReferenceVoltage);
  const setEnabled = useSimulatorStore((state) => state.adcSetChannelEnabled);

  const channel = adcState.channels[channelId] || adcState.channels[0];
  const derived = channel
    ? calculateADCDerivedValues(channel.inputVoltage, channel.referenceVoltage, channel.resolution)
    : null;

  return {
    channels: adcState.channels,
    channel,
    derived,
    setInputVoltage: (v: number) => setInputVoltage(channelId, v),
    setResolution: (res: ADCResolution) => setResolution(channelId, res),
    setReferenceVoltage: (vref: number) => setReferenceVoltage(channelId, vref),
    setEnabled: (enabled: boolean) => setEnabled(channelId, enabled),
  };
}
