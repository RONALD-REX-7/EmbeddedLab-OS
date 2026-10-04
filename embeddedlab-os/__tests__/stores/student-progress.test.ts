/**
 * EmbeddedLab OS — __tests__/stores/student-progress.test.ts
 * Unit tests verifying real-time student progress computation, client-side hydration,
 * event-driven reactive state updates, and fault-tolerant JSON parsing.
 */
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useStudentProgress } from "@/hooks/use-student-progress";

describe("useStudentProgress Reactive Hook Suite", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("calculates clean initial zero state on fresh browser session", () => {
    const { result } = renderHook(() => useStudentProgress());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.labsCompletedCount).toBe(0);
    expect(result.current.labsInProgressCount).toBe(0);
    expect(result.current.totalChallengesCompleted).toBe(0);
    expect(result.current.totalScore).toBe(0);
    expect(result.current.averageScore).toBe(0);
    expect(result.current.overallCompletionPercent).toBe(0);
    expect(result.current.totalAttempts).toBe(0);
    expect(result.current.totalHintsUsed).toBe(0);
    expect(result.current.strongestLab).toBeNull();
    expect(result.current.nextRecommendedLab.labId).toBe("gpio");

    // All four labs present in labStats
    expect(result.current.labStats.gpio.status).toBe("NOT_STARTED");
    expect(result.current.labStats.pwm.status).toBe("NOT_STARTED");
    expect(result.current.labStats.adc.status).toBe("NOT_STARTED");
    expect(result.current.labStats.uart.status).toBe("NOT_STARTED");
  });

  it("hydrates from pre-existing localStorage records upon mount", () => {
    localStorage.setItem(
      "embeddedlab_challenge_progress_gpio-ch-1",
      JSON.stringify({
        challengeId: "gpio-ch-1",
        labId: "gpio",
        status: "PASSED",
        attempts: 1,
        score: 100,
        hintsRevealed: 0,
        completedAt: Date.now(),
        attempts_log: [{ timestamp: 1000, passed: true, stateSnapshot: {} }],
      })
    );

    const { result } = renderHook(() => useStudentProgress());

    expect(result.current.totalChallengesCompleted).toBe(1);
    expect(result.current.totalScore).toBe(100);
    expect(result.current.averageScore).toBe(100);
    expect(result.current.overallCompletionPercent).toBe(8); // Math.round(1/12 * 100)
    expect(result.current.labsInProgressCount).toBe(1);
    expect(result.current.labStats.gpio.completedCount).toBe(1);
    expect(result.current.labStats.gpio.status).toBe("IN_PROGRESS");
    expect(result.current.recentActivity).toHaveLength(1);
    expect(result.current.recentActivity[0].status).toBe("PASSED");
  });

  it("dynamically recomputes progress when embeddedlab-progress-update event fires", () => {
    const { result } = renderHook(() => useStudentProgress());

    expect(result.current.totalChallengesCompleted).toBe(0);

    // Simulate saving a challenge in the simulator
    act(() => {
      localStorage.setItem(
        "embeddedlab_challenge_progress_pwm-ch-1",
        JSON.stringify({
          challengeId: "pwm-ch-1",
          labId: "pwm",
          status: "PASSED",
          attempts: 2,
          score: 85,
          hintsRevealed: 1,
          completedAt: Date.now(),
          attempts_log: [
            { timestamp: 2000, passed: false, stateSnapshot: {} },
            { timestamp: 2050, passed: true, stateSnapshot: {} },
          ],
        })
      );
      window.dispatchEvent(new Event("embeddedlab-progress-update"));
    });

    expect(result.current.totalChallengesCompleted).toBe(1);
    expect(result.current.totalScore).toBe(85);
    expect(result.current.totalAttempts).toBe(2);
    expect(result.current.totalHintsUsed).toBe(1);
    expect(result.current.labStats.pwm.status).toBe("IN_PROGRESS");
  });

  it("recomputes progress when cross-window storage event fires", () => {
    const { result } = renderHook(() => useStudentProgress());

    act(() => {
      localStorage.setItem(
        "embeddedlab_challenge_progress_adc-ch-1",
        JSON.stringify({
          challengeId: "adc-ch-1",
          labId: "adc",
          status: "PASSED",
          attempts: 1,
          score: 100,
          hintsRevealed: 0,
          completedAt: Date.now(),
          attempts_log: [{ timestamp: 3000, passed: true, stateSnapshot: {} }],
        })
      );
      window.dispatchEvent(new StorageEvent("storage", { key: "embeddedlab_challenge_progress_adc-ch-1" }));
    });

    expect(result.current.totalChallengesCompleted).toBe(1);
    expect(result.current.labStats.adc.completedCount).toBe(1);
  });

  it("transitions lab status to COMPLETED when all 3 challenges pass and shifts next recommendation", () => {
    // Complete all 3 GPIO challenges
    ["gpio-ch-1", "gpio-ch-2", "gpio-ch-3"].forEach((id, idx) => {
      localStorage.setItem(
        `embeddedlab_challenge_progress_${id}`,
        JSON.stringify({
          challengeId: id,
          labId: "gpio",
          status: "PASSED",
          attempts: 1,
          score: 100,
          hintsRevealed: 0,
          completedAt: Date.now() + idx,
          attempts_log: [{ timestamp: Date.now() + idx, passed: true, stateSnapshot: {} }],
        })
      );
    });

    const { result } = renderHook(() => useStudentProgress());

    expect(result.current.labsCompletedCount).toBe(1);
    expect(result.current.labStats.gpio.status).toBe("COMPLETED");
    expect(result.current.labStats.gpio.progressPercent).toBe(100);
    expect(result.current.totalChallengesCompleted).toBe(3);
    expect(result.current.totalScore).toBe(300);

    // Next recommended lab shifts to PWM
    expect(result.current.nextRecommendedLab.labId).toBe("pwm");
  });

  it("tolerates corrupted JSON in localStorage gracefully without crashing", () => {
    localStorage.setItem("embeddedlab_challenge_progress_uart-ch-1", "CORRUPTED_JSON_{{[");
    localStorage.setItem(
      "embeddedlab_challenge_progress_uart-ch-2",
      JSON.stringify({
        challengeId: "uart-ch-2",
        labId: "uart",
        status: "PASSED",
        attempts: 1,
        score: 100,
        hintsRevealed: 0,
        completedAt: Date.now(),
        attempts_log: [{ timestamp: 4000, passed: true, stateSnapshot: {} }],
      })
    );

    const { result } = renderHook(() => useStudentProgress());

    // Should skip the corrupted item and still correctly read uart-ch-2
    expect(result.current.totalChallengesCompleted).toBe(1);
    expect(result.current.labStats.uart.completedCount).toBe(1);
  });
});
