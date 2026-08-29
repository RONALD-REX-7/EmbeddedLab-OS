/**
 * EmbeddedLab OS — components/lab/gpio/pin-card.tsx
 * Interactive card component for an individual virtual GPIO pin.
 */
"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { DigitalPin, LogicLevel, PinMode } from "@/types/simulator";

interface PinCardProps {
  pin: DigitalPin;
  isSelected?: boolean;
  onSelect: (pinId: number) => void;
  onModeChange: (pinId: number, mode: PinMode) => void;
  onToggleLevel: (pinId: number) => void;
}

const MODE_COLORS: Record<PinMode, string> = {
  INPUT:          "bg-muted/40 text-muted-foreground border-border",
  OUTPUT:         "bg-primary/10 text-primary border-primary/30",
  INPUT_PULLUP:   "bg-[var(--feedback-info)]/10 text-[var(--feedback-info)] border-[var(--feedback-info)]/30",
  INPUT_PULLDOWN: "bg-[var(--feedback-warning)]/10 text-[var(--feedback-warning)] border-[var(--feedback-warning)]/30",
};

const LEVEL_INDICATORS: Record<LogicLevel, { dot: string; label: string; text: string }> = {
  HIGH:     { dot: "bg-[var(--signal-high)]",     label: "HIGH (1)", text: "text-[var(--signal-high)]" },
  LOW:      { dot: "bg-[var(--signal-low)]",      label: "LOW (0)",  text: "text-muted-foreground" },
  FLOATING: { dot: "bg-[var(--signal-float)]",    label: "FLOAT",    text: "text-[var(--signal-float)]" },
};

export function PinCard({
  pin,
  isSelected,
  onSelect,
  onModeChange,
  onToggleLevel,
}: PinCardProps) {
  const levelInfo = LEVEL_INDICATORS[pin.level];

  return (
    <div
      onClick={() => onSelect(pin.id)}
      className={cn(
        "rounded-md border p-3 flex flex-col justify-between transition-all cursor-pointer select-none",
        isSelected
          ? "border-primary bg-primary/5 ring-1 ring-primary/40 shadow-sm"
          : "border-border bg-card hover:border-border/80 hover:bg-muted/10"
      )}
    >
      {/* Header: Label + Mode badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {pin.label}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground">
            P#{pin.id}
          </span>
        </div>
        <Badge
          variant="outline"
          className={cn("text-[9px] px-1.5 py-0 font-mono font-medium uppercase", MODE_COLORS[pin.mode])}
        >
          {pin.mode}
        </Badge>
      </div>

      {/* Body: Level indicator */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1.5">
          <span className={cn("status-dot", levelInfo.dot)} />
          <span className={cn("text-xs font-mono font-medium", levelInfo.text)}>
            {levelInfo.label}
          </span>
        </div>

        {/* Level Toggle Button (Only for OUTPUT pins) */}
        {pin.mode === "OUTPUT" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLevel(pin.id);
            }}
            className={cn(
              "px-2 py-0.5 text-[10px] font-mono font-semibold rounded border transition-colors",
              pin.level === "HIGH"
                ? "bg-[var(--signal-high)]/20 text-[var(--signal-high)] border-[var(--signal-high)]/40 hover:bg-[var(--signal-high)]/30"
                : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
            )}
          >
            {pin.level === "HIGH" ? "Set LOW" : "Set HIGH"}
          </button>
        ) : (
          <select
            value={pin.mode}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onModeChange(pin.id, e.target.value as PinMode)}
            className="text-[10px] font-mono bg-muted/30 border border-border rounded px-1 py-0.5 text-muted-foreground focus:outline-none focus:border-primary"
          >
            <option value="INPUT">INPUT</option>
            <option value="OUTPUT">OUTPUT</option>
            <option value="INPUT_PULLUP">PULLUP</option>
            <option value="INPUT_PULLDOWN">PULLDOWN</option>
          </select>
        )}
      </div>
    </div>
  );
}
