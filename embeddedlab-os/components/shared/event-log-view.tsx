/**
 * EmbeddedLab OS — components/shared/event-log-view.tsx
 * Console & simulation event log component.
 * Displays timestamped events, severity filters, clear log action, and payload inspection.
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
  INFO:    { icon: Info,         color: "text-info",       badge: "bg-info/10 text-info border-info/20" },
  SUCCESS: { icon: CheckCircle2, color: "text-success",    badge: "bg-success/10 text-success border-success/20" },
  WARNING: { icon: AlertCircle,  color: "text-warning",    badge: "bg-warning/10 text-warning border-warning/20" },
  ERROR:   { icon: AlertCircle,  color: "text-error",      badge: "bg-error/10 text-error border-error/20" },
};

export function EventLogView({
  events,
  onClear,
  className,
  maxHeight = "h-48",
}: EventLogViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<EventSeverity | "ALL">("ALL");

  const filteredEvents =
    filterSeverity === "ALL"
      ? events
      : events.filter((e) => e.severity === filterSeverity);

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-[var(--surface-sunken)] flex flex-col overflow-hidden font-mono text-xs",
        className
      )}
    >
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b border-border bg-card/60 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground text-xs uppercase tracking-wider">
            Event Log & Console
          </span>
          <span className="text-[10px] text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded">
            {filteredEvents.length} events
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Severity filter buttons */}
          <div className="flex items-center gap-1 bg-muted/20 p-0.5 rounded border border-border">
            <Filter className="h-3 w-3 text-muted-foreground ml-1 mr-0.5" />
            {(["ALL", "INFO", "SUCCESS", "WARNING", "ERROR"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                aria-label={`Filter log events by ${sev}`}
                className={cn(
                  "px-1.5 py-0.5 text-[10px] rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
                  filterSeverity === sev
                    ? "bg-primary text-primary-foreground font-semibold"
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
              className="h-6 text-[11px] text-muted-foreground hover:text-destructive"
              title="Clear Event Log"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Log Entries Area */}
      <ScrollArea className={cn("p-2", maxHeight)}>
        {filteredEvents.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground text-xs font-sans">
            No simulation events logged yet. Perform operations to record activity.
          </div>
        ) : (
          <div className="space-y-1.5">
            {filteredEvents.map((evt) => {
              const sevBadge = SEVERITY_CONFIG[evt.severity]?.badge || "";
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
                  className="flex items-start gap-2 py-1 px-2 rounded hover:bg-muted/20 border border-transparent hover:border-border transition-colors leading-tight"
                >
                  <span className="text-muted-foreground/60 shrink-0 select-none text-[11px]">
                    [{formattedTime}]
                  </span>
                  <span
                    className={cn(
                      "text-[9px] px-1 py-0.2 rounded border font-semibold shrink-0 uppercase",
                      sevBadge
                    )}
                  >
                    {evt.severity}
                  </span>
                  <span className="text-foreground flex-1 break-all">
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
