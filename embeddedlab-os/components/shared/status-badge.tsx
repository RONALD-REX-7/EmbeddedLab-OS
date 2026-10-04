/**
 * EmbeddedLab OS — components/shared/status-badge.tsx
 * Compact engineering system status indicator with LED-dot feedback.
 */
import { cn } from "@/lib/utils";

export type StatusType =
  | "idle"
  | "running"
  | "complete"
  | "error"
  | "coming-soon"
  | "demo"
  | "active"
  | "not-started";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const STATUS_CONFIG: Record<
  StatusType,
  { label: string; dot: string; border: string; text: string; bg: string }
> = {
  idle:          { label: "IDLE",       dot: "bg-slate-500",     border: "border-slate-300 dark:border-slate-700",         text: "text-slate-700 dark:text-slate-300",       bg: "bg-slate-100 dark:bg-slate-900/50" },
  running:       { label: "RUNNING",    dot: "bg-sky-500 dark:bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.7)] animate-pulse", border: "border-sky-600/30 dark:border-sky-500/30", text: "text-sky-800 dark:text-sky-300", bg: "bg-sky-500/10" },
  complete:      { label: "COMPLETE",   dot: "bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]", border: "border-emerald-600/30 dark:border-emerald-500/30", text: "text-emerald-800 dark:text-emerald-300", bg: "bg-emerald-500/10" },
  error:         { label: "ERROR",      dot: "bg-red-600 dark:bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.7)]",     border: "border-red-600/30 dark:border-red-500/30",     text: "text-red-800 dark:text-red-300",     bg: "bg-red-500/10" },
  "coming-soon": { label: "PENDING",    dot: "bg-amber-600 dark:bg-amber-400",    border: "border-amber-600/30 dark:border-amber-500/30",      text: "text-amber-800 dark:text-amber-300",       bg: "bg-amber-500/10" },
  demo:          { label: "DEMO",       dot: "bg-amber-600 dark:bg-amber-400",    border: "border-amber-600/30 dark:border-amber-500/30",      text: "text-amber-800 dark:text-amber-300",       bg: "bg-amber-500/10" },
  active:        { label: "ACTIVE",     dot: "bg-emerald-600 dark:bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.7)]", border: "border-emerald-600/30 dark:border-emerald-500/30", text: "text-emerald-800 dark:text-emerald-300", bg: "bg-emerald-500/10" },
  "not-started": { label: "STANDBY",    dot: "bg-slate-500",    border: "border-slate-300 dark:border-slate-700",         text: "text-slate-700 dark:text-slate-300",       bg: "bg-slate-100 dark:bg-slate-900/50" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 text-[10px] font-mono font-bold tracking-wider uppercase select-none",
        config.bg,
        config.border,
        config.text,
        className
      )}
      aria-label={`Status: ${config.label}`}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full shrink-0", config.dot)}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
