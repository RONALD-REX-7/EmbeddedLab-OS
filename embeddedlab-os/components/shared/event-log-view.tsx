/**
 * EmbeddedLab OS — components/shared/event-log-view.tsx
 * Precision engineering serial console & hardware event monitor.
 */
"use client";

import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Info,
  Terminal,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { EventSeverity, SimulationEvent } from "@/types/simulator";

interface EventLogViewProps {
  events: SimulationEvent[];
  onClear?: () => void;
  className?: string;
  maxHeight?: string;
}

const SEVERITY_CONFIG: Record<
  EventSeverity,
  { icon: React.ElementType; color: string; badge: string }
> = {
  INFO:    { icon: Info,         color: "text-sky-400",     badge: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  SUCCESS: { icon: CheckCircle2, color: "text-emerald-400", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  WARNING: { icon: AlertCircle,  color: "text-amber-400",   badge: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  ERROR:   { icon: AlertCircle,  color: "text-red-400",     badge: "bg-red-500/10 text-red-400 border-red-500/20" },
};

export function EventLogView({
  events,
  onClear,
  className,
  maxHeight = "h-44",
}: EventLogViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<EventSeverity | "ALL">("ALL");

  const filteredEvents =
    filterSeverity === "ALL"
      ? events
      : events.filter((e) => e.severity === filterSeverity);

  return (
    <div
      className={cn(
        "rounded-md border border-border-default bg-surface-console flex flex-col overflow-hidden font-mono text-xs shadow-inner select-none",
        className
      )}
    >
      {/* Console Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 border-b border-border-subtle bg-surface-panel/90 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
            <Terminal className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="font-bold text-foreground text-[11px] uppercase tracking-wider">
            Telemetry & Diagnostic Console
          </span>
          <span className="text-[9px] text-muted-foreground bg-surface-sunken px-1.5 py-0.2 rounded border border-border/60">
            {filteredEvents.length} frames
          </span>
        </div>

        {/* Action Controls & Filters */}
        <div className="flex items-center gap-2">
          {/* Severity Filter Segment */}
          <div className="flex items-center gap-0.5 bg-surface-sunken p-0.5 rounded border border-border-subtle">
            <Filter className="h-2.5 w-2.5 text-muted-foreground/70 ml-1 mr-0.5" />
            {(["ALL", "INFO", "SUCCESS", "WARNING", "ERROR"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                aria-label={`Filter log events by ${sev}`}
                className={cn(
                  "px-1.5 py-0.5 text-[9px] rounded font-mono font-medium transition-colors",
                  filterSeverity === sev
                    ? "bg-primary text-primary-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {sev}
              </button>
            ))}
          </div>

          {onClear && (
            <Button
              variant="ghost"
              size="xs"
              onClick={onClear}
              className="h-5 text-[10px] text-muted-foreground hover:text-red-400 px-1.5"
              title="Clear Event Log"
            >
              <Trash2 className="h-2.5 w-2.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Terminal Output Log Stream */}
      <ScrollArea className={cn("p-2", maxHeight)}>
        {filteredEvents.length === 0 ? (
          <div className="py-6 text-center text-muted-foreground/60 text-[11px] font-mono">
            › SYSTEM READY — AWAITING HARDWARE PERIPHERAL EVENTS
          </div>
        ) : (
          <div className="space-y-1">
            {filteredEvents.map((evt) => {
              const sev = SEVERITY_CONFIG[evt.severity] || SEVERITY_CONFIG.INFO;
              const formattedTime = new Date(evt.timestamp).toLocaleTimeString([], {
                hour12: false,
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                fractionalSecondDigits: 3,
              });

              return (
                <div
                  key={evt.id}
                  className="flex items-start gap-2 py-0.5 px-1.5 rounded hover:bg-muted/10 transition-colors leading-tight font-mono text-[11px]"
                >
                  <span className="text-muted-foreground/50 shrink-0 select-none text-[10px]">
                    {formattedTime}
                  </span>
                  <span
                    className={cn(
                      "text-[8px] px-1 py-0.2 rounded border font-bold shrink-0 uppercase tracking-wider",
                      sev.badge
                    )}
                  >
                    {evt.severity}
                  </span>
                  <span className="text-foreground/90 flex-1 break-all">
                    {evt.message}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
