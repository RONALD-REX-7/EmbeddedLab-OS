/**
 * EmbeddedLab OS — components/shared/lab-education-card.tsx
 * Structured Educational Content Card with tabbed navigation.
 */
"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, Cpu, Layers, ListChecks } from "lucide-react";

import { Panel } from "@/components/shared/panel";
import { LAB_EDUCATIONAL_CONTENT } from "@/lib/education/content";
import type { LabId, MicrocontrollerState } from "@/types/simulator";
import { cn } from "@/lib/utils";

interface LabEducationCardProps {
  labId: LabId;
  currentState?: MicrocontrollerState;
  className?: string;
}

export function LabEducationCard({
  labId,
  currentState,
  className,
}: LabEducationCardProps) {
  const [activeTab, setActiveTab] = useState<"objectives" | "theory" | "dynamic">("objectives");
  const content = LAB_EDUCATIONAL_CONTENT[labId];

  if (!content) return null;

  const tabClass = (tab: string) =>
    cn(
      "px-2 py-1 rounded text-[9px] transition-colors flex items-center gap-1 font-bold uppercase tracking-wider select-none",
      activeTab === tab
        ? "bg-primary/10 text-primary border border-primary/20"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <Panel
      title="Learning Guide"
      icon={BookOpen}
      className={cn("space-y-3 font-mono text-xs", className)}
    >
      {/* Tab Navigation */}
      <div
        role="tablist"
        aria-label="Laboratory guide sections"
        className="flex items-center gap-0.5 border-b border-[var(--border-subtle)] pb-2 text-xs"
      >
        <button
          type="button"
          role="tab"
          id="tab-objectives"
          aria-selected={activeTab === "objectives"}
          aria-controls="panel-objectives"
          onClick={() => setActiveTab("objectives")}
          className={tabClass("objectives")}
        >
          <ListChecks className="h-3 w-3" aria-hidden="true" />
          Objectives
        </button>
        <button
          type="button"
          role="tab"
          id="tab-theory"
          aria-selected={activeTab === "theory"}
          aria-controls="panel-theory"
          onClick={() => setActiveTab("theory")}
          className={tabClass("theory")}
        >
          <Layers className="h-3 w-3" aria-hidden="true" />
          Theory
        </button>
        <button
          type="button"
          role="tab"
          id="tab-dynamic"
          aria-selected={activeTab === "dynamic"}
          aria-controls="panel-dynamic"
          onClick={() => setActiveTab("dynamic")}
          className={tabClass("dynamic")}
        >
          <Cpu className="h-3 w-3" aria-hidden="true" />
          Live State
        </button>
      </div>

      {/* Tab 1: Objectives */}
      {activeTab === "objectives" && (
        <div
          role="tabpanel"
          id="panel-objectives"
          aria-labelledby="tab-objectives"
          className="space-y-3"
        >
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
              Learning Objectives
            </span>
            <div className="space-y-1">
              {content.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[10px] text-foreground font-sans">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1.5 border-t border-[var(--border-subtle)] pt-2.5">
            <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
              Experiment Procedure
            </span>
            <ol className="space-y-1 list-decimal list-inside text-[10px] text-muted-foreground font-sans">
              {content.experimentSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <strong className="text-foreground font-mono text-[10px]">{step}</strong>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-2.5 rounded border border-border-default bg-surface-panel text-[10px] font-sans text-foreground shadow-sm">
            <strong className="font-mono text-primary uppercase block text-[9px] mb-0.5">Key Takeaway</strong>
            {content.keyTakeaway}
          </div>
        </div>
      )}

      {/* Tab 2: Theory */}
      {activeTab === "theory" && (
        <div
          role="tabpanel"
          id="panel-theory"
          aria-labelledby="tab-theory"
          className="space-y-2.5 font-sans text-[10px]"
        >
          {content.sections.map((sec, i) => (
            <div key={i} className="space-y-1 p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-panel)]">
              <h4 className="font-mono font-bold text-primary text-[10px] uppercase tracking-wider">
                {sec.title}
              </h4>
              <div className="space-y-0.5 text-muted-foreground leading-relaxed">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx}>• {p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Active Simulator State */}
      {activeTab === "dynamic" && (
        <div
          role="tabpanel"
          id="panel-dynamic"
          aria-labelledby="tab-dynamic"
          className="space-y-2.5 font-mono text-[10px]"
        >
          <div className="p-2.5 rounded border border-[var(--border-subtle)] bg-[var(--surface-sunken)] space-y-2 shadow-[inset_0_1px_3px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between text-foreground">
              <span className="font-bold uppercase tracking-wider text-[9px]">Active Hardware Parameters</span>
              <span className="text-[8px] text-emerald-400 font-bold animate-pulse">● LIVE</span>
            </div>

            {labId === "gpio" && (
              <div className="space-y-0.5 text-muted-foreground text-[10px]">
                <p>
                  Pins Configured:{" "}
                  <strong className="text-foreground">
                    {currentState?.gpio.pins.filter((p) => p.mode !== "INPUT").length || 0} modified
                  </strong>
                </p>
                <p>
                  System Clock:{" "}
                  <strong className="text-foreground">
                    {((currentState?.clock.frequencyHz || 16000000) / 1000000).toFixed(1)} MHz
                  </strong>
                </p>
              </div>
            )}

            {labId === "pwm" && (
              <div className="space-y-0.5 text-muted-foreground text-[10px]">
                {currentState?.pwm.channels[0] && (
                  <>
                    <p>f = <strong className="text-foreground">{currentState.pwm.channels[0].frequencyHz.toLocaleString()} Hz</strong></p>
                    <p>T = <strong className="text-foreground">{((1 / currentState.pwm.channels[0].frequencyHz) * 1000).toFixed(2)} ms</strong></p>
                    <p>D = <strong className="text-foreground">{currentState.pwm.channels[0].dutyCyclePercent}%</strong></p>
                    <p>V_avg = <strong className="text-foreground">{(3.3 * (currentState.pwm.channels[0].dutyCyclePercent / 100)).toFixed(2)} V</strong></p>
                  </>
                )}
              </div>
            )}

            {labId === "adc" && (
              <div className="space-y-0.5 text-muted-foreground text-[10px]">
                {currentState?.adc.channels[0] && (
                  <>
                    <p>Vin = <strong className="text-foreground">{currentState.adc.channels[0].inputVoltage.toFixed(2)} V</strong></p>
                    <p>Vref = <strong className="text-foreground">{currentState.adc.channels[0].referenceVoltage.toFixed(2)} V</strong></p>
                    <p>N = <strong className="text-foreground">{currentState.adc.channels[0].resolution}-bit</strong></p>
                    <p>
                      ADC_raw ={" "}
                      <strong className="text-foreground font-bold">
                        {Math.round(
                          (Math.min(
                            currentState.adc.channels[0].inputVoltage,
                            currentState.adc.channels[0].referenceVoltage
                          ) /
                            currentState.adc.channels[0].referenceVoltage) *
                            (Math.pow(2, currentState.adc.channels[0].resolution) - 1)
                        )}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            )}

            {labId === "uart" && (
              <div className="space-y-0.5 text-muted-foreground text-[10px]">
                {currentState?.uart && (
                  <>
                    <p>TX Baud: <strong className="text-foreground">{currentState.uart.transmitter.baudRate}</strong></p>
                    <p>RX Baud: <strong className="text-foreground">{currentState.uart.receiver.baudRate}</strong></p>
                    <p>
                      Status:{" "}
                      <strong
                        className={cn(
                          "font-bold",
                          currentState.uart.compatible ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {currentState.uart.compatible ? "MATCHED" : "MISMATCH"}
                      </strong>
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Panel>
  );
}
