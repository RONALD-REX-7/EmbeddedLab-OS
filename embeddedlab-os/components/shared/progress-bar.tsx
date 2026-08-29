/**
 * EmbeddedLab OS — components/shared/progress-bar.tsx
 * High-contrast technical progress bar component.
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
    <div className={cn("space-y-1.5", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-mono">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showPercentage && (
            <span className="text-foreground font-medium ml-auto">{percentage}%</span>
          )}
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-muted/40 overflow-hidden border border-border/50">
        <div
          className={cn("h-full bg-primary transition-all duration-300 rounded-full", barClassName)}
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
