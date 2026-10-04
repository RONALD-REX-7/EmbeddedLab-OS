/**
 * EmbeddedLab OS — components/lab/pwm/pwm-led-dimmer.tsx
 * Virtual LED Dimmer Peripheral — brightness maps to duty cycle.
 * Engineering instrument-grade visual with glow emission.
 */
import type { PWMChannel } from "@/types/simulator";

interface PWMLEDDimmerProps {
  channel: PWMChannel;
}

export function PWMLEDDimmer({ channel }: PWMLEDDimmerProps) {
  const { dutyCyclePercent, enabled } = channel;
  const opacity = enabled ? dutyCyclePercent / 100 : 0;
  const glowBlur = enabled ? (dutyCyclePercent / 100) * 24 : 0;
  const avgVoltage = ((dutyCyclePercent / 100) * 3.3).toFixed(2);

  return (
    <div className="rounded border border-[var(--border-default)] bg-[var(--surface-panel)] p-3 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        {/* Dimmable LED Element */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-9 h-9 rounded-full border border-emerald-500/30 bg-emerald-950/30 flex items-center justify-center transition-all duration-200"
            style={{
              boxShadow: enabled && dutyCyclePercent > 0
                ? `0 0 ${glowBlur}px rgba(16, 185, 129, ${opacity * 0.8}), inset 0 0 ${glowBlur / 2}px rgba(16, 185, 129, ${opacity * 0.3})`
                : "none",
            }}
          >
            <div
              className="w-4 h-4 rounded-full bg-emerald-400 transition-opacity duration-200"
              style={{ opacity }}
            />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-mono font-bold text-foreground uppercase tracking-wider block">
            PWM LED · TIM3_CH1
          </span>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
            V_avg = <span className="text-primary font-bold">{avgVoltage}V</span>
          </p>
        </div>
      </div>

      <div className="text-right font-mono space-y-1">
        <span className="text-[10px] font-bold text-foreground block">
          {enabled ? `${dutyCyclePercent}%` : "OFF"}
        </span>
        <div className="h-1 w-16 bg-[var(--surface-sunken)] rounded-sm overflow-hidden border border-[var(--border-subtle)]">
          <div
            className="h-full bg-emerald-500 transition-[width] duration-200"
            style={{ width: `${enabled ? dutyCyclePercent : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
