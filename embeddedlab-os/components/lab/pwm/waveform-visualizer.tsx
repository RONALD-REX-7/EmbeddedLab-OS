/**
 * EmbeddedLab OS — components/lab/pwm/waveform-visualizer.tsx
 * Dynamic oscilloscope-style SVG waveform visualizer for PWM pulse train.
 *
 * Dynamically scales:
 * 1. Cycle density (higher frequency = more pulses across viewport).
 * 2. High-time pulse width (duty cycle % controls HIGH plateau ratio).
 * 3. Color & muted state.
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

  // Calculate dynamic cycle count based on frequency (100 Hz -> 2 cycles, 10,000 Hz -> 12 cycles)
  // Ensures higher frequencies look visibly denser on screen!
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

  // Duty ratio (0.0 to 1.0)
  const dutyRatio = enabled ? Math.max(0, Math.min(100, dutyCyclePercent)) / 100 : 0;
  const highWidth = cycleWidth * dutyRatio;

  // Build SVG path string for square wave
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
        "rounded-md border border-border bg-[var(--surface-sunken)] p-3 font-mono",
        className
      )}
    >
      {/* Header telemetry info */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground mb-2 px-1 select-none">
        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", enabled ? "bg-[var(--signal-high)] animate-pulse" : "bg-muted-foreground")} />
          <span className="font-semibold text-foreground">OSCILLOSCOPE CH1</span>
          <span className="text-[11px] text-muted-foreground">
            ({frequencyHz} Hz · {periodMs.toFixed(2)} ms period · {cycles} cycles shown)
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-[var(--signal-high)]">
            T_HIGH: {highTimeMs.toFixed(3)} ms ({dutyCyclePercent}%)
          </span>
          <span className="text-muted-foreground">
            T_LOW: {lowTimeMs.toFixed(3)} ms
          </span>
        </div>
      </div>

      {/* SVG Waveform Frame */}
      <div className="relative border border-border/60 rounded bg-black/50 overflow-hidden p-1">
        {/* Voltage Reference Markers */}
        <div className="absolute left-2 top-2 text-[9px] font-mono text-emerald-400/80 z-10">
          3.3V (HIGH)
        </div>
        <div className="absolute left-2 bottom-2 text-[9px] font-mono text-slate-500 z-10">
          0.0V (LOW)
        </div>

        {/* Oscilloscope Grid background lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-50 pointer-events-none" />

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-32 overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Center Voltage Baseline Line */}
          <line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke="#1e293b"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* 3.3V High Reference Line */}
          <line
            x1="0"
            y1={yHigh}
            x2={width}
            y2={yHigh}
            stroke="#059669"
            strokeDasharray="2 4"
            strokeWidth="0.75"
            opacity="0.3"
          />

          {/* Signal Waveform Path */}
          <path
            d={pathD}
            fill="none"
            stroke={enabled && dutyCyclePercent > 0 ? "#22c55e" : "#4a5878"}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="square"
            className="transition-all duration-200"
          />
        </svg>
      </div>

      {/* Footer readout */}
      <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2 px-1">
        <span>Duty Cycle: <strong className="text-foreground">{dutyCyclePercent}%</strong></span>
        <span>Frequency: <strong className="text-foreground">{frequencyHz} Hz</strong></span>
        <span>Output Status: <strong className={enabled ? "text-success" : "text-muted-foreground"}>{enabled ? "ACTIVE WAVEFORM" : "MUTED"}</strong></span>
      </div>
    </div>
  );
}
