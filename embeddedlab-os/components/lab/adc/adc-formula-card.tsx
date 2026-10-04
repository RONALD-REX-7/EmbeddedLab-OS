/**
 * EmbeddedLab OS — components/lab/adc/adc-formula-card.tsx
 * Educational ADC Formula breakdown with step-by-step computation.
 * ADC_raw = round((Vin / Vref) * (2^N - 1))
 */
import type { ADCDerivedValues, AnalogChannel } from "@/types/simulator";

interface ADCFormulaCardProps {
  channel: AnalogChannel;
  derived: ADCDerivedValues;
}

export function ADCFormulaCard({ channel, derived }: ADCFormulaCardProps) {
  const { inputVoltage, referenceVoltage, resolution } = channel;
  const { digitalValue, maxDigitalValue, lsbMillivolts, quantizationErrorPercent } = derived;

  const hexVal = `0x${digitalValue.toString(16).toUpperCase().padStart(4, "0")}`;
  const binVal = `0b${digitalValue.toString(2).padStart(resolution, "0")}`;

  return (
    <div className="rounded border border-[var(--border-default)] bg-[var(--surface-panel)] p-3 space-y-2.5 font-mono text-xs select-none">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
        <span className="font-bold text-foreground text-[10px] uppercase tracking-wider">ADC CONVERSION FORMULA</span>
        <span className="text-primary font-bold text-[10px]">{resolution}-bit</span>
      </div>

      {/* Formula computation */}
      <div className="bg-[var(--surface-sunken)] p-2.5 rounded border border-[var(--border-subtle)] space-y-1 leading-relaxed shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]">
        <p className="text-[10px] text-muted-foreground">
          <span className="text-foreground font-bold">Formula:</span> ADC_raw = round( (Vin / Vref) × (2^N − 1) )
        </p>

        <p className="text-[10px] text-foreground pt-0.5">
          <span className="text-muted-foreground">Subst.:</span> round( ({inputVoltage.toFixed(2)} / {referenceVoltage.toFixed(1)}) × {maxDigitalValue} )
        </p>

        <p className="text-emerald-800 dark:text-emerald-300 font-bold text-[11px] pt-1 border-t border-[var(--border-subtle)]/50">
          Result: ADC_raw = {digitalValue} / {maxDigitalValue} ({((digitalValue / maxDigitalValue) * 100).toFixed(1)}%)
        </p>
      </div>

      {/* Multi-format representation */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] p-2">
          <span className="text-[8px] text-muted-foreground block uppercase tracking-wider font-bold">DEC</span>
          <span className="font-bold text-foreground text-[11px]">{digitalValue}</span>
        </div>
        <div className="rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] p-2">
          <span className="text-[8px] text-muted-foreground block uppercase tracking-wider font-bold">HEX</span>
          <span className="font-bold text-primary text-[11px]">{hexVal}</span>
        </div>
        <div className="rounded bg-[var(--surface-sunken)] border border-[var(--border-subtle)] p-2 truncate">
          <span className="text-[8px] text-muted-foreground block uppercase tracking-wider font-bold">BIN</span>
          <span className="font-bold text-emerald-800 dark:text-emerald-300 text-[9px]">{binVal}</span>
        </div>
      </div>

      {/* Technical metrics */}
      <div className="flex justify-between items-center text-[9px] text-muted-foreground font-bold uppercase tracking-wider">
        <span>LSB: <span className="text-foreground">{lsbMillivolts.toFixed(3)} mV</span></span>
        <span>Q-Error: <span className="text-foreground">±{quantizationErrorPercent.toFixed(2)}%</span></span>
      </div>
    </div>
  );
}
