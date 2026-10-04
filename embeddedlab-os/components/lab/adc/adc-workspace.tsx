/**
 * EmbeddedLab OS — components/lab/adc/adc-workspace.tsx
 * Precision ADC Laboratory Workspace with panoramic desktop layout & mobile 1-tap view switcher.
 * ADC_raw = round((Vin / Vref) * (2^N - 1))
 */
"use client";

import { useState } from "react";
import { ArrowLeft, BarChart2, BookOpen, Cpu, ListFilter, RotateCcw, Terminal } from "lucide-react";
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

type MobileViewTab = "workbench" | "worksheet" | "inspector" | "telemetry";

export function ADCWorkspace() {
  const [mobileTab, setMobileTab] = useState<MobileViewTab>("workbench");
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
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
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
          <Button
            variant="outline"
            size="xs"
            onClick={handleReset}
            className="h-7 text-xs font-mono bg-surface-panel hover:bg-surface-elevated"
            aria-label="Reset MCU ADC Registers"
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
          <LabEducationCard labId="adc" currentState={mcuState} />
          <ChallengePanel labId="adc" />
          <AIAssistantPanel labId="adc" state={mcuState} />
        </div>

        {/* Center Column: Voltmeter & Conversion (5 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-5 space-y-3.5",
            mobileTab !== "workbench" && "hidden lg:block"
          )}
        >
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

        {/* Right Column: Inspector (3 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-3 space-y-3.5",
            mobileTab !== "inspector" && "hidden lg:block"
          )}
        >
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
            <div className="pt-3 border-t border-border/80 space-y-1.5">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block font-bold">
                Reference Voltage (Vref)
              </span>
              <div className="flex gap-1">
                {[1.8, 3.3, 5.0].map((vref) => (
                  <button
                    key={vref}
                    onClick={() => setReferenceVoltage(vref)}
                    className={cn(
                      "flex-1 text-[9px] font-mono py-1 rounded-md border transition-colors font-bold cursor-pointer",
                      Math.abs(channel.referenceVoltage - vref) < 0.05
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "bg-surface-subtle border-border/70 text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
                    )}
                  >
                    {vref.toFixed(1)}V
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="pt-3 border-t border-border/80 space-y-1.5">
              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider block font-bold">
                ADC Resolution (N-bit)
              </span>
              <div className="grid grid-cols-2 gap-1">
                {([8, 10, 12, 16] as const).map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res as ADCResolution)}
                    className={cn(
                      "px-1.5 py-1 text-[9px] font-mono rounded-md border transition-colors text-center font-bold cursor-pointer",
                      channel.resolution === res
                        ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                        : "bg-surface-subtle border-border/70 text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
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

      {/* Bottom Diagnostic Console / Telemetry tab on mobile */}
      <div className={cn(mobileTab !== "telemetry" && "hidden lg:block")}>
        <EventLogView events={events} onClear={() => resetStore("adc")} maxHeight="h-36" />
      </div>
    </div>
  );
}
