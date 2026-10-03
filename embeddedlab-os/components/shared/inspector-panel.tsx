/**
 * EmbeddedLab OS — components/shared/inspector-panel.tsx
 * Precision Register & Configuration Inspector.
 */
import { Sliders } from "lucide-react";
import { cn } from "@/lib/utils";

interface InspectorRowProps {
  label: string;
  value: React.ReactNode;
  unit?: string;
  code?: boolean;
}

export function InspectorRow({ label, value, unit, code = true }: InspectorRowProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)]/50 text-xs group">
      <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-wider">{label}</span>
      <div className="flex items-baseline gap-1">
        <span className={cn(
          "font-mono font-bold text-foreground transition-colors",
          code && "text-[11px]"
        )}>
          {value}
        </span>
        {unit && <span className="font-mono text-[9px] text-muted-foreground/70 uppercase">{unit}</span>}
      </div>
    </div>
  );
}

interface InspectorPanelProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function InspectorPanel({
  title = "Inspector",
  subtitle = "Configuration & State",
  children,
  className,
}: InspectorPanelProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-[var(--border-default)] bg-[var(--surface-panel)] p-3.5 space-y-3 flex flex-col shadow-[0_2px_8px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      <div className="flex items-center gap-2.5 border-b border-[var(--border-default)]/80 pb-2 select-none">
        <div className="w-5 h-5 rounded bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Sliders className="h-3 w-3 text-primary" strokeWidth={2} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
            {title}
          </h3>
          <p className="text-[9px] text-muted-foreground font-mono">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-0.5 flex-1 overflow-auto">{children}</div>
    </div>
  );
}
