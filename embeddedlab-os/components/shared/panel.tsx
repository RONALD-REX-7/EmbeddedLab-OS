/**
 * EmbeddedLab OS — components/shared/panel.tsx
 * Reusable engineering laboratory panel container with header, actions, and borders.
 * Fits the dark-first IDE/instrument aesthetic.
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
  /** Sunken/darker background for data logs or oscilloscope frames */
  variant?: "default" | "sunken" | "elevated";
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
  variant = "default",
}: PanelProps) {
  const variantStyles = {
    default:  "bg-card border-border",
    sunken:   "bg-[var(--surface-sunken)] border-border",
    elevated: "bg-[var(--surface-elevated)] border-border",
  };

  return (
    <div
      className={cn(
        "rounded-lg border flex flex-col overflow-hidden",
        variantStyles[variant],
        className
      )}
    >
      {(title || actions) && (
        <div
          className={cn(
            "flex items-center justify-between px-4 py-2.5 border-b border-border/80 bg-muted/20 shrink-0 select-none",
            headerClassName
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {Icon && (
              <Icon
                className="h-4 w-4 text-primary shrink-0"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            )}
            <div className="min-w-0">
              {title && (
                <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground truncate">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-muted-foreground truncate leading-tight">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={cn("p-4 flex-1 min-h-0 overflow-auto", bodyClassName)}>
        {children}
      </div>
    </div>
  );
}
