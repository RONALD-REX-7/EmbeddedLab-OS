/**
 * EmbeddedLab OS — components/shared/lab-education-card.tsx
 *
 * Reusable Structured Educational Content Card.
 * Displays undergraduate-level learning objectives, core principles, equations,
 * experiment procedures, and dynamic references to active simulator state.
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

  return (
    <Panel
      title="Structured Learning Guide"
      icon={BookOpen}
      className={cn("space-y-4 font-mono text-xs", className)}
    >
      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border pb-2 text-xs">
        <button
          onClick={() => setActiveTab("objectives")}
          className={cn(
            "px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 font-bold",
            activeTab === "objectives"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <ListChecks className="h-3.5 w-3.5" />
          Objectives & Steps
        </button>

        <button
          onClick={() => setActiveTab("theory")}
          className={cn(
            "px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 font-bold",
            activeTab === "theory"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          Core Concepts
        </button>

        <button
          onClick={() => setActiveTab("dynamic")}
          className={cn(
            "px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 font-bold",
            activeTab === "dynamic"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Cpu className="h-3.5 w-3.5" />
          Active State
        </button>
      </div>

      {/* Tab 1: Objectives & Experiment Steps */}
      {activeTab === "objectives" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
              Learning Objectives
            </span>
            <div className="space-y-1.5">
              {content.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground font-sans">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-border pt-3">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
              Experiment Procedure
            </span>
            <ol className="space-y-1.5 list-decimal list-inside text-xs text-muted-foreground font-sans">
              {content.experimentSteps.map((step, idx) => (
                <li key={idx} className="leading-relaxed">
                  <strong className="text-foreground font-mono">{step}</strong>
                </li>
              ))}
            </ol>
          </div>

          <div className="p-2.5 rounded border border-primary/20 bg-primary/5 text-[11px] font-sans text-foreground">
            <strong className="font-mono text-primary uppercase block mb-0.5">Key Takeaway</strong>
            {content.keyTakeaway}
          </div>
        </div>
      )}

      {/* Tab 2: Technical Theory & Sections */}
      {activeTab === "theory" && (
        <div className="space-y-3.5 font-sans text-xs">
          {content.sections.map((sec, i) => (
            <div key={i} className="space-y-1.5 p-3 rounded border border-border bg-card">
              <h4 className="font-mono font-bold text-foreground text-xs text-primary">
                {sec.title}
              </h4>
              <div className="space-y-1 text-muted-foreground leading-relaxed">
                {sec.content.map((p, pIdx) => (
                  <p key={pIdx}>• {p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Active Simulator State Reference */}
      {activeTab === "dynamic" && (
        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 rounded border border-border bg-muted/20 space-y-2">
            <div className="flex items-center justify-between text-foreground">
              <span className="font-bold uppercase">Active Hardware Parameters</span>
              <span className="text-[10px] text-emerald-400 font-bold">LIVE STATE</span>
            </div>

            {labId === "gpio" && (
              <div className="space-y-1 text-muted-foreground text-[11px]">
                <p>
                  • Active Pins Configured:{" "}
                  <strong className="text-foreground">
                    {currentState?.gpio.pins.filter((p) => p.mode !== "INPUT").length || 0} pins modified
                  </strong>
                </p>
                <p>
                  • System Clock Frequency:{" "}
                  <strong className="text-foreground">
                    {((currentState?.clock.frequencyHz || 16000000) / 1000000).toFixed(1)} MHz
                  </strong>
                </p>
              </div>
            )}

            {labId === "pwm" && (
              <div className="space-y-1 text-muted-foreground text-[11px]">
                {currentState?.pwm.channels[0] && (
                  <>
                    <p>
                      • Configured Frequency (f):{" "}
                      <strong className="text-foreground">
                        {currentState.pwm.channels[0].frequencyHz.toLocaleString()} Hz
                      </strong>
                    </p>
                    <p>
                      • Calculated Period (T = 1/f):{" "}
                      <strong className="text-foreground">
                        {((1 / currentState.pwm.channels[0].frequencyHz) * 1000).toFixed(2)} ms
                      </strong>
                    </p>
                    <p>
                      • Duty Cycle (D):{" "}
                      <strong className="text-foreground">
                        {currentState.pwm.channels[0].dutyCyclePercent}%
                      </strong>
                    </p>
                    <p>
                      • Effective V_avg:{" "}
                      <strong className="text-foreground">
                        {(3.3 * (currentState.pwm.channels[0].dutyCyclePercent / 100)).toFixed(2)} V
                      </strong>
                    </p>
                  </>
                )}
              </div>
            )}

            {labId === "adc" && (
              <div className="space-y-1 text-muted-foreground text-[11px]">
                {currentState?.adc.channels[0] && (
                  <>
                    <p>
                      • Input Voltage (Vin):{" "}
                      <strong className="text-foreground">
                        {currentState.adc.channels[0].inputVoltage.toFixed(2)} V
                      </strong>
                    </p>
                    <p>
                      • Reference Voltage (Vref):{" "}
                      <strong className="text-foreground">
                        {currentState.adc.channels[0].referenceVoltage.toFixed(2)} V
                      </strong>
                    </p>
                    <p>
                      • Resolution (N):{" "}
                      <strong className="text-foreground">
                        {currentState.adc.channels[0].resolution}-bit ({Math.pow(2, currentState.adc.channels[0].resolution)} levels)
                      </strong>
                    </p>
                    <p>
                      • Formula Outcome (ADC_raw):{" "}
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
              <div className="space-y-1 text-muted-foreground text-[11px]">
                {currentState?.uart && (
                  <>
                    <p>
                      • TX Baud Rate:{" "}
                      <strong className="text-foreground">{currentState.uart.transmitter.baudRate} baud</strong>
                    </p>
                    <p>
                      • RX Baud Rate:{" "}
                      <strong className="text-foreground">{currentState.uart.receiver.baudRate} baud</strong>
                    </p>
                    <p>
                      • Configuration Status:{" "}
                      <strong
                        className={cn(
                          "font-bold",
                          currentState.uart.compatible ? "text-emerald-400" : "text-red-400"
                        )}
                      >
                        {currentState.uart.compatible ? "MATCHED (Ready)" : "MISMATCH ERROR"}
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
