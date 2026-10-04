/**
 * EmbeddedLab OS — hooks/use-student-progress.ts
 * Custom hook for computing real-time student learning progress from actual persisted state.
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import { LAB_CHALLENGES } from "@/lib/challenges";
import type { ChallengeState, LabId } from "@/types/simulator";

export interface LabSummaryStats {
  labId: LabId;
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  completedCount: number;
  totalChallenges: number;
  progressPercent: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  totalScore: number;
}

export interface ActivityItem {
  id: string;
  labId: LabId;
  challengeTitle: string;
  status: "PASSED" | "FAILED" | "IN_PROGRESS";
  score: number;
  timestamp: number;
}

export interface StudentProgressSummary {
  isLoading: boolean;
  labsCompletedCount: number;
  labsInProgressCount: number;
  totalChallengesCompleted: number;
  totalScore: number;
  averageScore: number;
  overallCompletionPercent: number;
  totalAttempts: number;
  totalHintsUsed: number;
  strongestLab: { labId: LabId; title: string } | null;
  nextRecommendedLab: { labId: LabId; title: string; href: string };
  labStats: Record<LabId, LabSummaryStats>;
  recentActivity: ActivityItem[];
}

const LAB_TITLES: Record<LabId, { title: string; desc: string; difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" }> = {
  gpio: {
    title: "GPIO — General Purpose Input / Output",
    desc: "Digital pin logic, LED driving, and button inputs.",
    difficulty: "BEGINNER",
  },
  pwm: {
    title: "PWM — Pulse-Width Modulation",
    desc: "Duty cycle control, carrier frequency, and LED dimming.",
    difficulty: "INTERMEDIATE",
  },
  adc: {
    title: "ADC — Analog-to-Digital Converter",
    desc: "Analog potentiometer sampling, Vref, and quantization.",
    difficulty: "BEGINNER",
  },
  uart: {
    title: "UART — Serial Communication",
    desc: "Asynchronous serial frames, baud rates, and terminals.",
    difficulty: "ADVANCED",
  },
};

export function useStudentProgress(): StudentProgressSummary {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setMounted(true);
    const handleUpdate = () => setTick((t) => t + 1);
    window.addEventListener("storage", handleUpdate);
    window.addEventListener("embeddedlab-progress-update", handleUpdate);
    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("embeddedlab-progress-update", handleUpdate);
    };
  }, []);

  return useMemo(() => {
    if (!mounted || typeof window === "undefined") {
      const initialStats: Record<LabId, LabSummaryStats> = {
        gpio: { labId: "gpio", title: LAB_TITLES.gpio.title, description: LAB_TITLES.gpio.desc, difficulty: "BEGINNER", completedCount: 0, totalChallenges: 3, progressPercent: 0, status: "NOT_STARTED", totalScore: 0 },
        pwm: { labId: "pwm", title: LAB_TITLES.pwm.title, description: LAB_TITLES.pwm.desc, difficulty: "INTERMEDIATE", completedCount: 0, totalChallenges: 3, progressPercent: 0, status: "NOT_STARTED", totalScore: 0 },
        adc: { labId: "adc", title: LAB_TITLES.adc.title, description: LAB_TITLES.adc.desc, difficulty: "BEGINNER", completedCount: 0, totalChallenges: 3, progressPercent: 0, status: "NOT_STARTED", totalScore: 0 },
        uart: { labId: "uart", title: LAB_TITLES.uart.title, description: LAB_TITLES.uart.desc, difficulty: "ADVANCED", completedCount: 0, totalChallenges: 3, progressPercent: 0, status: "NOT_STARTED", totalScore: 0 },
      };
      return {
        isLoading: false,
        labsCompletedCount: 0,
        labsInProgressCount: 0,
        totalChallengesCompleted: 0,
        totalScore: 0,
        averageScore: 0,
        overallCompletionPercent: 0,
        totalAttempts: 0,
        totalHintsUsed: 0,
        strongestLab: null,
        nextRecommendedLab: { labId: "gpio", title: LAB_TITLES.gpio.title, href: "/labs/gpio" },
        labStats: initialStats,
        recentActivity: [],
      };
    }

    const labIds: LabId[] = ["gpio", "pwm", "adc", "uart"];
    const labStats: Record<LabId, LabSummaryStats> = {} as Record<LabId, LabSummaryStats>;
    const activity: ActivityItem[] = [];

    let grandTotalPassed = 0;
    let grandTotalScore = 0;
    let completedLabs = 0;
    let inProgressLabs = 0;
    let grandTotalAttempts = 0;
    let grandTotalHints = 0;

    for (const labId of labIds) {
      const challenges = LAB_CHALLENGES[labId] || [];
      let passedCount = 0;
      let labScore = 0;
      let attempted = false;

      for (const ch of challenges) {
        if (typeof window !== "undefined") {
          const raw = localStorage.getItem(`embeddedlab_challenge_progress_${ch.id}`);
          if (raw) {
            try {
              const state: ChallengeState = JSON.parse(raw);
              attempted = true;
              grandTotalAttempts += state.attempts || 0;
              grandTotalHints += state.hintsRevealed || 0;

              if (state.status === "PASSED") {
                passedCount++;
                labScore += state.score;
              }
              if (state.attempts_log && state.attempts_log.length > 0) {
                const lastLog = state.attempts_log[state.attempts_log.length - 1];
                activity.push({
                  id: `${ch.id}_${lastLog.timestamp}`,
                  labId,
                  challengeTitle: ch.title,
                  status: state.status === "PASSED" ? "PASSED" : "FAILED",
                  score: state.score,
                  timestamp: lastLog.timestamp,
                });
              }
            } catch {
              // Ignore parse error
            }
          }
        }
      }

      grandTotalPassed += passedCount;
      grandTotalScore += labScore;

      const totalCh = challenges.length || 3;
      const progressPercent = Math.round((passedCount / totalCh) * 100);
      let status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" = "NOT_STARTED";

      if (passedCount === totalCh) {
        status = "COMPLETED";
        completedLabs++;
      } else if (passedCount > 0 || attempted) {
        status = "IN_PROGRESS";
        inProgressLabs++;
      }

      labStats[labId] = {
        labId,
        title: LAB_TITLES[labId].title,
        description: LAB_TITLES[labId].desc,
        difficulty: LAB_TITLES[labId].difficulty,
        completedCount: passedCount,
        totalChallenges: totalCh,
        progressPercent,
        status,
        totalScore: labScore,
      };
    }

    // Determine strongest lab (highest completion count, or highest score if tied)
    let strongest: { labId: LabId; title: string } | null = null;
    let maxCompleted = -1;
    let maxScore = -1;

    for (const labId of labIds) {
      const lab = labStats[labId];
      if (lab.completedCount > maxCompleted || (lab.completedCount === maxCompleted && lab.totalScore > maxScore)) {
        if (lab.completedCount > 0) {
          maxCompleted = lab.completedCount;
          maxScore = lab.totalScore;
          strongest = { labId, title: lab.title.split("—")[0].trim() };
        }
      }
    }

    // Determine next recommended lab
    let nextRec: { labId: LabId; title: string; href: string } = {
      labId: "gpio",
      title: "GPIO — General Purpose Input / Output",
      href: "/labs/gpio",
    };

    for (const labId of labIds) {
      if (labStats[labId].status !== "COMPLETED") {
        nextRec = {
          labId,
          title: labStats[labId].title,
          href: `/labs/${labId}`,
        };
        break;
      }
    }

    // Sort recent activity newest first
    activity.sort((a, b) => b.timestamp - a.timestamp);

    const averageScore = grandTotalPassed > 0 ? Math.round(grandTotalScore / grandTotalPassed) : 0;

    return {
      isLoading: false,
      labsCompletedCount: completedLabs,
      labsInProgressCount: inProgressLabs,
      totalChallengesCompleted: grandTotalPassed,
      totalScore: grandTotalScore,
      averageScore,
      overallCompletionPercent: Math.round((grandTotalPassed / 12) * 100),
      totalAttempts: grandTotalAttempts,
      totalHintsUsed: grandTotalHints,
      strongestLab: strongest,
      nextRecommendedLab: nextRec,
      labStats,
      recentActivity: activity.slice(0, 7),
    };
  }, [mounted, tick]);
}
