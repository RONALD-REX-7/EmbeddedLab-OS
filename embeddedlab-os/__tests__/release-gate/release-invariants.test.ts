/**
 * EmbeddedLab OS — __tests__/release-gate/release-invariants.test.ts
 *
 * Comprehensive Release Gate Regression Suite covering:
 *  1. Ground truth curriculum counts (4 labs, 3 challenges each, 12 total)
 *  2. Challenge score, attempt history, and passed-state preservation
 *  3. PWM canonical peripheral naming (TIM1_CH1)
 *  4. ADC mathematical rounding, clamping, and quantization behavior
 *  5. Data erasure and account deletion safety
 *  6. AI service endpoint validation and abuse limits
 */
import { describe, it, expect, beforeEach } from "vitest";
import { LAB_CHALLENGES, TOTAL_CHALLENGES_COUNT, CHALLENGES_PER_LAB_COUNT, runChallengeValidator } from "@/lib/challenges";
import { LABS } from "@/lib/constants/labs";
import { useChallengeStore } from "@/store/challenge-store";
import { SimulationEngine } from "@/lib/simulator/engine";
import { calculateADCDerivedValues } from "@/lib/simulator/adc";
import { validateAndSanitizeAIServerRequest, LIMITS } from "@/lib/ai/schema";
import { deleteUserAccountData } from "@/lib/supabase/db";

describe("Release Gate Invariants Suite", () => {
  describe("Curriculum Ground Truth (Sections A & B)", () => {
    it("has exactly 4 registered laboratories", () => {
      const labKeys = Object.keys(LAB_CHALLENGES);
      expect(labKeys).toHaveLength(4);
      expect(labKeys).toEqual(expect.arrayContaining(["gpio", "pwm", "adc", "uart"]));
    });

    it("has exactly 3 challenges per laboratory and 12 total challenges", () => {
      expect(TOTAL_CHALLENGES_COUNT).toBe(12);
      expect(CHALLENGES_PER_LAB_COUNT).toBe(3);

      for (const lab of ["gpio", "pwm", "adc", "uart"] as const) {
        expect(LAB_CHALLENGES[lab]).toHaveLength(3);
      }
    });

    it("ensures all metadata and navigation registry cards reflect 3 challenges per lab", () => {
      expect(LABS).toHaveLength(4);
      for (const lab of LABS) {
        expect(lab.challengeCount).toBe(3);
      }
    });
  });

  describe("Challenge Score & Passed-State Preservation Lifecycle (Section F)", () => {
    let engine: SimulationEngine;

    beforeEach(() => {
      engine = new SimulationEngine();
      useChallengeStore.getState().resetChallenge();
    });

    it("preserves earned PASSED status and best score when experimenting after completion", () => {
      const store = useChallengeStore.getState();
      store.startChallenge("gpio-ch-1", "gpio");

      // 1. First attempt fails (-15 penalty)
      let result = runChallengeValidator("validateGPIOChallenge1", engine.state);
      expect(result.passed).toBe(false);
      store.recordAttempt(result, 15);

      let state = useChallengeStore.getState().activeChallenge;
      expect(state?.status).toBe("FAILED");
      expect(state?.attempts).toBe(1);
      expect(state?.score).toBe(85);

      // 2. Second attempt fails (-15 penalty)
      store.recordAttempt(result, 15);
      state = useChallengeStore.getState().activeChallenge;
      expect(state?.status).toBe("FAILED");
      expect(state?.attempts).toBe(2);
      expect(state?.score).toBe(70);

      // 3. Third attempt passes (student configures PA5 OUTPUT HIGH)
      engine.gpioSetPinMode(5, "OUTPUT");
      engine.gpioSetPinLevel(5, "HIGH");
      result = runChallengeValidator("validateGPIOChallenge1", engine.state);
      expect(result.passed).toBe(true);

      store.recordAttempt(result, 15);
      state = useChallengeStore.getState().activeChallenge;
      expect(state?.status).toBe("PASSED");
      expect(state?.attempts).toBe(3);
      expect(state?.score).toBe(70);
      const earnedCompletionTime = state?.completedAt;
      expect(earnedCompletionTime).toBeTruthy();

      // 4. Experimentation after passing: Student modifies hardware (turns LED off)
      engine.gpioSetPinLevel(5, "LOW");
      result = runChallengeValidator("validateGPIOChallenge1", engine.state);
      expect(result.passed).toBe(false);

      // 5. Validate again with failing hardware state
      store.recordAttempt(result, 15);
      state = useChallengeStore.getState().activeChallenge;

      // CRITICAL ASSERTION: The challenge must NOT lose its passed status or best score!
      expect(state?.status).toBe("PASSED");
      expect(state?.score).toBe(70); // Best score retained
      expect(state?.attempts).toBe(4); // Attempt history recorded
      expect(state?.completedAt).toBe(earnedCompletionTime); // Original completion timestamp preserved

      // 6. Requesting a hint after completion does not deduct penalties
      store.revealNextHint(10);
      state = useChallengeStore.getState().activeChallenge;
      expect(state?.score).toBe(70); // No hint penalty applied after completion
    });

    it("prevents score from dropping below 0 even after excessive penalties", () => {
      const store = useChallengeStore.getState();
      store.startChallenge("gpio-ch-1", "gpio");

      const failingResult = {
        passed: false,
        score: 0,
        feedback: "Failed",
        conditions: [],
      };

      // Apply 10 failing attempts (-15 each = -150)
      for (let i = 0; i < 10; i++) {
        store.recordAttempt(failingResult, 15);
      }

      const state = useChallengeStore.getState().activeChallenge;
      expect(state?.score).toBe(0);
      expect(state?.score).toBeGreaterThanOrEqual(0);
    });
  });

  describe("PWM Canonical Peripheral Naming (Section G)", () => {
    it("uses TIM1_CH1 as canonical default PWM channel across simulator and channels", () => {
      const engine = new SimulationEngine();
      const pwmChannels = engine.state.pwm.channels;

      expect(pwmChannels.length).toBeGreaterThan(0);
      const defaultChannel = pwmChannels[0];
      expect(defaultChannel.label).toContain("TIM1_CH1");
    });
  });

  describe("ADC Mathematical Rounding & Clamping (Section H)", () => {
    it("computes exact midpoint 2048 for 12-bit ADC at 1.65V on 3.3V reference", () => {
      const result = calculateADCDerivedValues(1.65, 3.3, 12);
      expect(result.digitalValue).toBe(2048);
    });

    it("clamps negative input voltages to 0 without throwing", () => {
      const result = calculateADCDerivedValues(-1.5, 3.3, 12);
      expect(result.digitalValue).toBe(0);
    });

    it("clamps voltages exceeding Vref to 4095 without throwing", () => {
      const result = calculateADCDerivedValues(5.0, 3.3, 12);
      expect(result.digitalValue).toBe(4095);
    });

    it("demonstrates round-to-nearest behavior on quantization steps", () => {
      // 1 LSB for 12-bit at 3.3V = 3.3 / 4095 ≈ 0.00080586V
      const lsb = 3.3 / 4095;
      const code1_4 = calculateADCDerivedValues(lsb * 0.49, 3.3, 12);
      expect(code1_4.digitalValue).toBe(0); // Rounds down to 0

      const code1_6 = calculateADCDerivedValues(lsb * 0.51, 3.3, 12);
      expect(code1_6.digitalValue).toBe(1); // Rounds up to 1
    });
  });

  describe("Data Erasure & Account Deletion (Section I)", () => {
    it("handles deleteUserAccountData in demo mode safely and clears storage", async () => {
      localStorage.setItem("embeddedlab_attempts_demo_uart", JSON.stringify([{ score: 95 }]));
      const result = await deleteUserAccountData("demo-user-id");
      expect(result.success).toBe(true);
      expect(localStorage.getItem("embeddedlab_attempts_demo_uart")).toBeNull();
    });
  });

  describe("AI Request Validation & Boundary Constraints (Section L)", () => {
    it("accepts valid explain, hint, and debug actions with sanitized context", () => {
      const validPayload = {
        action: "explain",
        context: {
          labId: "gpio",
          challengeId: "gpio-ch-1",
          relevantState: { digitalPins: [] },
          recentEvents: [],
        },
        conceptQuery: "Push-pull vs Open-drain",
      };

      const result = validateAndSanitizeAIServerRequest(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.action).toBe("explain");
        expect(result.data.labId).toBe("gpio");
        expect(result.data.conceptQuery).toBe("Push-pull vs Open-drain");
      }
    });

    it("rejects unauthorized actions with 400 status", () => {
      const invalidPayload = {
        action: "execute_arbitrary_shell_command",
        context: {
          labId: "gpio",
          relevantState: {},
          recentEvents: [],
        },
      };

      const result = validateAndSanitizeAIServerRequest(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.statusCode).toBe(400);
      }
    });

    it("enforces maximum body size limit constant", () => {
      expect(LIMITS.MAX_BODY_SIZE_BYTES).toBe(32 * 1024);
    });
  });
});
