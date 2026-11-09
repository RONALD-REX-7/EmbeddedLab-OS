/**
 * Brown-Out Detection (BOD) Voltage Level Parser
 */
export type BodLevel = "DISABLED" | "1V8" | "2V7" | "4V3";

export function getBodThresholdVolts(level: BodLevel): number {
  switch (level) {
    case "DISABLED": return 0;
    case "1V8": return 1.8;
    case "2V7": return 2.7;
    case "4V3": return 4.3;
  }
}

export function isBrownoutTriggered(vccVolts: number, level: BodLevel): boolean {
  if (level === "DISABLED") return false;
  return vccVolts < getBodThresholdVolts(level);
}
