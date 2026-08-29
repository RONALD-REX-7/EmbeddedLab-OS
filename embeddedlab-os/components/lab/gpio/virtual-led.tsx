/**
 * EmbeddedLab OS — components/lab/gpio/virtual-led.tsx
 * Virtual LED peripheral component.
 * Illuminates green when assigned pin is OUTPUT and level is HIGH.
 */
import { cn } from "@/lib/utils";
import type { DigitalPin } from "@/types/simulator";

interface VirtualLEDProps {
  pin: DigitalPin;
  label?: string;
}

export function VirtualLED({ pin, label = "Onboard LED (PA5)" }: VirtualLEDProps) {
  const isOutput = pin.mode === "OUTPUT";
  const isOn = isOutput && pin.level === "HIGH";

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* LED Light Bulb Visual */}
        <div className="relative flex items-center justify-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
              isOn
                ? "bg-[var(--signal-high)] border-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.6)]"
                : "bg-muted/30 border-border"
            )}
          >
            <span
              className={cn(
                "w-3 h-3 rounded-full transition-opacity",
                isOn ? "bg-white opacity-80" : "bg-muted-foreground/30 opacity-40"
              )}
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground">{label}</h4>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
            Connected to <span className="text-primary font-bold">{pin.label}</span>
          </p>
        </div>
      </div>

      {/* State status text */}
      <div className="text-right">
        <span
          className={cn(
            "text-xs font-mono font-bold px-2 py-0.5 rounded border uppercase",
            isOn
              ? "bg-[var(--signal-high)]/10 text-[var(--signal-high)] border-[var(--signal-high)]/30"
              : "bg-muted/40 text-muted-foreground border-border"
          )}
        >
          {isOn ? "LED ON" : "LED OFF"}
        </span>
        {!isOutput && (
          <p className="text-[10px] text-[var(--feedback-warning)] font-mono mt-1">
            Pin not in OUTPUT mode
          </p>
        )}
      </div>
    </div>
  );
}
