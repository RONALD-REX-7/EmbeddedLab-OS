/**
 * EmbeddedLab OS — app/(app)/dashboard/page.tsx
 * Student Dashboard — Engineering Command Center.
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
    <div className="p-4 max-w-6xl mx-auto space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 font-mono text-[10px] uppercase tracking-wider">
            <LayoutDashboard className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
            <span>SYSTEM OVERVIEW</span>
            <span>·</span>
            <span className="text-primary font-bold">STUDENT COMMAND CENTER</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-sans tracking-tight">
            Virtual Hardware Laboratory
          </h1>
          <p className="mt-0.5 text-[10px] text-muted-foreground font-mono">
            Track your embedded systems learning progress across GPIO, PWM, ADC, and UART labs.
          </p>
        </div>

        <Link href={nextRecommendedLab.href}>
          <Button size="sm" className="h-8 font-mono text-xs font-bold shadow-md control-elevated">
            <Play className="mr-1 h-3 w-3 fill-current" />
            Continue: {nextRecommendedLab.labId.toUpperCase()}
          </Button>
        </Link>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Labs Complete"
          value={isLoading ? "..." : `${labsCompletedCount}`}
          unit="/ 4"
          signalState={labsCompletedCount > 0 ? "high" : "normal"}
        />
        <MetricCard
          label="In Progress"
          value={isLoading ? "..." : `${labsInProgressCount}`}
          unit="active"
        />
        <MetricCard
          label="Completion"
          value={isLoading ? "..." : `${overallCompletionPercent}%`}
          signalState={overallCompletionPercent > 50 ? "high" : "normal"}
        />
        <MetricCard
          label="Total Score"
          value={isLoading ? "..." : `${totalScore}`}
          unit="pts"
          signalState="high"
        />
      </div>

      {/* Recommended Next Lab Banner */}
      <div className="rounded border border-primary/20 bg-primary/5 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-primary font-bold uppercase tracking-wider">
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span>RECOMMENDED NEXT LAB</span>
          </div>
          <h3 className="text-sm font-bold text-foreground">
            {nextRecommendedLab.title}
          </h3>
          <p className="text-[10px] text-muted-foreground font-mono">
            {isNewStudent
              ? "Start with GPIO — learn digital I/O, LED driving, and push-button logic."
              : "Continue with your next uncompleted challenge suite."}
          </p>
        </div>

        <Link href={nextRecommendedLab.href} className="shrink-0">
          <Button size="sm" className="h-8 font-mono text-xs font-bold">
            Launch {nextRecommendedLab.labId.toUpperCase()}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>

      {/* Labs Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <FlaskConical className="h-3.5 w-3.5 text-primary" />
            <h2 className="text-xs font-bold text-foreground font-mono uppercase tracking-wider">
              Laboratory Progress Overview
            </h2>
          </div>
          <Link href="/labs" className={buttonVariants({ variant: "ghost", size: "sm" })}>
            <span className="text-[10px] font-mono text-muted-foreground hover:text-foreground">
              View All Labs →
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(["gpio", "pwm", "adc", "uart"] as const).map((labId) => {
            const lab = labStats[labId];
            return (
              <div
                key={labId}
                className="rounded border border-[var(--border-default)] bg-[var(--surface-panel)] p-4 space-y-3 hover:border-primary/30 transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.15)] group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono font-bold text-primary tracking-wider uppercase block mb-0.5">
                      {lab.difficulty}
                    </span>
                    <h3 className="text-sm font-bold text-foreground leading-snug">
                      {lab.title}
                    </h3>
                  </div>

                  <span
                    className={cn(
                      "text-[9px] font-mono px-1.5 py-0.5 rounded border font-bold shrink-0 uppercase tracking-wider",
                      lab.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : lab.status === "IN_PROGRESS"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        : "bg-slate-900/50 text-slate-400 border-slate-700"
                    )}
                  >
                    {lab.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-[10px] text-muted-foreground font-sans leading-relaxed">
                  {lab.description}
                </p>

                <div className="space-y-1 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-muted-foreground">
                      Challenges: <strong className="text-foreground">{lab.completedCount} / {lab.totalChallenges}</strong>
                    </span>
                    <span className="text-primary font-bold">{lab.progressPercent}%</span>
                  </div>
                  <ProgressBar value={lab.progressPercent} showPercentage={false} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono text-muted-foreground font-bold uppercase tracking-wider">
                    Score: <span className="text-foreground">{lab.totalScore} pts</span>
                  </span>
                  <Link href={`/labs/${labId}`}>
                    <Button variant="outline" size="xs" className="h-6 text-[10px] font-mono font-bold control-elevated group-hover:border-primary/30">
                      Open Lab
                      <ArrowRight className="ml-1 h-2.5 w-2.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom: Activity & Getting Started */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-7">
          <Panel title="Recent Lab Activity" icon={Activity}>
            {recentActivity.length === 0 ? (
              <div className="py-6 text-center text-muted-foreground text-[10px] font-mono space-y-1.5">
                <Clock className="h-6 w-6 text-muted-foreground/30 mx-auto" />
                <p className="font-bold text-foreground text-xs">No recent activity</p>
                <p className="max-w-xs mx-auto">
                  Launch a lab and complete a challenge to see your activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 font-mono text-xs">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-sunken)] flex items-center justify-between gap-2.5"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {item.status === "PASSED" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Award className="h-3.5 w-3.5 text-red-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-foreground font-bold block truncate text-[11px]">
                          {item.challengeTitle}
                        </span>
                        <span className="text-[9px] text-muted-foreground">
                          {item.labId.toUpperCase()} · {new Date(item.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={cn(
                          "font-bold text-[10px] block",
                          item.status === "PASSED" ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {item.status}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{item.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Getting Started Guide */}
        <div className="lg:col-span-5">
          <Panel title="Getting Started Guide" icon={BookOpen}>
            <div className="space-y-2 font-mono text-[10px]">
              {[
                { step: "01", title: "Select a Laboratory", desc: "Begin with GPIO — learn digital I/O, pin modes, and pull-up resistors." },
                { step: "02", title: "Configure Hardware", desc: "Interact with oscilloscope, dial, and control panels in real-time." },
                { step: "03", title: "Submit Challenges", desc: "Validation inspects actual simulator state (not UI clicks) to award points." },
              ].map((item) => (
                <div key={item.step} className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-panel)] space-y-0.5">
                  <span className="text-primary font-bold">
                    <span className="text-muted-foreground/50 mr-1">{item.step}</span>
                    {item.title}
                  </span>
                  <p className="text-muted-foreground text-[9px] font-sans">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
