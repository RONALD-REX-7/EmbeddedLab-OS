/**
 * EmbeddedLab OS — components/lab/uart/uart-workspace.tsx
 * Precision UART Laboratory Workspace with panoramic desktop layout & mobile 1-tap view switcher.
 */
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Cpu,
  ListFilter,
  Radio,
  RotateCcw,
  Send,
  Terminal,
} from "lucide-react";
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
import { UARTTerminal } from "@/components/lab/uart/uart-terminal";

import { useUARTState } from "@/hooks/use-uart-state";
import { useEventLog } from "@/hooks/use-event-log";
import { useChallenge } from "@/hooks/use-challenge";
import { useSimulatorStore } from "@/store/simulator-store";
import { cn } from "@/lib/utils";

import type { Parity } from "@/types/simulator";

type MobileViewTab = "workbench" | "worksheet" | "inspector" | "telemetry";

export function UARTWorkspace() {
  const [mobileTab, setMobileTab] = useState<MobileViewTab>("workbench");
  const [messageInput, setMessageInput] = useState<string>("HELLO EMBEDDED WORLD");

  const {
    uart,
    transmitter,
    receiver,
    compatible,
    compatibilityNote,
    txDerived,
    setTransmitterConfig,
    setReceiverConfig,
    transmit,
  } = useUARTState();
  const { events } = useEventLog("uart");
  const resetStore = useSimulatorStore((state) => state.reset);
  const mcuState = useSimulatorStore((state) => state.mcuState);
  const { resetChallenge } = useChallenge();

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;
    transmit(messageInput.trim());
  };

  const handleReset = () => {
    resetStore("uart");
    resetChallenge();
  };

  const selectClasses =
    "w-full text-[9px] font-mono font-bold bg-surface-sunken border border-border/80 rounded px-1.5 py-1 text-foreground focus:outline-none focus:border-primary cursor-pointer";

  return (
    <div className="p-3 sm:p-5 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/80">
        <div>
          <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5 font-mono text-[10px] uppercase tracking-wider">
            <Radio className="h-3.5 w-3.5 text-primary" />
            <span>SERIAL COMMUNICATION & PROTOCOL ANALYSIS</span>
            <span>·</span>
            <span className="text-primary font-bold">USART1</span>
          </div>
          <h1 className="text-xl font-bold text-foreground font-sans tracking-tight">
            UART — Universal Asynchronous Receiver-Transmitter
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={compatible ? "running" : "error"} />
          <Button
            variant="outline"
            size="xs"
            onClick={handleReset}
            className="h-7 text-xs font-mono bg-surface-panel hover:bg-surface-elevated"
            aria-label="Reset MCU UART Registers"
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
          <LabEducationCard labId="uart" currentState={mcuState} />
          <ChallengePanel labId="uart" />
          <AIAssistantPanel labId="uart" state={mcuState} />
        </div>

        {/* Center Column: Serial Terminals (5 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-5 space-y-3.5",
            mobileTab !== "workbench" && "hidden lg:block"
          )}
        >
          <Panel
            title="Serial Transceiver"
            subtitle="TX/RX Terminals & Data Transmission"
            icon={Radio}
            variant="instrument"
            telemetryTag="USART1"
          >
            <div className="space-y-3">
              {/* Mismatch Warning */}
              {!compatible && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 flex items-start gap-2.5 text-[10px] font-mono">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-red-500 block uppercase tracking-wider">
                      LINK MISMATCH DETECTED
                    </span>
                    <p className="text-muted-foreground text-[10px] leading-relaxed">
                      {compatibilityNote || "TX/RX framing configuration mismatch."}
                    </p>
                  </div>
                </div>
              )}

              {/* TX/RX Dual Terminals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <UARTTerminal
                  title="TX Terminal"
                  subtitle={`${transmitter.baudRate}-${transmitter.dataBits}${transmitter.parity.charAt(0)}${transmitter.stopBits}`}
                  buffer={uart.txBuffer}
                  type="TX"
                  compatible={compatible}
                />
                <UARTTerminal
                  title="RX Terminal"
                  subtitle={`${receiver.baudRate}-${receiver.dataBits}${receiver.parity.charAt(0)}${receiver.stopBits}`}
                  buffer={uart.rxBuffer}
                  type="RX"
                  compatible={compatible}
                />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="space-y-1.5 pt-2.5 border-t border-border/80">
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider font-bold">
                  Transmit Serial Data (ASCII)
                </span>
                <div className="flex gap-1.5">
                  <input
                    id="uart-tx-input"
                    aria-label="Transmit Serial Data (ASCII)"
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Enter ASCII data (e.g. HELLO)..."
                    className="flex-1 bg-surface-console border border-border/80 rounded-md px-3 py-1.5 text-[10px] font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-muted-foreground/60"
                  />
                  <Button type="submit" size="xs" className="font-mono text-[10px] h-7 font-bold shadow-2xs">
                    <Send className="mr-1 h-3 w-3" aria-hidden="true" />
                    TX
                  </Button>
                </div>
              </form>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2">
                <MetricCard label="Link Status" value={compatible ? "OK" : "ERR"} signalState={compatible ? "high" : "float"} />
                <MetricCard label="Bit Time" value={(txDerived.bitDurationMicros).toFixed(1)} unit="µs" />
                <MetricCard label="Frame Size" value={txDerived.bitsPerFrame} unit="bits" />
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: TX/RX Config Inspector (3 cols on desktop) */}
        <div
          className={cn(
            "lg:col-span-3 space-y-3.5",
            mobileTab !== "inspector" && "hidden lg:block"
          )}
        >
          <InspectorPanel
            title="UART Configuration"
            subtitle="TX & RX Parameters"
          >
            {/* TX Config */}
            <div className="space-y-1.5 pb-3 border-b border-border/80">
              <span className="text-[9px] font-mono text-primary font-bold uppercase tracking-wider block">
                Transmitter (TX)
              </span>
              <InspectorRow label="Baud Rate" value={`${transmitter.baudRate}`} unit="bps" />
              <InspectorRow label="Frame" value={`${transmitter.dataBits}-${transmitter.parity.charAt(0)}-${transmitter.stopBits}`} />

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div>
                  <span className="text-[8px] text-muted-foreground block mb-0.5 font-mono font-bold uppercase tracking-wider">Baud</span>
                  <select
                    value={transmitter.baudRate}
                    aria-label="Transmitter Baud Rate"
                    onChange={(e) => setTransmitterConfig({ baudRate: Number(e.target.value) })}
                    className={selectClasses}
                  >
                    {[9600, 19200, 38400, 57600, 115200].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[8px] text-muted-foreground block mb-0.5 font-mono font-bold uppercase tracking-wider">Parity</span>
                  <select
                    value={transmitter.parity}
                    aria-label="Transmitter Parity"
                    onChange={(e) => setTransmitterConfig({ parity: e.target.value as Parity })}
                    className={selectClasses}
                  >
                    <option value="NONE">NONE</option>
                    <option value="EVEN">EVEN</option>
                    <option value="ODD">ODD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* RX Config */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[9px] font-mono text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                Receiver (RX)
              </span>
              <InspectorRow label="Baud Rate" value={`${receiver.baudRate}`} unit="bps" />
              <InspectorRow label="Frame" value={`${receiver.dataBits}-${receiver.parity.charAt(0)}-${receiver.stopBits}`} />

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div>
                  <span className="text-[8px] text-muted-foreground block mb-0.5 font-mono font-bold uppercase tracking-wider">Baud</span>
                  <select
                    value={receiver.baudRate}
                    aria-label="Receiver Baud Rate"
                    onChange={(e) => setReceiverConfig({ baudRate: Number(e.target.value) })}
                    className={selectClasses}
                  >
                    {[9600, 19200, 38400, 57600, 115200].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <span className="text-[8px] text-muted-foreground block mb-0.5 font-mono font-bold uppercase tracking-wider">Parity</span>
                  <select
                    value={receiver.parity}
                    aria-label="Receiver Parity"
                    onChange={(e) => setReceiverConfig({ parity: e.target.value as Parity })}
                    className={selectClasses}
                  >
                    <option value="NONE">NONE</option>
                    <option value="EVEN">EVEN</option>
                    <option value="ODD">ODD</option>
                  </select>
                </div>
              </div>
            </div>
          </InspectorPanel>
        </div>
      </div>

      {/* Bottom Diagnostic Console / Telemetry tab on mobile */}
      <div className={cn(mobileTab !== "telemetry" && "hidden lg:block")}>
        <EventLogView events={events} onClear={() => resetStore("uart")} maxHeight="h-36" />
      </div>
    </div>
  );
}
