/**
 * EmbeddedLab OS — lib/supabase/db.ts
 *
 * Database persistence layer for student learning progress.
 * Saves challenge attempts, lab completion stats, and simulation session summaries.
 * Automatically falls back to local storage when Supabase is not configured.
 */
import { createClient } from "./client";
import { getSupabaseEnv } from "./config";
import type { LabId, ValidationResult } from "@/types/simulator";

export interface LabProgressSummary {
  labId: LabId;
  completedChallengesCount: number;
  totalScore: number;
  lastAccessedAt: string;
}

/**
 * Persists a validated challenge attempt record to Supabase (or local storage fallback).
 * High-level persistence — does NOT persist every micro-step simulator state change.
 */
export async function saveChallengeAttemptToSupabase(params: {
  userId: string;
  labId: LabId;
  challengeId: string;
  result: ValidationResult;
  attemptsCount: number;
  hintsRevealed: number;
}): Promise<void> {
  const { isConfigured } = getSupabaseEnv();
  const supabase = createClient();

  if (!isConfigured || !supabase || params.userId === "demo-user-id") {
    // Demo mode: save to local storage
    if (typeof localStorage !== "undefined") {
      try {
        const key = `embeddedlab_attempts_${params.userId}_${params.labId}`;
        const existingRaw = localStorage.getItem(key);
        const existing = existingRaw ? JSON.parse(existingRaw) : [];
        existing.push({ ...params, timestamp: Date.now() });
        localStorage.setItem(key, JSON.stringify(existing));
      } catch {
        // Ignore storage errors in test environment
      }
    }
    return;
  }

  try {
    // 1. Insert challenge attempt record
    await supabase.from("challenge_attempts").insert({
      user_id: params.userId,
      lab_id: params.labId,
      challenge_id: params.challengeId,
      passed: params.result.passed,
      score: params.result.score,
      attempts_count: params.attemptsCount,
      hints_revealed: params.hintsRevealed,
    });

    // 2. Idempotently compute true lab progress summary from unique passed challenges
    if (params.result.passed) {
      const { data: passedAttempts } = await supabase
        .from("challenge_attempts")
        .select("challenge_id, score")
        .eq("user_id", params.userId)
        .eq("lab_id", params.labId)
        .eq("passed", true);

      const challengeBestScore: Record<string, number> = {};
      if (passedAttempts) {
        for (const att of passedAttempts) {
          challengeBestScore[att.challenge_id] = Math.max(
            challengeBestScore[att.challenge_id] || 0,
            att.score
          );
        }
      }

      const completedCount = Object.keys(challengeBestScore).length;
      const totalScore = Object.values(challengeBestScore).reduce((a, b) => a + b, 0);

      await supabase.from("lab_progress").upsert({
        user_id: params.userId,
        lab_id: params.labId,
        completed_challenges_count: completedCount,
        total_score: totalScore,
        last_accessed_at: new Date().toISOString(),
      });
    }
  } catch {
    // Graceful error handling — fallback without crashing UI
  }
}

/**
 * Hydrates cloud challenge completion records into local storage cache upon sign-in.
 */
export async function hydrateUserProgressFromSupabase(userId: string): Promise<boolean> {
  const { isConfigured } = getSupabaseEnv();
  const supabase = createClient();

  if (!isConfigured || !supabase || !userId || userId === "demo-user-id") {
    return false;
  }

  try {
    const { data: attempts } = await supabase
      .from("challenge_attempts")
      .select("challenge_id, lab_id, passed, score, attempts_count, hints_revealed")
      .eq("user_id", userId);

    if (!attempts || attempts.length === 0) return true;

    if (typeof localStorage !== "undefined") {
      const bestByChallenge: Record<string, {
        challengeId: string;
        labId: LabId;
        status: "PASSED" | "FAILED";
        score: number;
        attempts: number;
        hintsRevealed: number;
        completedAt: number | null;
      }> = {};

      for (const att of attempts) {
        const existing = bestByChallenge[att.challenge_id];
        if (!existing) {
          bestByChallenge[att.challenge_id] = {
            challengeId: att.challenge_id,
            labId: att.lab_id as LabId,
            status: att.passed ? "PASSED" : "FAILED",
            score: att.score,
            attempts: att.attempts_count,
            hintsRevealed: att.hints_revealed,
            completedAt: att.passed ? Date.now() : null,
          };
        } else {
          existing.attempts = Math.max(existing.attempts, att.attempts_count);
          existing.hintsRevealed = Math.max(existing.hintsRevealed, att.hints_revealed);
          if (att.passed) {
            existing.status = "PASSED";
            existing.score = Math.max(existing.score, att.score);
            if (!existing.completedAt) existing.completedAt = Date.now();
          }
        }
      }

      for (const [chId, data] of Object.entries(bestByChallenge)) {
        const key = `embeddedlab_challenge_progress_${chId}`;
        const existingRaw = localStorage.getItem(key);
        let shouldWrite = true;
        if (existingRaw) {
          try {
            const parsed = JSON.parse(existingRaw);
            if (parsed.status === "PASSED" && parsed.score >= data.score) {
              shouldWrite = false;
            }
          } catch {
            shouldWrite = true;
          }
        }
        if (shouldWrite) {
          localStorage.setItem(key, JSON.stringify({
            challengeId: data.challengeId,
            labId: data.labId,
            status: data.status,
            attempts: data.attempts,
            score: data.score,
            hintsRevealed: data.hintsRevealed,
            completedAt: data.completedAt,
            attempts_log: [],
          }));
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("embeddedlab-progress-update"));
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Retrieves student lab progress summaries.
 */
export async function getUserLabProgress(
  userId: string
): Promise<Record<string, LabProgressSummary>> {
  const { isConfigured } = getSupabaseEnv();
  const supabase = createClient();

  if (!isConfigured || !supabase || userId === "demo-user-id") {
    return {
      gpio: { labId: "gpio", completedChallengesCount: 0, totalScore: 0, lastAccessedAt: new Date().toISOString() },
      pwm: { labId: "pwm", completedChallengesCount: 0, totalScore: 0, lastAccessedAt: new Date().toISOString() },
      adc: { labId: "adc", completedChallengesCount: 0, totalScore: 0, lastAccessedAt: new Date().toISOString() },
      uart: { labId: "uart", completedChallengesCount: 0, totalScore: 0, lastAccessedAt: new Date().toISOString() },
    };
  }

  try {
    const { data } = await supabase
      .from("lab_progress")
      .select("*")
      .eq("user_id", userId);

    const result: Record<string, LabProgressSummary> = {};
    if (data) {
      for (const row of data) {
        result[row.lab_id] = {
          labId: row.lab_id as LabId,
          completedChallengesCount: row.completed_challenges_count,
          totalScore: row.total_score,
          lastAccessedAt: row.last_accessed_at,
        };
      }
    }
    return result;
  } catch {
    return {};
  }
}

/**
 * Wipes all client-side simulation caches and stored progress from localStorage.
 */
export function wipeLocalStorageData(): { success: boolean; clearedKeysCount: number } {
  if (typeof localStorage === "undefined") {
    return { success: false, clearedKeysCount: 0 };
  }
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("embeddedlab_")) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("embeddedlab-progress-update"));
  }
  return { success: true, clearedKeysCount: keysToRemove.length };
}

/**
 * Permanently deletes user records from Supabase tables (challenge_attempts, lab_progress)
 * and purges local storage caches. For authenticated users, calls the server-side deletion API.
 */
export async function deleteUserAccountData(
  userId: string
): Promise<{ success: boolean; authDeleted?: boolean; message?: string; error?: string }> {
  wipeLocalStorageData();
  const { isConfigured } = getSupabaseEnv();

  if (!isConfigured || userId === "demo-user-id") {
    return {
      success: true,
      authDeleted: false,
      message: "Local simulation caches and offline progress have been cleared.",
    };
  }

  // If in browser and authenticated, call server-side deletion endpoint
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          authDeleted: Boolean(data.authDeleted),
          message: data.message,
        };
      }
    } catch {
      // Fallback to direct client table deletion below
    }
  }

  const supabase = createClient();
  if (!supabase) {
    return { success: true };
  }

  try {
    await supabase.from("challenge_attempts").delete().eq("user_id", userId);
    await supabase.from("lab_progress").delete().eq("user_id", userId);
    await supabase.from("simulation_sessions").delete().eq("user_id", userId);
    return {
      success: true,
      authDeleted: false,
      message: "Cloud learning progress and challenge attempts have been erased.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to erase cloud records";
    return { success: false, error: message };
  }
}

/**
 * Exports all local and cloud student learning data as a structured JSON object.
 */
export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const localItems: Record<string, unknown> = {};
  if (typeof localStorage !== "undefined") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("embeddedlab_")) {
        try {
          localItems[key] = JSON.parse(localStorage.getItem(key) || "null");
        } catch {
          localItems[key] = localStorage.getItem(key);
        }
      }
    }
  }

  let cloudProgress: unknown = null;
  let cloudAttempts: unknown = null;
  const { isConfigured } = getSupabaseEnv();
  const supabase = createClient();

  if (isConfigured && supabase && userId !== "demo-user-id") {
    try {
      const { data: pData } = await supabase.from("lab_progress").select("*").eq("user_id", userId);
      const { data: aData } = await supabase.from("challenge_attempts").select("*").eq("user_id", userId);
      cloudProgress = pData;
      cloudAttempts = aData;
    } catch {
      // Graceful fallback
    }
  }

  return {
    exportDate: new Date().toISOString(),
    userId,
    formatVersion: "1.0",
    localStorageData: localItems,
    cloudProgress,
    cloudAttempts,
  };
}
