/**
 * EmbeddedLab OS — components/shared/metric-card.tsx
 * Precision benchtop instrumentation readout bezel for engineering values.
 */
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  subtext?: string;
  signalState?: "high" | "low" | "float" | "pulse" | "normal";
  icon?: React.ElementType;
  className?: string;
}

export function MetricCard({
  label,
  value,
  unit,
  subtext,
  signalState = "normal",
  icon: Icon,
  className,
}: MetricCardProps) {
  const signalStyles = {
    normal: { text: "text-foreground", dot: "bg-muted-foreground/40", border: "border-border" },
    high:   { text: "text-[var(--signal-high)]", dot: "bg-[var(--signal-high)] shadow-[0_0_6px_rgba(16,185,129,0.5)]", border: "border-[var(--signal-high)]/30" },
    low:    { text: "text-muted-foreground", dot: "bg-slate-600", border: "border-border" },
    float:  { text: "text-[var(--signal-float)]", dot: "bg-[var(--signal-float)] shadow-[0_0_6px_rgba(245,158,11,0.5)]", border: "border-[var(--signal-float)]/30" },
    pulse:  { text: "text-[var(--signal-pulse)]", dot: "bg-[var(--signal-pulse)] shadow-[0_0_6px_rgba(56,189,248,0.5)]", border: "border-[var(--signal-pulse)]/30" },
  };

  const style = signalStyles[signalState] || signalStyles.normal;

  return (
    <div
      className={cn(
        "rounded border bg-[var(--surface-sunken)] p-2.5 flex flex-col justify-between relative select-none",
        style.border,
        className
      )}
    >
      <div className="flex items-center justify-between gap-1.5 mb-1">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", style.dot)} />
          <span className="text-[10px] font-mono font-medium text-muted-foreground uppercase tracking-wider truncate">
            {label}
          </span>
        </div>
        {Icon && <Icon className="h-3 w-3 text-muted-foreground/60 shrink-0" />}
      </div>

      <div className="flex items-baseline gap-1 pt-0.5">
        <span className={cn("text-base font-mono font-bold tracking-tight", style.text)}>
          {value}
        </span>
        {unit && (
          <span className="text-[10px] font-mono text-muted-foreground font-semibold uppercase">
            {unit}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[9px] font-mono text-muted-foreground/70 mt-1 truncate border-t border-border/40 pt-0.5">
          {subtext}
        </p>
      )}
    </div>
  );
}
