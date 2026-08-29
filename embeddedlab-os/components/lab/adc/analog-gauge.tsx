/**
 * EmbeddedLab OS — components/lab/adc/analog-gauge.tsx
 * Analog Voltmeter Gauge component displaying Vin relative to Vref.
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
  // Map 0-100% to gauge angle (-90deg to +90deg)
  const angle = -90 + (percentage / 100) * 180;

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-[var(--surface-sunken)] p-4 flex flex-col items-center justify-between font-mono",
        className
      )}
    >
      <div className="flex items-center justify-between w-full text-xs text-muted-foreground mb-1 select-none">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-primary font-bold">{voltage.toFixed(2)} V</span>
      </div>

      {/* Gauge Dial Arc Frame */}
      <div className="relative w-44 h-24 flex items-end justify-center overflow-hidden my-2">
        {/* Outer Arc Path */}
        <div className="absolute inset-0 rounded-t-full border-4 border-muted/40 border-b-0" />

        {/* Dynamic Glowing Arc Progress */}
        <div
          className="absolute inset-0 rounded-t-full border-4 border-primary border-b-0 transition-all duration-150"
          style={{
            clipPath: `inset(0 ${100 - percentage}% 0 0)`,
          }}
        />

        {/* Tick Marks (0V, Mid, Vref) */}
        <span className="absolute bottom-1 left-2 text-[9px] text-muted-foreground">0.0V</span>
        <span className="absolute top-1 text-[9px] text-muted-foreground">{(maxVoltage / 2).toFixed(1)}V</span>
        <span className="absolute bottom-1 right-2 text-[9px] text-muted-foreground">{maxVoltage.toFixed(1)}V</span>

        {/* Pivot Needle */}
        <div
          className="w-1 bg-primary h-16 origin-bottom rounded-full transition-transform duration-150 shadow-[0_0_8px_rgba(59,130,246,0.8)]"
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className="w-4 h-4 rounded-full bg-foreground border-2 border-primary z-10 -mb-2" />
      </div>

      <div className="text-[11px] text-muted-foreground text-center">
        Scale: <strong className="text-foreground">0.00V — {maxVoltage.toFixed(2)}V</strong> ({percentage.toFixed(1)}% Full Scale)
      </div>
    </div>
  );
}
