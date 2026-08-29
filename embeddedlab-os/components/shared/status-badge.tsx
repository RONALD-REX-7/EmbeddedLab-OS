/**
 * EmbeddedLab OS — components/shared/status-badge.tsx
 * Reusable status indicator badge.
 * Used by lab cards, lab placeholders, and the dashboard.
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
  { label: string; dot: string; text: string; bg: string }
> = {
  idle:        { label: "Idle",        dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted/30" },
  running:     { label: "Running",     dot: "bg-[var(--feedback-info)]",    text: "text-[var(--feedback-info)]",    bg: "bg-[var(--feedback-info)]/10" },
  complete:    { label: "Complete",    dot: "bg-[var(--feedback-success)]", text: "text-[var(--feedback-success)]", bg: "bg-[var(--feedback-success)]/10" },
  error:       { label: "Error",       dot: "bg-[var(--feedback-error)]",   text: "text-[var(--feedback-error)]",   bg: "bg-[var(--feedback-error)]/10" },
  "coming-soon": { label: "Coming Soon", dot: "bg-[var(--feedback-warning)]", text: "text-[var(--feedback-warning)]", bg: "bg-[var(--feedback-warning)]/10" },
  demo:        { label: "Demo Mode",   dot: "bg-[var(--feedback-info)]",    text: "text-[var(--feedback-info)]",    bg: "bg-[var(--feedback-info)]/10" },
  active:      { label: "Available",   dot: "bg-[var(--feedback-success)]", text: "text-[var(--feedback-success)]", bg: "bg-[var(--feedback-success)]/10" },
  "not-started": { label: "Not Started", dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted/30" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded px-2 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className
      )}
      aria-label={`Status: ${config.label}`}
    >
      <span
        className={cn("status-dot", config.dot)}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
