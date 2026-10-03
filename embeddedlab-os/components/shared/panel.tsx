/**
 * EmbeddedLab OS — components/shared/panel.tsx
 * Precision engineering laboratory panel container with header, actions, and multiple material morphisms.
 */
import { cn } from "@/lib/utils";

interface PanelProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ElementType;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  variant?: "default" | "instrument" | "sunken" | "elevated";
  /** Optional telemetry label displayed in header right */
  telemetryTag?: string;
}

export function Panel({
  title,
  subtitle,
  icon: Icon,
  actions,
  children,
  className,
  headerClassName,
  bodyClassName,
  variant = "instrument",
  telemetryTag,
}: PanelProps) {
  const variantStyles = {
    default:    "bg-card border-border shadow-sm",
    instrument: "bg-[var(--surface-panel)] border-[var(--border-default)] shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
    sunken:     "bg-[var(--surface-sunken)] border-[var(--border-subtle)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]",
    elevated:   "bg-[var(--surface-elevated)] border-[var(--border-default)] shadow-[0_4px_12px_rgba(0,0,0,0.35)]",
  };

  return (
    <div
      className={cn(
        "rounded-md border flex flex-col overflow-hidden relative",
        variantStyles[variant],
        className
      )}
    >
      {/* Corner calibration tick marks for engineering aesthetic */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-primary/40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-primary/40 pointer-events-none" />

      {(title || actions || telemetryTag) && (
        <div
          className={cn(
            "flex items-center justify-between px-3.5 py-2 border-b border-[var(--border-default)]/80 bg-[var(--surface-base)]/80 shrink-0 select-none",
            headerClassName
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Icon className="h-3 w-3 text-primary" strokeWidth={2} aria-hidden="true" />
              </div>
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-foreground truncate flex items-center gap-1.5">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[10px] text-muted-foreground font-mono truncate leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {telemetryTag && (
              <span className="text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded bg-muted/40 border border-border text-muted-foreground uppercase tracking-wider">
                {telemetryTag}
              </span>
            )}
            {actions}
          </div>
        </div>
      )}

      <div className={cn("p-4 flex-1 min-h-0 overflow-auto", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
