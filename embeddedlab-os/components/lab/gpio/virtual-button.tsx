/**
 * EmbeddedLab OS — components/lab/gpio/virtual-button.tsx
 * Precision Virtual Tactile Push Button with Mechanical Spring-Travel Simulation.
 * Dual-theme light and dark mode support.
 */
"use client";

import { useState } from "react";
import { CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DigitalPin } from "@/types/simulator";

interface VirtualButtonProps {
  pin: DigitalPin;
  onPressStateChange: (pressed: boolean) => void;
  label?: string;
}

export function VirtualButton({
  pin,
  onPressStateChange,
  label = "User Push Button (PA0)",
}: VirtualButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    onPressStateChange(true);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    onPressStateChange(false);
  };

  return (
    <div className="rounded-lg border border-border/80 bg-surface-sunken p-3.5 flex items-center justify-between shadow-2xs select-none transition-colors">
      <div className="flex items-center gap-3.5">
        {/* Tactile Switch Package Bezel */}
        <div
          className={cn(
            "w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-100 shrink-0",
            isPressed
              ? "bg-primary/20 border-primary shadow-inner"
              : "bg-surface-elevated border-border shadow-2xs"
          )}
        >
          <CircleDot
            className={cn(
              "h-5 w-5 transition-transform duration-75",
              isPressed ? "text-primary scale-75" : "text-muted-foreground"
            )}
          />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground font-sans">{label}</span>
            <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-surface-subtle text-muted-foreground border border-border/70">
              SPST-NO TACTILE
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
            <span>Terminal: <strong className="text-primary">{pin.label}</strong></span>
            <span>·</span>
            <span>Mode: <strong className="text-foreground">{pin.mode}</strong></span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={label}
          aria-pressed={isPressed}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              if (!isPressed) {
                e.preventDefault();
                setIsPressed(true);
                onPressStateChange(true);
              }
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              setIsPressed(false);
              onPressStateChange(false);
            }
          }}
          className={cn(
            "px-3.5 py-1.5 text-xs font-mono font-bold rounded-md border transition-all select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-primary",
            isPressed
              ? "bg-primary text-primary-foreground border-primary shadow-inner translate-y-px"
              : "bg-surface-elevated text-foreground border-border hover:border-primary/50 hover:bg-surface-subtle shadow-2xs"
          )}
        >
          {isPressed ? "CONTACT CLOSED (0Ω)" : "ACTUATE SWITCH"}
        </button>
      </div>
    </div>
  );
}
