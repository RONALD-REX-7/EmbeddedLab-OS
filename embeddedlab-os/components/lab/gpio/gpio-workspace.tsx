/**
 * EmbeddedLab OS — components/lab/gpio/gpio-workspace.tsx
 *
 * Full GPIO Laboratory Workspace.
 * Integrates:
 * - 3-column engineering layout (Instructions | Microcontroller Hardware | Inspector)
 * - Simulation engine stores via useGPIOState() and useEventLog()
 * - Challenge system with actual state validators
 * - Bottom event log console
 */
"use client";

import { useState } from "react";
import { ArrowLeft, FlaskConical, RotateCcw } from "lucide-react";
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
            GPIO — General Purpose Input / Output
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
          <LabEducationCard labId="gpio" currentState={mcuState} />
          <ChallengePanel labId="gpio" />
          <AIAssistantPanel labId="gpio" state={mcuState} />
        </div>

        {/* Center Column: Microcontroller Visual Hardware (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Panel title="Interactive Microcontroller Hardware" variant="sunken">
            <div className="space-y-5">
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

        {/* Right Column: Pin Inspector Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <InspectorPanel
            title="GPIO Pin Inspector"
            subtitle={selectedPin ? `Pin ${selectedPin.label}` : "Select a pin"}
          >
            {selectedPin && (
              <>
                <InspectorRow label="Pin Name" value={selectedPin.label} />
                <InspectorRow label="Pin ID" value={`[${selectedPin.id}]`} />
                <InspectorRow label="Mode" value={selectedPin.mode} />
                <InspectorRow label="Logic State" value={selectedPin.level} />
                <InspectorRow label="Drive Voltage" value={selectedPin.level === "HIGH" ? "3.30 V" : "0.00 V"} />

                <div className="pt-4 border-t border-border space-y-2">
                  <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                    Mode Configuration
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(["INPUT", "OUTPUT", "ANALOG", "ALTERNATE"] as PinMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setPinMode(selectedPin.id, mode)}
                        className={`px-2 py-1 text-[10px] font-mono rounded border transition-colors ${
                          selectedPin.mode === mode
                            ? "bg-primary text-primary-foreground font-bold border-primary"
                            : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                {selectedPin.mode === "OUTPUT" && (
                  <div className="pt-3 border-t border-border space-y-2">
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider block">
                      Output Drive Level
                    </span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={selectedPin.level === "LOW" ? "default" : "outline"}
                        onClick={() => setPinLevel(selectedPin.id, "LOW")}
                        className="flex-1 font-mono text-xs"
                      >
                        LOW (0V)
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedPin.level === "HIGH" ? "default" : "outline"}
                        onClick={() => setPinLevel(selectedPin.id, "HIGH")}
                        className="flex-1 font-mono text-xs"
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

      {/* Bottom Row: Event Log */}
      <EventLogView events={events} onClear={() => resetStore("gpio")} maxHeight="h-44" />
    </div>
  );
}
