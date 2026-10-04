/**
 * EmbeddedLab OS — components/lab/adc/potentiometer.tsx
 * Virtual Potentiometer — precision rotary input control.
 * Dual-theme light and dark mode calibration.
 */
import { cn } from "@/lib/utils";

interface PotentiometerProps {
  voltage: number;
  maxVoltage: number;
  onChange: (voltage: number) => void;
  label?: string;
}

export function Potentiometer({
  voltage,
  maxVoltage,
  onChange,
  label = "POTENTIOMETER (Vin)",
}: PotentiometerProps) {
  return (
    <div className="rounded-lg border border-border/80 bg-surface-panel p-3.5 space-y-2.5 select-none shadow-2xs transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">{label}</span>
        <span className="font-mono text-xs font-bold text-primary">
          {voltage.toFixed(2)} V
        </span>
      </div>

      <input
        type="range"
        min="0"
        max={maxVoltage}
        step="0.01"
        value={voltage}
        aria-label="Potentiometer Input Voltage Slider"
        aria-valuemin={0}
        aria-valuemax={maxVoltage}
        aria-valuenow={voltage}
        aria-valuetext={`${voltage.toFixed(2)} Volts`}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary cursor-pointer h-1.5 bg-surface-sunken rounded-md border border-border/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <div className="flex gap-1">
        {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
          const val = Number((maxVoltage * ratio).toFixed(2));
          return (
            <button
              type="button"
              key={ratio}
              aria-label={`Set potentiometer to ${val} Volts`}
              onClick={() => onChange(val)}
              className={cn(
                "flex-1 text-[9px] font-mono py-1 rounded-md border transition-colors font-bold cursor-pointer focus-visible:outline-2 focus-visible:outline-primary",
                Math.abs(voltage - val) < 0.02
                  ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                  : "bg-surface-subtle border-border/80 text-muted-foreground hover:text-foreground hover:bg-surface-elevated"
              )}
            >
              {val}V
            </button>
          );
        })}
      </div>
    </div>
  );
}
