/**
 * EmbeddedLab OS — components/lab/adc/potentiometer.tsx
 * Virtual Potentiometer — precision rotary input control.
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
    <div className="rounded border border-[var(--border-default)] bg-[var(--surface-panel)] p-3 space-y-2.5 select-none">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-mono font-bold text-foreground uppercase tracking-wider">{label}</h4>
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
        className="w-full accent-primary cursor-pointer h-1.5 bg-[var(--surface-sunken)] rounded-sm border border-[var(--border-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <div className="flex gap-1">
        {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
          const val = Number((maxVoltage * ratio).toFixed(2));
          return (
            <button
              key={ratio}
              onClick={() => onChange(val)}
              className={cn(
                "flex-1 text-[9px] font-mono py-0.5 rounded border transition-colors font-bold control-elevated",
                Math.abs(voltage - val) < 0.02
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-[var(--surface-panel)] border-[var(--border-subtle)] text-muted-foreground hover:text-foreground hover:border-[var(--border-default)]"
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
