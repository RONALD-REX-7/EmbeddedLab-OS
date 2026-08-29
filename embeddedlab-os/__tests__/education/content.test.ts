import { describe, it, expect } from "vitest";
import { LAB_EDUCATIONAL_CONTENT } from "@/lib/education/content";

describe("Lab Educational Content Registry Suite", () => {
  it("should have complete educational content definitions for all 4 labs", () => {
    const labIds = ["gpio", "pwm", "adc", "uart"] as const;

    for (const labId of labIds) {
      const content = LAB_EDUCATIONAL_CONTENT[labId];
      expect(content).toBeDefined();
      expect(content.labId).toBe(labId);
      expect(content.title).toBeDefined();
      expect(content.subtitle).toBeDefined();
      expect(content.learningObjectives.length).toBeGreaterThan(0);
      expect(content.sections.length).toBeGreaterThan(0);
      expect(content.experimentSteps.length).toBeGreaterThan(0);
      expect(content.keyTakeaway).toBeDefined();
    }
  });

  it("should contain PWM frequency and duty cycle equations in PWM theory section", () => {
    const pwm = LAB_EDUCATIONAL_CONTENT.pwm;
    const equationsSection = pwm.sections.find((s) => s.title.includes("Equations"));

    expect(equationsSection).toBeDefined();
    expect(equationsSection?.content.some((line) => line.includes("T = 1 / f"))).toBe(true);
  });

  it("should contain ADC quantization formula in ADC theory section", () => {
    const adc = LAB_EDUCATIONAL_CONTENT.adc;
    const formulaSection = adc.sections.find((s) => s.title.includes("Conversion Formula"));

    expect(formulaSection).toBeDefined();
    expect(formulaSection?.content.some((line) => line.includes("ADC_raw = round"))).toBe(true);
  });
});
