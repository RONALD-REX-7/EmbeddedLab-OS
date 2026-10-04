/**
 * EmbeddedLab OS — lib/ai/sanitizer.ts
 *
 * Sanitizes and extracts ONLY relevant microcontroller state for AI queries.
 * Prevents sending unnecessary or secret application data to Gemini.
 */
import type { LabId, MicrocontrollerState } from "@/types/simulator";

export interface SanitizedAIContext {
  labId: LabId;
  challengeId: string | null;
  relevantState: Record<string, unknown>;
  recentEvents: { message: string; severity: string }[];
}

export function sanitizeStateForAI(
  labId: LabId,
  state: MicrocontrollerState,
  challengeId: string | null = null
): SanitizedAIContext {
  const rawEvents = (state as unknown as { eventLog?: { message: string; severity: string }[] }).eventLog || [];
  const recentEvents = rawEvents.slice(-5).map((evt) => ({
    message: evt.message,
    severity: evt.severity,
  }));

  let relevantState: Record<string, unknown> = {};

  switch (labId) {
    case "gpio":
      relevantState = {
        digitalPins: (state?.gpio?.pins || []).slice(0, 8).map((p) => ({
          id: p.id,
          label: p.label,
          mode: p.mode,
          level: p.level,
        })),
        clockFrequencyHz: state?.clock?.frequencyHz || 16000000,
      };
      break;

    case "pwm":
      relevantState = {
        pwmChannels: (state?.pwm?.channels || []).map((c) => ({
          id: c.id,
          label: c.label,
          enabled: c.enabled,
          frequencyHz: c.frequencyHz,
          dutyCyclePercent: c.dutyCyclePercent,
          periodMs: c.frequencyHz > 0 ? (1 / c.frequencyHz) * 1000 : 0,
        })),
      };
      break;

    case "adc":
      relevantState = {
        analogChannels: (state?.adc?.channels || []).map((ch) => ({
          id: ch.id,
          label: ch.label,
          enabled: ch.enabled,
          inputVoltage: ch.inputVoltage,
          referenceVoltage: ch.referenceVoltage,
          resolution: ch.resolution,
        })),
      };
      break;

    case "uart":
      relevantState = {
        uart: {
          transmitter: state?.uart?.transmitter,
          receiver: state?.uart?.receiver,
          compatible: state?.uart?.compatible,
          compatibilityNote: state?.uart?.compatibilityNote,
        },
      };
      break;
  }

  return {
    labId,
    challengeId,
    relevantState,
    recentEvents,
  };
}

/**
 * Clamps and strips non-safe characters from student concept queries
 * to prevent prompt injection and unbounded token consumption.
 */
export function sanitizeConceptQuery(query?: unknown, maxLength = 80): string {
  if (typeof query !== "string") return "";
  return query
    .slice(0, maxLength)
    .replace(/[^\w\s\-#+.]/g, "")
    .trim();
}

