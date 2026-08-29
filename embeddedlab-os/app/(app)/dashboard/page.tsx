/**
 * EmbeddedLab OS — app/(app)/dashboard/page.tsx
 *
 * Student Dashboard using real application state and persisted progress.
 */
"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FlaskConical,
  LayoutDashboard,
  Play,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Panel } from "@/components/shared/panel";
import { MetricCard } from "@/components/shared/metric-card";
import { ProgressBar } from "@/components/shared/progress-bar";
import { useStudentProgress } from "@/hooks/use-student-progress";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const {
    isLoading,
    labsCompletedCount,
    labsInProgressCount,
    totalChallengesCompleted,
    totalScore,
    overallCompletionPercent,
    nextRecommendedLab,
    labStats,
    recentActivity,
  } = useStudentProgress();

  const isNewStudent = totalChallengesCompleted === 0;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-7">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <LayoutDashboard className="h-4 w-4 text-primary" strokeWidth={1.5} />
            <span className="text-xs font-mono uppercase tracking-wider">Student Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Virtual Hardware Laboratory
          </h1>
          <p className="mt-1 text-xs text-muted-foreground max-w-xl font-mono">
            Track your embedded systems learning progress across GPIO, PWM, ADC, and UART labs.
          </p>
        </div>

        {/* Continue Learning CTA Button */}
        <Link href={nextRecommendedLab.href}>
          <Button size="sm" className="font-mono text-xs font-semibold shadow-md">
            <Play className="mr-1.5 h-3.5 w-3.5 fill-current" />
            Continue Learning: {nextRecommendedLab.labId.toUpperCase()}
          </Button>
        </Link>
      </div>

      {/* Real Progress Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Labs Completed"
          value={isLoading ? "..." : `${labsCompletedCount}`}
          unit="/ 4 labs"
          signalState={labsCompletedCount > 0 ? "high" : "normal"}
        />
        <MetricCard
          label="Labs In Progress"
          value={isLoading ? "..." : `${labsInProgressCount}`}
          unit="active"
        />
        <MetricCard
          label="Overall Progress"
          value={isLoading ? "..." : `${overallCompletionPercent}%`}
          unit="completed"
          signalState={overallCompletionPercent > 50 ? "high" : "normal"}
        />
        <MetricCard
          label="Total Score"
          value={isLoading ? "..." : `${totalScore}`}
          unit="pts"
          signalState="high"
        />
      </div>

      {/* Recommended Next Step / Continue Learning Banner */}
      <div className="rounded-lg border border-primary/30 bg-primary/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-primary font-bold">
            <Compass className="h-4 w-4 shrink-0" />
            <span>RECOMMENDED NEXT LAB</span>
          </div>
          <h3 className="text-base font-bold text-foreground">
            {nextRecommendedLab.title}
          </h3>
          <p className="text-xs text-muted-foreground font-mono">
            {isNewStudent
              ? "Start with GPIO — learn the fundamentals of digital input/output, LED driving, and push-button logic."
              : "Continue with your next uncompleted challenge suite."}
          </p>
        </div>

        <Link href={nextRecommendedLab.href} className="shrink-0">
          <Button className="font-mono text-xs font-semibold">
            Launch {nextRecommendedLab.labId.toUpperCase()} Lab
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>

      {/* Labs Overview Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-4 w-4 text-primary" />
            <h2 className="text-sm font-bold text-foreground font-mono uppercase tracking-wider">
              Laboratory Progress Overview
            </h2>
          </div>
          <Link href="/labs" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <span className="text-xs font-mono text-muted-foreground hover:text-foreground">
              View All Labs →
            </span>
          </Link>
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
                    <span className="text-[10px] font-mono font-bold text-primary tracking-wider uppercase block mb-1">
                      {lab.difficulty} DIFFICULTY
                    </span>
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                      {lab.title}
                    </h3>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-mono px-2 py-0.5 rounded border font-semibold shrink-0 uppercase",
                      lab.status === "COMPLETED"
                        ? "bg-[var(--feedback-success)]/10 text-[var(--feedback-success)] border-[var(--feedback-success)]/30"
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
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-muted-foreground">
                      Challenges: <strong className="text-foreground">{lab.completedCount} / {lab.totalChallenges}</strong>
                    </span>
                    <span className="text-primary font-bold">{lab.progressPercent}%</span>
                  </div>
                  <ProgressBar value={lab.progressPercent} showPercentage={false} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Score: <strong className="text-foreground">{lab.totalScore} pts</strong>
                  </span>
                  <Link href={`/labs/${labId}`}>
                    <Button variant="outline" size="sm" className="h-7 text-xs font-mono">
                      Open Lab
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Clean Starting State */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Recent Activity Feed (7 cols) */}
        <div className="lg:col-span-7">
          <Panel title="Recent Lab Activity" icon={Activity}>
            {recentActivity.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-xs font-mono space-y-2">
                <Clock className="h-8 w-8 text-muted-foreground/40 mx-auto" />
                <p className="font-semibold text-foreground">No recent validation attempts</p>
                <p className="text-[11px] max-w-sm mx-auto">
                  Launch a lab and submit your first challenge to see your activity history here.
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
                        <CheckCircle2 className="h-4 w-4 text-[var(--feedback-success)] shrink-0" />
                      ) : (
                        <Award className="h-4 w-4 text-[var(--feedback-error)] shrink-0" />
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
                          item.status === "PASSED" ? "text-[var(--feedback-success)]" : "text-[var(--feedback-error)]"
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

        {/* Right Column: Clean Getting Started Guide for New Students (5 cols) */}
        <div className="lg:col-span-5">
          <Panel title="Getting Started Guide" icon={BookOpen}>
            <div className="space-y-3.5 font-mono text-xs">
              <div className="p-3 rounded border border-border bg-card space-y-1">
                <span className="text-primary font-bold block">1. Select a Laboratory</span>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Begin with GPIO to understand digital high/low logic, pin modes, and pull-up resistors.
                </p>
              </div>

              <div className="p-3 rounded border border-border bg-card space-y-1">
                <span className="text-primary font-bold block">2. Configure Hardware Controls</span>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Interact with real-time hardware controls in the central visual oscilloscope/dial panel.
                </p>
              </div>

              <div className="p-3 rounded border border-border bg-card space-y-1">
                <span className="text-primary font-bold block">3. Submit Challenges</span>
                <p className="text-muted-foreground text-[11px] font-sans">
                  Validation functions inspect actual simulator state (never UI clicks) to award points.
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
