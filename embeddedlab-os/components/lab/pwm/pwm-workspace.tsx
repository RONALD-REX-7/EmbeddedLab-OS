/**
 * EmbeddedLab OS — components/lab/pwm/pwm-workspace.tsx
 *
 * Full PWM Laboratory Workspace.
 * Integrates:
 * - 3-column engineering layout
 * - Waveform Visualizer & PWM LED Dimmer
 * - State management via usePWMState() and useEventLog()
 * - Challenge system with actual state validators
 */
"use client";

import { ArrowLeft, BarChart2, FlaskConical, RotateCcw } from "lucide-react";
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
  // Engine state & actions
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
    <div className="p-5 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-0.5">
            <FlaskConical className="h-4 w-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider">
              Interactive Lab Workspace
            </span>
          </div>
          <h1 className="text-xl font-bold text-foreground">
            PWM — Pulse-Width Modulation
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status="running" />
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset MCU State
          </Button>
          <Link href="/labs" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            All Labs
          </Link>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Instructions & Challenges & AI Assistant (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <LabEducationCard labId="pwm" currentState={mcuState} />
          <ChallengePanel labId="pwm" />
          <AIAssistantPanel labId="pwm" state={mcuState} />
        </div>

        {/* Center Column: Waveform Oscilloscope & Load (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Panel title="Real-Time PWM Waveform Oscilloscope" icon={BarChart2} variant="sunken">
            <div className="space-y-4">
              <WaveformVisualizer channel={channel} derived={activeDerived} />
              <PWMLEDDimmer channel={channel} />
              <div className="grid grid-cols-3 gap-2.5">
                <MetricCard label="Period (T)" value={activeDerived.periodMs.toFixed(2)} unit="ms" />
                <MetricCard label="High Time (t_high)" value={activeDerived.highTimeMs.toFixed(2)} unit="ms" />
                <MetricCard label="Low Time (t_low)" value={activeDerived.lowTimeMs.toFixed(2)} unit="ms" />
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: PWM Inspector Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <InspectorPanel
            title="PWM Channel Inspector"
            subtitle={`Channel: ${channel.label}`}
          >
            <InspectorRow label="Timer Channel" value={channel.label} />
            <InspectorRow label="Frequency (f)" value={`${channel.frequencyHz} Hz`} />
            <InspectorRow label="Duty Cycle (D)" value={`${channel.dutyCyclePercent}%`} />
            <InspectorRow label="Output State" value={channel.enabled ? "ENABLED" : "DISABLED"} />
            <InspectorRow label="Calculated Period" value={`${((1 / channel.frequencyHz) * 1000).toFixed(2)} ms`} />

            {/* Frequency Control Slider */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-muted-foreground">Frequency (Hz)</span>
                <span className="font-bold text-primary">{channel.frequencyHz} Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={channel.frequencyHz}
                onChange={(e) => setFrequency(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-muted rounded"
              />
            </div>

            {/* Duty Cycle Control Slider */}
            <div className="pt-3 border-t border-border space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-muted-foreground">Duty Cycle (%)</span>
                <span className="font-bold text-primary">{channel.dutyCyclePercent}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={channel.dutyCyclePercent}
                onChange={(e) => setDutyCycle(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer h-2 bg-muted rounded"
              />
            </div>

            {/* Enable/Disable Toggle */}
            <div className="pt-3 border-t border-border">
              <Button
                variant={channel.enabled ? "default" : "outline"}
                size="sm"
                onClick={() => setEnabled(!channel.enabled)}
                className="w-full font-mono text-xs"
              >
                {channel.enabled ? "Disable PWM Output" : "Enable PWM Output"}
              </Button>
            </div>
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Row: Event Log */}
      <EventLogView events={events} onClear={() => resetStore("pwm")} maxHeight="h-44" />
    </div>
  );
}
