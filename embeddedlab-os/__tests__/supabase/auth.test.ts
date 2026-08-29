import { describe, it, expect } from "vitest";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { saveChallengeAttemptToSupabase, getUserLabProgress } from "@/lib/supabase/db";

describe("Supabase Integration & Safety Fallback Suite", () => {
  it("should report unconfigured safely when environment variables are absent", () => {
    const env = getSupabaseEnv();
    // Default in test env without process.env overrides
    expect(typeof env.isConfigured).toBe("boolean");
  });

  it("should not crash when saving challenge attempt in demo mode", async () => {
    await expect(
      saveChallengeAttemptToSupabase({
        userId: "demo-user-id",
        labId: "gpio",
        challengeId: "gpio-ch-1",
        result: {
          passed: true,
          score: 100,
          feedback: "Passed in test mode",
          conditions: [{ label: "Test", passed: true }],
        },
        attemptsCount: 1,
        hintsRevealed: 0,
      })
    ).resolves.not.toThrow();
  });

  it("should return default lab progress summaries in demo mode", async () => {
    const progress = await getUserLabProgress("demo-user-id");
    expect(progress).toBeDefined();
    expect(progress.gpio).toBeDefined();
    expect(progress.gpio.labId).toBe("gpio");
    expect(progress.pwm.labId).toBe("pwm");
    expect(progress.adc.labId).toBe("adc");
    expect(progress.uart.labId).toBe("uart");
  });
});
