/**
 * EmbeddedLab OS — components/shared/challenge-panel.tsx
 * Standardized, feature-complete Challenge Framework UI component.
 */
"use client";

import { useState } from "react";
import { CheckCircle2, HelpCircle, Target, Award } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { useChallenge } from "@/hooks/use-challenge";
import { useSimulatorStore } from "@/store/simulator-store";
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

  const {
    activeChallenge,
    lastValidationResult,
    startChallenge,
    recordAttempt,
    revealNextHint,
  } = useChallenge();

  const handleSelectChallenge = (idx: number) => {
    setActiveIdx(idx);
    const chal = challenges[idx];
    if (chal) {
      startChallenge(chal.id, labId);
    }
  };

  const handleValidate = () => {
    if (!currentChallenge) return;
    const result = runChallengeValidator(currentChallenge.validatorKey, mcuState);
    recordAttempt(result, currentChallenge.scoringRules.attemptPenalty);
  };

  const difficultyColors: Record<ChallengeDifficulty, string> = {
    BEGINNER: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    INTERMEDIATE: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    ADVANCED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  };

  return (
    <Panel title="Experiment Instructions & Challenges" icon={HelpCircle} className={className}>
      <div className="space-y-4 font-mono text-xs">
        {/* Challenge Tabs */}
        <div className="flex gap-1 bg-muted/20 p-1 rounded-md border border-border">
          {challenges.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => handleSelectChallenge(idx)}
              className={cn(
                "flex-1 text-[11px] font-mono py-1 rounded transition-colors text-center font-medium",
                activeIdx === idx
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Challenge {idx + 1}
            </button>
          ))}
        </div>

        {/* Active Challenge Card Body */}
        {currentChallenge && (
          <div className="space-y-3.5 bg-muted/20 border border-border rounded-md p-4">
            {/* Header: Title, Difficulty Badge, and Status */}
            <div className="space-y-2 border-b border-border pb-3">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded border font-semibold tracking-wide uppercase",
                    difficultyColors[currentChallenge.difficulty] || difficultyColors.BEGINNER
                  )}
                >
                  {currentChallenge.difficulty}
                </span>

                <div className="flex items-center gap-2 text-[11px]">
                  <span className="text-muted-foreground">
                    Attempts: <strong className="text-foreground">{activeChallenge?.attempts || 0}</strong>
                  </span>
                  <span className="text-muted-foreground">
                    Score: <strong className="text-primary">{activeChallenge?.score ?? 100} pts</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2 pt-1">
                <h4 className="text-xs font-bold text-foreground leading-snug">
                  {currentChallenge.title}
                </h4>
                {activeChallenge?.status === "PASSED" && (
                  <span className="text-[10px] bg-[var(--feedback-success)]/10 text-[var(--feedback-success)] border border-[var(--feedback-success)]/30 px-1.5 py-0.5 rounded font-bold shrink-0">
                    PASSED ✓
                  </span>
                )}
              </div>

              <p className="text-xs font-sans text-muted-foreground leading-relaxed">
                {currentChallenge.description}
              </p>
            </div>

            {/* Objectives List */}
            {currentChallenge.objectives.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Target className="h-3 w-3 text-primary" />
                  Learning Objectives
                </span>
                <div className="space-y-1 bg-background border border-border/80 rounded p-2 text-[11px] font-sans">
                  {currentChallenge.objectives.map((obj, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-foreground/90">
                      <span className="text-primary font-mono font-bold">•</span>
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Progressive Hints Section */}
            <div className="pt-2 border-t border-border/60 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">
                  Hints Revealed: {activeChallenge?.hintsRevealed || 0} / {currentChallenge.hints.length}
                </span>
                {activeChallenge && activeChallenge.hintsRevealed < currentChallenge.hints.length && (
                  <button
                    onClick={() => revealNextHint(currentChallenge.scoringRules.hintPenalty)}
                    className="text-primary hover:underline text-[10px] font-semibold"
                  >
                    + Reveal Hint (-{currentChallenge.scoringRules.hintPenalty} pts)
                  </button>
                )}
              </div>

              {activeChallenge && activeChallenge.hintsRevealed > 0 && (
                <div className="space-y-1 bg-background border border-border rounded p-2.5 text-xs font-sans">
                  {currentChallenge.hints.slice(0, activeChallenge.hintsRevealed).map((h) => (
                    <div key={h.order} className="text-muted-foreground text-[11px] flex gap-1.5">
                      <span className="text-primary font-mono font-bold">{h.order}.</span>
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
                  "p-3 rounded border text-xs space-y-2 font-mono",
                  lastValidationResult.passed
                    ? "bg-[var(--feedback-success)]/10 border-[var(--feedback-success)]/30 text-[var(--feedback-success)]"
                    : "bg-[var(--feedback-error)]/10 border-[var(--feedback-error)]/30 text-[var(--feedback-error)]"
                )}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Award className="h-4 w-4 shrink-0" />
                  <span>{lastValidationResult.feedback}</span>
                </div>
                <div className="space-y-1 text-[11px] pt-1 border-t border-current/20">
                  {lastValidationResult.conditions.map((cond, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="truncate pr-2">{cond.label}</span>
                      <span className="font-bold shrink-0">{cond.passed ? "✓ PASS" : "✗ FAIL"}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Validation Trigger Button */}
            <Button onClick={handleValidate} className="w-full h-8 text-xs font-mono font-semibold">
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              Submit Challenge for Validation
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
}
