/**
 * EmbeddedLab OS — components/lab/gpio/virtual-led.tsx
 * Precision Virtual 5mm LED Component with Optical Lens Diffusion and Diode Anode/Cathode Schematics.
 * Dual-theme light and dark mode support.
 */
import { cn } from "@/lib/utils";
import type { DigitalPin } from "@/types/simulator";

interface VirtualLEDProps {
  pin: DigitalPin;
  label?: string;
}

export function VirtualLED({ pin, label = "Onboard Status LED (PA5)" }: VirtualLEDProps) {
  const isOutput = pin.mode === "OUTPUT";
  const isOn = isOutput && pin.level === "HIGH";

  return (
    <div className="rounded-lg border border-border/80 bg-surface-sunken p-3.5 flex items-center justify-between shadow-2xs select-none transition-colors">
      <div className="flex items-center gap-3.5">
        {/* Optical 5mm LED Package Visualizer */}
        <div className="relative flex items-center justify-center shrink-0">
          {/* External Ambient Glow */}
          {isOn && (
            <div className="absolute w-12 h-12 rounded-full bg-emerald-500/25 blur-md animate-pulse" />
          )}

          {/* LED Lens Body */}
          <div
            className={cn(
              "w-9 h-9 rounded-full border-2 transition-all duration-150 flex items-center justify-center relative overflow-hidden",
              isOn
                ? "bg-emerald-500 border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.85)]"
                : "bg-surface-elevated border-border/80"
            )}
          >
            {/* Internal LED Die Anvil & Wirebond */}
            <div
              className={cn(
                "w-4 h-4 rounded-sm border transition-colors",
                isOn
                  ? "bg-emerald-200/95 border-white shadow-[0_0_6px_#ffffff]"
                  : "bg-surface-sunken border-border/60"
              )}
            />

            {/* Specular Highlight */}
            <div className="absolute top-1.5 left-2 w-2 h-1.5 rounded-full bg-white/50 blur-[0.5px]" />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-foreground font-sans">{label}</span>
            <span className="text-[9px] font-mono font-semibold px-1 py-0.2 rounded bg-surface-subtle text-muted-foreground border border-border/70">
              ANODE → PA5
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5 flex items-center gap-1.5">
            <span>Port: <strong className="text-primary">{pin.label}</strong></span>
            <span>·</span>
            <span>V_fwd: <strong className="text-foreground">{isOn ? "2.10 V" : "0.00 V"}</strong></span>
          </p>
        </div>
      </div>

      {/* State status readout badge */}
      <div className="text-right flex flex-col items-end">
        <span
          className={cn(
            "text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider flex items-center gap-1",
            isOn
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 shadow-2xs"
              : "bg-surface-subtle text-muted-foreground border-border/70"
          )}
        >
          <span className={cn("w-1.5 h-1.5 rounded-full", isOn ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/60")} />
          {isOn ? "EMITTING (HIGH)" : "OFF (0V)"}
        </span>
        {!isOutput && (
          <span className="text-[9px] text-amber-500 font-mono mt-1">
            Pin mode: {pin.mode}
          </span>
        )}
      </div>
    </div>
  );
}
