/**
 * EmbeddedLab OS — lib/ai/schema.ts
 *
 * Strict server-side schema validation and allow-list extraction for AI requests.
 * Enforces a zero-trust boundary: never trusts client-supplied objects directly.
 * Prevents prompt injection, unbounded payload memory consumption, and arbitrary context injection.
 */
import type { LabId } from "@/types/simulator";
import type { AIActionType } from "./fallback";
import { sanitizeConceptQuery } from "./sanitizer";

export const ALLOWED_ACTIONS: readonly AIActionType[] = ["explain", "hint", "debug"] as const;
export const ALLOWED_LAB_IDS: readonly LabId[] = ["gpio", "pwm", "adc", "uart"] as const;

export const LIMITS = {
  MAX_BODY_SIZE_BYTES: 32768, // 32 KB maximum payload size
  MAX_CONCEPT_QUERY_LENGTH: 80,
  MAX_CHALLENGE_ID_LENGTH: 64,
  MAX_EVENT_LOG_ENTRIES: 5,
  MAX_EVENT_MESSAGE_LENGTH: 120,
  MAX_UART_BUFFER_LENGTH: 64,
  MAX_NOTE_LENGTH: 120,
  MAX_DIGITAL_PINS: 8,
  MAX_PWM_CHANNELS: 4,
  MAX_ADC_CHANNELS: 4,
} as const;

export interface SanitizedEventEntry {
  message: string;
  severity: "INFO" | "WARNING" | "WARN" | "ERROR" | "CRITICAL" | "SUCCESS";
}

export interface ValidatedAIServerRequest {
  action: AIActionType;
  labId: LabId;
  conceptQuery?: string;
  challengeId?: string | null;
  relevantState: Record<string, unknown>;
  recentEvents: SanitizedEventEntry[];
}

export type ValidationResult =
  | { success: true; data: ValidatedAIServerRequest }
  | { success: false; error: string; statusCode: number };

/**
 * Strips ASCII control characters (0x00-0x1F, 0x7F) from strings.
 */
function stripControlCharacters(str: string): string {
  return str.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

/**
 * Validates and safely extracts challenge ID strings.
 */
function sanitizeChallengeId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().slice(0, LIMITS.MAX_CHALLENGE_ID_LENGTH);
  if (/^[a-zA-Z0-9_-]{1,64}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Validates and bounds event log entries to at most 5 items of max 120 chars each.
 */
function sanitizeEvents(raw: unknown): SanitizedEventEntry[] {
  if (!Array.isArray(raw)) return [];

  const allowedSeverities = new Set(["INFO", "WARNING", "WARN", "ERROR", "CRITICAL", "SUCCESS"]);

  return raw.slice(0, LIMITS.MAX_EVENT_LOG_ENTRIES).map((item) => {
    if (!item || typeof item !== "object") {
      return { message: "Hardware event triggered", severity: "INFO" };
    }
    const record = item as Record<string, unknown>;
    const rawMsg = typeof record.message === "string" ? record.message : "Hardware event triggered";
    const cleanMsg = stripControlCharacters(rawMsg).slice(0, LIMITS.MAX_EVENT_MESSAGE_LENGTH);

    const rawSev = typeof record.severity === "string" ? record.severity.toUpperCase() : "INFO";
    const severity = allowedSeverities.has(rawSev) ? (rawSev as SanitizedEventEntry["severity"]) : "INFO";

    return {
      message: cleanMsg || "Hardware event triggered",
      severity,
    };
  });
}

/**
 * Server-side allow-list state reconstructor:
 * Extracts strictly known microcontroller properties for each labId.
 * Any arbitrary or unknown keys provided by the client are discarded.
 */
function extractAllowListedState(labId: LabId, rawState: unknown): Record<string, unknown> {
  if (!rawState || typeof rawState !== "object" || Array.isArray(rawState)) {
    return {};
  }
  const state = rawState as Record<string, unknown>;

  switch (labId) {
    case "gpio": {
      const pinsRaw = Array.isArray(state.digitalPins)
        ? state.digitalPins
        : Array.isArray((state.gpio as Record<string, unknown>)?.pins)
        ? ((state.gpio as Record<string, unknown>).pins as unknown[])
        : [];

      const digitalPins = pinsRaw.slice(0, LIMITS.MAX_DIGITAL_PINS).map((p, index) => {
        const pin = (p && typeof p === "object" ? p : {}) as Record<string, unknown>;
        const validModes = ["INPUT", "OUTPUT", "INPUT_PULLUP", "INPUT_PULLDOWN"];
        const validLevels = ["HIGH", "LOW", "FLOATING"];

        const mode = typeof pin.mode === "string" && validModes.includes(pin.mode) ? pin.mode : "INPUT";
        const level = typeof pin.level === "string" && validLevels.includes(pin.level) ? pin.level : "LOW";
        const label = typeof pin.label === "string" ? stripControlCharacters(pin.label).slice(0, 10) : `P${index}`;

        return {
          id: typeof pin.id === "number" || typeof pin.id === "string" ? pin.id : index,
          label,
          mode,
          level,
        };
      });

      const clockFrequencyHz =
        typeof state.clockFrequencyHz === "number" && state.clockFrequencyHz > 0 && state.clockFrequencyHz <= 100000000
          ? state.clockFrequencyHz
          : 16000000;

      return { digitalPins, clockFrequencyHz };
    }

    case "pwm": {
      const chRaw = Array.isArray(state.pwmChannels)
        ? state.pwmChannels
        : Array.isArray((state.pwm as Record<string, unknown>)?.channels)
        ? ((state.pwm as Record<string, unknown>).channels as unknown[])
        : [];

      const pwmChannels = chRaw.slice(0, LIMITS.MAX_PWM_CHANNELS).map((c, index) => {
        const ch = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
        const freq = typeof ch.frequencyHz === "number" && !isNaN(ch.frequencyHz) ? Math.max(0, Math.min(1000000, ch.frequencyHz)) : 1000;
        const duty = typeof ch.dutyCyclePercent === "number" && !isNaN(ch.dutyCyclePercent) ? Math.max(0, Math.min(100, ch.dutyCyclePercent)) : 50;
        const periodMs = freq > 0 ? (1 / freq) * 1000 : 0;

        return {
          id: typeof ch.id === "number" || typeof ch.id === "string" ? ch.id : index,
          label: typeof ch.label === "string" ? stripControlCharacters(ch.label).slice(0, 10) : `PWM${index}`,
          enabled: Boolean(ch.enabled),
          frequencyHz: freq,
          dutyCyclePercent: duty,
          periodMs: Number(periodMs.toFixed(3)),
        };
      });

      return { pwmChannels };
    }

    case "adc": {
      const chRaw = Array.isArray(state.analogChannels)
        ? state.analogChannels
        : Array.isArray((state.adc as Record<string, unknown>)?.channels)
        ? ((state.adc as Record<string, unknown>).channels as unknown[])
        : [];

      const analogChannels = chRaw.slice(0, LIMITS.MAX_ADC_CHANNELS).map((c, index) => {
        const ch = (c && typeof c === "object" ? c : {}) as Record<string, unknown>;
        const inV = typeof ch.inputVoltage === "number" && !isNaN(ch.inputVoltage) ? Math.max(0, Math.min(50, ch.inputVoltage)) : 0;
        const refV = typeof ch.referenceVoltage === "number" && !isNaN(ch.referenceVoltage) ? Math.max(0.1, Math.min(50, ch.referenceVoltage)) : 3.3;
        const res = typeof ch.resolution === "number" && [8, 10, 12, 16].includes(ch.resolution) ? ch.resolution : 12;

        return {
          id: typeof ch.id === "number" || typeof ch.id === "string" ? ch.id : index,
          label: typeof ch.label === "string" ? stripControlCharacters(ch.label).slice(0, 10) : `ADC${index}`,
          enabled: Boolean(ch.enabled),
          inputVoltage: Number(inV.toFixed(3)),
          referenceVoltage: Number(refV.toFixed(3)),
          resolution: res,
        };
      });

      return { analogChannels };
    }

    case "uart": {
      const uartObj = (state.uart && typeof state.uart === "object" ? state.uart : state) as Record<string, unknown>;
      const tx = (uartObj.transmitter && typeof uartObj.transmitter === "object" ? uartObj.transmitter : {}) as Record<string, unknown>;
      const rx = (uartObj.receiver && typeof uartObj.receiver === "object" ? uartObj.receiver : {}) as Record<string, unknown>;

      const sanitizeTransceiver = (t: Record<string, unknown>) => ({
        baudRate: typeof t.baudRate === "number" && !isNaN(t.baudRate) ? Math.max(300, Math.min(1000000, t.baudRate)) : 9600,
        dataBits: typeof t.dataBits === "number" && [5, 6, 7, 8, 9].includes(t.dataBits) ? t.dataBits : 8,
        parity: typeof t.parity === "string" && ["NONE", "EVEN", "ODD", "MARK", "SPACE"].includes(t.parity) ? t.parity : "NONE",
        stopBits: typeof t.stopBits === "number" && [1, 1.5, 2].includes(t.stopBits) ? t.stopBits : 1,
        buffer: typeof t.buffer === "string" ? stripControlCharacters(t.buffer).slice(0, LIMITS.MAX_UART_BUFFER_LENGTH) : "",
      });

      const note = typeof uartObj.compatibilityNote === "string"
        ? stripControlCharacters(uartObj.compatibilityNote).slice(0, LIMITS.MAX_NOTE_LENGTH)
        : "";

      return {
        uart: {
          transmitter: sanitizeTransceiver(tx),
          receiver: sanitizeTransceiver(rx),
          compatible: typeof uartObj.compatible === "boolean" ? uartObj.compatible : tx.baudRate === rx.baudRate,
          compatibilityNote: note,
        },
      };
    }
  }
}

/**
 * Validates and sanitizes the incoming AI request payload.
 * Returns either validated and sanitized data or an explicit error with HTTP status code.
 */
export function validateAndSanitizeAIServerRequest(body: unknown): ValidationResult {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {
      success: false,
      error: "Invalid request body. Expected a JSON object.",
      statusCode: 400,
    };
  }

  const payload = body as Record<string, unknown>;

  // 1. Action validation
  if (!payload.action || typeof payload.action !== "string") {
    return {
      success: false,
      error: "Missing required parameter: 'action'.",
      statusCode: 400,
    };
  }

  if (!ALLOWED_ACTIONS.includes(payload.action as AIActionType)) {
    return {
      success: false,
      error: `Invalid action '${payload.action}'. Supported actions are: ${ALLOWED_ACTIONS.join(", ")}.`,
      statusCode: 400,
    };
  }
  const action = payload.action as AIActionType;

  // 2. Context validation
  if (!payload.context || typeof payload.context !== "object" || Array.isArray(payload.context)) {
    return {
      success: false,
      error: "Missing or invalid required parameter: 'context'.",
      statusCode: 400,
    };
  }

  const rawContext = payload.context as Record<string, unknown>;

  if (!rawContext.labId || typeof rawContext.labId !== "string") {
    return {
      success: false,
      error: "Missing required parameter: 'context.labId'.",
      statusCode: 400,
    };
  }

  const labId = rawContext.labId.toLowerCase() as LabId;
  if (!ALLOWED_LAB_IDS.includes(labId)) {
    return {
      success: false,
      error: `Invalid labId '${rawContext.labId}'. Must be one of: ${ALLOWED_LAB_IDS.join(", ")}.`,
      statusCode: 400,
    };
  }

  // 3. String bounds & sanitization
  const conceptQuery = sanitizeConceptQuery(payload.conceptQuery, LIMITS.MAX_CONCEPT_QUERY_LENGTH);
  const challengeId = sanitizeChallengeId(rawContext.challengeId);
  const recentEvents = sanitizeEvents(rawContext.recentEvents);

  // 4. Strict state allow-listing (inspects relevantState or fallback to rawContext)
  const rawStateSource = rawContext.relevantState ?? rawContext;
  const relevantState = extractAllowListedState(labId, rawStateSource);

  return {
    success: true,
    data: {
      action,
      labId,
      conceptQuery: conceptQuery || undefined,
      challengeId,
      relevantState,
      recentEvents,
    },
  };
}
