/**
 * EmbeddedLab OS — components/lab/adc/adc-workspace.tsx
 * Full ADC Laboratory Workspace — Engineering Layout.
 * ADC_raw = round((Vin / Vref) * (2^N - 1))
 */
"use client";

import { ArrowLeft, BarChart2, RotateCcw } from "lucide-react";
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
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 font-mono text-[10px] uppercase tracking-wider">
            <BarChart2 className="h-3.5 w-3.5 text-primary" />
            <span>SIGNAL CONVERSION & MEASUREMENT WORKBENCH</span>
            <span>·</span>
            <span className="text-primary font-bold">12-BIT SAR</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-sans tracking-tight">
            ADC — Analog-to-Digital Converter
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
          <LabEducationCard labId="adc" currentState={mcuState} />
          <ChallengePanel labId="adc" />
          <AIAssistantPanel labId="adc" state={mcuState} />
        </div>

        {/* Center Column: Voltmeter & Conversion */}
        <div className="lg:col-span-5 space-y-3.5">
          <Panel
            title="Analog Signal Conversion"
            subtitle="Voltmeter & Digital Conversion Pipeline"
            icon={BarChart2}
            variant="instrument"
            telemetryTag="ADC1 CH0"
          >
            <div className="space-y-3">
              <Potentiometer
                voltage={channel.inputVoltage}
                maxVoltage={channel.referenceVoltage}
                onChange={setInputVoltage}
              />
              <AnalogGauge
                voltage={channel.inputVoltage}
                maxVoltage={channel.referenceVoltage}
              />
              {derived && <ADCFormulaCard channel={channel} derived={derived} />}
              {derived && (
                <div className="grid grid-cols-3 gap-2">
                  <MetricCard label="Digital Output" value={derived.digitalValue} unit="counts" signalState="high" />
                  <MetricCard label="Max Count" value={derived.maxDigitalValue} unit="counts" />
                  <MetricCard label="LSB Size" value={derived.lsbMillivolts.toFixed(2)} unit="mV" />
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* Right Column: Inspector */}
        <div className="lg:col-span-3 space-y-3.5">
          <InspectorPanel
            title="ADC Configuration"
            subtitle={`Channel: ${channel.label}`}
          >
            <InspectorRow label="Channel" value={channel.label} />
            <InspectorRow label="Vin" value={channel.inputVoltage.toFixed(2)} unit="V" />
            <InspectorRow label="Vref" value={channel.referenceVoltage.toFixed(1)} unit="V" />
            <InspectorRow label="Resolution (N)" value={`${channel.resolution}-bit`} />
            <InspectorRow label="Max Code" value={derived?.maxDigitalValue || 4095} />

            {/* Reference Voltage Selector */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block font-bold">
                Reference Voltage (Vref)
              </span>
              <div className="flex gap-1">
                {[1.8, 3.3, 5.0].map((vref) => (
                  <button
                    key={vref}
                    onClick={() => setReferenceVoltage(vref)}
                    className={cn(
                      "flex-1 text-[9px] font-mono py-1 rounded border transition-colors font-bold control-elevated",
                      Math.abs(channel.referenceVoltage - vref) < 0.05
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-[var(--surface-panel)] border-[var(--border-subtle)] text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {vref.toFixed(1)}V
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="pt-3 border-t border-[var(--border-subtle)] space-y-1.5">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block font-bold">
                ADC Resolution (N-bit)
              </span>
              <div className="grid grid-cols-2 gap-1">
                {([8, 10, 12, 16] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res as ADCResolution)}
                    className={cn(
                      "px-1.5 py-1 text-[9px] font-mono rounded border transition-colors text-center font-bold control-elevated",
                      channel.resolution === res
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-[var(--surface-panel)] border-[var(--border-subtle)] text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {res}-bit
                  </button>
                ))}
              </div>
            </div>
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Diagnostic Console */}
      <EventLogView events={events} onClear={() => resetStore("adc")} maxHeight="h-36" />
    </div>
  );
}
