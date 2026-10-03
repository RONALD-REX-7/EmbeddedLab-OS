/**
 * EmbeddedLab OS — components/lab/gpio/pin-card.tsx
 * Precision Virtual Microcontroller Pin Component with Port Addressing and Logic Meters.
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
  INPUT:          { label: "IN",  style: "bg-slate-800 text-slate-300 border-slate-700" },
  OUTPUT:         { label: "OUT", style: "bg-sky-500/15 text-sky-400 border-sky-500/30 font-bold" },
  INPUT_PULLUP:   { label: "PU",  style: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  INPUT_PULLDOWN: { label: "PD",  style: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

const LEVEL_INDICATORS: Record<LogicLevel, { dot: string; label: string; text: string }> = {
  HIGH:     { dot: "bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]", label: "HIGH (3.3V)", text: "text-emerald-400 font-bold" },
  LOW:      { dot: "bg-slate-600", label: "LOW (0.0V)", text: "text-slate-400" },
  FLOATING: { dot: "bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.7)]", label: "FLOAT (Z)", text: "text-amber-400 font-semibold" },
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
        "rounded border p-2.5 flex flex-col justify-between transition-all cursor-pointer select-none relative",
        isSelected
          ? "border-primary bg-primary/10 shadow-[0_0_12px_rgba(56,189,248,0.2)] ring-1 ring-primary"
          : "border-[var(--border-default)] bg-[var(--surface-panel)] hover:border-primary/40 hover:bg-[var(--surface-elevated)]"
      )}
    >
      {/* Port Label & Mode Badge */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs font-bold text-foreground">
            {pin.label}
          </span>
          <span className="text-[9px] font-mono text-muted-foreground/70">
            #{pin.id}
          </span>
        </div>
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
      <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[var(--border-subtle)]">
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
              "px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border transition-colors cursor-pointer",
              pin.level === "HIGH"
                ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30"
                : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
            )}
          >
            {pin.level === "HIGH" ? "SET LOW" : "SET HIGH"}
          </button>
        ) : (
          <select
            value={pin.mode}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onModeChange(pin.id, e.target.value as PinMode)}
            className="text-[9px] font-mono bg-[var(--surface-sunken)] border border-[var(--border-subtle)] rounded px-1 py-0.5 text-muted-foreground focus:outline-none focus:border-primary cursor-pointer"
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
