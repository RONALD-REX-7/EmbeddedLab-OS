/**
 * EmbeddedLab OS — hooks/use-challenge.ts
 * React hook exposing active challenge state and actions.
 */
import { useChallengeStore } from "@/store/challenge-store";

export function useChallenge() {
  const activeChallenge = useChallengeStore((state) => state.activeChallenge);
  const lastValidationResult = useChallengeStore((state) => state.lastValidationResult);
  const startChallenge = useChallengeStore((state) => state.startChallenge);
  const recordAttempt = useChallengeStore((state) => state.recordAttempt);
  const revealNextHint = useChallengeStore((state) => state.revealNextHint);
  const resetChallenge = useChallengeStore((state) => state.resetChallenge);

  return {
    activeChallenge,
    lastValidationResult,
    startChallenge,
    recordAttempt,
    revealNextHint,
    resetChallenge,
  };
}
