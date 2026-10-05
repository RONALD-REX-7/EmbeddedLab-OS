/**
 * EmbeddedLab OS — components/lab/pwm/pwm-workspace.tsx
 * Precision PWM Laboratory Workspace with panoramic desktop layout & mobile 1-tap view switcher.
 */
"use client";

import { useState } from "react";
import { Activity, ArrowLeft, BookOpen, Cpu, ListFilter, RotateCcw, Terminal } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Panel } from "@/components/shared/panel";
import { InspectorPanel, InspectorRow } from "@/components/shared/inspector-panel";
import { MetricCard } from "@/components/shared/metric-card";
import { EventLogView } from "@/components/shared/event-log-view";
import { ChallengePanel } from "@/components/shared/challenge-panel";
import { LabEducationCard } from "@/components/shared/lab-education-card";
import { AIAssistantPanel } from "@/components/shared/ai-assistant-panel";
import { WaveformVisualizer } from "@/components/lab/pwm/waveform-visualizer";
import { PWMLEDDimmer } from "@/components/lab/pwm/pwm-led-dimmer";

import { usePWMState } from "@/hooks/use-pwm-state";
import { useEventLog } from "@/hooks/use-event-log";
import { useChallenge } from "@/hooks/use-challenge";
import { useSimulatorStore } from "@/store/simulator-store";
import { cn } from "@/lib/utils";

type MobileViewTab = "workbench" | "worksheet" | "inspector" | "telemetry";

export function PWMWorkspace() {
  const [mobileTab, setMobileTab] = useState<MobileViewTab>("workbench");
  const { channel, derived, setFrequency, setDutyCycle, setEnabled } = usePWMState(0);
  const { events } = useEventLog("pwm");
  const resetStore = useSimulatorStore((state) => state.reset);
  const mcuState = useSimulatorStore((state) => state.mcuState);
  const { resetChallenge } = useChallenge();

  const activeDerived = derived || {
    periodMs: (1 / channel.frequencyHz) * 1000,
    highTimeMs: ((1 / channel.frequencyHz) * 1000) * (channel.dutyCyclePercent / 100),
    lowTimeMs: ((1 / channel.frequencyHz) * 1000) * (1 - channel.dutyCyclePercent / 100),
  };

  const handleReset = () => {
    resetStore("pwm");
    resetChallenge();
  };

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 font-mono text-[10px] uppercase tracking-wider">
            <Activity className="h-3.5 w-3.5 text-primary" />
            <span>SIGNAL GENERATION & ANALYSIS WORKBENCH</span>
            <span>·</span>
            <span className="text-primary font-bold">4-CHANNEL TIMER</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-sans tracking-tight">
            PWM — Pulse-Width Modulation
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="running" />
          <Button
            variant="outline"
            size="xs"
            onClick={handleReset}
            className="h-7 text-xs font-mono bg-surface-panel hover:bg-surface-elevated"
            aria-label="Reset MCU PWM Registers"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset MCU
          </Button>
          <Link
            href="/labs"
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "h-7 text-xs font-mono bg-surface-panel hover:bg-surface-elevated",
            })}
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Directory
          </Link>
        </div>
      </div>

      {/* Mobile 1-Tap Segmented View Switcher (< lg) */}
      <div className="lg:hidden flex items-center p-1 rounded-lg bg-surface-subtle border border-border/80 font-mono text-xs">
        <button
          type="button"
          onClick={() => setMobileTab("workbench")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors font-medium",
            mobileTab === "workbench"
              ? "bg-surface-panel text-primary font-bold shadow-2xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Cpu className="h-3.5 w-3.5" />
          <span>Workbench</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("worksheet")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors font-medium",
            mobileTab === "worksheet"
              ? "bg-surface-panel text-primary font-bold shadow-2xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Worksheet</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("inspector")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors font-medium",
            mobileTab === "inspector"
              ? "bg-surface-panel text-primary font-bold shadow-2xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ListFilter className="h-3.5 w-3.5" />
          <span>Registers</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("telemetry")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md transition-colors font-medium",
            mobileTab === "telemetry"
              ? "bg-surface-panel text-primary font-bold shadow-2xs border border-border/70"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
          <span>Log</span>
        </button>
      </div>

      {/* Panoramic Engineering Grid (Desktop: 3 cols, Mobile: filtered by mobileTab) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Worksheet, Challenges & AI (4 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-4 space-y-3.5",
            mobileTab !== "worksheet" && "hidden lg:block"
          )}
        >
          <LabEducationCard labId="pwm" currentState={mcuState} />
          <ChallengePanel labId="pwm" />
          <AIAssistantPanel labId="pwm" state={mcuState} />
        </div>

        {/* Center Column: Oscilloscope & Measurements (5 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-5 space-y-3.5",
            mobileTab !== "workbench" && "hidden lg:block"
          )}
        >
          <Panel
            title="PWM Waveform Analysis"
            subtitle="Real-Time Oscilloscope & Load Visualization"
            icon={Activity}
            variant="instrument"
            telemetryTag={channel.label}
          >
            <div className="space-y-3.5">
              <WaveformVisualizer channel={channel} derived={activeDerived} />
              <PWMLEDDimmer channel={channel} />
              <div className="grid grid-cols-3 gap-2">
                <MetricCard label="Period (T)" value={activeDerived.periodMs.toFixed(2)} unit="ms" signalState="pulse" />
                <MetricCard label="High Time" value={activeDerived.highTimeMs.toFixed(2)} unit="ms" signalState="high" />
                <MetricCard label="Low Time" value={activeDerived.lowTimeMs.toFixed(2)} unit="ms" />
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: PWM Inspector (3 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-3 space-y-3.5",
            mobileTab !== "inspector" && "hidden lg:block"
          )}
        >
          <InspectorPanel
            title="PWM Channel Inspector"
            subtitle={`Timer Channel: ${channel.label}`}
          >
            <InspectorRow label="Timer Channel" value={channel.label} />
            <InspectorRow label="Frequency (f)" value={`${channel.frequencyHz.toLocaleString()}`} unit="Hz" />
            <InspectorRow label="Duty Cycle (D)" value={`${channel.dutyCyclePercent}`} unit="%" />
            <InspectorRow label="Output" value={channel.enabled ? "ENABLED" : "DISABLED"} />
            <InspectorRow label="Period (T)" value={`${((1 / channel.frequencyHz) * 1000).toFixed(2)}`} unit="ms" />

            {/* Frequency Control */}
            <div className="pt-3 border-t border-border/80 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-muted-foreground uppercase tracking-wider font-semibold">Frequency</span>
                <span className="font-bold text-primary">{channel.frequencyHz.toLocaleString()} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={channel.frequencyHz}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-surface-sunken rounded-md border border-border/60"
                aria-label="Adjust frequency"
              />
              <div className="flex justify-between text-[8px] font-mono text-muted-foreground">
                <span>100 Hz</span>
                <span>10 kHz</span>
              </div>
            </div>

            {/* Duty Cycle Control */}
            <div className="pt-3 border-t border-border/80 space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-mono">
                <span className="text-muted-foreground uppercase tracking-wider font-semibold">Duty Cycle</span>
                <span className="font-bold text-primary">{channel.dutyCyclePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={channel.dutyCyclePercent}
                onChange={(e) => setDutyCycle(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-1.5 bg-surface-sunken rounded-md border border-border/60"
                aria-label="Adjust duty cycle"
              />
              <div className="flex justify-between text-[8px] font-mono text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="pt-3 border-t border-border/80">
              <Button
                variant={channel.enabled ? "default" : "outline"}
                size="xs"
                onClick={() => setEnabled(!channel.enabled)}
                className="w-full font-mono text-[10px] h-7 font-bold shadow-2xs"
              >
                {channel.enabled ? "● Disable PWM Output" : "○ Enable PWM Output"}
              </Button>
            </div>
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Diagnostic Console / Telemetry tab on mobile */}
      <div className={cn(mobileTab !== "telemetry" && "hidden lg:block")}>
        <EventLogView events={events} onClear={() => resetStore("pwm")} maxHeight="h-36" />
      </div>
    </div>
  );
}
