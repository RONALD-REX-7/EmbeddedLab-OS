/**
 * EICRA External Interrupt Sense Control Model
 */
export type InterruptTriggerMode = "LOW_LEVEL" | "ANY_LOGIC_CHANGE" | "FALLING_EDGE" | "RISING_EDGE";

export function parseSenseControl(isc1: number, isc0: number): InterruptTriggerMode {
  const code = ((isc1 & 1) << 1) | (isc0 & 1);
  switch (code) {
    case 0: return "LOW_LEVEL";
    case 1: return "ANY_LOGIC_CHANGE";
    case 2: return "FALLING_EDGE";
    case 3: return "RISING_EDGE";
    default: throw new Error("Invalid sense control bits");
  }
}
