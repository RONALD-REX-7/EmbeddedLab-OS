/**
 * EmbeddedLab OS — components/marketing/interactive-hero-demo.tsx
 * Live, interactive engineering simulation preview widget embedded in the marketing hero.
 * Demonstrates real calculation engines: PWM waveform, ADC quantization, and GPIO actuation.
 */
"use client";

import * as React from "react";
import { Activity, BarChart2, Cpu, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type DemoMode = "pwm" | "adc" | "gpio";

export function InteractiveHeroDemo() {
  const [mode, setMode] = React.useState<DemoMode>("pwm");

  // PWM State
  const [dutyCycle, setDutyCycle] = React.useState<number>(65);
  const [frequencyHz, setFrequencyHz] = React.useState<number>(2000);

  // ADC State
  const [voltage, setVoltage] = React.useState<number>(2.14);

  // GPIO State
  const [buttonPressed, setButtonPressed] = React.useState<boolean>(false);
  const [pinMode, setPinMode] = React.useState<"OUTPUT" | "INPUT_PULLUP">("OUTPUT");
  const [pinHigh, setPinHigh] = React.useState<boolean>(true);

  // Calculations
  // PWM: Period T = 1/f (us), T_high = T * duty
  const periodUs = Math.round((1 / frequencyHz) * 1_000_000);
  const highUs = Math.round(periodUs * (dutyCycle / 100));
  const lowUs = periodUs - highUs;

  // ADC: 12-bit, Vref = 3.30V
  const adcMaxCode = 4095;
  const rawCode = Math.min(adcMaxCode, Math.round((Math.max(0, voltage) / 3.3) * adcMaxCode));
  const hexCode = "0x" + rawCode.toString(16).toUpperCase().padStart(3, "0");
  const stepSizeMv = ((3.3 / adcMaxCode) * 1000).toFixed(2);
  const reconstructedV = ((rawCode / adcMaxCode) * 3.3).toFixed(3);
  const quantizationErrorMv = (Math.abs(voltage - parseFloat(reconstructedV)) * 1000).toFixed(2);

  // GPIO: LED state
  const ledOn = pinMode === "OUTPUT" ? pinHigh : buttonPressed;

  return (
    <div className="w-full max-w-4xl mx-auto rounded-xl border border-border/80 bg-surface-panel shadow-sm dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-hidden transition-all text-left">
      {/* Instrument Bezel Top Ribbon */}
      <div className="h-10 px-4 bg-surface-subtle border-b border-border/70 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400/80 border border-red-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 border border-amber-500/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 border border-emerald-500/40" />
          </div>
          <span className="text-border/80 mx-1">|</span>
          <span className="font-mono text-[11px] font-semibold text-foreground flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-primary" />
            <span>INTERACTIVE TEST BENCH</span>
          </span>
          <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
            DETERMINISTIC SIM
          </span>
        </div>

        {/* 3-Mode Selector Tabs */}
        <div className="flex items-center p-0.5 rounded-md bg-surface-panel border border-border/70 font-mono text-[10px]">
          <button
            type="button"
            onClick={() => setMode("pwm")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer font-medium",
              mode === "pwm"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Activity className="h-3 w-3" />
            <span>PWM</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("adc")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer font-medium",
              mode === "adc"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart2 className="h-3 w-3" />
            <span>ADC</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("gpio")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded transition-colors cursor-pointer font-medium",
              mode === "gpio"
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Zap className="h-3 w-3" />
            <span>GPIO</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-panel">
        {/* Left Column: Visual Display / Trace / Instrument Well (7 cols) */}
        <div className="md:col-span-7 flex flex-col justify-between space-y-4">
          {mode === "pwm" && (
            <div className="rounded-lg border border-border/80 bg-surface-sunken p-3.5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-signal-pulse animate-pulse" />
                  DEMO SIGNAL · TIM1_CH1 (SYNTHETIC SQUARE WAVE)
                </span>
                <span className="text-primary font-bold">{frequencyHz.toLocaleString()} Hz</span>
              </div>

              {/* Oscilloscope Grid & Square Waveform SVG */}
              <div className="relative h-32 w-full rounded border border-border/70 bg-oscilloscope-grid bg-surface-console overflow-hidden flex items-center">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 100">
                  <defs>
                    <linearGradient id="pwmGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Draw 3 continuous PWM cycles */}
                  {Array.from({ length: 4 }).map((_, i) => {
                    const cycleWidth = 100;
                    const xStart = i * cycleWidth;
                    const highWidth = (dutyCycle / 100) * cycleWidth;
                    return (
                      <g key={i}>
                        <path
                          d={`M ${xStart} 80 L ${xStart} 20 L ${xStart + highWidth} 20 L ${xStart + highWidth} 80 L ${xStart + cycleWidth} 80`}
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <rect
                          x={xStart}
                          y={20}
                          width={highWidth}
                          height={60}
                          fill="url(#pwmGlow)"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Scope Timebase Legend Overlay */}
                <div className="absolute bottom-1.5 right-2 px-1.5 py-0.5 rounded bg-surface-panel/90 border border-border/60 text-[9px] font-mono text-muted-foreground">
                  Timebase: {Math.round(periodUs / 4)} µs/div
                </div>
              </div>

              {/* Mathematical breakdown */}
              <div className="grid grid-cols-3 gap-2 font-mono text-[10px] pt-1">
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[9px]">PERIOD (T)</span>
                  <span className="font-bold text-foreground">{periodUs} µs</span>
                </div>
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[9px]">T_HIGH</span>
                  <span className="font-bold text-primary">{highUs} µs</span>
                </div>
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[9px]">T_LOW</span>
                  <span className="font-bold text-muted-foreground">{lowUs} µs</span>
                </div>
              </div>
            </div>
          )}

          {mode === "adc" && (
            <div className="rounded-lg border border-border/80 bg-surface-sunken p-3.5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-signal-float animate-pulse" />
                  ADC1_IN0 (SAR CONVERTER)
                </span>
                <span className="text-primary font-bold">12-BIT RES</span>
              </div>

              {/* Visual Analog Meter Scale */}
              <div className="p-4 rounded border border-border/70 bg-surface-panel space-y-3">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="text-muted-foreground">ANALOG INPUT:</span>
                  <span className="font-bold text-lg text-primary">{voltage.toFixed(2)} V</span>
                </div>

                {/* Gauge bar with quantization steps */}
                <div className="relative h-6 w-full rounded bg-surface-sunken border border-border/80 overflow-hidden flex items-center">
                  <div
                    className="h-full bg-primary/20 border-r-2 border-primary transition-all duration-75 flex items-center justify-end pr-1.5"
                    style={{ width: `${(voltage / 3.3) * 100}%` }}
                  >
                    <span className="text-[9px] font-mono font-bold text-primary">
                      {Math.round((voltage / 3.3) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-muted-foreground">
                  <span>0.00 V (0x000)</span>
                  <span>1.65 V (0x800)</span>
                  <span>3.30 V (0xFFF)</span>
                </div>
              </div>

              {/* Quantization Metrics */}
              <div className="grid grid-cols-4 gap-1.5 font-mono text-[10px]">
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[8px]">RAW CODE</span>
                  <span className="font-bold text-foreground">{rawCode}</span>
                </div>
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[8px]">HEX CODE</span>
                  <span className="font-bold text-primary">{hexCode}</span>
                </div>
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[8px]">RESOLUTION</span>
                  <span className="font-bold text-muted-foreground">{stepSizeMv} mV</span>
                </div>
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[8px]">QUANT. ERR</span>
                  <span className="font-bold text-amber-500">{quantizationErrorMv} mV</span>
                </div>
              </div>
            </div>
          )}

          {mode === "gpio" && (
            <div className="rounded-lg border border-border/80 bg-surface-sunken p-3.5 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-signal-high animate-pulse" />
                  PORT A: PINS PA0 & PA5
                </span>
                <span className="text-emerald-500 font-bold">LOGIC 3.3V</span>
              </div>

              {/* Interactive Virtual Hardware Package */}
              <div className="p-4 rounded border border-border/70 bg-surface-panel flex items-center justify-around gap-4">
                {/* 5mm LED Package */}
                <div className="flex flex-col items-center gap-2">
                  <div className="relative flex items-center justify-center">
                    {ledOn && (
                      <div className="absolute w-12 h-12 rounded-full bg-emerald-500/25 blur-md animate-pulse" />
                    )}
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full border-2 transition-all duration-150 flex items-center justify-center relative overflow-hidden",
                        ledOn
                          ? "bg-emerald-500 border-emerald-300 shadow-[0_0_14px_rgba(16,185,129,0.8)]"
                          : "bg-surface-elevated border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-sm border transition-colors",
                          ledOn
                            ? "bg-emerald-200 border-white shadow-[0_0_6px_#ffffff]"
                            : "bg-surface-sunken border-border/60"
                        )}
                      />
                    </div>
                  </div>
                  <div className="text-center font-mono">
                    <span className="text-[10px] font-bold text-foreground block">LED PA5</span>
                    <span
                      className={cn(
                        "text-[9px] font-semibold px-1.5 py-0.2 rounded border",
                        ledOn
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-surface-subtle text-muted-foreground border-border/60"
                      )}
                    >
                      {ledOn ? "EMITTING (HIGH)" : "OFF (0V)"}
                    </span>
                  </div>
                </div>

                <div className="h-14 w-px bg-border/80" />

                {/* Tactile Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onMouseDown={() => setButtonPressed(true)}
                    onMouseUp={() => setButtonPressed(false)}
                    onTouchStart={() => setButtonPressed(true)}
                    onTouchEnd={() => setButtonPressed(false)}
                    className={cn(
                      "w-12 h-12 rounded-lg border flex items-center justify-center transition-all cursor-pointer font-mono font-bold text-[11px] select-none active:scale-95",
                      buttonPressed
                        ? "bg-primary text-primary-foreground border-primary shadow-inner scale-95"
                        : "bg-surface-elevated text-foreground border-border shadow-xs hover:border-primary/50"
                    )}
                  >
                    {buttonPressed ? "0 Ω" : "PA0"}
                  </button>
                  <div className="text-center font-mono">
                    <span className="text-[10px] font-bold text-foreground block">USER BUTTON</span>
                    <span className="text-[9px] text-muted-foreground">
                      {buttonPressed ? "CLOSED" : "PRESS & HOLD"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pin Register State */}
              <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[9px]">PA5 (ODR REGISTER)</span>
                  <span className="font-bold text-foreground">{pinHigh ? "1 (3.3V)" : "0 (0V)"}</span>
                </div>
                <div className="p-2 rounded bg-surface-panel border border-border/60">
                  <span className="text-muted-foreground block text-[9px]">PA0 (IDR REGISTER)</span>
                  <span className="font-bold text-primary">{buttonPressed ? "1 (HIGH)" : "0 (LOW)"}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Parameter Dials & Calculations (5 cols) */}
        <div className="md:col-span-5 flex flex-col justify-between space-y-4">
          {mode === "pwm" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Waveform Parameters
                </h2>
                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                  Real-time pulse width modulation generator with deterministic period timing.
                </p>
              </div>

              {/* Duty Cycle Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">DUTY CYCLE:</span>
                  <span className="font-bold text-primary">{dutyCycle}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="1"
                  value={dutyCycle}
                  onChange={(e) => setDutyCycle(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
                  aria-label="Adjust duty cycle"
                />
              </div>

              {/* Frequency Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">FREQUENCY:</span>
                  <span className="font-bold text-foreground">{frequencyHz} Hz</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="10000"
                  step="500"
                  value={frequencyHz}
                  onChange={(e) => setFrequencyHz(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
                  aria-label="Adjust frequency"
                />
              </div>

              {/* Preset buttons */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
                  Quick Presets:
                </span>
                <div className="flex gap-1.5">
                  {[
                    { label: "25%", duty: 25, freq: 1000 },
                    { label: "50%", duty: 50, freq: 2000 },
                    { label: "75%", duty: 75, freq: 5000 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setDutyCycle(preset.duty);
                        setFrequencyHz(preset.freq);
                      }}
                      className="flex-1 py-1 px-2 rounded border border-border/80 bg-surface-subtle text-[10px] font-mono hover:bg-surface-elevated hover:border-primary/40 cursor-pointer transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {mode === "adc" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  SAR Analog Voltage Dial
                </h2>
                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                  Successive approximation register quantizing continuous analog voltage into discrete 12-bit binary codes.
                </p>
              </div>

              {/* Voltage Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-muted-foreground">TERMINAL VOLTAGE:</span>
                  <span className="font-bold text-primary">{voltage.toFixed(2)} V</span>
                </div>
                <input
                  type="range"
                  min="0.00"
                  max="3.30"
                  step="0.02"
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
                  aria-label="Adjust analog voltage"
                />
              </div>

              {/* Precision Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
                  Calibration Levels:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "0.825V (¼)", v: 0.825 },
                    { label: "1.650V (½)", v: 1.65 },
                    { label: "2.475V (¾)", v: 2.475 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setVoltage(preset.v)}
                      className="py-1 px-1.5 rounded border border-border/80 bg-surface-subtle text-[9px] font-mono hover:bg-surface-elevated hover:border-primary/40 cursor-pointer transition-colors text-center"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantization Formula Display */}
              <div className="p-2.5 rounded bg-surface-subtle border border-border/70 font-mono text-[10px] space-y-1">
                <span className="text-muted-foreground block text-[9px]">TRANSFER FORMULA</span>
                <code className="text-primary font-semibold block">
                  Code = ⌊({voltage.toFixed(2)}V / 3.3V) × 4095⌋ = {rawCode}
                </code>
              </div>
            </div>
          )}

          {mode === "gpio" && (
            <div className="space-y-4">
              <div>
                <h2 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider mb-1">
                  Digital Pin Controller
                </h2>
                <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
                  Direct register manipulation for push-pull outputs and pull-up input sensing.
                </p>
              </div>

              {/* PA5 Mode Toggle */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
                  Pin Mode (MODER5):
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPinMode("OUTPUT")}
                    className={cn(
                      "flex-1 py-1 px-2 rounded border text-[10px] font-mono font-medium transition-colors cursor-pointer",
                      pinMode === "OUTPUT"
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-surface-subtle border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    OUTPUT (PUSH-PULL)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinMode("INPUT_PULLUP")}
                    className={cn(
                      "flex-1 py-1 px-2 rounded border text-[10px] font-mono font-medium transition-colors cursor-pointer",
                      pinMode === "INPUT_PULLUP"
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-surface-subtle border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    INPUT (BUTTON SYNC)
                  </button>
                </div>
              </div>

              {/* PA5 Toggle */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-muted-foreground uppercase font-semibold">
                  LED Output Driver (ODR5):
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPinHigh(false)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded border text-xs font-mono font-medium transition-colors cursor-pointer",
                      !pinHigh
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-surface-subtle border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    LOW (0V)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinHigh(true)}
                    className={cn(
                      "flex-1 py-1.5 px-2 rounded border text-xs font-mono font-medium transition-colors cursor-pointer",
                      pinHigh
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                        : "bg-surface-subtle border-border/80 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    HIGH (3.3V)
                  </button>
                </div>
              </div>

              {/* Direct Circuit Note */}
              <div className="p-2.5 rounded bg-surface-subtle border border-border/70 font-mono text-[10px] space-y-1">
                <span className="text-muted-foreground block text-[9px]">CIRCUIT SCHEMATIC</span>
                <span className="text-foreground text-[10px]">
                  PA5 → 220Ω Resistor → Green LED → GND
                </span>
              </div>
            </div>
          )}

          {/* Quick Deep Link to Full Workstation */}
          <div className="pt-2 border-t border-border/70 flex items-center justify-between text-[11px] font-mono">
            <span className="text-muted-foreground">Full Lab Features Active</span>
            <a
              href={`/labs/${mode}`}
              className="text-primary hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Launch {mode.toUpperCase()} Lab</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
