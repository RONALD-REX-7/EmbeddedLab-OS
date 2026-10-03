/**
 * EmbeddedLab OS — components/lab/gpio/gpio-workspace.tsx
 * High-Density GPIO Laboratory Workspace with 3-Column Engineering Layout.
 */
"use client";

import { useState } from "react";
import { ArrowLeft, Cpu, RotateCcw, Zap } from "lucide-react";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { Panel } from "@/components/shared/panel";
import { InspectorPanel, InspectorRow } from "@/components/shared/inspector-panel";
import { EventLogView } from "@/components/shared/event-log-view";
import { ChallengePanel } from "@/components/shared/challenge-panel";
import { PinGrid } from "@/components/lab/gpio/pin-grid";
import { VirtualLED } from "@/components/lab/gpio/virtual-led";
import { VirtualButton } from "@/components/lab/gpio/virtual-button";

import { useGPIOState } from "@/hooks/use-gpio-state";
import { useEventLog } from "@/hooks/use-event-log";
import { useSimulatorStore } from "@/store/simulator-store";

import type { PinMode } from "@/types/simulator";

import { LabEducationCard } from "@/components/shared/lab-education-card";
import { AIAssistantPanel } from "@/components/shared/ai-assistant-panel";

export function GPIOWorkspace() {
  const [selectedPinId, setSelectedPinId] = useState<number>(5); // Default PA5 (LED)

  // Engine state & actions
  const { pins, setPinMode, setPinLevel, setInputLevel, togglePin } = useGPIOState();
  const { events } = useEventLog("gpio");
  const resetStore = useSimulatorStore((state) => state.reset);
  const mcuState = useSimulatorStore((state) => state.mcuState);

  const selectedPin = pins[selectedPinId] || pins[0];

  const handleReset = () => {
    resetStore("gpio");
  };

  const handleButtonPressStateChange = (pressed: boolean) => {
    const pa0 = pins[0];
    if (!pa0) return;
    if (pa0.mode === "INPUT_PULLUP") {
      setInputLevel(0, pressed ? "LOW" : "HIGH");
    } else if (pa0.mode === "INPUT_PULLDOWN") {
      setInputLevel(0, pressed ? "HIGH" : "LOW");
    } else {
      setInputLevel(0, pressed ? "HIGH" : "LOW");
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-default">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 font-mono text-[10px] uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span>DIGITAL LOGIC & I/O WORKBENCH</span>
            <span>·</span>
            <span className="text-primary font-bold">16 ACTIVE CHANNELS</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-sans tracking-tight">
            GPIO — General Purpose Input / Output
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
        {/* Left Column: Worksheet & Theory & AI Ribbon (4 cols) */}
        <div className="lg:col-span-4 space-y-3.5">
          <LabEducationCard labId="gpio" currentState={mcuState} />
          <ChallengePanel labId="gpio" />
          <AIAssistantPanel labId="gpio" state={mcuState} />
        </div>

        {/* Center Column: Microcontroller Hardware Visualization (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <Panel
            title="Silicon Microcontroller Hardware"
            subtitle="Virtual STM32 Port A & Port B Matrix"
            icon={Cpu}
            variant="instrument"
            telemetryTag="3.3V CMOS"
          >
            <div className="space-y-4">
              <VirtualLED pin={pins[5]} />
              <VirtualButton pin={pins[0]} onPressStateChange={handleButtonPressStateChange} />
              <PinGrid
                pins={pins}
                selectedPinId={selectedPinId}
                onSelectPin={setSelectedPinId}
                onModeChange={setPinMode}
                onToggleLevel={(id) => togglePin(id)}
              />
            </div>
          </Panel>
        </div>

        {/* Right Column: Pin Inspector & Register Configuration (3 cols) */}
        <div className="lg:col-span-3 space-y-3.5">
          <InspectorPanel
            title="GPIO Pin Inspector"
            subtitle={selectedPin ? `Selected Port: ${selectedPin.label}` : "Select a pin"}
          >
            {selectedPin && (
              <>
                <InspectorRow label="Port Index" value={selectedPin.label} />
                <InspectorRow label="Register ID" value={`MODER[${selectedPin.id}]`} />
                <InspectorRow label="Pin Mode" value={selectedPin.mode} />
                <InspectorRow label="Logic State" value={selectedPin.level} />
                <InspectorRow label="Terminal Voltage" value={selectedPin.level === "HIGH" ? "3.30 V" : "0.00 V"} />

                {/* Mode Select Segment */}
                <div className="pt-3 border-t border-border-subtle space-y-1.5">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block font-semibold">
                    Pin Configuration
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {(["INPUT", "OUTPUT", "INPUT_PULLUP", "INPUT_PULLDOWN"] as PinMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPinMode(selectedPin.id, mode)}
                        className={`px-1.5 py-1 text-[9px] font-mono rounded border transition-colors cursor-pointer truncate ${
                          selectedPin.mode === mode
                            ? "bg-primary text-primary-foreground font-bold border-primary shadow-sm"
                            : "bg-surface-sunken border-border-subtle text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {mode.replace("INPUT_", "")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Output Drive Level Controller */}
                {selectedPin.mode === "OUTPUT" && (
                  <div className="pt-3 border-t border-border-subtle space-y-1.5">
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block font-semibold">
                      ODR Level Register
                    </span>
                    <div className="flex gap-1.5">
                      <Button
                        size="xs"
                        variant={selectedPin.level === "LOW" ? "default" : "outline"}
                        onClick={() => setPinLevel(selectedPin.id, "LOW")}
                        className="flex-1 font-mono text-[10px] h-7"
                      >
                        LOW (0V)
                      </Button>
                      <Button
                        size="xs"
                        variant={selectedPin.level === "HIGH" ? "default" : "outline"}
                        onClick={() => setPinLevel(selectedPin.id, "HIGH")}
                        className="flex-1 font-mono text-[10px] h-7"
                      >
                        HIGH (3.3V)
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Diagnostic Console */}
      <EventLogView events={events} onClear={() => resetStore("gpio")} maxHeight="h-36" />
    </div>
  );
}
