/**
 * EmbeddedLab OS — components/lab/uart/uart-workspace.tsx
 *
 * Full UART Laboratory Workspace.
 * Educational protocol/configuration simulation.
 */
"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  FlaskConical,
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

  // Engine state & actions
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
            UART — Universal Asynchronous Receiver-Transmitter
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
          <LabEducationCard labId="uart" currentState={mcuState} />
          <ChallengePanel labId="uart" />
          <AIAssistantPanel labId="uart" state={mcuState} />
        </div>

        {/* Center Column: Serial Terminals & Transmission Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Panel title="Serial Terminals & Transceiver" icon={Radio} variant="sunken">
            <div className="space-y-4">
              {/* Communication Mismatch Warning Banner */}
              {!compatible && (
                <div className="rounded-md border border-[var(--feedback-error)]/40 bg-[var(--feedback-error)]/10 p-3 flex items-start gap-2.5 text-xs font-mono">
                  <AlertTriangle className="h-4 w-4 text-[var(--feedback-error)] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="font-bold text-[var(--feedback-error)] block">
                      UART COMMUNICATION LINK MISMATCH DETECTED
                    </span>
                    <p className="text-muted-foreground text-[11px]">
                      {compatibilityNote || "Framing configuration mismatch between TX and RX interfaces."}
                    </p>
                  </div>
                </div>
              )}

              {/* TX and RX Dual Terminals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <UARTTerminal
                  title="TX Terminal"
                  subtitle={`${transmitter.baudRate}-${transmitter.dataBits}-${transmitter.parity.charAt(0)}-${transmitter.stopBits}`}
                  buffer={uart.txBuffer}
                  type="TX"
                  compatible={compatible}
                />
                <UARTTerminal
                  title="RX Terminal"
                  subtitle={`${receiver.baudRate}-${receiver.dataBits}-${receiver.parity.charAt(0)}-${receiver.stopBits}`}
                  buffer={uart.rxBuffer}
                  type="RX"
                  compatible={compatible}
                />
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSend} className="space-y-2 pt-2 border-t border-border/80">
                <span className="text-xs font-mono text-muted-foreground">
                  Transmit Serial Data (ASCII)
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Enter string message..."
                    className="flex-1 bg-background border border-border rounded px-3 py-1.5 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
                  />
                  <Button type="submit" size="sm" className="font-mono text-xs">
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Send
                  </Button>
                </div>
              </form>

              {/* Metric Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <MetricCard label="Link Status" value={compatible ? "OK" : "MISMATCH"} signalState={compatible ? "high" : "float"} />
                <MetricCard label="TX Bit Time" value={(txDerived.bitDurationMicros).toFixed(1)} unit="µs" />
                <MetricCard label="Frame Bits" value={txDerived.bitsPerFrame} unit="bits" />
              </div>
            </div>
          </Panel>
        </div>

        {/* Right Column: TX / RX Inspector (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          <InspectorPanel
            title="UART Config Inspector"
            subtitle="Transmitter & Receiver Parameters"
          >
            {/* Transmitter TX Section */}
            <div className="space-y-2 pb-3 border-b border-border">
              <span className="text-[11px] font-mono text-primary font-bold uppercase tracking-wider block">
                Transmitter (TX) Config
              </span>
              <InspectorRow label="Baud Rate" value={`${transmitter.baudRate} bps`} />
              <InspectorRow label="Framing Spec" value={`${transmitter.dataBits}-${transmitter.parity.charAt(0)}-${transmitter.stopBits}`} />

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">TX Baud Rate</span>
                  <select
                    value={transmitter.baudRate}
                    onChange={(e) => setTransmitterConfig({ baudRate: Number(e.target.value) })}
                    className="w-full text-[10px] font-mono bg-muted/30 border border-border rounded px-1.5 py-1 text-foreground"
                  >
                    {[9600, 19200, 38400, 57600, 115200].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">TX Parity</span>
                  <select
                    value={transmitter.parity}
                    onChange={(e) => setTransmitterConfig({ parity: e.target.value as Parity })}
                    className="w-full text-[10px] font-mono bg-muted/30 border border-border rounded px-1.5 py-1 text-foreground"
                  >
                    <option value="NONE">NONE</option>
                    <option value="EVEN">EVEN</option>
                    <option value="ODD">ODD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Receiver RX Section */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-mono text-[var(--signal-high)] font-bold uppercase tracking-wider block">
                Receiver (RX) Config
              </span>
              <InspectorRow label="Baud Rate" value={`${receiver.baudRate} bps`} />
              <InspectorRow label="Framing Spec" value={`${receiver.dataBits}-${receiver.parity.charAt(0)}-${receiver.stopBits}`} />

              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">RX Baud Rate</span>
                  <select
                    value={receiver.baudRate}
                    onChange={(e) => setReceiverConfig({ baudRate: Number(e.target.value) })}
                    className="w-full text-[10px] font-mono bg-muted/30 border border-border rounded px-1.5 py-1 text-foreground"
                  >
                    {[9600, 19200, 38400, 57600, 115200].map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-muted-foreground block mb-1">RX Parity</span>
                  <select
                    value={receiver.parity}
                    onChange={(e) => setReceiverConfig({ parity: e.target.value as Parity })}
                    className="w-full text-[10px] font-mono bg-muted/30 border border-border rounded px-1.5 py-1 text-foreground"
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

      {/* Bottom Row: Event Log */}
      <EventLogView events={events} onClear={() => resetStore("uart")} maxHeight="h-44" />
    </div>
  );
}
