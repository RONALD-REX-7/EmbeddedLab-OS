/**
 * EmbeddedLab OS — components/lab/pwm/waveform-visualizer.tsx
 * Dynamic oscilloscope-style SVG waveform visualizer for PWM pulse train.
 * Precision engineering oscilloscope frame with dual-theme light/dark calibration.
 */
import { cn } from "@/lib/utils";
import type { PWMChannel, PWMDerivedValues } from "@/types/simulator";

interface WaveformVisualizerProps {
  channel: PWMChannel;
  derived: PWMDerivedValues;
  className?: string;
}

export function WaveformVisualizer({
  channel,
  derived,
  className,
}: WaveformVisualizerProps) {
  const { dutyCyclePercent, enabled, frequencyHz } = channel;
  const { periodMs, highTimeMs, lowTimeMs } = derived;

  const minCycles = 2;
  const maxCycles = 12;
  const cycles = Math.min(
    maxCycles,
    Math.max(minCycles, Math.round(2 + (Math.log10(frequencyHz / 100) / Math.log10(100)) * 10))
  );

  const width = 600;
  const height = 140;
  const paddingY = 24;
  const yHigh = paddingY;
  const yLow = height - paddingY;
  const cycleWidth = width / cycles;

  const dutyRatio = enabled ? Math.max(0, Math.min(100, dutyCyclePercent)) / 100 : 0;
  const highWidth = cycleWidth * dutyRatio;

  let pathD = "";
  for (let i = 0; i < cycles; i++) {
    const xStart = i * cycleWidth;
    const xHighEnd = xStart + highWidth;
    const xEnd = xStart + cycleWidth;

    if (i === 0) {
      pathD += `M ${xStart} ${yLow} `;
    }

    if (dutyRatio > 0 && dutyRatio < 1) {
      pathD += `L ${xStart} ${yHigh} `;
      pathD += `L ${xHighEnd} ${yHigh} `;
      pathD += `L ${xHighEnd} ${yLow} `;
    } else if (dutyRatio >= 1) {
      pathD += `L ${xStart} ${yHigh} L ${xEnd} ${yHigh} `;
      continue;
    }

    pathD += `L ${xEnd} ${yLow} `;
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-border/80 bg-surface-sunken p-3.5 font-mono shadow-2xs select-none transition-colors",
        className
      )}
    >
      {/* Oscilloscope Header Telemetry Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground mb-2 px-0.5">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              enabled ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" : "bg-muted-foreground/60"
            )}
          />
          <span className="font-bold text-foreground uppercase tracking-wider">OSCILLOSCOPE · CH1</span>
          <span className="text-muted-foreground">
            {frequencyHz.toLocaleString()} Hz · {periodMs.toFixed(2)} ms · {cycles} cyc
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            t_HIGH: {highTimeMs.toFixed(3)} ms
          </span>
          <span className="text-muted-foreground">
            t_LOW: {lowTimeMs.toFixed(3)} ms
          </span>
        </div>
      </div>

      {/* SVG Waveform Scope Well */}
      <div className="relative border border-border/80 rounded-md bg-surface-console overflow-hidden">
        {/* Voltage Reference Labels */}
        <div className="absolute left-2 top-1.5 text-[8px] font-mono font-bold text-emerald-600 dark:text-emerald-400 z-10">
          3.3V
        </div>
        <div className="absolute left-2 bottom-1.5 text-[8px] font-mono font-bold text-muted-foreground z-10">
          GND
        </div>

        {/* Engineering Oscilloscope Grid */}
        <div className="absolute inset-0 bg-oscilloscope-grid opacity-35 pointer-events-none" />

        <svg
          role="img"
          aria-label={`PWM waveform for ${channel.label}: frequency ${frequencyHz} Hz, duty cycle ${dutyCyclePercent} percent, period ${periodMs.toFixed(2)} ms`}
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-28 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Center Voltage Baseline */}
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="var(--primary)"
            strokeDasharray="4 4"
            strokeWidth="1"
            opacity="0.25"
          />

          {/* 3.3V Reference Line */}
          <line
            x1="0"
            y1={yHigh}
            x2={width}
            y2={yHigh}
            stroke="var(--signal-high)"
            strokeDasharray="2 4"
            strokeWidth="0.75"
            opacity="0.3"
          />

          {/* GND Reference Line */}
          <line
            x1="0"
            y1={yLow}
            x2={width}
            y2={yLow}
            stroke="var(--signal-low)"
            strokeDasharray="2 4"
            strokeWidth="0.75"
            opacity="0.3"
          />

          {/* Signal Waveform Path */}
          <path
            d={pathD}
            fill="none"
            stroke={enabled && dutyCyclePercent > 0 ? "var(--signal-high)" : "var(--signal-low)"}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            className="transition-all duration-150"
          />
        </svg>
      </div>

      {/* Scope Measurement Footer */}
      <div className="flex items-center justify-between text-[9px] text-muted-foreground mt-2 px-0.5 font-bold uppercase tracking-wider">
        <span>D = <span className="text-foreground">{dutyCyclePercent}%</span></span>
        <span>f = <span className="text-foreground">{frequencyHz.toLocaleString()} Hz</span></span>
        <span>V_avg = <span className="text-foreground">{(3.3 * dutyCyclePercent / 100).toFixed(2)}V</span></span>
        <span className={enabled ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}>
          {enabled ? "● ACTIVE" : "○ DISABLED"}
        </span>
      </div>
    </div>
  );
}
