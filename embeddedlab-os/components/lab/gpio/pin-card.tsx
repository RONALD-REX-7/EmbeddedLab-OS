/**
 * EmbeddedLab OS — components/lab/gpio/pin-card.tsx
 * Precision Virtual Microcontroller Pin Component with Port Addressing and Logic Meters.
 * Dual-theme light and dark mode support.
 */
"use client";

import { cn } from "@/lib/utils";
import type { DigitalPin, LogicLevel, PinMode } from "@/types/simulator";

interface PinCardProps {
  pin: DigitalPin;
  isSelected?: boolean;
  onSelect: (pinId: number) => void;
  onModeChange: (pinId: number, mode: PinMode) => void;
  onToggleLevel: (pinId: number) => void;
}

const MODE_BADGES: Record<PinMode, { label: string; style: string }> = {
  INPUT:          { label: "IN",  style: "bg-surface-subtle text-muted-foreground border-border/80" },
  OUTPUT:         { label: "OUT", style: "bg-primary/10 text-primary border-primary/30 font-bold" },
  INPUT_PULLUP:   { label: "PU",  style: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30" },
  INPUT_PULLDOWN: { label: "PD",  style: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30" },
};

const LEVEL_INDICATORS: Record<LogicLevel, { dot: string; label: string; text: string }> = {
  HIGH:     { dot: "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]", label: "HIGH (3.3V)", text: "text-emerald-600 dark:text-emerald-400 font-bold" },
  LOW:      { dot: "bg-muted-foreground/60", label: "LOW (0.0V)", text: "text-muted-foreground" },
  FLOATING: { dot: "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]", label: "FLOAT (Z)", text: "text-amber-600 dark:text-amber-400 font-semibold" },
};

export function PinCard({
  pin,
  isSelected,
  onSelect,
  onModeChange,
  onToggleLevel,
}: PinCardProps) {
  const levelInfo = LEVEL_INDICATORS[pin.level] || LEVEL_INDICATORS.LOW;
  const modeInfo = MODE_BADGES[pin.mode] || MODE_BADGES.INPUT;

  return (
    <div
      onClick={() => onSelect(pin.id)}
      className={cn(
        "rounded-lg border p-2.5 flex flex-col justify-between transition-all cursor-pointer select-none relative",
        isSelected
          ? "border-primary bg-primary/5 shadow-2xs ring-1 ring-primary"
          : "border-border/80 bg-surface-panel hover:border-primary/40 hover:bg-surface-elevated/60"
      )}
    >
      {/* Port Label & Mode Badge */}
      <div className="flex items-center justify-between mb-1.5">
        <button
          type="button"
          aria-label={`Select pin ${pin.label}, mode ${pin.mode}, level ${pin.level}`}
          aria-pressed={isSelected}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(pin.id);
          }}
          className="flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-primary rounded px-1 py-0.5 text-left -ml-1 hover:bg-surface-elevated transition-colors"
        >
          <span className="font-mono text-xs font-bold text-foreground">
            {pin.label}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground">
            #{pin.id}
          </span>
        </button>
        <span
          className={cn(
            "text-[9px] px-1 py-0.2 rounded border font-mono font-semibold uppercase tracking-wider",
            modeInfo.style
          )}
        >
          {modeInfo.label}
        </span>
      </div>

      {/* Logic State & Drive Control */}
      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-border/60">
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", levelInfo.dot)} />
          <span className={cn("text-[10px] font-mono", levelInfo.text)}>
            {pin.level}
          </span>
        </div>

        {/* Level Toggle / Mode Select Control */}
        {pin.mode === "OUTPUT" ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLevel(pin.id);
            }}
            className={cn(
              "px-2 py-0.5 text-[9px] font-mono font-bold rounded border transition-colors cursor-pointer",
              pin.level === "HIGH"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25"
                : "bg-surface-subtle text-foreground border-border/80 hover:bg-surface-elevated"
            )}
          >
            {pin.level === "HIGH" ? "SET LOW" : "SET HIGH"}
          </button>
        ) : (
          <select
            value={pin.mode}
            aria-label={`Mode for pin ${pin.label}`}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onModeChange(pin.id, e.target.value as PinMode)}
            className="text-[9px] font-mono bg-surface-sunken border border-border/80 rounded px-1 py-0.5 text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer"
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
