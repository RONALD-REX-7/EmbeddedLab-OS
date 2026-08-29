/**
 * EmbeddedLab OS — store/challenge-store.ts
 *
 * Zustand store for managing active challenge progress, attempt history,
 * progressive hint reveals, scoring calculations, and progress persistence hooks.
 */
import { create } from "zustand";
import type { ChallengeState, LabId, ValidationResult } from "@/types/simulator";

const STORAGE_KEY_PREFIX = "embeddedlab_challenge_progress_";

function loadSavedChallengeState(challengeId: string): ChallengeState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${challengeId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveChallengeState(state: ChallengeState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${state.challengeId}`, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

interface ChallengeStoreState {
  activeChallenge: ChallengeState | null;
  lastValidationResult: ValidationResult | null;

  startChallenge: (challengeId: string, labId: LabId) => void;
  recordAttempt: (result: ValidationResult, attemptPenalty?: number) => void;
  revealNextHint: (hintPenalty?: number) => void;
  resetChallenge: () => void;
}

export const useChallengeStore = create<ChallengeStoreState>((set, get) => ({
  activeChallenge: null,
  lastValidationResult: null,

  startChallenge: (challengeId, labId) => {
    const saved = loadSavedChallengeState(challengeId);
    const initial: ChallengeState = saved || {
      challengeId,
      labId,
      status: "IN_PROGRESS",
      attempts: 0,
      score: 100,
      hintsRevealed: 0,
      completedAt: null,
      attempts_log: [],
    };

    set({
      activeChallenge: initial,
      lastValidationResult: null,
    });
  },

  recordAttempt: (result, attemptPenalty = 15) => {
    const { activeChallenge } = get();
    if (!activeChallenge) return;

    const newAttempts = activeChallenge.attempts + 1;
    const penalty = result.passed ? 0 : attemptPenalty;
    const newScore = Math.max(0, activeChallenge.score - penalty);
    const completedAt = result.passed ? Date.now() : activeChallenge.completedAt || null;

    const updated: ChallengeState = {
      ...activeChallenge,
      status: result.passed ? "PASSED" : "FAILED",
      attempts: newAttempts,
      score: newScore,
      completedAt,
      attempts_log: [
        ...activeChallenge.attempts_log,
        {
          timestamp: Date.now(),
          passed: result.passed,
          stateSnapshot: {},
        },
      ],
    };

    saveChallengeState(updated);

    set({
      lastValidationResult: result,
      activeChallenge: updated,
    });
  },

  revealNextHint: (hintPenalty = 10) => {
    const { activeChallenge } = get();
    if (!activeChallenge) return;

    const newScore = Math.max(0, activeChallenge.score - hintPenalty);
    const updated: ChallengeState = {
      ...activeChallenge,
      hintsRevealed: activeChallenge.hintsRevealed + 1,
      score: newScore,
    };

    saveChallengeState(updated);

    set({
      activeChallenge: updated,
    });
  },

  resetChallenge: () => {
    set({
      activeChallenge: null,
      lastValidationResult: null,
    });
  },
}));
