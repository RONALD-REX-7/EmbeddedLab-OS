/**
 * EmbeddedLab OS — components/lab/adc/analog-gauge.tsx
 * Precision Analog Voltmeter Gauge — SVG arc gauge with needle indicator.
 */
import { cn } from "@/lib/utils";

interface AnalogGaugeProps {
  voltage: number;
  maxVoltage: number;
  label?: string;
  className?: string;
}

export function AnalogGauge({
  voltage,
  maxVoltage,
  label = "INPUT VOLTMETER",
  className,
}: AnalogGaugeProps) {
  const percentage = Math.max(0, Math.min(100, (voltage / maxVoltage) * 100));
  const angle = -90 + (percentage / 100) * 180;

  return (
    <div
      role="meter"
      aria-label={label}
      aria-valuenow={voltage}
      aria-valuemin={0}
      aria-valuemax={maxVoltage}
      aria-valuetext={`${voltage.toFixed(2)} Volts (${percentage.toFixed(1)}% full scale)`}
      className={cn(
        "rounded border border-[var(--border-default)] bg-[var(--surface-sunken)] p-4 flex flex-col items-center justify-between font-mono shadow-[inset_0_2px_6px_rgba(0,0,0,0.3)] select-none",
        className
      )}
    >
      <div className="flex items-center justify-between w-full text-[10px] text-muted-foreground mb-1.5">
        <span className="font-bold text-foreground uppercase tracking-wider">{label}</span>
        <span className="text-primary font-bold text-xs">{voltage.toFixed(2)} V</span>
      </div>

      {/* Gauge Dial Arc */}
      <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden my-2">
        {/* Outer Arc */}
        <div className="absolute inset-0 rounded-t-full border-4 border-[var(--border-subtle)] border-b-0" />

        {/* Progress Arc */}
        <div
          className="absolute inset-0 rounded-t-full border-4 border-primary border-b-0 transition-all duration-200"
          style={{
            clipPath: `inset(0 ${100 - percentage}% 0 0)`,
          }}
        />

        {/* Tick Marks */}
        <span className="absolute bottom-0.5 left-1.5 text-[8px] text-muted-foreground font-bold">0V</span>
        <span className="absolute top-0.5 text-[8px] text-muted-foreground font-bold">{(maxVoltage / 2).toFixed(1)}V</span>
        <span className="absolute bottom-0.5 right-1.5 text-[8px] text-muted-foreground font-bold">{maxVoltage.toFixed(1)}V</span>

        {/* Pivot Needle */}
        <div
          className="w-0.5 bg-red-400 h-16 origin-bottom rounded-full transition-transform duration-200 shadow-[0_0_6px_rgba(239,68,68,0.6)]"
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className="w-3 h-3 rounded-full bg-slate-300 border-2 border-red-400 z-10 -mb-1.5" />
      </div>

      <div className="text-[9px] text-muted-foreground text-center font-bold uppercase tracking-wider">
        Scale: <span className="text-foreground">0.00V — {maxVoltage.toFixed(2)}V</span> · {percentage.toFixed(1)}% FS
      </div>
    </div>
  );
}
