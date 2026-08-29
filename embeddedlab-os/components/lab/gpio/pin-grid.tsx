/**
 * EmbeddedLab OS — components/lab/gpio/pin-grid.tsx
 * 16-pin digital pin matrix for virtual microcontroller.
 */
"use client";

import { PinCard } from "@/components/lab/gpio/pin-card";
import type { DigitalPin, PinMode } from "@/types/simulator";

interface PinGridProps {
  pins: DigitalPin[];
  selectedPinId: number;
  onSelectPin: (pinId: number) => void;
  onModeChange: (pinId: number, mode: PinMode) => void;
  onToggleLevel: (pinId: number) => void;
}

export function PinGrid({
  pins,
  selectedPinId,
  onSelectPin,
  onModeChange,
  onToggleLevel,
}: PinGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Virtual MCU Pinout (16 Digital Pins)
        </span>
        <span className="text-[11px] font-mono text-muted-foreground">
          Active: PA5 (LED) · PA0 (Button)
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {pins.map((pin) => (
          <PinCard
            key={pin.id}
            pin={pin}
            isSelected={pin.id === selectedPinId}
            onSelect={onSelectPin}
            onModeChange={onModeChange}
            onToggleLevel={onToggleLevel}
          />
        ))}
      </div>
    </div>
  );
}
