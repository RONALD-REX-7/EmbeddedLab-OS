/**
 * EmbeddedLab OS — components/lab/uart/uart-workspace.tsx
 * Full UART Laboratory Workspace — Engineering Layout.
 */
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Radio,
  RotateCcw,
  Send,
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

import type { Parity } from "@/types/simulator";

export function UARTWorkspace() {
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

  const selectClasses = "w-full text-[9px] font-mono font-bold bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded px-1.5 py-1 text-foreground focus:outline-none focus:border-primary cursor-pointer";

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4">
      {/* Instrumentation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-default)]">
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
          <LabEducationCard labId="uart" currentState={mcuState} />
          <ChallengePanel labId="uart" />
          <AIAssistantPanel labId="uart" state={mcuState} />
        </div>

        {/* Center Column: Serial Terminals */}
        <div className="lg:col-span-5 space-y-3.5">
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
                <div className="rounded border border-red-500/30 bg-red-500/10 p-2.5 flex items-start gap-2 text-[10px] font-mono">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-red-400 block uppercase tracking-wider">
                      LINK MISMATCH DETECTED
                    </span>
                    <p className="text-muted-foreground text-[9px]">
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
              <form onSubmit={handleSend} className="space-y-1.5 pt-2.5 border-t border-[var(--border-subtle)]">
                <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider font-bold">
                  Transmit Serial Data (ASCII)
                </span>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Enter ASCII data..."
                    className="flex-1 bg-[var(--surface-console)] border border-[var(--border-subtle)] rounded px-2.5 py-1.5 text-[10px] font-mono text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground/40"
                  />
                  <Button type="submit" size="xs" className="font-mono text-[10px] h-7 font-bold">
                    <Send className="mr-1 h-3 w-3" />
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

        {/* Right Column: TX/RX Config Inspector */}
        <div className="lg:col-span-3 space-y-3.5">
          <InspectorPanel
            title="UART Configuration"
            subtitle="TX & RX Parameters"
          >
            {/* TX Config */}
            <div className="space-y-1.5 pb-3 border-b border-[var(--border-subtle)]">
              <span className="text-[9px] font-mono text-sky-400 font-bold uppercase tracking-wider block">
                Transmitter (TX)
              </span>
              <InspectorRow label="Baud Rate" value={`${transmitter.baudRate}`} unit="bps" />
              <InspectorRow label="Frame" value={`${transmitter.dataBits}-${transmitter.parity.charAt(0)}-${transmitter.stopBits}`} />

              <div className="grid grid-cols-2 gap-1 pt-1">
                <div>
                  <span className="text-[8px] text-muted-foreground block mb-0.5 font-mono font-bold uppercase tracking-wider">Baud</span>
                  <select
                    value={transmitter.baudRate}
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
              <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                Receiver (RX)
              </span>
              <InspectorRow label="Baud Rate" value={`${receiver.baudRate}`} unit="bps" />
              <InspectorRow label="Frame" value={`${receiver.dataBits}-${receiver.parity.charAt(0)}-${receiver.stopBits}`} />

              <div className="grid grid-cols-2 gap-1 pt-1">
                <div>
                  <span className="text-[8px] text-muted-foreground block mb-0.5 font-mono font-bold uppercase tracking-wider">Baud</span>
                  <select
                    value={receiver.baudRate}
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

      {/* Bottom Diagnostic Console */}
      <EventLogView events={events} onClear={() => resetStore("uart")} maxHeight="h-36" />
    </div>
  );
}
