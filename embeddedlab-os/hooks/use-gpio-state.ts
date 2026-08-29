/**
 * EmbeddedLab OS — hooks/use-gpio-state.ts
 * React hook exposing GPIO state and controls from the central simulator store.
 */
import { useSimulatorStore } from "@/store/simulator-store";

export function useGPIOState() {
  const gpio = useSimulatorStore((state) => state.mcuState.gpio);
  const setPinMode = useSimulatorStore((state) => state.gpioSetPinMode);
  const setPinLevel = useSimulatorStore((state) => state.gpioSetPinLevel);
  const togglePin = useSimulatorStore((state) => state.gpioTogglePin);

  return {
    pins: gpio.pins,
    setPinMode,
    setPinLevel,
    togglePin,
  };
}
