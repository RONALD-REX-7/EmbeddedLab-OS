/**
 * EmbeddedLab OS — components/lab/adc/potentiometer.tsx
 * Virtual Potentiometer rotary input control component.
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
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-foreground">{label}</h4>
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
        className="w-full accent-primary cursor-pointer h-2 bg-muted rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      />

      <div className="flex gap-1 pt-1">
        {[0, 0.25, 0.5, 0.75, 1.0].map((ratio) => {
          const val = Number((maxVoltage * ratio).toFixed(2));
          return (
            <button
              key={ratio}
              onClick={() => onChange(val)}
              className={cn(
                "flex-1 text-[10px] font-mono py-0.5 rounded border transition-colors",
                Math.abs(voltage - val) < 0.02
                  ? "bg-primary text-primary-foreground font-bold border-primary"
                  : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
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
