/**
 * EmbeddedLab OS — hooks/use-uart-state.ts
 * React hook exposing UART transmitter, receiver, and compatibility status.
 */
import { useSimulatorStore } from "@/store/simulator-store";
import { calculateUARTDerivedValues } from "@/lib/simulator/uart";
import type { UARTConfig } from "@/types/simulator";

export function useUARTState() {
  const uartState = useSimulatorStore((state) => state.mcuState.uart);
  const setTransmitterConfig = useSimulatorStore((state) => state.uartSetTransmitterConfig);
  const setReceiverConfig = useSimulatorStore((state) => state.uartSetReceiverConfig);
  const uartTransmit = useSimulatorStore((state) => state.uartTransmit);

  const txDerived = calculateUARTDerivedValues(uartState.transmitter);
  const rxDerived = calculateUARTDerivedValues(uartState.receiver);

  return {
    uart: uartState,
    transmitter: uartState.transmitter,
    receiver: uartState.receiver,
    compatible: uartState.compatible,
    compatibilityNote: uartState.compatibilityNote,
    txDerived,
    rxDerived,
    setTransmitterConfig: (cfg: Partial<UARTConfig>) => setTransmitterConfig(cfg),
    setReceiverConfig: (cfg: Partial<UARTConfig>) => setReceiverConfig(cfg),
    transmit: (msg: string) => uartTransmit(msg),
  };
}
