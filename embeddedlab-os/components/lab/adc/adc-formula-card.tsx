/**
 * EmbeddedLab OS — components/lab/adc/adc-formula-card.tsx
 * Educational ADC Formula breakdown displaying step-by-step calculations.
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
    <div className="rounded-lg border border-border bg-card p-4 space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <span className="font-semibold text-foreground">ADC CONVERSION FORMULA</span>
        <span className="text-primary font-bold">{resolution}-bit Resolution</span>
      </div>

      {/* Formula substitution breakdown */}
      <div className="bg-[var(--surface-sunken)] p-3 rounded border border-border/80 space-y-1.5 leading-relaxed">
        <p className="text-muted-foreground text-[11px]">
          <span className="text-foreground font-bold">Formula:</span> ADC_raw = round( (Vin / Vref) × (2^N − 1) )
        </p>

        <p className="text-foreground text-[11px] pt-1">
          <span className="text-muted-foreground">Substitution:</span> round( ({inputVoltage.toFixed(2)}V / {referenceVoltage.toFixed(1)}V) × {maxDigitalValue} )
        </p>

        <p className="text-[var(--signal-high)] font-bold text-xs pt-1 border-t border-border/40">
          Result: ADC_raw = {digitalValue} / {maxDigitalValue} ({((digitalValue / maxDigitalValue) * 100).toFixed(1)}%)
        </p>
      </div>

      {/* Multi-format representation (Dec, Hex, Bin) */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="rounded bg-muted/20 border border-border p-2">
          <span className="text-[10px] text-muted-foreground block">DECIMAL</span>
          <span className="font-bold text-foreground">{digitalValue}</span>
        </div>
        <div className="rounded bg-muted/20 border border-border p-2">
          <span className="text-[10px] text-muted-foreground block">HEXADECIMAL</span>
          <span className="font-bold text-primary">{hexVal}</span>
        </div>
        <div className="rounded bg-muted/20 border border-border p-2 truncate">
          <span className="text-[10px] text-muted-foreground block">BINARY</span>
          <span className="font-bold text-[var(--signal-high)] text-[10px]">{binVal}</span>
        </div>
      </div>

      {/* Technical metrics */}
      <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-1">
        <span>LSB Size: <strong className="text-foreground">{lsbMillivolts.toFixed(3)} mV</strong></span>
        <span>Quant. Error: <strong className="text-foreground">±{quantizationErrorPercent.toFixed(2)}%</strong></span>
      </div>
    </div>
  );
}
