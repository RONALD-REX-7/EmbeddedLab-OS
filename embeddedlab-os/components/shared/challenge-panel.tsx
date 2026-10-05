/**
 * EmbeddedLab OS — components/shared/challenge-panel.tsx
 * Precision Engineering Challenge & Experiment Worksheet Component.
 */
"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, ChevronRight, ShieldCheck, Target, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { useChallenge } from "@/hooks/use-challenge";
import { useChallengeStore } from "@/store/challenge-store";
import { useSimulatorStore } from "@/store/simulator-store";
import { useAuth } from "@/lib/supabase/auth-context";
import { saveChallengeAttemptToSupabase } from "@/lib/supabase/db";
import { runChallengeValidator, LAB_CHALLENGES } from "@/lib/challenges";
import { cn } from "@/lib/utils";
import type { ChallengeDifficulty, LabId } from "@/types/simulator";

interface ChallengePanelProps {
  labId: LabId;
  className?: string;
}

export function ChallengePanel({ labId, className }: ChallengePanelProps) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const challenges = LAB_CHALLENGES[labId] || [];
  const currentChallenge = challenges[activeIdx] || challenges[0];

  const mcuState = useSimulatorStore((state) => state.mcuState);
  const { user, isDemoMode } = useAuth();

  const {
    activeChallenge,
    lastValidationResult,
    startChallenge,
    recordAttempt,
    revealNextHint,
  } = useChallenge();

  // Initialize or synchronize active challenge on mount and when active challenge changes
  useEffect(() => {
    if (currentChallenge) {
      startChallenge(currentChallenge.id, labId);
    }
  }, [currentChallenge, labId, startChallenge]);

  const handleSelectChallenge = (idx: number) => {
    setActiveIdx(idx);
    const selectedChallenge = challenges[idx];
    if (selectedChallenge) {
      startChallenge(selectedChallenge.id, labId);
    }
  };

  const handleValidate = () => {
    if (!currentChallenge) return;
    if (!activeChallenge || activeChallenge.challengeId !== currentChallenge.id) {
      startChallenge(currentChallenge.id, labId);
    }
    const result = runChallengeValidator(currentChallenge.validatorKey, mcuState);
    recordAttempt(result, currentChallenge.scoringRules.attemptPenalty);

    // Persist authenticated student progress to Supabase
    if (!isDemoMode && user && user.id && user.id !== "demo-user-id") {
      const stateNow = useChallengeStore.getState().activeChallenge;
      saveChallengeAttemptToSupabase({
        userId: user.id,
        labId,
        challengeId: currentChallenge.id,
        result,
        attemptsCount: stateNow?.attempts ?? 1,
        hintsRevealed: stateNow?.hintsRevealed ?? 0,
      }).catch(() => {
        // Non-blocking catch for transient network or Supabase errors
      });
    }
  };

  const difficultyBadges: Record<ChallengeDifficulty, { label: string; style: string }> = {
    BEGINNER: { label: "LVL 1 · BEGINNER", style: "bg-blue-500/10 text-blue-800 dark:text-blue-300 border-blue-600/30 dark:border-blue-500/30" },
    INTERMEDIATE: { label: "LVL 2 · INTERMEDIATE", style: "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-600/30 dark:border-amber-500/30" },
    ADVANCED: { label: "LVL 3 · ADVANCED", style: "bg-purple-500/10 text-purple-800 dark:text-purple-300 border-purple-600/30 dark:border-purple-500/30" },
  };

  const badge = currentChallenge ? difficultyBadges[currentChallenge.difficulty] : difficultyBadges.BEGINNER;

  return (
    <Panel
      title="Laboratory Challenges & Worksheet"
      icon={Target}
      telemetryTag={`${activeIdx + 1} / ${challenges.length}`}
      className={className}
    >
      <div className="space-y-3.5 font-mono text-xs">
        {/* Challenge Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Laboratory challenge tasks"
          className="grid grid-cols-3 gap-1 bg-surface-sunken p-1 rounded border border-border-default select-none"
        >
          {challenges.map((ch, idx) => {
            const isCurrent = activeIdx === idx;
            return (
              <button
                type="button"
                role="tab"
                id={`task-tab-${idx}`}
                aria-selected={isCurrent}
                aria-controls={`task-panel-${idx}`}
                key={ch.id}
                onClick={() => handleSelectChallenge(idx)}
                className={cn(
                  "py-1 px-1.5 rounded text-[10px] font-mono transition-all font-medium text-center truncate focus-visible:outline-2 focus-visible:outline-primary",
                  isCurrent
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                Task {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Active Challenge Worksheet Container */}
        {currentChallenge && (
          <div
            role="tabpanel"
            id={`task-panel-${activeIdx}`}
            aria-labelledby={`task-tab-${activeIdx}`}
            className="space-y-3 bg-(--surface-sunken)/60 border border-border-default rounded p-3.5"
          >
            {/* Header: Title, Level Badge, and Score Box */}
            <div className="space-y-2 pb-2.5 border-b border-(--border-default)/70">
              <div className="flex items-center justify-between gap-2">
                <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-mono font-bold tracking-wider", badge.style)}>
                  {badge.label}
                </span>

                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-muted-foreground">
                    Attempts: <strong className="text-foreground">{activeChallenge?.attempts || 0}</strong>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary font-bold">
                    {activeChallenge?.score ?? 100} PTS
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 pt-0.5">
                <h3 className="text-xs font-bold text-foreground font-sans leading-snug">
                  {currentChallenge.title}
                </h3>
                {activeChallenge?.status === "PASSED" && (
                  <span className="text-[9px] bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-600/30 dark:border-emerald-500/30 px-1.5 py-0.5 rounded font-mono font-bold shrink-0 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-700 dark:text-emerald-400" />
                    VERIFIED
                  </span>
                )}
              </div>

              <p className="text-[11px] font-sans text-muted-foreground leading-relaxed">
                {currentChallenge.description}
              </p>
            </div>

            {/* Learning Objectives Checklist */}
            {currentChallenge.objectives.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Engineering Requirements
                </span>
                <div className="space-y-1 bg-surface-base border border-border-subtle rounded p-2 text-[11px] font-sans">
                  {currentChallenge.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-foreground/90">
                      <span className="text-primary font-mono font-bold text-xs">›</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progressive Hints Section */}
            <div className="pt-1.5 border-t border-(--border-default)/50 space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">
                  Hints ({activeChallenge?.hintsRevealed || 0} / {currentChallenge.hints.length})
                </span>
                {activeChallenge && activeChallenge.hintsRevealed < currentChallenge.hints.length && (
                  <button
                    type="button"
                    onClick={() => revealNextHint(currentChallenge.scoringRules.hintPenalty)}
                    className="text-primary hover:underline font-semibold flex items-center gap-0.5 focus-visible:outline-2 focus-visible:outline-primary rounded px-1"
                  >
                    <span>Request Hint (-{currentChallenge.scoringRules.hintPenalty} pts)</span>
                    <ChevronRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                )}
              </div>

              {activeChallenge && activeChallenge.hintsRevealed > 0 && (
                <div className="space-y-1 bg-surface-base border border-border-subtle rounded p-2 text-[11px] font-sans">
                  {currentChallenge.hints.slice(0, activeChallenge.hintsRevealed).map((h) => (
                    <div key={h.order} className="text-muted-foreground flex gap-1.5 leading-snug">
                      <span className="text-amber-400 font-mono font-bold shrink-0">{h.order}.</span>
                      <span>{h.text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Validation Feedback & Condition Breakdown */}
            {lastValidationResult && (
              <div
                className={cn(
                  "p-2.5 rounded border text-xs space-y-2 font-mono transition-all",
                  lastValidationResult.passed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                )}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {lastValidationResult.passed ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-red-400" />
                  )}
                  <span>{lastValidationResult.feedback}</span>
                </div>
                <div className="space-y-1 text-[10px] pt-1.5 border-t border-current/20">
                  {lastValidationResult.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="truncate pr-2">{cond.label}</span>
                      <span className="font-bold shrink-0">
                        {cond.passed ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Trigger Button */}
            <Button
              onClick={handleValidate}
              className="w-full h-8 text-xs font-mono font-bold control-elevated"
            >
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Validate Hardware State
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
}
