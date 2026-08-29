/**
 * EmbeddedLab OS — components/lab/pwm/pwm-led-dimmer.tsx
 * Virtual LED Dimmer peripheral component.
 * LED brightness and glow radius directly map to PWM duty cycle.
 */
import type { PWMChannel } from "@/types/simulator";

interface PWMLEDDimmerProps {
  channel: PWMChannel;
}

export function PWMLEDDimmer({ channel }: PWMLEDDimmerProps) {
  const { dutyCyclePercent, enabled } = channel;
  const opacity = enabled ? dutyCyclePercent / 100 : 0;
  const glowBlur = enabled ? (dutyCyclePercent / 100) * 20 : 0;

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* Dynamic Dimmable LED Bulb */}
        <div className="relative flex items-center justify-center">
          <div
            className="w-10 h-10 rounded-full border-2 border-emerald-500/50 bg-emerald-950/40 flex items-center justify-center transition-all duration-150"
            style={{
              boxShadow: enabled && dutyCyclePercent > 0
                ? `0 0 ${glowBlur}px rgba(34, 197, 94, ${opacity})`
                : "none",
            }}
          >
            <div
              className="w-5 h-5 rounded-full bg-emerald-400 transition-opacity duration-150"
              style={{ opacity }}
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-foreground">
            PWM Dimmable LED (TIM1_CH1)
          </h4>
          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
            Average Voltage:{" "}
            <span className="text-primary font-bold">
              {((dutyCyclePercent / 100) * 3.3).toFixed(2)} V
            </span>
          </p>
        </div>
      </div>

      <div className="text-right font-mono">
        <span className="text-xs font-bold text-foreground">
          Brightness: {enabled ? `${dutyCyclePercent}%` : "0% (Muted)"}
        </span>
        <div className="h-1.5 w-24 bg-muted/40 rounded-full overflow-hidden mt-1.5 border border-border/50">
          <div
            className="h-full bg-emerald-500 transition-all duration-150"
            style={{ width: `${enabled ? dutyCyclePercent : 0}%` }}
          />
        </div>
      </div>
    </div>
  );
}
