import { describe, it, expect, beforeEach } from "vitest";
import { SimulationEngine } from "@/lib/simulator/engine";
import { useChallengeStore } from "@/store/challenge-store";
import { LAB_CHALLENGES, runChallengeValidator } from "@/lib/challenges";

describe("Challenge Framework Core Invariants & State Engine", () => {
  let engine: SimulationEngine;

  beforeEach(() => {
    engine = new SimulationEngine();
    useChallengeStore.getState().resetChallenge();
  });

  it("should have complete, typed challenge definitions across all laboratories", () => {
    const labIds = ["gpio", "pwm", "adc", "uart"] as const;

    for (const labId of labIds) {
      const challenges = LAB_CHALLENGES[labId];
      expect(challenges).toBeDefined();
      expect(challenges.length).toBeGreaterThan(0);

      for (const ch of challenges) {
        expect(ch.id).toBeTruthy();
        expect(ch.labId).toBe(labId);
        expect(ch.title).toBeTruthy();
        expect(ch.description).toBeTruthy();
        expect(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).toContain(ch.difficulty);
        expect(ch.objectives.length).toBeGreaterThan(0);
        expect(ch.hints.length).toBeGreaterThan(0);
        expect(ch.successMessage).toBeTruthy();
        expect(ch.scoringRules.baseScore).toBe(100);
        expect(ch.validatorKey).toBeTruthy();
      }
    }
  });

  it("should initialize challenge state cleanly with score 100 and 0 attempts", () => {
    useChallengeStore.getState().startChallenge("gpio-ch-1", "gpio");
    const state = useChallengeStore.getState().activeChallenge;

    expect(state).not.toBeNull();
    expect(state?.challengeId).toBe("gpio-ch-1");
    expect(state?.status).toBe("IN_PROGRESS");
    expect(state?.attempts).toBe(0);
    expect(state?.score).toBe(100);
    expect(state?.hintsRevealed).toBe(0);
  });

  it("should progressively reveal hints and apply score penalties", () => {
    useChallengeStore.getState().startChallenge("gpio-ch-1", "gpio");
    
    // Reveal 1st hint (-10 penalty)
    useChallengeStore.getState().revealNextHint(10);
    let state = useChallengeStore.getState().activeChallenge;
    expect(state?.hintsRevealed).toBe(1);
    expect(state?.score).toBe(90);

    // Reveal 2nd hint (-10 penalty)
    useChallengeStore.getState().revealNextHint(10);
    state = useChallengeStore.getState().activeChallenge;
    expect(state?.hintsRevealed).toBe(2);
    expect(state?.score).toBe(80);
  });

  it("should fail validation if simulator state does not satisfy objectives (NO AUTO-PASS)", () => {
    useChallengeStore.getState().startChallenge("gpio-ch-1", "gpio");

    // Engine is in default state (PA5 is not set to OUTPUT HIGH)
    const result = runChallengeValidator("validateGPIOChallenge1", engine.state);
    expect(result.passed).toBe(false);

    useChallengeStore.getState().recordAttempt(result, 15);
    const state = useChallengeStore.getState().activeChallenge;

    expect(state?.status).toBe("FAILED");
    expect(state?.attempts).toBe(1);
    expect(state?.score).toBe(85); // 100 - 15 attempt penalty
  });

  it("should pass validation when actual simulator state satisfies objectives", () => {
    useChallengeStore.getState().startChallenge("gpio-ch-1", "gpio");

    // Reconfigure engine state to satisfy PA5 OUTPUT HIGH
    engine.gpioSetPinMode(5, "OUTPUT");
    engine.gpioSetPinLevel(5, "HIGH");

    const result = runChallengeValidator("validateGPIOChallenge1", engine.state);
    expect(result.passed).toBe(true);

    useChallengeStore.getState().recordAttempt(result, 15);
    const state = useChallengeStore.getState().activeChallenge;

    expect(state?.status).toBe("PASSED");
    expect(state?.score).toBe(100);
    expect(state?.completedAt).not.toBeNull();
  });
});
