/**
 * EmbeddedLab OS — lib/ai/service.ts
 *
 * Dedicated AI Service Abstraction.
 * Encapsulates AI requests (Explain, Hint, Debug) away from UI components.
 */
import { sanitizeStateForAI } from "./sanitizer";
import { generateOfflineFallback, type AIActionType, type AIResponsePayload } from "./fallback";
import type { LabId, MicrocontrollerState } from "@/types/simulator";

export interface AIServiceRequestParams {
  action: AIActionType;
  labId: LabId;
  state: MicrocontrollerState;
  challengeId?: string | null;
  conceptQuery?: string;
}

/**
 * Main AI Service Entrypoint:
 * Accepts lab state, sanitizes context, sends to /api/ai, and returns structured AI response.
 * Safely falls back to local offline heuristics if network or API fails.
 */
export async function requestAIGuidance(
  params: AIServiceRequestParams
): Promise<AIResponsePayload> {
  const sanitizedContext = sanitizeStateForAI(params.labId, params.state, params.challengeId);

  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: params.action,
        context: sanitizedContext,
        conceptQuery: params.conceptQuery,
      }),
    });

    if (!res.ok) {
      return generateOfflineFallback(params.action, sanitizedContext);
    }

    const data: AIResponsePayload = await res.json();
    return data;
  } catch {
    return generateOfflineFallback(params.action, sanitizedContext);
  }
}
