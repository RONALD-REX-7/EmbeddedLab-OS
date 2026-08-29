/**
 * EmbeddedLab OS — hooks/use-event-log.ts
 * React hook exposing event log entries filtered by labId or severity.
 */
import { useSimulatorStore } from "@/store/simulator-store";
import type { EventSeverity, LabId } from "@/types/simulator";

export function useEventLog(labId?: LabId, severity?: EventSeverity) {
  const events = useSimulatorStore((state) => state.events);

  let filtered = events;
  if (labId) {
    filtered = filtered.filter((e) => e.labId === labId);
  }
  if (severity) {
    filtered = filtered.filter((e) => e.severity === severity);
  }

  return {
    events: filtered,
    totalCount: events.length,
  };
}
