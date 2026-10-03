/**
 * EmbeddedLab OS — components/lab/pwm/pwm-workspace.tsx
 * High-Density PWM Laboratory Workspace with Engineering Layout.
 */
"use client";

import { Activity, ArrowLeft, RotateCcw } from "lucide-react";
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

export function PWMWorkspace() {
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
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
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
          <Button variant="outline" size="xs" onClick={handleReset} className="h-7 text-xs font-mono control-elevated">
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset MCU
          </Button>
          <Link href="/labs" className={buttonVariants({ variant: "outline", size: "sm", className: "h-7 text-xs font-mono" })}>
            <ArrowLeft className="mr-1 h-3 w-3" />
            Directory
          </Link>
        </div>
      </div>

      {/* 3-Column Engineering Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-4 space-y-3.5">
          <LabEducationCard labId="pwm" currentState={mcuState} />
          <ChallengePanel labId="pwm" />
          <AIAssistantPanel labId="pwm" state={mcuState} />
        </div>

        {/* Center Column: Oscilloscope & Measurements */}
        <div className="lg:col-span-5 space-y-3.5">
          <Panel
            title="PWM Waveform Analysis"
            subtitle="Real-Time Oscilloscope & Load Visualization"
            icon={Activity}
            variant="instrument"
            telemetryTag="TIM3 CH1"
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

        {/* Right Column: PWM Inspector */}
        <div className="lg:col-span-3 space-y-3.5">
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
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
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
                className="w-full accent-primary cursor-pointer h-1.5 bg-[var(--surface-sunken)] rounded-sm border border-[var(--border-subtle)]"
              />
              <div className="flex justify-between text-[8px] font-mono text-muted-foreground/50">
                <span>100 Hz</span>
                <span>10 kHz</span>
              </div>
            </div>

            {/* Duty Cycle Control */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
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
                className="w-full accent-primary cursor-pointer h-1.5 bg-[var(--surface-sunken)] rounded-sm border border-[var(--border-subtle)]"
              />
              <div className="flex justify-between text-[8px] font-mono text-muted-foreground/50">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <div className="pt-3 border-t border-[var(--border-subtle)]">
              <Button
                variant={channel.enabled ? "default" : "outline"}
                size="xs"
                onClick={() => setEnabled(!channel.enabled)}
                className="w-full font-mono text-[10px] h-7 control-elevated font-bold"
              >
                {channel.enabled ? "● Disable PWM Output" : "○ Enable PWM Output"}
              </Button>
            </div>
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Diagnostic Console */}
      <EventLogView events={events} onClear={() => resetStore("pwm")} maxHeight="h-36" />
    </div>
  );
}
