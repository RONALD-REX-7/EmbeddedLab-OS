/**
 * EmbeddedLab OS — components/lab/adc/adc-workspace.tsx
 *
 * Full ADC Laboratory Workspace.
 * Integrates: ADC_raw = round((Vin / Vref) * (2^N - 1))
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
import { AnalogGauge } from "@/components/lab/adc/analog-gauge";
import { Potentiometer } from "@/components/lab/adc/potentiometer";
import { ADCFormulaCard } from "@/components/lab/adc/adc-formula-card";

import { useADCState } from "@/hooks/use-adc-state";
import { useEventLog } from "@/hooks/use-event-log";
import { useChallenge } from "@/hooks/use-challenge";
import { useSimulatorStore } from "@/store/simulator-store";

import { cn } from "@/lib/utils";
import type { ADCResolution } from "@/types/simulator";

export function ADCWorkspace() {
  // Engine state & actions
  const { channel, derived, setInputVoltage, setResolution, setReferenceVoltage } = useADCState(0);
  const { events } = useEventLog("adc");
  const resetStore = useSimulatorStore((state) => state.reset);
  const { resetChallenge } = useChallenge();
  const mcuState = useSimulatorStore((state) => state.mcuState);

  const handleReset = () => {
    resetStore("adc");
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
            ADC — Analog-to-Digital Converter
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
          <LabEducationCard labId="adc" currentState={mcuState} />
          <ChallengePanel labId="adc" />
          <AIAssistantPanel labId="adc" state={mcuState} />
        </div>

        {/* Center Column: Voltmeter Gauge & Formula breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Panel title="Analog Signal Conversion & Voltmeter" icon={BarChart2} variant="sunken">
            <div className="space-y-4">
              {/* Virtual Potentiometer Control */}
              <Potentiometer
                voltage={channel.inputVoltage}
                maxVoltage={channel.referenceVoltage}
                onChange={setInputVoltage}
              />

              {/* Analog Gauge Visualizer */}
              <AnalogGauge
                voltage={channel.inputVoltage}
                maxVoltage={channel.referenceVoltage}
              />

              {/* Step-by-step Educational Formula Breakdown */}
              {derived && <ADCFormulaCard channel={channel} derived={derived} />}

              {/* Live Metric Readouts */}
              {derived && (
                <div className="grid grid-cols-3 gap-2.5">
                  <MetricCard label="Digital Output" value={derived.digitalValue} unit="counts" signalState="high" />
                  <MetricCard label="Max Count" value={derived.maxDigitalValue} unit="counts" />
                  <MetricCard label="LSB Resolution" value={derived.lsbMillivolts.toFixed(2)} unit="mV" />
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Right Column: Inspector Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <InspectorPanel
            title="ADC Configuration Inspector"
            subtitle={`Channel: ${channel.label}`}
          >
            <InspectorRow label="Active Channel" value={channel.label} />
            <InspectorRow label="Input Voltage Vin" value={channel.inputVoltage.toFixed(2)} unit="V" />
            <InspectorRow label="Ref Voltage Vref" value={channel.referenceVoltage.toFixed(1)} unit="V" />
            <InspectorRow label="Resolution N" value={`${channel.resolution}-bit`} />
            <InspectorRow label="Max Code (2^N - 1)" value={derived?.maxDigitalValue || 4095} />

            {/* Reference Voltage Selector */}
            <div className="pt-4 border-t border-border space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                Reference Voltage (Vref)
              </span>
              <div className="flex gap-1.5">
                {[1.8, 3.3, 5.0].map((vref) => (
                  <button
                    key={vref}
                    onClick={() => setReferenceVoltage(vref)}
                    className={cn(
                      "flex-1 text-[10px] font-mono py-1 rounded border transition-colors font-medium",
                      Math.abs(channel.referenceVoltage - vref) < 0.05
                        ? "bg-primary text-primary-foreground font-bold border-primary"
                        : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {vref.toFixed(1)}V
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="pt-3 border-t border-border space-y-2">
              <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                ADC Resolution (N-bit)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {([8, 10, 12, 16] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res as ADCResolution)}
                    className={cn(
                      "px-2 py-1 text-[10px] font-mono rounded border transition-colors text-center font-medium",
                      channel.resolution === res
                        ? "bg-primary text-primary-foreground font-bold border-primary"
                        : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {res}-bit ({Math.pow(2, res) - 1})
                  </button>
                ))}
              </div>
            </div>
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Row: Event Log */}
      <EventLogView events={events} onClear={() => resetStore("adc")} maxHeight="h-44" />
    </div>
  );
}
