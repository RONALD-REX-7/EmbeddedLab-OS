/**
 * EmbeddedLab OS — app/(app)/progress/page.tsx
 *
 * Phase 18 — Production Student Progress & Performance Analytics Page.
 * Consumes real application state from useStudentProgress and Supabase/localStorage.
 */
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  HelpCircle,
  Play,
  RotateCcw,
  TrendingUp,
  Trophy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { MetricCard } from "@/components/shared/metric-card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { useStudentProgress } from "@/hooks/use-student-progress";
import { cn } from "@/lib/utils";

export default function ProgressPage() {
  const {
    isLoading,
    labsCompletedCount,
    totalChallengesCompleted,
    averageScore,
    overallCompletionPercent,
    totalAttempts,
    totalHintsUsed,
    strongestLab,
    nextRecommendedLab,
    labStats,
    recentActivity,
  } = useStudentProgress();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <TrendingUp className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="text-xs font-mono uppercase tracking-wider">Performance Analytics</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Student Learning Achievements
          </h1>
          <p className="mt-1 text-xs font-mono text-muted-foreground max-w-xl">
            Real-time tracking of challenge completions, score averages, and simulation verification records.
          </p>
        </div>

        <Link href={nextRecommendedLab.href}>
          <Button size="sm" className="font-mono text-xs font-semibold shadow-md">
            <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
            Continue Lab: {nextRecommendedLab.labId.toUpperCase()}
          </Button>
        </Link>
      </div>

      {/* Overall Progress Metrics (4 Summary Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Overall Progress"
          value={isLoading ? "..." : `${overallCompletionPercent}%`}
          unit="completed"
          signalState={overallCompletionPercent > 50 ? "high" : "normal"}
        />
        <MetricCard
          label="Labs Completed"
          value={isLoading ? "..." : `${labsCompletedCount}`}
          unit="/ 4 labs"
          signalState={labsCompletedCount > 0 ? "high" : "normal"}
        />
        <MetricCard
          label="Challenges Passed"
          value={isLoading ? "..." : `${totalChallengesCompleted}`}
          unit="/ 12 total"
        />
        <MetricCard
          label="Average Score"
          value={isLoading ? "..." : `${averageScore}`}
          unit="pts / challenge"
          signalState="high"
        />
      </div>

      {/* Learning Insights Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>Strongest Lab</span>
          </div>
          <p className="text-sm font-bold text-foreground truncate">
            {strongestLab ? strongestLab.title : "Not enough data"}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>Next Recommended</span>
          </div>
          <p className="text-sm font-bold text-foreground truncate">
            {nextRecommendedLab.labId.toUpperCase()} Lab
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <RotateCcw className="h-3.5 w-3.5 text-blue-400" />
            <span>Total Attempts</span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {totalAttempts} attempts
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-3.5 space-y-1 font-mono">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
            <span>Hints Revealed</span>
          </div>
          <p className="text-sm font-bold text-foreground">
            {totalHintsUsed} hints
          </p>
        </div>
      </div>

      {/* Per-Lab Progress Breakdown */}
      <div className="space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">
              Per-Laboratory Breakdown
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {labsCompletedCount} of 4 Labs Completed
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(["gpio", "pwm", "adc", "uart"] as const).map((labId) => {
            const lab = labStats[labId];
            return (
              <div
                key={labId}
                className="rounded-lg border border-border bg-card p-5 space-y-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-primary tracking-wider uppercase block mb-1">
                      {lab.difficulty} DIFFICULTY
                    </span>
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                      {lab.title}
                    </h3>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded border font-semibold shrink-0 uppercase",
                      lab.status === "COMPLETED"
                        ? "bg-feedback-success/10 text-feedback-success border-feedback-success/30"
                        : lab.status === "IN_PROGRESS"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-muted/30 text-muted-foreground border-border"
                    )}
                  >
                    {lab.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground font-sans leading-relaxed">
                  {lab.description}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-border/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      Challenges: <strong className="text-foreground">{lab.completedCount} / {lab.totalChallenges}</strong>
                    </span>
                    <span className="text-primary font-bold">{lab.progressPercent}%</span>
                  </div>
                  <ProgressBar value={lab.progressPercent} showPercentage={false} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Total Earned: <strong className="text-foreground">{lab.totalScore} pts</strong>
                  </span>
                  <Link href={`/labs/${labId}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs font-mono">
                      Go to Lab
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Stream & Clean Empty State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <Panel title="Recent Verification History" icon={Activity}>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs font-mono space-y-2">
                <Clock className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="font-semibold text-foreground">No recent verification attempts</p>
                <p className="text-[11px] max-w-sm mx-auto">
                  Launch any laboratory and submit a challenge to see your activity timeline populated here.
                </p>
              </div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded border border-border bg-muted/20 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.status === "PASSED" ? (
                        <CheckCircle2 className="h-4 w-4 text-feedback-success shrink-0" />
                      ) : (
                        <Award className="h-4 w-4 text-feedback-error shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-foreground font-semibold block truncate">
                          {item.challengeTitle}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {item.labId.toUpperCase()} • {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={cn(
                          "font-bold text-xs block",
                          item.status === "PASSED" ? "text-feedback-success" : "text-feedback-error"
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{item.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        <div className="lg:col-span-5">
          <Panel title="Learning Roadmap" icon={BookOpen}>
            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded border border-border bg-card space-y-1">
                <div className="flex items-center justify-between text-primary font-bold">
                  <span>1. GPIO Fundamentals</span>
                  <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">BEGINNER</span>
                </div>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Digital logic HIGH/LOW, pin modes, pull-up resistors, and LED driving.
                </p>
              </div>

              <div className="p-3 rounded border border-border bg-card space-y-1">
                <div className="flex items-center justify-between text-primary font-bold">
                  <span>2. PWM Waveforms</span>
                  <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">INTERMEDIATE</span>
                </div>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Carrier frequency (f), duty cycle (D), period T = 1/f, and smooth dimming.
                </p>
              </div>

              <div className="p-3 rounded border border-border bg-card space-y-1">
                <div className="flex items-center justify-between text-primary font-bold">
                  <span>3. Analog ADC Sampling</span>
                  <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">BEGINNER</span>
                </div>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Potentiometers, Vref reference scaling, resolution bits, and quantization formulas.
                </p>
              </div>

              <div className="p-3 rounded border border-border bg-card space-y-1">
                <div className="flex items-center justify-between text-primary font-bold">
                  <span>4. UART Serial Protocols</span>
                  <span className="text-[10px] bg-primary/10 px-1.5 py-0.5 rounded">ADVANCED</span>
                </div>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Baud rate matching, framing errors, parity, and serial terminal TX/RX.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
