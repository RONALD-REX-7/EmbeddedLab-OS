/**
 * EmbeddedLab OS — components/shared/metric-card.tsx
 * High-density technical metric card for engineering readouts.
 */
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  subtext?: string;
  signalState?: "high" | "low" | "float" | "normal";
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
  const signalColors = {
    normal: "text-foreground",
    high:   "text-[var(--signal-high)] font-semibold",
    low:    "text-[var(--signal-low)]",
    float:  "text-[var(--signal-float)]",
  };

  return (
    <div
      className={cn(
        "rounded-md border border-border bg-card p-3 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider truncate">
          {label}
        </span>
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" />}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className={cn("text-lg font-mono tracking-tight", signalColors[signalState])}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-muted-foreground font-normal">
            {unit}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[10px] text-muted-foreground mt-1 truncate">
          {subtext}
        </p>
      )}
    </div>
  );
}
