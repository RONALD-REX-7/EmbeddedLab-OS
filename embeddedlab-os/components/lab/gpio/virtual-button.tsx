/**
 * EmbeddedLab OS — components/lab/gpio/virtual-button.tsx
 * Virtual push button peripheral component.
 * Allows student to press/hold button to drive connected input pin level.
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
  label = "Push Button (PA0)",
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
    <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-muted/30 border border-border flex items-center justify-center">
          <CircleDot
            className={cn(
              "h-5 w-5 transition-colors",
              isPressed ? "text-primary scale-90" : "text-muted-foreground"
            )}
          />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground">{label}</h4>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
            Connected to <span className="text-primary font-bold">{pin.label}</span> ({pin.mode})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={cn(
            "px-3 py-1.5 text-xs font-mono font-semibold rounded border transition-all active:scale-95 select-none",
            isPressed
              ? "bg-primary text-primary-foreground border-primary shadow-inner"
              : "bg-muted/40 text-foreground border-border hover:bg-muted/70"
          )}
        >
          {isPressed ? "PRESSED" : "PRESS BUTTON"}
        </button>
      </div>
    </div>
  );
}
