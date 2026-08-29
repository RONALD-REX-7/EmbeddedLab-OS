/**
 * EmbeddedLab OS — app/api/ai/route.ts
 *
 * Secure server-side API endpoint for contextual AI learning guidance.
 * Integrates Google Gemini AI (@google/genai SDK) with graceful offline fallbacks.
 * Never exposes API key secrets to the browser.
 */
import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { generateOfflineFallback, type AIActionType } from "@/lib/ai/fallback";
import type { SanitizedAIContext } from "@/lib/ai/sanitizer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, context, conceptQuery } = body as {
      action: AIActionType;
      context: SanitizedAIContext;
      conceptQuery?: string;
    };

    if (!action || !context || !context.labId) {
      return NextResponse.json(
        { error: "Invalid request parameters. Missing action or context." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Graceful offline fallback if GEMINI_API_KEY is not configured
    if (!apiKey || apiKey === "your_api_key_here" || apiKey.length < 5) {
      const fallbackPayload = generateOfflineFallback(action, context);
      return NextResponse.json(fallbackPayload);
    }

    // Initialize Gemini AI Client
    const ai = new GoogleGenAI({ apiKey });

    // Construct highly focused, concise engineering prompt
    let prompt = `You are EmbeddedLab OS AI Assistant — an educational embedded-systems tutor.
CRITICAL RULE: Keep responses concise (under 250 words), highly technical, structured in clear Markdown, and formatted for engineering students.

LAB CONTEXT: ${context.labId.toUpperCase()}
ACTIVE HARDWARE STATE:
${JSON.stringify(context.relevantState, null, 2)}

RECENT LOG EVENTS:
${JSON.stringify(context.recentEvents, null, 2)}
`;

    if (action === "explain") {
      prompt += `\nTASK: Explain the core embedded engineering concept of "${conceptQuery || context.labId.toUpperCase()}" using the active lab context and state provided above. Highlight practical embedded microcontroller principles.`;
    } else if (action === "hint") {
      prompt += `\nTASK: Provide a progressive, step-by-step hint for the active challenge (ID: ${context.challengeId || "General"}). Do NOT directly disclose the exact numerical code or configuration answer. Guide the student's thinking towards observing the hardware parameters.`;
    } else if (action === "debug") {
      prompt += `\nTASK: Analyze the provided microcontroller hardware state snapshot above for misconfigurations, timing errors, or framing mismatches. Identify likely causes and suggest specific parameter adjustments.`;
    }

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text || "";

      if (!responseText) {
        throw new Error("Empty response from Gemini API");
      }

      return NextResponse.json({
        action,
        content: responseText,
        isFallback: false,
      });
    } catch {
      // Fallback on API call exception (rate limit, network error)
      const fallbackPayload = generateOfflineFallback(action, context);
      return NextResponse.json(fallbackPayload);
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error processing AI request" },
      { status: 500 }
    );
  }
}
