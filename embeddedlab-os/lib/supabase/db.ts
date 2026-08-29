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

    // 2. Upsert lab_progress summary record
    if (params.result.passed) {
      const { data: existingProgress } = await supabase
        .from("lab_progress")
        .select("*")
        .eq("user_id", params.userId)
        .eq("lab_id", params.labId)
        .single();

      const newCompletedCount = (existingProgress?.completed_challenges_count || 0) + 1;
      const newTotalScore = (existingProgress?.total_score || 0) + params.result.score;

      await supabase.from("lab_progress").upsert({
        user_id: params.userId,
        lab_id: params.labId,
        completed_challenges_count: newCompletedCount,
        total_score: newTotalScore,
        last_accessed_at: new Date().toISOString(),
      });
    }
  } catch {
    // Graceful error handling — fallback without crashing UI
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
