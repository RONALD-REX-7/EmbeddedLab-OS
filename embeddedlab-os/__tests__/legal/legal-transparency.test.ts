/**
 * EmbeddedLab OS — __tests__/legal/legal-transparency.test.ts
 * Unit tests verifying data minimization, legal disclosures, self-service data wipe,
 * export functionality, and verified maintainer contact information.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { LEGAL_CONFIG } from "@/lib/constants/legal";
import {
  wipeLocalStorageData,
  deleteUserAccountData,
  exportUserData,
} from "@/lib/supabase/db";

describe("Trust, Privacy & Data Management Suite", () => {
  beforeEach(() => {
    // Clear mock localStorage before each test
    localStorage.clear();
  });

  describe("Verified Legal & Transparency Metadata", () => {
    it("contains verified developer and repository details without hallucinated credentials", () => {
      expect(LEGAL_CONFIG.authorName).toBe("Ronald Rex");
      expect(LEGAL_CONFIG.developerHandle).toBe("@RONALD-REX-7");
      expect(LEGAL_CONFIG.verifiedContactEmail).toBe("ronaldrexch@gmail.com");
      expect(LEGAL_CONFIG.repositoryUrl).toContain("RONALD-REX-7/EmbeddedLab-OS");
    });

    it("declares authentic non-corporate open-source project status without template placeholders", () => {
      expect(LEGAL_CONFIG.legalEntityName).not.toContain("[BUSINESS_NAME]");
      expect(LEGAL_CONFIG.legalAddress).not.toContain("[LEGAL_ADDRESS]");
      expect(LEGAL_CONFIG.legalEntityName).toContain("Ronald Rex");
      expect(LEGAL_CONFIG.legalAddress).toContain("ronaldrexch@gmail.com");
    });

    it("accurately declares operational nature: zero commercial charging and zero third-party tracking", () => {
      expect(LEGAL_CONFIG.isCommercial).toBe(false);
      expect(LEGAL_CONFIG.hasThirdPartyTracking).toBe(false);
      expect(LEGAL_CONFIG.hasMarketingEmails).toBe(false);
    });

    it("documents all four strictly necessary storage items", () => {
      expect(LEGAL_CONFIG.storageItems.length).toBeGreaterThanOrEqual(4);
      const storageNames = LEGAL_CONFIG.storageItems.map((s) => s.name);
      expect(storageNames).toContain("sb-*-auth-token");
      expect(storageNames).toContain("embeddedlab_challenge_progress_*");
      expect(storageNames).toContain("embeddedlab_attempts_*");
      expect(storageNames).toContain("embeddedlab_ch_*");
    });

    it("documents third-party service providers with strict data minimization terms", () => {
      const providers = LEGAL_CONFIG.thirdPartyServices.map((p) => p.name);
      expect(providers).toContain("Google Gemini AI (Google Cloud)");
      expect(providers).toContain("Supabase Inc.");
      expect(providers).toContain("Next.js Google Fonts");

      const gemini = LEGAL_CONFIG.thirdPartyServices.find((p) =>
        p.name.includes("Gemini")
      );
      expect(gemini?.dataShared).toContain("Technical hardware state parameters only");
      expect(gemini?.dataShared).toContain("No personal names, emails, or user IDs");
    });
  });

  describe("Self-Service Data Wiping & Erasure", () => {
    it("wipes all embeddedlab keys from local storage deterministically", () => {
      localStorage.setItem("embeddedlab_challenge_progress_gpio-ch-1", JSON.stringify({ completed: true }));
      localStorage.setItem("embeddedlab_attempts_demo_gpio", JSON.stringify([{ score: 100 }]));
      localStorage.setItem("embeddedlab_ch_gpio", "1");
      localStorage.setItem("unrelated_app_setting", "keep_me");

      const result = wipeLocalStorageData();
      expect(result.success).toBe(true);
      expect(result.clearedKeysCount).toBe(3);

      expect(localStorage.getItem("embeddedlab_challenge_progress_gpio-ch-1")).toBeNull();
      expect(localStorage.getItem("embeddedlab_attempts_demo_gpio")).toBeNull();
      expect(localStorage.getItem("embeddedlab_ch_gpio")).toBeNull();
      expect(localStorage.getItem("unrelated_app_setting")).toBe("keep_me");
    });

    it("handles deleteUserAccountData in demo mode gracefully and flushes local storage", async () => {
      localStorage.setItem("embeddedlab_attempts_demo_pwm", JSON.stringify([{ score: 80 }]));
      const result = await deleteUserAccountData("demo-user-id");
      expect(result.success).toBe(true);
      expect(localStorage.getItem("embeddedlab_attempts_demo_pwm")).toBeNull();
    });
  });

  describe("Data Portability & Export", () => {
    it("exports student learning records to a structured JSON schema", async () => {
      localStorage.setItem(
        "embeddedlab_challenge_progress_adc-ch-1",
        JSON.stringify({ passed: true, score: 100 })
      );

      const exported = await exportUserData("student-test-id");
      expect(exported.exportDate).toBeDefined();
      expect(exported.userId).toBe("student-test-id");
      expect(exported.formatVersion).toBe("1.0");

      const localData = exported.localStorageData as Record<string, unknown>;
      expect(localData["embeddedlab_challenge_progress_adc-ch-1"]).toEqual({
        passed: true,
        score: 100,
      });
    });
  });
});
