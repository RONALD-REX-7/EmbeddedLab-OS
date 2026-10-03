/**
 * EmbeddedLab OS — components/shared/progress-bar.tsx
 * Precision engineering progress indicator with segment ticks.
 */
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  barClassName?: string;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  className,
  barClassName,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(Math.round((value / max) * 100), 0), 100);

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-[10px] font-mono">
          {label && <span className="text-muted-foreground uppercase tracking-wider">{label}</span>}
          {showPercentage && (
            <span className="text-foreground font-bold ml-auto">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-1.5 w-full rounded-sm bg-[var(--surface-sunken)] overflow-hidden border border-[var(--border-subtle)] relative">
        <div
          className={cn(
            "h-full bg-primary transition-[width] duration-500 ease-out rounded-sm",
            percentage >= 100 && "bg-emerald-500",
            barClassName
          )}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
